import * as z from "zod";

// Quiz Schemas
const MCQOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const BaseQuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  subject: z.string().min(1),
  pointsCorrect: z
    .number()
    .positive("Points for correct answer must be positive"),
  pointsIncorrect: z.number().positive("Penalty points must be positive"),
});

const MCQQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("mcq"),
  options: z
    .array(MCQOptionSchema)
    .min(2, "MCQ must have at least two options"),
  correctOptionId: z.string().min(1),
});

const NumericalQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("numerical"),
  correctAnswer: z.number(),
  tolerance: z.number().positive().optional(),
});

const AnyQuestionSchema = z.discriminatedUnion("type", [
  MCQQuestionSchema,
  NumericalQuestionSchema,
]);

export const QuizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  questions: z
    .array(AnyQuestionSchema)
    .min(1, "A quiz must have at least one question"),
});

// Partykit Schemas

export const PlayerAnswerSchema = z.object({
  questionId: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  isCorrect: z.boolean(),
  scoreAwarded: z.number(),
});

export const PlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(25),
  score: z.number(),
  answers: z.record(z.string(), PlayerAnswerSchema),
});

export const GameStateSchema = z.object({
  quizId: z.string().min(1),
  status: z.enum(["waiting", "active", "finished"]),
  currentQuestionIndex: z.number().int().min(-1),
  players: z.record(z.string(), PlayerSchema),
  questionEndsAt: z.number().positive().optional(),
});

// User Preferences Schema
export const UserPreferencesSchema = z.object({
  theme: z.string().default("default"),
  enableTimer: z.boolean().default(true),
  enableNegativeMarking: z.boolean().default(true),
  preferredDifficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  instantAnswers: z.boolean().default(false),
});

export const GameResultSchema = z.object({
  id: z.string(),
  quizTitle: z.string(),
  playedAt: z.date(),
  finalScores: z.array(z.object({ userId: z.string(), score: z.number() })),
});

// AI Generation Schema
export const AIGenerationFormSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters long.",
  }),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionCount: z.coerce.number().int().min(1).max(20),
  questionTypes: z
    .array(z.enum(["mcq", "numerical"]))
    .min(1, "Please select at least one question type."),
  subjects: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .max(4, "You can select a maximum of 4 subjects.")
    .optional(),
  extraInstructions: z
    .string()
    .max(500, "Instructions cannot exceed 500 characters.")
    .optional(),
});

// Authentication Schemas

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(["USER", "ADMIN"]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New Password is Required",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is Required",
      path: ["password"],
    },
  );

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
  password: z.string().min(1, {
    message: "Password is Required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 Characters Required",
  }),
  name: z.string().min(1, {
    message: "Name is Required",
  }),
});
