const { useState, useRef, useEffect } = React;

// Elk level is getekend op een vast canvas van 1200x700 (dezelfde maat als
// de viewBox van de achtergrondtekeningen). Stage schaalt dat canvas als
// geheel naar de werkelijk beschikbare ruimte, zodat personages, tekstvakken
// en achtergrond altijd op hun plek en in de juiste onderlinge verhouding
// blijven staan — ongeacht schermbreedte of browser-zoom.
const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 700;

function Stage({ children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      // "Cover"-schaal: vult altijd de hele ruimte (net als de achtergrond
      // dat nu al met preserveAspectRatio="slice" doet), met kleine
      // overloop die door overflow:hidden wordt afgesneden.
      setScale(Math.max(width / STAGE_WIDTH, height / STAGE_HEIGHT));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function EUGameComplete() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [fadeState, setFadeState] = useState('visible');

  const transitionToNextLevel = (nextLevel) => {
    // Fade out (300ms)
    setFadeState('fading-out');

    setTimeout(() => {
      // Black screen (400ms)
      setFadeState('black');

      setTimeout(() => {
        // Switch level and fade in (300ms)
        setCurrentLevel(nextLevel);
        setFadeState('fading-in');

        setTimeout(() => {
          setFadeState('visible');
        }, 300);
      }, 400);
    }, 300);
  };

  const getOpacity = () => {
    if (fadeState === 'fading-out' || fadeState === 'black') return 0;
    return 1;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Stage>
        <div
          className="absolute inset-0"
          style={{
            opacity: getOpacity(),
            transition: (fadeState === 'fading-out' || fadeState === 'fading-in')
              ? 'opacity 300ms ease-in-out'
              : 'none'
          }}
        >
          {currentLevel === 1 && <Level1 onComplete={() => transitionToNextLevel(2)} />}
          {currentLevel === 2 && <Level2 onComplete={() => transitionToNextLevel(3)} />}
          {currentLevel === 3 && <Level3 onComplete={() => transitionToNextLevel(4)} />}
          {currentLevel === 4 && <Level4 onComplete={() => transitionToNextLevel(5)} />}
          {currentLevel === 5 && <Level5 />}
        </div>
      </Stage>
    </div>
  );
}
