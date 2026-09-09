const { useState } = React;

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
    </div>
  );
}
