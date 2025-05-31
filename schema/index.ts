import { z } from 'zod';

export const OptionSchema = z.object({
  optionId: z.string(),
  text: z.string(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  questionText: z.string(),
  questionType: z.enum(['multiple-choice', 'true-false', 'short-answer', 'multiple-choice-multiple-answer']),
  points: z.number(),
  options: z.array(OptionSchema).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string(),
  imageURL: z.string().optional(),
});

export const QuizSchema = z.object({
  quizTitle: z.string(),
  quizDescription: z.string(),
  difficulty: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  timeLimitMinutes: z.number(),
  passingScorePercentage: z.number(),
  questions: z.array(QuestionSchema),
});

export type Quiz = z.infer<typeof QuizSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Option = z.infer<typeof OptionSchema>;