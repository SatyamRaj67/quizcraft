# 🧠 QuizCraft - AI-Powered Quiz Platform

**Experience the future of learning with AI-generated quizzes powered by Google's Gemini 2.0**

## ✨ Features

### 🎯 AI-Powered Quiz Generation

- **Gemini 2.0 Integration**: Leverages Google's latest and most advanced AI model
- **Smart Question Generation**: Creates MCQs and numerical questions tailored to your preferences
- **Adaptive Difficulty**: AI adjusts question complexity based on your performance

### 🎮 Game Modes

- **🏃 Solo Mode**: Practice at your own pace with customizable settings
- **🏁 Multiplayer Racing**: Compete against friends and players worldwide in real-time
- **📊 Performance Analytics**: Track your progress with detailed insights

### 🎨 Beautiful & Immersive Experience

- **🌈 Custom Theming**: Multiple visual themes that transform the entire experience
- **🎵 Dynamic Music**: Theme-matched background music for enhanced immersion
- **✨ Smooth Animations**: Beautifully crafted page transitions and interactions
- **📱 Responsive Design**: Perfect experience across all devices

### ⚙️ Personalization & Preferences

- **⏱️ Timer Controls**: Enable/disable timers based on your preference
- **❌ Negative Marking**: Toggle penalty systems for wrong answers
- **🎯 Difficulty Settings**: Choose your challenge level
- **📝 Question Types**: MCQs and numerical questions for accurate validation

### 💾 Real-Time Data Protection

- **🔄 Instant Sync**: Quiz progress saved in real-time
- **🛡️ Connection Safety**: Never lose your data due to connectivity issues
- **☁️ Cloud Backup**: Secure storage with instant recovery

### 📈 Intelligent Results & Feedback

- **📊 Detailed Analytics**: Comprehensive performance breakdown
- **🤖 AI Evaluation**: Get brutally honest feedback (Asian Mom style) from AI
- **🏆 Achievement System**: Unlock badges and track milestones
- **📈 Progress Tracking**: Monitor improvement over time

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **AI**: Google Gemini 2.0 API
- **Authentication**: NextAuth.js with multiple providers
- **UI Components**: Shadcn/ui with custom theming
- **Real-time**: Socket.io for multiplayer functionality and live updates

## 🎮 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/quizcraft.git
   cd quizcraft
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your API keys and database URL

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Roadmap

- [ ] Core quiz generation with Gemini 2.0
- [ ] User authentication and profiles
- [ ] Socket.io implementation for real-time multiplayer
- [ ] Quiz room creation and management
- [ ] Live leaderboards and synchronized timers
- [ ] Advanced theming system
- [ ] Performance analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Community features and global leaderboards

## 🌐 Real-time Features (Socket.io)

- **🏁 Live Quiz Racing**: Real-time competition with synchronized questions
- **⏱️ Synchronized Timers**: All players see the same countdown
- **📊 Live Leaderboards**: Instant ranking updates as players answer
- **🎮 Room Management**: Create, join, and manage quiz rooms
- **👥 Player Presence**: See who's online and ready to play
- **💬 Live Chat**: Communicate with other players during breaks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini Team for the amazing AI capabilities
- Socket.io team for excellent real-time communication tools
- The open-source community for incredible tools and libraries
- All beta testers and contributors

---

** Ready to test your knowledge? Let's
