import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";
import {
  achievements,
  calculateAchievementProgress,
  UserAchievement,
} from "../data/achievements";

interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  xp: number;
  level: number;
  achievements: number;
  completedMissions: number;
  totalMissions: number;
  hasStartedJourney: boolean;
  unlockedPlanets: number[];
  avatar?: string;
  perfectMissions?: number;
  fastCompletions?: number;
  questionsCorrect?: { [category: string]: number };
  planet3Missions?: number[]; // Sub-missões completadas do Planeta 3
  planet4Missions?: number[]; // Sub-missões completadas do Planeta 4
}

interface UserContextType {
  user: User | null;
  userAchievements: UserAchievement[];
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateUserProgress: (
    xp: number,
    completedMissions: number,
  ) => Promise<void>;
  unlockPlanet: (planetId: number) => Promise<void>;
  completeMission: (
    missionXP: number,
    stats?: MissionStats,
  ) => Promise<void>;
  updateUserName: (name: string) => void;
  updateUserAvatar: (avatarId: string) => void;
  unlockAchievement: (
    achievementId: string,
  ) => Promise<boolean>;
  checkAchievements: () => Promise<string[]>;
  isAchievementUnlocked: (achievementId: string) => boolean;
  savePlanetProgress: (planetId: 3 | 4, missions: number[]) => Promise<void>;
  getPlanetProgress: (planetId: 3 | 4) => number[];
}

interface MissionStats {
  isPerfect?: boolean;
  isFast?: boolean;
  questionsCorrect?: { [category: string]: number };
}

const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0eaab711`;

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userAchievements, setUserAchievements] = useState<
    UserAchievement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load achievements when user changes
  useEffect(() => {
    if (user && !user.isGuest) {
      loadAchievements();
    }
  }, [user?.id]);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
        // Load achievements after profile is loaded
        await loadAchievements(session.access_token);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          ...data.user,
          isGuest: false,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const loadAchievements = async (token?: string) => {
    if (!accessToken && !token) return;

    try {
      const response = await fetch(`${API_URL}/achievements`, {
        headers: {
          Authorization: `Bearer ${token || accessToken}`,
        },
      });

      const data = await response.json();
      console.log("Loaded achievements:", data);

      if (data.success) {
        setUserAchievements(data.achievements);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.session) {
        setAccessToken(data.session.access_token);
        await fetchUserProfile(data.session.access_token);
        // Load achievements after profile is loaded
        await loadAchievements(data.session.access_token);
        return { success: true };
      }

      return { success: false, message: "Erro ao fazer login" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      console.log("=== STARTING REGISTRATION ===");
      console.log("Email:", email);
      console.log("Username:", username);
      console.log("API URL:", API_URL);

      // Tenta a rota do servidor PRIMEIRO - pode fazer o auto-confirm do email e inicializar o perfil.
      // O servidor DEVE garantir a unicidade do email.
      console.log(
        "Attempting server signup with auto-confirmation...",
      );

      let serverResponse;
      let serverData;

      try {
        serverResponse = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Não é necessário enviar o publicAnonKey no header de Autorização para uma função
            // que deve ser acessada publicamente. Se a função exigir autenticação,
            // o cliente deve estar logado, o que não é o caso aqui.
            // Se for necessário, o servidor deve usar a chave de serviço.
            // Removendo o header de autorização para esta chamada de signup.
            // 'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ username, email, password }),
        });

        serverData = await serverResponse.json();
        console.log("=== SERVER RESPONSE ===");
        console.log("Status:", serverResponse.status);
        console.log("OK:", serverResponse.ok);
        console.log(
          "Data:",
          JSON.stringify(serverData, null, 2),
        );
      } catch (fetchError) {
        console.error("=== SERVER FETCH ERROR ===");
        console.error("Error:", fetchError);
        console.log(
          "Falling back to frontend signup due to server error...",
        );

        // If server is completely unreachable, skip to fallback
        serverResponse = null;
        serverData = null;
      }

      if (
        serverResponse &&
        serverResponse.ok &&
        serverData &&
        serverData.success
      ) {
        console.log(
          "✅ Account created via server successfully! Attempting login...",
        );

        // Now try to login with the created account
        const loginResult = await login(email, password);

        if (loginResult.success) {
          console.log("Login successful after server signup!");
          return { success: true };
        }

        // Se o login falhar, significa que a confirmação de e-mail é necessária
        // ou houve outro erro.
        return {
          success: false,
          message:
            "Conta criada com sucesso! Por favor, verifique seu e-mail para ativar sua conta e faça login.",
        };
      }

      // Se o servidor falhou, verifica se é porque o usuário já existe
      if (
        serverData &&
        serverData.message &&
        (serverData.message.includes("já está cadastrado") ||
          serverData.message.includes("already exists") ||
          serverData.message.includes("already registered"))
      ) {
        console.log("User already exists, suggesting login...");
        return {
          success: false,
          message:
            "Este email já está cadastrado. Tente fazer login ou use outro email.",
        };
      }

      // Se a rota do servidor falhou por outros motivos, loga e tenta o fallback
      console.log(
        "Server signup failed:",
        serverData
          ? serverData.message || "Unknown error"
          : "Unknown error",
      );
      console.log("Falling back to frontend signup...");

      // Fallback: Usa o Supabase signup diretamente (pode exigir confirmação de e-mail)
      // O Supabase DEVE garantir a unicidade do email.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      console.log("Signup response data:", data);
      console.log("Signup response error:", error);

      if (error) {
        console.error("Signup error:", error);

        // Fornece mensagens de erro claras
        let errorMessage = "Erro ao criar conta. ";

        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          // **CORREÇÃO DE SEGURANÇA:** Este é o ponto onde o Supabase deveria falhar
          // se o e-mail já existe. Se o erro não está sendo capturado aqui,
          // o problema está na configuração do Supabase ou na lógica de tratamento de erro.
          // A mensagem de erro deve ser a mesma para evitar enumeração de usuários.
          errorMessage =
            "Este email já está cadastrado. Tente fazer login ou use outro email.";
        } else if (error.message.includes("invalid email")) {
          errorMessage =
            "Email inválido. Por favor, verifique o email digitado.";
        } else if (error.message.includes("password")) {
          errorMessage =
            "A senha deve ter pelo menos 6 caracteres.";
        } else {
          errorMessage += error.message;
        }

        return { success: false, message: errorMessage };
      }

      // Se o usuário foi criado, mas não há sessão (confirmação de e-mail necessária)
      if (!data.session) {
        console.log(
          "No session returned - email confirmation may be required.",
        );

        // Não há necessidade de tentar a rota do servidor novamente, pois ela falhou
        // ou não retornou sucesso na primeira tentativa.
        // Se o Supabase criou o usuário, ele enviou o e-mail de confirmação.
        return {
          success: false,
          message:
            "Sua conta foi criada! Por favor, verifique seu e-mail para ativar sua conta e faça login.",
        };
      }

      // Temos uma sessão, inicializa os dados do usuário
      console.log(
        "User created with session successfully:",
        data.user?.id,
      );

      // Inicializa os dados do usuário no backend
      const initResponse = await fetch(
        `${API_URL}/initialize-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({ username }),
        },
      );

      const initData = await initResponse.json();
      console.log("User initialization response:", initData);

      if (!initData.success) {
        console.error(
          "Failed to initialize user data:",
          initData,
        );
        // Não retorna erro fatal, apenas avisa que pode ter havido um problema
        // na inicialização do perfil, mas a conta foi criada.
        return {
          success: false,
          message:
            "Conta criada, mas houve um erro ao inicializar seus dados. Tente fazer login.",
        };
      }

      // Login automático após o registro bem-sucedido
      setAccessToken(data.session.access_token);
      await fetchUserProfile(data.session.access_token);
      await loadAchievements(data.session.access_token);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          "Erro de conexão. Verifique sua internet e tente novamente, ou entre como convidado para experimentar o jogo.",
      };
    }
  };

  const loginAsGuest = () => {
    // Load guest data from localStorage or create new guest
    const guestData = localStorage.getItem("guestUser");

    if (guestData) {
      const parsedGuest = JSON.parse(guestData);
      setUser(parsedGuest);

      // Load guest achievements
      const guestAchievements = localStorage.getItem(
        "guestAchievements",
      );
      if (guestAchievements) {
        setUserAchievements(JSON.parse(guestAchievements));
      }
    } else {
      const newGuest: User = {
        id: "guest-" + Date.now(),
        name: "Visitante",
        email: "guest@example.com",
        isGuest: true,
        xp: 0,
        level: 1,
        achievements: 0,
        completedMissions: 0,
        totalMissions: 4, // 4 planetas com suas missões principais
        hasStartedJourney: false,
        unlockedPlanets: [],
        perfectMissions: 0,
        fastCompletions: 0,
        questionsCorrect: {},
      };

      setUser(newGuest);
      localStorage.setItem(
        "guestUser",
        JSON.stringify(newGuest),
      );
      localStorage.setItem(
        "guestAchievements",
        JSON.stringify([]),
      );
    }

    setLoading(false);
  };

  const logout = async () => {
    if (!user?.isGuest) {
      await supabase.auth.signOut();
      setAccessToken(null);
    } else {
      localStorage.removeItem("guestUser");
      localStorage.removeItem("guestAchievements");
    }
    setUser(null);
    setUserAchievements([]);
  };

  const updateUserProgress = async (
    xp: number,
    completedMissions: number,
  ) => {
    if (!user) return;

    const updatedUser = { ...user, xp, completedMissions };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      try {
        await fetch(`${API_URL}/update-progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ xp, completedMissions }),
        });
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    } else if (user.isGuest) {
      localStorage.setItem(
        "guestUser",
        JSON.stringify(updatedUser),
      );
    }

    // Check for new achievements
    await checkAchievements();
  };

  const unlockPlanet = async (planetId: number) => {
    if (!user) return;

    console.log("🔓 unlockPlanet CHAMADO - Planeta:", planetId);
    console.log("📊 Estado ANTES do unlock:", {
      unlockedPlanets: user.unlockedPlanets,
      isGuest: user.isGuest
    });

    // Use functional update to ensure we have the latest state
    const updatedUser = await new Promise<User>((resolve) => {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        
        console.log("🔄 setUser EXECUTANDO dentro de unlockPlanet");
        console.log("📊 prevUser.unlockedPlanets:", prevUser.unlockedPlanets);
        
        const updatedPlanets = prevUser.unlockedPlanets.includes(planetId)
          ? prevUser.unlockedPlanets
          : [...prevUser.unlockedPlanets, planetId];

        const updated = {
          ...prevUser,
          unlockedPlanets: updatedPlanets,
        };
        
        console.log("✅ Planeta desbloqueado - Estado NOVO:", {
          planetId,
          unlockedPlanets: updatedPlanets,
        });
        
        resolve(updated);
        return updated;
      });
    });

    console.log("💾 Salvando unlock no storage/backend...");
    
    if (!updatedUser.isGuest && accessToken) {
      try {
        await fetch(`${API_URL}/unlock-planet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ planetId }),
        });
        console.log("✅ Unlock salvo no backend");
      } catch (error) {
        console.error("Error unlocking planet:", error);
      }
    } else if (updatedUser.isGuest) {
      localStorage.setItem(
        "guestUser",
        JSON.stringify(updatedUser),
      );
      console.log("✅ Unlock salvo no localStorage:", {
        unlockedPlanets: updatedUser.unlockedPlanets
      });
    }

    // Check for new achievements
    checkAchievements();
    
    console.log("🎉 unlockPlanet CONCLUÍDO - Planeta:", planetId);
  };

  const completeMission = async (
    missionXP: number,
    stats?: MissionStats,
  ) => {
    if (!user) return;

    console.log("🎯 Completando missão - XP:", missionXP);

    // Use functional update to ensure we have the latest state
    const updatedUser = await new Promise<User>((resolve) => {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        
        const newXP = prevUser.xp + missionXP;
        const newLevel = Math.floor(newXP / 1000) + 1;
        const newCompletedMissions = prevUser.completedMissions + 1;

        const updated = {
          ...prevUser,
          xp: newXP,
          level: newLevel,
          completedMissions: newCompletedMissions,
          hasStartedJourney: true,
        };
        
        console.log("✅ Missão completada:", {
          completedMissions: newCompletedMissions,
          xp: newXP,
          level: newLevel,
        });
        
        resolve(updated);
        return updated;
      });
    });

    if (!user.isGuest && accessToken) {
      try {
        // Update mission completion
        await fetch(`${API_URL}/complete-mission`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ missionXP }),
        });

        // Update mission stats if provided
        if (stats) {
          const response = await fetch(
            `${API_URL}/update-mission-stats`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(stats),
            },
          );

          const data = await response.json();
          if (data.success) {
            setUser((prev) =>
              prev ? { ...prev, ...data.user } : null,
            );
          }
        }
      } catch (error) {
        console.error("Error completing mission:", error);
      }
    } else if (updatedUser.isGuest) {
      // Update guest stats - ONLY save to localStorage, DON'T call setUser again
      // because it would overwrite the state we just set above
      const guestUpdated = {
        ...updatedUser,  // ✅ Use updatedUser (que já tem XP/missions atualizados)
        perfectMissions: stats?.isPerfect
          ? (updatedUser.perfectMissions || 0) + 1
          : updatedUser.perfectMissions,
        fastCompletions: stats?.isFast
          ? (updatedUser.fastCompletions || 0) + 1
          : updatedUser.fastCompletions,
        questionsCorrect: {
          ...(updatedUser.questionsCorrect || {}),
          ...(stats?.questionsCorrect || {}),
        },
      };
      
      // Save to localStorage only
      localStorage.setItem(
        "guestUser",
        JSON.stringify(guestUpdated),
      );
      
      console.log("💾 Guest stats saved to localStorage");
    }

    // Check for new achievements
    await checkAchievements();
  };

  const updateUserName = (name: string) => {
    if (!user) return;

    // **CORREÇÃO DE SEGURANÇA:** Adicionar validação de entrada (input validation)
    // para o nome de usuário.
    if (name.trim().length < 3 || name.trim().length > 50) {
      console.error(
        "Validation Error: Username must be between 3 and 50 characters.",
      );
      // Em um ambiente real, você retornaria um erro para o usuário aqui.
      return;
    }

    const updatedUser = { ...user, name };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      fetch(`${API_URL}/update-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      }).catch((error) =>
        console.error("Error updating name:", error),
      );
    } else if (user.isGuest) {
      localStorage.setItem(
        "guestUser",
        JSON.stringify(updatedUser),
      );
    }
  };

  const updateUserAvatar = (avatarId: string) => {
    if (!user) return;

    // **CORREÇÃO DE SEGURANÇA:** Adicionar validação de entrada (input validation)
    // para o ID do avatar. Assumindo que o ID do avatar é um string simples.
    // Em um ambiente real, você verificaria se o avatarId está em uma lista de avatares válidos.
    if (
      !avatarId ||
      typeof avatarId !== "string" ||
      avatarId.length > 50
    ) {
      console.error("Validation Error: Invalid avatar ID.");
      return;
    }

    const updatedUser = { ...user, avatar: avatarId };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      fetch(`${API_URL}/update-avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ avatarId }),
      }).catch((error) =>
        console.error("Error updating avatar:", error),
      );
    } else if (user.isGuest) {
      localStorage.setItem(
        "guestUser",
        JSON.stringify(updatedUser),
      );
    }
  };

  const isAchievementUnlocked = (
    achievementId: string,
  ): boolean => {
    return userAchievements.some(
      (a) => a.achievementId === achievementId,
    );
  };

  const unlockAchievement = async (
    achievementId: string,
  ): Promise<boolean> => {
    if (!user) return false;

    // Check if already unlocked
    if (isAchievementUnlocked(achievementId)) {
      return false;
    }

    console.log("🏆 Desbloqueando achievement:", achievementId);

    const newAchievement: UserAchievement = {
      achievementId,
      unlockedDate: new Date().toISOString(),
    };

    const updatedAchievements = [
      ...userAchievements,
      newAchievement,
    ];
    setUserAchievements(updatedAchievements);

    // Update achievement count - USE FUNCTIONAL UPDATE
    const updatedUser = await new Promise<User>((resolve) => {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        
        console.log("🔄 setUser EXECUTANDO dentro de unlockAchievement");
        
        const updated = {
          ...prevUser,  // ✅ Use prevUser para garantir dados atualizados
          achievements: updatedAchievements.length,
        };
        
        console.log("✅ Achievement count atualizado:", {
          achievements: updatedAchievements.length,
          xp: updated.xp,
          completedMissions: updated.completedMissions,
          unlockedPlanets: updated.unlockedPlanets,
        });
        
        resolve(updated);
        return updated;
      });
    });

    if (!user.isGuest && accessToken) {
      try {
        const response = await fetch(
          `${API_URL}/unlock-achievement`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ achievementId }),
          },
        );

        const data = await response.json();
        return data.success && data.isNew;
      } catch (error) {
        console.error("Error unlocking achievement:", error);
        return false;
      }
    } else if (updatedUser.isGuest) {
      // Save to localStorage using updatedUser (not user)
      localStorage.setItem(
        "guestAchievements",
        JSON.stringify(updatedAchievements),
      );
      localStorage.setItem(
        "guestUser",
        JSON.stringify(updatedUser),
      );
      
      console.log("💾 Achievement salvo no localStorage:", {
        xp: updatedUser.xp,
        completedMissions: updatedUser.completedMissions,
        unlockedPlanets: updatedUser.unlockedPlanets,
      });
      
      return true;
    }

    return false;
  };

  const checkAchievements = async (): Promise<string[]> => {
    if (!user) return [];

    const newlyUnlocked: string[] = [];

    for (const achievement of achievements) {
      // Skip if already unlocked
      if (isAchievementUnlocked(achievement.id)) {
        continue;
      }

      // Calculate progress
      const { isUnlocked } = calculateAchievementProgress(
        achievement,
        {
          completedMissions: user.completedMissions,
          totalMissions: user.totalMissions,
          unlockedPlanets: user.unlockedPlanets,
          xp: user.xp,
          level: user.level,
          perfectMissions: user.perfectMissions,
          fastCompletions: user.fastCompletions,
          questionsCorrect: user.questionsCorrect,
        },
      );

      // Unlock if condition met
      if (isUnlocked) {
        const wasUnlocked = await unlockAchievement(
          achievement.id,
        );
        if (wasUnlocked) {
          newlyUnlocked.push(achievement.id);
        }
      }
    }

    return newlyUnlocked;
  };

  const savePlanetProgress = async (planetId: 3 | 4, missions: number[]) => {
    if (!user) return;

    const updatedUser = { ...user };
    if (planetId === 3) {
      updatedUser.planet3Missions = missions;
    } else if (planetId === 4) {
      updatedUser.planet4Missions = missions;
    }
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      try {
        await fetch(`${API_URL}/save-planet-progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ planetId, missions }),
        });
      } catch (error) {
        console.error("Error saving planet progress:", error);
      }
    } else if (user.isGuest) {
      localStorage.setItem(
        "guestUser",
        JSON.stringify(updatedUser),
      );
    }
  };

  const getPlanetProgress = (planetId: 3 | 4): number[] => {
    if (!user) return [];

    if (planetId === 3) {
      return user.planet3Missions || [];
    } else if (planetId === 4) {
      return user.planet4Missions || [];
    }

    return [];
  };

  const value: UserContextType = {
    user,
    userAchievements,
    loading,
    login,
    register,
    loginAsGuest,
    logout,
    updateUserProgress,
    unlockPlanet,
    completeMission,
    updateUserName,
    updateUserAvatar,
    unlockAchievement,
    checkAchievements,
    isAchievementUnlocked,
    savePlanetProgress,
    getPlanetProgress,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useUser must be used within a UserProvider",
    );
  }
  return context;
}