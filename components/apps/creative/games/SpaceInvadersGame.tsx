'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '@/lib/utils';
import { Play, RotateCcw, Trophy, Heart, Zap, Shield, ArrowLeft, ArrowRight, Crosshair } from 'lucide-react';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Enemy extends Entity {
  id: number;
  alive: boolean;
  type: number;
  speedX: number;
}

interface Bullet extends Entity {
  dy: number;
  isPlayer: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const SpaceInvadersGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [wave, setWave] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const gameStateRef = useRef<{
    player: Entity & { speed: number; powerup: 'none' | 'triple' | 'shield'; powerupTimer: number };
    enemies: Enemy[];
    bullets: Bullet[];
    particles: Particle[];
    keys: Record<string, boolean>;
    lastShotTime: number;
    enemyDir: number;
    enemyStepDown: boolean;
    wave: number;
  }>({
    player: { x: 220, y: 380, width: 36, height: 20, speed: 6, powerup: 'none', powerupTimer: 0 },
    enemies: [],
    bullets: [],
    particles: [],
    keys: {},
    lastShotTime: 0,
    enemyDir: 1,
    enemyStepDown: false,
    wave: 1,
  });

  useEffect(() => {
    const saved = localStorage.getItem('fiker_os_space_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const initEnemies = (currentWave: number) => {
    const enemies: Enemy[] = [];
    const rows = Math.min(5, 3 + currentWave);
    const cols = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          id: r * cols + c,
          x: 40 + c * 50,
          y: 40 + r * 35,
          width: 28,
          height: 20,
          alive: true,
          type: r % 3,
          speedX: 1 + currentWave * 0.3,
        });
      }
    }
    return enemies;
  };

  const startGame = () => {
    sounds.playClick(900);
    setScore(0);
    setLives(3);
    setWave(1);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPlaying(true);

    gameStateRef.current = {
      player: { x: 220, y: 380, width: 36, height: 20, speed: 6, powerup: 'none', powerupTimer: 0 },
      enemies: initEnemies(1),
      bullets: [],
      particles: [],
      keys: {},
      lastShotTime: 0,
      enemyDir: 1,
      enemyStepDown: false,
      wave: 1,
    };
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
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
      const { player, enemies, bullets, particles, keys } = state;

      // 1. Move Player
      if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(10, player.x - player.speed);
      if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.width - 10, player.x + player.speed);

      // 2. Shoot Laser
      const now = performance.now();
      if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && now - state.lastShotTime > 220) {
        sounds.playClick(1200);
        state.lastShotTime = now;
        if (player.powerup === 'triple') {
          bullets.push(
            { x: player.x + player.width / 2 - 2, y: player.y - 8, width: 4, height: 10, dy: -8, isPlayer: true },
            { x: player.x + 2, y: player.y - 6, width: 4, height: 10, dy: -8, isPlayer: true },
            { x: player.x + player.width - 6, y: player.y - 6, width: 4, height: 10, dy: -8, isPlayer: true }
          );
        } else {
          bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y - 8,
            width: 4,
            height: 12,
            dy: -8,
            isPlayer: true,
          });
        }
      }

      // 3. Move Bullets
      state.bullets = bullets.filter((b) => {
        b.y += b.dy;
        return b.y > -20 && b.y < canvas.height + 20;
      });

      // 4. Move Enemies
      let hitEdge = false;
      const aliveEnemies = enemies.filter((e) => e.alive);

      if (aliveEnemies.length === 0) {
        // Wave clear!
        sounds.playPacketSound();
        const nextWave = state.wave + 1;
        state.wave = nextWave;
        setWave(nextWave);
        state.enemies = initEnemies(nextWave);
        state.player.powerup = 'triple';
        state.player.powerupTimer = 300;
        return;
      }

      aliveEnemies.forEach((e) => {
        e.x += state.enemyDir * e.speedX;
        if (e.x <= 10 || e.x + e.width >= canvas.width - 10) {
          hitEdge = true;
        }

        // Random enemy shoot
        if (Math.random() < 0.005) {
          state.bullets.push({
            x: e.x + e.width / 2,
            y: e.y + e.height,
            width: 3,
            height: 8,
            dy: 4,
            isPlayer: false,
          });
        }

        // Enemy reached bottom
        if (e.y + e.height >= player.y) {
          sounds.playClick(350);
          setIsGameOver(true);
          setIsPlaying(false);
        }
      });

      if (hitEdge) {
        state.enemyDir *= -1;
        aliveEnemies.forEach((e) => {
          e.y += 14;
        });
      }

      // 5. Collisions: Player bullets vs Enemies
      state.bullets.forEach((b) => {
        if (!b.isPlayer) return;
        enemies.forEach((e) => {
          if (!e.alive) return;
          if (
            b.x < e.x + e.width &&
            b.x + b.width > e.x &&
            b.y < e.y + e.height &&
            b.y + b.height > e.y
          ) {
            e.alive = false;
            b.y = -999;
            sounds.playClick(850);

            // Spawn explosion particles
            for (let i = 0; i < 8; i++) {
              particles.push({
                x: e.x + e.width / 2,
                y: e.y + e.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: e.type === 0 ? '#ef4444' : e.type === 1 ? '#3b82f6' : '#10b981',
              });
            }

            setScore((prev) => {
              const next = prev + 50 * state.wave;
              if (next > highScore) {
                setHighScore(next);
                localStorage.setItem('fiker_os_space_highscore', next.toString());
              }
              return next;
            });
          }
        });
      });

      // 6. Collisions: Enemy bullets vs Player
      state.bullets.forEach((b) => {
        if (b.isPlayer) return;
        if (
          b.x < player.x + player.width &&
          b.x + b.width > player.x &&
          b.y < player.y + player.height &&
          b.y + b.height > player.y
        ) {
          b.y = 999;
          sounds.playClick(450);

          if (player.powerup === 'shield') {
            player.powerup = 'none';
          } else {
            setLives((l) => {
              const nextLives = l - 1;
              if (nextLives <= 0) {
                setIsGameOver(true);
                setIsPlaying(false);
              }
              return nextLives;
            });
          }
        }
      });

      // 7. Update Particles
      state.particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        return p.life > 0;
      });

      // 8. Draw Frame
      ctx.fillStyle = '#060810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 97 + now * 0.05) % canvas.width;
        const sy = (i * 61 + now * 0.08) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Enemies (Bugs)
      enemies.forEach((e) => {
        if (!e.alive) return;
        ctx.shadowBlur = 10;
        ctx.shadowColor = e.type === 0 ? '#ef4444' : e.type === 1 ? '#3b82f6' : '#10b981';
        ctx.fillStyle = ctx.shadowColor;

        ctx.beginPath();
        ctx.roundRect(e.x, e.y, e.width, e.height, 4);
        ctx.fill();

        // Bug antennae / eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(e.x + 6, e.y + 4, 4, 4);
        ctx.fillRect(e.x + e.width - 10, e.y + 4, 4, 4);
      });

      // Draw Bullets
      bullets.forEach((b) => {
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.isPlayer ? '#38bdf8' : '#f87171';
        ctx.fillStyle = ctx.shadowColor;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Draw Particles
      particles.forEach((p) => {
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      });

      // Draw Player Ship
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#06b6d4';
      ctx.fillStyle = '#22d3ee';

      // Triangle ship
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(player.x + player.width / 2 - 2, player.y + 6, 4, 5);

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
        <div className="flex items-center space-x-4">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono-code text-white/50 font-bold">SCORE</div>
            <div className="text-xl font-black font-mono-code text-cyan-400">{score}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono-code text-white/50 font-bold">WAVE</div>
            <div className="text-xl font-black font-mono-code text-purple-400">{wave}</div>
          </div>
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
      <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-[#060810] w-[480px] h-[420px]">
        <canvas ref={canvasRef} width={480} height={420} className="block" />

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h3 className="text-xl font-black text-white font-mono-code tracking-wider">
              {isGameOver ? '💀 DEFENSE OVERRUN' : '🚀 SPACE INVADERS // BUG HUNTER'}
            </h3>
            <p className="text-xs text-white/70 font-sans max-w-xs leading-relaxed">
              {isGameOver
                ? `Total Bugs Exterminated: Wave ${wave} (${score} pts). Try again!`
                : 'Defend the system from incoming code bugs! Move and shoot with laser precision.'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer border border-cyan-400"
            >
              {isGameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isGameOver ? 'RETRY DEFENSE' : 'LAUNCH SHIP'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono-code text-white/50">
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">A / ←</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">D / →</span>
        <span>TO MOVE</span>
        <span className="text-white/30">·</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">SPACE</span>
        <span>TO FIRE</span>
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center justify-center gap-3 sm:hidden w-full pt-2">
        <button
          onTouchStart={() => (gameStateRef.current.keys['ArrowLeft'] = true)}
          onTouchEnd={() => (gameStateRef.current.keys['ArrowLeft'] = false)}
          className="p-3 bg-white/10 rounded-xl text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onTouchStart={() => (gameStateRef.current.keys['Space'] = true)}
          onTouchEnd={() => (gameStateRef.current.keys['Space'] = false)}
          className="p-3 px-6 bg-cyan-600 text-white font-bold rounded-xl flex items-center space-x-1"
        >
          <Crosshair className="w-5 h-5" />
          <span>FIRE</span>
        </button>
        <button
          onTouchStart={() => (gameStateRef.current.keys['ArrowRight'] = true)}
          onTouchEnd={() => (gameStateRef.current.keys['ArrowRight'] = false)}
          className="p-3 bg-white/10 rounded-xl text-white"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
