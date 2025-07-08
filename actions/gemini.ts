"use server";

import type { Quiz, QuizOption } from "@/types";
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
  difficulty: string;
  questionCount: number;
  questionTypes: string[];
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
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Option text" },
                  },
                },
                description:
                  "List of options for MCQ questions (not applicable for numerical questions)",
              },
              correctOptionIndex: {
                type: Type.NUMBER,
                description:
                  "Index of the correct option (0, 1, 2, 3) for MCQ questions",
              },
              correctAnswer: {
                type: Type.NUMBER,
                description:
                  "Correct numerical answer (only for numerical questions)",
              },
            },
            required: ["type", "subject", "text"],
          },
          description:
            "List of questions in the quiz, each with its own properties",
        },
      },
      required: ["title", "description", "difficulty", "questions"],
    },
    responseJsonSchema: {
      type: Type.OBJECT,
      properties: {
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
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Option text" },
                  },
                },
                description:
                  "List of options for MCQ questions (not applicable for numerical questions)",
              },
              correctOptionIndex: {
                type: Type.NUMBER,
                description:
                  "Index of the correct option (0, 1, 2, 3) for MCQ questions",
              },
              correctAnswer: {
                type: Type.NUMBER,
                description:
                  "Correct numerical answer (only for numerical questions)",
              },
            },
            required: ["type", "subject", "text"],
          },
          description:
            "List of questions in the quiz, each with its own properties",
        },
      },
      required: ["title", "description", "difficulty", "questions"],
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
4. For MCQ: exactly 4 options with clear text
5. For MCQ: correctOptionIndex should be the index (0, 1, 2, or 3) of the correct option
6. For Numerical: the correct numerical answer

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

    const quizData = response.functionCalls[0]!.args as Record<string, any>;

    const transformedQuiz: Quiz = {
      id: crypto.randomUUID(),
      title: quizData.title || "Generated Quiz",
      description: quizData.description || "",
      difficulty: quizData.difficulty || "medium",
      questions:
        quizData.questions.map((q: any) => {
          const BaseQuestion = {
            id: crypto.randomUUID(),
            subject: q.subject,
            text: q.text,
            type: q.type,
            pointsCorrect:
              params.difficulty === "easy"
                ? 3
                : params.difficulty === "medium"
                  ? 4
                  : 4,
            pointsIncorrect:
              params.difficulty === "easy"
                ? 0
                : params.difficulty === "medium"
                  ? 1
                  : 2,
          };

          if (q.type === "mcq") {
            const optionWithIds =
              q.options.map((opt: QuizOption, index: number) => ({
                id: String(index),
                text: opt.text || "",
              })) || [];

            return {
              ...BaseQuestion,
              type: "mcq" as const,
              options: optionWithIds,
              correctOptionId: String(q.correctOptionIndex || 0),
            };
          } else if (q.type === "numerical") {
            return {
              ...BaseQuestion,
              type: "numerical" as const,
              correctAnswer: q.correctAnswer || 0,
            };
          }

          return BaseQuestion;
        }) || [],
    };

    return transformedQuiz;
  } catch (error) {
    console.error("Error generating quiz with AI:", error);
    throw new Error("Failed to generate quiz. Please try again.");
  }
}
