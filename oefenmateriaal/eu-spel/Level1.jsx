const { useState, useEffect } = React;

function Level1({ onComplete }) {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [speechBubbleKey, setSpeechBubbleKey] = useState(0);
  const [davidEntered, setDavidEntered] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    if (showIntro) return; // Don't start animations during intro
    
    // David walks in after 1 second
    const enterTimer = setTimeout(() => {
      setDavidEntered(true);
    }, 1000);

    // Speech bubble appears after David finishes walking (2.5 seconds total)
    const speechTimer = setTimeout(() => {
      setShowSpeechBubble(true);
    }, 2500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(speechTimer);
    };
  }, [showIntro]);

  const handleStartGame = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 1000); // Wait for fade animation to complete
  };

  const texts = [
    "Hallo! Ik ben David van Weel, minister van Buitenlandse Zaken namens de VVD in het kabinet-Schoof. Als minister ben ik verantwoordelijk voor de Nederlandse betrekkingen met andere landen en onze positie binnen de Europese Unie.",
    "Europa staat voor grote uitdagingen. Onze economische concurrentiepositie staat onder druk door China en de VS. Tegelijkertijd zien we een groeiende militaire dreiging aan onze grenzen. De vraag is: hoe reageren we hierop als Europa?",
    "Volgende week staat er een belangrijk debat op de agenda in de Tweede Kamer. Het gaat over de toekomst van Europese integratie. Moeten we meer of minder Europees samenwerken? Op de korte termijn levert dit kosten op voor Nederland. Op de lange termijn levert dit ons een hoop op.",
    "De discussie komt eigenlijk neer op een afweging: willen we meer autonomie behouden - dat betekent dat Nederland zelfstandig beslissingen blijft nemen - of kiezen we voor meer zekerheid door nauwer samen te werken in Europa?",
    "Om mijn standpunt goed te onderbouwen, ga ik verschillende experts raadplegen. Zij kunnen me helpen de voor- en nadelen helder te krijgen. Trouwens, als je tijdens het spel ergens niet uitkomt, klik dan rechtsboven op het vraagteken voor hints!"
  ];

  const handleNext = () => {
    if (currentText < texts.length - 1) {
      setCurrentText(currentText + 1);
      setSpeechBubbleKey(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentText > 0) {
      setCurrentText(currentText - 1);
      setSpeechBubbleKey(prev => prev + 1);
    }
  };

  const handleNavigateToLevel2 = () => {
    onComplete();
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-100 to-slate-50 relative overflow-hidden flex flex-col">
      {/* Intro Screen */}
      {showIntro && (
        <div 
          className="absolute inset-0 bg-black z-50 flex items-center justify-center"
          style={{
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 1s ease-in-out'
          }}
        >
          <div className="text-center">
            <p className="text-white text-2xl mb-8 max-w-2xl px-8">
              Welkom bij het spel over Europese integratie. Dit spel bestaat uit een fictief verhaal dat losjes op de werkelijkheid gebaseerd is en zich afspeelt in oktober 2025. Veel (leer)plezier!
            </p>
            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start het spel
            </button>
          </div>
        </div>
      )}

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
          <h3 className="font-bold text-blue-800 mb-2">💡 Hints</h3>
          <p className="text-sm text-gray-700">
            Lees alle tekstballonnen goed door. Let op de afwegingen die David maakt tussen autonomie en zekerheid!
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* VVD Office Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
          {/* Floor - darker wood */}
          <rect x="0" y="500" width="1200" height="200" fill="#4A3F35" />
          
          {/* Back Wall - professional grey */}
          <rect x="0" y="0" width="1200" height="500" fill="#D1D5DB" />
          
          {/* Wainscoting / wall paneling */}
          <rect x="0" y="350" width="1200" height="150" fill="#B8BDC5" />
          <line x1="0" y1="420" x2="1200" y2="420" stroke="#9CA3AF" strokeWidth="3" />
          
          {/* Large window on the right */}
          <rect x="850" y="60" width="280" height="320" fill="#B8D4E8" stroke="#4A5568" strokeWidth="6" />
          <line x1="990" y1="60" x2="990" y2="380" stroke="#4A5568" strokeWidth="4" />
          <line x1="850" y1="220" x2="1130" y2="220" stroke="#4A5568" strokeWidth="4" />
          
          {/* View through window - Den Haag buildings */}
          <rect x="860" y="70" width="120" height="140" fill="#8FADC7" opacity="0.3" />
          <rect x="1000" y="70" width="120" height="140" fill="#8FADC7" opacity="0.3" />
          <rect x="880" y="230" width="100" height="140" fill="#8FADC7" opacity="0.3" />
          
          {/* VVD Logo on wall - all three letters in a row with same proportions */}
          <g transform="translate(60, 130)">
            {/* First V - orange with blue shadow */}
            <path d="M 0 0 L 25 0 L 45 55 L 65 0 L 90 0 L 55 80 L 35 80 Z" fill="#FF6600" />
            <path d="M 8 8 L 28 8 L 45 50 L 62 8 L 82 8 L 52 72 L 38 72 Z" fill="#0033CC" />
            
            {/* Second V - orange with blue shadow */}
            <path d="M 65 0 L 90 0 L 110 55 L 130 0 L 155 0 L 120 80 L 100 80 Z" fill="#FF6600" />
            <path d="M 73 8 L 93 8 L 110 50 L 127 8 L 147 8 L 117 72 L 103 72 Z" fill="#0033CC" />
            
            {/* D - orange with blue shadow - same width as V's (~90px) */}
            <path d="M 160 0 L 210 0 Q 250 0 250 40 Q 250 80 210 80 L 160 80 Z" fill="#FF6600" />
            <path d="M 172 10 L 205 10 Q 238 10 238 40 Q 238 70 205 70 L 172 70 Z" fill="#0033CC" />
          </g>
          
          {/* Dutch landscape painting - simple clear windmill */}
          <rect x="320" y="140" width="200" height="130" fill="#654321" stroke="#3E2A1A" strokeWidth="8" />
          
          {/* Blue sky */}
          <rect x="335" y="155" width="170" height="55" fill="#5B9BD5" />
          
          {/* Green grass field */}
          <rect x="335" y="210" width="170" height="45" fill="#6B8E23" />
          
          {/* Large clear windmill in center */}
          <rect x="410" y="195" width="25" height="50" fill="#8B4513" />
          <path d="M 422.5 190 L 415 182 L 430 182 Z" fill="#CC6633" />
          
          {/* Windmill sails - very clear X pattern */}
          <g transform="translate(422.5, 195) rotate(20)">
            <rect x="-3" y="-50" width="6" height="50" fill="#2C2C2C" />
            <rect x="-50" y="-3" width="50" height="6" fill="#2C2C2C" />
            <rect x="-3" y="0" width="6" height="50" fill="#2C2C2C" />
            <rect x="0" y="-3" width="50" height="6" fill="#2C2C2C" />
          </g>
          
          {/* Some clouds */}
          <ellipse cx="370" cy="175" rx="20" ry="12" fill="white" opacity="0.8" />
          <ellipse cx="385" cy="172" rx="25" ry="14" fill="white" opacity="0.8" />
          <ellipse cx="470" cy="170" rx="22" ry="13" fill="white" opacity="0.8" />
          
          {/* Bookshelf on left - sitting on floor */}
          <rect x="50" y="230" width="160" height="270" fill="#5A4A3A" />
          <rect x="60" y="240" width="140" height="7" fill="#3E2F22" />
          <rect x="60" y="315" width="140" height="7" fill="#3E2F22" />
          <rect x="60" y="390" width="140" height="7" fill="#3E2F22" />
          <rect x="60" y="465" width="140" height="7" fill="#3E2F22" />
          
          {/* Books on shelf */}
          <rect x="65" y="247" width="20" height="60" fill="#0066CC" />
          <rect x="87" y="247" width="17" height="60" fill="#CC0000" />
          <rect x="106" y="247" width="23" height="60" fill="#006633" />
          <rect x="131" y="247" width="18" height="60" fill="#FF6600" />
          <rect x="151" y="247" width="25" height="60" fill="#660099" />
          
          <rect x="65" y="322" width="23" height="60" fill="#8B0000" />
          <rect x="90" y="322" width="19" height="60" fill="#004488" />
          <rect x="111" y="322" width="22" height="60" fill="#228B22" />
          <rect x="135" y="322" width="24" height="60" fill="#B8860B" />
          <rect x="161" y="322" width="19" height="60" fill="#4B0082" />
          
          {/* Plant with pot - on the floor */}
          <ellipse cx="1050" cy="480" rx="50" ry="15" fill="#8B4513" />
          <path d="M 1010 480 Q 1010 465 1020 450 L 1080 450 Q 1090 465 1090 480" fill="#A0826D" />
          <rect x="1020" y="450" width="60" height="30" fill="#A0826D" />
          
          {/* Plant stems */}
          <path d="M 1025 450 Q 1020 395 1015 350 Q 1013 325 1020 320" stroke="#2D5016" strokeWidth="5" fill="none" />
          <path d="M 1050 450 Q 1050 415 1055 370 Q 1057 340 1050 320" stroke="#2D5016" strokeWidth="5" fill="none" />
          <path d="M 1075 450 Q 1080 405 1085 360 Q 1087 330 1080 320" stroke="#2D5016" strokeWidth="5" fill="none" />
          
          {/* Leaves */}
          <ellipse cx="1020" cy="325" rx="28" ry="38" fill="#3A5F20" />
          <ellipse cx="1050" cy="320" rx="33" ry="43" fill="#3A5F20" />
          <ellipse cx="1080" cy="325" rx="28" ry="38" fill="#3A5F20" />
          
          {/* Executive desk - LARGE and realistic */}
          <rect x="280" y="410" width="650" height="35" fill="#5C4033" />
          <rect x="300" y="445" width="50" height="90" fill="#4A3326" />
          <rect x="860" y="445" width="50" height="90" fill="#4A3326" />
          
          {/* Desktop surface detail */}
          <rect x="285" y="408" width="640" height="5" fill="#6B4F3F" />
          
          {/* Organized desk items - left to right, no overlap */}
          
          {/* 1. Nameplate - compact */}
          <rect x="310" y="385" width="140" height="28" fill="#C19A6B" stroke="#8B7355" strokeWidth="2" />
          <rect x="314" y="389" width="132" height="20" fill="#D4AF37" />
          <text x="380" y="402" fontSize="10" fontWeight="bold" fill="#1F2937" textAnchor="middle">D.M. van Weel</text>
          <text x="380" y="410" fontSize="7" fill="#374151" textAnchor="middle">minister BuZa</text>
          
          {/* 2. Laptop - modern, single screen - raised to nameplate height */}
          <g transform="translate(480, 335)">
            <rect x="0" y="0" width="130" height="90" fill="#1F2937" rx="5" />
            <rect x="8" y="6" width="114" height="70" fill="#3B82F6" />
            <rect x="55" y="82" width="20" height="12" fill="#4B5563" />
            <ellipse cx="65" cy="94" rx="40" ry="7" fill="#374151" />
          </g>
          
          {/* 3. Stack of papers */}
          <rect x="640" y="385" width="70" height="50" fill="white" stroke="#CCC" strokeWidth="1" />
          <rect x="642" y="387" width="66" height="46" fill="#F8F8F8" />
          <line x1="648" y1="395" x2="700" y2="395" stroke="#DDD" strokeWidth="1" />
          <line x1="648" y1="402" x2="700" y2="402" stroke="#DDD" strokeWidth="1" />
          <line x1="648" y1="409" x2="700" y2="409" stroke="#DDD" strokeWidth="1" />
          <line x1="648" y1="416" x2="700" y2="416" stroke="#DDD" strokeWidth="1" />
          <line x1="648" y1="423" x2="700" y2="423" stroke="#DDD" strokeWidth="1" />
          
          {/* 4. Coffee cup with steam */}
          <ellipse cx="760" cy="395" rx="16" ry="11" fill="#8B4513" />
          <rect x="744" y="385" width="32" height="28" fill="#D2691E" rx="3" />
          <ellipse cx="760" cy="385" rx="16" ry="8" fill="#654321" />
          <path d="M 776 395 Q 788 395 788 401 Q 788 407 776 407" stroke="#8B4513" strokeWidth="2" fill="none" />
          {/* Steam wisps */}
          <path d="M 750 375 Q 748 365 750 360" stroke="#CCC" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M 760 373 Q 758 363 760 358" stroke="#CCC" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M 770 375 Q 768 365 770 360" stroke="#CCC" strokeWidth="1.5" fill="none" opacity="0.6" />
          
          {/* 5. Calendar - October 2025 */}
          <rect x="820" y="375" width="55" height="65" fill="white" stroke="#333" strokeWidth="2" />
          <rect x="820" y="375" width="55" height="20" fill="#003D8F" />
          <text x="847.5" y="389" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">OKT</text>
          <text x="847.5" y="418" fontSize="26" fontWeight="bold" fill="#333" textAnchor="middle">8</text>
          <text x="847.5" y="436" fontSize="10" fill="#666" textAnchor="middle">2025</text>
        </svg>

        {/* David van Weel Character - with walking animation */}
        <div 
          className={`absolute bottom-20 z-10 ${
            davidEntered ? '' : 'david-wobble'
          }`}
          style={{
            left: davidEntered ? '500px' : '-400px',
            transition: 'left 1.5s ease-out'
          }}
        >
          <svg width="300" height="420" viewBox="0 0 300 420">
            {/* Body - standing position with CLEAR SUIT JACKET */}
            <g>
              {/* Legs - grey trousers */}
              <rect x="130" y="310" width="30" height="90" fill="#3F3F3F" />
              <rect x="155" y="310" width="30" height="90" fill="#3F3F3F" />
              
              {/* Shoes */}
              <ellipse cx="145" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              <ellipse cx="170" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              
              {/* Torso with white shirt visible */}
              <rect x="125" y="210" width="65" height="100" fill="white" />
              
              {/* Suit jacket - dark grey, OPEN to show shirt and tie */}
              {/* Left lapel */}
              <path d="M 125 210 L 130 240 L 135 280 L 135 310 L 125 310 L 125 210" fill="#3F3F3F" />
              {/* Right lapel */}
              <path d="M 190 210 L 185 240 L 180 280 L 180 310 L 190 310 L 190 210" fill="#3F3F3F" />
              
              {/* Jacket collar */}
              <path d="M 125 210 L 135 215 L 140 210" fill="#3F3F3F" />
              <path d="M 190 210 L 180 215 L 175 210" fill="#3F3F3F" />
              
              {/* White shirt collar */}
              <path d="M 140 205 L 157.5 210 L 175 205 L 173 217 L 157.5 222 L 142 217 Z" fill="white" />
              
              {/* Dark blue tie - navy, clearly visible */}
              <path d="M 157.5 210 L 152 252 L 157.5 295 L 163 252 Z" fill="#001F3F" />
              <path d="M 157.5 210 L 154 215 L 157.5 220 L 161 215 Z" fill="#002855" />
              
              {/* Suit buttons */}
              <circle cx="135" cy="250" r="3" fill="#2F2F2F" />
              <circle cx="180" cy="250" r="3" fill="#2F2F2F" />
              
              {/* Arms with grey suit sleeves */}
              <rect x="100" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
              <rect x="190" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
              
              {/* White shirt cuffs */}
              <rect x="100" y="300" width="25" height="15" fill="white" />
              <rect x="190" y="300" width="25" height="15" fill="white" />
              
              {/* Hands */}
              <ellipse cx="112.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="185" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - based on David van Weel */}
              <ellipse cx="157.5" cy="150" rx="50" ry="54" fill="#F5D5C0" />
              
              {/* Hair - reddish/light brown, receding */}
              <path d="M 107.5 140 Q 105.5 92 157.5 80 Q 209.5 92 207.5 140 Q 207.5 156 201.5 162 L 195.5 148 Q 191.5 98 157.5 93 Q 123.5 98 119.5 148 L 113.5 162 Q 107.5 156 107.5 140" fill="#A67C52" />
              
              {/* Receding hairline */}
              <path d="M 117.5 118 Q 137.5 100 157.5 96 Q 177.5 100 197.5 118" stroke="#A67C52" strokeWidth="2" fill="none" />
              <ellipse cx="132.5" cy="108" rx="8" ry="12" fill="#F5D5C0" />
              <ellipse cx="182.5" cy="108" rx="8" ry="12" fill="#F5D5C0" />
              
              {/* Eyes */}
              <ellipse cx="132.5" cy="145" rx="10" ry="12" fill="white" />
              <ellipse cx="182.5" cy="145" rx="10" ry="12" fill="white" />
              <circle cx="132.5" cy="147" r="6.5" fill="#5D4E37" />
              <circle cx="182.5" cy="147" r="6.5" fill="#5D4E37" />
              <circle cx="134.5" cy="145" r="2.8" fill="white" />
              <circle cx="184.5" cy="145" r="2.8" fill="white" />
              
              {/* Eyebrows */}
              <path d="M 119.5 132 Q 132.5 127 143.5 131" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 171.5 131 Q 182.5 127 195.5 132" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Eye bags */}
              <path d="M 125.5 152 Q 132.5 155 139.5 152" stroke="#E8C4A8" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M 175.5 152 Q 182.5 155 189.5 152" stroke="#E8C4A8" strokeWidth="1" fill="none" opacity="0.5" />
              
              {/* Nose */}
              <path d="M 157.5 150 L 152.5 164 L 157.5 168 L 162.5 164 Z" fill="#E8C4A8" />
              <ellipse cx="152.5" cy="165" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <ellipse cx="162.5" cy="165" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <path d="M 157.5 150 L 157.5 167" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.4" />
              
              {/* Smile */}
              <path d="M 132.5 177 Q 157.5 186 182.5 177" stroke="#A0522D" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 135.5 179 Q 157.5 184 179.5 179" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
              
              {/* Smile lines */}
              <path d="M 127.5 170 Q 131.5 176 132.5 180" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 187.5 170 Q 183.5 176 182.5 180" stroke="#D4B49A" strokeWidth="1.5" fill="none" opacity="0.6" />
              
              {/* Stubble shadow */}
              <ellipse cx="157.5" cy="172" rx="28" ry="18" fill="#D4B49A" opacity="0.15" />
              
              {/* Ears */}
              <ellipse cx="107.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="207.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="109.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              <ellipse cx="205.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
            </g>
          </svg>
        </div>

        {/* Speech Bubble - less rounded, appears after David enters */}
        {showSpeechBubble && texts[currentText] && (
          <div 
            key={speechBubbleKey}
            className="absolute top-8 right-16 z-10 animate-poof"
            style={{maxWidth: '900px'}}
          >
            <div className="relative bg-white rounded-2xl px-8 py-6 shadow-2xl border-4 border-gray-800">
              {/* Text content */}
              <p className="text-lg text-gray-800 leading-relaxed font-sans">
                {texts[currentText]}
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
                
                {currentText < texts.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                  >
                    Volgende
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNavigateToLevel2}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-lg font-bold"
                  >
                    Ga op bezoek bij Mario Draghi →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="pb-8 flex justify-center gap-2.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
          <div
            key={level}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              level === 1 
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
        
        @keyframes wobble {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-3px); }
          75% { transform: translateY(3px); }
        }
        
        .david-wobble {
          animation: wobble 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
