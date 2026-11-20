import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const INTRO_DURATION = 4200;

const easeInOut = (value) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

const canPlayIntro = () => {
  if (typeof window === 'undefined') return false;

  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
};

const makeSquareShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-1, -1);
  shape.lineTo(1, -1);
  shape.lineTo(1, 1);
  shape.lineTo(-1, 1);
  shape.closePath();
  return shape;
};

const makeDust = () => {
  const positions = new Float32Array(180 * 3);
  const speeds = new Float32Array(180);

  for (let i = 0; i < 180; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 11;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    speeds[i] = 0.12 + Math.random() * 0.28;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: '#E6C786',
    size: 0.025,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return { points: new THREE.Points(geometry, material), speeds };
};

function IntroSplash({ uiLang = 'en' }) {
  const canvasRef = useRef(null);
  const shellRef = useRef(null);
  const washRef = useRef(null);
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(canPlayIntro);
  const isUrdu = uiLang === 'ur';

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const shell = shellRef.current;
    const wash = washRef.current;
    const text = textRef.current;
    if (!canvas || !shell || !wash || !text) return undefined;

    let renderer;
    let animationFrame = 0;
    let resizeHandler;
    let geometries = [];
    let materials = [];

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch (error) {
      console.error('Unable to initialize the intro WebGL scene.', error);
      setIsVisible(false);
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    camera.position.z = 8;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const star = new THREE.Group();
    scene.add(star);

    const gold = new THREE.MeshStandardMaterial({
      color: '#B68635',
      metalness: 0.85,
      roughness: 0.25,
      emissive: '#4A2E0C',
      emissiveIntensity: 0.12,
    });
    materials.push(gold);

    const shape = makeSquareShape();
    const starGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      curveSegments: 2,
    });
    starGeometry.computeVertexNormals();
    geometries.push(starGeometry);

    const firstSquare = new THREE.Mesh(starGeometry, gold);
    const secondSquare = new THREE.Mesh(starGeometry, gold);
    secondSquare.rotation.z = Math.PI / 4;
    firstSquare.position.z = -0.06;
    secondSquare.position.z = -0.06;
    star.add(firstSquare, secondSquare);

    const { points: dust, speeds } = makeDust();
    scene.add(dust);
    geometries.push(dust.geometry);
    materials.push(dust.material);

    const ambientLight = new THREE.AmbientLight('#E6C786', 1.25);
    const keyLight = new THREE.DirectionalLight('#FFF0C8', 3.2);
    keyLight.position.set(-3, 4, 6);
    const pointLight = new THREE.PointLight('#E6C786', 0, 12, 1.5);
    pointLight.position.set(0, 0, -1.5);
    scene.add(ambientLight, keyLight, pointLight);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resizeHandler = resize;
    window.addEventListener('resize', resizeHandler, { passive: true });
    resize();

    const startedAt = performance.now();
    const dustPositions = dust.geometry.attributes.position.array;

    const animate = (now) => {
      const elapsed = (now - startedAt) / 1000;
      const assembly = easeInOut(elapsed / 1.4);
      const reveal = easeInOut((elapsed - 1.4) / 1.4);
      const portal = easeInOut((elapsed - 2.8) / 1.4);
      const textOpacity =
        easeInOut((elapsed - 1.4) / 0.8) *
        (1 - easeInOut((elapsed - 2.8) / 0.7));

      star.scale.setScalar(0.03 + assembly * 0.9 + portal * 12);
      star.rotation.y = 0.16 + assembly * 0.3 + elapsed * 0.07;
      star.rotation.z = elapsed * 0.12;
      camera.position.z =
        elapsed < 1.4
          ? 8
          : elapsed < 2.8
            ? 8 - reveal * 3.8
            : 4.2 - portal * 8.7;

      pointLight.intensity =
        reveal > 0 && elapsed < 2.8
          ? (1.7 + Math.sin(elapsed * 3.2) * 0.25) * reveal
          : 0;

      for (let i = 0; i < speeds.length; i += 1) {
        const yIndex = i * 3 + 1;
        dustPositions[yIndex] += speeds[i] * 0.016;
        if (dustPositions[yIndex] > 4) dustPositions[yIndex] = -4;
      }
      dust.geometry.attributes.position.needsUpdate = true;

      text.style.opacity = String(textOpacity);
      wash.style.opacity = String(portal);
      shell.style.opacity = String(1 - easeInOut((elapsed - 3.5) / 0.7));

      renderer.render(scene, camera);

      if (elapsed < INTRO_DURATION / 1000) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        setIsVisible(false);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeHandler);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at center, #134E3A 0%, #0B3124 78%)',
        opacity: 1,
      }}
      aria-label={isUrdu ? 'تعارفی منظر' : 'Get a Quran introduction'}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      <div
        ref={washRef}
        className="pointer-events-none absolute inset-0 bg-[#FAF7F0]"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2 text-center text-[#FAF7F0]"
        style={{ opacity: 0 }}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <p
          className="mb-5 text-2xl leading-relaxed text-[#E6C786] sm:text-3xl"
          style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
          lang="ar"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1
          className={`font-semibold tracking-wide text-[#FAF7F0] ${
            isUrdu
              ? 'text-3xl leading-relaxed sm:text-5xl'
              : "font-['Lora',serif] text-4xl sm:text-6xl"
          }`}
          style={{ textShadow: '0 2px 24px rgba(0, 0, 0, 0.28)' }}
        >
          {isUrdu ? 'قرآن حاصل کریں' : 'Get a Quran'}
        </h1>
        <p
          className={`mt-4 text-[#E6C786] ${
            isUrdu ? 'text-base leading-relaxed sm:text-xl' : 'text-sm tracking-[0.18em] sm:text-base'
          }`}
        >
          {isUrdu ? 'مفت نسخہ قرآن مہم' : 'Free Hardcopy Initiative'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className={`absolute bottom-5 right-5 rounded-full border border-[#E6C786]/45 bg-[#0B3124]/45 px-4 py-2 text-sm text-[#FAF7F0] shadow-sm backdrop-blur transition-colors hover:bg-[#0B3124]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6C786] sm:bottom-8 sm:right-8 ${
          isUrdu ? 'text-base' : ''
        }`}
      >
        {isUrdu ? 'تعارف چھوڑیں' : 'Skip Intro'}
      </button>
    </div>
  );
}

export default IntroSplash;
