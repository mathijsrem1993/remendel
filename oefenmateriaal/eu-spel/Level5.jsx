const { useState, useEffect } = React;

function Level5() {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [wildersEntering, setWildersEntering] = useState(false);
  const [wildersPresent, setWildersPresent] = useState(false);
  const [speechBubbleKey, setSpeechBubbleKey] = useState(0);
  const [conversationStep, setConversationStep] = useState(0);
  const [showTimmermansSpeech, setShowTimmermansSpeech] = useState(false);
  const [timmermansSpeechKey, setTimmermansSpeechKey] = useState(0);
  const [timmermansExiting, setTimmermansExiting] = useState(false);
  const [showTimmermans, setShowTimmermans] = useState(true);
  const [showWilders, setShowWilders] = useState(false);
  const [showWildersSpeech, setShowWildersSpeech] = useState(false);
  const [wildersSpeechKey, setWildersSpeechKey] = useState(0);
  const [wildersExiting, setWildersExiting] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showDraggableOptions, setShowDraggableOptions] = useState(false);
  const [cellFlash, setCellFlash] = useState(null);
  const [topRightFilled, setTopRightFilled] = useState(false);
  const [vanWeelExiting, setVanWeelExiting] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);

  const handleDrop = (option) => {
    const correctOption = "↓↓, ↓";
    
    if (option === correctOption) {
      setTopRightFilled(true);
      setCellFlash('correct');
      setTimeout(() => {
        setCellFlash(null);
        setConversationStep(12);
        setShowSpeechBubble(true);
        setSpeechBubbleKey(prev => prev + 1);
      }, 1000);
    } else {
      setCellFlash('incorrect');
      setTimeout(() => {
        setCellFlash(null);
      }, 2000);
    }
  };

  useEffect(() => {
    // Show initial speech bubble after 1 second
    const speechTimer = setTimeout(() => setShowSpeechBubble(true), 1000);
    
    return () => {
      clearTimeout(speechTimer);
    };
  }, []);

  return (
    <div className="w-[1200px] h-[700px] flex-shrink-0 bg-gradient-to-b from-slate-100 to-slate-50 relative overflow-hidden flex flex-col">
      
      {/* Main office scene */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* VVD Office Background - identical to Level 3 */}
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
          
          {/* Calendar showing 12 oktober */}
          <rect x="820" y="375" width="55" height="65" fill="white" stroke="#333" strokeWidth="2" />
          <rect x="820" y="375" width="55" height="20" fill="#003D8F" />
          <text x="847.5" y="389" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">OKT</text>
          <text x="847.5" y="418" fontSize="26" fontWeight="bold" fill="#333" textAnchor="middle">12</text>
          <text x="847.5" y="436" fontSize="10" fill="#666" textAnchor="middle">2025</text>
        </svg>

        {/* David van Weel Character - standing by desk */}
        <div 
          className="absolute bottom-20 z-10"
          style={{
            left: vanWeelExiting ? '-400px' : '38%',
            transition: 'left 1.5s ease-in-out'
          }}
        >
          <svg width="300" height="420" viewBox="0 0 300 420">
            <g>
              {/* Legs */}
              <rect x="130" y="310" width="30" height="90" fill="#3F3F3F" />
              <rect x="155" y="310" width="30" height="90" fill="#3F3F3F" />
              
              {/* Shoes */}
              <ellipse cx="145" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              <ellipse cx="170" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              
              {/* White shirt */}
              <rect x="125" y="210" width="65" height="100" fill="white" />
              
              {/* Suit jacket */}
              <path d="M 125 210 L 130 240 L 135 280 L 135 310 L 125 310 L 125 210" fill="#3F3F3F" />
              <path d="M 190 210 L 185 240 L 180 280 L 180 310 L 190 310 L 190 210" fill="#3F3F3F" />
              <path d="M 125 210 L 135 215 L 140 210" fill="#3F3F3F" />
              <path d="M 190 210 L 180 215 L 175 210" fill="#3F3F3F" />
              
              {/* Collar */}
              <path d="M 140 205 L 157.5 210 L 175 205 L 173 217 L 157.5 222 L 142 217 Z" fill="white" />
              
              {/* Navy blue tie */}
              <path d="M 157.5 210 L 152 252 L 157.5 295 L 163 252 Z" fill="#001F3F" />
              <path d="M 157.5 210 L 154 215 L 157.5 220 L 161 215 Z" fill="#002855" />
              
              {/* Jacket buttons */}
              <circle cx="135" cy="250" r="3" fill="#2F2F2F" />
              <circle cx="180" cy="250" r="3" fill="#2F2F2F" />
              
              {/* Arms */}
              <rect x="100" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
              <rect x="190" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
              
              {/* Cuffs and hands */}
              <rect x="100" y="300" width="25" height="15" fill="white" />
              <rect x="190" y="300" width="25" height="15" fill="white" />
              <ellipse cx="112.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="185" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head */}
              <ellipse cx="157.5" cy="150" rx="50" ry="54" fill="#F5D5C0" />
              
              {/* Hair */}
              <path d="M 107.5 140 Q 105.5 92 157.5 80 Q 209.5 92 207.5 140 Q 207.5 156 201.5 162 L 195.5 148 Q 191.5 98 157.5 93 Q 123.5 98 119.5 148 L 113.5 162 Q 107.5 156 107.5 140" fill="#A67C52" />
              <path d="M 117.5 118 Q 137.5 100 157.5 96 Q 177.5 100 197.5 118" stroke="#A67C52" strokeWidth="2" fill="none" />
              
              {/* Receding hairline - inhammen (temples) - oval shaped like other levels */}
              <ellipse cx="132.5" cy="108" rx="8" ry="12" fill="#F5D5C0" />
              <ellipse cx="182.5" cy="108" rx="8" ry="12" fill="#F5D5C0" />
              
              {/* Ears */}
              <ellipse cx="107.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="207.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="109.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              <ellipse cx="205.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              
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
              
              {/* Nose */}
              <path d="M 157.5 150 L 152.5 164 L 157.5 168 L 162.5 164 Z" fill="#E8C4A8" />
              <ellipse cx="152.5" cy="165" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <ellipse cx="162.5" cy="165" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              
              {/* Smile */}
              <path d="M 132.5 177 Q 157.5 186 182.5 177" stroke="#A0522D" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Frans Timmermans Character - slides in from left, exits to left */}
        {showTimmermans && (
        <div 
          className={`absolute bottom-20 z-10 ${wildersEntering ? 'slide-in-left' : ''} ${timmermansExiting ? 'slide-out-left' : ''}`}
          style={{
            left: wildersEntering ? '10%' : '-400px',
            transition: 'left 1s ease-in-out',
            opacity: timmermansExiting ? 0 : 1,
            transitionProperty: 'left, opacity'
          }}
        >
          <svg width="300" height="440" viewBox="0 0 300 440">
            <g>
              {/* Legs - slightly longer */}
              <rect x="130" y="320" width="30" height="100" fill="#2C2C3E" />
              <rect x="155" y="320" width="30" height="100" fill="#2C2C3E" />
              
              {/* Shoes - black */}
              <ellipse cx="145" cy="425" rx="18" ry="8" fill="#000000" />
              <ellipse cx="170" cy="425" rx="18" ry="8" fill="#000000" />
              
              {/* White shirt */}
              <rect x="125" y="220" width="65" height="100" fill="white" />
              
              {/* Dark suit jacket - charcoal grey */}
              <path d="M 125 220 L 130 250 L 135 290 L 135 320 L 125 320 L 125 220" fill="#2C2C3E" />
              <path d="M 190 220 L 185 250 L 180 290 L 180 320 L 190 320 L 190 220" fill="#2C2C3E" />
              <path d="M 125 220 L 135 225 L 140 220" fill="#2C2C3E" />
              <path d="M 190 220 L 180 225 L 175 220" fill="#2C2C3E" />
              
              {/* Collar */}
              <path d="M 140 215 L 157.5 220 L 175 215 L 173 227 L 157.5 232 L 142 227 Z" fill="white" />
              
              {/* Red tie - GL-PvdA colors */}
              <path d="M 157.5 220 L 152 262 L 157.5 305 L 163 262 Z" fill="#DC143C" />
              <path d="M 157.5 220 L 154 225 L 157.5 230 L 161 225 Z" fill="#E52B50" />
              
              {/* Jacket buttons */}
              <circle cx="135" cy="260" r="3" fill="#444" />
              <circle cx="180" cy="260" r="3" fill="#444" />
              
              {/* Arms */}
              <rect x="100" y="230" width="25" height="90" fill="#2C2C3E" rx="8" />
              <rect x="190" y="230" width="25" height="90" fill="#2C2C3E" rx="8" />
              
              {/* Cuffs and hands */}
              <rect x="100" y="310" width="25" height="15" fill="white" />
              <rect x="190" y="310" width="25" height="15" fill="white" />
              <ellipse cx="112.5" cy="332" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="332" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="195" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - more elongated/oval shape */}
              <ellipse cx="157.5" cy="160" rx="50" ry="58" fill="#F5D5C0" />
              
              {/* Hair - grey/white, only on sides and very back, BALD ON TOP (no floating hair) */}
              {/* Left side hair - lower, not above eyes */}
              <path d="M 108 165 Q 106 158 108 152 Q 110 148 114 145" fill="#D3D3D3" />
              {/* Right side hair - lower, not above eyes */}
              <path d="M 207 165 Q 209 158 207 152 Q 205 148 201 145" fill="#D3D3D3" />
              {/* Very back of head only - not visible from front */}
              
              {/* Ears - closer to head */}
              <ellipse cx="104" cy="165" rx="9" ry="14" fill="#F5D5C0" />
              <ellipse cx="211" cy="165" rx="9" ry="14" fill="#F5D5C0" />
              <ellipse cx="106" cy="165" rx="4" ry="7" fill="#E8C4A8" />
              <ellipse cx="209" cy="165" rx="4" ry="7" fill="#E8C4A8" />
              
              {/* Glasses - more rectangular/square frame */}
              <rect x="123" y="152" width="24" height="18" rx="3" fill="white" stroke="#333333" strokeWidth="1.5" />
              <rect x="168" y="152" width="24" height="18" rx="3" fill="white" stroke="#333333" strokeWidth="1.5" />
              <line x1="147" y1="161" x2="168" y2="161" stroke="#333333" strokeWidth="1.5" />
              <line x1="123" y1="161" x2="110" y2="159" stroke="#333333" strokeWidth="1.5" />
              <line x1="192" y1="161" x2="205" y2="159" stroke="#333333" strokeWidth="1.5" />
              
              {/* Eyes behind glasses */}
              <circle cx="135" cy="161" r="5" fill="#4A7BA7" />
              <circle cx="180" cy="161" r="5" fill="#4A7BA7" />
              <circle cx="135" cy="161" r="2" fill="black" />
              <circle cx="180" cy="161" r="2" fill="black" />
              <circle cx="136" cy="160" r="1" fill="white" />
              <circle cx="181" cy="160" r="1" fill="white" />
              
              {/* Eyebrows - lighter grey */}
              <path d="M 120 149 Q 132 146 143 149" stroke="#999999" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 172 149 Q 183 146 195 149" stroke="#999999" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Forehead wrinkles - subtle aging lines */}
              <path d="M 125 135 Q 157.5 133 190 135" stroke="#C4A48A" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M 130 128 Q 157.5 126 185 128" stroke="#C4A48A" strokeWidth="0.9" fill="none" opacity="0.25" />
              <path d="M 135 121 Q 157.5 120 180 121" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.2" />
              
              {/* Nose */}
              <path d="M 157.5 166 L 151.5 178 L 157.5 181 L 163.5 178 Z" fill="#D4B49A" />
              <ellipse cx="151.5" cy="179" rx="3.5" ry="4.5" fill="#C4A48A" />
              <ellipse cx="163.5" cy="179" rx="3.5" ry="4.5" fill="#C4A48A" />
              
              {/* Nasolabial folds */}
              <path d="M 151.5 179 Q 148 187 147 193" stroke="#C4A48A" strokeWidth="1.2" fill="none" opacity="0.4" />
              <path d="M 163.5 179 Q 167 187 168 193" stroke="#C4A48A" strokeWidth="1.2" fill="none" opacity="0.4" />
              
              {/* Mouth - neutral expression */}
              <line x1="142" y1="196" x2="173" y2="196" stroke="#A0522D" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* White stubble beard - 165+ dots spread across entire lower face for dense coverage */}
              {/* Base stubble area for subtle shadow */}
              <ellipse cx="157.5" cy="201" rx="30" ry="11" fill="#E8E8E8" opacity="0.25" />
              
              {/* Chin area - LOWER on actual chin (30 dots - added 10 more) */}
              <circle cx="150" cy="207" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="155" cy="208" r="0.6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="160" cy="208" r="0.6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="165" cy="207" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="147" cy="209" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="152" cy="210" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="157.5" cy="211" r="0.6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="163" cy="210" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="168" cy="209" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="144" cy="206" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="171" cy="206" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="149" cy="205" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="154" cy="206" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="161" cy="206" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="166" cy="205" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="142" cy="208" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="173" cy="208" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="157.5" cy="213" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="151" cy="212" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="164" cy="212" r="0.55" fill="#FFFFFF" opacity="0.8" />
              {/* Extra chin dots */}
              <circle cx="146" cy="210" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="153" cy="211" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="158" cy="209" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="162" cy="211" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="169" cy="210" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="145" cy="214" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="157.5" cy="215" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="170" cy="214" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="140" cy="209" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="175" cy="209" r="0.55" fill="#FFFFFF" opacity="0.8" />
              
              {/* Under mouth area (30 dots - added 10 more) */}
              <circle cx="145" cy="199" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="150" cy="201" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="155" cy="202" r="0.6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="160" cy="202" r="0.6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="165" cy="201" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="170" cy="199" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="148" cy="197" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="153" cy="199" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="162" cy="199" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="167" cy="197" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="143" cy="203" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="147" cy="204" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="152" cy="203" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="157" cy="204" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="163" cy="203" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="168" cy="204" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="172" cy="203" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="141" cy="200" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="174" cy="200" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="157.5" cy="206" r="0.55" fill="#FFFFFF" opacity="0.8" />
              {/* Extra under mouth dots */}
              <circle cx="146" cy="198" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="151" cy="200" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="156" cy="201" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="159" cy="201" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="164" cy="200" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="169" cy="198" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="144" cy="201" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="171" cy="201" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="149" cy="203" r="0.55" fill="#FFFFFF" opacity="0.8" />
              <circle cx="166" cy="203" r="0.55" fill="#FFFFFF" opacity="0.8" />
              
              {/* Lower face/jaw area (15 dots) */}
              <circle cx="140" cy="196" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="144" cy="194" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="149" cy="195" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="154" cy="194" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="161" cy="194" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="166" cy="195" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="171" cy="194" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="175" cy="196" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="138" cy="193" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="142" cy="191" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="157.5" cy="193" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="173" cy="191" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="177" cy="193" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="146" cy="192" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="169" cy="192" r="0.55" fill="#FFFFFF" opacity="0.75" />
              
              {/* Extra dense stubble under mouth corners and surrounding areas (50+ dots) */}
              {/* Left mouth corner area - schuinrechtsonder linker mondhoek */}
              <circle cx="136" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="138" cy="199" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="140" cy="200" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="142" cy="201" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="144" cy="202" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="137" cy="200" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="139" cy="201" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="141" cy="202" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="143" cy="203" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="135" cy="199" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="137" cy="201" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="139" cy="203" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="141" cy="204" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="136" cy="202" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="138" cy="204" r="0.55" fill="#FFFFFF" opacity="0.75" />
              
              {/* Right mouth corner area - schuin linksonder rechter mondhoek */}
              <circle cx="179" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="177" cy="199" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="175" cy="200" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="173" cy="201" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="171" cy="202" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="178" cy="200" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="176" cy="201" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="174" cy="202" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="172" cy="203" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="180" cy="199" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="178" cy="201" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="176" cy="203" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="174" cy="204" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="179" cy="202" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="177" cy="204" r="0.55" fill="#FFFFFF" opacity="0.75" />
              
              {/* Additional jaw/chin filling */}
              <circle cx="135" cy="204" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="137" cy="205" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="139" cy="206" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="141" cy="207" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="180" cy="204" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="178" cy="205" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="176" cy="206" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="174" cy="207" r="0.55" fill="#FFFFFF" opacity="0.75" />
              
              {/* Center lower face filling */}
              <circle cx="150" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="152" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="154" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="156" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="158" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="160" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="163" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="165" cy="198" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="151" cy="196" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="155" cy="196" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="160" cy="196" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="164" cy="196" r="0.55" fill="#FFFFFF" opacity="0.75" />
              
              {/* Left cheek (22 dots) */}
              <circle cx="130" cy="185" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="135" cy="187" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="140" cy="189" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="133" cy="190" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="138" cy="192" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="127" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="132" cy="182" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="137" cy="184" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="125" cy="190" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="129" cy="193" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="134" cy="194" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="128" cy="179" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="133" cy="181" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="138" cy="183" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="131" cy="186" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="136" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="141" cy="191" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="126" cy="184" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="135" cy="180" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="139" cy="186" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="124" cy="187" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="142" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              
              {/* Right cheek (22 dots) */}
              <circle cx="185" cy="185" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="180" cy="187" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="175" cy="189" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="182" cy="190" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="177" cy="192" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="188" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="183" cy="182" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="178" cy="184" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="190" cy="190" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="186" cy="193" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="181" cy="194" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="187" cy="179" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="182" cy="181" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="177" cy="183" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="184" cy="186" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="179" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="174" cy="191" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="189" cy="184" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="180" cy="180" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="176" cy="186" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="191" cy="187" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="173" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              
              {/* Left cheek to ear area (15 dots) */}
              <circle cx="115" cy="180" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="118" cy="183" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="121" cy="186" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="116" cy="177" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="119" cy="179" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="122" cy="182" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="114" cy="184" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="117" cy="187" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="120" cy="190" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="113" cy="181" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="123" cy="179" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="116" cy="185" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="119" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="115" cy="175" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="121" cy="192" r="0.55" fill="#FFFFFF" opacity="0.7" />
              
              {/* Right cheek to ear area (15 dots) */}
              <circle cx="200" cy="180" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="197" cy="183" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="194" cy="186" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="199" cy="177" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="196" cy="179" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="193" cy="182" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="201" cy="184" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="198" cy="187" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="195" cy="190" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="202" cy="181" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="192" cy="179" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="199" cy="185" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="196" cy="188" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="200" cy="175" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="194" cy="192" r="0.55" fill="#FFFFFF" opacity="0.7" />
              
              {/* Left jawline (8 dots) */}
              <circle cx="120" cy="195" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="123" cy="198" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="126" cy="201" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="130" cy="203" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="134" cy="205" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="118" cy="192" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="122" cy="189" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="128" cy="200" r="0.55" fill="#FFFFFF" opacity="0.7" />
              
              {/* Right jawline (8 dots) */}
              <circle cx="195" cy="195" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="192" cy="198" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="189" cy="201" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="185" cy="203" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="181" cy="205" r="0.55" fill="#FFFFFF" opacity="0.75" />
              <circle cx="197" cy="192" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="193" cy="189" r="0.55" fill="#FFFFFF" opacity="0.7" />
              <circle cx="187" cy="200" r="0.55" fill="#FFFFFF" opacity="0.7" />
            </g>
          </svg>
        </div>
        )}

        {/* Geert Wilders Character - slides in from left, exits to left */}
        {showWilders && (
        <div 
          className={`absolute bottom-20 z-10 ${wildersEntering && showWilders ? 'slide-in-left' : ''} ${wildersExiting ? 'slide-out-left' : ''}`}
          style={{
            left: wildersEntering && showWilders ? '10%' : '-400px',
            transition: 'left 1s ease-in-out',
            opacity: wildersExiting ? 0 : 1,
            transitionProperty: 'left, opacity'
          }}
        >
          <svg width="300" height="440" viewBox="0 0 300 440">
            <g>
              {/* Legs - slightly longer */}
              <rect x="130" y="320" width="30" height="100" fill="#1a1a2e" />
              <rect x="155" y="320" width="30" height="100" fill="#1a1a2e" />
              
              {/* Shoes - black */}
              <ellipse cx="145" cy="425" rx="18" ry="8" fill="#000000" />
              <ellipse cx="170" cy="425" rx="18" ry="8" fill="#000000" />
              
              {/* White shirt */}
              <rect x="125" y="220" width="65" height="100" fill="white" />
              
              {/* Dark suit jacket - navy/black */}
              <path d="M 125 220 L 130 250 L 135 290 L 135 320 L 125 320 L 125 220" fill="#1a1a2e" />
              <path d="M 190 220 L 185 250 L 180 290 L 180 320 L 190 320 L 190 220" fill="#1a1a2e" />
              <path d="M 125 220 L 135 225 L 140 220" fill="#1a1a2e" />
              <path d="M 190 220 L 180 225 L 175 220" fill="#1a1a2e" />
              
              {/* Collar */}
              <path d="M 140 215 L 157.5 220 L 175 215 L 173 227 L 157.5 232 L 142 227 Z" fill="white" />
              
              {/* Blue tie - characteristic PVV blue */}
              <path d="M 157.5 220 L 152 262 L 157.5 305 L 163 262 Z" fill="#0066CC" />
              <path d="M 157.5 220 L 154 225 L 157.5 230 L 161 225 Z" fill="#0077DD" />
              
              {/* Jacket buttons */}
              <circle cx="135" cy="260" r="3" fill="#444" />
              <circle cx="180" cy="260" r="3" fill="#444" />
              
              {/* Arms */}
              <rect x="100" y="230" width="25" height="90" fill="#1a1a2e" rx="8" />
              <rect x="190" y="230" width="25" height="90" fill="#1a1a2e" rx="8" />
              
              {/* Cuffs and hands */}
              <rect x="100" y="310" width="25" height="15" fill="white" />
              <rect x="190" y="310" width="25" height="15" fill="white" />
              <ellipse cx="112.5" cy="332" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="332" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="195" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - bigger to match Van Weel's proportions */}
              <ellipse cx="157.5" cy="160" rx="48" ry="52" fill="#F5D5C0" />
              
              {/* Hair - simple structure based on Van Weel, platinum blonde color, hairline at y=115 */}
              <path d="M 107.5 148 Q 105.5 92 157.5 80 Q 209.5 92 207.5 148 Q 207.5 160 201.5 165 L 195.5 152 Q 191.5 120 157.5 115 Q 123.5 120 119.5 152 L 113.5 165 Q 107.5 160 107.5 148" fill="#F5F0D8" />
              <path d="M 117.5 125 Q 137.5 118 157.5 116 Q 177.5 118 197.5 125" stroke="#EDE8C8" strokeWidth="2" fill="none" />
              
              {/* Receding hairline - inhammen (temples) - oval shaped like Van Weel */}
              <ellipse cx="132.5" cy="121" rx="8" ry="12" fill="#F5D5C0" transform="rotate(-12 132.5 121)" />
              <ellipse cx="182.5" cy="121" rx="8" ry="12" fill="#F5D5C0" transform="rotate(12 182.5 121)" />
              
              {/* Ears */}
              <ellipse cx="109.5" cy="160" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="205.5" cy="160" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="111.5" cy="160" rx="5" ry="8" fill="#E8C4A8" />
              <ellipse cx="203.5" cy="160" rx="5" ry="8" fill="#E8C4A8" />
              
              {/* Eyes - Wilders' characteristic shape */}
              <ellipse cx="135" cy="162" rx="11" ry="9" fill="white" />
              <ellipse cx="180" cy="162" rx="11" ry="9" fill="white" />
              <circle cx="135" cy="162" r="5.5" fill="#5B8DB8" />
              <circle cx="180" cy="162" r="5.5" fill="#5B8DB8" />
              <circle cx="135" cy="162" r="2.2" fill="black" />
              <circle cx="180" cy="162" r="2.2" fill="black" />
              <circle cx="136.5" cy="160.5" r="1.2" fill="white" />
              <circle cx="181.5" cy="160.5" r="1.2" fill="white" />
              
              {/* Crow's feet */}
              <path d="M 145 160 L 149 158" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M 146 162 L 150 162" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M 145 164 L 149 166" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M 170 160 L 166 158" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M 169 162 L 165 162" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M 170 164 L 166 166" stroke="#C4A48A" strokeWidth="0.8" fill="none" opacity="0.4" />
              
              {/* Bags under eyes */}
              <path d="M 126 170 Q 135 172 144 170" stroke="#C4A48A" strokeWidth="1.3" fill="none" opacity="0.5" />
              <path d="M 171 170 Q 180 172 189 170" stroke="#C4A48A" strokeWidth="1.3" fill="none" opacity="0.5" />
              <ellipse cx="135" cy="171" rx="10" ry="3.5" fill="#D4B49A" opacity="0.25" />
              <ellipse cx="180" cy="171" rx="10" ry="3.5" fill="#D4B49A" opacity="0.25" />
              
              {/* Eyebrows - dark brown, distinctive strong eyebrows */}
              <path d="M 122 148 Q 135 145 145 148" stroke="#3E2A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 170 148 Q 180 145 193 148" stroke="#3E2A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              
              {/* Nose - slightly more prominent */}
              <path d="M 157.5 165 L 151.5 177 L 157.5 180 L 163.5 177 Z" fill="#D4B49A" />
              <ellipse cx="151.5" cy="178" rx="3.5" ry="4.5" fill="#C4A48A" />
              <ellipse cx="163.5" cy="178" rx="3.5" ry="4.5" fill="#C4A48A" />
              
              {/* Nasolabial folds - aging detail */}
              <path d="M 151.5 178 Q 148 186 147 192" stroke="#C4A48A" strokeWidth="1.2" fill="none" opacity="0.4" />
              <path d="M 163.5 178 Q 167 186 168 192" stroke="#C4A48A" strokeWidth="1.2" fill="none" opacity="0.4" />
              
              {/* Mouth - firm expression */}
              <line x1="142" y1="192" x2="173" y2="192" stroke="#A0522D" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        )}

        {/* Speech bubble - Van Weel */}
        {showSpeechBubble && (
          <div 
            className="absolute animate-poof"
            style={{
              left: '65%',
              transform: 'translateX(-50%)',
              bottom: conversationStep === 0 ? '420px' : (conversationStep === 11 || conversationStep === 13) ? '430px' : '460px',
              zIndex: 15
            }}
            key={speechBubbleKey}
          >
            <div className="relative bg-white rounded-2xl px-8 py-4 shadow-2xl border-4 border-gray-800" style={{width: '780px'}}>
              {conversationStep === 0 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Het is goed om na mijn bezoek aan het VK weer in Nederland te zijn. Vandaag verwacht ik nog twee politici die hun mening geven over het Nederlands standpunt betreft EU-integratie.
                  </p>
                  <div className="flex justify-end">
                    <span 
                      onClick={() => {
                        setWildersEntering(true);
                        setConversationStep(1);
                        setSpeechBubbleKey(prev => prev + 1);
                        setTimeout(() => {
                          setWildersPresent(true);
                        }, 1000);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 1 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Daar zal je meneer Timmermans al hebben.
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(0);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(2);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 2 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Ik wil u vragen naar een situatie waarin andere lidstaten niet inzetten op EU-integratie, wat zou Nederland in dit geval moeten doen?
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(1);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(3);
                        setShowSpeechBubble(false);
                        setTimeout(() => {
                          setShowTimmermansSpeech(true);
                          setTimmermansSpeechKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 5 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Bedankt voor uw inzichten meneer Timmermans. Ik neem het mee in de voorbereiding op het debat. Fijne dag!
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(4);
                        setShowSpeechBubble(false);
                        setTimeout(() => {
                          setShowTimmermansSpeech(true);
                          setTimmermansSpeechKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setTimmermansExiting(true);
                        setShowSpeechBubble(false);
                        setTimeout(() => {
                          setShowTimmermans(false);
                          setTimeout(() => {
                            setShowWilders(true);
                            setWildersEntering(true);
                            setTimeout(() => {
                              setConversationStep(6);
                              setShowSpeechBubble(true);
                              setSpeechBubbleKey(prev => prev + 1);
                              setWildersPresent(true);
                            }, 1000);
                          }, 1000);
                        }, 1000);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 6 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Ah, meneer Wilders. Fijn dat u ook langskomt.
                  </p>
                  <div className="flex justify-end">
                    <span 
                      onClick={() => {
                        setConversationStep(7);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 7 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Als overige lidstaten niet inzetten op verdere EU-integratie, vindt u het dan een goed idee dat Nederland dit wel doet?
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(6);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(8);
                        setShowSpeechBubble(false);
                        setTimeout(() => {
                          setShowWildersSpeech(true);
                          setWildersSpeechKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 9 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> U neemt duidelijk stelling in. Bedankt voor het delen. Ik neem dit mee in mijn voorbereiding op het debat. Fijne dag!
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(8.5);
                        setShowSpeechBubble(false);
                        setTimeout(() => {
                          setShowWildersSpeech(true);
                          setWildersSpeechKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setWildersExiting(true);
                        setShowSpeechBubble(false);
                        setTimeout(() => {
                          setShowWilders(false);
                          setTimeout(() => {
                            setConversationStep(10);
                            setShowSpeechBubble(true);
                            setSpeechBubbleKey(prev => prev + 1);
                          }, 1000);
                        }, 1000);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 10 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Hoewel Wilders erg sterk stelling in neemt heeft hij wel een punt. Wat is het nut van inzetten op meer Europese integratie als de rest van de EU-lidstaten dit niet doet?
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(9);
                        setShowWilders(true);
                        setWildersEntering(false);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(11);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 11 && (
                <>
                  <p className="text-lg text-gray-800 font-sans mb-3" style={{lineHeight: '1.3'}}>
                    <strong>Van Weel:</strong> Nederland moet veel extra investeren, terwijl de kans dat we in ons eentje alle andere lidstaten op andere gedachten kunnen brengen vrij klein is. Dit scenario levert ons de laagst mogelijke netto baten op.
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(10);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <button
                      onClick={() => {
                        setShowMatrix(true);
                        setTimeout(() => {
                          setShowDraggableOptions(true);
                        }, 500);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Open de matrix
                    </button>
                  </div>
                </>
              )}
              
              {conversationStep === 12 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Van Weel:</strong> Heel goed. Nu hebben we alle opbrengsten in de matrix verwerkt. Het is tijd om conclusies te trekken.
                  </p>
                  <div className="flex justify-end">
                    <span 
                      onClick={() => {
                        setConversationStep(13);
                        setShowMatrix(false);
                        setSpeechBubbleKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 13 && (
                <>
                  <p className="text-lg text-gray-800 font-sans mb-3" style={{lineHeight: '1.3'}}>
                    <strong>Van Weel:</strong> Om conclusies te trekken en mij van advies te voorzien heb je een stencil nodig. Steek je vinger op en vraag dit aan je docent. Ik kijk uit naar het advies dat ik van je ontvang. Doeg!
                  </p>
                  <div className="flex justify-end">
                    <span 
                      onClick={() => {
                        setShowSpeechBubble(false);
                        setVanWeelExiting(true);
                        setTimeout(() => {
                          setFadeToBlack(true);
                          setTimeout(() => {
                            setShowFinalText(true);
                          }, 2000); // Show text after fade completes
                        }, 3500); // Start fade 3.5 seconds after Van Weel starts exiting (1.5s animation + 2s wait)
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Speech bubble - Timmermans */}
        {showTimmermansSpeech && (
          <div 
            className="absolute animate-poof"
            style={{
              left: '35%',
              transform: 'translateX(-50%)',
              bottom: '460px',
              zIndex: 15
            }}
            key={timmermansSpeechKey}
          >
            <div className="relative bg-white rounded-2xl px-8 py-5 shadow-2xl border-4 border-gray-800" style={{maxWidth: '550px'}}>
              {conversationStep === 3 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Timmermans:</strong> Als voormalig vicevoorzitter van de Europese Commissie verbaast het u vast niet als ik zeg dat Nederland juist in zo'n situatie het voortouw moet nemen.
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(2);
                        setShowTimmermansSpeech(false);
                        setTimeout(() => {
                          setShowSpeechBubble(true);
                          setSpeechBubbleKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(4);
                        setTimmermansSpeechKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 4 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Timmermans:</strong> We moeten blijven investeren in verdere Europese integratie. Alleen door consequent te kiezen voor meer samenwerking kan Europa sterker, veiliger en weerbaarder worden.
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(3);
                        setTimmermansSpeechKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(5);
                        setShowTimmermansSpeech(false);
                        setTimeout(() => {
                          setShowSpeechBubble(true);
                          setSpeechBubbleKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Speech bubble - Wilders */}
        {showWildersSpeech && (
          <div 
            className="absolute animate-poof"
            style={{
              left: '30%',
              transform: 'translateX(-50%)',
              bottom: '460px',
              zIndex: 15
            }}
            key={wildersSpeechKey}
          >
            <div className="relative bg-white rounded-2xl px-8 py-5 shadow-2xl border-4 border-gray-800" style={{maxWidth: '550px'}}>
              {conversationStep === 8 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Wilders:</strong> Alleen maar blijven drammen over meer EU-integratie terwijl andere landen afhaken is natuurlijk totaal onverantwoord en weggegooid geld. Nederland moet stoppen met het braafste jongetje van de klas spelen!
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(7);
                        setShowWildersSpeech(false);
                        setTimeout(() => {
                          setShowSpeechBubble(true);
                          setSpeechBubbleKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(8.5);
                        setWildersSpeechKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
              
              {conversationStep === 8.5 && (
                <>
                  <p className="text-lg text-gray-800 leading-relaxed font-sans mb-4">
                    <strong>Wilders:</strong> Sterker nog: ik ben überhaupt niet voor méér Europese integratie. We moeten juist minder macht aan Brussel overdragen en de controle weer terughalen naar Nederland.
                  </p>
                  <div className="flex justify-between">
                    <span 
                      onClick={() => {
                        setConversationStep(8);
                        setWildersSpeechKey(prev => prev + 1);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      ← Vorige
                    </span>
                    <span 
                      onClick={() => {
                        setConversationStep(9);
                        setShowWildersSpeech(false);
                        setTimeout(() => {
                          setShowSpeechBubble(true);
                          setSpeechBubbleKey(prev => prev + 1);
                        }, 100);
                      }}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                    >
                      Volgende →
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Opbrengstenmatrix */}
        {showMatrix && (
          <div 
            className="absolute"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: '8px',
              zIndex: 20
            }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-gray-800" style={{width: '500px'}}>
              <h2 className="text-2xl font-bold text-center mb-4">Opbrengstenmatrix</h2>
              
              <div className="relative">
                {/* Column header - centered above both columns */}
                <div className="text-center font-bold text-sm mb-2">
                  <div className="text-xs text-gray-600">Overige EU-lidstaten</div>
                </div>
                
                {/* Sub-column headers */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div></div>
                  <div className="text-center font-bold text-sm">Meer EU-integratie</div>
                  <div className="text-center font-bold text-sm">Huidig beleid</div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="flex items-center text-sm font-bold">
                    <div className="mr-2 text-xs text-gray-600">NL</div>
                    <div>Meer EU-integratie</div>
                  </div>
                  <div className="border-2 border-gray-800 bg-white p-2 text-center text-sm">
                    <div>↑↑↑, ↑↑↑</div>
                  </div>
                  <div 
                    className={`border-2 ${conversationStep === 12 ? 'border-gray-800' : cellFlash === 'correct' ? 'border-green-500 border-4' : cellFlash === 'incorrect' ? 'border-red-500 border-4' : topRightFilled ? 'border-green-500 border-4' : 'border-gray-800 border-4'} bg-white p-2 text-center text-sm relative`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const option = e.dataTransfer.getData('text');
                      handleDrop(option);
                    }}
                  >
                    {topRightFilled ? '↓↓, ↓' : '___'}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center text-sm font-bold">
                    <div className="mr-2 text-xs text-gray-600 invisible">NL</div>
                    <div>Huidig beleid</div>
                  </div>
                  <div className="border-2 border-gray-800 bg-white p-2 text-center text-sm">
                    <div>↑, ↑↑</div>
                  </div>
                  <div className="border-2 border-gray-800 bg-white p-2 text-center text-sm">
                    <div>↓, ↓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Draggable Options Box */}
        {showDraggableOptions && !topRightFilled && (
          <div 
            className="absolute bg-white rounded-2xl p-6 shadow-2xl border-4 border-gray-800"
            style={{
              right: '8px',
              bottom: '8px',
              zIndex: 20,
              width: '250px'
            }}
          >
            <h3 className="text-lg font-bold mb-4 text-center">Opbrengsten</h3>
            <div className="space-y-3">
              {['↑↑, ↓', '↑↑, ↓↓↓', '↓↓, ↓', '↓↓, ↓↓↓'].map((option, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text', option);
                  }}
                  className="border-2 border-gray-800 bg-blue-50 p-3 text-center font-bold cursor-move hover:bg-blue-100 transition-colors rounded-lg"
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fade to Black Overlay */}
        {fadeToBlack && (
          <div 
            className="absolute inset-0 bg-black z-50"
            style={{
              animation: 'fadeIn 2s ease-in forwards'
            }}
          >
            {showFinalText && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p 
                  className="text-white text-3xl font-bold text-center"
                  style={{
                    animation: 'fadeIn 1s ease-in forwards'
                  }}
                >
                  Vraag het stencil aan je docent.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="pb-8 flex justify-center gap-2.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
          <div
            key={level}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: level === 5 ? 'white' : 'transparent',
              border: '2px solid white',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes poof {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.7);
          }
          50% {
            opacity: 0.6;
            transform: translateX(-50%) scale(1.08);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
        
        .animate-poof {
          animation: poof 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .slide-in-left {
          animation: slideInLeft 1s ease-in-out;
        }

        .slide-out-left {
          animation: slideOutLeft 1s ease-in-out;
        }

        @keyframes slideInLeft {
          from {
            left: -400px;
          }
          to {
            left: 10%;
          }
        }

        @keyframes slideOutLeft {
          from {
            left: 10%;
          }
          to {
            left: -400px;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
