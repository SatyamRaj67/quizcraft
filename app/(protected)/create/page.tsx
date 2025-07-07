"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QuizSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import type { z } from "zod";
import { createQuizAction } from "@/actions/quiz";
import {
  generateQuizWithAI,
  type QuizGenerationParams,
} from "@/actions/gemini";
import { toast } from "sonner";
import AIGenerationForm from "@/components/quiz/create/ai-generation-form";
import ManualQuizForm from "@/components/quiz/create/manual-quiz-form";
import type { QuizOption } from "@/types";

const CreatePage = () => {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof QuizSchema>>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      difficulty: "medium",
      questions: [],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = (data: z.infer<typeof QuizSchema>) => {
    startTransition(async () => {
      await createQuizAction(data).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          form.reset();
        }
      });
    });
  };

  const addQuestion = (type: "mcq" | "numerical") => {
    if (type === "mcq") {
      append({
        id: crypto.randomUUID(),
        type: "mcq",
        text: "",
        subject: "",
        pointsCorrect: 5,
        pointsIncorrect: 0,
        options: [
          { id: "0", text: "" },
          { id: "1", text: "" },
        ],
        correctOptionId: "",
      });
    } else {
      append({
        id: crypto.randomUUID(),
        type: "numerical",
        text: "",
        subject: "",
        pointsCorrect: 10,
        pointsIncorrect: 0,
        correctAnswer: 0,
      });
    }
  };

  const handleAIGeneration = async (params: QuizGenerationParams) => {
    setIsGenerating(true);
    try {
      const generatedQuiz = await generateQuizWithAI(params);

      form.setValue("title", generatedQuiz.title || "Generated Quiz");
      form.setValue("description", generatedQuiz.description || "");
      form.setValue("difficulty", generatedQuiz.difficulty || "medium");

      // Clear existing questions first
      const currentQuestions = form.getValues("questions");
      for (let i = currentQuestions.length - 1; i >= 0; i--) {
        remove(i);
      }

      // Add generated questions with proper IDs and default points
      if (generatedQuiz.questions && Array.isArray(generatedQuiz.questions)) {
        generatedQuiz.questions.forEach((question: any) => {
          if (question.type === "mcq") {
            // Generate proper IDs for options and map correctOptionIndex
            const optionsWithUUIDs =
              question.options?.map((opt: any, index: number) => ({
                id: String(index),
                text: opt.text || "",
              })) || [];

            // Use the correctOptionIndex from AI
            const correctOptionId = String(question.correctOptionIndex || 0);

            // Set default points based on difficulty
            const defaultCorrectPoints = params.difficulty === "easy" ? 3 : params.difficulty === "medium" ? 5 : 8;
            const defaultIncorrectPoints = params.difficulty === "easy" ? 0 : params.difficulty === "medium" ? 1 : 2;

            const formattedQuestion = {
              id: crypto.randomUUID(),
              type: "mcq" as const,
              text: question.text,
              subject: question.subject || "General",
              pointsCorrect: defaultCorrectPoints,
              pointsIncorrect: defaultIncorrectPoints,
              options: optionsWithUUIDs,
              correctOptionId: correctOptionId,
            };

            append(formattedQuestion);
          } else if (question.type === "numerical") {
            // Set default points based on difficulty
            const defaultCorrectPoints = params.difficulty === "easy" ? 5 : params.difficulty === "medium" ? 8 : 10;
            const defaultIncorrectPoints = params.difficulty === "easy" ? 0 : params.difficulty === "medium" ? 1 : 3;

            const formattedQuestion = {
              id: crypto.randomUUID(),
              type: "numerical" as const,
              text: question.text,
              subject: question.subject || "General",
              pointsCorrect: defaultCorrectPoints,
              pointsIncorrect: defaultIncorrectPoints,
              correctAnswer: question.correctAnswer || 0,
            };

            append(formattedQuestion);
          }
        });
      }

      toast.success(
        `Generated ${generatedQuiz.questions?.length || 0} questions! You can now adjust points for each question.`,
      );
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Create New Quiz</h1>

        {/* AI Generation Form */}
        <div className="mb-8">
          <AIGenerationForm
            onGenerate={handleAIGeneration}
            isGenerating={isGenerating}
          />
        </div>

        {/* Manual Quiz Form */}
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ManualQuizForm
                isPending={isPending || isGenerating}
                questions={fields}
                onAddQuestion={addQuestion}
                onRemoveQuestion={remove}
              />

              <Button type="submit" disabled={isPending || isGenerating}>
                {isPending ? "Saving..." : "Save Quiz"}
              </Button>
              <Button
                type="button"
                onClick={() => console.log("Form values:", form.getValues())}
                disabled={isPending || isGenerating}
              >
                Debug Form Values
              </Button>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreatePage;
