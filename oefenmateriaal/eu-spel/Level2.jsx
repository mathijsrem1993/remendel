const { useState, useEffect } = React;

function Level2({ onComplete }) {
  const [currentText, setCurrentText] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [speechBubbleKey, setSpeechBubbleKey] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [draggedPayoff, setDraggedPayoff] = useState(null);
  const [bottomRightCell, setBottomRightCell] = useState(null);
  const [cellFlash, setCellFlash] = useState(null); // 'correct' or 'incorrect'

  useEffect(() => {
    // Speech bubble appears after 1 second
    const speechTimer = setTimeout(() => {
      setShowSpeechBubble(true);
    }, 1000);

    return () => {
      clearTimeout(speechTimer);
    };
  }, []);

  const texts = [
    "<strong>Van Weel:</strong> Dank u wel dat ik langs mag komen, meneer Draghi. Aangezien u de voormalig president van de Europese Centrale Bank en voormalig premier van Italië bent, zijn er weinig mensen met meer expertise over Europese samenwerking.",
    "<strong>Van Weel:</strong> Zou u mij meer kunnen vertellen over het rapport dat voor ons op tafel ligt? 'The future of European competitiveness' klinkt zeer relevant voor mijn debat over Europese integratie.",
    "<strong>Draghi:</strong> Europa staat op een kruispunt. We verliezen terrein ten opzichte van de VS en China op cruciale gebieden: innovatie, productiviteit, en economische groei. Dit rapport legt bloot dat zonder diepere integratie en gezamenlijke investeringen, Europa irrelevant dreigt te worden op het wereldtoneel.",
    "<strong>Draghi:</strong> Je kan het zien als een economische spelsituatie. Als Nederland en alle andere lidstaten niet inzetten op meer Europese integratie, dan zullen we nog afhankelijker worden van andere wereldmachten. Onze economie dreigt irrelevant te worden. Dit is het slechtst denkbare scenario.",
    "<strong>Draghi:</strong> In de matrix gaan we de opbrengsten van keuzes weergeven. Een pijl omhoog staat voor gestegen nettobaten (netto baten = economische groei - investeringen). Hoe meer hoe beter. Een pijl naar beneden staat voor gedaalde nettobaten. Hoe meer pijlen hoe slechter. Sleep de passende opbrengsten naar de cel rechtsonder.",
    "<strong>Draghi:</strong> Dit zijn inderdaad de juiste opbrengsten. We hoeven als EU-lidstaten geen extra investeringen te doen. Op de korte termijn lijkt dit interessant, maar op de lange termijn zorgt dit ervoor dat we ingehaald worden door andere landen.",
    "<strong>Van Weel:</strong> Bedankt voor uw tijd meneer Draghi. Ik ga nu terug naar mijn werkkamer, daar heb ik een afspraak."
  ];

  const handleNext = () => {
    if (currentText < texts.length - 1) {
      setCurrentText(currentText + 1);
      // Trigger bubble animation when switching between speakers (text 1 to 2, and text 6 to 7)
      if (currentText === 1 || currentText === 5) {
        setSpeechBubbleKey(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentText > 0) {
      setCurrentText(currentText - 1);
      // Trigger bubble animation when switching between speakers (text 2 to 1, and text 7 to 6)
      if (currentText === 2 || currentText === 6) {
        setSpeechBubbleKey(prev => prev + 1);
      }
    }
  };

  const handleNavigateToLevel3 = () => {
    onComplete();
  };

  // Drag-and-drop handlers
  const handleDragStart = (payoff) => {
    setDraggedPayoff(payoff);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedPayoff) return;

    const correctAnswer = "↓, ↓";
    
    if (draggedPayoff === correctAnswer) {
      // Correct answer!
      setBottomRightCell({ payoff: draggedPayoff, isCorrect: true });
      setCellFlash('correct');
      
      // Auto-advance to text 6 after a short delay
      setTimeout(() => {
        setCurrentText(5);
        setSpeechBubbleKey(prev => prev + 1);
        setCellFlash(null);
      }, 800);
    } else {
      // Wrong answer - flash red and bounce back
      setCellFlash('incorrect');
      
      setTimeout(() => {
        setCellFlash(null);
      }, 600);
    }
    
    setDraggedPayoff(null);
  };

  return (
    <div className="w-[1200px] h-[700px] flex-shrink-0 bg-gradient-to-b from-stone-100 to-stone-50 relative overflow-hidden flex flex-col">
      {/* Hint Button */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <HelpCircle className="w-6 h-6 text-blue-600" />
      </button>

      {/* Hint Panel */}
      {showHint && (
        <div className="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-xl p-4 w-64 border-2 border-blue-400">
          <button
            onClick={() => setShowHint(false)}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-blue-800 mb-2">💡 Europese integratie</h3>
          <p className="text-sm text-gray-700">
            Europese integratie is het bundelen van beleid tussen EU-landen, bijvoorbeeld op het gebied van defensie en economie, om samen sterker en concurrerender te worden. Op korte termijn kost dit geld en nationale beleidsvrijheid, maar op lange termijn levert het meer veiligheid, economische kracht en stabiliteit op.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Mario Draghi's Office Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
          {/* Floor - dark wood */}
          <rect x="0" y="500" width="1200" height="200" fill="#3E3228" />
          
          {/* Back Wall - sober grey */}
          <rect x="0" y="0" width="1200" height="500" fill="#B8B8B0" />
          
          {/* Large window with outdoor sky and clouds */}
          <rect x="800" y="50" width="350" height="380" fill="#87CEEB" stroke="#5A5A52" strokeWidth="8" />
          <line x1="975" y1="50" x2="975" y2="430" stroke="#5A5A52" strokeWidth="6" />
          <line x1="800" y1="240" x2="1150" y2="240" stroke="#5A5A52" strokeWidth="6" />
          
          {/* Sky - light blue gradient */}
          <rect x="810" y="60" width="155" height="170" fill="#B3D9F2" />
          <rect x="985" y="60" width="155" height="170" fill="#B3D9F2" />
          <rect x="810" y="250" width="155" height="170" fill="#A8CFED" />
          <rect x="985" y="250" width="155" height="170" fill="#A8CFED" />
          
          {/* Clouds - fluffy white clouds */}
          <ellipse cx="850" cy="100" rx="30" ry="18" fill="white" opacity="0.9" />
          <ellipse cx="870" cy="95" rx="35" ry="20" fill="white" opacity="0.9" />
          <ellipse cx="890" cy="100" rx="28" ry="16" fill="white" opacity="0.9" />
          
          <ellipse cx="1030" cy="130" rx="25" ry="15" fill="white" opacity="0.85" />
          <ellipse cx="1050" cy="125" rx="30" ry="18" fill="white" opacity="0.85" />
          
          <ellipse cx="840" cy="300" rx="32" ry="19" fill="white" opacity="0.88" />
          <ellipse cx="860" cy="295" rx="28" ry="16" fill="white" opacity="0.88" />
          
          <ellipse cx="1070" cy="340" rx="35" ry="20" fill="white" opacity="0.9" />
          <ellipse cx="1095" cy="335" rx="30" ry="18" fill="white" opacity="0.9" />
          <ellipse cx="1115" cy="340" rx="25" ry="15" fill="white" opacity="0.9" />
          
          {/* Framed chart on wall - rentecurves graph */}
          <rect x="120" y="160" width="200" height="140" fill="#2C2C28" stroke="#1A1A18" strokeWidth="6" />
          <rect x="135" y="175" width="170" height="110" fill="#F8F8F6" />
          
          {/* Graph lines - grey curves over decades */}
          <path d="M 145 265 Q 180 240 220 235 Q 260 232 295 245" stroke="#8A8A82" strokeWidth="1.5" fill="none" />
          <path d="M 145 255 Q 180 235 220 228 Q 260 225 295 238" stroke="#8A8A82" strokeWidth="1.5" fill="none" />
          <path d="M 145 245 Q 180 225 220 220 Q 260 218 295 230" stroke="#8A8A82" strokeWidth="1.5" fill="none" />
          
          {/* Graph axes */}
          <line x1="145" y1="275" x2="295" y2="275" stroke="#4A4A42" strokeWidth="1" />
          <line x1="145" y1="185" x2="145" y2="275" stroke="#4A4A42" strokeWidth="1" />
          
          {/* Clock without numbers - minimalist */}
          <circle cx="680" cy="140" r="35" fill="white" stroke="#4A4A42" strokeWidth="3" />
          <line x1="680" y1="140" x2="680" y2="120" stroke="#2C2C28" strokeWidth="2.5" />
          <line x1="680" y1="140" x2="695" y2="150" stroke="#2C2C28" strokeWidth="2" />
          <circle cx="680" cy="140" r="4" fill="#2C2C28" />
          
          {/* EU flag on wall - blue with exactly 12 gold dots in perfect circle */}
          <rect x="450" y="180" width="120" height="90" fill="#003399" />
          {/* 12 dots in perfect circle formation - like EU flag */}
          {/* Center point: (510, 225), radius: 25px */}
          <circle cx="510" cy="200" r="3.5" fill="#FFCC00" /> {/* Top - 12 o'clock */}
          <circle cx="522.5" cy="203.35" r="3.5" fill="#FFCC00" /> {/* 1 o'clock */}
          <circle cx="531.65" cy="212.5" r="3.5" fill="#FFCC00" /> {/* 2 o'clock */}
          <circle cx="535" cy="225" r="3.5" fill="#FFCC00" /> {/* 3 o'clock - right */}
          <circle cx="531.65" cy="237.5" r="3.5" fill="#FFCC00" /> {/* 4 o'clock */}
          <circle cx="522.5" cy="246.65" r="3.5" fill="#FFCC00" /> {/* 5 o'clock */}
          <circle cx="510" cy="250" r="3.5" fill="#FFCC00" /> {/* 6 o'clock - bottom */}
          <circle cx="497.5" cy="246.65" r="3.5" fill="#FFCC00" /> {/* 7 o'clock */}
          <circle cx="488.35" cy="237.5" r="3.5" fill="#FFCC00" /> {/* 8 o'clock */}
          <circle cx="485" cy="225" r="3.5" fill="#FFCC00" /> {/* 9 o'clock - left */}
          <circle cx="488.35" cy="212.5" r="3.5" fill="#FFCC00" /> {/* 10 o'clock */}
          <circle cx="497.5" cy="203.35" r="3.5" fill="#FFCC00" /> {/* 11 o'clock */}
        </svg>

        {/* Mario Draghi - to the RIGHT of report, with more space */}
        <div className="absolute bottom-[140px] left-[770px] z-10">
          <svg width="220" height="270" viewBox="0 0 280 340">
            {/* Body - sitting, BLACK suit */}
            <g>
              {/* Legs - dark grey trousers, partially visible behind desk - NO GAP */}
              <rect x="125" y="235" width="28" height="100" fill="#2a2a2a" />
              <rect x="157" y="235" width="28" height="100" fill="#2a2a2a" />
              
              {/* Torso with white shirt visible */}
              <rect x="120" y="140" width="70" height="95" fill="white" />
              
              {/* Black suit jacket - OPEN to show shirt and tie */}
              <path d="M 120 140 L 125 175 L 130 215 L 130 235 L 120 235 L 120 140" fill="#1a1a1a" />
              <path d="M 190 140 L 185 175 L 180 215 L 180 235 L 190 235 L 190 140" fill="#1a1a1a" />
              
              {/* Jacket collar */}
              <path d="M 120 140 L 130 145 L 135 140" fill="#1a1a1a" />
              <path d="M 190 140 L 180 145 L 175 140" fill="#1a1a1a" />
              
              {/* White shirt collar */}
              <path d="M 135 135 L 155 140 L 175 135 L 173 147 L 155 152 L 137 147 Z" fill="white" />
              
              {/* Blue tie - standard blue */}
              <path d="M 155 140 L 150 182 L 155 225 L 160 182 Z" fill="#1E5A9E" />
              <path d="M 155 140 L 152 145 L 155 150 L 158 145 Z" fill="#2668B0" />
              
              {/* Suit buttons */}
              <circle cx="130" cy="185" r="3" fill="#0a0a0a" />
              <circle cx="180" cy="185" r="3" fill="#0a0a0a" />
              
              {/* Arms with black suit sleeves */}
              <rect x="95" y="155" width="25" height="80" fill="#1a1a1a" rx="8" />
              <rect x="190" y="155" width="25" height="80" fill="#1a1a1a" rx="8" />
              
              {/* White shirt cuffs */}
              <rect x="95" y="225" width="25" height="12" fill="white" />
              <rect x="190" y="225" width="25" height="12" fill="white" />
              
              {/* Hands on desk */}
              <ellipse cx="107.5" cy="245" rx="14" ry="16" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="245" rx="14" ry="16" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="145" y="115" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - based on Mario Draghi photo */}
              <ellipse cx="155" cy="80" rx="48" ry="50" fill="#F5D5C0" />
              
              {/* Hair - DARK GREY with FULL head of hair and SIDE parting (left side) */}
              <path d="M 107 70 Q 107 40 120 35 Q 135 32 155 35 Q 175 32 190 35 Q 203 40 203 70 Q 203 85 198 90 L 195 75 Q 190 45 155 40 Q 120 45 115 75 L 112 90 Q 107 85 107 70" fill="#4A4A4A" />
              
              {/* Side parting - LEFT side (not center) */}
              <line x1="130" y1="35" x2="135" y2="65" stroke="#F5D5C0" strokeWidth="2" />
              
              {/* Side hair - grey, full */}
              <path d="M 107 65 L 107 85 Q 108 90 112 90 L 115 70 Z" fill="#4A4A4A" />
              <path d="M 203 65 L 203 85 Q 202 90 198 90 L 195 70 Z" fill="#4A4A4A" />
              
              {/* Glasses - distinctive feature */}
              <rect x="118" y="73" width="25" height="22" fill="none" stroke="#2C2C2C" strokeWidth="2.5" rx="3" />
              <rect x="167" y="73" width="25" height="22" fill="none" stroke="#2C2C2C" strokeWidth="2.5" rx="3" />
              <line x1="143" y1="84" x2="167" y2="84" stroke="#2C2C2C" strokeWidth="2.5" />
              
              {/* Eyes behind glasses - serious, experienced look */}
              <ellipse cx="130" cy="84" rx="8" ry="9" fill="white" />
              <ellipse cx="179" cy="84" rx="8" ry="9" fill="white" />
              <circle cx="130" cy="85" r="5" fill="#4A4A3A" />
              <circle cx="179" cy="85" r="5" fill="#4A4A3A" />
              <circle cx="132" cy="83" r="2" fill="white" />
              <circle cx="181" cy="83" r="2" fill="white" />
              
              {/* Eyebrows - grey, serious */}
              <path d="M 118 70 Q 130 66 140 69" stroke="#6A6A6A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 170 69 Q 180 66 192 70" stroke="#6A6A6A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              
              {/* Forehead wrinkles - subtle aging lines */}
              <path d="M 120 60 Q 155 58 190 60" stroke="#C4A48A" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M 125 52 Q 155 50 185 52" stroke="#C4A48A" strokeWidth="0.9" fill="none" opacity="0.25" />
              <path d="M 130 45 Q 155 44 180 45" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.2" />
              
              {/* Eye bags - older, experienced */}
              <path d="M 123 91 Q 130 94 137 91" stroke="#E8C4A8" strokeWidth="1.5" fill="none" opacity="0.7" />
              <path d="M 172 91 Q 179 94 186 91" stroke="#E8C4A8" strokeWidth="1.5" fill="none" opacity="0.7" />
              
              {/* Nose - prominent */}
              <path d="M 155 85 L 150 100 L 155 104 L 160 100 Z" fill="#E8C4A8" />
              <ellipse cx="150" cy="101" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <ellipse cx="160" cy="101" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <path d="M 155 85 L 155 103" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.4" />
              
              {/* Mouth - slight smile, reserved */}
              <path d="M 133 112 Q 155 118 177 112" stroke="#A0522D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 136 114 Q 155 117 174 114" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
              
              {/* Wrinkles - age and experience */}
              <path d="M 120 105 Q 125 111 128 114" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 190 105 Q 185 111 182 114" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 125 95 Q 130 98 135 100" stroke="#D4B49A" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M 185 95 Q 180 98 175 100" stroke="#D4B49A" strokeWidth="1" fill="none" opacity="0.5" />
              
              {/* Ears */}
              <ellipse cx="107" cy="80" rx="9" ry="13" fill="#F5D5C0" />
              <ellipse cx="203" cy="80" rx="9" ry="13" fill="#F5D5C0" />
              <ellipse cx="109" cy="80" rx="4" ry="7" fill="#E8C4A8" />
              <ellipse cx="201" cy="80" rx="4" ry="7" fill="#E8C4A8" />
            </g>
          </svg>
        </div>

        {/* David van Weel - LOWER so legs are behind desk, a bit more LEFT */}
        <div 
          className="absolute bottom-[140px] z-10"
          style={{
            left: '460px'
          }}
        >
          <svg width="230" height="255" viewBox="0 0 300 320">
            {/* Body - with LEGS visible */}
            <g>
              {/* Legs - grey trousers */}
              <rect x="130" y="250" width="30" height="60" fill="#3F3F3F" />
              <rect x="155" y="250" width="30" height="60" fill="#3F3F3F" />
              
              {/* Shoes */}
              <ellipse cx="145" cy="315" rx="18" ry="8" fill="#1a1a1a" />
              <ellipse cx="170" cy="315" rx="18" ry="8" fill="#1a1a1a" />
              {/* Torso with white shirt visible */}
              <rect x="125" y="130" width="65" height="120" fill="white" />
              
              {/* Suit jacket - dark grey, OPEN to show shirt and tie */}
              {/* Left lapel */}
              <path d="M 125 130 L 130 165 L 135 210 L 135 250 L 125 250 L 125 130" fill="#3F3F3F" />
              {/* Right lapel */}
              <path d="M 190 130 L 185 165 L 180 210 L 180 250 L 190 250 L 190 130" fill="#3F3F3F" />
              
              {/* Jacket collar */}
              <path d="M 125 130 L 135 135 L 140 130" fill="#3F3F3F" />
              <path d="M 190 130 L 180 135 L 175 130" fill="#3F3F3F" />
              
              {/* White shirt collar */}
              <path d="M 140 125 L 157.5 130 L 175 125 L 173 137 L 157.5 142 L 142 137 Z" fill="white" />
              
              {/* Dark blue tie - navy, clearly visible */}
              <path d="M 157.5 130 L 152 180 L 157.5 230 L 163 180 Z" fill="#001F3F" />
              <path d="M 157.5 130 L 154 135 L 157.5 140 L 161 135 Z" fill="#002855" />
              
              {/* Suit buttons */}
              <circle cx="135" cy="175" r="3" fill="#2F2F2F" />
              <circle cx="180" cy="175" r="3" fill="#2F2F2F" />
              
              {/* Arms with grey suit sleeves */}
              <rect x="100" y="145" width="25" height="105" fill="#3F3F3F" rx="8" />
              <rect x="190" y="145" width="25" height="105" fill="#3F3F3F" rx="8" />
              
              {/* White shirt cuffs */}
              <rect x="100" y="240" width="25" height="15" fill="white" />
              <rect x="190" y="240" width="25" height="15" fill="white" />
              
              {/* Hands */}
              <ellipse cx="112.5" cy="262" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="262" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck - HIGHER */}
              <rect x="147.5" y="100" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - based on David van Weel - HIGHER */}
              <ellipse cx="157.5" cy="75" rx="50" ry="54" fill="#F5D5C0" />
              
              {/* Hair - reddish/light brown, receding */}
              <path d="M 107.5 65 Q 105.5 17 157.5 5 Q 209.5 17 207.5 65 Q 207.5 81 201.5 87 L 195.5 73 Q 191.5 23 157.5 18 Q 123.5 23 119.5 73 L 113.5 87 Q 107.5 81 107.5 65" fill="#A67C52" />
              
              {/* Receding hairline */}
              <path d="M 117.5 43 Q 137.5 25 157.5 21 Q 177.5 25 197.5 43" stroke="#A67C52" strokeWidth="2" fill="none" />
              <ellipse cx="132.5" cy="33" rx="8" ry="12" fill="#F5D5C0" />
              <ellipse cx="182.5" cy="33" rx="8" ry="12" fill="#F5D5C0" />
              
              {/* Eyes */}
              <ellipse cx="132.5" cy="70" rx="10" ry="12" fill="white" />
              <ellipse cx="182.5" cy="70" rx="10" ry="12" fill="white" />
              <circle cx="132.5" cy="72" r="6.5" fill="#5D4E37" />
              <circle cx="182.5" cy="72" r="6.5" fill="#5D4E37" />
              <circle cx="134.5" cy="70" r="2.8" fill="white" />
              <circle cx="184.5" cy="70" r="2.8" fill="white" />
              
              {/* Eyebrows */}
              <path d="M 119.5 57 Q 132.5 52 143.5 56" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 171.5 56 Q 182.5 52 195.5 57" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Eye bags */}
              <path d="M 125.5 77 Q 132.5 80 139.5 77" stroke="#E8C4A8" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M 175.5 77 Q 182.5 80 189.5 77" stroke="#E8C4A8" strokeWidth="1" fill="none" opacity="0.5" />
              
              {/* Nose */}
              <path d="M 157.5 75 L 152.5 89 L 157.5 93 L 162.5 89 Z" fill="#E8C4A8" />
              <ellipse cx="152.5" cy="90" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <ellipse cx="162.5" cy="90" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <path d="M 157.5 75 L 157.5 92" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.4" />
              
              {/* Smile */}
              <path d="M 132.5 102 Q 157.5 111 182.5 102" stroke="#A0522D" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 135.5 104 Q 157.5 109 179.5 104" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
              
              {/* Smile lines */}
              <path d="M 127.5 95 Q 131.5 101 132.5 105" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 187.5 95 Q 183.5 101 182.5 105" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.6" />
              
              {/* Stubble shadow */}
              <ellipse cx="157.5" cy="97" rx="28" ry="18" fill="#D4B49A" opacity="0.15" />
              
              {/* Ears */}
              <ellipse cx="107.5" cy="75" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="207.5" cy="75" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="109.5" cy="75" rx="5" ry="8" fill="#E8C4A8" />
              <ellipse cx="205.5" cy="75" rx="5" ry="8" fill="#E8C4A8" />
            </g>
          </svg>
        </div>

        {/* Desk Overlay - covers character legs exactly as per schema */}
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
            {/* Massive walnut desk - positioned HIGHER to cover legs */}
            <rect x="300" y="520" width="600" height="45" fill="#4A3428" />
            {/* Closed front panel */}
            <rect x="360" y="565" width="520" height="80" fill="#3A2418" />
            {/* Desktop surface */}
            <rect x="305" y="518" width="590" height="6" fill="#5A4838" />
            
            {/* Desk items on top of desk */}
            
            {/* Report - center BETWEEN David and Draghi - LIGHT BLUE */}
            <rect x="520" y="480" width="110" height="75" fill="#B8D4E8" stroke="#9BB8D0" strokeWidth="2" />
            <rect x="525" y="485" width="100" height="65" fill="#D0E4F5" />
            <text x="575" y="505" fontSize="7" fontWeight="bold" fill="#1a1a1a" textAnchor="middle">The future of</text>
            <text x="575" y="515" fontSize="7" fontWeight="bold" fill="#1a1a1a" textAnchor="middle">European</text>
            <text x="575" y="525" fontSize="7" fontWeight="bold" fill="#1a1a1a" textAnchor="middle">competitiveness</text>
            <text x="575" y="540" fontSize="6" fill="#666" textAnchor="middle">Mario Draghi</text>
            
            {/* Fountain pen - right */}
            <rect x="720" y="510" width="6" height="35" fill="#2C2C28" transform="rotate(-15 723 527)" />
            <circle cx="723" cy="510" r="3" fill="#C0A060" />
            <path d="M 721 542 L 723 547 L 725 542" fill="#1A1A18" />
            
            {/* Nameplate - Mario Draghi - right side */}
            <rect x="750" y="495" width="140" height="28" fill="#C19A6B" stroke="#8B7355" strokeWidth="2" />
            <rect x="754" y="499" width="132" height="20" fill="#D4AF37" />
            <text x="820" y="512" fontSize="10" fontWeight="bold" fill="#1F2937" textAnchor="middle">Mario Draghi</text>
          </svg>
        </div>

        {/* Speech Bubble - David (LEFT SIDE OF SCREEN) - text 1, 2, and 7 */}
        {showSpeechBubble && (currentText <= 1 || currentText === 6) && texts[currentText] && (
          <div 
            key={speechBubbleKey}
            className="absolute top-6 left-4 w-80 z-30 animate-poof"
          >
            <div className="relative bg-white rounded-2xl px-6 py-5 shadow-2xl border-4 border-gray-800">
              {/* Text content */}
              <p className="text-base text-gray-800 leading-relaxed font-sans">
                {currentText === 1 ? (
                  <>
                    <strong>Van Weel:</strong> Zou u mij meer kunnen vertellen over het rapport dat voor ons op tafel ligt? 'The future of European competitiveness' klinkt zeer relevant voor mijn debat over <span 
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
                      onClick={() => setShowHint(!showHint)}
                    >Europese integratie</span>.
                  </>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: texts[currentText] }} />
                )}
              </p>
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentText === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentText === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Vorige
                </button>
                
                <div className="w-16"></div>
                
                {/* Special button for text 7 */}
                {currentText === 6 ? (
                  <button
                    onClick={handleNavigateToLevel3}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-lg font-bold"
                  >
                    Ga naar de VVD-werkkamer →
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                  >
                    Volgende
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Speech Bubble - Draghi (RIGHT SIDE OF SCREEN) - text 3, 4, 5, and 6 */}
        {showSpeechBubble && currentText >= 2 && currentText <= 5 && texts[currentText] && (
          <div 
            key={speechBubbleKey}
            className="absolute top-6 right-4 w-80 z-30 animate-poof"
          >
            <div className="relative bg-white rounded-2xl px-6 py-3 shadow-2xl border-4 border-gray-800">
              {/* Text content */}
              <p className="text-base text-gray-800 leading-snug font-sans">
                <span dangerouslySetInnerHTML={{ __html: texts[currentText] }} />
              </p>
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Vorige
                </button>
                
                <div className="w-16"></div>
                
                {/* Show "Volgende" button except at text 5 (index 4) */}
                {currentText !== 4 && currentText < texts.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                  >
                    Volgende
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-24"></div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payoff Matrix - appears at text 5 - with draggable payoff options */}
      {currentText === 4 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8 z-30">
          {/* Draggable payoff options - left side */}
          <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-gray-800">
            <h4 className="text-sm font-bold text-center mb-3 text-gray-700">Opbrengsten</h4>
            <div className="flex flex-col gap-2">
              {/* Option 1: ↑↑↑, ↑↑↑ */}
              <div 
                draggable
                onDragStart={() => handleDragStart("↑↑↑, ↑↑↑")}
                className="w-32 h-8 border-2 border-blue-400 rounded bg-blue-50 flex items-center justify-center cursor-move hover:shadow-lg transition-shadow"
              >
                <span className="text-sm">↑↑↑, ↑↑↑</span>
              </div>
              
              {/* Option 2: ↑, ↑↑↑ */}
              <div 
                draggable
                onDragStart={() => handleDragStart("↑, ↑↑↑")}
                className="w-32 h-8 border-2 border-blue-400 rounded bg-blue-50 flex items-center justify-center cursor-move hover:shadow-lg transition-shadow"
              >
                <span className="text-sm">↑, ↑↑↑</span>
              </div>
              
              {/* Option 3: ↑↑↑, ↑ */}
              <div 
                draggable
                onDragStart={() => handleDragStart("↑↑↑, ↑")}
                className="w-32 h-8 border-2 border-blue-400 rounded bg-blue-50 flex items-center justify-center cursor-move hover:shadow-lg transition-shadow"
              >
                <span className="text-sm">↑↑↑, ↑</span>
              </div>
              
              {/* Option 4: ↓, ↓ */}
              <div 
                draggable
                onDragStart={() => handleDragStart("↓, ↓")}
                className="w-32 h-8 border-2 border-blue-400 rounded bg-blue-50 flex items-center justify-center cursor-move hover:shadow-lg transition-shadow"
              >
                <span className="text-sm">↓, ↓</span>
              </div>
            </div>
          </div>
          
          {/* Payoff Matrix */}
          <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-gray-800">
            <h3 className="text-lg font-bold text-center mb-3 text-gray-800">Opbrengstenmatrix</h3>
            
            <div className="flex gap-3">
              {/* Row labels */}
              <div className="flex flex-col justify-center gap-2 pr-2">
                <div className="h-8"></div>
                <div className="flex items-center justify-end h-8">
                  <div className="text-sm font-bold text-blue-600" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>
                    NL
                  </div>
                </div>
              </div>
              
              {/* Main matrix */}
              <div className="flex flex-col">
                {/* Column headers */}
                <div className="flex gap-2 mb-2">
                  <div className="w-28"></div>
                  <div className="text-center font-bold text-gray-500">
                    <div className="mb-2 text-sm">Overige EU-lidstaten</div>
                    <div className="flex gap-2 justify-center">
                      <div className="px-2 py-1 rounded text-xs font-semibold text-gray-700 w-32">Meer EU-integratie</div>
                      <div className="px-2 py-1 rounded text-xs font-semibold text-gray-700 w-32">Huidig beleid</div>
                    </div>
                  </div>
                </div>
                
                {/* Matrix rows */}
                <div className="flex flex-col gap-2">
                  {/* Row 1: NL - Meer EU-integratie */}
                  <div className="flex gap-2 items-center">
                    <div className="px-2 py-1 rounded w-28 text-center font-semibold text-xs text-gray-700">Meer EU-integratie</div>
                    <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50"></div>
                    <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50"></div>
                  </div>
                  
                  {/* Row 2: NL - Huidig beleid */}
                  <div className="flex gap-2 items-center">
                    <div className="px-2 py-1 rounded w-28 text-center font-semibold text-xs text-gray-700">Huidig beleid</div>
                    <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50"></div>
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className={`w-32 h-8 border-4 border-black rounded flex items-center justify-center transition-all ${
                        cellFlash === 'correct' ? 'bg-green-50' :
                        cellFlash === 'incorrect' ? 'bg-red-50' :
                        bottomRightCell ? 'bg-green-50' :
                        'bg-gray-50 hover:bg-blue-50'
                      }`}
                    >
                      {bottomRightCell && (
                        <span className="text-xl">{bottomRightCell.payoff}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="pb-8 flex justify-center gap-2.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
          <div
            key={level}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              level === 2 
                ? 'bg-white border-2 border-white' 
                : 'bg-transparent border-2 border-white'
            }`}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes poof {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-poof {
          animation: poof 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
