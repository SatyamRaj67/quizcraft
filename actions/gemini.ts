"use server";

import type { Quiz } from "@/types";
import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  Type,
  type FunctionDeclaration,
} from "@google/genai";
import { env } from "@/env";

const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export interface QuizGenerationParams {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  questionTypes: ("mcq" | "numerical")[];
  subjects?: string[];
  extraInstructions?: string;
}

export async function generateQuizWithAI(
  params: QuizGenerationParams,
): Promise<Quiz> {
  const QuizDeclaration: FunctionDeclaration = {
    name: "create_quiz",
    description:
      "Creates a quiz with a title, description, and a list of questions.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING, description: "The title of the quiz" },
        description: {
          type: Type.STRING,
          description: "A brief description of the quiz",
        },
        difficulty: {
          type: Type.STRING,
          enum: ["easy", "medium", "hard"],
          description: "The difficulty level of the quiz",
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique question ID" },
              type: {
                type: Type.STRING,
                enum: ["mcq", "numerical"],
                description: "Type of the question",
              },
              subject: {
                type: Type.STRING,
                description: "Subject category of the question",
              },
              text: { type: Type.STRING, description: "Question text" },
              pointsCorrect: {
                type: Type.INTEGER,
                description:
                  "Points awarded for a correct answer (1-10 based on difficulty)",
              },
              pointsIncorrect: {
                type: Type.INTEGER,
                description:
                  "Points deducted for an incorrect answer (0-5 based on difficulty)",
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Option ID" },
                    text: { type: Type.STRING, description: "Option text" },
                  },
                },
                description:
                  "List of options for MCQ questions (not applicable for numerical questions)",
              },
              correctOptionId: {
                type: Type.NUMBER,
                description:
                  "ID of the correct option (only for MCQ questions)",
              },
              correctAnswer: {
                type: Type.NUMBER,
                description:
                  "Correct numerical answer (only for numerical questions)",
              },
            },
            required: [
              "id",
              "type",
              "subject",
              "text",
              "pointsCorrect",
              "pointsIncorrect",
            ],
          },
          description:
            "List of questions in the quiz, each with its own properties",
        },
      },
      required: ["id", "title", "description", "difficulty", "questions"],
    },
    responseJsonSchema: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "Unique quiz ID" },
        title: { type: Type.STRING, description: "Title of the quiz" },
        description: { type: Type.STRING, description: "Brief description" },
        difficulty: {
          type: Type.STRING,
          enum: ["easy", "medium", "hard"],
          description: "Difficulty level of the quiz",
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique question ID" },
              type: {
                type: Type.STRING,
                enum: ["mcq", "numerical"],
                description: "Type of the question",
              },
              subject: {
                type: Type.STRING,
                description: "Subject category of the question",
              },
              text: { type: Type.STRING, description: "Question text" },
              pointsCorrect: {
                type: Type.INTEGER,
                description:
                  "Points awarded for a correct answer (1-10 based on difficulty)",
              },
              pointsIncorrect: {
                type: Type.INTEGER,
                description:
                  "Points deducted for an incorrect answer (0-5 based on difficulty)",
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Option ID" },
                    text: { type: Type.STRING, description: "Option text" },
                  },
                },
                description:
                  "List of options for MCQ questions (not applicable for numerical questions)",
              },
              correctOptionId: {
                type: Type.NUMBER,
                description:
                  "ID of the correct option (only for MCQ questions)",
              },
              correctAnswer: {
                type: Type.NUMBER,
                description:
                  "Correct numerical answer (only for numerical questions)",
              },
            },
            required: [
              "id",
              "type",
              "subject",
              "text",
              "pointsCorrect",
              "pointsIncorrect",
            ],
          },
          description:
            "List of questions in the quiz, each with its own properties",
        },
      },
      required: ["id", "title", "description", "difficulty", "questions"],
    },
  };

  const prompt = `Generate a quiz with the following specifications:
- Topic: ${params.topic}
- Difficulty: ${params.difficulty}
- Number of questions: ${params.questionCount}
- Question types: ${params.questionTypes.join(", ")}
- Subjects: ${params.subjects?.join(", ") || "General"}

For each question, provide:
1. A clear, well-formed question text
2. Subject category
3. Question type (mcq or numerical)
4. For MCQ: 4 options with one correct answer
5. For MCQ: correctOptionId should be the index (0, 1, 2, or 3) of the correct option
6. For Numerical: the correct numerical answer
7. Points for correct answer (1-10 based on difficulty)
8. Points for incorrect answer (penalty, 0-5 based on difficulty)

Special Instructions:
${params.extraInstructions || "None"}
`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      config: {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.ANY,
            allowedFunctionNames: ["create_quiz"],
          },
        },
        tools: [
          {
            functionDeclarations: [QuizDeclaration],
          },
        ],
      },
    });

    if (!response.functionCalls || response.functionCalls.length === 0) {
      throw new Error("No function calls returned from AI");
    }

    console.log("AI Response:", response.functionCalls[0]?.args);

    const quizData = response.functionCalls[0]!.args as Record<string, any>;

    return quizData as Quiz;
  } catch (error) {
    console.error("Error generating quiz with AI:", error);
    throw new Error("Failed to generate quiz. Please try again.");
  }
}
