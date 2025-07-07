"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import type { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, PlusCircle } from "lucide-react";
import type { QuizSchema } from "@/schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface QuestionCreateCardProps {
  questionIndex: number;
  onRemoveQuestion: () => void;
}

const QuestionCreateCard = ({
  questionIndex,
  onRemoveQuestion,
}: QuestionCreateCardProps) => {
  const { control } = useFormContext<z.infer<typeof QuizSchema>>();
  const questionType = control._getWatch(`questions.${questionIndex}.type`);

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <Card className="border-dashed">
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
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name={`questions.${questionIndex}.text`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., What is the capital of..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`questions.${questionIndex}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="numerical">Numerical</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`questions.${questionIndex}.subject`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Geography" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {questionType === "mcq" && (
          <div className="space-y-4 md:col-span-2">
            <Label>Options</Label>
            {optionFields.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`questions.${questionIndex}.options.${optionIndex}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                appendOption({ id: optionFields.length.toString(), text: "" })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Option
            </Button>
            <FormField
              control={control}
              name={`questions.${questionIndex}.correctOptionId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Option</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the correct option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {optionFields.map((opt, i) => (
                        <SelectItem key={opt.id} value={String(i)}>
                          Option {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {questionType === "numerical" && (
          <FormField
            control={control}
            name={`questions.${questionIndex}.correctAnswer`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <FormField
            control={control}
            name={`questions.${questionIndex}.pointsCorrect`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points for Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`questions.${questionIndex}.pointsIncorrect`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points Deducted for Incorrect Answer</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCreateCard;
