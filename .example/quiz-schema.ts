import { z } from "zod";

export const QuizOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const QuizQuestionSchema = z.object({
  id: z.string(), // e.g., PHY-Q1, CHEM-Q2
  section: z.string(), // e.g., "Physics", "Chemistry", "Maths"
  question: z.string(),
  type: z.enum(["mcq", "numerical"]).default("mcq"),
  options: z.array(QuizOptionSchema).optional(), // only for MCQ
  answerId: z.string().optional(), // for MCQ
  answerValue: z.number().optional(), // for numerical
  positiveMarks: z.number().default(4),
  negativeMarks: z.number().default(1),
  explanation: z.string().optional(),
});

export const QuizSectionSchema = z.object({
  name: z.string(),
  questions: z.array(QuizQuestionSchema),
});

export const QuizSettingsSchema = z.object({
  timeLimit: z.number().int().positive().optional(),
  negativeMarking: z.boolean().default(false),
});

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  settings: QuizSettingsSchema,
  sections: z.array(QuizSectionSchema),
});

export type Quiz = z.infer<typeof QuizSchema>;
export type QuizSection = z.infer<typeof QuizSectionSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type QuizSettings = z.infer<typeof QuizSettingsSchema>;
