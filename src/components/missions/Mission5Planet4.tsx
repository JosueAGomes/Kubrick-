import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LogOut, Sparkles } from 'lucide-react';
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

interface Mission5Planet4Props {
  onBack: () => void;
  onComplete: () => void;
}

const Mission5Planet4: React.FC<Mission5Planet4Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'intro' | 'game' | 'result'>('intro');
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Octógono: (8-2) × 180° = 1080°
  const totalSum = 1080;
  const missingAngle = 135;
  
  // Randomizar qual ângulo será o escondido (0 a 7) - NÃO USADO mais na fase 5, todos ficam com ?
  const [hiddenIndex] = useState(() => Math.floor(Math.random() * 8));
  
  // Todos os ângulos do octógono são 135°
  const allAngles = Array(8).fill(135);
  
  // Não calcular soma atual - todos os ângulos estão escondidos na fase 5
  // const currentSum = allAngles.reduce((sum, angle, i) => i === hiddenIndex ? sum : sum + angle, 0);

  const angleOptions = [
    { value: 128.57, label: '128.57°' },
    { value: 135, label: '135°' },
    { value: 140, label: '140°' },
    { value: 144, label: '144°' },
  ].sort(() => Math.random() - 0.5);

  const handleSubmit = () => {
    if (selectedAngle === missingAngle) {
      setStep('result');
    }
  };

  const renderOctagon = () => {
    const points: string[] = [];
    const sides = 8;
    const radius = 80;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = 150 + radius * Math.cos(angle);
      const y = 150 + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  const getAnglePosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2;
    const radius = 60;
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    return { x, y };
  };

  const octagonPoints = renderOctagon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <motion.div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="outline" size="sm" className="border-red-500/50 bg-red-900/20 text-white hover:bg-red-900/40 hover:border-red-500" onClick={() => setShowExitDialog(true)}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </motion.div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-slate-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Você deseja realmente sair?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">Seu progresso será perdido e você voltará ao planeta.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onBack}>Sim, sair</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1, 0.5] }} transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {step === 'intro' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="text-center mb-6">
                    <div className="text-5xl sm:text-6xl mb-4">⬢</div>
                    <h2 className="text-white mb-4 text-2xl sm:text-3xl">Fase 5: O Octógono Final</h2>
                  </div>
                  <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mb-8">
                    <p>Após chegar ao núcleo da cidadela, Alex finalmente está de encontro com a última parte do artefato!</p>
                    <div className="bg-red-900/30 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                      <p className="text-red-200"><span className="text-red-300">Alex:</span> "Aqui está! A última peça do Artefato das Formas! Mas primeiro preciso resolver este desafio final... um painel em forma de Octógono gigante protege o artefato!"</p>
                    </div>
                    <div className="bg-orange-900/30 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
                      <p className="text-orange-200"><span className="text-orange-300">⚠️ Atenção:</span> Esta é a última barreira antes de recuperar o artefato. Uma vez completo, prepare-se para enfrentar Olugan Kryvo!</p>
                    </div>
                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <p className="text-purple-200 text-sm">Para um octógono (n=8): S = (8 - 2) × 180° = <span className="text-white">1080°</span></p>
                      <p className="text-purple-200 text-sm mt-2">Cada ângulo interno: 1080° ÷ 8 = <span className="text-white">135°</span></p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 flex items-center" size="lg" onClick={() => setStep('game')}>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Recuperar Artefato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'game' && (
            <div>
              <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="mr-3 text-3xl sm:text-4xl">⬢</span>O Octógono Final
                </h1>
                <p className="text-red-300 text-sm sm:text-base">Complete o octógono para recuperar o artefato</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-white mb-4 text-lg sm:text-xl flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                        Octógono do Artefato
                      </h3>
                      <div className="bg-slate-900/50 rounded-xl p-8 mb-6 relative">
                        {/* Glow do artefato */}
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(251, 191, 36, 0.3)',
                              '0 0 40px rgba(251, 191, 36, 0.5)',
                              '0 0 20px rgba(251, 191, 36, 0.3)',
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <svg viewBox="0 0 300 300" className="w-full max-w-md mx-auto relative z-10">
                          <polygon points={octagonPoints} fill="rgba(251, 191, 36, 0.15)" stroke="#fbbf24" strokeWidth="3" />
                          {allAngles.map((angle, i) => {
                            const pos = getAnglePosition(i);
                            // Todos os ângulos com ? na fase 5
                            return (
                              <g key={i}>
                                <circle cx={pos.x} cy={pos.y} r="25" fill="#ef4444" opacity="0.3" />
                                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
                                  ?
                                </text>
                              </g>
                            );
                          })}
                          {/* Artefato no centro */}
                          <text x="150" y="155" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">Soma = 1080°</text>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {angleOptions.map((option) => (
                          <motion.button key={option.value} onClick={() => setSelectedAngle(option.value)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className={`p-6 rounded-xl border-2 transition-all text-xl ${selectedAngle === option.value ? 'bg-red-500/30 border-red-400 shadow-lg shadow-red-500/30' : 'bg-black/20 border-red-500/30 hover:border-red-400'}`}>
                            <div className="text-white">{option.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="text-white mb-4 text-base sm:text-lg">📐 Cálculos</h4>
                      <div className="space-y-3 text-sm">
                        <div><p className="text-purple-300 mb-1">Octógono (n=8):</p><p className="text-white">S = (8 - 2) × 180° = 1080°</p></div>
                        <div className="pt-3 border-t border-red-500/20">
                          <p className="text-purple-300 mb-1">Cada ângulo:</p>
                          <p className="text-white">1080° ÷ 8 = ?</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500/20">
                    <CardContent className="p-4">
                      <h4 className="text-yellow-300 mb-2 text-sm flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Artefato das Formas
                      </h4>
                      <p className="text-yellow-200 text-xs leading-relaxed">O lendário artefato que pode restaurar o equilíbrio geométrico do universo!</p>
                    </CardContent>
                  </Card>
                  <Button onClick={handleSubmit} disabled={selectedAngle === null} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50" size="lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Recuperar Artefato
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
              <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/30">
                <CardContent className="p-6 sm:p-8 text-center">
                  <motion.div
                    className="text-6xl sm:text-7xl mb-4"
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: 0 }}
                  >
                    ✨
                  </motion.div>
                  
                  <h3 className="text-yellow-400 mb-4 text-2xl sm:text-3xl">Artefato Recuperado!</h3>
                  
                  <p className="text-white mb-6 text-base sm:text-lg">Incrível! Você completou o Octógono Final com 135° e recuperou a última peça do Artefato das Formas!</p>

                  <div className="bg-yellow-900/30 rounded-xl p-4 mb-6 text-sm border border-yellow-500/30">
                    <p className="text-yellow-200 mb-2">✅ Soma dos ângulos: 1080°</p>
                    <p className="text-yellow-200">✅ Cada ângulo: 135°</p>
                  </div>

                  <div className="bg-red-900/30 rounded-xl p-4 mb-6 border-l-4 border-red-500">
                    <p className="text-red-200 text-sm">
                      <span className="text-red-300">⚠️ Atenção:</span> Olugan Kryvo detectou a recuperação do artefato! Prepare-se para a batalha final!
                    </p>
                  </div>

                  <Button onClick={onComplete} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" size="lg">
                    Enfrentar Olugan Kryvo
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

export default Mission5Planet4;