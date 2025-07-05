"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import QuestionCreateCard from "./question-create-card";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { QuizSchema } from "@/schemas";

interface ManualQuizFormProps {
  isPending: boolean;
  onAddQuestion: (type: "mcq" | "numerical") => void;
  questions: any[]; // Add this prop
  onRemoveQuestion: (index: number) => void; // Add this prop
}

const ManualQuizForm = ({
  isPending,
  onAddQuestion,
  questions,
  onRemoveQuestion,
}: ManualQuizFormProps) => {
  const { control } = useFormContext<z.infer<typeof QuizSchema>>();

  return (
    <>
      <div className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Title of the Quiz"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                This is the main title for your quiz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="A brief description of the quiz..."
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        {questions.map((field, index) => (
          <QuestionCreateCard
            key={field.id}
            questionIndex={index}
            onRemoveQuestion={() => onRemoveQuestion(index)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddQuestion("mcq")}
          disabled={isPending}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add MCQ Question
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddQuestion("numerical")}
          disabled={isPending}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Numerical Question
        </Button>
      </div>
    </>
  );
};

export default ManualQuizForm;
