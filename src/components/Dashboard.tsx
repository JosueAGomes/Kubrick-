import {
  getAchievementById,
  tierConfig,
} from "../data/achievements";
import alexImage from "figma:asset/e94e0884cfa8fcb3ee2ce5737d46528dd558fd87.png";
import lunaImage from "figma:asset/ba0a2904ecec112bf024ea6e538671a9436702e6.png";
import robotImage from "figma:asset/d968718c002086b0bde719964755ce6bc6cd6e4c.png";
import alienZyxImage from "figma:asset/af346811e3c33f3aea4ef5740d6362a49d74acd4.png";
import alienKryvoImage from "figma:asset/f16b38dcac6395bf5dd60b8a4eda48546c745ab9.png";
import pilotImage from "figma:asset/e4a81757b3af249f2a402f59195cc71f42a1913c.png";

import { motion } from "motion/react";
import {
  Star,
  Trophy,
  Target,
  Zap,
  Map,
  Award,
  LogOut,
  Home,
  Rocket,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useUser } from "../contexts/UserContext";
import { useState, useEffect, useMemo } from "react";
import KnowledgeMap from "./KnowledgeMap";
import ProfileScreen from "./ProfileScreen";
import AchievementsScreen from "./AchievementsScreen";
import AchievementUnlockedModal from "./AchievementUnlockedModal";
import Ranking from "./Ranking";

// Avatar options
const avatarOptions = [
  {
    id: "astronaut-1",
    image: alexImage,
    name: "Astronauta Alex",
  },
  {
    id: "astronaut-2",
    image: lunaImage,
    name: "Astronauta Luna",
  },
  { id: "robot", image: robotImage, name: "Robô Nexar" },
  { id: "alien-1", image: alienZyxImage, name: "Alien Zyx" },
  {
    id: "alien-2",
    image: alienKryvoImage,
    name: "Alien Kryvo",
  },
  { id: "rocket", image: pilotImage, name: "Piloto Estelar" },
];

export default function Dashboard() {
  const { user, logout, userAchievements, checkAchievements } =
    useUser();
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "knowledge-map-full"
    | "knowledge-map-overlay"
    | "profile"
    | "achievements"
    | "ranking"
  >("dashboard");
  const [unlockedAchievementId, setUnlockedAchievementId] =
    useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  // Get current avatar
  const currentAvatar =
    avatarOptions.find((a) => a.id === user?.avatar) ||
    avatarOptions[0];

  // Test function to manually trigger achievement check
  const handleTestAchievements = async () => {
    console.log("Testing achievements...");
    console.log("Current user:", user);
    console.log("Current userAchievements:", userAchievements);
    const newlyUnlocked = await checkAchievements();
    console.log("Newly unlocked:", newlyUnlocked);
  };

  // Force re-render when user data changes
  useEffect(() => {
    if (!user) return;
    // Increment render key to force re-calculation of nextMission
    setRenderKey(prev => prev + 1);
  }, [user?.completedMissions, user?.unlockedPlanets]);

  // Check for new achievements
  useEffect(() => {
    if (!user) return;
    console.log(
      "Dashboard - User Achievements:",
      userAchievements,
    );
    console.log("Dashboard - User Data:", {
      completedMissions: user.completedMissions,
      totalMissions: user.totalMissions,
      xp: user.xp,
      level: user.level,
      hasStartedJourney: user.hasStartedJourney,
      unlockedPlanets: user.unlockedPlanets,
    });
    const checkNewAchievements = () => {
      if (userAchievements.length > 0) {
        const lastAchievement =
          userAchievements[userAchievements.length - 1];
        setUnlockedAchievementId(lastAchievement.achievementId);
      }
    };
    checkNewAchievements();
  }, [userAchievements.length, user]);

  // Definição de todas as missões do jogo
  const allMissions = [
    {
      planetId: 1,
      planetName: 'Reino da Geometria',
      title: 'Primeira Missão',
      description: 'O painel da nave sofreu danos! Precisamos encaixar as peças geométricas corretas para continuar nossa jornada.',
      category: 'Introdução',
      time: '10 min',
      xp: 100
    },
    {
      planetId: 2,
      planetName: 'Nora Triângulos',
      title: 'Explorando Triângulos',
      description: 'Descubra os segredos dos triângulos e seus ângulos internos para restaurar o sistema de navegação.',
      category: 'Triângulos',
      time: '15 min',
      xp: 150
    },
    {
      planetId: 3,
      planetName: 'Polígono Prime',
      title: 'Dominando Polígonos',
      description: 'Complete desafios envolvendo quadriláteros e outros polígonos para recuperar o cristal energético.',
      category: 'Polígonos',
      time: '25 min',
      xp: 550
    },
    {
      planetId: 4,
      planetName: 'Euklidia',
      title: 'Confronto Final',
      description: 'Enfrente Olugan Kryvo em uma batalha épica dominando polígonos complexos!',
      category: 'Polígonos',
      time: '40 min',
      xp: 1000
    }
  ];

  // Calcula a próxima missão dinamicamente com useMemo
  // Re-calcula sempre que user.unlockedPlanets ou user.completedMissions mudar
  const nextMission = useMemo(() => {
    if (!user) return allMissions[0];
    
    const unlockedPlanets = user.unlockedPlanets || [];
    const completedCount = user.completedMissions;
    
    console.log("Recalculando próxima missão:", {
      completedCount,
      unlockedPlanets,
    });
    
    // Se completou todas as missões (4/4), sugerir replay do último planeta
    if (completedCount >= 4) {
      return allMissions[3]; // Replay do Planeta 4 (confronto final)
    }
    
    // Baseado nos planetas desbloqueados e missões completadas
    // Planeta 1 está sempre disponível por padrão
    if (completedCount === 0 || !unlockedPlanets.includes(2)) {
      return allMissions[0]; // Missão do Planeta 1
    } 
    
    // Se Planeta 2 está desbloqueado e completou 1 missão
    if (completedCount === 1 || (unlockedPlanets.includes(2) && !unlockedPlanets.includes(3))) {
      return allMissions[1]; // Missão do Planeta 2
    }
    
    // Se Planeta 3 está desbloqueado e completou 2 missões
    if (completedCount === 2 || (unlockedPlanets.includes(3) && !unlockedPlanets.includes(4))) {
      return allMissions[2]; // Missões do Planeta 3
    }
    
    // Se Planeta 4 está desbloqueado e completou 3 missões
    return allMissions[3]; // Missões do Planeta 4
  }, [user?.unlockedPlanets, user?.completedMissions]);

  // Dados calculados que dependem do usuário
  const xpToNextLevel = user ? 1000 - (user.xp % 1000) : 1000;
  const nextLevel = user ? user.level + 1 : 1;
  const progressPercentage = user
    ? (user.completedMissions / user.totalMissions) * 100
    : 0;

  // Log para debug - mostra quando a próxima missão é recalculada
  useEffect(() => {
    if (!user) return;
    console.log("✅ Dashboard: Próxima missão recalculada:", {
      planetId: nextMission.planetId,
      planetName: nextMission.planetName,
      title: nextMission.title,
      unlockedPlanets: user.unlockedPlanets,
      completedMissions: user.completedMissions,
    });
  }, [nextMission, user?.unlockedPlanets, user?.completedMissions]);

  if (!user) return null;

  // Show Knowledge Map in full mode (from header)
  if (currentView === "knowledge-map-full") {
    return (
      <KnowledgeMap
        mode="full"
        onBack={() => {
          // Force re-render when returning from map
          setCurrentView("dashboard");
        }}
        onNavigateToAchievements={() =>
          setCurrentView("achievements")
        }
        onNavigateToProfile={() => setCurrentView("profile")}
        onNavigateToRanking={() => setCurrentView("ranking")}
      />
    );
  }

  // Show Knowledge Map in overlay mode (from quick actions)
  if (currentView === "knowledge-map-overlay") {
    return (
      <KnowledgeMap
        mode="overlay"
        onBack={() => {
          // Force re-render by setting a temporary state
          setCurrentView("dashboard");
        }}
        onNavigateToAchievements={() =>
          setCurrentView("achievements")
        }
        onNavigateToProfile={() => setCurrentView("profile")}
        onNavigateToRanking={() => setCurrentView("ranking")}
      />
    );
  }

  // Show Profile Screen
  if (currentView === "profile") {
    return (
      <ProfileScreen
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  // Show Achievements Screen
  if (currentView === "achievements") {
    return (
      <AchievementsScreen
        onBack={() => setCurrentView("dashboard")}
        onNavigateToKnowledgeMap={() =>
          setCurrentView("knowledge-map-full")
        }
        onNavigateToProfile={() => setCurrentView("profile")}
      />
    );
  }

  // Show Ranking Screen
  if (currentView === "ranking") {
    return (
      <Ranking onBack={() => setCurrentView("dashboard")} />
    );
  }

  // Main Dashboard View - All hooks have been called above
  const recentAchievements = [];

  return (
    <div 
      key={`dashboard-${renderKey}`}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">Kubrick</h1>
                <p className="text-xs text-purple-300">
                  Reino da Geometria
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView("dashboard")}
                className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </button>
              <button
                onClick={() =>
                  setCurrentView("knowledge-map-full")
                }
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Map className="w-4 h-4" />
                <span>Mapa do Conhecimento</span>
              </button>
              <button
                onClick={() => setCurrentView("achievements")}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span>Conquistas</span>
              </button>
              <button
                onClick={() => setCurrentView("ranking")}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Ranking</span>
              </button>
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white">{user.xp} XP</span>
              </div>
              <div className="text-xs text-white/70">
                {xpToNextLevel} XP para nível {nextLevel}
              </div>
              <Badge className="bg-purple-600 hover:bg-purple-700">
                Nível {user.level}
              </Badge>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white">
                  {user.achievements}
                </span>
              </div>
              <button
                onClick={() => setCurrentView("profile")}
                className="flex items-center space-x-3 hover:bg-white/10 rounded-lg px-3 py-1.5 transition-colors"
              >
                <span className="text-white">{user.name}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white/10">
                  <img
                    src={currentAvatar.image}
                    alt={currentAvatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-purple-500/20"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-white mb-2">
            Seja bem-vindo, {user.name}!
          </h2>
          <p className="text-purple-200">
            Continue sua jornada pelo Reino da Geometria
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white">{user.xp}</p>
                  <p className="text-sm text-white/70">
                    Pontos XP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white">{user.level}</p>
                  <p className="text-sm text-white/70">
                    Nível Atual
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white">
                    {user.achievements}
                  </p>
                  <p className="text-sm text-white/70">
                    Conquistas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white">
                    {user.completedMissions}/
                    {user.totalMissions}
                  </p>
                  <p className="text-sm text-white/70">
                    Missões
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Progresso Geral</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/90">
                  Conclusão do Curso
                </span>
                <span className="text-white/90">
                  {progressPercentage.toFixed(2)}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2"
              />
              <p className="text-sm text-white/70">
                Você completou {user.completedMissions} de{" "}
                {user.totalMissions} missões disponíveis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Continue Learning - Dynamic based on journey status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
            {!user.hasStartedJourney ? (
              // First time user - Welcome card with Alex
              <>
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <span>Inicie Sua Jornada</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    A aventura espacial está prestes a começar!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-lg blur-xl"></div>

                    {/* Content */}
                    <div className="relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/30">
                      {/* Alex Image and Text Side by Side */}
                      <div className="flex items-center gap-6 mb-6">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.2,
                            type: "spring",
                          }}
                          className="flex-shrink-0"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full"></div>
                            <img
                              src={alexImage}
                              alt="Alex - Astronauta"
                              className="relative w-24 h-24 object-contain drop-shadow-2xl"
                            />
                          </div>
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-white">
                              Conheça Alex
                            </h4>
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed">
                            Olá, aventureiro! Sou a astronauta
                            Alex e preciso da sua ajuda para
                            salvar o planeta Euklidia. Juntos,
                            vamos dominar os segredos da
                            geometria!
                          </p>
                        </div>
                      </div>

                      {/* Mission Info */}
                      <div className="bg-black/30 rounded-lg p-4 mb-4 border border-cyan-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-cyan-400" />
                          </div>
                          <h5 className="text-white">
                            Primeira Missão
                          </h5>
                        </div>
                        <p className="text-sm text-white/70 mb-3">
                          O painel da nave sofreu danos!
                          Precisamos encaixar as peças
                          geométricas corretas para continuar
                          nossa jornada.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-purple-500/30 text-purple-200 border-purple-400/30"
                          >
                            Introdução
                          </Badge>
                          <span className="text-xs text-white/50">
                            ⏱ 10 min
                          </span>
                          <span className="text-xs text-cyan-400 ml-auto">
                            +100 XP
                          </span>
                        </div>
                      </div>

                      {/* Start Button */}
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50"
                        size="lg"
                        onClick={() =>
                          setCurrentView(
                            "knowledge-map-overlay",
                          )
                        }
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Iniciar Jornada com Alex
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </>
            ) : (
              // Returning user - Continue learning
              <>
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">
                        {user.completedMissions >= 4 ? "✓" : "▶"}
                      </span>
                    </div>
                    <span>{user.completedMissions >= 4 ? "Parabéns!" : "Continue Aprendendo"}</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {user.completedMissions >= 4 
                      ? "Você completou todas as missões! Rejogue quando quiser."
                      : "Sua próxima missão está esperando"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    key={`next-mission-${nextMission.planetId}-${user.completedMissions}`}
                    className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-purple-500/30 text-purple-200 border-purple-400/30"
                          >
                            {nextMission.planetName}
                          </Badge>
                        </div>
                        <h4 className="text-white mb-2">
                          {nextMission.title}
                        </h4>
                        <p className="text-sm text-white/70 mb-3">
                          {nextMission.description}
                        </p>
                        <div className="flex items-center space-x-2 mb-4">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            {nextMission.category}
                          </Badge>
                          <span className="text-xs text-white/50">
                            ⏱ {nextMission.time}
                          </span>
                          <span className="text-xs text-cyan-400 ml-auto">
                            +{nextMission.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      onClick={() =>
                        setCurrentView("knowledge-map-overlay")
                      }
                    >
                      {user.completedMissions >= 4 ? "🔄 Jogar Novamente" : "▶ Iniciar Missão"}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Conquistas Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userAchievements.length > 0 ? (
                <div className="space-y-3">
                  {userAchievements
                    .slice(-3)
                    .reverse()
                    .map((userAchievement) => {
                      const achievement = getAchievementById(
                        userAchievement.achievementId,
                      );
                      if (!achievement) return null;

                      const tier = tierConfig[achievement.tier];
                      const Icon = achievement.icon;
                      const date = new Date(
                        userAchievement.unlockedDate,
                      ).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      });

                      return (
                        <motion.div
                          key={userAchievement.achievementId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${tier.borderColor} ${tier.bgColor} hover:bg-white/5 transition-colors cursor-pointer`}
                          onClick={() =>
                            setCurrentView("achievements")
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-white text-sm truncate">
                              {achievement.title}
                            </h5>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`text-xs ${tier.bgColor} ${tier.textColor} border-none`}
                              >
                                {tier.label}
                              </Badge>
                              <span className="text-xs text-white/50">
                                {date}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`flex items-center space-x-1 ${tier.textColor}`}
                          >
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">
                              +{achievement.xpReward}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-purple-900/30 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white hover:border-purple-500/50"
                    onClick={() =>
                      setCurrentView("achievements")
                    }
                  >
                    Ver Todas
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Trophy className="w-16 h-16 text-white/20 mb-4" />
                  <p className="text-white/50 text-center">
                    Complete missões para ganhar conquistas!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="text-white/50 text-sm">
            © 2025 Kubrick - Jogo Educacional de Geometria
          </p>
        </div>
      </footer>

      {/* Achievement Unlocked Modal */}
      {unlockedAchievementId && (
        <AchievementUnlockedModal
          achievement={getAchievementById(
            unlockedAchievementId,
          )}
          onClose={() => setUnlockedAchievementId(null)}
        />
      )}
    </div>
  );
}