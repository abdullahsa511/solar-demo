import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  color: string;
  radius: number; // display radius in px
  orbitRadius: number; // display orbit radius in px
  realDiameter: string; // km
  realDistance: string; // million km from sun
  orbitalPeriod: string;
  orbitalSpeed: number; // relative speed factor
  angle: number;
  description: string;
  ringColor?: string;
}

const PLANETS_DATA: PlanetData[] = [
  {
    name: 'Mercury',
    color: '#b5b5b5',
    radius: 4,
    orbitRadius: 60,
    realDiameter: '4,879 km',
    realDistance: '57.9 million km',
    orbitalPeriod: '88 days',
    orbitalSpeed: 4.15,
    angle: Math.random() * Math.PI * 2,
    description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
  },
  {
    name: 'Venus',
    color: '#e8cda0',
    radius: 7,
    orbitRadius: 95,
    realDiameter: '12,104 km',
    realDistance: '108.2 million km',
    orbitalPeriod: '225 days',
    orbitalSpeed: 1.62,
    angle: Math.random() * Math.PI * 2,
    description: 'The hottest planet due to its thick CO₂ atmosphere. It rotates backwards compared to most planets.',
  },
  {
    name: 'Earth',
    color: '#4da6ff',
    radius: 8,
    orbitRadius: 135,
    realDiameter: '12,756 km',
    realDistance: '149.6 million km',
    orbitalPeriod: '365.25 days',
    orbitalSpeed: 1.0,
    angle: Math.random() * Math.PI * 2,
    description: 'Our home planet — the only known world with liquid water on its surface and life.',
  },
  {
    name: 'Mars',
    color: '#e07040',
    radius: 6,
    orbitRadius: 175,
    realDiameter: '6,792 km',
    realDistance: '227.9 million km',
    orbitalPeriod: '687 days',
    orbitalSpeed: 0.53,
    angle: Math.random() * Math.PI * 2,
    description: 'The Red Planet, with the tallest volcano (Olympus Mons) and a canyon system in the solar system.',
  },
  {
    name: 'Jupiter',
    color: '#d4a574',
    radius: 18,
    orbitRadius: 240,
    realDiameter: '142,984 km',
    realDistance: '778.6 million km',
    orbitalPeriod: '11.86 years',
    orbitalSpeed: 0.084,
    angle: Math.random() * Math.PI * 2,
    description: 'The largest planet — a gas giant with a Great Red Spot storm larger than Earth.',
  },
  {
    name: 'Saturn',
    color: '#f0d890',
    radius: 15,
    orbitRadius: 310,
    realDiameter: '120,536 km',
    realDistance: '1,433.5 million km',
    orbitalPeriod: '29.46 years',
    orbitalSpeed: 0.034,
    angle: Math.random() * Math.PI * 2,
    description: 'Famous for its stunning ring system made of ice and rock particles.',
    ringColor: '#c8b06080',
  },
  {
    name: 'Uranus',
    color: '#7ec8e3',
    radius: 11,
    orbitRadius: 375,
    realDiameter: '51,118 km',
    realDistance: '2,872.5 million km',
    orbitalPeriod: '84.01 years',
    orbitalSpeed: 0.012,
    angle: Math.random() * Math.PI * 2,
    description: 'An ice giant that rotates on its side. It has a faint ring system and 27 known moons.',
  },
  {
    name: 'Neptune',
    color: '#4060e0',
    radius: 10,
    orbitRadius: 430,
    realDiameter: '49,528 km',
    realDistance: '4,495.1 million km',
    orbitalPeriod: '164.8 years',
    orbitalSpeed: 0.006,
    angle: Math.random() * Math.PI * 2,
    description: 'The windiest planet with speeds up to 2,100 km/h. It has a vivid blue color from methane.',
  },
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<PlanetData[]>(PLANETS_DATA.map(p => ({ ...p })));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const lastTimeRef = useRef<number>(0);
  const starsRef = useRef<{ x: number; y: number; size: number; brightness: number }[]>([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Generate stars once
  useEffect(() => {
    const stars: { x: number; y: number; size: number; brightness: number }[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }
    starsRef.current = stars;
  }, []);

  const drawSolarSystem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    starsRef.current.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
    });

    // Draw orbit paths
    planetsRef.current.forEach(planet => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    sunGradient.addColorStop(0, '#fff7e0');
    sunGradient.addColorStop(0.3, '#ffdd44');
    sunGradient.addColorStop(0.7, '#ff9900');
    sunGradient.addColorStop(1, '#ff660040');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 60);
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planetsRef.current.forEach(planet => {
      const x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const y = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Planet shadow/glow
      const planetGlow = ctx.createRadialGradient(x, y, 0, x, y, planet.radius * 2);
      planetGlow.addColorStop(0, planet.color + '40');
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        x - planet.radius * 0.3,
        y - planet.radius * 0.3,
        0,
        x,
        y,
        planet.radius
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(1, planet.color);
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn's ring
      if (planet.ringColor) {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius * 2.2, planet.radius * 0.6, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = planet.ringColor;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Highlight if hovered or selected
      if (hoveredPlanet === planet.name || selectedPlanet?.name === planet.name) {
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Planet label
      if (hoveredPlanet === planet.name) {
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y - planet.radius - 10);
      }
    });
  }, [hoveredPlanet, selectedPlanet]);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    // Update planet angles
    if (isPlayingRef.current) {
      planetsRef.current.forEach(planet => {
        planet.angle += planet.orbitalSpeed * speedRef.current * deltaTime * 0.5;
      });
    }

    drawSolarSystem(ctx, width, height);
    animationRef.current = requestAnimationFrame(animate);
  }, [drawSolarSystem]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Handle click on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let clickedPlanet: PlanetData | null = null;

    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

      if (dist <= planet.radius + 8) {
        clickedPlanet = planet;
        break;
      }
    }

    setSelectedPlanet(clickedPlanet);
  };

  // Handle mouse move for hover effect
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let found = false;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

      if (dist <= planet.radius + 8) {
        setHoveredPlanet(planet.name);
        canvas.style.cursor = 'pointer';
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-wide">
            ☀️ Solar System Explorer
          </h1>
          <p className="text-gray-400 text-sm mt-1">Click on any planet to learn more</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl px-6 py-3 shadow-xl">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium">Speed</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-white text-sm font-mono w-12 text-center">{speed.toFixed(1)}x</span>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            planetsRef.current = PLANETS_DATA.map(p => ({ ...p, angle: Math.random() * Math.PI * 2 }));
            setSpeed(1);
            setIsPlaying(true);
          }}
          className="px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
          title="Reset"
        >
          Reset
        </button>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-6 z-20 w-80 bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{ backgroundColor: selectedPlanet.color }}
              />
              <h2 className="text-white text-xl font-bold">{selectedPlanet.name}</h2>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="space-y-3">
            <InfoRow label="Diameter" value={selectedPlanet.realDiameter} icon="📏" />
            <InfoRow label="Distance from Sun" value={selectedPlanet.realDistance} icon="🌍" />
            <InfoRow label="Orbital Period" value={selectedPlanet.orbitalPeriod} icon="🔄" />
          </div>
        </div>
      )}

      {/* Planet quick-select bar */}
      <div className="absolute top-20 left-6 z-10 flex flex-col gap-2">
        {PLANETS_DATA.map(planet => (
          <button
            key={planet.name}
            onClick={() => setSelectedPlanet(planet)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPlanet?.name === planet.name
                ? 'bg-indigo-600/80 text-white'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: planet.color }}
            />
            {planet.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

export default App;
