"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Clock, 
  Award, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Users,
  Star,
  Play,
  ChevronRight
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type SortOption = "title" | "difficulty" | "duration" | "questions" | "category" | "recent";

interface Quiz {
  _id: string;
  quizTitle: string;
  quizDescription: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  timeLimitMinutes: number;
  passingScorePercentage: number;
  questions: Array<{
    questionId: string;
    category: string;
    questionText: string;
    points: number;
  }>;
  _creationTime?: number;
}

export default function QuizzesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - replace with actual Convex query
  const quizzes = useQuery(api.quizzes.getAllQuizzes) || [];

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    const cats = Array.from(new Set(quizzes.map(quiz => quiz.category)));
    return cats.sort();
  }, [quizzes]);

  const difficulties = ["Easy", "Medium", "Hard"];

  // Filter and sort quizzes
  const filteredAndSortedQuizzes = useMemo(() => {
    let filtered = quizzes.filter((quiz) => {
      const matchesSearch = quiz.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.quizDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.quizTitle.localeCompare(b.quizTitle);
        case "difficulty":
          const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "duration":
          return a.timeLimitMinutes - b.timeLimitMinutes;
        case "questions":
          return b.questions.length - a.questions.length;
        case "category":
          return a.category.localeCompare(b.category);
        case "recent":
          return (b._creationTime || 0) - (a._creationTime || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [quizzes, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Hard": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const startQuiz = (quizId: string) => {
    router.push(`/quiz?id=${quizId}`);
  };

  const QuizCard = ({ quiz }: { quiz: Quiz }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {quiz.quizTitle}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {quiz.quizDescription}
            </CardDescription>
          </div>
          <Badge className={`ml-3 ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{quiz.timeLimitMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{quiz.passingScorePercentage}% to pass</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {quiz.category}
          </Badge>
          
          <Button 
            onClick={() => startQuiz(quiz._id)}
            className="group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Browse Quizzes</h1>
          <p className="text-xl text-muted-foreground">
            Discover and take quizzes on various topics
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search quizzes by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="questions">Question Count</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>{filteredAndSortedQuizzes.length} quiz{filteredAndSortedQuizzes.length !== 1 ? 'es' : ''} found</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedQuizzes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
