'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '@/lib/utils';
import { Play, RotateCcw, Trophy, Heart, ArrowLeft, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const BrickBreakerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const gameStateRef = useRef<{
    paddle: { x: number; y: number; width: number; height: number; speed: number };
    balls: Ball[];
    bricks: Brick[];
    particles: Particle[];
    keys: Record<string, boolean>;
    mouseX: number | null;
  }>({
    paddle: { x: 190, y: 390, width: 100, height: 14, speed: 7 },
    balls: [],
    bricks: [],
    particles: [],
    keys: {},
    mouseX: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('fiker_os_brick_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const initBricks = (): Brick[] => {
    const bricks: Brick[] = [];
    const rows = 5;
    const cols = 8;
    const brickWidth = 52;
    const brickHeight = 18;
    const padding = 6;
    const offsetTop = 40;
    const offsetLeft = 14;

    const rowColors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];
    const rowPoints = [50, 40, 30, 20, 10];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickWidth + padding),
          y: offsetTop + r * (brickHeight + padding),
          width: brickWidth,
          height: brickHeight,
          color: rowColors[r % rowColors.length],
          points: rowPoints[r % rowPoints.length],
          alive: true,
        });
      }
    }
    return bricks;
  };

  const startGame = () => {
    sounds.playClick(900);
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPlaying(true);

    gameStateRef.current = {
      paddle: { x: 190, y: 390, width: 100, height: 14, speed: 7 },
      balls: [{ x: 240, y: 360, vx: 3.5 * (Math.random() > 0.5 ? 1 : -1), vy: -4.5, radius: 6 }],
      bricks: initBricks(),
      particles: [],
      keys: {},
      mouseX: null,
    };
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = true;
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse / Touch paddle tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    gameStateRef.current.paddle.x = Math.max(
      0,
      Math.min(canvas.width - gameStateRef.current.paddle.width, x - gameStateRef.current.paddle.width / 2)
    );
  };

  // Main Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      const state = gameStateRef.current;
      const { paddle, balls, bricks, particles, keys } = state;

      // 1. Move Paddle with keyboard
      if (keys['ArrowLeft'] || keys['KeyA']) paddle.x = Math.max(0, paddle.x - paddle.speed);
      if (keys['ArrowRight'] || keys['KeyD']) paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);

      // 2. Update Balls
      state.balls = balls.filter((ball) => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.x - ball.radius <= 0) {
          ball.x = ball.radius;
          ball.vx *= -1;
          sounds.playClick(600);
        } else if (ball.x + ball.radius >= canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -1;
          sounds.playClick(600);
        }

        if (ball.y - ball.radius <= 0) {
          ball.y = ball.radius;
          ball.vy *= -1;
          sounds.playClick(600);
        }

        // Paddle collision
        if (
          ball.y + ball.radius >= paddle.y &&
          ball.y - ball.radius <= paddle.y + paddle.height &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.width
        ) {
          sounds.playClick(950);
          // Angle based on where ball hits paddle
          const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          const speedMag = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          ball.vx = hitPoint * 5.5;
          ball.vy = -Math.abs(Math.sqrt(Math.max(4, speedMag * speedMag - ball.vx * ball.vx)));
          ball.y = paddle.y - ball.radius;
        }

        // Brick collisions
        bricks.forEach((brick) => {
          if (!brick.alive) return;
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
          ) {
            brick.alive = false;
            ball.vy *= -1;
            sounds.playClick(1100);

            // Explosion particles
            for (let i = 0; i < 6; i++) {
              particles.push({
                x: brick.x + brick.width / 2,
                y: brick.y + brick.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 18,
                color: brick.color,
              });
            }

            setScore((prev) => {
              const next = prev + brick.points;
              if (next > highScore) {
                setHighScore(next);
                localStorage.setItem('fiker_os_brick_highscore', next.toString());
              }
              return next;
            });
          }
        });

        // Drop below bottom
        return ball.y < canvas.height + 20;
      });

      // Check Victory
      if (bricks.every((b) => !b.alive)) {
        sounds.playPacketSound();
        setIsVictory(true);
        setIsPlaying(false);
      }

      // Check Life Loss
      if (state.balls.length === 0) {
        sounds.playClick(400);
        setLives((l) => {
          const next = l - 1;
          if (next <= 0) {
            setIsGameOver(true);
            setIsPlaying(false);
          } else {
            // Respawn ball on paddle
            state.balls = [{ x: paddle.x + paddle.width / 2, y: paddle.y - 12, vx: 3.5, vy: -4.5, radius: 6 }];
          }
          return next;
        });
      }

      // 3. Update Particles
      state.particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        return p.life > 0;
      });

      // 4. Draw Frame
      ctx.fillStyle = '#080a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();
      });

      // Draw Paddle
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#06b6d4';
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
      ctx.fill();

      // Draw Balls
      state.balls.forEach((ball) => {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#f59e0b';
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      particles.forEach((p) => {
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      });

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, highScore]);

  return (
    <div className="flex flex-col items-center w-full max-w-[480px] mx-auto space-y-4">
      {/* Header Stats */}
      <div className="w-full flex items-center justify-between p-3.5 px-4 rounded-xl bg-[#121522] border border-white/[0.1] shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="text-xs font-mono-code text-white/50 font-bold">SCORE:</div>
          <div className="text-xl font-black font-mono-code text-amber-400">{score}</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? 'text-red-500 fill-red-500' : 'text-white/20'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400 font-mono-code text-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-bold">BEST: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-[#080a14] cursor-crosshair w-[480px] h-[420px]">
        <canvas
          ref={canvasRef}
          width={480}
          height={420}
          onMouseMove={handleMouseMove}
          className="block"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-xl font-black text-white font-mono-code tracking-wider">
              {isVictory
                ? '🏆 SYSTEM GRID CLEARED!'
                : isGameOver
                ? '💥 BALL LOST'
                : '🧱 CYBER BRICK BREAKER'}
            </h3>
            <p className="text-xs text-white/70 font-sans max-w-xs leading-relaxed">
              {isVictory
                ? `Incredible! All memory sectors demolished with ${score} points.`
                : isGameOver
                ? `Game over! Final score: ${score} points.`
                : 'Move the paddle with your mouse or Arrow Keys to shatter the neon memory grid!'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-code font-bold text-sm shadow-xl shadow-amber-500/30 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer border border-amber-300"
            >
              {isGameOver || isVictory ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isGameOver || isVictory ? 'PLAY AGAIN' : 'START GAME'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono-code text-white/50">
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">MOUSE / TRACKPAD</span>
        <span>OR</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">A / ←</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">D / →</span>
        <span>TO MOVE PADDLE</span>
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center justify-center gap-4 sm:hidden w-full pt-2">
        <button
          onTouchStart={() => (gameStateRef.current.keys['ArrowLeft'] = true)}
          onTouchEnd={() => (gameStateRef.current.keys['ArrowLeft'] = false)}
          className="p-3.5 bg-white/10 rounded-xl text-white flex-1 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onTouchStart={() => (gameStateRef.current.keys['ArrowRight'] = true)}
          onTouchEnd={() => (gameStateRef.current.keys['ArrowRight'] = false)}
          className="p-3.5 bg-white/10 rounded-xl text-white flex-1 flex items-center justify-center"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
