import type { Quiz } from "./quiz-schema";

export const exampleQuizzes: Quiz[] = [
  {
    id: "sci-mock-1",
    title: "Science Mock Test",
    description:
      "A sample test with Physics, Chemistry, and Maths sections, featuring MCQs and numerical questions.",
    instructions: `- Each section has its own set of questions.\n- Some questions have different marks and negative marking.\n- Numerical questions require a number as answer.`,
    settings: {
      timeLimit: 30,
      negativeMarking: true,
    },
    sections: [
      {
        name: "Physics",
        questions: [
          {
            id: "PHY-Q1",
            section: "Physics",
            question: "What is the SI unit of force?",
            type: "mcq",
            options: [
              { id: "a", text: "Newton" },
              { id: "b", text: "Joule" },
              { id: "c", text: "Watt" },
              { id: "d", text: "Pascal" },
            ],
            answerId: "a",
            positiveMarks: 4,
            negativeMarks: 1,
            explanation: "The SI unit of force is Newton.",
          },
          {
            id: "PHY-Q2",
            section: "Physics",
            question: "A body moves 10m in 2s. What is its speed (in m/s)?",
            type: "numerical",
            answerValue: 5,
            positiveMarks: 3,
            negativeMarks: 2,
            explanation: "Speed = distance/time = 10/2 = 5 m/s.",
          },
        ],
      },
      {
        name: "Chemistry",
        questions: [
          {
            id: "CHEM-Q1",
            section: "Chemistry",
            question: "Water is a compound of which two elements?",
            type: "mcq",
            options: [
              { id: "a", text: "Hydrogen and Oxygen" },
              { id: "b", text: "Hydrogen and Nitrogen" },
              { id: "c", text: "Oxygen and Carbon" },
              { id: "d", text: "Hydrogen and Carbon" },
            ],
            answerId: "a",
            positiveMarks: 4,
            negativeMarks: 1,
            explanation: "Water is H2O, made of Hydrogen and Oxygen.",
          },
        ],
      },
      {
        name: "Maths",
        questions: [
          {
            id: "MATH-Q1",
            section: "Maths",
            question: "What is the value of π (up to 2 decimal places)?",
            type: "numerical",
            answerValue: 3.14,
            positiveMarks: 2,
            negativeMarks: 0.5,
            explanation: "π ≈ 3.14.",
          },
          {
            id: "MATH-Q2",
            section: "Maths",
            question: "Which of the following is a prime number?",
            type: "mcq",
            options: [
              { id: "a", text: "4" },
              { id: "b", text: "6" },
              { id: "c", text: "7" },
              { id: "d", text: "9" },
            ],
            answerId: "c",
            positiveMarks: 4,
            negativeMarks: 1,
            explanation: "7 is a prime number.",
          },
        ],
      },
    ],
  },
];
