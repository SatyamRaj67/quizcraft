export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  subject: string;
  text: string;
  type: string;
  pointsCorrect: number;
  pointsIncorrect: number;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: QuizOption[];
  correctOptionId: string;
}

export interface NumericalQuestion extends BaseQuestion {
  type: "numerical";
  correctAnswer: number;
  tolerance?: number;
}

export type Question = MCQQuestion | NumericalQuestion;

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty?: string;
  questions: Question[];
}

export interface QuizPlayerProps {
  quiz: Quiz;
}
