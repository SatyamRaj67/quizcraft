import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoginButton } from "@/components/auth/button/login-button";
import { Zap, ChevronRight, Sparkles, Gamepad2 } from "lucide-react";
import { features, stats } from "@/constants";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="space-y-8 text-center">
            {/* Badge */}
            <Badge
              variant="outline"
              className="border-white/20 bg-white/10 text-white backdrop-blur-sm"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Powered by Gemini 2.0 AI
            </Badge>

            {/* Main Heading */}
            <h1
              className={cn(
                "text-5xl font-bold text-white drop-shadow-2xl md:text-7xl lg:text-8xl",
                orbitron.className,
              )}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Quiz
              </span>
              <span className="text-white">Craft</span>
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "mx-auto max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl",
                orbitron.className,
              )}
            >
              Crafting Knowledge, One Quiz at a Time.
              <br />
              Experience the future of learning with AI-powered quizzes and
              real-time multiplayer challenges.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
              <LoginButton asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </LoginButton>

              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/10 px-8 py-3 text-lg text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/10 bg-white/5 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-3 flex justify-center">
                  <stat.icon className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mb-1 text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2
              className={cn(
                "mb-4 text-4xl font-bold text-white md:text-5xl",
                orbitron.className,
              )}
            >
              Why Choose QuizCraft?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-300">
              Experience next-generation quiz platform with cutting-edge
              features
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-white/10 p-3 transition-colors group-hover:bg-white/20">
                      <feature.icon className={cn("h-8 w-8", feature.color)} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2
            className={cn(
              "mb-6 text-4xl font-bold text-white md:text-5xl",
              orbitron.className,
            )}
          >
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300">
            Join thousands of learners already using QuizCraft to enhance their
            knowledge and compete with friends.
          </p>

          <LoginButton asChild>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-12 py-4 text-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700"
            >
              <Zap className="mr-2 h-6 w-6" />
              Start Learning Now
            </Button>
          </LoginButton>
        </div>
      </section>
    </main>
  );
}
