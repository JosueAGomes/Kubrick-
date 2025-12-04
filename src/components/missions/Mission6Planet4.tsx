import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LogOut, Zap, Heart, Shield, ArrowRight } from 'lucide-react';
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

interface Mission6Planet4Props {
  onBack: () => void;
  onComplete: () => void;
}

type ShapeType = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';

interface Shape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  clicked: boolean;
}

const Mission6Planet4: React.FC<Mission6Planet4Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'intro1' | 'kryvo' | 'intro' | 'phase1' | 'phase2' | 'victory'>('intro1');
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Phase 1 - Seleção rápida
  const [timeLeft, setTimeLeft] = useState(30);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetShapes, setTargetShapes] = useState<ShapeType[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  
  // Phase 2 - Quiz de ângulos
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [phase2Score, setPhase2Score] = useState(0);

  const shapeInfo: Record<ShapeType, { sides: number; angle: number; icon: string; name: string }> = {
    triangle: { sides: 3, angle: 180, icon: '△', name: 'Triângulo' },
    square: { sides: 4, angle: 360, icon: '□', name: 'Quadrado' },
    pentagon: { sides: 5, angle: 540, icon: '⬠', name: 'Pentágono' },
    hexagon: { sides: 6, angle: 720, icon: '⬡', name: 'Hexágono' },
    heptagon: { sides: 7, angle: 900, icon: '⭓', name: 'Heptágono' },
    octagon: { sides: 8, angle: 1080, icon: '⬢', name: 'Octógono' },
  };

  const questions = [
    { shape: 'triangle' as ShapeType, correctAnswer: 180, options: [120, 180, 240, 360] },
    { shape: 'square' as ShapeType, correctAnswer: 360, options: [180, 270, 360, 540] },
    { shape: 'pentagon' as ShapeType, correctAnswer: 540, options: [360, 450, 540, 720] },
    { shape: 'hexagon' as ShapeType, correctAnswer: 720, options: [540, 630, 720, 900] },
    { shape: 'heptagon' as ShapeType, correctAnswer: 900, options: [720, 810, 900, 1080] },
    { shape: 'octagon' as ShapeType, correctAnswer: 1080, options: [900, 1000, 1080, 1260] },
  ];

  // Initialize Phase 1
  useEffect(() => {
    if (step === 'phase1') {
      generateShapes();
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            checkPhase1Complete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const generateShapes = () => {
    // Gerar 3 tipos aleatórios para serem os alvos
    const allTypes: ShapeType[] = ['triangle', 'square', 'pentagon', 'hexagon', 'heptagon', 'octagon'];
    const targets = allTypes.sort(() => Math.random() - 0.5).slice(0, 3);
    setTargetShapes(targets);

    // Gerar 30 formas aleatórias (aumentado de 20 para dificultar)
    const newShapes: Shape[] = [];
    let idCounter = 0;

    // Primeiro, garantir que cada forma alvo apareça pelo menos 5 vezes
    targets.forEach(targetType => {
      for (let i = 0; i < 5; i++) {
        newShapes.push({
          id: idCounter++,
          type: targetType,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          clicked: false,
        });
      }
    });

    // Preencher o resto com formas aleatórias (30 - 15 = 15 formas)
    const remainingCount = 30 - newShapes.length;
    for (let i = 0; i < remainingCount; i++) {
      newShapes.push({
        id: idCounter++,
        type: allTypes[Math.floor(Math.random() * allTypes.length)],
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        clicked: false,
      });
    }

    // Embaralhar as formas para não ficarem agrupadas
    for (let i = newShapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShapes[i], newShapes[j]] = [newShapes[j], newShapes[i]];
    }

    setShapes(newShapes);
  };

  const handleShapeClick = (shapeId: number) => {
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape || shape.clicked) return;

    const isCorrect = targetShapes.includes(shape.type);
    
    setShapes(prev => prev.map(s => 
      s.id === shapeId ? { ...s, clicked: true } : s
    ));

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  const checkPhase1Complete = () => {
    const correctShapes = shapes.filter(s => targetShapes.includes(s.type));
    const clickedCorrect = shapes.filter(s => s.clicked && targetShapes.includes(s.type)).length;
    
    if (clickedCorrect >= correctShapes.length * 0.7) { // 70% de acerto
      setStep('phase2');
    } else {
      // Tentar novamente
      setTimeLeft(30);
      setScore(0);
      setMistakes(0);
      generateShapes();
    }
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    const question = questions[currentQuestion];
    
    if (answer === question.correctAnswer) {
      setPhase2Score(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Fim da fase 2
        if (phase2Score + (answer === question.correctAnswer ? 1 : 0) >= 4) {
          setStep('victory');
        } else {
          // Tentar phase 2 novamente
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setPhase2Score(0);
        }
      }
    }, 1500);
  };

  const renderPolygon = (type: ShapeType, size: number = 50) => {
    const info = shapeInfo[type];
    const points: string[] = [];
    const radius = size / 2;
    
    for (let i = 0; i < info.sides; i++) {
      const angle = (i * 2 * Math.PI) / info.sides - Math.PI / 2;
      const x = radius + radius * 0.8 * Math.cos(angle);
      const y = radius + radius * 0.8 * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon points={points.join(' ')} fill="currentColor" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
      {/* Exit Button */}
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
            <AlertDialogDescription className="text-white/70">A batalha será perdida e você voltará ao planeta.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onBack}>Sim, sair</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1.5, 0.5] }} transition={{ duration: Math.random() * 3 + 1, repeat: Infinity, delay: Math.random() * 2 }} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* INTRO1 */}
          {step === 'intro1' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <Card className="bg-black/60 backdrop-blur-xl border-red-500/50">
                <CardContent className="p-6 sm:p-12">
                  <div className="text-center mb-6">
                    <motion.div className="text-6xl sm:text-7xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      ⚔️
                    </motion.div>
                    <h2 className="text-white mb-4 text-3xl sm:text-4xl">Confronto Final</h2>
                    <p className="text-red-300 text-lg">Olugan Kryvo</p>
                  </div>

                  <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mb-8">
                    <p>Olugan aparece em uma explosão de energia escura! Com um gesto, ele rouba e ativa o Artefato das Formas, distorcendo o espaço ao seu redor.</p>
                    
                    <div className="bg-red-900/40 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                      <p className="text-red-200">
                        <span className="text-red-300">Olugan Kryvo:</span> "Tolos! Vocês trouxeram o artefato diretamente para mim! Agora testemunhem o verdadeiro poder da geometria distorcida!"
                      </p>
                    </div>

                    <p>Triângulos, quadrados e polígonos regulares se deformam no ar. Para derrotá-lo, Alex deve alinhar os campos geométricos em sequência lógica, restaurando a simetria perfeita!</p>

                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <h4 className="text-purple-300 mb-2">Fase 1: Restaurar a Ordem</h4>
                      <p className="text-purple-200 text-sm">Identifique e selecione rapidamente as formas corretas antes que o tempo acabe!</p>
                    </div>

                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <h4 className="text-purple-300 mb-2">Fase 2: Conhecimento das Formas</h4>
                      <p className="text-purple-200 text-sm">Responda corretamente os ângulos internos de cada polígono para enfraquecer Olugan!</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" size="lg" onClick={() => setStep('kryvo')}>
                      Enfrentar o Vilão
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* KRYVO - Visual Appearance */}
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
                    <motion.div 
                      className="absolute inset-0 bg-red-500 blur-3xl opacity-40 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    ></motion.div>
                    <motion.img
                      src={oluganKryvoImage}
                      alt="Olugan Kryvo"
                      className="relative w-64 sm:w-80 h-auto object-contain drop-shadow-2xl"
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
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
                      <motion.div 
                        className="w-6 h-6 bg-white rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                      <motion.div 
                        className="w-4 h-4 bg-white rounded-full ml-2 mt-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                      ></motion.div>
                      <motion.div 
                        className="w-2 h-2 bg-white rounded-full ml-3 mt-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                      ></motion.div>
                    </div>

                    <Card className="bg-white border-4 border-red-500/50 relative z-10 shadow-2xl shadow-red-500/20">
                      <CardContent className="p-6 sm:p-8">
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          <span className="font-bold text-red-600">
                            "Tolos! Vocês trouxeram o artefato diretamente para mim!"
                          </span>
                        </p>
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          Agora testemunhem o{" "}
                          <span className="font-bold text-purple-600">
                            verdadeiro poder da geometria distorcida
                          </span>
                          ! Formas geométricas se deformam ao meu redor, desafiando as leis da simetria e da ordem!
                        </p>
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          Vocês nunca conseguirão{" "}
                          <span className="font-bold text-orange-600">
                            restaurar o equilíbrio
                          </span>
                          {" "}antes que eu absorva todo o poder do artefato!
                        </p>
                        <div className="flex justify-end">
                          <Button
                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                            onClick={() => setStep('phase1')}
                          >
                            <Zap className="w-5 h-5 mr-2" />
                            Iniciar Batalha
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* INTRO - Challenge Explanation */}
          {step === 'intro' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <Card className="bg-black/60 backdrop-blur-xl border-red-500/50">
                <CardContent className="p-6 sm:p-12">
                  <div className="text-center mb-6">
                    <motion.div className="text-6xl sm:text-7xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      ⚔️
                    </motion.div>
                    <h2 className="text-white mb-4 text-3xl sm:text-4xl">Confronto Final</h2>
                    <p className="text-red-300 text-lg">Olugan Kryvo</p>
                  </div>

                  <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mb-8">
                    <p>Olugan aparece em uma explosão de energia escura! Com um gesto, ele rouba e ativa o Artefato das Formas, distorcendo o espaço ao seu redor.</p>
                    
                    <div className="bg-red-900/40 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                      <p className="text-red-200">
                        <span className="text-red-300">Olugan Kryvo:</span> "Tolos! Vocês trouxeram o artefato diretamente para mim! Agora testemunhem o verdadeiro poder da geometria distorcida!"
                      </p>
                    </div>

                    <p>Triângulos, quadrados e polígonos regulares se deformam no ar. Para derrotá-lo, Alex deve alinhar os campos geométricos em sequência lógica, restaurando a simetria perfeita!</p>

                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <h4 className="text-purple-300 mb-2">Fase 1: Restaurar a Ordem</h4>
                      <p className="text-purple-200 text-sm">Identifique e selecione rapidamente as formas corretas antes que o tempo acabe!</p>
                    </div>

                    <div className="bg-purple-900/30 rounded-xl p-4">
                      <h4 className="text-purple-300 mb-2">Fase 2: Conhecimento das Formas</h4>
                      <p className="text-purple-200 text-sm">Responda corretamente os ângulos internos de cada polígono para enfraquecer Olugan!</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" size="lg" onClick={() => setStep('phase1')}>
                      <Zap className="w-5 h-5 mr-2" />
                      Iniciar Batalha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* PHASE 1 - Seleção Rápida */}
          {step === 'phase1' && (
            <div>
              <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="mr-3 text-3xl sm:text-4xl">⚔️</span>
                  Fase 1: Restaurar a Ordem
                </h1>
                <p className="text-red-300 text-sm sm:text-base">Selecione as formas corretas antes que o tempo acabe!</p>
              </motion.div>

              {/* HUD */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-red-400 text-xs mb-1">Tempo</div>
                    <div className="text-white text-2xl">⏱️ {timeLeft}s</div>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-green-400 text-xs mb-1">Acertos</div>
                    <div className="text-white text-2xl">✅ {score}</div>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-yellow-400 text-xs mb-1">Erros</div>
                    <div className="text-white text-2xl">❌ {mistakes}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Target Shapes */}
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/20 mb-6">
                <CardContent className="p-4">
                  <h3 className="text-white mb-3 text-center">Encontre estas formas:</h3>
                  <div className="flex justify-center gap-8">
                    {targetShapes.map((type) => (
                      <div key={type} className="text-center">
                        <p className="text-white text-lg px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30">{shapeInfo[type].name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Game Area */}
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                <CardContent className="p-4">
                  <div className="relative h-96 sm:h-[500px] bg-slate-900/50 rounded-xl overflow-hidden">
                    <AnimatePresence>
                      {shapes.map((shape) => (
                        <motion.button
                          key={shape.id}
                          onClick={() => handleShapeClick(shape.id)}
                          disabled={shape.clicked}
                          className={`absolute ${shape.clicked ? 'opacity-30' : 'hover:scale-110'} transition-all`}
                          style={{ left: `${shape.x}%`, top: `${shape.y}%` }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: shape.clicked ? 1 : 1.2 }}
                        >
                          <div className={`${targetShapes.includes(shape.type) ? 'text-red-400' : 'text-purple-400'}`}>
                            {renderPolygon(shape.type, 50)}
                          </div>
                          {shape.clicked && (
                            <div className="absolute -top-2 -right-2 text-xl">
                              {targetShapes.includes(shape.type) ? '✅' : '❌'}
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PHASE 2 - Quiz de Ângulos */}
          {step === 'phase2' && (
            <div>
              <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-white mb-3 flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="mr-3 text-3xl sm:text-4xl">⚔️</span>
                  Fase 2: Conhecimento das Formas
                </h1>
                <p className="text-red-300 text-sm sm:text-base">Responda corretamente para enfraquecer Olugan!</p>
              </motion.div>

              {/* Progress */}
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/20 mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Progresso</span>
                    <span className="text-white">{currentQuestion + 1} / {questions.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                  </div>
                </CardContent>
              </Card>

              {/* Question */}
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4 text-red-400">
                      {renderPolygon(questions[currentQuestion].shape, 100)}
                    </div>
                    <h3 className="text-white text-xl sm:text-2xl mb-2">
                      {shapeInfo[questions[currentQuestion].shape].name}
                    </h3>
                    <p className="text-purple-300">Qual é a soma dos ângulos internos?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={selectedAnswer !== null}
                        whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 rounded-xl border-2 transition-all text-2xl ${
                          selectedAnswer === option
                            ? option === questions[currentQuestion].correctAnswer
                              ? 'bg-green-500/30 border-green-400'
                              : 'bg-red-500/30 border-red-400'
                            : 'bg-black/20 border-red-500/30 hover:border-red-400'
                        }`}
                      >
                        <div className="text-white">{option}°</div>
                      </motion.button>
                    ))}
                  </div>

                  {selectedAnswer !== null && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6">
                      <p className={`text-lg ${selectedAnswer === questions[currentQuestion].correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedAnswer === questions[currentQuestion].correctAnswer ? '✅ Correto!' : '❌ Incorreto!'}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* VICTORY */}
          {step === 'victory' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
              <Card className="bg-black/60 backdrop-blur-xl border-green-500/50">
                <CardContent className="p-6 sm:p-12 text-center">
                  <motion.div
                    className="text-7xl sm:text-8xl mb-6"
                    animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
                    transition={{ duration: 2 }}
                  >
                    🏆
                  </motion.div>
                  
                  <h2 className="text-green-400 mb-4 text-3xl sm:text-4xl">Vitória!</h2>
                  
                  <p className="text-white mb-6 text-base sm:text-lg leading-relaxed">
                    Alex restaurou a simetria perfeita! O artefato se desfaz em luz pura. Olugan Kryvo 
                    é envolto em um vórtice geométrico e aprisionado dentro de um hexágono de energia, 
                    símbolo da perfeição matemática.
                  </p>

                  <div className="bg-green-900/30 rounded-xl p-6 mb-6 border border-green-500/30">
                    <p className="text-green-200 mb-3">O equilíbrio foi restaurado em Euklidia!</p>
                    <div className="flex justify-center gap-8 text-4xl mb-3">
                      <span>△</span>
                      <span>□</span>
                      <span>⬠</span>
                      <span>⬡</span>
                      <span>⭓</span>
                      <span>⬢</span>
                    </div>
                    <p className="text-green-300 text-sm">Todas as formas estão em harmonia!</p>
                  </div>

                  <div className="bg-purple-900/30 rounded-xl p-4 mb-6">
                    <p className="text-purple-200 text-sm italic">
                      "Você dominou todos os princípios da geometria. O Reino de Euklidia está salvo 
                      graças à sua coragem e conhecimento!" - Alex
                    </p>
                  </div>

                  <Button onClick={onComplete} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" size="lg">
                    Concluir Jornada
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

export default Mission6Planet4;