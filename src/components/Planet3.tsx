import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface Mission {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  xp: number;
  icon: string;
}

interface Planet3Props {
  onSelectMission: (missionId: number) => void;
  completedMissions: number[];
  onBack?: () => void;
}

const Planet3: React.FC<Planet3Props> = ({ onSelectMission, completedMissions, onBack }) => {
  const missions: Mission[] = [
    {
      id: 1,
      title: 'Fugitivos! Formação 4',
      description: 'Abra as portas da prisão identificando figuras com 4 lados iguais',
      status: 'available',
      xp: 150,
      icon: '🔓'
    },
    {
      id: 2,
      title: 'Quadrado!',
      description: 'Ative o painel de energia construindo quadrados perfeitos',
      status: completedMissions.includes(1) ? 'available' : 'locked',
      xp: 200,
      icon: '⬛'
    },
    {
      id: 3,
      title: 'Retângulo!',
      description: 'Desative as barreiras construindo retângulos precisos',
      status: completedMissions.includes(2) ? 'available' : 'locked',
      xp: 200,
      icon: '▭'
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
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 shadow-2xl shadow-purple-500/50"
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    '0 0 60px rgba(168, 85, 247, 0.5)',
                    '0 0 80px rgba(168, 85, 247, 0.7)',
                    '0 0 60px rgba(168, 85, 247, 0.5)',
                  ]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl">
                🟪
              </div>
            </div>
          </div>
          
          <h1 className="text-white mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl">
            Planeta Quarix
          </h1>
          <p className="text-purple-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Reino dos Quadriláteros
          </p>
        </motion.div>

        {/* Narrativa */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="text-3xl sm:text-4xl">📡</div>
                <div>
                  <h3 className="text-white mb-2 text-xl sm:text-2xl">Transmissão de Varek</h3>
                  <p className="text-purple-300 italic text-sm sm:text-base">\"Coordenadas recebidas de Nexar...\"</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-white/90 leading-relaxed text-sm sm:text-base">
                <p>
                  Após reunirem a 1ª parte do artefato em NORA, Alex e seus amigos partiram em direção 
                  ao Quarix, seguindo as coordenadas informadas por Nexar. Ao pousarem no novo planeta, 
                  perceberam que o local não tinha nenhum sinal de destruição. Havia algo errado.
                </p>
                
                <p>
                  De repente, a tripulação foi capturada pelos habitantes locais e foram postos em uma 
                  espécie de cadeia.
                </p>
                
                <div className="bg-purple-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border-l-4 border-purple-500">
                  <p className="text-purple-200">
                    <span className="text-purple-300">Varek:</span> \"Não se preocupem, eu os ajudarei a escapar. 
                    Fui forçado a trabalhar construindo fortalezas para as tropas de Olugan, mas faço parte 
                    de um grupo de revolucionários.\"
                  </p>
                </div>
                
                <p>
                  Durante a fuga, Varek explica que o exército inimigo usa estruturas baseadas em 
                  <span className="text-purple-300"> quadriláteros</span> (quadrados, retângulos) 
                  para organizar suas patrulhas e campos de força.
                </p>
                
                <p className="text-purple-300">
                  Alex precisa utilizar essas formas para desativar barreiras, escapar de armadilhas, 
                  buscar as informações sobre as peças do artefato restantes e partir para outro planeta!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid de Missões */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white mb-6 sm:mb-8 text-center text-2xl sm:text-3xl">
            Missões de Quarix
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {missions.map((mission, index) => {
              const status = getMissionStatus(mission.id);
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`
                      relative overflow-hidden transition-all duration-300 cursor-pointer
                      ${isLocked 
                        ? 'bg-black/20 border-gray-700/50 opacity-60 cursor-not-allowed' 
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
                        : 'bg-black/40 border-purple-500/50 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30'
                      }
                    `}
                    onClick={() => !isLocked && onSelectMission(mission.id)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      {/* Ícone e Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl sm:text-5xl">
                          {isLocked ? '🔒' : isCompleted ? '✅' : mission.icon}
                        </div>
                        
                        {isCompleted && (
                          <div className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs border border-green-500/30">
                            COMPLETA
                          </div>
                        )}
                        
                        {!isCompleted && !isLocked && (
                          <div className="bg-purple-500/20 text-purple-400 px-2 sm:px-3 py-1 rounded-full text-xs border border-purple-500/30">
                            +{mission.xp} XP
                          </div>
                        )}
                      </div>
                      
                      {/* Título e Descrição */}
                      <h3 className={`mb-2 text-lg sm:text-xl ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        Fase {mission.id}: {mission.title}
                      </h3>
                      
                      <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isLocked ? 'text-gray-600' : 'text-white/80'}`}>
                        {mission.description}
                      </p>
                      
                      {/* Botão de Ação */}
                      {!isLocked && (
                        <div className="mt-4 pt-4 border-t border-purple-500/20">
                          <div className="text-purple-400 text-xs sm:text-sm flex items-center justify-between">
                            <span>{isCompleted ? 'Revisar Missão' : 'Iniciar Missão'}</span>
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
          <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-3xl">💡</div>
                <div>
                  <h4 className="text-purple-300 mb-2 text-base sm:text-lg">Aprendizado: Quadriláteros</h4>
                  <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                    Quadriláteros são polígonos com 4 lados e 4 ângulos. Nesta jornada você aprenderá sobre 
                    <span className="text-white"> quadrados</span> (4 lados iguais e 4 ângulos de 90°) e 
                    <span className="text-white"> retângulos</span> (lados opostos iguais e 4 ângulos de 90°).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Planet3;