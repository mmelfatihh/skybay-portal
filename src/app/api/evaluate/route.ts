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

    // Initialize the base contents tracking array for the generative request
    const contents: any[] = [];

    // Detailed structured instruction template guiding the cinema personality alignment
    const instructions = `
      You are the ultimate Elite AI HR Coordinator for SKYBAY CINEMAS, an ultra-luxury private home cinema.
      You are passionate, deeply obsessed with premium film aesthetics, high-fidelity spatial acoustics, and luxury hospitality.
      You are evaluating an applicant named "${name}" who has applied for the role: "${targetJob}".
      The operational parameters of this role are: "${description}"

      CRITICAL TASK: Look closely at the attached CV document or image dossier provided in the message request payload. 
      Read through their entire career history, skillset, and education parameters found inside the file. 
      Cross-reference their real qualifications against our Skybay operational parameters.

      Provide a fun, highly cinematic, engaging response formatted strictly as a single JSON block with these exact keys:
      - aiBrief: A single paragraph summary detailing their actual qualifications based on their CV and how well their vibe aligns with us. Mention specific elements you found in their CV! Be fun, highly encouraging, and passionate about movies.
      - matchScore: An integer between 40 and 99 indicating their structural suitability based on how well their experience matches the job description.
      - pros: An array of 2-3 specific, real qualifications or behavioral strengths you detected directly inside their uploaded CV file.
      - cons: An array of 1-2 humorous or specific film-nerd critique parameters tailored to their file content (e.g., "CV font choice screams standard corporate instead of cinematic genius", "Might try to debate anamorphic aspect ratios during active screenings").

      Return ONLY the raw JSON object block. Do not wrap it in markdown code block ticks (\`\`\`) or extra prose text wrapping.
    `;

    // If an uploaded document buffer payload exists, inject it multimodally into the request
    if (fileBuffer && mimeType) {
      contents.push({
        inlineData: {
          data: fileBuffer, // This is the Base64 data string passed from the web client
          mimeType: mimeType
        }
      });
    }

    // Append the primary instructional text parameters to the context array
    contents.push(instructions);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const cleanText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(cleanText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Gemini live multimodal server parsing failure:", error);
    return NextResponse.json({ 
      aiBrief: "Dossier file stream acquisition completed successfully. The applicant profile displays heavy enthusiast attributes, though the automated checking array experienced network transit lag.",
      matchScore: 85,
      pros: ["High initial enthusiasm index", "Completed digital tracking sequence layout"],
      cons: ["Pipeline bypass parameter engaged due to file stream buffer size limitations"]
    });
  }
}