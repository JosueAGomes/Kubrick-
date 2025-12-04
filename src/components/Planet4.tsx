import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';

interface Mission {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  xp: number;
  icon: string;
}

interface Planet4Props {
  onSelectMission: (missionId: number) => void;
  completedMissions: number[];
  onBack?: () => void;
}

const Planet4: React.FC<Planet4Props> = ({ onSelectMission, completedMissions, onBack }) => {
  const missions: Mission[] = [
    {
      id: 1,
      title: 'O Grande Muro',
      description: 'Empurre as formas corretas do muro para liberar a passagem',
      status: 'available',
      xp: 150,
      icon: '🧱'
    },
    {
      id: 2,
      title: 'O Pentágono Sagrado',
      description: 'Complete o pentágono com o ângulo interno correto (540°)',
      status: completedMissions.includes(1) ? 'available' : 'locked',
      xp: 200,
      icon: '⬠'
    },
    {
      id: 3,
      title: 'Hexágonos do Caos',
      description: 'Navegue pelos labirintos completando hexágonos (720°)',
      status: completedMissions.includes(2) ? 'available' : 'locked',
      xp: 200,
      icon: '⬡'
    },
    {
      id: 4,
      title: 'O Heptágono do Tempo',
      description: 'Ative o portal temporal com o heptágono correto (900°)',
      status: completedMissions.includes(3) ? 'available' : 'locked',
      xp: 250,
      icon: '⭓'
    },
    {
      id: 5,
      title: 'O Octógono Final',
      description: 'Recupere o artefato completando o octógono (1080°)',
      status: completedMissions.includes(4) ? 'available' : 'locked',
      xp: 250,
      icon: '⬢'
    },
    {
      id: 6,
      title: 'Confronto com Olugan Kryvo',
      description: 'Enfrente o vilão em uma batalha geométrica épica!',
      status: completedMissions.includes(5) ? 'available' : 'locked',
      xp: 500,
      icon: '⚔️'
    }
  ];

  const getMissionStatus = (missionId: number) => {
    if (completedMissions.includes(missionId)) return 'completed';
    if (missionId === 1) return 'available';
    if (completedMissions.includes(missionId - 1)) return 'available';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Botão Voltar */}
        {onBack && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={onBack}
              className="border-purple-500/50 bg-purple-900/20 text-white hover:bg-purple-900/40 hover:border-purple-500"
            >
              ← Voltar ao Mapa
            </Button>
          </motion.div>
        )}
        
        {/* Header do Planeta */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6">
            <div className="relative">
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-red-500 via-orange-600 to-yellow-700 shadow-2xl shadow-red-500/50"
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    '0 0 60px rgba(239, 68, 68, 0.5)',
                    '0 0 80px rgba(239, 68, 68, 0.7)',
                    '0 0 60px rgba(239, 68, 68, 0.5)',
                  ]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl">
                ⚔️
              </div>
            </div>
          </div>
          
          <h1 className="text-white mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl">
            Reino de Kryvo
          </h1>
          <p className="text-red-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Confronto Final com Olugan Kryvo
          </p>
        </motion.div>

        {/* Narrativa */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="text-3xl sm:text-4xl">⚡</div>
                <div>
                  <h3 className="text-white mb-2 text-xl sm:text-2xl">Informações de Varek</h3>
                  <p className="text-red-300 italic text-sm sm:text-base">"A batalha final se aproxima..."</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-white/90 leading-relaxed text-sm sm:text-base">
                <p>
                  Após conseguirem escapar da tropa de Olugan, Alex e seus amigos se reúnem com 
                  Varek, o revolucionário. Ele revela informações cruciais sobre a localização de 
                  <span className="text-red-400"> Olugan Kryvo</span> e as peças finais do artefato.
                </p>
                
                <p>
                  Com determinação, a equipe se dirige ao Reino de Kryvo para o confronto final. 
                  É hora de derrotar o grande vilão e restaurar o equilíbrio geométrico do universo!
                </p>
                
                <div className="bg-red-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                  <p className="text-red-200">
                    <span className="text-red-300">Varek:</span> "O Reino de Kryvo é protegido por 
                    enigmas geométricos poderosos. Vocês precisarão dominar pentágonos, hexágonos, 
                    heptágonos e octógonos para chegar até Olugan. A fórmula <span className="text-white">(n-2) × 180°</span> 
                    será sua aliada para calcular os ângulos internos!"
                  </p>
                </div>
                
                <p className="text-red-300">
                  Esta é a missão final de Alex. O destino de Kubrick e de todo o universo está em suas mãos. 
                  Prepare-se para o desafio mais difícil de todos!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid de Missões */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white mb-6 sm:mb-8 text-center text-2xl sm:text-3xl">
            Missões do Reino de Kryvo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {missions.map((mission, index) => {
              const status = getMissionStatus(mission.id);
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const isFinalBoss = mission.id === 6;
              
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={isFinalBoss ? "md:col-span-2 lg:col-span-3" : ""}
                >
                  <Card
                    className={`
                      relative overflow-hidden transition-all duration-300 cursor-pointer
                      ${isLocked 
                        ? 'bg-black/20 border-gray-700/50 opacity-60 cursor-not-allowed' 
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
                        : isFinalBoss
                        ? 'bg-gradient-to-br from-red-900/60 to-orange-900/60 border-red-500/70 hover:border-red-400 hover:shadow-2xl hover:shadow-red-500/50'
                        : 'bg-black/40 border-red-500/50 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/30'
                      }
                    `}
                    onClick={() => !isLocked && onSelectMission(mission.id)}
                  >
                    <CardContent className={`p-4 sm:p-6 ${isFinalBoss ? 'md:p-8' : ''}`}>
                      {/* Ícone e Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${isFinalBoss ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'}`}>
                          {isLocked ? '🔒' : isCompleted ? '✅' : mission.icon}
                        </div>
                        
                        {isCompleted && (
                          <div className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs border border-green-500/30">
                            COMPLETA
                          </div>
                        )}
                        
                        {!isCompleted && !isLocked && (
                          <div className={`${isFinalBoss ? 'bg-red-500/30 text-red-300 border-red-500/50' : 'bg-red-500/20 text-red-400 border-red-500/30'} px-2 sm:px-3 py-1 rounded-full text-xs border`}>
                            +{mission.xp} XP
                          </div>
                        )}
                      </div>
                      
                      {/* Título e Descrição */}
                      <h3 className={`mb-2 ${isFinalBoss ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl'} ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        Fase {mission.id}: {mission.title}
                      </h3>
                      
                      <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isLocked ? 'text-gray-600' : isFinalBoss ? 'text-red-200 text-base' : 'text-white/80'}`}>
                        {mission.description}
                      </p>
                      
                      {/* Botão de Ação */}
                      {!isLocked && (
                        <div className="mt-4 pt-4 border-t border-red-500/20">
                          <div className={`${isFinalBoss ? 'text-red-300' : 'text-red-400'} text-xs sm:text-sm flex items-center justify-between`}>
                            <span className="flex items-center">
                              {isFinalBoss && <Sparkles className="w-4 h-4 mr-2" />}
                              {isCompleted ? 'Revisar Missão' : isFinalBoss ? 'Iniciar Batalha Final' : 'Iniciar Missão'}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                      
                      {isLocked && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="text-gray-600 text-xs sm:text-sm flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            <span>Complete a fase anterior</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dica Educacional */}
        <motion.div 
          className="max-w-3xl mx-auto mt-8 sm:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur-xl border-red-500/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-3xl">💡</div>
                <div>
                  <h4 className="text-red-300 mb-2 text-base sm:text-lg">Fórmula dos Ângulos Internos</h4>
                  <p className="text-red-200 text-xs sm:text-sm leading-relaxed mb-3">
                    A soma dos ângulos internos de um polígono regular é dada por: <span className="text-white">S = (n - 2) × 180°</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-950/30 p-2 rounded">
                      <span className="text-white">Pentágono (n=5):</span> <span className="text-red-300">540°</span>
                    </div>
                    <div className="bg-red-950/30 p-2 rounded">
                      <span className="text-white">Hexágono (n=6):</span> <span className="text-red-300">720°</span>
                    </div>
                    <div className="bg-red-950/30 p-2 rounded">
                      <span className="text-white">Heptágono (n=7):</span> <span className="text-red-300">900°</span>
                    </div>
                    <div className="bg-red-950/30 p-2 rounded">
                      <span className="text-white">Octógono (n=8):</span> <span className="text-red-300">1080°</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Planet4;
