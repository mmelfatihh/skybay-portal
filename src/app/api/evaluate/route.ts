import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { name, email, targetJob, description, fileBuffer, mimeType } = await request.json();

    if (!name || !email || !targetJob) {
      return NextResponse.json(
        { error: "Missing required profile identity parameters." },
        { status: 400 }
      );
    }

    const contents: any[] = [];

    const instructions = `
      You are the ultimate Elite AI HR Coordinator for SKYBAY CINEMAS, an ultra-luxury private home cinema.
      You are passionate, deeply obsessed with premium film aesthetics, high-fidelity spatial acoustics, and luxury hospitality.
      You are evaluating an applicant named "${name}" who has applied for the role: "${targetJob}".
      The operational parameters of this specific role are: "${description}"

      CRITICAL TASK: Look closely at the attached CV document or image dossier provided in the message request payload. 
      Read through their entire career history, skillset, and education parameters found inside the file. 
      Cross-reference their real qualifications strictly against our specific Skybay operational parameters for THIS role. 
      Do not give duplicate evaluations for different roles.

      Provide a fun, highly cinematic, engaging response formatted strictly as a single JSON block with these exact keys:
      - aiBrief: A single paragraph summary detailing their actual qualifications based on their CV and how well their vibe aligns with this specific job. Mention specific elements you found in their CV! Be fun, highly encouraging, and passionate about movies.
      - matchScore: An integer between 40 and 99 indicating their structural suitability based on how well their experience matches the job description.
      - pros: An array of 2-3 specific, real qualifications or strengths you detected directly inside their uploaded CV file.
      - cons: An array of 1-2 humorous or specific film-nerd critique parameters tailored to their file content.

      Return ONLY the raw JSON object block. Do not wrap it in markdown code block ticks (\`\`\`) or extra prose text wrapping.
    `;

    if (fileBuffer && mimeType) {
      contents.push({
        inlineData: {
          data: fileBuffer,
          mimeType: mimeType
        }
      });
    }

    contents.push(instructions);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const cleanText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(cleanText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Multi-Modal API Failure Reason:", error);
    return NextResponse.json(
      { error: "AI Evaluation engine encountered an internal compilation failure.", details: error.message },
      { status: 500 }
    );
  }
}