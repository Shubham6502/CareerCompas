import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


router.post("/generate-test", async (req, res) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Return only valid JSON. No explanation. Output must be an array only."
        },
        {
          role: "user",
          content: `
            Generate 10 MCQ questions to identify the best career domain for a student.
            Domains: Software Development, AI/ML, Data Science, Web Development,
            Cybersecurity, Cloud, DevOps, UI/UX, Business Analyst.

            Each option must map to a domain.

            STRICT JSON OUTPUT FORMAT:
            [
              {
                "question": "string",
                "options": [
                  { "text": "string", "domain": "string" },
                  { "text": "string", "domain": "string" },
                  { "text": "string", "domain": "string" },
                  { "text": "string", "domain": "string" }
                ]
              }
            ]
          `,
        },
      ],
    });

    let aiText = response.choices[0].message.content.trim();

    // Clean in case any extra text is added
    aiText = aiText.substring(aiText.indexOf("["), aiText.lastIndexOf("]") + 1);

    const questions = JSON.parse(aiText);

    return res.status(200).json({ success: true, questions });

  } catch (error) {
    console.error("Groq Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI Error",
      error
    });
  }
});

export default router;
