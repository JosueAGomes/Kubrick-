import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LogOut, Sparkles, ArrowRight } from 'lucide-react';
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
import oluganKryvoImage from 'figma:asset/6af13968367513d0fad3d369fbb366f797ac4351.png';

interface Shape {
  id: number;
  type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' | 'triangle' | 'square';
  label: string;
  rotation: number;
  sides: number;
}

interface Mission1Planet4Props {
  onBack: () => void;
  onComplete: () => void;
}

const Mission1Planet4: React.FC<Mission1Planet4Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'intro1' | 'intro2' | 'kryvo' | 'intro' | 'game' | 'result'>('intro1');
  const [selectedShapes, setSelectedShapes] = useState<number[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<'pentagon' | 'hexagon' | 'heptagon' | 'octagon'>('pentagon');
  const [roundsCompleted, setRoundsCompleted] = useState<string[]>([]);

  // Formas para o muro
  const shapes: Shape[] = [
    { id: 1, type: 'pentagon', label: 'A', rotation: 0, sides: 5 },
    { id: 2, type: 'triangle', label: 'B', rotation: 30, sides: 3 },
    { id: 3, type: 'hexagon', label: 'C', rotation: 0, sides: 6 },
    { id: 4, type: 'square', label: 'D', rotation: 45, sides: 4 },
    { id: 5, type: 'heptagon', label: 'E', rotation: 15, sides: 7 },
    { id: 6, type: 'octagon', label: 'F', rotation: 0, sides: 8 },
    { id: 7, type: 'triangle', label: 'G', rotation: 0, sides: 3 },
    { id: 8, type: 'pentagon', label: 'H', rotation: 25, sides: 5 },
    { id: 9, type: 'hexagon', label: 'I', rotation: 30, sides: 6 },
    { id: 10, type: 'square', label: 'J', rotation: 0, sides: 4 },
    { id: 11, type: 'heptagon', label: 'K', rotation: 20, sides: 7 },
    { id: 12, type: 'octagon', label: 'L', rotation: 22.5, sides: 8 },
  ];

  const targetInfo = {
    pentagon: { name: 'Pentágonos', sides: 5, count: 2, icon: '⬠' },
    hexagon: { name: 'Hexágonos', sides: 6, count: 2, icon: '⬡' },
    heptagon: { name: 'Heptágonos', sides: 7, count: 2, icon: '⭓' },
    octagon: { name: 'Octógonos', sides: 8, count: 2, icon: '⬢' },
  };

  const currentInfo = targetInfo[currentTarget];
  const correctShapes = shapes.filter(s => s.type === currentTarget);
  const correctIds = correctShapes.map(s => s.id);

  const toggleShape = (id: number) => {
    setSelectedShapes(prev => 
      prev.includes(id) 
        ? prev.filter(shapeId => shapeId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const isCorrect = 
      selectedShapes.length === correctIds.length &&
      selectedShapes.every(id => correctIds.includes(id));

    if (isCorrect) {
      const newCompleted = [...roundsCompleted, currentTarget];
      setRoundsCompleted(newCompleted);
      setSelectedShapes([]);

      // Próximo round ou finalizar
      if (currentTarget === 'pentagon') {
        setCurrentTarget('hexagon');
      } else if (currentTarget === 'hexagon') {
        setCurrentTarget('heptagon');
      } else if (currentTarget === 'heptagon') {
        setCurrentTarget('octagon');
      } else {
        setStep('result');
      }
    }
  };

  const renderShape = (shape: Shape) => {
    const baseSize = 60;
    const points: string[] = [];
    
    for (let i = 0; i < shape.sides; i++) {
      const angle = (i * 2 * Math.PI) / shape.sides - Math.PI / 2;
      const x = 50 + baseSize / 2 * Math.cos(angle);
      const y = 50 + baseSize / 2 * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    return <polygon points={points.join(' ')} fill="currentColor" />;
  };

  const isCorrectSelection = (id: number) => correctIds.includes(id);
  const allCorrectSelected = selectedShapes.length === correctIds.length && 
    selectedShapes.every(id => correctIds.includes(id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Exit Button */}
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

      {/* Stars background */}
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
          <AnimatePresence mode="wait">
            {/* Step 1: Intro 1 - Arrival at Kingdom */}
            {step === 'intro1' && (
              <motion.div
                key="intro1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
                  <CardContent className="p-6 sm:p-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                      O Reino de Kryvo - A Ameaça Final
                    </h2>
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                      Após ajudar Varek a escapar da prisão, Alex e sua equipe avançam em direção ao{" "}
                      <span className="text-red-300">Reino de Kryvo</span>
                      , o último planeta do Sistema Kubrickiano.
                    </p>
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                      Ao se aproximarem, a atmosfera muda drasticamente. Estruturas imponentes de{" "}
                      <span className="text-purple-300">formas geométricas complexas</span>
                      {" "}dominam a paisagem, e uma energia sombria paira no ar.
                    </p>
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                      <p className="text-white/90 italic text-center text-sm sm:text-base">
                        "Este é o coração do domínio de Kryvo. Precisamos estar preparados para qualquer coisa."
                      </p>
                      <p className="text-red-300 text-center mt-2 text-xs sm:text-sm">
                        — Alex, sentindo a tensão no ar
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
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

            {/* Step 2: Intro 2 - First Barrier */}
            {step === 'intro2' && (
              <motion.div
                key="intro2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
                  <CardContent className="p-6 sm:p-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                      O Grande Muro
                    </h2>
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                      Ao pousarem no Reino, Alex e seus amigos se deparam com um{" "}
                      <span className="text-orange-300">muro colossal</span>
                      {" "}que bloqueia a passagem para o centro da cidade.
                    </p>
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                      O muro não é feito de pedras comuns — está composto de{" "}
                      <span className="text-purple-300">formas geométricas entrelaçadas</span>
                      : pentágonos, hexágonos, heptágonos e octógonos.
                    </p>
                    <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                      <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                        De repente, uma voz poderosa e sombria ressoa:{" "}
                        <span className="text-red-300 italic">
                          "Bem-vindos ao meu reino. Vocês chegaram longe... mas não passarão do meu muro. 
                          Apenas quem dominar as formas poderá avançar!"
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                        size="lg"
                        onClick={() => setStep('kryvo')}
                      >
                        Enfrentar o Desafio
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Kryvo Introduction */}
            {step === 'kryvo' && (
              <motion.div
                key="kryvo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Olugan Kryvo Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-40 rounded-full"></div>
                      <img
                        src={oluganKryvoImage}
                        alt="Olugan Kryvo"
                        className="relative w-64 sm:w-80 h-auto object-contain drop-shadow-2xl"
                      />
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-purple-600 px-4 sm:px-6 py-2 rounded-full">
                        <p className="text-white text-sm sm:text-base">
                          Olugan Kryvo - O Vilão
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

                      <Card className="bg-white border-4 border-red-500/30 relative z-10">
                        <CardContent className="p-6 sm:p-8">
                          <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                            Eu sou{" "}
                            <span className="font-bold text-red-600">Olugan Kryvo</span>
                            , o Mestre das Formas e dos Ângulos! Por milênios, busquei o{" "}
                            <span className="font-bold text-purple-600">
                              artefato geométrico supremo
                            </span>
                            {" "}para controlar toda a matéria do universo!
                          </p>
                          <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                            Vocês coletaram os fragmentos que eu preciso... mas não passarão daqui! 
                            Meu muro só se abre para aqueles que{" "}
                            <span className="font-bold text-orange-600">
                              dominam as formas complexas
                            </span>
                            . Provem seu valor... se conseguirem!
                          </p>
                          <div className="flex justify-end">
                            <Button
                              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                              onClick={() => setStep('intro')}
                            >
                              Aceitar o Desafio
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

            {/* Step 4: Challenge Intro (former intro) */}
            {step === 'intro' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
                  <CardContent className="p-6 sm:p-12">
                    <div className="text-center mb-6">
                      <div className="text-5xl sm:text-6xl mb-4">🧱</div>
                      <h2 className="text-white mb-4 text-2xl sm:text-3xl">
                        Fase 1: O Grande Muro
                      </h2>
                    </div>

                    <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mb-8">
                      <p>
                        Ao pousarem no Reino de Kryvo, Alex e seus amigos se deparam com um grande muro 
                        que bloqueia a passagem para a cidade.
                      </p>
                      
                      <div className="bg-red-900/30 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                        <p className="text-red-200">
                          <span className="text-red-300">Alex:</span> "Este muro tem partes móveis! 
                          Precisamos empurrar as formas corretas para liberar a passagem. Vejo pentágonos, 
                          hexágonos, heptágonos e octógonos embutidos no muro!"
                        </p>
                      </div>

                      <p className="text-red-300">
                        Selecione as formas corretas em cada rodada para empurrar as partes do muro 
                        e abrir a passagem!
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                        size="lg"
                        onClick={() => setStep('game')}
                      >
                        Iniciar Desafio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Game */}
            {step === 'game' && (
              <div>
                {/* Header */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                    <span className="mr-3 text-3xl sm:text-4xl">🧱</span>
                    O Grande Muro
                  </h1>
                  <p className="text-red-300 text-sm sm:text-base">
                    Empurre as formas corretas para abrir a passagem
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Área do Muro */}
                  <div className="lg:col-span-2">
                    <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-white mb-4 flex items-center text-lg sm:text-xl">
                          <span className="mr-2">{currentInfo.icon}</span>
                          Encontre: {currentInfo.name}
                        </h3>
                        
                        <div className="bg-red-900/20 rounded-xl p-4 mb-6 border border-red-500/30">
                          <p className="text-red-200 text-sm leading-relaxed">
                            Selecione todas as formas com <span className="text-red-400">{currentInfo.sides} lados</span> 
                            {' '}para empurrar esta seção do muro! ({currentInfo.count} formas necessárias)
                          </p>
                        </div>

                        {/* Grid de Formas */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                          {shapes.map((shape) => {
                            const isSelected = selectedShapes.includes(shape.id);
                            const isCorrect = isCorrectSelection(shape.id);
                            
                            return (
                              <motion.button
                                key={shape.id}
                                onClick={() => toggleShape(shape.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                  relative aspect-square rounded-xl border-2 transition-all duration-300
                                  ${isSelected 
                                    ? 'bg-red-500/30 border-red-400 shadow-lg shadow-red-500/30' 
                                    : 'bg-black/20 border-red-500/30 hover:border-red-400'
                                  }
                                `}
                              >
                                {/* Label */}
                                <div className="absolute top-2 left-2 bg-slate-900/60 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                  {shape.label}
                                </div>

                                {/* Check mark */}
                                {isSelected && (
                                  <div className="absolute top-2 right-2">
                                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-sm">
                                      ✓
                                    </div>
                                  </div>
                                )}

                                {/* Shape */}
                                <svg 
                                  viewBox="0 0 100 100" 
                                  className={`w-full h-full p-4 ${isSelected ? 'text-red-400' : 'text-red-300'}`}
                                  style={{ transform: `rotate(${shape.rotation}deg)` }}
                                >
                                  {renderShape(shape)}
                                </svg>
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="text-center">
                          <p className="text-red-200 text-xs sm:text-sm">
                            💡 Dica: {currentInfo.name} têm {currentInfo.sides} lados
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Painel de Status */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Progresso */}
                    <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-white mb-4 flex items-center text-base sm:text-lg">
                          <span className="mr-2">📊</span>
                          Progresso
                        </h4>
                        
                        <div className="space-y-3 text-sm">
                          {Object.entries(targetInfo).map(([key, info]) => {
                            const isCompleted = roundsCompleted.includes(key);
                            const isCurrent = currentTarget === key;
                            
                            return (
                              <div 
                                key={key}
                                className={`flex items-center justify-between p-2 rounded ${
                                  isCurrent ? 'bg-red-500/20 border border-red-500/50' : ''
                                }`}
                              >
                                <span className={isCompleted ? 'text-green-400' : isCurrent ? 'text-red-300' : 'text-white/50'}>
                                  {info.icon} {info.name}
                                </span>
                                <span>{isCompleted ? '✅' : isCurrent ? '⏳' : '⏸️'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Seleções */}
                    <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-white mb-3 text-base sm:text-lg">
                          Selecionadas
                        </h4>
                        <div className="text-center">
                          <div className="text-3xl text-red-400">
                            {selectedShapes.length} / {currentInfo.count}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Botão */}
                    <Button
                      onClick={handleSubmit}
                      disabled={!allCorrectSelected}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50"
                      size="lg"
                    >
                      Empurrar Seção do Muro
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Result */}
            {step === 'result' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="text-6xl sm:text-7xl mb-4">🎉</div>
                    
                    <h3 className="text-green-400 mb-4 text-2xl sm:text-3xl">
                      Muro Derrubado!
                    </h3>
                    
                    <p className="text-white mb-6 text-base sm:text-lg">
                      Excelente trabalho! Você empurrou todas as seções corretas do muro e abriu 
                      a passagem para a cidade de Kryvo!
                    </p>

                    <div className="bg-green-900/30 rounded-xl p-4 mb-6">
                      <p className="text-green-200 text-sm">
                        ✅ Pentágonos encontrados<br/>
                        ✅ Hexágonos encontrados<br/>
                        ✅ Heptágonos encontrados<br/>
                        ✅ Octógonos encontrados
                      </p>
                    </div>

                    <Button
                      onClick={onComplete}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      size="lg"
                    >
                      Continuar Jornada
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Mission1Planet4;