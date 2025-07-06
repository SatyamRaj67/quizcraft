"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { QuizGenerationParams } from "@/actions/gemini";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AIGenerationFormSchema } from "@/schemas";
import type { z } from "zod";
import MultipleSelector, {
  type Option,
} from "@/components/ui/multiple-selector";
import { Textarea } from "@/components/ui/textarea";

interface AIGenerationFormProps {
  onGenerate: (params: QuizGenerationParams) => Promise<void>;
  isGenerating: boolean;
}

const SUBJECT_OPTIONS: Option[] = [
  { label: "Math", value: "math" },
  { label: "Science", value: "science" },
  { label: "History", value: "history" },
  { label: "Geography", value: "geography" },
  { label: "Art", value: "art" },
  { label: "Computer Science", value: "computer_science" },
  { label: "Literature", value: "literature" },
  { label: "Physics", value: "physics" },
  { label: "Chemistry", value: "chemistry" },
  { label: "Biology", value: "biology" },
];

const AIGenerationForm = ({
  onGenerate,
  isGenerating,
}: AIGenerationFormProps) => {
  const form = useForm<z.infer<typeof AIGenerationFormSchema>>({
    resolver: zodResolver(AIGenerationFormSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      questionCount: 5,
      questionTypes: ["mcq"],
      subjects: [],
      extraInstructions: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof AIGenerationFormSchema>) => {
    const params: QuizGenerationParams = {
      ...values,
      subjects: values.subjects?.map((s) => s.value),
    };
    onGenerate(params);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Quiz with AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., World War II, Calculus, The Renaissance..."
                      {...field}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isGenerating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                      disabled={isGenerating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 5, 7, 10, 15, 20].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num} questions
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects (Optional)</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      defaultOptions={SUBJECT_OPTIONS}
                      placeholder="Select up to 4 subjects..."
                      creatable
                      maxSelected={4}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionTypes"
              render={() => (
                <FormItem>
                  <FormLabel>Question Types</FormLabel>
                  <div className="flex items-center gap-4 pt-2">
                    <FormField
                      control={form.control}
                      name="questionTypes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("mcq")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "mcq"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "mcq",
                                      ),
                                    );
                              }}
                              disabled={isGenerating}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Multiple Choice
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="questionTypes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("numerical")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "numerical",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "numerical",
                                      ),
                                    );
                              }}
                              disabled={isGenerating}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Numerical
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="extraInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Focus on the causes of the war', 'Include questions about trigonometry', etc."
                      {...field}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Quiz"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AIGenerationForm;
