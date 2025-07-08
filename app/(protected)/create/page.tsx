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
          { id: crypto.randomUUID(), text: "" },
          { id: crypto.randomUUID(), text: "" },
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

      // Set basic quiz properties
      form.setValue("title", generatedQuiz.title);
      form.setValue("description", generatedQuiz.description || "");
      form.setValue("difficulty", generatedQuiz.difficulty || "medium");

      // Clear existing questions and add generated ones
      const currentQuestions = form.getValues("questions");
      for (let i = currentQuestions.length - 1; i >= 0; i--) {
        remove(i);
      }

      // Add all generated questions at once
      generatedQuiz.questions.forEach((question) => {
        append(question);
      });

      toast.success(
        `Generated ${generatedQuiz.questions.length} questions successfully!`,
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
