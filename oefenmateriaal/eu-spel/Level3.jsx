const { useState, useEffect } = React;

function Level3({ onComplete }) {
  const [currentText, setCurrentText] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [speechBubbleKey, setSpeechBubbleKey] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [phoneRinging, setPhoneRinging] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [fadeDirection, setFadeDirection] = useState('in'); // 'in' or 'out'
  const [showPhoneCall, setShowPhoneCall] = useState(false);
  const [phoneCallText, setPhoneCallText] = useState(0);
  const [draggedWord, setDraggedWord] = useState(null);
  const [filledWords, setFilledWords] = useState({ gap1: null, gap2: null, gap3: null, gap4: null, gap5: null, gap6: null, gap7: null });
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixCell, setMatrixCell] = useState(null); // For Von der Leyen's answer
  const [cellFlash, setCellFlash] = useState(null); // For visual feedback

  useEffect(() => {
    const speechTimer = setTimeout(() => setShowSpeechBubble(true), 1000);
    return () => {
      clearTimeout(speechTimer);
    };
  }, []);

  const texts = [
    "<strong>Van Weel:</strong> Dat was een goed gesprek. Fijn om weer in mijn werkkamer te zijn.",
    "<strong>Van Weel:</strong> Oh, ik word gebeld. Ik ben benieuwd wie dat is.",
    "Interessant gesprek met mevrouw von der Leyen. Laten we dit verwerken in onze opbrengstenmatrix.",
    "Sleep de correcte opbrengsten naar de cel linksboven, gebaseerd op het gesprek met mevrouw von der Leyen. Een pijl omhoog = positieve nettobaten (economische groei - investeringen), hoe meer hoe beter. Een pijl omlaag = negatieve nettobaten, hoe meer hoe slechter.",
    "Correct! Mevrouw von der Leyen ziet dit als het meest optimistische scenario voor alle EU-lidstaten.",
    "Nu weet ik de opbrengsten als lidstaten allemaal wél of juist niet inzetten op Europese integratie. Ik ben uitgenodigd om met twee Britten te praten over de gevolgen van de Brexit."
  ];

  const phoneCallTexts = [
    "<strong>Van Weel:</strong> Mevrouw von der Leyen, fijn dat u terugbelt. Als voorzitter van de Europese Commissie wil ik u vragen: wat kan meer Europese integratie alle lidstaten opleveren?",
    "<strong>Von der Leyen:</strong> Ik vind het altijd leuk om met een collega te spreken over Eu...pa. Wat wil u w-w-w-w....en over de Europese ..nie?",
    "<strong>Van Weel:</strong> De verbinding is niet goed, u hapert. Ik doe mijn best om u zo goed mogelijk te verstaan.",
    "dragdrop1", // First drag-drop exercise
    "dragdrop2", // Second drag-drop exercise
    "dragdrop3", // Third drag-drop exercise
    "<strong>Van Weel:</strong> Bedankt voor al deze interessante inzichten. Tot de volgende keer."
  ];

  const handlePickUp = () => {
    setFadeDirection('in');
    setFadeToBlack(true);
    setTimeout(() => {
      setShowPhoneCall(true);
      setFadeDirection('out');
    }, 1000);
    setTimeout(() => setFadeToBlack(false), 1500);
  };

  const handleHangUp = () => {
    setFadeDirection('in');
    setFadeToBlack(true);
    // Wait for fade to black, then hide phone and show office
    setTimeout(() => {
      setShowPhoneCall(false);
      setPhoneRinging(false); // Reset phone state
      setCurrentText(2); // Show post-call text
      setSpeechBubbleKey(prev => prev + 1);
      setFadeDirection('out');
    }, 1000);
    // Remove black overlay after office fades in
    setTimeout(() => {
      setFadeToBlack(false);
    }, 1500);
  };

  const handlePhoneCallNext = () => {
    if (phoneCallText < phoneCallTexts.length - 1) {
      setPhoneCallText(phoneCallText + 1);
      setSpeechBubbleKey(prev => prev + 1);
    } else {
      alert("Navigatie naar Level 4 - Dit wordt later geïmplementeerd!");
    }
  };

  const handlePhoneCallPrev = () => {
    if (phoneCallText > 0) {
      setPhoneCallText(phoneCallText - 1);
      setSpeechBubbleKey(prev => prev + 1);
    }
  };

  const handleDragStart = (word) => setDraggedWord(word);

  const handleDrop = (gapId, correctWord) => {
    // For gap6 and gap7, accept either 'economische groei' or 'veiligheid'
    if (gapId === 'gap6' || gapId === 'gap7') {
      if (draggedWord === 'economische groei' || draggedWord === 'veiligheid') {
        setFilledWords(prev => ({ ...prev, [gapId]: draggedWord }));
      }
    } else if (draggedWord === correctWord) {
      setFilledWords(prev => ({ ...prev, [gapId]: draggedWord }));
    }
    setDraggedWord(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Volgorde van de woordenbank wordt één keer per spelsessie door elkaar
  // gehusseld, zodat het juiste antwoord niet steeds op dezelfde (eerste)
  // plek staat.
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const [wordBank1] = useState(() => shuffleArray(['hoge', 'gemiddelde', 'lage']));
  const [wordBank2] = useState(() => shuffleArray(['besparen', 'verliezen', 'veel sterker', 'minder sterk']));
  const [wordBank3] = useState(() => shuffleArray(['investeringen', 'economische groei', 'veiligheid', 'besparingen', 'integratie']));

  // Available words depend on which drag-drop exercise is active
  const availableWords = phoneCallText === 3
    ? wordBank1.filter(word => word !== filledWords.gap1 && word !== filledWords.gap2)
    : phoneCallText === 4
    ? wordBank2.filter(word => word !== filledWords.gap3 && word !== filledWords.gap4)
    : phoneCallText === 5
    ? wordBank3.filter(word => word !== filledWords.gap5 && word !== filledWords.gap6 && word !== filledWords.gap7)
    : [];

  const isDragDropComplete = phoneCallText === 3
    ? filledWords.gap1 === 'hoge' && filledWords.gap2 === 'lage'
    : phoneCallText === 4
    ? filledWords.gap3 === 'besparen' && filledWords.gap4 === 'veel sterker'
    : phoneCallText === 5
    ? filledWords.gap5 === 'investeringen' && 
      ((filledWords.gap6 === 'economische groei' && filledWords.gap7 === 'veiligheid') ||
       (filledWords.gap6 === 'veiligheid' && filledWords.gap7 === 'economische groei'))
    : false;

  return (
    <div className="w-[1200px] h-[700px] flex-shrink-0 bg-gradient-to-b from-slate-100 to-slate-50 relative overflow-hidden flex flex-col">
      
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
          <button onClick={() => setShowHint(false)} className="absolute top-2 right-2">
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-blue-800 mb-2">💡 Hints</h3>
          <p className="text-sm text-gray-700">
            Lees alle tekstballonnen goed door. Let op de afwegingen die David maakt tussen autonomie en zekerheid!
          </p>
        </div>
      )}

      {/* Office scene */}
      {!showPhoneCall && (
        <div className="flex-1 flex items-center justify-center relative animate-fadeIn">
          {/* VVD Office Background - identical to Level 1 */}
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
            
            {/* View through window */}
            <rect x="860" y="70" width="120" height="140" fill="#8FADC7" opacity="0.3" />
            <rect x="1000" y="70" width="120" height="140" fill="#8FADC7" opacity="0.3" />
            <rect x="880" y="230" width="100" height="140" fill="#8FADC7" opacity="0.3" />
            
            {/* VVD Logo */}
            <g transform="translate(60, 130)">
              <path d="M 0 0 L 25 0 L 45 55 L 65 0 L 90 0 L 55 80 L 35 80 Z" fill="#FF6600" />
              <path d="M 8 8 L 28 8 L 45 50 L 62 8 L 82 8 L 52 72 L 38 72 Z" fill="#0033CC" />
              <path d="M 65 0 L 90 0 L 110 55 L 130 0 L 155 0 L 120 80 L 100 80 Z" fill="#FF6600" />
              <path d="M 73 8 L 93 8 L 110 50 L 127 8 L 147 8 L 117 72 L 103 72 Z" fill="#0033CC" />
              <path d="M 160 0 L 210 0 Q 250 0 250 40 Q 250 80 210 80 L 160 80 Z" fill="#FF6600" />
              <path d="M 172 10 L 205 10 Q 238 10 238 40 Q 238 70 205 70 L 172 70 Z" fill="#0033CC" />
            </g>
            
            {/* Dutch landscape painting */}
            <rect x="320" y="140" width="200" height="130" fill="#654321" stroke="#3E2A1A" strokeWidth="8" />
            <rect x="335" y="155" width="170" height="55" fill="#5B9BD5" />
            <rect x="335" y="210" width="170" height="45" fill="#6B8E23" />
            <rect x="410" y="195" width="25" height="50" fill="#8B4513" />
            <path d="M 422.5 190 L 415 182 L 430 182 Z" fill="#CC6633" />
            <g transform="translate(422.5, 195) rotate(20)">
              <rect x="-3" y="-50" width="6" height="50" fill="#2C2C2C" />
              <rect x="-50" y="-3" width="50" height="6" fill="#2C2C2C" />
              <rect x="-3" y="0" width="6" height="50" fill="#2C2C2C" />
              <rect x="0" y="-3" width="50" height="6" fill="#2C2C2C" />
            </g>
            <ellipse cx="370" cy="175" rx="20" ry="12" fill="white" opacity="0.8" />
            <ellipse cx="385" cy="172" rx="25" ry="14" fill="white" opacity="0.8" />
            <ellipse cx="470" cy="170" rx="22" ry="13" fill="white" opacity="0.8" />
            
            {/* Bookshelf */}
            <rect x="50" y="230" width="160" height="270" fill="#5A4A3A" />
            <rect x="60" y="240" width="140" height="7" fill="#3E2F22" />
            <rect x="60" y="315" width="140" height="7" fill="#3E2F22" />
            <rect x="60" y="390" width="140" height="7" fill="#3E2F22" />
            <rect x="60" y="465" width="140" height="7" fill="#3E2F22" />
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
            
            {/* Plant */}
            <ellipse cx="1050" cy="480" rx="50" ry="15" fill="#8B4513" />
            <path d="M 1010 480 Q 1010 465 1020 450 L 1080 450 Q 1090 465 1090 480" fill="#A0826D" />
            <rect x="1020" y="450" width="60" height="30" fill="#A0826D" />
            <path d="M 1025 450 Q 1020 395 1015 350 Q 1013 325 1020 320" stroke="#2D5016" strokeWidth="5" fill="none" />
            <path d="M 1050 450 Q 1050 415 1055 370 Q 1057 340 1050 320" stroke="#2D5016" strokeWidth="5" fill="none" />
            <path d="M 1075 450 Q 1080 405 1085 360 Q 1087 330 1080 320" stroke="#2D5016" strokeWidth="5" fill="none" />
            <ellipse cx="1020" cy="325" rx="28" ry="38" fill="#3A5F20" />
            <ellipse cx="1050" cy="320" rx="33" ry="43" fill="#3A5F20" />
            <ellipse cx="1080" cy="325" rx="28" ry="38" fill="#3A5F20" />
            
            {/* Executive desk */}
            <rect x="280" y="410" width="650" height="35" fill="#5C4033" />
            <rect x="300" y="445" width="50" height="90" fill="#4A3326" />
            <rect x="860" y="445" width="50" height="90" fill="#4A3326" />
            <rect x="285" y="408" width="640" height="5" fill="#6B4F3F" />
            
            {/* Nameplate */}
            <rect x="310" y="385" width="140" height="28" fill="#C19A6B" stroke="#8B7355" strokeWidth="2" />
            <rect x="314" y="389" width="132" height="20" fill="#D4AF37" />
            <text x="380" y="402" fontSize="10" fontWeight="bold" fill="#1F2937" textAnchor="middle">D.M. van Weel</text>
            <text x="380" y="410" fontSize="7" fill="#374151" textAnchor="middle">minister BuZa</text>
            
            {/* Laptop */}
            <g transform="translate(480, 335)">
              <rect x="0" y="0" width="130" height="90" fill="#1F2937" rx="5" />
              <rect x="8" y="6" width="114" height="70" fill="#3B82F6" />
              <rect x="55" y="82" width="20" height="12" fill="#4B5563" />
              <ellipse cx="65" cy="94" rx="40" ry="7" fill="#374151" />
            </g>
            
            {/* Calendar showing 10 oktober */}
            <rect x="820" y="375" width="55" height="65" fill="white" stroke="#333" strokeWidth="2" />
            <rect x="820" y="375" width="55" height="20" fill="#003D8F" />
            <text x="847.5" y="389" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">OKT</text>
            <text x="847.5" y="418" fontSize="26" fontWeight="bold" fill="#333" textAnchor="middle">10</text>
            <text x="847.5" y="436" fontSize="10" fill="#666" textAnchor="middle">2025</text>
          </svg>

          {/* Smartphone on desk - as separate HTML element for animation to work */}
          <div 
            className={phoneRinging ? 'phone-vibrate' : ''}
            style={{
              position: 'absolute',
              left: '61%',
              bottom: '38%',
              zIndex: 5
            }}
          >
            <svg width="35" height="60" viewBox="0 0 35 60">
              <rect x="0" y="0" width="35" height="60" fill="#1a1a1a" rx="5" />
              <rect x="2" y="2" width="31" height="56" fill={phoneRinging ? "#22c55e" : "#2a2a2a"} rx="4" />
              {phoneRinging && <text x="17.5" y="35" fontSize="20" textAnchor="middle">📞</text>}
            </svg>
          </div>

          {/* David van Weel Character - standing by desk */}
          <div className="absolute bottom-20 z-10" style={{left: '38%'}}>
            <svg width="300" height="420" viewBox="0 0 300 420">
              <g>
                <rect x="130" y="310" width="30" height="90" fill="#3F3F3F" />
                <rect x="155" y="310" width="30" height="90" fill="#3F3F3F" />
                <ellipse cx="145" cy="405" rx="18" ry="8" fill="#1a1a1a" />
                <ellipse cx="170" cy="405" rx="18" ry="8" fill="#1a1a1a" />
                <rect x="125" y="210" width="65" height="100" fill="white" />
                <path d="M 125 210 L 130 240 L 135 280 L 135 310 L 125 310 L 125 210" fill="#3F3F3F" />
                <path d="M 190 210 L 185 240 L 180 280 L 180 310 L 190 310 L 190 210" fill="#3F3F3F" />
                <path d="M 125 210 L 135 215 L 140 210" fill="#3F3F3F" />
                <path d="M 190 210 L 180 215 L 175 210" fill="#3F3F3F" />
                <path d="M 140 205 L 157.5 210 L 175 205 L 173 217 L 157.5 222 L 142 217 Z" fill="white" />
                <path d="M 157.5 210 L 152 252 L 157.5 295 L 163 252 Z" fill="#001F3F" />
                <path d="M 157.5 210 L 154 215 L 157.5 220 L 161 215 Z" fill="#002855" />
                <circle cx="135" cy="250" r="3" fill="#2F2F2F" />
                <circle cx="180" cy="250" r="3" fill="#2F2F2F" />
                <rect x="100" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
                <rect x="190" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
                <rect x="100" y="300" width="25" height="15" fill="white" />
                <rect x="190" y="300" width="25" height="15" fill="white" />
                <ellipse cx="112.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
                <ellipse cx="202.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
                <rect x="147.5" y="185" width="20" height="27" fill="#F5D5C0" />
                <ellipse cx="157.5" cy="150" rx="50" ry="54" fill="#F5D5C0" />
                <path d="M 107.5 140 Q 105.5 92 157.5 80 Q 209.5 92 207.5 140 Q 207.5 156 201.5 162 L 195.5 148 Q 191.5 98 157.5 93 Q 123.5 98 119.5 148 L 113.5 162 Q 107.5 156 107.5 140" fill="#A67C52" />
                <path d="M 117.5 118 Q 137.5 100 157.5 96 Q 177.5 100 197.5 118" stroke="#A67C52" strokeWidth="2" fill="none" />
                <ellipse cx="132.5" cy="108" rx="8" ry="12" fill="#F5D5C0" />
                <ellipse cx="182.5" cy="108" rx="8" ry="12" fill="#F5D5C0" />
                <ellipse cx="132.5" cy="145" rx="10" ry="12" fill="white" />
                <ellipse cx="182.5" cy="145" rx="10" ry="12" fill="white" />
                <circle cx="132.5" cy="147" r="6.5" fill="#5D4E37" />
                <circle cx="182.5" cy="147" r="6.5" fill="#5D4E37" />
                <circle cx="134.5" cy="145" r="2.8" fill="white" />
                <circle cx="184.5" cy="145" r="2.8" fill="white" />
                <path d="M 119.5 132 Q 132.5 127 143.5 131" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 171.5 131 Q 182.5 127 195.5 132" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 157.5 150 L 152.5 164 L 157.5 168 L 162.5 164 Z" fill="#E8C4A8" />
                <ellipse cx="152.5" cy="165" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
                <ellipse cx="162.5" cy="165" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
                <path d="M 132.5 177 Q 157.5 186 182.5 177" stroke="#A0522D" strokeWidth="3" fill="none" strokeLinecap="round" />
                <ellipse cx="107.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
                <ellipse cx="207.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
                <ellipse cx="109.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
                <ellipse cx="205.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              </g>
            </svg>
          </div>

          {/* Speech Bubble */}
          {showSpeechBubble && texts[currentText] && (
            <div key={speechBubbleKey} className="absolute top-8 right-28 max-w-lg z-10 animate-poof">
              <div className="relative bg-white rounded-2xl px-8 py-6 shadow-2xl border-4 border-gray-800">
                <p className="text-base text-gray-800 leading-snug font-sans">
                  <span dangerouslySetInnerHTML={{ __html: texts[currentText] }} />
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="w-20"></div>
                  <div className="w-16"></div>
                  {currentText === 0 && (
                    <button
                      onClick={() => {
                        setPhoneRinging(true);
                        setCurrentText(1);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                    >
                      Volgende
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  {currentText === 1 && (
                    <button
                      onClick={handlePickUp}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 hover:scale-105 transition-all shadow-lg font-bold"
                    >
                      📱 Telefoon opnemen
                    </button>
                  )}
                  {currentText === 2 && (
                    <button
                      onClick={() => {
                        setCurrentText(3);
                        setShowMatrix(true);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                    >
                      Volgende
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  {currentText === 4 && (
                    <button
                      onClick={() => {
                        setCurrentText(5);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                    >
                      Volgende
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  {currentText === 5 && (
                    <button
                      onClick={onComplete}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-lg font-bold"
                    >
                      ✈️ Reis af naar Londen
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payoff Matrix - appears when showMatrix is true and on currentText 3 */}
      {showMatrix && !showPhoneCall && currentText === 3 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8 z-30">
          {/* Draggable payoff options - left side */}
          <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-gray-800">
            <h4 className="text-sm font-bold text-center mb-3 text-gray-700">Opbrengsten</h4>
            <div className="flex flex-col gap-2">
              {/* Only show options that haven't been placed yet */}
              {['↑↑↑, ↑↑↑', '↑, ↑↑↑', '↑↑↑, ↑', '↓↓↓, ↓↓↓'].filter(option => option !== matrixCell).map((option) => (
                <div 
                  key={option}
                  draggable
                  onDragStart={() => setDraggedWord(option)}
                  className="w-32 h-8 border-2 border-blue-400 rounded bg-blue-50 flex items-center justify-center cursor-move hover:shadow-lg transition-shadow"
                >
                  <span className="text-xs">{option}</span>
                </div>
              ))}
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
                    {/* Top-left cell - draggable target for Von der Leyen's answer */}
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={() => {
                        if (draggedWord === '↑↑↑, ↑↑↑') {
                          setMatrixCell(draggedWord);
                          setCellFlash('correct');
                          setTimeout(() => setCellFlash(null), 1000);
                          // Auto-advance to next text after 1 second
                          setTimeout(() => {
                            setCurrentText(4);
                            setSpeechBubbleKey(prev => prev + 1);
                          }, 1000);
                        } else if (draggedWord) {
                          // Incorrect - show red flash
                          setCellFlash('incorrect');
                          setTimeout(() => setCellFlash(null), 500);
                        }
                        setDraggedWord(null);
                      }}
                      className={`w-32 h-8 border-2 rounded flex items-center justify-center transition-all ${
                        cellFlash === 'correct' ? 'border-green-500 bg-green-50 border-4 font-bold' :
                        cellFlash === 'incorrect' ? 'border-red-500 bg-red-50 border-4' :
                        matrixCell === '↑↑↑, ↑↑↑' ? 'border-green-500 bg-green-50 border-4 font-bold' :
                        'border-gray-800 bg-white hover:border-blue-500 hover:bg-blue-50 border-4'
                      }`}
                    >
                      <span className="text-xs">{matrixCell || '___'}</span>
                    </div>
                    {/* Top-right cell - empty */}
                    <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-300">___</span>
                    </div>
                  </div>
                  
                  {/* Row 2: NL - Huidig beleid */}
                  <div className="flex gap-2 items-center">
                    <div className="px-2 py-1 rounded w-28 text-center font-semibold text-xs text-gray-700">Huidig beleid</div>
                    {/* Bottom-left cell - empty */}
                    <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-300">___</span>
                    </div>
                    {/* Bottom-right cell - filled with ↓, ↓ */}
                    <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50 flex items-center justify-center">
                      <span className="text-xs">↓, ↓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fade to black overlay */}
      {fadeToBlack && (
        <div 
          className={fadeDirection === 'out' ? 'animate-fadeOut' : 'animate-fadeIn'}
          style={{position: 'absolute', inset: 0, background: 'black', zIndex: 100}}
        />
      )}

      {/* Phone call scene */}
      {showPhoneCall && (
        <div className="absolute inset-0 overflow-hidden animate-fadeIn" style={{zIndex: 90}}>
          {/* Background: VVD office wall + door + bookshelf */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
            <rect x="0" y="0" width="1200" height="700" fill="#D1D5DB" />
            <rect x="0" y="450" width="1200" height="250" fill="#B8BDC5" />
            <line x1="0" y1="450" x2="1200" y2="450" stroke="#9CA3AF" strokeWidth="3" />
            <rect x="0" y="580" width="1200" height="120" fill="#4A3F35" />
            <rect x="0" y="560" width="1200" height="20" fill="#A8ADB5" />
            
            {/* Door */}
            <rect x="80" y="200" width="180" height="380" fill="#8B7355" stroke="#6B5535" strokeWidth="6" rx="2" />
            <rect x="90" y="210" width="160" height="160" fill="#9B8365" />
            <rect x="90" y="390" width="160" height="170" fill="#9B8365" />
            <circle cx="240" cy="395" r="10" fill="#C8A84B" />
            
            {/* Bookshelf */}
            <rect x="900" y="180" width="200" height="380" fill="#5A4A3A" />
            <rect x="910" y="190" width="180" height="7" fill="#3E2F22" />
            <rect x="910" y="265" width="180" height="7" fill="#3E2F22" />
            <rect x="910" y="340" width="180" height="7" fill="#3E2F22" />
            <rect x="910" y="415" width="180" height="7" fill="#3E2F22" />
            {/* Books */}
            <rect x="915" y="197" width="22" height="60" fill="#0066CC" />
            <rect x="939" y="197" width="18" height="60" fill="#CC0000" />
            <rect x="959" y="197" width="25" height="60" fill="#006633" />
          </svg>

          {/* David's arm holding phone */}
          <div style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '420px', height: '300px', zIndex: 10}}>
            <svg width="420" height="300" viewBox="0 0 420 300">
              <rect x="130" y="35" width="160" height="265" fill="#3F3F3F" rx="12" />
              <rect x="128" y="25" width="164" height="42" fill="white" rx="5" />
              <ellipse cx="210" cy="22" rx="110" ry="60" fill="#F5D5C0" />
              <ellipse cx="106" cy="36" rx="36" ry="24" fill="#F5D5C0" />
              <rect x="136" y="-25" width="44" height="60" fill="#F5D5C0" rx="16" />
              <rect x="186" y="-28" width="44" height="60" fill="#F5D5C0" rx="16" />
              <rect x="236" y="-28" width="44" height="60" fill="#F5D5C0" rx="16" />
              <rect x="286" y="-25" width="40" height="56" fill="#F5D5C0" rx="16" />
            </svg>
          </div>

          {/* Phone */}
          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -48%)', width: '240px', background: '#111', borderRadius: '34px', padding: '12px', boxShadow: '0 8px 60px rgba(0,0,0,0.7)', zIndex: 20}}>
            <div style={{width:'65px', height:'6px', background:'#2a2a2a', borderRadius:'3px', margin:'0 auto 8px'}} />
            
            {/* Screen */}
            <div style={{borderRadius:'18px', overflow:'hidden', position:'relative', height:'370px', background:'#B8D4E8'}}>
              {/* Ursula SVG */}
              <svg width="216" height="370" viewBox="0 0 216 370" style={{position:'absolute', inset:0}}>
                <rect x="0" y="0" width="216" height="370" fill="#C8D8E8" />
                <rect x="0" y="280" width="216" height="90" fill="#D4C8B8" />
                
                {/* Shoulders + blue jacket */}
                <path d="M -20 370 L -20 295 Q 40 272 108 268 Q 176 272 236 295 L 236 370 Z" fill="#1E4DA1" />
                <path d="M 55 292 L 76 310 L 82 370 L 20 370 Z" fill="#163A80" />
                <path d="M 161 292 L 140 310 L 134 370 L 196 370 Z" fill="#163A80" />
                <path d="M 82 300 L 108 316 L 134 300 L 132 312 L 108 326 L 84 312 Z" fill="white" />
                
                {/* Neck */}
                <rect x="92" y="218" width="32" height="62" fill="#F5D5C0" />
                
                {/* Pearl necklace */}
                <circle cx="58" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="67" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="76" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="85" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="94" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="103" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="112" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="121" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="130" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="139" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                <circle cx="148" cy="290" r="4.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.5" />
                
                {/* Head */}
                <ellipse cx="108" cy="150" rx="74" ry="80" fill="#F5D5C0" />
                
                {/* Hair */}
                <path d="M 34 140 Q 30 60 108 42 Q 186 60 182 140 Q 190 105 184 78 L 170 54 Q 148 32 108 28 Q 68 32 46 54 L 32 78 Q 26 105 34 140 Z" fill="#D4A030" />
                <ellipse cx="108" cy="75" rx="68" ry="36" fill="#D4A030" />
                <ellipse cx="108" cy="85" rx="72" ry="42" fill="#D4A030" />
                <path d="M 34 140 Q 20 100 28 64 Q 22 95 30 140 Z" fill="#C89020" />
                <path d="M 182 140 Q 196 100 188 64 Q 194 95 186 140 Z" fill="#C89020" />
                
                {/* Ears with pearl earrings */}
                <ellipse cx="34" cy="158" rx="12" ry="16" fill="#F5D5C0" />
                <ellipse cx="182" cy="158" rx="12" ry="16" fill="#F5D5C0" />
                <circle cx="34" cy="150" r="5.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.8" />
                <circle cx="182" cy="150" r="5.5" fill="#F0EBE0" stroke="#D4CFC0" strokeWidth="0.8" />
                
                {/* Eyes */}
                <ellipse cx="80" cy="148" rx="15" ry="16" fill="white" />
                <ellipse cx="136" cy="148" rx="15" ry="16" fill="white" />
                <circle cx="80" cy="150" r="10" fill="#4A90D9" />
                <circle cx="136" cy="150" r="10" fill="#4A90D9" />
                <circle cx="76" cy="147" r="5" fill="#2A6A9A" />
                <circle cx="132" cy="147" r="5" fill="#2A6A9A" />
                <circle cx="84" cy="145" r="3.5" fill="white" />
                <circle cx="140" cy="145" r="3.5" fill="white" />
                
                {/* Eyebrows */}
                <path d="M 62 130 Q 80 123 97 129" stroke="#C89020" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 119 129 Q 136 123 154 130" stroke="#C89020" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                
                {/* Nose */}
                <path d="M 108 158 L 101 173 L 108 177 L 115 173 Z" fill="#E8C4A8" />
                
                {/* Mouth with lipstick */}
                <path d="M 80 200 Q 108 216 136 200" stroke="#C41E3A" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M 82 202 Q 108 212 134 202" stroke="#E8354A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                
                {/* Name bar */}
                <rect x="0" y="338" width="216" height="32" fill="rgba(0,0,0,0.55)" />
                <text x="108" y="358" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">Ursula von der Leyen</text>
              </svg>

              {/* David thumbnail - matching original character style */}
              <div style={{position:'absolute', top:'8px', right:'8px', width:'68px', height:'90px', borderRadius:'10px', overflow:'hidden', border:'2px solid rgba(255,255,255,0.6)', background:'#D1D5DB'}}>
                <svg width="68" height="90" viewBox="0 0 68 90">
                  {/* Background */}
                  <rect x="0" y="0" width="68" height="90" fill="#D1D5DB" />
                  <rect x="0" y="55" width="68" height="35" fill="#B8BDC5" />
                  
                  {/* Body - white shirt with suit */}
                  <rect x="20" y="55" width="28" height="40" fill="white" />
                  <path d="M 20 55 L 22 65 L 24 80 L 24 90 L 20 90 Z" fill="#3F3F3F" />
                  <path d="M 48 55 L 46 65 L 44 80 L 44 90 L 48 90 Z" fill="#3F3F3F" />
                  <path d="M 24 58 L 34 62 L 44 58 L 43 64 L 34 67 L 25 64 Z" fill="white" />
                  <path d="M 34 58 L 32 72 L 34 85 L 36 72 Z" fill="#001F3F" />
                  
                  {/* Neck */}
                  <rect x="29" y="44" width="10" height="14" fill="#F5D5C0" />
                  
                  {/* Head */}
                  <ellipse cx="34" cy="32" rx="18" ry="20" fill="#F5D5C0" />
                  
                  {/* Hair - brown */}
                  <path d="M 16 28 Q 15 12 34 8 Q 53 12 52 28 Q 50 22 46 18 L 40 12 Q 34 8 34 8 Q 28 8 22 14 L 18 20 Z" fill="#A67C52" />
                  
                  {/* Ears */}
                  <ellipse cx="16" cy="32" rx="3" ry="5" fill="#F5D5C0" />
                  <ellipse cx="52" cy="32" rx="3" ry="5" fill="#F5D5C0" />
                  
                  {/* Eyes - brown */}
                  <ellipse cx="27" cy="30" rx="4" ry="4.5" fill="white" />
                  <ellipse cx="41" cy="30" rx="4" ry="4.5" fill="white" />
                  <circle cx="27" cy="31" r="2.5" fill="#5D4E37" />
                  <circle cx="41" cy="31" r="2.5" fill="#5D4E37" />
                  <circle cx="28" cy="30" r="1" fill="white" />
                  <circle cx="42" cy="30" r="1" fill="white" />
                  
                  {/* Eyebrows */}
                  <path d="M 23 26 Q 27 24 30 25" stroke="#8B6F47" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <path d="M 38 25 Q 41 24 45 26" stroke="#8B6F47" strokeWidth="1" fill="none" strokeLinecap="round" />
                  
                  {/* Nose */}
                  <path d="M 34 32 L 32 37 L 34 38 L 36 37 Z" fill="#E8C4A8" />
                  
                  {/* Smile */}
                  <path d="M 26 40 Q 34 44 42 40" stroke="#A0522D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Bad connection overlay */}
              {phoneCallText >= 1 && (
                <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100}}>
                  <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 5px)'}} />
                  <div style={{position: 'absolute', top: '15%', left: '8%', width: '50px', height: '28px', background: 'rgba(0,0,0,0.4)', animation: 'flicker 0.25s infinite'}} />
                  <div style={{position: 'absolute', top: '40%', right: '12%', width: '60px', height: '25px', background: 'rgba(255,255,255,0.45)', animation: 'flicker 0.4s infinite'}} />
                  <div style={{position: 'absolute', top: '60%', left: '20%', width: '45px', height: '35px', background: 'rgba(0,0,0,0.35)', animation: 'flicker 0.35s infinite'}} />
                  <div style={{position: 'absolute', top: '35%', left: 0, width: '100%', height: '5px', background: 'rgba(0,0,0,0.25)', animation: 'flicker 0.5s infinite'}} />
                </div>
              )}
            </div>

            <div style={{width:'38px', height:'38px', background:'#222', borderRadius:'50%', margin:'8px auto 0', border:'2px solid #444'}} />
          </div>

          {/* Speech bubble */}
          <div 
            key={speechBubbleKey}
            className="absolute z-30 animate-poof"
            style={{
              top: phoneCallText === 1 ? '32px' : (phoneCallText === 3 || phoneCallText === 4 || phoneCallText === 5) ? '16px' : '32px',
              right: phoneCallText === 1 ? '32px' : (phoneCallText === 3 || phoneCallText === 4 || phoneCallText === 5) ? '16px' : 'auto',
              left: (phoneCallText === 0 || phoneCallText === 2 || phoneCallText === 6) ? '32px' : (phoneCallText === 3 || phoneCallText === 4 || phoneCallText === 5) ? 'auto' : 'auto',
              width: (phoneCallText === 3 || phoneCallText === 4 || phoneCallText === 5) ? '360px' : '288px'
            }}
          >
            <div className="relative bg-white rounded-2xl px-6 py-5 shadow-2xl border-4 border-gray-800">
              {phoneCallText === 3 ? (
                /* First drag-drop exercise */
                <>
                  <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                    <strong>Von der Leyen:</strong> Blijven we als losse landen werken, dan verliezen we het van grootmachten zoals de VS en China — slecht voor onze internationale concurrentiepositie. Werken we als Europa samen, dan kunnen we veel meer investeren in nieuwe technieken en innovaties, waardoor we producten van{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap1', 'hoge')}
                      className="inline-block min-w-[80px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap1 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap1 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap1 || '____'}
                    </span>
                    {' '}kwaliteit tegen een{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap2', 'lage')}
                      className="inline-block min-w-[80px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap2 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap2 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap2 || '____'}
                    </span>
                    {' '}prijs kunnen maken. Alleen met voorsprong in kennis en vernieuwing blijven onze bedrijven wereldwijd competitief.
                  </p>

                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 mb-2">Sleep de ontbrekende woorden naar de lege plekken in de tekst.</p>
                    <div className="flex gap-2 justify-center">
                      {availableWords.map((word) => (
                        <div
                          key={word}
                          draggable
                          onDragStart={() => handleDragStart(word)}
                          className="px-4 py-2 bg-white border-2 border-blue-400 rounded-lg cursor-move hover:shadow-lg transition-shadow font-medium"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : phoneCallText === 4 ? (
                /* Second drag-drop exercise */
                <>
                  <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                    <strong>Von der Leyen:</strong> Het is duur en onhandig als elk land in de EU zijn eigen tanks en software ontwikkelt die niet op elkaar aansluiten. Voegen we onze legers en cybersecurity samen, dan{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap3', 'besparen')}
                      className="inline-block min-w-[100px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap3 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap3 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap3 || '____'}
                    </span>
                    {' '}we miljarden en staan we{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap4', 'veel sterker')}
                      className="inline-block min-w-[120px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap4 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap4 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap4 || '____'}
                    </span>
                    {' '}tegenover landen die ons bedreigen. In je eentje ben je een makkelijk doelwit; samen de beveiliging van Europa regelen is de beste garantie om hier veilig te blijven wonen.
                  </p>

                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 mb-2">Sleep de ontbrekende woorden naar de lege plekken in de tekst.</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {availableWords.map((word) => (
                        <div
                          key={word}
                          draggable
                          onDragStart={() => handleDragStart(word)}
                          className="px-4 py-2 bg-white border-2 border-blue-400 rounded-lg cursor-move hover:shadow-lg transition-shadow font-medium"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : phoneCallText === 5 ? (
                /* Third drag-drop exercise */
                <>
                  <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                    <strong>Von der Leyen:</strong> Dit vraagt op korte termijn om flinke{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap5', 'investeringen')}
                      className="inline-block min-w-[120px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap5 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap5 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap5 || '____'}
                    </span>
                    , maar dat verdienen we op lange termijn dubbel en dwars terug in{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap6', 'economische groei')}
                      className="inline-block min-w-[140px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap6 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap6 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap6 || '____'}
                    </span>
                    {' '}en{' '}
                    <span
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('gap7', 'veiligheid')}
                      className="inline-block min-w-[100px] px-2 py-1 mx-1 border-2 border-dashed rounded"
                      style={{
                        textAlign: 'center',
                        borderColor: filledWords.gap7 ? '#22c55e' : '#9ca3af',
                        background: filledWords.gap7 ? '#f0fdf4' : '#f9fafb'
                      }}
                    >
                      {filledWords.gap7 || '____'}
                    </span>
                    . Het is het beste scenario voor de lidstaten om nu in de EU te investeren, zodat we later niet de rekening betalen voor onze eigen zwakte. De grote uitdaging is het creëren van draagvlak.
                  </p>

                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 mb-2">Sleep de ontbrekende woorden naar de lege plekken in de tekst.</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {availableWords.map((word) => (
                        <div
                          key={word}
                          draggable
                          onDragStart={() => handleDragStart(word)}
                          className="px-4 py-2 bg-white border-2 border-blue-400 rounded-lg cursor-move hover:shadow-lg transition-shadow font-medium"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-base text-gray-800 leading-snug font-sans">
                  <span dangerouslySetInnerHTML={{ __html: phoneCallTexts[phoneCallText] }} />
                </p>
              )}

              <div className="flex justify-between items-center mt-3">
                {phoneCallText > 0 ? (
                  <button onClick={handlePhoneCallPrev} className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                    Terug
                  </button>
                ) : (
                  <div className="w-20"></div>
                )}

                <div className="w-8"></div>

                {/* Show appropriate button based on phoneCallText */}
                {phoneCallText === 6 ? (
                  <button 
                    onClick={handleHangUp} 
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all shadow-lg font-bold"
                  >
                    📞 Ophangen
                  </button>
                ) : (phoneCallText < 3 || isDragDropComplete) && (
                  <button onClick={handlePhoneCallNext} className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all">
                    Volgende
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
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
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              transition: 'all 0.3s',
              background: level === 3 ? 'white' : 'transparent',
              border: '2px solid white'
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes poof {
          0% { opacity: 0; transform: scale(0.7); }
          50% { opacity: 0.6; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-poof {
          animation: poof 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes vibrate {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(-3px, 1px) rotate(-4deg); }
          50% { transform: translate(3px, -1px) rotate(4deg); }
          75% { transform: translate(-2px, 1px) rotate(-2deg); }
        }
        .phone-vibrate {
          animation: vibrate 0.25s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in forwards;
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
