import React, { useState, useEffect } from 'react';
import Planet3 from './Planet3';
import Mission1Planet3 from './Mission1Planet3';
import Mission2Planet3 from './Mission2Planet3';
import Mission3Planet3 from './Mission3Planet3';
import { useUser } from '../contexts/UserContext';

interface Planet3ContainerProps {
  onComplete: () => void;
  onBack: () => void;
}

const Planet3Container: React.FC<Planet3ContainerProps> = ({ onComplete, onBack }) => {
  const { user, completeMission, unlockPlanet, getPlanetProgress, savePlanetProgress } = useUser();
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  // Carregar progresso salvo quando o componente monta
  useEffect(() => {
    const savedProgress = getPlanetProgress(3);
    console.log('📂 Planeta 3 - Carregando progresso:', savedProgress);
    setCompletedMissions(savedProgress);
  }, []); // Apenas quando monta

  // Função chamada quando uma missão individual é completada
  const handleMissionComplete = async (missionId: number, xp: number) => {
    console.log(`🎯 Planeta 3 - Missão ${missionId} completada com ${xp} XP`);
    
    // Verificar se a missão já estava completa
    if (completedMissions.includes(missionId)) {
      console.log(`⚠️ Planeta 3 - Missão ${missionId} já estava completa, voltando ao planeta`);
      setActiveMission(null);
      return;
    }

    // NÃO adicionar XP aqui - vamos acumular e adicionar apenas quando completar todas as 3
    // await completeMission(xp);
    console.log(`✅ Planeta 3 - Missão ${missionId} completada (XP será adicionado ao completar todas)`);
    
    // Marcar missão como completa
    const newCompleted = [...completedMissions, missionId];
    setCompletedMissions(newCompleted);
    
    // Salvar progresso no contexto
    await savePlanetProgress(3, newCompleted);
    console.log(`💾 Planeta 3 - Progresso salvo: ${newCompleted.length}/3 missões`);
    
    // Verificar se TODAS as 3 missões foram completadas
    if (newCompleted.length === 3) {
      console.log('🎉 Planeta 3 - TODAS as 3 missões completadas!');
      console.log('🚀 Planeta 3 - Adicionando XP total e desbloqueando Planeta 4...');
      
      // XP total das 3 missões: 150 + 200 + 200 = 550
      await completeMission(550);
      
      // Desbloquear Planeta 4 IMEDIATAMENTE
      await unlockPlanet(4);
      
      console.log('✅ Planeta 3 - Planeta 4 desbloqueado! Chamando onComplete...');
      
      // Chamar onComplete (volta ao mapa)
      onComplete();
      return;
    }
    
    // Se não completou todas, apenas volta ao planeta
    console.log(`↩️ Planeta 3 - Voltando ao planeta (${newCompleted.length}/3 completas)`);
    setActiveMission(null);
  };

  // Renderizar missão ativa
  if (activeMission === 1) {
    return (
      <Mission1Planet3
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(1, 150);
        }}
      />
    );
  }

  if (activeMission === 2) {
    return (
      <Mission2Planet3
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(2, 200);
        }}
      />
    );
  }

  if (activeMission === 3) {
    return (
      <Mission3Planet3
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(3, 200);
        }}
      />
    );
  }

  // Renderiza a tela do planeta com as missões
  return (
    <Planet3
      onSelectMission={(missionId) => setActiveMission(missionId)}
      completedMissions={completedMissions}
      onBack={onBack}
    />
  );
};

export default Planet3Container;