import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
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
} from './ui/alert-dialog';

interface Point {
  x: number;
  y: number;
}

interface Mission3Planet3Props {
  onBack: () => void;
  onComplete: () => void;
}

const Mission3Planet3: React.FC<Mission3Planet3Props> = ({ onBack, onComplete }) => {
  // Função para gerar posições iniciais aleatórias
  const generateRandomPoints = (): Record<string, Point> => {
    const minDistance = 80;
    const maxDistance = 320;
    
    return {
      A: { 
        x: Math.random() * (maxDistance - minDistance) + minDistance, 
        y: Math.random() * (maxDistance - minDistance) + minDistance 
      },
      B: { 
        x: Math.random() * (maxDistance - minDistance) + minDistance, 
        y: Math.random() * (maxDistance - minDistance) + minDistance 
      },
      C: { 
        x: Math.random() * (maxDistance - minDistance) + minDistance, 
        y: Math.random() * (maxDistance - minDistance) + minDistance 
      },
      D: { 
        x: Math.random() * (maxDistance - minDistance) + minDistance, 
        y: Math.random() * (maxDistance - minDistance) + minDistance 
      }
    };
  };

  // 4 pontos para formar um retângulo
  const [points, setPoints] = useState<Record<string, Point>>(generateRandomPoints());
  
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  // Calcular distância entre dois pontos
  const calculateDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // Calcular ângulo entre três pontos
  const calculateAngle = (p1: Point, vertex: Point, p2: Point): number => {
    const side1 = calculateDistance(vertex, p1);
    const side2 = calculateDistance(vertex, p2);
    const opposite = calculateDistance(p1, p2);
    
    const cosAngle = (side1 * side1 + side2 * side2 - opposite * opposite) / (2 * side1 * side2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    return angleRad * (180 / Math.PI);
  };

  // Verificar se é um quadrilátero válido
  const isValidQuadrilateral = (): boolean => {
    const sides = [
      calculateDistance(points.A, points.B),
      calculateDistance(points.B, points.C),
      calculateDistance(points.C, points.D),
      calculateDistance(points.D, points.A)
    ];
    
    return sides.every(side => side > 10);
  };

  // Obter propriedades do retângulo
  const getRectangleProperties = () => {
    // Calcular os 4 lados
    const AB = calculateDistance(points.A, points.B);
    const BC = calculateDistance(points.B, points.C);
    const CD = calculateDistance(points.C, points.D);
    const DA = calculateDistance(points.D, points.A);

    const isValid = isValidQuadrilateral();
    
    let angleA = 0, angleB = 0, angleC = 0, angleD = 0;
    
    if (isValid) {
      // Calcular os 4 ângulos internos
      angleA = calculateAngle(points.D, points.A, points.B);
      angleB = calculateAngle(points.A, points.B, points.C);
      angleC = calculateAngle(points.B, points.C, points.D);
      angleD = calculateAngle(points.C, points.D, points.A);
    }

    // Verificar se é um retângulo
    const tolerance = 0.08; // 8% de tolerância
    
    // Lados opostos devem ser iguais (AB = CD e BC = DA)
    const oppositeSidesEqual = isValid &&
      Math.abs(AB - CD) < Math.max(AB, CD) * tolerance &&
      Math.abs(BC - DA) < Math.max(BC, DA) * tolerance;

    // Todos os ângulos devem ser 90°
    const anglesRight = isValid &&
      Math.abs(angleA - 90) < 5 &&
      Math.abs(angleB - 90) < 5 &&
      Math.abs(angleC - 90) < 5 &&
      Math.abs(angleD - 90) < 5;

    // Não deve ser um quadrado (lados adjacentes diferentes)
    const notSquare = Math.abs(AB - BC) > Math.min(AB, BC) * 0.15;

    const isRectangle = oppositeSidesEqual && anglesRight && notSquare;

    // Calcular pontuação
    // 40% por ter 4 lados válidos
    // 30% por ter lados opostos iguais
    // 30% por ter ângulos retos
    const score = (isValid ? 0.4 : 0) + (oppositeSidesEqual ? 0.3 : 0) + (anglesRight ? 0.3 : 0);

    return {
      sides: {
        AB: AB.toFixed(1),
        BC: BC.toFixed(1),
        CD: CD.toFixed(1),
        DA: DA.toFixed(1)
      },
      angles: {
        A: angleA.toFixed(1),
        B: angleB.toFixed(1),
        C: angleC.toFixed(1),
        D: angleD.toFixed(1),
        sum: (angleA + angleB + angleC + angleD).toFixed(0)
      },
      isValid,
      oppositeSidesEqual,
      anglesRight,
      notSquare,
      isRectangle,
      score
    };
  };

  // Handlers de drag & drop
  const handleMouseDown = (pointName: string, event: React.MouseEvent) => {
    event.preventDefault();
    setDragging(pointName);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!dragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, event.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, event.clientY - rect.top));

    setPoints(prev => ({
      ...prev,
      [dragging]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging]);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResult(true);
  };

  const handleContinue = () => {
    const properties = getRectangleProperties();
    if (properties.isRectangle) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setPoints(generateRandomPoints());
    setSubmitted(false);
    setShowResult(false);
  };

  const properties = getRectangleProperties();
  const scorePercent = Math.round(properties.score * 100);

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

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
            >
              <span className="text-xl">←</span>
              <span>Voltar ao Planeta</span>
            </button>
            
            <div className="text-right">
              <h1 className="text-3xl font-bold text-white flex items-center justify-end">
                <span className="mr-3 text-4xl">▭</span>
                Fase 3: Retângulo!
              </h1>
              <p className="text-purple-300">Desative a barreira com um retângulo</p>
            </div>
          </div>

          {!showResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Construtor de Retângulos */}
              <div className="lg:col-span-2">
                <div className="bg-space-card/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="text-white font-bold mb-4 flex items-center">
                    <span className="mr-2">🛡️</span>
                    Campo de Força
                  </h3>
                  
                  <div className="bg-purple-900/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                    <p className="text-purple-200 text-sm leading-relaxed">
                      <span className="font-bold">Varek:</span> "A última barreira é controlada por um 
                      <span className="text-purple-400 font-bold"> retângulo</span>! Lembre-se: lados opostos iguais 
                      e 4 ângulos de 90°, mas <span className="font-bold">não pode ser um quadrado</span>!"
                    </p>
                  </div>

                  {/* SVG Interativo */}
                  <svg
                    ref={svgRef}
                    viewBox="0 0 400 400"
                    className="w-full h-96 bg-space-dark/50 rounded-xl border border-purple-500/20 cursor-crosshair"
                  >
                    {/* Grid de fundo */}
                    <defs>
                      <pattern id="grid-rect" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="400" fill="url(#grid-rect)" />

                    {/* Retângulo */}
                    <polygon
                      points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y} ${points.D.x},${points.D.y}`}
                      fill={properties.isRectangle ? "rgba(16, 185, 129, 0.2)" : "rgba(168, 85, 247, 0.2)"}
                      stroke={properties.isRectangle ? "#10b981" : properties.isValid ? "#a855f7" : "#ef4444"}
                      strokeWidth="3"
                      className="transition-all duration-300"
                    />

                    {/* Linhas dos lados com labels */}
                    {properties.isValid && (
                      <g>
                        {/* Lado AB (topo) */}
                        <text
                          x={(points.A.x + points.B.x) / 2}
                          y={(points.A.y + points.B.y) / 2 - 10}
                          fill="#c084fc"
                          fontSize="12"
                          textAnchor="middle"
                          className="pointer-events-none font-bold"
                        >
                          {properties.sides.AB}
                        </text>
                        
                        {/* Lado BC (direita) */}
                        <text
                          x={(points.B.x + points.C.x) / 2 + 15}
                          y={(points.B.y + points.C.y) / 2}
                          fill="#c084fc"
                          fontSize="12"
                          textAnchor="middle"
                          className="pointer-events-none font-bold"
                        >
                          {properties.sides.BC}
                        </text>
                        
                        {/* Lado CD (base) */}
                        <text
                          x={(points.C.x + points.D.x) / 2}
                          y={(points.C.y + points.D.y) / 2 + 20}
                          fill="#c084fc"
                          fontSize="12"
                          textAnchor="middle"
                          className="pointer-events-none font-bold"
                        >
                          {properties.sides.CD}
                        </text>
                        
                        {/* Lado DA (esquerda) */}
                        <text
                          x={(points.D.x + points.A.x) / 2 - 15}
                          y={(points.D.y + points.A.y) / 2}
                          fill="#c084fc"
                          fontSize="12"
                          textAnchor="middle"
                          className="pointer-events-none font-bold"
                        >
                          {properties.sides.DA}
                        </text>
                      </g>
                    )}

                    {/* Pontos arrastáveis */}
                    {Object.entries(points).map(([name, point]) => (
                      <g key={name}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="12"
                          fill="#a855f7"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-grab hover:fill-purple-400 transition-colors"
                          onMouseDown={(e) => handleMouseDown(name, e)}
                        />
                        <text
                          x={point.x}
                          y={point.y - 20}
                          fill="#ffffff"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                        >
                          {name}
                        </text>
                      </g>
                    ))}
                  </svg>

                  <div className="mt-4 text-center">
                    <p className="text-purple-200 text-sm">
                      💡 Arraste os pontos para formar um retângulo (não quadrado!)
                    </p>
                  </div>
                </div>
              </div>

              {/* Painel de Propriedades */}
              <div className="space-y-6">
                {/* Status de Validação */}
                <div className="bg-space-card/30 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    <span className="mr-2">✅</span>
                    Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center justify-between ${
                      properties.isValid ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <span>Quadrilátero válido:</span>
                      <span>{properties.isValid ? '✅' : '❌'}</span>
                    </div>
                    <div className={`flex items-center justify-between ${
                      properties.oppositeSidesEqual ? 'text-green-400' : 'text-white/70'
                    }`}>
                      <span>Lados opostos iguais:</span>
                      <span>{properties.oppositeSidesEqual ? '✅' : '—'}</span>
                    </div>
                    <div className={`flex items-center justify-between ${
                      properties.anglesRight ? 'text-green-400' : 'text-white/70'
                    }`}>
                      <span>Ângulos de 90°:</span>
                      <span>{properties.anglesRight ? '✅' : '—'}</span>
                    </div>
                    <div className={`flex items-center justify-between ${
                      properties.notSquare ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      <span>Não é quadrado:</span>
                      <span>{properties.notSquare ? '✅' : '⚠️'}</span>
                    </div>
                    <div className={`flex items-center justify-between font-bold ${
                      properties.isRectangle ? 'text-green-400' : 'text-white/70'
                    }`}>
                      <span>É um retângulo:</span>
                      <span>{properties.isRectangle ? '✅' : '—'}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <div className="flex items-center justify-between text-white font-bold">
                        <span>Score:</span>
                        <span>{scorePercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medidas */}
                <div className="bg-space-card/30 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    <span className="mr-2">📏</span>
                    Medidas
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Lados */}
                    <div>
                      <h5 className="text-purple-400 text-sm font-semibold mb-2">Lados</h5>
                      <div className="text-white text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>AB (topo):</span>
                          <span className="font-bold">{properties.sides.AB}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BC (direita):</span>
                          <span className="font-bold">{properties.sides.BC}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CD (base):</span>
                          <span className="font-bold">{properties.sides.CD}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DA (esquerda):</span>
                          <span className="font-bold">{properties.sides.DA}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ângulos */}
                    {properties.isValid && (
                      <div>
                        <h5 className="text-purple-400 text-sm font-semibold mb-2">Ângulos</h5>
                        <div className="text-white text-sm space-y-1">
                          <div>∠A = {properties.angles.A}°</div>
                          <div>∠B = {properties.angles.B}°</div>
                          <div>∠C = {properties.angles.C}°</div>
                          <div>∠D = {properties.angles.D}°</div>
                          <div className="pt-2 border-t border-purple-500/20">
                            Soma ≈ {properties.angles.sum}°
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dica */}
                <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
                  <h4 className="text-white font-bold mb-2 flex items-center text-sm">
                    <span className="mr-2">💡</span>
                    Dica
                  </h4>
                  <p className="text-white/90 text-xs leading-relaxed">
                    Um retângulo tem lados opostos iguais (AB = CD e BC = DA) e 4 ângulos de 90°. 
                    Diferente do quadrado, seus lados adjacentes têm comprimentos diferentes!
                  </p>
                </div>

                {/* Botão */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                >
                  Desativar Barreira
                </button>
              </div>
            </div>
          ) : (
            /* Tela de Resultado */
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-space-card/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 max-w-lg mx-auto">
                <div className="text-7xl mb-4">
                  {properties.isRectangle ? '🎉' : '🔧'}
                </div>
                
                <h3 className={`text-3xl font-bold mb-4 ${properties.isRectangle ? 'text-green-400' : 'text-yellow-400'}`}>
                  {properties.isRectangle ? 'Barreira Desativada!' : 'Continue Ajustando!'}
                </h3>
                
                <p className="text-white mb-6 text-lg">
                  {properties.isRectangle 
                    ? 'Perfeito! Você construiu um retângulo perfeito e desativou o campo de força!'
                    : `Bom trabalho! Score: ${scorePercent}%. ${
                        !properties.oppositeSidesEqual ? 'Tente deixar os lados opostos iguais. ' : ''
                      }${
                        !properties.anglesRight ? 'Tente fazer ângulos de 90°. ' : ''
                      }${
                        !properties.notSquare ? 'Isso parece um quadrado, tente fazer um retângulo!' : ''
                      }`
                  }
                </p>

                {/* Estatísticas */}
                <div className="bg-purple-900/30 rounded-xl p-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Lados opostos iguais:</span>
                    <span className={properties.oppositeSidesEqual ? 'text-green-400' : 'text-red-400'}>
                      {properties.oppositeSidesEqual ? '✅ Sim' : '❌ Não'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Ângulos de 90°:</span>
                    <span className={properties.anglesRight ? 'text-green-400' : 'text-red-400'}>
                      {properties.anglesRight ? '✅ Sim' : '❌ Não'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Não é quadrado:</span>
                    <span className={properties.notSquare ? 'text-green-400' : 'text-yellow-400'}>
                      {properties.notSquare ? '✅ Sim' : '⚠️ Não'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-purple-200">Pontuação final:</span>
                    <span className="text-purple-400">{scorePercent}%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {properties.isRectangle ? (
                    <>
                      <button
                        onClick={handleContinue}
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                      >
                        🎉 Missão Completa!
                      </button>
                      <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                        <p className="text-green-200 text-sm">
                          <span className="font-bold">Varek:</span> "Incrível! Você dominou os quadriláteros 
                          e ajudou a libertar Quarix das forças de Olugan. A próxima parte do artefato 
                          está ao nosso alcance!"
                        </p>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                    >
                      🔄 Tentar Novamente
                    </button>
                  )}
                  
                  <button
                    onClick={onBack}
                    className="w-full px-6 py-3 bg-space-input border border-purple-500/30 text-white rounded-xl hover:bg-purple-500/10 transition-colors"
                  >
                    ← Voltar ao Planeta
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mission3Planet3;