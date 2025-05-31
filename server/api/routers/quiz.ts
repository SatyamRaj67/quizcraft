import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import fs from "fs";
import path from "path";
import { QuizSchema } from "@/schema";

export const quizRouter = createTRPCRouter({
  getQuiz: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(({ input }) => {
      try {
        // Read the actual quiz file
        const quizPath = path.join(process.cwd(), ".example", "Quiz.json");
        const quizData = fs.readFileSync(quizPath, "utf-8");
        const quiz = JSON.parse(quizData);

        return QuizSchema.parse(quiz);
      } catch (error) {
        throw new Error("Failed to load quiz data");
      }
    }),

  submitAnswer: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.union([z.string(), z.array(z.string())]),
      }),
    )
    .mutation(({ input }) => {
      try {
        // Read the quiz to get the correct answer
        const quizPath = path.join(process.cwd(), ".example", "Quiz.json");
        const quizData = fs.readFileSync(quizPath, "utf-8");
        const quiz = JSON.parse(quizData);

        const question = quiz.questions.find(
          (q: any) => q.id === input.questionId,
        );
        if (!question) {
          throw new Error("Question not found");
        }

        let isCorrect = false;

        if (question.questionType === "short-answer") {
          // Check against acceptableAnswers or correctAnswer
          const acceptableAnswers = question.acceptableAnswers || [
            question.correctAnswer,
          ];
          isCorrect = acceptableAnswers.some(
            (acceptable: string) =>
              acceptable.toLowerCase().trim() ===
              (input.answer as string).toLowerCase().trim(),
          );
        } else if (
          question.questionType === "multiple-choice-multiple-answer"
        ) {
          // Check if arrays match (order doesn't matter)
          const correctAnswers = Array.isArray(question.correctAnswer)
            ? question.correctAnswer
            : [question.correctAnswer];
          const userAnswers = Array.isArray(input.answer)
            ? input.answer
            : [input.answer];

          isCorrect =
            correctAnswers.length === userAnswers.length &&
            correctAnswers.every((answer: string) =>
              userAnswers.includes(answer),
            );
        } else {
          // Simple string comparison for multiple-choice and true-false
          isCorrect = question.correctAnswer === input.answer;
        }

        return {
          correct: isCorrect,
          explanation: question.explanation,
          points: isCorrect ? question.points : 0,
          correctAnswer: question.correctAnswer,
        };
      } catch (error) {
        throw new Error("Failed to check answer");
      }
    }),

  getQuizResults: publicProcedure
    .input(
      z.object({
        answers: z.record(z.union([z.string(), z.array(z.string())])),
      }),
    )
    .mutation(({ input }) => {
      try {
        const quizPath = path.join(process.cwd(), ".example", "Quiz.json");
        const quizData = fs.readFileSync(quizPath, "utf-8");
        const quiz = JSON.parse(quizData);

        let totalScore = 0;
        let maxScore = 0;
        const results: Array<{
          questionId: string;
          correct: boolean;
          points: number;
          maxPoints: number;
        }> = [];

        for (const question of quiz.questions) {
          maxScore += question.points;
          const userAnswer = input.answers[question.id];

          let isCorrect = false;

          if (question.questionType === "short-answer") {
            const acceptableAnswers = question.acceptableAnswers || [
              question.correctAnswer,
            ];
            isCorrect = acceptableAnswers.some(
              (acceptable: string) =>
                acceptable.toLowerCase().trim() ===
                (userAnswer as string)?.toLowerCase().trim(),
            );
          } else if (
            question.questionType === "multiple-choice-multiple-answer"
          ) {
            const correctAnswers = Array.isArray(question.correctAnswer)
              ? question.correctAnswer
              : [question.correctAnswer];
            const userAnswers = Array.isArray(userAnswer)
              ? userAnswer
              : [userAnswer];

            isCorrect =
              correctAnswers.length === userAnswers.length &&
              correctAnswers.every((answer: string) =>
                userAnswers.includes(answer),
              );
          } else {
            isCorrect = question.correctAnswer === userAnswer;
          }

          const points = isCorrect ? question.points : 0;
          totalScore += points;

          results.push({
            questionId: question.id,
            correct: isCorrect,
            points,
            maxPoints: question.points,
          });
        }

        const percentage = Math.round((totalScore / maxScore) * 100);
        const passed = percentage >= quiz.passingScorePercentage;

        return {
          totalScore,
          maxScore,
          percentage,
          passed,
          passingScore: quiz.passingScorePercentage,
          results,
        };
      } catch (error) {
        throw new Error("Failed to calculate quiz results");
      }
    }),
});
