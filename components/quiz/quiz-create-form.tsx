"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, PlusCircle } from "lucide-react";

export const optionSchema = z.object({
  id: z.string().optional(), // Optional for new options
  text: z.string().min(1, { message: "Option text cannot be empty." }),
});

export const questionSchema = z.object({
  id: z.string().optional(), // Optional for new questions
  text: z.string().min(1, { message: "Question text cannot be empty." }),
  options: z
    .array(optionSchema)
    .min(2, { message: "Must have at least two options." }),
});

export const quizSchema = z.object({
  questions: z.array(questionSchema),
});

// The initial data from your JSON file
const initialData = {
  questions: [
    {
      id: "q1",
      text: "What is the capital of France?",
      options: [
        { id: "o1", text: "Berlin" },
        { id: "o2", text: "Madrid" },
        { id: "o3", text: "Paris" },
        { id: "o4", text: "Rome" },
      ],
    },
    {
      id: "q2",
      text: "Which planet is known as the Red Planet?",
      options: [
        { id: "o1", text: "Earth" },
        { id: "o2", text: "Mars" },
        { id: "o3", text: "Jupiter" },
        { id: "o4", text: "Venus" },
      ],
    },
  ],
};

type QuizFormValues = z.infer<typeof quizSchema>;

export default function Home() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data: QuizFormValues) => {
    alert("Quiz data saved! Check the console for the output.");
  };

  return (
    <main className="container mx-auto p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Question Editor</h1>
          <Button type="submit">Save Quiz</Button>
        </div>

        <div className="space-y-6">
          {fields.map((question, questionIndex) => (
            <QuestionCard
              key={question.id}
              questionIndex={questionIndex}
              control={control}
              onRemoveQuestion={() => remove(questionIndex)}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() =>
            append({
              text: "",
              options: [{ text: "" }, { text: "" }],
            })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </form>
    </main>
  );
}

// Sub-component for individual question cards for better organization
function QuestionCard({
  questionIndex,
  control,
  onRemoveQuestion,
}: {
  questionIndex: number;
  control: any;
  onRemoveQuestion: () => void;
}) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Question {questionIndex + 1}</CardTitle>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onRemoveQuestion}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`questions.${questionIndex}.text`}>
            Question Text
          </Label>
          <Controller
            name={`questions.${questionIndex}.text`}
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="e.g., What is Next.js?" />
            )}
          />
        </div>
        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {optionFields.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <Controller
                  name={`questions.${questionIndex}.options.${optionIndex}.text`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(optionIndex)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={() => appendOption({ text: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Option
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
