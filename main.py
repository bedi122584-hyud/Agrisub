from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import openai
from supabase import create_client
from uuid import uuid4
from typing import Any, Dict
from datetime import datetime, timedelta
import traceback

app = FastAPI()
# === CORS (si ton frontend tourne sur d’autres ports) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === CONFIGURATION ===
OPENAI_API_KEY   = "REMOVED"
SUPABASE_URL     = "https://gwznesrrbmgmymulzbqd.supabase.co"
SUPABASE_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3em5lc3JyYm1nbXltdWx6YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODkyMzYsImV4cCI6MjA2MzA2NTIzNn0.IXAXvaGrGhSBi6dnoVYBD-3udtnw9PaWhuEOp2lwbAY"

# Initialisation des clients
openai.api_key = OPENAI_API_KEY
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    return "\n".join(page.get_text() for page in doc)

def summarize_with_chatgpt(text: str) -> str:
    system_prompt = (
        "Tu es un expert en analyse d'appels à projets agricoles. Génère un résumé STRUCTURÉ en français descriptif et compréhensif pour des personnes peu instruites avec ces sections :\n"
        "Titre: [Nom officiel de l'opportunité]\n"
        "Type: [Subvention/Concours/Formation/Projet/IA]\n"
        "Organisateur: [Organisme porteur]\n"
        "Objectif: [But principal en 3 phrases]\n"
        "Bénéficiaires: [Public éligible et détail d'éligibilité]\n"
        "Date limite: [DD/MM/YYYY]\n"
        "Montant: [Budget ou fourchette]\n"
        "Durée: [Délai de réalisation]\n"
        "Secteur: [Domaine agricole concerné]\n"
        "Localisation: [Zone géographique]\n"
        "Avantages: [Liste à puces des points forts]\n"
        "Documents requis: [Liste à puces des pièces nécessaires]"
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-1106",
            temperature=0.2,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text[:6000]}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur OpenAI: {str(e)}")

def parse_summary(summary: str) -> Dict[str, Any]:
    parsed = {}
    current_key = None
    key_mapping = {
        "type": ["type", "catégorie"],
        "organisateur": ["organisateur", "porteur"],
        "date limite": ["date limite", "échéance"],
        "durée": ["durée", "délai"],
        "localisation": ["localisation", "zone"]
    }
    for line in summary.split("\n"):
        if ":" in line:
            key_part, value_part = line.split(":", 1)
            key = key_part.strip().lower()
            value = value_part.strip()
            for main_key, aliases in key_mapping.items():
                if any(alias in key for alias in aliases):
                    key = main_key
                    break
            parsed[key] = value
            current_key = key
        elif current_key and line.strip():
            parsed[current_key] += " " + line.strip()
    return parsed

def format_deadline(date_str: str) -> str:
    formats = ["%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%d %B %Y", "%B %d, %Y"]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.isoformat()
        except ValueError:
            continue
    return (datetime.utcnow() + timedelta(days=30)).isoformat()

@app.post("/upload-opportunity")
async def upload_opportunity(pdf: UploadFile = File(...)) -> Dict[str, Any]:
    try:
        content = await pdf.read()
        full_text = extract_text_from_pdf_bytes(content)
        raw_summary = summarize_with_chatgpt(full_text)
        summary_data = parse_summary(raw_summary)

        new_id = str(uuid4())
        now = datetime.utcnow().isoformat()

        opportunity = {
            "id": new_id,
            "title": summary_data.get("titre", "Opportunité sans titre"),
            "type": summary_data.get("type", "ia").lower(),
            "organization": summary_data.get("organisateur", "Organisme non spécifié"),
            "description": raw_summary,
            "eligibility_criteria": summary_data.get("bénéficiaires", ""),
            "benefits": summary_data.get("avantages", ""),
            "required_documents": summary_data.get("documents requis", "").split("•"),
            "deadline": format_deadline(summary_data.get("date limite", "")),
            "external_link": None,
            "official_document": None,
            "cover_image": None,
            "status": "publié",
            "specific_data": {
                "sector": summary_data.get("secteur", "Agriculture générale"),
                "location": summary_data.get("localisation", "National"),
                "montant": summary_data.get("montant", "Non spécifié"),
                "duree": summary_data.get("durée", "Non spécifié")
            },
            "created_at": now,
            "updated_at": now,
            "embedding": None,
            "full_text": full_text,
            "ia_generated_at": now
        }

        response = supabase.table("opportunities").insert(opportunity).execute()
        if hasattr(response, "error") and response.error:
            raise HTTPException(status_code=500, detail=response.error.message)

        return {
            "id": new_id,
            "message": "Opportunité créée avec succès",
            "data": opportunity
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)