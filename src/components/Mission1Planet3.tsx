import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, CheckCircle2, AlertTriangle, LogOut, Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import varekImage from 'figma:asset/6d75091c0490a8dc6e36edd6c762ce6e6f000a5e.png';

interface Shape {
  id: number;
  type: 'square' | 'rectangle' | 'triangle' | 'pentagon';
  label: string;
  rotation: number;
  isCorrect: boolean;
}

interface Mission1Planet3Props {
  onBack: () => void;
  onComplete: () => void;
}

const Mission1Planet3: React.FC<Mission1Planet3Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'intro1' | 'intro2' | 'varek' | 'game'>('intro1');
  const [selectedShapes, setSelectedShapes] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Formas para identificar (apenas quadrados e retângulos são corretos)
  const shapes: Shape[] = [
    { id: 1, type: 'square', label: 'A', rotation: 0, isCorrect: true },
    { id: 2, type: 'triangle', label: 'B', rotation: 30, isCorrect: false },
    { id: 3, type: 'rectangle', label: 'C', rotation: 0, isCorrect: true },
    { id: 4, type: 'pentagon', label: 'D', rotation: 20, isCorrect: false },
    { id: 5, type: 'square', label: 'E', rotation: 45, isCorrect: true },
    { id: 6, type: 'rectangle', label: 'F', rotation: 15, isCorrect: true },
    { id: 7, type: 'triangle', label: 'G', rotation: 0, isCorrect: false },
    { id: 8, type: 'square', label: 'H', rotation: 30, isCorrect: true },
  ];

  const toggleShape = (id: number) => {
    if (submitted) return;
    
    setSelectedShapes(prev => 
      prev.includes(id) 
        ? prev.filter(shapeId => shapeId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResult(true);
  };

  const handleContinue = () => {
    const correctShapes = shapes.filter(s => s.isCorrect).map(s => s.id);
    const isSuccess = 
      selectedShapes.length === correctShapes.length &&
      selectedShapes.every(id => correctShapes.includes(id));

    if (isSuccess) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setSelectedShapes([]);
    setSubmitted(false);
    setShowResult(false);
  };

  const renderShape = (shape: Shape) => {
    const baseSize = 80;
    
    switch (shape.type) {
      case 'square':
        return (
          <rect
            x={50 - baseSize / 2}
            y={50 - baseSize / 2}
            width={baseSize}
            height={baseSize}
            fill="currentColor"
          />
        );
      case 'rectangle':
        return (
          <rect
            x={50 - baseSize * 0.7 / 2}
            y={50 - baseSize * 0.5 / 2}
            width={baseSize * 0.7}
            height={baseSize * 0.5}
            fill="currentColor"
          />
        );
      case 'triangle':
        return (
          <polygon
            points={`50,${50 - baseSize / 2} ${50 - baseSize / 2},${50 + baseSize / 2} ${50 + baseSize / 2},${50 + baseSize / 2}`}
            fill="currentColor"
          />
        );
      case 'pentagon':
        const points = Array.from({ length: 5 }, (_, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x = 50 + (baseSize / 2) * Math.cos(angle);
          const y = 50 + (baseSize / 2) * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={points} fill="currentColor" />;
    }
  };

  const correctShapes = shapes.filter(s => s.isCorrect).map(s => s.id);
  const correctSelections = selectedShapes.filter(id => correctShapes.includes(id)).length;
  const incorrectSelections = selectedShapes.filter(id => !correctShapes.includes(id)).length;
  const totalCorrect = correctShapes.length;
  
  const isSuccess = submitted && 
    selectedShapes.length === correctShapes.length &&
    selectedShapes.every(id => correctShapes.includes(id));

  const score = submitted ? Math.round((correctSelections / totalCorrect) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Exit Button - Top Right */}
      <motion.div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-slate-900 border-purple-500/30">
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

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Intro 1 - Arrival at Planet Euklidia */}
          {step === 'intro1' && (
            <motion.div
              key="intro1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    Planeta Euklidia - Reino dos Quadriláteros
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Com mais fragmentos do artefato em mãos, Alex e sua equipe avançam rumo ao{" "}
                    <span className="text-green-300">Planeta Euklidia</span>
                    , conhecido como o Reino dos Quadriláteros.
                  </p>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Ao chegarem, percebem que o planeta está{" "}
                    <span className="text-yellow-400">envolto em energia escura</span>
                    . Estruturas geométricas flutuam no céu, algumas presas por campos de força invisíveis.
                  </p>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 italic text-center text-sm sm:text-base">
                      "Kryvo esteve aqui... e deixou suas marcas. Mas não estão sozinhos — há alguém nos esperando."
                    </p>
                    <p className="text-green-300 text-center mt-2 text-xs sm:text-sm">
                      — Alex, observando as estruturas
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700"
                      size="lg"
                      onClick={() => setStep('intro2')}
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Intro 2 - The Dark Presence */}
          {step === 'intro2' && (
            <motion.div
              key="intro2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    Sinais de Kryvo
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    O grupo se aproxima de um grande complexo no centro do planeta.
                    As paredes exibem marcas de batalha recentes — arranhões profundos e
                    padrões geométricos distorcidos.
                  </p>
                  <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                      De repente, uma voz ressoa telepáticamente:
                      <span className="text-red-300 italic">
                        "Olugan Kryvo passou por aqui... e deixou prisioneiros para trás.
                        Eu sou um deles. Por favor, me ajudem!"
                      </span>
                    </p>
                  </div>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Alex olha para a equipe. Eles não podem deixar ninguém para trás.
                    É hora de descobrir quem está preso... e libertá-lo.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700"
                      size="lg"
                      onClick={() => setStep('varek')}
                    >
                      Investigar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Varek Introduction */}
          {step === 'varek' && (
            <motion.div
              key="varek"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Varek Image */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-30 rounded-full"></div>
                    <img
                      src={varekImage}
                      alt="Varek"
                      className="relative w-64 sm:w-80 h-auto object-contain drop-shadow-2xl"
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-lime-600 px-4 sm:px-6 py-2 rounded-full">
                      <p className="text-white text-sm sm:text-base">
                        Varek - Prisioneiro
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Dialogue Bubble */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center"
                >
                  <div className="relative">
                    {/* Bubble tail - hidden on mobile */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-0 hidden lg:block">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                      <div className="w-4 h-4 bg-white rounded-full ml-2 mt-2"></div>
                      <div className="w-2 h-2 bg-white rounded-full ml-3 mt-2"></div>
                    </div>

                    <Card className="bg-white border-4 border-green-500/30 relative z-10">
                      <CardContent className="p-6 sm:p-8">
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          Obrigado por me encontrar! Meu nome é{" "}
                          <span className="font-bold text-green-600">Varek</span>
                          . Eu era um dos guardiões deste planeta até que{" "}
                          <span className="font-bold text-red-600">Olugan Kryvo</span>
                          {" "}me prendeu aqui.
                        </p>
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          As portas da prisão têm um{" "}
                          <span className="font-bold text-purple-600">
                            mecanismo baseado em formas geométricas
                          </span>
                          . Precisamos identificar corretamente os{" "}
                          <span className="font-bold text-green-600">quadriláteros</span>
                          {" "}— figuras com 4 lados — para desbloquear as travas e me libertar!
                        </p>
                        <div className="flex justify-end">
                          <Button
                            className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700"
                            onClick={() => setStep('game')}
                          >
                            Libertar Varek
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Game */}
          {step === 'game' && (
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="mr-3 text-3xl sm:text-4xl">🔓</span>
                  Fase 1: Fugitivos! Formação 4
                </h1>
                <p className="text-purple-300 text-sm sm:text-base">Identifique as formas com 4 lados</p>
              </motion.div>

              {!showResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Área de Seleção de Formas */}
                  <div className="lg:col-span-2">
                    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-white mb-4 flex items-center text-lg sm:text-xl">
                          <span className="mr-2">🚪</span>
                          Mecanismo da Porta da Prisão
                        </h3>
                        
                        <div className="bg-purple-900/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                          <p className="text-purple-200 text-sm leading-relaxed">
                            <span className="text-purple-300">Varek:</span> \"As portas da prisão têm um mecanismo baseado em 
                            formas geométricas. Precisamos selecionar apenas as figuras com <span className="text-purple-400">4 lados iguais</span> 
                            para abrir as travas. Clique nas formas corretas!\"
                          </p>
                        </div>

                        {/* Grid de Formas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                          {shapes.map((shape) => {
                            const isSelected = selectedShapes.includes(shape.id);
                            const showCorrect = submitted && shape.isCorrect;
                            const showIncorrect = submitted && isSelected && !shape.isCorrect;
                            
                            return (
                              <motion.button
                                key={shape.id}
                                onClick={() => toggleShape(shape.id)}
                                disabled={submitted}
                                whileHover={!submitted ? { scale: 1.05 } : {}}
                                whileTap={!submitted ? { scale: 0.95 } : {}}
                                className={`
                                  relative aspect-square rounded-xl border-2 transition-all duration-300 overflow-hidden
                                  ${isSelected 
                                    ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/30' 
                                    : 'bg-black/20 border-purple-500/30 hover:border-purple-400'
                                  }
                                  ${showCorrect ? 'bg-green-500/30 border-green-400' : ''}
                                  ${showIncorrect ? 'bg-red-500/30 border-red-400' : ''}
                                  ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}
                                `}
                              >
                                {/* Label */}
                                <div className="absolute top-2 left-2 bg-slate-900/60 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                  {shape.label}
                                </div>

                                {/* Indicador de Seleção */}
                                {isSelected && (
                                  <div className="absolute top-2 right-2">
                                    <div className={`
                                      w-6 h-6 rounded-full flex items-center justify-center text-sm
                                      ${showCorrect ? 'bg-green-500' : showIncorrect ? 'bg-red-500' : 'bg-purple-500'}
                                    `}>
                                      {showCorrect ? '✓' : showIncorrect ? '✗' : '✓'}
                                    </div>
                                  </div>
                                )}

                                {/* Forma SVG */}
                                <svg 
                                  viewBox="0 0 100 100" 
                                  className={`
                                    w-full h-full p-4
                                    ${isSelected ? 'text-purple-400' : 'text-purple-300'}
                                    ${showCorrect ? 'text-green-400' : ''}
                                    ${showIncorrect ? 'text-red-400' : ''}
                                  `}
                                  style={{ transform: `rotate(${shape.rotation}deg)` }}
                                >
                                  {renderShape(shape)}
                                </svg>
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="text-center">
                          <p className="text-purple-200 text-xs sm:text-sm">
                            💡 Dica: Quadriláteros têm exatamente 4 lados. Observe com atenção!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Painel de Informações */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Contador de Seleções */}
                    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-white mb-4 flex items-center text-base sm:text-lg">
                          <span className="mr-2">📊</span>
                          Status da Missão
                        </h4>
                        
                        <div className="space-y-3 text-sm sm:text-base">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-200">Formas selecionadas:</span>
                            <span className="text-white">{selectedShapes.length}</span>
                          </div>
                          
                          {submitted && (
                            <>
                              <div className="flex items-center justify-between text-green-400">
                                <span>Corretas:</span>
                                <span>✓ {correctSelections}</span>
                              </div>
                              
                              {incorrectSelections > 0 && (
                                <div className="flex items-center justify-between text-red-400">
                                  <span>Incorretas:</span>
                                  <span>✗ {incorrectSelections}</span>
                                </div>
                              )}
                              
                              <div className="pt-3 mt-3 border-t border-purple-500/20">
                                <div className="flex items-center justify-between text-purple-400">
                                  <span>Pontuação:</span>
                                  <span>{score}%</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dica Educacional */}
                    <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-xl border-purple-500/20">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-purple-300 mb-3 flex items-center text-base sm:text-lg">
                          <span className="mr-2">📚</span>
                          Aprenda: Quadriláteros
                        </h4>
                        
                        <div className="space-y-3 text-xs sm:text-sm text-purple-200">
                          <div className="flex items-start space-x-2">
                            <span className="text-purple-400 mt-1">⬛</span>
                            <div>
                              <p className="text-white">Quadrado:</p>
                              <p>4 lados iguais, 4 ângulos de 90°</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <span className="text-purple-400 mt-1">▭</span>
                            <div>
                              <p className="text-white">Retângulo:</p>
                              <p>Lados opostos iguais, 4 ângulos de 90°</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-purple-500/20">
                            <p className="text-purple-300 italic">
                              \"Ambos são quadriláteros especiais com 4 lados!\"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Botão de Ação */}
                    {!submitted ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={selectedShapes.length === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-50"
                        size="lg"
                      >
                        {selectedShapes.length === 0 ? 'Selecione as formas' : 'Verificar Seleção'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowResult(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                        size="lg"
                      >
                        Ver Resultado
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Tela de Resultado */
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 max-w-lg mx-auto">
                    <CardContent className="p-6 sm:p-8">
                      <div className="text-5xl sm:text-7xl mb-4">
                        {isSuccess ? '🎉' : '🔧'}
                      </div>
                      
                      <h3 className={`mb-4 text-2xl sm:text-3xl ${isSuccess ? 'text-green-400' : 'text-yellow-400'}`}>
                        {isSuccess ? 'Porta Destrancada!' : 'Quase lá!'}
                      </h3>
                      
                      <p className="text-white mb-6 text-base sm:text-lg">
                        {isSuccess 
                          ? `Perfeito! Você identificou todos os quadriláteros corretamente e abriu a porta da prisão!`
                          : `Você acertou ${correctSelections} de ${totalCorrect} formas. Score: ${score}%`
                        }
                      </p>

                      {/* Estatísticas */}
                      <div className="bg-purple-900/30 rounded-xl p-4 mb-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200">Formas corretas identificadas:</span>
                          <span className="text-green-400">{correctSelections}/{totalCorrect}</span>
                        </div>
                        {incorrectSelections > 0 && (
                          <div className="flex justify-between">
                            <span className="text-purple-200">Formas incorretas selecionadas:</span>
                            <span className="text-red-400">{incorrectSelections}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {isSuccess ? (
                          <Button
                            onClick={handleContinue}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            size="lg"
                          >
                            🚀 Continuar para Próxima Fase
                          </Button>
                        ) : (
                          <Button
                            onClick={handleRetry}
                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                            size="lg"
                          >
                            🔄 Tentar Novamente
                          </Button>
                        )}
                        
                        <button
                          onClick={onBack}
                          className="w-full px-6 py-3 bg-purple-900/20 border border-purple-500/30 text-white rounded-xl hover:bg-purple-500/10 transition-colors"
                        >
                          ← Voltar ao Planeta
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Mission1Planet3;