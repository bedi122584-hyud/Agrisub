import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { OpenAI } from "openai";

export const config = {
  api: { bodyParser: false },
};

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const parseForm = (req: NextApiRequest) => new Promise<{ files: formidable.Files }>((resolve, reject) => {
  const form = formidable({ keepExtensions: true });
  form.parse(req, (err, _fields, files) => {
    if (err) reject(err);
    else resolve({ files });
  });
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { files } = await parseForm(req);
    
    if (!files.file) {
      return res.status(400).json({ error: "Aucun fichier audio reçu", code: "MISSING_FILE" });
    }

    const audioFile = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!fs.existsSync(audioFile.filepath)) {
      return res.status(400).json({ error: "Fichier corrompu", code: "INVALID_FILE" });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile.filepath),
      model: "whisper-1",
      language: "fr",
    });

    await fs.promises.unlink(audioFile.filepath).catch(() => {});

    return res.status(200).json({ text: transcription.text });

  } catch (error: any) {
    console.error("Erreur complète:", error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message?.includes("invalid file") 
      ? "Format audio non supporté (utilisez .webm ou .wav)"
      : "Échec de la transcription audio";

    return res.status(statusCode).json({
      error: errorMessage,
      code: error.code || "TRANSCRIPTION_FAILED",
      details: error.response?.data || null
    });
  }
}