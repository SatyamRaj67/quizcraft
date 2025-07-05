"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { QuizSchema } from "@/schemas";
import { createQuiz } from "@/database/quiz";

export const createQuizAction = async (values: z.infer<typeof QuizSchema>) => {
  const validatedFields = QuizSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized: You must be logged in to create a quiz." };
  }

  try {
    await createQuiz(validatedFields.data, session.user.id);
    revalidatePath("/quizzes");
    return { success: "Quiz created successfully!" };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return { error: "Failed to create quiz. Please try again later." };
  }
};
