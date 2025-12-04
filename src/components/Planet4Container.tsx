import React, { useState, useEffect } from 'react';
import Planet4 from './Planet4';
import Mission1Planet4 from './missions/Mission1Planet4';
import Mission2Planet4 from './missions/Mission2Planet4';
import Mission3Planet4 from './missions/Mission3Planet4';
import Mission4Planet4 from './missions/Mission4Planet4';
import Mission5Planet4 from './missions/Mission5Planet4';
import Mission6Planet4 from './missions/Mission6Planet4';
import { useUser } from '../contexts/UserContext';

interface Planet4ContainerProps {
  onComplete: () => void;
  onBack: () => void;
}

const Planet4Container: React.FC<Planet4ContainerProps> = ({ onComplete, onBack }) => {
  const { user, completeMission, getPlanetProgress, savePlanetProgress } = useUser();
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  // Carregar progresso salvo quando o componente monta
  useEffect(() => {
    const savedProgress = getPlanetProgress(4);
    console.log('📂 Planeta 4 - Carregando progresso:', savedProgress);
    setCompletedMissions(savedProgress);
  }, []); // Apenas quando monta

  // Função chamada quando uma missão individual é completada
  const handleMissionComplete = async (missionId: number, xp: number) => {
    console.log(`🎯 Planeta 4 - Missão ${missionId} completada com ${xp} XP`);
    
    // Verificar se a missão já estava completa
    if (completedMissions.includes(missionId)) {
      console.log(`⚠️ Planeta 4 - Missão ${missionId} já estava completa, voltando ao planeta`);
      setActiveMission(null);
      return;
    }

    // NÃO adicionar XP aqui - vamos acumular e adicionar apenas quando completar todas as 6
    // await completeMission(xp);
    console.log(`✅ Planeta 4 - Missão ${missionId} completada (XP será adicionado ao completar todas)`);
    
    // Marcar missão como completa
    const newCompleted = [...completedMissions, missionId];
    setCompletedMissions(newCompleted);
    
    // Salvar progresso no contexto
    await savePlanetProgress(4, newCompleted);
    console.log(`💾 Planeta 4 - Progresso salvo: ${newCompleted.length}/6 missões`);
    
    // Verificar se TODAS as 6 missões foram completadas
    if (newCompleted.length === 6) {
      console.log('🎉 Planeta 4 - TODAS as 6 missões completadas!');
      console.log('🏆 JOGO FINALIZADO! Adicionando XP total...');
      
      // XP total das 6 missões: 150 + 200 + 200 + 250 + 250 + 300 = 1350
      await completeMission(1350);
      
      // Chamar onComplete (volta ao mapa)
      onComplete();
      return;
    }
    
    // Se não completou todas, apenas volta ao planeta
    console.log(`↩️ Planeta 4 - Voltando ao planeta (${newCompleted.length}/6 completas)`);
    setActiveMission(null);
  };

  // Renderizar missão ativa
  if (activeMission === 1) {
    return (
      <Mission1Planet4
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(1, 150);
        }}
      />
    );
  }

  if (activeMission === 2) {
    return (
      <Mission2Planet4
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(2, 200);
        }}
      />
    );
  }

  if (activeMission === 3) {
    return (
      <Mission3Planet4
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(3, 200);
        }}
      />
    );
  }

  if (activeMission === 4) {
    return (
      <Mission4Planet4
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(4, 250);
        }}
      />
    );
  }

  if (activeMission === 5) {
    return (
      <Mission5Planet4
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(5, 250);
        }}
      />
    );
  }

  if (activeMission === 6) {
    return (
      <Mission6Planet4
        onBack={() => setActiveMission(null)}
        onComplete={async () => {
          await handleMissionComplete(6, 300);
        }}
      />
    );
  }

  // Renderiza a tela do planeta com as missões
  return (
    <Planet4
      onSelectMission={(missionId) => setActiveMission(missionId)}
      completedMissions={completedMissions}
      onBack={onBack}
    />
  );
};

export default Planet4Container;