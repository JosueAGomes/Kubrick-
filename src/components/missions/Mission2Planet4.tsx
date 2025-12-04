import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface Mission2Planet4Props {
  onBack: () => void;
  onComplete: () => void;
}

const Mission2Planet4: React.FC<Mission2Planet4Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'intro' | 'game' | 'result'>('intro');
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Pentágono: (5-2) × 180° = 540°
  // Dividido em 4 partes conhecidas e 1 desconhecida
  const knownAngles = [108, 108, 108, 108]; // 4 ângulos de 108°
  const missingAngle = 108; // O ângulo que falta
  const totalSum = 540;
  const currentSum = knownAngles.reduce((a, b) => a + b, 0);

  // Opções de resposta (3 erradas e 1 certa)
  const angleOptions = [
    { value: 90, label: '90°' },
    { value: 108, label: '108°' },
    { value: 120, label: '120°' },
    { value: 144, label: '144°' },
  ].sort(() => Math.random() - 0.5); // Randomizar ordem

  const handleSubmit = () => {
    if (selectedAngle === missingAngle) {
      setStep('result');
    }
  };

  const renderPentagon = () => {
    const points: string[] = [];
    const sides = 5;
    const radius = 80;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = 150 + radius * Math.cos(angle);
      const y = 150 + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  const pentagonPoints = renderPentagon();

  // Calcular posições dos ângulos no pentágono
  const getAnglePosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const radius = 60;
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Exit Button */}
      <motion.div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="outline"
          size="sm"
          className="border-red-500/50 bg-red-900/20 text-white hover:bg-red-900/40 hover:border-red-500"
          onClick={() => setShowExitDialog(true)}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </motion.div>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-slate-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Você deseja realmente sair?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Seu progresso será perdido e você voltará ao planeta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={onBack}
            >
              Sim, sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stars */}
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

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {step === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="text-center mb-6">
                    <div className="text-5xl sm:text-6xl mb-4">⬠</div>
                    <h2 className="text-white mb-4 text-2xl sm:text-3xl">
                      Fase 2: O Pentágono Sagrado
                    </h2>
                  </div>

                  <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mb-8">
                    <p>
                      Dentro da cidadela, Alex encontra uma sala pentagonal em ruínas. O mecanismo 
                      de abertura é um enigma geométrico!
                    </p>
                    
                    <div className="bg-red-900/30 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                      <p className="text-red-200">
                        <span className="text-red-300">Alex:</span> "Este pentágono está incompleto! 
                        Preciso reorganizar as peças e completar o ângulo faltante para liberar a 
                        energia armazenada."
                      </p>
                    </div>

                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <p className="text-purple-200 text-sm">
                        <span className="text-purple-300">💡 Lembre-se:</span> A fórmula para calcular 
                        a soma dos ângulos internos é: <span className="text-white">S = (n - 2) × 180°</span>
                      </p>
                      <p className="text-purple-200 text-sm mt-2">
                        Para um pentágono (n=5): S = (5 - 2) × 180° = <span className="text-white">540°</span>
                      </p>
                    </div>

                    <p className="text-red-300">
                      Complete o pentágono escolhendo o ângulo correto que falta!
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                      size="lg"
                      onClick={() => setStep('game')}
                    >
                      Resolver Enigma
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'game' && (
            <div>
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="mr-3 text-3xl sm:text-4xl">⬠</span>
                  O Pentágono Sagrado
                </h1>
                <p className="text-red-300 text-sm sm:text-base">
                  Complete o pentágono com o ângulo correto
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Pentágono Visual */}
                <div className="lg:col-span-2">
                  <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-white mb-4 text-lg sm:text-xl">
                        Pentágono Incompleto
                      </h3>

                      {/* SVG do Pentágono */}
                      <div className="bg-slate-900/50 rounded-xl p-8 mb-6">
                        <svg viewBox="0 0 300 300" className="w-full max-w-md mx-auto">
                          {/* Pentágono */}
                          <polygon
                            points={pentagonPoints}
                            fill="rgba(168, 85, 247, 0.15)"
                            stroke="#a855f7"
                            strokeWidth="3"
                          />

                          {/* Ângulos conhecidos */}
                          {knownAngles.map((angle, i) => {
                            const pos = getAnglePosition(i);
                            return (
                              <g key={i}>
                                <circle cx={pos.x} cy={pos.y} r="20" fill="#10b981" opacity="0.3" />
                                <text
                                  x={pos.x}
                                  y={pos.y + 5}
                                  textAnchor="middle"
                                  fill="#10b981"
                                  fontSize="16"
                                  fontWeight="bold"
                                >
                                  {angle}°
                                </text>
                              </g>
                            );
                          })}

                          {/* Ângulo faltante */}
                          <g>
                            {(() => {
                              const pos = getAnglePosition(4);
                              return (
                                <>
                                  <circle cx={pos.x} cy={pos.y} r="25" fill="#ef4444" opacity="0.3" />
                                  <text
                                    x={pos.x}
                                    y={pos.y + 5}
                                    textAnchor="middle"
                                    fill="#ef4444"
                                    fontSize="24"
                                    fontWeight="bold"
                                  >
                                    ?
                                  </text>
                                </>
                              );
                            })()}
                          </g>

                          {/* Centro - soma total */}
                          <text
                            x="150"
                            y="150"
                            textAnchor="middle"
                            fill="#a855f7"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            Soma = 540°
                          </text>
                        </svg>
                      </div>

                      {/* Opções de Resposta */}
                      <div className="grid grid-cols-2 gap-4">
                        {angleOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            onClick={() => setSelectedAngle(option.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                              p-6 rounded-xl border-2 transition-all text-2xl
                              ${selectedAngle === option.value
                                ? 'bg-red-500/30 border-red-400 shadow-lg shadow-red-500/30'
                                : 'bg-black/20 border-red-500/30 hover:border-red-400'
                              }
                            `}
                          >
                            <div className="text-white">{option.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Painel de Informações */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Cálculos */}
                  <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="text-white mb-4 text-base sm:text-lg">
                        📐 Cálculos
                      </h4>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-purple-300 mb-1">Fórmula:</p>
                          <p className="text-white">S = (n - 2) × 180°</p>
                        </div>
                        
                        <div>
                          <p className="text-purple-300 mb-1">Pentágono (n=5):</p>
                          <p className="text-white">S = (5 - 2) × 180° = 540°</p>
                        </div>

                        <div className="pt-3 border-t border-red-500/20">
                          <p className="text-purple-300 mb-1">Ângulos conhecidos:</p>
                          {knownAngles.map((angle, i) => (
                            <p key={i} className="text-green-400">∠{i + 1} = {angle}°</p>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-red-500/20">
                          <p className="text-purple-300 mb-1">Soma atual:</p>
                          <p className="text-white">{currentSum}°</p>
                        </div>

                        <div>
                          <p className="text-red-300 mb-1">Faltam:</p>
                          <p className="text-red-400">{totalSum - currentSum}°</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dica */}
                  <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-500/20">
                    <CardContent className="p-4">
                      <h4 className="text-white mb-2 text-sm">💡 Dica</h4>
                      <p className="text-white/90 text-xs leading-relaxed">
                        Em um pentágono regular, todos os 5 ângulos internos são iguais. 
                        Divida a soma total (540°) por 5 para encontrar cada ângulo!
                      </p>
                    </CardContent>
                  </Card>

                  {/* Botão */}
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAngle === null}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50"
                    size="lg"
                  >
                    Confirmar Ângulo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="text-6xl sm:text-7xl mb-4">⚡</div>
                  
                  <h3 className="text-green-400 mb-4 text-2xl sm:text-3xl">
                    Energia Liberada!
                  </h3>
                  
                  <p className="text-white mb-6 text-base sm:text-lg">
                    Perfeito! Você completou o Pentágono Sagrado com o ângulo correto de 108°. 
                    A energia foi liberada e o caminho está aberto!
                  </p>

                  <div className="bg-green-900/30 rounded-xl p-4 mb-6 text-sm">
                    <p className="text-green-200 mb-2">
                      ✅ Soma dos ângulos: 540°
                    </p>
                    <p className="text-green-200">
                      ✅ Cada ângulo: 108°
                    </p>
                  </div>

                  <Button
                    onClick={onComplete}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    size="lg"
                  >
                    Próxima Fase
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mission2Planet4;