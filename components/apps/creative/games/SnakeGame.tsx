'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '@/lib/utils';
import { Play, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

type Point = { x: number; y: number };

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [powerup, setPowerup] = useState<{ pos: Point; type: 'gold' | 'speed'; timer: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(110);

  useEffect(() => {
    const saved = localStorage.getItem('fiker_os_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const startGame = () => {
    sounds.playClick(900);
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setFood(spawnFood(initialSnake));
    setPowerup(null);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setSpeed(110);
  };

  const changeDirection = useCallback(
    (newDir: Point) => {
      if (direction.x + newDir.x === 0 && direction.y + newDir.y === 0) return;
      setNextDirection(newDir);
    },
    [direction]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, changeDirection]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setDirection(nextDirection);

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        head.x += nextDirection.x;
        head.y += nextDirection.y;

        // Wrap around arcade style
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;

        // Self-collision
        if (prevSnake.some((seg, idx) => idx !== 0 && seg.x === head.x && seg.y === head.y)) {
          sounds.playClick(400);
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          sounds.playClick(1000);
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('fiker_os_snake_highscore', newScore.toString());
          }
          setFood(spawnFood(newSnake));

          // Spawn random powerup occasionally
          if (Math.random() < 0.25 && !powerup) {
            setPowerup({
              pos: spawnFood(newSnake),
              type: Math.random() > 0.5 ? 'gold' : 'speed',
              timer: 80,
            });
          }

          // Accelerate slightly
          if (speed > 60) setSpeed((s) => s - 2);
        } else if (powerup && head.x === powerup.pos.x && head.y === powerup.pos.y) {
          sounds.playPacketSound();
          const bonus = powerup.type === 'gold' ? 50 : 25;
          const newScore = score + bonus;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('fiker_os_snake_highscore', newScore.toString());
          }
          setPowerup(null);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });

      // Decay powerup timer
      if (powerup) {
        if (powerup.timer <= 1) setPowerup(null);
        else setPowerup((p) => (p ? { ...p, timer: p.timer - 1 } : null));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, nextDirection, food, powerup, score, highScore, speed, spawnFood]);

  // Render on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#080a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Food (Neon Emerald)
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2.4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Powerup (Gold or Cyan)
    if (powerup) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = powerup.type === 'gold' ? '#f59e0b' : '#06b6d4';
      ctx.fillStyle = powerup.type === 'gold' ? '#fbbf24' : '#22d3ee';
      ctx.fillRect(
        powerup.pos.x * CELL_SIZE + 2,
        powerup.pos.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
    }

    // Snake
    snake.forEach((seg, index) => {
      ctx.shadowBlur = index === 0 ? 16 : 8;
      ctx.shadowColor = index === 0 ? '#8b5cf6' : '#6366f1';
      ctx.fillStyle = index === 0 ? '#a78bfa' : '#818cf8';

      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL_SIZE + 1.5,
        seg.y * CELL_SIZE + 1.5,
        CELL_SIZE - 3,
        CELL_SIZE - 3,
        index === 0 ? 6 : 4
      );
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }, [snake, food, powerup]);

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto space-y-4">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between p-3.5 px-4 rounded-xl bg-[#121522] border border-white/[0.1] shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="text-xs font-mono-code text-white/50 font-bold">SCORE:</div>
          <div className="text-xl font-black font-mono-code text-purple-400">{score}</div>
        </div>
        <div className="flex items-center space-x-2 text-amber-400 font-mono-code text-xs">
          <Trophy className="w-4 h-4" />
          <span className="font-bold">BEST: {highScore}</span>
        </div>
      </div>

      {/* Canvas Area (Centered & Proportioned) */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl bg-[#080a12] w-[400px] h-[400px]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {/* Overlay when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-xl font-black text-white font-mono-code tracking-wider">
              {isGameOver ? '💥 CONNECTION SEVERED' : '🕹️ NEON CYBER SNAKE'}
            </h3>
            <p className="text-xs text-white/70 font-sans max-w-xs leading-relaxed">
              {isGameOver
                ? `Final Score: ${score} points. Ready for another run?`
                : 'Navigate the cyber grid, collect green data packets and powerups.'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-code font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer border border-purple-400"
            >
              {isGameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isGameOver ? 'PLAY AGAIN' : 'START GAME'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono-code text-white/50">
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">W / ↑</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">A / ←</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">S / ↓</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">D / →</span>
        <span>TO STEER</span>
      </div>

      {/* Mobile / On-Screen Controls */}
      <div className="grid grid-cols-3 gap-2 w-48 sm:hidden pt-2">
        <div />
        <button
          onClick={() => changeDirection({ x: 0, y: -1 })}
          className="p-3 bg-white/10 rounded-xl flex items-center justify-center text-white active:bg-white/20"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />
        <button
          onClick={() => changeDirection({ x: -1, y: 0 })}
          className="p-3 bg-white/10 rounded-xl flex items-center justify-center text-white active:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => changeDirection({ x: 0, y: 1 })}
          className="p-3 bg-white/10 rounded-xl flex items-center justify-center text-white active:bg-white/20"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={() => changeDirection({ x: 1, y: 0 })}
          className="p-3 bg-white/10 rounded-xl flex items-center justify-center text-white active:bg-white/20"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
