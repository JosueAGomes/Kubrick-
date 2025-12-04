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

interface Mission4Planet4Props {
  onBack: () => void;
  onComplete: () => void;
}

const Mission4Planet4: React.FC<Mission4Planet4Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'intro' | 'game' | 'result'>('intro');
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Heptágono: (7-2) × 180° = 900°
  const totalSum = 900;
  const missingAngle = 128.57;
  
  // Randomizar qual ângulo será o escondido (0 a 6) - NÃO USADO mais na fase 4, todos ficam com ?
  const [hiddenIndex] = useState(() => Math.floor(Math.random() * 7));
  
  // Todos os ângulos do heptágono são 128.57°
  const allAngles = Array(7).fill(128.57);
  
  // Não calcular soma atual - todos os ângulos estão escondidos na fase 4
  // const currentSum = Math.round(allAngles.reduce((sum, angle, i) => i === hiddenIndex ? sum : sum + angle, 0));

  const angleOptions = [
    { value: 120, label: '120°' },
    { value: 128.57, label: '128.57°' },
    { value: 135, label: '135°' },
    { value: 140, label: '140°' },
  ].sort(() => Math.random() - 0.5);

  const handleSubmit = () => {
    if (selectedAngle === missingAngle) {
      setStep('result');
    }
  };

  const renderHeptagon = () => {
    const points: string[] = [];
    const sides = 7;
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
    const angle = (index * 2 * Math.PI) / 7 - Math.PI / 2;
    const radius = 60;
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    return { x, y };
  };

  const heptagonPoints = renderHeptagon();

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
                    <div className="text-5xl sm:text-6xl mb-4">⭓</div>
                    <h2 className="text-white mb-4 text-2xl sm:text-3xl">Fase 4: O Heptágono do Tempo</h2>
                  </div>
                  <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mb-8">
                    <p>Antes de chegar ao núcleo, Alex deve ativar o Heptágono do Tempo, uma estrutura mística que liga todos os planetas anteriores!</p>
                    <div className="bg-red-900/30 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                      <p className="text-red-200"><span className="text-red-300">Alex:</span> "Este heptágono controla o fluxo temporal! Para estabilizá-lo, preciso completar com o ângulo exato. O tempo de todos os planetas depende disso!"</p>
                    </div>
                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <p className="text-purple-200 text-sm">Para um heptágono (n=7): S = (7 - 2) × 180° = <span className="text-white">900°</span></p>
                      <p className="text-purple-200 text-sm mt-2">Cada ângulo interno: 900° ÷ 7 = <span className="text-white">≈ 128.57°</span></p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" size="lg" onClick={() => setStep('game')}>Ativar Portal Temporal</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'game' && (
            <div>
              <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="mr-3 text-3xl sm:text-4xl">⭓</span>O Heptágono do Tempo
                </h1>
                <p className="text-red-300 text-sm sm:text-base">Estabilize o portal temporal com o ângulo correto</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-white mb-4 text-lg sm:text-xl">Heptágono Incompleto</h3>
                      <div className="bg-slate-900/50 rounded-xl p-8 mb-6">
                        <svg viewBox="0 0 300 300" className="w-full max-w-md mx-auto">
                          <polygon points={heptagonPoints} fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="3" />
                          {allAngles.map((angle, i) => {
                            const pos = getAnglePosition(i);
                            // Todos os ângulos com ? na fase 4
                            return (
                              <g key={i}>
                                <circle cx={pos.x} cy={pos.y} r="25" fill="#ef4444" opacity="0.3" />
                                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">
                                  ?
                                </text>
                              </g>
                            );
                          })}
                          <text x="150" y="150" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="bold">Soma = 900°</text>
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
                        <div><p className="text-purple-300 mb-1">Heptágono (n=7):</p><p className="text-white">S = (7 - 2) × 180° = 900°</p></div>
                        <div className="pt-3 border-t border-red-500/20">
                          <p className="text-purple-300 mb-1">Cada ângulo:</p>
                          <p className="text-white">900° ÷ 7 ≈?</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-500/20">
                    <CardContent className="p-4">
                      <h4 className="text-purple-300 mb-2 text-sm">⏰ Portal Temporal</h4>
                      <p className="text-purple-200 text-xs leading-relaxed">O Heptágono do Tempo conecta passado, presente e futuro dos 7 planetas de Euklidia!</p>
                    </CardContent>
                  </Card>
                  <Button onClick={handleSubmit} disabled={selectedAngle === null} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50" size="lg">Ativar Portal</Button>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="text-6xl sm:text-7xl mb-4">⚡</div>
                  <h3 className="text-green-400 mb-4 text-2xl sm:text-3xl">Portal Ativado!</h3>
                  <p className="text-white mb-6 text-base sm:text-lg">Excelente! O Heptágono do Tempo foi estabilizado com 128.57°. O portal temporal está ativo e conectado a todos os planetas!</p>
                  <div className="bg-green-900/30 rounded-xl p-4 mb-6 text-sm">
                    <p className="text-green-200 mb-2">✅ Soma dos ângulos: 900°</p>
                    <p className="text-green-200">✅ Cada ângulo: 128.57°</p>
                  </div>
                  <Button onClick={onComplete} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" size="lg">Próxima Fase</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mission4Planet4;