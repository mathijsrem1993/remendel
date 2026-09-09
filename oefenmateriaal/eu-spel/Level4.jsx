const { useState, useEffect } = React;

function Level4({ onComplete }) {
  const [currentText, setCurrentText] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [speechBubbleKey, setSpeechBubbleKey] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [previousPosition, setPreviousPosition] = useState('center');
  const [showStatement, setShowStatement] = useState(false);
  const [johnsonHighlighted, setJohnsonHighlighted] = useState(false);
  const [starmerHighlighted, setStarmerHighlighted] = useState(false);
  const [johnsonResponse, setJohnsonResponse] = useState(false);
  const [starmerResponse, setStarmerResponse] = useState(false);
  const [showSourceButton, setShowSourceButton] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showVanWeelFeedback, setShowVanWeelFeedback] = useState(false);
  const [impactMeterHighlighted, setImpactMeterHighlighted] = useState(false);
  const [vkImpactFilled, setVkImpactFilled] = useState(0);
  const [euImpactFilled, setEuImpactFilled] = useState(0);
  const [currentStatement, setCurrentStatement] = useState(1); // Track which statement we're on
  const [showStatement2, setShowStatement2] = useState(false);
  const [johnsonHighlighted2, setJohnsonHighlighted2] = useState(false);
  const [starmerHighlighted2, setStarmerHighlighted2] = useState(false);
  const [johnsonResponse2, setJohnsonResponse2] = useState(false);
  const [starmerResponse2, setStarmerResponse2] = useState(false);
  const [showSourceButton2, setShowSourceButton2] = useState(false);
  const [showArticle2, setShowArticle2] = useState(false);
  const [showQuiz2, setShowQuiz2] = useState(false);
  const [selectedAnswer2, setSelectedAnswer2] = useState(null);
  const [showVanWeelFeedback2, setShowVanWeelFeedback2] = useState(false);
  const [impactMeterHighlighted2, setImpactMeterHighlighted2] = useState(false);
  const [showTransitionToStatement2, setShowTransitionToStatement2] = useState(false);
  const [showTransitionToStatement3, setShowTransitionToStatement3] = useState(false);
  const [impactMeterVisible, setImpactMeterVisible] = useState(false);
  const [showStatement3, setShowStatement3] = useState(false);
  const [johnsonHighlighted3, setJohnsonHighlighted3] = useState(false);
  const [starmerHighlighted3, setStarmerHighlighted3] = useState(false);
  const [johnsonResponse3, setJohnsonResponse3] = useState(false);
  const [starmerResponse3, setStarmerResponse3] = useState(false);
  const [showSourceButton3, setShowSourceButton3] = useState(false);
  const [showArticle3, setShowArticle3] = useState(false);
  const [showQuiz3, setShowQuiz3] = useState(false);
  const [selectedAnswer3, setSelectedAnswer3] = useState(null);
  const [showVanWeelFeedback3, setShowVanWeelFeedback3] = useState(false);
  const [impactMeterHighlighted3, setImpactMeterHighlighted3] = useState(false);
  const [showEndingText1, setShowEndingText1] = useState(false);
  const [showEndingText2, setShowEndingText2] = useState(false);
  const [endingTextIndex, setEndingTextIndex] = useState(0); // 0=text1, 1=text2, 2=text3
  const [charactersExiting, setCharactersExiting] = useState(false);
  const [charactersGone, setCharactersGone] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showDraggableOptions, setShowDraggableOptions] = useState(false);
  const [matrixCells, setMatrixCells] = useState({
    topLeft: {vk: '↑↑↑↑', eu: '↑↑↑↑'}, // Pre-filled
    bottomLeft: null // This is the draggable cell
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [cellFlash, setCellFlash] = useState(null); // 'correct' or 'incorrect'
  const [showFinalText, setShowFinalText] = useState(false);

  // Volgorde van de sleepbare opbrengst-opties wordt één keer per
  // spelsessie door elkaar gehusseld, zodat het juiste antwoord niet
  // steeds op dezelfde (eerste) plek staat.
  const [payoffOptions] = useState(() => {
    const options = [
      { vk: '↓↓↓', eu: '↓↓' },
      { vk: '↑', eu: '↑↑' },
      { vk: '↑↑', eu: '↑' },
      { vk: '↓↓', eu: '↓↓↓' }
    ];
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Determine bubble position based on text index
  const getBubblePosition = (index) => {
    if (index === 0 || index === 1) return 'center';
    if (index === 2) return 'left';
    if (index === 3) return 'right';
    if (index === 4 || index === 5) return 'center';
    return 'center';
  };

  const currentPosition = getBubblePosition(currentText);

  // Helper function to render text with bold names
  const renderTextWithBoldNames = (text) => {
    const parts = text.split(/(Van Weel:|Johnson:|Starmer:)/);
    return parts.map((part, index) => {
      if (part === 'Van Weel:' || part === 'Johnson:' || part === 'Starmer:') {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  // Helper function to get impact meter color (yellow to red gradient)
  const getImpactColor = (index) => {
    // index 0 = yellow, index 6 = red (for 7 boxes)
    const colors = [
      '#FFFF00', // yellow (1)
      '#FFD700', // gold (2)
      '#FFA500', // orange (3)
      '#FF8C00', // dark orange (4)
      '#FF6347', // tomato (5)
      '#FF4500', // orange-red (6)
      '#FF0000'  // red (7)
    ];
    return colors[index] || '#FFFF00';
  };

  useEffect(() => {
    const speechTimer = setTimeout(() => setShowSpeechBubble(true), 1000);
    return () => clearTimeout(speechTimer);
  }, []);

  // Make impact meter permanently visible once statement 1 appears
  useEffect(() => {
    if (showStatement && !impactMeterVisible) {
      setImpactMeterVisible(true);
    }
  }, [showStatement, impactMeterVisible]);

  // Timing for character highlights after statement appears
  useEffect(() => {
    if (showStatement) {
      // Johnson highlights 1 second after statement
      const johnsonTimer = setTimeout(() => {
        setJohnsonHighlighted(true);
      }, 1000);

      return () => clearTimeout(johnsonTimer);
    }
  }, [showStatement]);

  // Starmer highlights 3 seconds after Johnson's response
  useEffect(() => {
    if (johnsonResponse) {
      const starmerTimer = setTimeout(() => {
        setStarmerHighlighted(true);
      }, 3000);

      return () => clearTimeout(starmerTimer);
    }
  }, [johnsonResponse]);

  // Source button appears 3 seconds after Starmer's response
  useEffect(() => {
    if (starmerResponse) {
      const sourceTimer = setTimeout(() => {
        setShowSourceButton(true);
      }, 3000);

      return () => clearTimeout(sourceTimer);
    }
  }, [starmerResponse]);

  // Impact meter highlights 2 seconds after Van Weel feedback
  useEffect(() => {
    if (showVanWeelFeedback) {
      const impactTimer = setTimeout(() => {
        setImpactMeterHighlighted(true);
      }, 2000);

      return () => clearTimeout(impactTimer);
    }
  }, [showVanWeelFeedback]);

  // Statement 2: Show source button 1 second after statement 2 appears
  useEffect(() => {
    if (showStatement2) {
      const johnsonTimer = setTimeout(() => {
        setJohnsonHighlighted2(true);
      }, 3000); // 3 seconds after statement 2

      return () => clearTimeout(johnsonTimer);
    }
  }, [showStatement2]);

  // Statement 2: Starmer highlights 3 seconds after Johnson's response
  useEffect(() => {
    if (johnsonResponse2) {
      const starmerTimer = setTimeout(() => {
        setStarmerHighlighted2(true);
      }, 3000);

      return () => clearTimeout(starmerTimer);
    }
  }, [johnsonResponse2]);

  // Statement 2: Source button appears 2 seconds after Starmer's response
  useEffect(() => {
    if (starmerResponse2) {
      const sourceTimer = setTimeout(() => {
        setShowSourceButton2(true);
      }, 2000);

      return () => clearTimeout(sourceTimer);
    }
  }, [starmerResponse2]);

  // Statement 2: Impact meter highlights 2 seconds after Van Weel feedback 2 (after quiz)
  useEffect(() => {
    if (showVanWeelFeedback2 && currentStatement === 2 && showQuiz2 === false) {
      const impactTimer = setTimeout(() => {
        setImpactMeterHighlighted2(true);
      }, 2000);

      return () => clearTimeout(impactTimer);
    }
  }, [showVanWeelFeedback2, currentStatement, showQuiz2]);

  // Statement 3: Johnson highlights 3 seconds after statement 3
  useEffect(() => {
    if (showStatement3) {
      const johnsonTimer = setTimeout(() => {
        setJohnsonHighlighted3(true);
      }, 3000);

      return () => clearTimeout(johnsonTimer);
    }
  }, [showStatement3]);

  // Statement 3: Starmer highlights 3 seconds after Johnson's response
  useEffect(() => {
    if (johnsonResponse3) {
      const starmerTimer = setTimeout(() => {
        setStarmerHighlighted3(true);
      }, 3000);

      return () => clearTimeout(starmerTimer);
    }
  }, [johnsonResponse3]);

  // Statement 3: Source button appears 2 seconds after Starmer's response
  useEffect(() => {
    if (starmerResponse3) {
      const sourceTimer = setTimeout(() => {
        setShowSourceButton3(true);
      }, 2000);

      return () => clearTimeout(sourceTimer);
    }
  }, [starmerResponse3]);

  // Statement 3: Impact meter highlights 2 seconds after Van Weel feedback 3 (after quiz)
  useEffect(() => {
    if (showVanWeelFeedback3 && currentStatement === 3 && showQuiz3 === false) {
      const impactTimer = setTimeout(() => {
        setImpactMeterHighlighted3(true);
      }, 2000);

      return () => clearTimeout(impactTimer);
    }
  }, [showVanWeelFeedback3, currentStatement, showQuiz3]);

  const texts = [
    "Van Weel: Gezellig om jullie, Boris Johnson en Keir Starmer, te ontmoeten in een traditionele pub.",
    "Van Weel: Nu het vijf jaar geleden is, wil ik het met jullie hebben over de gevolgen van de Brexit. Maar eerst: stel uzelf even voor.",
    "Johnson: Hallo, van 2019 tot en met 2022 — tijdens de Brexit — was ik premier van het VK. Ik was een uitgesproken voorstander en vond dat het VK beter af zou zijn buiten de EU: meer controle over eigen wetten en grenzen, en nieuwe handelsmogelijkheden buiten Europa.",
    "Starmer: Hallo, sinds 2020 ben ik leider van de Labour Party en sinds 2024 premier van het Verenigd Koninkrijk. Ik was kritisch over Brexit en waarschuwde steeds voor de economische nadelen: meer handelsbarrières, minder investeringen en economische schade voor het VK.",
    "Van Weel: Bedankt voor jullie introductie. Zo werkt het spel: ik geef telkens een stelling, jullie reageren erop, en de leerlingen thuis krijgen een bron om te checken wat daadwerkelijk waar is.",
    "Door de juiste optie te kiezen laat de impactmeter zien of Brexit meer economische impact had voor het VK of de EU. Hier is de eerste stelling."
  ];

  const handleNext = () => {
    if (currentText < texts.length - 1) {
      const nextPosition = getBubblePosition(currentText + 1);
      setCurrentText(currentText + 1);
      // Only increment key (trigger poof) if position changes
      if (nextPosition !== currentPosition) {
        setSpeechBubbleKey(prev => prev + 1);
      }
      setPreviousPosition(currentPosition);
    } else {
      // Last text - don't show alert yet
    }
  };

  const handleShowStatement = () => {
    setShowSpeechBubble(false);
    setTimeout(() => {
      setShowStatement(true);
    }, 300);
  };

  const handleJohnsonClick = () => {
    if (johnsonHighlighted) {
      setJohnsonHighlighted(false);
      setJohnsonResponse(true);
    }
  };

  const handleStarmerClick = () => {
    if (starmerHighlighted) {
      setStarmerHighlighted(false);
      setStarmerResponse(true);
    }
  };

  const handleToggleArticle = () => {
    if (showArticle) {
      // Hide article and show quiz. De bron is nu beoordeeld: verberg de
      // knop voor de rest van deze stelling, anders kan de bron opnieuw
      // geopend worden terwijl de quiz (of het feedback/impactmeter-
      // gedeelte) al bezig is.
      setShowArticle(false);
      setShowQuiz(true);
      setShowSourceButton(false);
    } else {
      // Hide response bubbles when article opens
      setJohnsonResponse(false);
      setStarmerResponse(false);
      setShowArticle(true);
    }
  };

  const handleAnswerClick = (answer) => {
    const isStatement2 = currentStatement === 2;
    const isStatement3 = currentStatement === 3;
    
    if (isStatement3) {
      setSelectedAnswer3(answer);
    } else if (isStatement2) {
      setSelectedAnswer2(answer);
    } else {
      setSelectedAnswer(answer);
    }
    
    setTimeout(() => {
      if (answer === 'A') {
        // Correct answer
        if (isStatement3) {
          setShowQuiz3(false);
          setShowVanWeelFeedback3(true);
          setSelectedAnswer3(null);
        } else if (isStatement2) {
          setShowQuiz2(false);
          // Keep statement 2 visible, just show feedback
          setShowVanWeelFeedback2(true);
          setSelectedAnswer2(null);
        } else {
          setShowQuiz(false);
          setShowVanWeelFeedback(true);
          setSelectedAnswer(null);
        }
      } else {
        // Wrong answer - reset
        if (isStatement3) {
          setSelectedAnswer3(null);
        } else if (isStatement2) {
          setSelectedAnswer2(null);
        } else {
          setSelectedAnswer(null);
        }
      }
    }, 1000);
  };

  const handleJohnsonClick2 = () => {
    if (johnsonHighlighted2) {
      setJohnsonHighlighted2(false);
      setJohnsonResponse2(true);
    }
  };

  const handleStarmerClick2 = () => {
    if (starmerHighlighted2) {
      setStarmerHighlighted2(false);
      setStarmerResponse2(true);
    }
  };

  const handleToggleArticle2 = () => {
    if (showArticle2) {
      // Bron beoordeeld: knop blijft nu verborgen tot de volgende stelling
      setShowArticle2(false);
      setShowQuiz2(true);
      setShowSourceButton2(false);
    } else {
      setJohnsonResponse2(false);
      setStarmerResponse2(false);
      setShowArticle2(true);
    }
  };

  const handleImpactMeterClick = () => {
    if (impactMeterHighlighted && currentStatement === 1) {
      setImpactMeterHighlighted(false);
      setVkImpactFilled(2); // Fill first 2 boxes for VK
      setEuImpactFilled(1); // Fill first 1 box for EU
      // Hide statement 1 elements and show transition to statement 2
      setTimeout(() => {
        setShowStatement(false);
        setShowVanWeelFeedback(false);
        setCurrentStatement(2);
        // Show "Zo, op naar de tweede stelling" message
        setTimeout(() => {
          setShowTransitionToStatement2(true);
        }, 500);
      }, 500);
    } else if (impactMeterHighlighted2 && currentStatement === 2) {
      setImpactMeterHighlighted2(false);
      setVkImpactFilled(5); // Add 3 more boxes (total 5)
      setEuImpactFilled(1); // EU stays at 1
      // Hide statement 2 elements and show transition to statement 3
      setTimeout(() => {
        setShowStatement2(false);
        setShowVanWeelFeedback2(false);
        setCurrentStatement(3);
        // Show "Op naar stelling 3" message
        setTimeout(() => {
          setShowTransitionToStatement3(true);
        }, 500);
      }, 500);
    } else if (impactMeterHighlighted3 && currentStatement === 3) {
      setImpactMeterHighlighted3(false);
      setVkImpactFilled(7); // Add 2 more boxes (total 7)
      setEuImpactFilled(2); // Add 1 more box (total 2)
      // Hide statement 3 and source button, show ending sequence
      setTimeout(() => {
        setShowStatement3(false);
        setShowSourceButton3(false);
        setShowVanWeelFeedback3(false);
        setTimeout(() => {
          setShowEndingText1(true);
        }, 500);
      }, 500);
    }
  };

  const handleShowStatement2 = () => {
    setShowTransitionToStatement2(false);
    setTimeout(() => {
      setShowStatement2(true);
    }, 300);
  };

  const handleShowStatement3 = () => {
    setShowTransitionToStatement3(false);
    setTimeout(() => {
      setShowStatement3(true);
    }, 300);
  };

  const handleEndingNext1 = () => {
    setCharactersExiting(true);
    setTimeout(() => {
      setCharactersGone(true);
      setShowEndingText1(false);
      setTimeout(() => {
        setShowEndingText2(true);
        setEndingTextIndex(0);
      }, 500);
    }, 1000);
  };

  const handleEndingNext2 = () => {
    if (endingTextIndex === 0) {
      setEndingTextIndex(1);
    } else if (endingTextIndex === 1) {
      setEndingTextIndex(2);
      setShowMatrix(true);
      setShowDraggableOptions(true);
    }
  };

  const handleEndingPrev2 = () => {
    if (endingTextIndex === 2) {
      setEndingTextIndex(1);
      setShowMatrix(false);
      setShowDraggableOptions(false);
    } else if (endingTextIndex === 1) {
      setEndingTextIndex(0);
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (cell) => {
    if (draggedItem && cell === 'bottomLeft') {
      // Check if correct: ↑, ↑↑
      const isCorrect = draggedItem.vk === '↑' && draggedItem.eu === '↑↑';
      
      if (isCorrect) {
        setMatrixCells(prev => ({
          ...prev,
          bottomLeft: draggedItem
        }));
        setCellFlash('correct');
        setTimeout(() => {
          setCellFlash(null);
          setShowFinalText(true);
        }, 1000);
      } else {
        setCellFlash('incorrect');
        setTimeout(() => {
          setCellFlash(null);
        }, 1000);
      }
      setDraggedItem(null);
    }
  };

  const handleJohnsonClick3 = () => {
    if (johnsonHighlighted3) {
      setJohnsonHighlighted3(false);
      setJohnsonResponse3(true);
    }
  };

  const handleStarmerClick3 = () => {
    if (starmerHighlighted3) {
      setStarmerHighlighted3(false);
      setStarmerResponse3(true);
    }
  };

  const handleToggleArticle3 = () => {
    if (showArticle3) {
      // Bron beoordeeld: knop blijft nu verborgen tot het einde van het level
      setShowArticle3(false);
      setShowQuiz3(true);
      setShowSourceButton3(false);
    } else {
      setJohnsonResponse3(false);
      setStarmerResponse3(false);
      setShowArticle3(true);
    }
  };

  const handlePrev = () => {
    if (currentText > 0) {
      const prevPosition = getBubblePosition(currentText - 1);
      setCurrentText(currentText - 1);
      // Only increment key (trigger poof) if position changes
      if (prevPosition !== currentPosition) {
        setSpeechBubbleKey(prev => prev + 1);
      }
      setPreviousPosition(currentPosition);
    }
  };

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
          
          {/* Show definition based on which statement is visible */}
          {showStatement && (
            <p className="text-sm text-gray-800 leading-snug">
              <strong>Handelsbelemmeringen</strong> zijn regels, tarieven of procedures die handel tussen landen moeilijker of duurder maken. Denk aan invoerrechten, douanecontroles, of verschillende productstandaarden.
            </p>
          )}
          
          {showStatement2 && (
            <p className="text-sm text-gray-800 leading-snug">
              <strong>Het bbp</strong> is het aantal producten dat in een land per jaar geproduceerd wordt. Het wordt ook wel de omvang van een economie genoemd.
            </p>
          )}
          
          {showStatement3 && (
            <p className="text-sm text-gray-800 leading-snug">
              <strong>Bedrijfsinvesteringen</strong> zijn uitgaven van bedrijven aan bijvoorbeeld nieuwe machines, gebouwen, technologie of uitbreiding, met als doel in de toekomst meer te produceren of winst te maken.
            </p>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* English Pub Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
          {/* Wooden floor */}
          <rect x="0" y="500" width="1200" height="200" fill="#5D4E37" />
          
          {/* Back wall - dark green British pub color */}
          <rect x="0" y="0" width="1200" height="500" fill="#2C5234" />
          
          {/* Wainscoting - dark wood paneling */}
          <rect x="0" y="350" width="1200" height="150" fill="#3E2723" />
          <line x1="0" y1="420" x2="1200" y2="420" stroke="#2C1810" strokeWidth="3" />
          
          {/* Dartboard on left wall */}
          <circle cx="200" cy="240" r="40" fill="#1a1a1a" stroke="#C8A882" strokeWidth="3" />
          <circle cx="200" cy="240" r="35" fill="#E8E8E8" />
          <circle cx="200" cy="240" r="30" fill="#1a1a1a" />
          <circle cx="200" cy="240" r="20" fill="#DC143C" />
          <circle cx="200" cy="240" r="10" fill="#228B22" />
          <circle cx="200" cy="240" r="4" fill="#DC143C" />
          
          {/* British flag on right wall */}
          <rect x="950" y="180" width="120" height="80" fill="#012169" />
          <line x1="950" y1="180" x2="1070" y2="260" stroke="white" strokeWidth="16" />
          <line x1="1070" y1="180" x2="950" y2="260" stroke="white" strokeWidth="16" />
          <line x1="950" y1="180" x2="1070" y2="260" stroke="#C8102E" strokeWidth="8" />
          <line x1="1070" y1="180" x2="950" y2="260" stroke="#C8102E" strokeWidth="8" />
          <line x1="950" y1="220" x2="1070" y2="220" stroke="white" strokeWidth="24" />
          <line x1="1010" y1="180" x2="1010" y2="260" stroke="white" strokeWidth="40" />
          <line x1="950" y1="220" x2="1070" y2="220" stroke="#C8102E" strokeWidth="16" />
          <line x1="1010" y1="180" x2="1010" y2="260" stroke="#C8102E" strokeWidth="24" />
          
          {/* Bar in background - lowered more */}
          <rect x="320" y="360" width="560" height="120" fill="#654321" />
          <rect x="320" y="360" width="560" height="20" fill="#8B6F47" />
          
          {/* Beer taps */}
          <rect x="400" y="340" width="15" height="40" fill="#2C2C2C" rx="3" />
          <rect x="450" y="340" width="15" height="40" fill="#2C2C2C" rx="3" />
          <rect x="500" y="340" width="15" height="40" fill="#2C2C2C" rx="3" />
          
          {/* Bottles on bar shelves */}
          <rect x="340" y="390" width="12" height="35" fill="#228B22" />
          <rect x="360" y="390" width="12" height="35" fill="#8B4513" />
          <rect x="380" y="390" width="12" height="35" fill="#CD853F" />
          <rect x="600" y="390" width="12" height="35" fill="#228B22" />
          <rect x="620" y="390" width="12" height="35" fill="#8B4513" />
          <rect x="850" y="390" width="12" height="35" fill="#CD853F" />
          
          {/* Menu/Price List on middle wall */}
          <rect x="500" y="160" width="200" height="120" fill="#F5E6D3" stroke="#3E2723" strokeWidth="3" />
          <text x="600" y="185" fontSize="16" fontWeight="bold" fill="#3E2723" textAnchor="middle">Menu</text>
          <line x1="520" y1="195" x2="680" y2="195" stroke="#3E2723" strokeWidth="2" />
          <text x="530" y="220" fontSize="11" fill="#3E2723">Fish & Chips</text>
          <text x="670" y="220" fontSize="11" fill="#3E2723" textAnchor="end">£12.00</text>
          <text x="530" y="240" fontSize="11" fill="#3E2723">Shepherd's Pie</text>
          <text x="670" y="240" fontSize="11" fill="#3E2723" textAnchor="end">£10.50</text>
          <text x="530" y="260" fontSize="11" fill="#3E2723">Sunday Roast</text>
          <text x="670" y="260" fontSize="11" fill="#3E2723" textAnchor="end">£14.00</text>
        </svg>
        
        {/* Table and beers - separate layer in front of characters */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" style={{zIndex: 15}}>
          {/* Long wooden table in foreground */}
          <ellipse cx="600" cy="480" rx="450" ry="40" fill="#3E2723" />
          <rect x="150" y="440" width="900" height="40" fill="#5D4E37" />
          <rect x="150" y="438" width="900" height="5" fill="#6B5D4F" />
          
          {/* Beer glasses on table - with foam */}
          {/* Johnson's beer - left */}
          <ellipse cx="200" cy="445" rx="18" ry="8" fill="#D4A574" />
          <rect x="182" y="410" width="36" height="35" fill="#F4C430" opacity="0.8" />
          <ellipse cx="200" cy="410" rx="18" ry="8" fill="#E8B020" />
          {/* Foam head */}
          <ellipse cx="200" cy="408" rx="19" ry="6" fill="#FFFEF0" />
          <ellipse cx="200" cy="405" rx="18" ry="5" fill="white" />
          
          {/* Van Weel's beer - middle */}
          <ellipse cx="600" cy="445" rx="18" ry="8" fill="#D4A574" />
          <rect x="582" y="410" width="36" height="35" fill="#F4C430" opacity="0.8" />
          <ellipse cx="600" cy="410" rx="18" ry="8" fill="#E8B020" />
          {/* Foam head */}
          <ellipse cx="600" cy="408" rx="19" ry="6" fill="#FFFEF0" />
          <ellipse cx="600" cy="405" rx="18" ry="5" fill="white" />
          
          {/* Starmer's beer - right */}
          <ellipse cx="1000" cy="445" rx="18" ry="8" fill="#D4A574" />
          <rect x="982" y="410" width="36" height="35" fill="#F4C430" opacity="0.8" />
          <ellipse cx="1000" cy="410" rx="18" ry="8" fill="#E8B020" />
          {/* Foam head */}
          <ellipse cx="1000" cy="408" rx="19" ry="6" fill="#FFFEF0" />
          <ellipse cx="1000" cy="405" rx="18" ry="5" fill="white" />
        </svg>

        {/* Boris Johnson - left side of table, smaller */}
        {!charactersGone && (
          <div 
            className={`absolute ${(johnsonHighlighted || johnsonHighlighted2 || johnsonHighlighted3) ? 'cursor-pointer animate-pulse-glow' : ''} ${charactersExiting ? 'slide-out-left' : ''}`}
            style={{
              left: '8%', 
              bottom: '150px', 
              zIndex: 10
            }}
            onClick={() => {
              handleJohnsonClick();
              handleJohnsonClick2();
              handleJohnsonClick3();
            }}
          >
          <svg width="220" height="320" viewBox="0 0 300 420">
            <g>
              {/* Bar stool */}
              <ellipse cx="157.5" cy="405" rx="45" ry="12" fill="#4A3728" />
              <rect x="150" y="350" width="15" height="55" fill="#5D4E37" />
              <ellipse cx="157.5" cy="350" rx="35" ry="10" fill="#6B5D4F" />
              <rect x="140" y="400" width="10" height="15" fill="#5D4E37" />
              <rect x="165" y="400" width="10" height="15" fill="#5D4E37" />
              
              {/* Legs */}
              <rect x="130" y="310" width="30" height="90" fill="#1a1a3e" />
              <rect x="155" y="310" width="30" height="90" fill="#1a1a3e" />
              <ellipse cx="145" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              <ellipse cx="170" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              
              {/* Body */}
              <rect x="125" y="210" width="65" height="100" fill="white" />
              <path d="M 125 210 L 130 240 L 135 280 L 135 310 L 125 310 L 125 210" fill="#1a1a3e" />
              <path d="M 190 210 L 185 240 L 180 280 L 180 310 L 190 310 L 190 210" fill="#1a1a3e" />
              <path d="M 125 210 L 135 215 L 140 210" fill="#1a1a3e" />
              <path d="M 190 210 L 180 215 L 175 210" fill="#1a1a3e" />
              <path d="M 140 205 L 157.5 210 L 175 205 L 173 217 L 157.5 222 L 142 217 Z" fill="white" />
              <path d="M 157.5 210 L 152 252 L 157.5 295 L 163 252 Z" fill="#4A90E2" />
              <path d="M 157.5 210 L 154 215 L 157.5 220 L 161 215 Z" fill="#3570B8" />
              <circle cx="135" cy="250" r="3" fill="#2F2F2F" />
              <circle cx="180" cy="250" r="3" fill="#2F2F2F" />
              
              {/* Arms */}
              <rect x="100" y="220" width="25" height="90" fill="#1a1a3e" rx="8" />
              <rect x="190" y="220" width="25" height="90" fill="#1a1a3e" rx="8" />
              <rect x="100" y="300" width="25" height="15" fill="white" />
              <rect x="190" y="300" width="25" height="15" fill="white" />
              <ellipse cx="112.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="185" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - slightly rounder, older */}
              <ellipse cx="157.5" cy="150" rx="52" ry="56" fill="#F5D5C0" />
              
              {/* Simple messy blonde hair - Boris style, hairline above eyebrows */}
              
              {/* Main hair mass - hairline just above eyebrows (eyebrows at y≈126-132) */}
              <ellipse cx="157.5" cy="95" rx="58" ry="23" fill="#F4D896" />
              
              {/* Side hair coverage - fuller */}
              <ellipse cx="105" cy="115" rx="18" ry="22" fill="#F4D896" />
              <ellipse cx="210" cy="115" rx="18" ry="22" fill="#F4D896" />
              
              {/* Ears */}
              <ellipse cx="105.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="209.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="107.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              <ellipse cx="207.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              
              {/* Eyes - blue, tilted */}
              {/* Left eye: higher on right, lower on left */}
              <ellipse cx="132.5" cy="145" rx="11" ry="12" fill="white" transform="rotate(-8 132.5 145)" />
              <circle cx="132.5" cy="147" r="7" fill="#4A90E2" />
              <circle cx="134" cy="144" r="3" fill="white" />
              
              {/* Right eye: higher on left, lower on right */}
              <ellipse cx="182.5" cy="145" rx="11" ry="12" fill="white" transform="rotate(8 182.5 145)" />
              <circle cx="182.5" cy="147" r="7" fill="#4A90E2" />
              <circle cx="184" cy="144" r="3" fill="white" />
              
              {/* Thick bags under eyes */}
              <path d="M 123 152 Q 132.5 158 142 152" stroke="#C4A48A" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
              <path d="M 173 152 Q 182.5 158 192 152" stroke="#C4A48A" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
              
              {/* Additional bag detail - darker shadow */}
              <path d="M 125 153 Q 132.5 156 140 153" stroke="#B8956A" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
              <path d="M 175 153 Q 182.5 156 190 153" stroke="#B8956A" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
              
              {/* Eyebrows - lighter */}
              <path d="M 118 131 Q 132.5 126 145 132" stroke="#C8B090" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 170 132 Q 182.5 126 197 131" stroke="#C8B090" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Nose - prominent */}
              <path d="M 157.5 152 L 151 166 L 157.5 170 L 164 166 Z" fill="#E8C4A8" />
              <ellipse cx="151" cy="167" rx="4" ry="5" fill="#D4B49A" opacity="0.6" />
              <ellipse cx="164" cy="167" rx="4" ry="5" fill="#D4B49A" opacity="0.6" />
              
              {/* Some wrinkles for age */}
              <path d="M 120 165 Q 125 167 130 165" stroke="#D4B49A" strokeWidth="1" fill="none" opacity="0.4" />
              <path d="M 185 165 Q 190 167 195 165" stroke="#D4B49A" strokeWidth="1" fill="none" opacity="0.4" />
              
              {/* Smile */}
              <path d="M 130 178 Q 157.5 188 185 178" stroke="#A0522D" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        )}

        {/* David van Weel - middle of table, smaller */}
        <div className="absolute" style={{left: '50%', transform: 'translateX(-50%)', bottom: '150px', zIndex: 10}}>
          <svg width="220" height="320" viewBox="0 0 300 420">
            <g>
              {/* Bar stool */}
              <ellipse cx="157.5" cy="405" rx="45" ry="12" fill="#4A3728" />
              <rect x="150" y="350" width="15" height="55" fill="#5D4E37" />
              <ellipse cx="157.5" cy="350" rx="35" ry="10" fill="#6B5D4F" />
              <rect x="140" y="400" width="10" height="15" fill="#5D4E37" />
              <rect x="165" y="400" width="10" height="15" fill="#5D4E37" />
              
              {/* Legs */}
              <rect x="130" y="310" width="30" height="90" fill="#3F3F3F" />
              <rect x="155" y="310" width="30" height="90" fill="#3F3F3F" />
              <ellipse cx="145" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              <ellipse cx="170" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              
              {/* Body */}
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
              
              {/* Arms */}
              <rect x="100" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
              <rect x="190" y="220" width="25" height="90" fill="#3F3F3F" rx="8" />
              <rect x="100" y="300" width="25" height="15" fill="white" />
              <rect x="190" y="300" width="25" height="15" fill="white" />
              <ellipse cx="112.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="185" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head */}
              <ellipse cx="157.5" cy="150" rx="50" ry="54" fill="#F5D5C0" />
              
              {/* Hair - with receding hairline (inhammen) */}
              <path d="M 107.5 140 Q 105.5 92 157.5 80 Q 209.5 92 207.5 140 Q 207.5 156 201.5 162 L 195.5 148 Q 191.5 98 157.5 93 Q 123.5 98 119.5 148 L 113.5 162 Q 107.5 156 107.5 140" fill="#A67C52" />
              
              {/* Receding hairline - inhammen (temples) - oval shaped like other levels */}
              <path d="M 117.5 118 Q 137.5 100 157.5 96 Q 177.5 100 197.5 118" stroke="#A67C52" strokeWidth="2" fill="none" />
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

        {/* Keir Starmer - right side behind table, smaller */}
        {!charactersGone && (
          <div 
            className={`absolute ${(starmerHighlighted || starmerHighlighted2 || starmerHighlighted3) ? 'cursor-pointer animate-pulse-glow' : ''} ${charactersExiting ? 'slide-out-right' : ''}`}
            style={{
              right: '8%', 
              bottom: '150px', 
              zIndex: 10
            }}
            onClick={() => {
              handleStarmerClick();
              handleStarmerClick2();
              handleStarmerClick3();
            }}
          >
          <svg width="220" height="320" viewBox="0 0 300 420">
            <g>
              {/* Bar stool */}
              <ellipse cx="157.5" cy="405" rx="45" ry="12" fill="#4A3728" />
              <rect x="150" y="350" width="15" height="55" fill="#5D4E37" />
              <ellipse cx="157.5" cy="350" rx="35" ry="10" fill="#6B5D4F" />
              <rect x="140" y="400" width="10" height="15" fill="#5D4E37" />
              <rect x="165" y="400" width="10" height="15" fill="#5D4E37" />
              
              {/* Legs */}
              <rect x="130" y="310" width="30" height="90" fill="#1a1a1a" />
              <rect x="155" y="310" width="30" height="90" fill="#1a1a1a" />
              <ellipse cx="145" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              <ellipse cx="170" cy="405" rx="18" ry="8" fill="#1a1a1a" />
              
              {/* Body */}
              <rect x="125" y="210" width="65" height="100" fill="white" />
              <path d="M 125 210 L 130 240 L 135 280 L 135 310 L 125 310 L 125 210" fill="#1a1a1a" />
              <path d="M 190 210 L 185 240 L 180 280 L 180 310 L 190 310 L 190 210" fill="#1a1a1a" />
              <path d="M 125 210 L 135 215 L 140 210" fill="#1a1a1a" />
              <path d="M 190 210 L 180 215 L 175 210" fill="#1a1a1a" />
              <path d="M 140 205 L 157.5 210 L 175 205 L 173 217 L 157.5 222 L 142 217 Z" fill="white" />
              <path d="M 157.5 210 L 152 252 L 157.5 295 L 163 252 Z" fill="#8B0000" />
              <path d="M 157.5 210 L 154 215 L 157.5 220 L 161 215 Z" fill="#6B0000" />
              <circle cx="135" cy="250" r="3" fill="#2F2F2F" />
              <circle cx="180" cy="250" r="3" fill="#2F2F2F" />
              
              {/* Arms */}
              <rect x="100" y="220" width="25" height="90" fill="#1a1a1a" rx="8" />
              <rect x="190" y="220" width="25" height="90" fill="#1a1a1a" rx="8" />
              <rect x="100" y="300" width="25" height="15" fill="white" />
              <rect x="190" y="300" width="25" height="15" fill="white" />
              <ellipse cx="112.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              <ellipse cx="202.5" cy="322" rx="14" ry="17" fill="#F5D5C0" />
              
              {/* Neck */}
              <rect x="147.5" y="185" width="20" height="27" fill="#F5D5C0" />
              
              {/* Head - more angular */}
              <ellipse cx="157.5" cy="150" rx="48" ry="52" fill="#F5D5C0" />
              
              {/* Hair - grey/silver, neatly combed - sits on head */}
              <path d="M 109.5 140 Q 107.5 95 157.5 85 Q 207.5 95 205.5 140 L 205.5 150 Q 200 145 195 140 Q 190 125 180 115 Q 157.5 100 157.5 100 Q 135 100 120 115 Q 115 125 110 140 Q 109.5 145 109.5 150 Z" fill="#A8A8A8" />
              {/* Side part - neat combed hair */}
              <path d="M 135 110 Q 145 100 157.5 97" stroke="#8C8C8C" strokeWidth="2" fill="none" />
              <path d="M 135 115 Q 148 105 165 100" stroke="#8C8C8C" strokeWidth="2" fill="none" />
              <path d="M 130 120 Q 145 112 165 108" stroke="#8C8C8C" strokeWidth="1.5" fill="none" opacity="0.7" />
              
              {/* Ears */}
              <ellipse cx="109.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="205.5" cy="150" rx="10" ry="15" fill="#F5D5C0" />
              <ellipse cx="111.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              <ellipse cx="203.5" cy="150" rx="5" ry="8" fill="#E8C4A8" />
              
              {/* Black-framed glasses */}
              <rect x="121" y="140" width="28" height="22" fill="none" stroke="#1a1a1a" strokeWidth="3" rx="3" />
              <rect x="166.5" y="140" width="28" height="22" fill="none" stroke="#1a1a1a" strokeWidth="3" rx="3" />
              <line x1="149" y1="151" x2="166.5" y2="151" stroke="#1a1a1a" strokeWidth="3" />
              
              {/* Eyes behind glasses */}
              <ellipse cx="135" cy="150" rx="9" ry="10" fill="white" />
              <ellipse cx="180.5" cy="150" rx="9" ry="10" fill="white" />
              <circle cx="135" cy="152" r="6" fill="#5D4E37" />
              <circle cx="180.5" cy="152" r="6" fill="#5D4E37" />
              <circle cx="136.5" cy="150" r="2.5" fill="white" />
              <circle cx="182" cy="150" r="2.5" fill="white" />
              
              {/* Eyebrows - darker, neat */}
              <path d="M 121 133 Q 135 129 147 132" stroke="#6C6C6C" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 168 132 Q 180.5 129 194.5 133" stroke="#6C6C6C" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Nose */}
              <path d="M 157.5 153 L 151.5 165 L 157.5 169 L 163.5 165 Z" fill="#E8C4A8" />
              <ellipse cx="151.5" cy="166" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              <ellipse cx="163.5" cy="166" rx="3.5" ry="4.5" fill="#D4B49A" opacity="0.6" />
              
              {/* Serious/neutral expression */}
              <path d="M 131 177 L 184 177" stroke="#A0522D" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        )}

        {/* Speech Bubbles - All positions always rendered with inline display control */}
        
        {/* Center bubble - for texts 0, 1, 4, 5 */}
        <div 
          style={{
            position: 'absolute',
            top: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '32rem',
            zIndex: 20,
            display: (showSpeechBubble && currentPosition === 'center') ? 'block' : 'none'
          }}
          className="animate-poof-center"
          key={currentPosition === 'center' ? `center-${speechBubbleKey}` : 'center'}
        >
          <div className="relative bg-white rounded-2xl px-8 py-6 shadow-2xl border-4 border-gray-800">
            <p className="text-base text-gray-800 leading-snug font-sans" style={{whiteSpace: 'pre-line'}}>
              {renderTextWithBoldNames(texts[currentText])}
            </p>
            <div className="flex justify-between items-center mt-4">
              {currentText > 0 ? (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Vorige
                </button>
              ) : (
                <div className="w-20"></div>
              )}

              <div className="w-16"></div>

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
                  onClick={handleShowStatement}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-lg font-bold"
                >
                  Stelling 1
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Left bubble - for text 2 (Johnson) */}
        <div 
          style={{
            position: 'absolute',
            top: '2rem',
            left: '8%',
            maxWidth: '32rem',
            zIndex: 20,
            display: (showSpeechBubble && currentPosition === 'left') ? 'block' : 'none'
          }}
          className="animate-poof-left"
          key={currentPosition === 'left' ? `left-${speechBubbleKey}` : 'left'}
        >
          <div className="relative bg-white rounded-2xl px-8 py-6 shadow-2xl border-4 border-gray-800">
            <p className="text-base text-gray-800 leading-snug font-sans" style={{whiteSpace: 'pre-line'}}>
              {renderTextWithBoldNames(texts[currentText])}
            </p>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Vorige
              </button>

              <div className="w-16"></div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
              >
                Volgende
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right bubble - for text 3 (Starmer) */}
        <div 
          style={{
            position: 'absolute',
            top: '2rem',
            right: '8%',
            maxWidth: '32rem',
            zIndex: 20,
            display: (showSpeechBubble && currentPosition === 'right') ? 'block' : 'none'
          }}
          className="animate-poof-right"
          key={currentPosition === 'right' ? `right-${speechBubbleKey}` : 'right'}
        >
          <div className="relative bg-white rounded-2xl px-8 py-6 shadow-2xl border-4 border-gray-800">
            <p className="text-base text-gray-800 leading-snug font-sans" style={{whiteSpace: 'pre-line'}}>
              {renderTextWithBoldNames(texts[currentText])}
            </p>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Vorige
              </button>

              <div className="w-16"></div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
              >
                Volgende
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Johnson Response Bubble - appears above his head */}
        {johnsonResponse && currentStatement === 1 && (
          <div 
            className="absolute animate-poof-left"
            style={{left: '8%', bottom: '420px', zIndex: 25}}
            key="johnson-response"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-xs">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Johnson:</strong> "Dat klopt niet — Britse bedrijven handelen nog steeds vrij met Europa en hebben nieuwe wereldwijde kansen gekregen."
              </p>
            </div>
          </div>
        )}
        {johnsonResponse2 && currentStatement === 2 && (
          <div 
            className="absolute animate-poof-left"
            style={{left: '8%', bottom: '420px', zIndex: 25}}
            key="johnson-response-2"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-xs">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Johnson:</strong> Veel van onze economische problemen komen door COVID en de energiecrisis, niet door Brexit.
              </p>
            </div>
          </div>
        )}

        {/* Starmer Response Bubble - appears above his head */}
        {starmerResponse && currentStatement === 1 && (
          <div 
            className="absolute animate-poof-right"
            style={{right: '8%', bottom: '420px', zIndex: 25}}
            key="starmer-response"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-xs">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Starmer:</strong> Er zijn duidelijk extra handelskosten en papierwerk voor Britse exporteurs bijgekomen, wat de handel bemoeilijkt.
              </p>
            </div>
          </div>
        )}
        {starmerResponse2 && currentStatement === 2 && (
          <div 
            className="absolute animate-poof-right"
            style={{right: '8%', bottom: '420px', zIndex: 25}}
            key="starmer-response-2"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-xs">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Starmer:</strong> Hoewel andere factoren meespelen, wijzen de meeste studies op een negatief Brexit-effect op het Britse bbp.
              </p>
            </div>
          </div>
        )}

        {/* Johnson Response Bubble 3 - appears above his head */}
        {johnsonResponse3 && currentStatement === 3 && (
          <div 
            className="absolute animate-poof-left"
            style={{left: '8%', bottom: '420px', zIndex: 25}}
            key="johnson-response-3"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-xs">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Johnson:</strong> Investeringsschommelingen komen door wereldwijde onzekerheid, niet door Brexit. Zo lopen we in het VK juist voorop bij de ontwikkeling van kweekvlees — onder EU-regels had dat niet gekund.
              </p>
            </div>
          </div>
        )}

        {/* Starmer Response Bubble 3 - appears above his head */}
        {starmerResponse3 && currentStatement === 3 && (
          <div 
            className="absolute animate-poof-right"
            style={{right: '8%', bottom: '420px', zIndex: 25}}
            key="starmer-response-3"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-xs">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Starmer:</strong> Veel analyses wijzen erop dat Brexit een rem zette op investeringen in het VK.
              </p>
            </div>
          </div>
        )}

        {/* Statement - appears under the beers when showStatement is true */}
        {showStatement && (
          <div className="absolute bottom-48 left-1/2 transform -translate-x-1/2 z-20 max-w-3xl">
            <div className="bg-gray-800 bg-opacity-90 rounded-xl px-6 py-3 shadow-2xl">
              <p className="text-white text-base leading-relaxed font-sans text-center">
                Sinds Brexit ondervindt het Verenigd Koninkrijk meer{' '}
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="font-bold underline text-white hover:text-blue-300 transition-colors"
                >
                  handelsbelemmeringen
                </button>
                {' '}met de EU dan vóór het vertrek.
              </p>
            </div>
          </div>
        )}

        {/* Statement 2 - appears under the beers */}
        {showStatement2 && (
          <div className="absolute bottom-48 left-1/2 transform -translate-x-1/2 z-20 max-w-3xl">
            <div className="bg-gray-800 bg-opacity-90 rounded-xl px-6 py-3 shadow-2xl">
              <p className="text-white text-base leading-relaxed font-sans text-center">
                De meeste economische analyses laten zien dat het Britse{' '}
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="font-bold underline text-white hover:text-blue-300 transition-colors"
                >
                  bbp
                </button>
                {' '}op lange termijn lager uitvalt door Brexit.
              </p>
            </div>
          </div>
        )}

        {/* Statement 3 - appears under the beers */}
        {showStatement3 && (
          <div className="absolute bottom-48 left-1/2 transform -translate-x-1/2 z-20 max-w-3xl">
            <div className="bg-gray-800 bg-opacity-90 rounded-xl px-6 py-3 shadow-2xl">
              <p className="text-white text-base leading-relaxed font-sans text-center">
                Na Brexit groeiden de{' '}
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="font-bold underline text-white hover:text-blue-300 transition-colors"
                >
                  bedrijfsinvesteringen
                </button>
                {' '}in het Verenigd Koninkrijk trager dan in vergelijkbare economieën.
              </p>
            </div>
          </div>
        )}

        {/* Impact Meter - appears bottom left when statement shows */}
        {impactMeterVisible && (
          <div 
            className={`absolute bottom-8 left-8 z-20 ${(impactMeterHighlighted || impactMeterHighlighted2 || impactMeterHighlighted3) ? 'cursor-pointer animate-pulse-glow' : ''}`}
            onClick={handleImpactMeterClick}
          >
            <div className="bg-white bg-opacity-90 rounded-lg px-4 py-3 shadow-xl border-2 border-gray-800">
              {/* VK Impact */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-gray-800" style={{width: '80px'}}>Impact VK</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={`vk-${i}`}
                      className="w-5 h-5 border-2 border-gray-800"
                      style={{
                        backgroundColor: i < vkImpactFilled ? getImpactColor(i) : 'white'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* EU Impact */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-800" style={{width: '80px'}}>Impact EU</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={`eu-${i}`}
                      className="w-5 h-5 border-2 border-gray-800"
                      style={{
                        backgroundColor: i < euImpactFilled ? getImpactColor(i) : 'white'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opbrengsten box - appears to the right of screen */}
        {showDraggableOptions && !showFinalText && (
          <div className="absolute right-8 z-20" style={{bottom: '8px'}}>
            <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-gray-800">
              <h3 className="text-lg font-bold text-center mb-3 text-gray-800">Opbrengsten</h3>
              <div className="flex flex-col gap-2">
                {payoffOptions.map((option, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleDragStart(option)}
                    className="p-2 bg-blue-100 border-2 border-blue-400 rounded cursor-move hover:bg-blue-200 text-center"
                  >
                    <span className="text-sm">{option.vk}, {option.eu}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Opbrengstenmatrix - centered between impact meter and draggable options */}
        {showMatrix && (
          <div className="absolute z-20 left-1/2 transform -translate-x-1/2" style={{bottom: '8px'}}>
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
                    {/* Row 1: VK - Meer EU-integratie */}
                    <div className="flex gap-2 items-center">
                      <div className="px-2 py-1 rounded w-28 text-center font-semibold text-xs text-gray-700">Meer EU-integratie</div>
                      {/* Top-left cell - pre-filled, normal border */}
                      <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50 flex items-center justify-center">
                        <span className="text-xs">↑↑↑, ↑↑↑</span>
                      </div>
                      {/* Top-right cell - empty */}
                      <div className="w-32 h-8 border-2 border-gray-400 rounded bg-gray-50 flex items-center justify-center">
                        <span className="text-xs text-gray-300">___</span>
                      </div>
                    </div>
                    
                    {/* Row 2: VK - Huidig beleid */}
                    <div className="flex gap-2 items-center">
                      <div className="px-2 py-1 rounded w-28 text-center font-semibold text-xs text-gray-700">Huidig beleid</div>
                      {/* Bottom-left cell - draggable with thick border */}
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop('bottomLeft')}
                        className={`w-32 h-8 border-2 rounded flex items-center justify-center transition-all ${
                          cellFlash === 'correct' ? 'border-green-500 bg-green-50 border-4' :
                          cellFlash === 'incorrect' ? 'border-red-500 bg-red-50 border-4' :
                          matrixCells.bottomLeft ? 'border-green-500 bg-green-50 border-4' :
                          'border-gray-800 bg-white hover:border-blue-500 hover:bg-blue-50 border-4'
                        }`}
                      >
                        <span className="text-xs">{matrixCells.bottomLeft ? `${matrixCells.bottomLeft.vk}, ${matrixCells.bottomLeft.eu}` : '___'}</span>
                      </div>
                      {/* Bottom-right cell - fixed ↓, ↓ */}
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

        {/* Source Evaluation Button - appears bottom right */}
        {(showSourceButton && currentStatement === 1) && (
          <div className="absolute bottom-8 right-8 z-20">
            <button
              onClick={handleToggleArticle}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
            >
              {showArticle ? 'Sluit de bron' : 'Beoordeel de bron'}
            </button>
          </div>
        )}
        {(showSourceButton2 && currentStatement === 2) && (
          <div className="absolute bottom-8 right-8 z-20">
            <button
              onClick={handleToggleArticle2}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
            >
              {showArticle2 ? 'Sluit de bron' : 'Beoordeel de bron'}
            </button>
          </div>
        )}
        {(showSourceButton3 && currentStatement === 3) && (
          <div className="absolute bottom-8 right-8 z-20">
            <button
              onClick={handleToggleArticle3}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
            >
              {showArticle3 ? 'Sluit de bron' : 'Beoordeel de bron'}
            </button>
          </div>
        )}

        {/* Article - appears above the button */}
        {showArticle && (
          <div 
            className="absolute bottom-24 right-8 z-50 max-w-lg cursor-pointer"
            onClick={handleToggleArticle}
          >
            <div className="bg-white rounded-lg p-6 shadow-2xl border-2 border-gray-800">
              {/* OBR Logo */}
              <div className="mb-4 bg-blue-500 p-4 rounded">
                <h2 className="text-white text-2xl font-bold">Office for</h2>
                <h2 className="text-white text-4xl font-bold">Budget</h2>
                <h2 className="text-white text-4xl font-bold">Responsibility</h2>
              </div>
              
              {/* Article Title */}
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Brexit heeft geleid tot een blijvende vermindering van de handelsintensiteit van het VK
              </h3>
              
              {/* Article Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Brexit leidde tot een daling van 15% in de handelsintensiteit tussen VK en EU, door meer administratieve lasten en douanecontroles. De economische schade voor het VK is aanzienlijk groter dan voor EU-lidstaten.
              </p>
            </div>
          </div>
        )}

        {/* Article 2 - appears above the button */}
        {showArticle2 && currentStatement === 2 && (
          <div 
            className="absolute bottom-24 right-8 z-50 max-w-lg cursor-pointer"
            onClick={handleToggleArticle2}
          >
            <div className="bg-white rounded-lg p-6 shadow-2xl border-2 border-gray-800">
              {/* CEP Logo */}
              <div className="mb-4 bg-gray-700 p-4 rounded flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">C</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">centre for</h2>
                  <h2 className="text-white text-2xl font-bold">Economic</h2>
                  <h2 className="text-white text-2xl font-bold">Performance</h2>
                </div>
              </div>
              
              {/* Article Title */}
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Brexit zal het Britse bbp op de lange termijn enkele procenten lager maken dan anders
              </h3>
              
              {/* Article Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Brexit maakt het Britse bbp op lange termijn 2-3% lager, door minder handel en buitenlandse investeringen. Dit effect is structureel door de permanente handelsbarrières. Andere factoren spelen mee, maar Brexit is de belangrijkste oorzaak.
              </p>
            </div>
          </div>
        )}

        {/* Article 3 - Bank of England */}
        {showArticle3 && currentStatement === 3 && (
          <div 
            className="absolute bottom-24 right-8 z-50 max-w-lg cursor-pointer"
            onClick={handleToggleArticle3}
          >
            <div className="bg-white rounded-lg p-6 shadow-2xl border-2 border-gray-800">
              {/* Bank of England Logo - text only */}
              <div className="mb-4 bg-white p-4 rounded border-2 border-gray-300">
                <h2 className="text-gray-800 text-3xl font-bold tracking-wider text-center" style={{letterSpacing: '0.1em'}}>BANK OF ENGLAND</h2>
              </div>
              
              {/* Article Title */}
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Onzekerheid en investeringen in het VK na het EU-referendum
              </h3>
              
              {/* Article Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Bedrijfsinvesteringen in het VK groeiden sinds Brexit trager dan in vergelijkbare economieën door onzekerheid over toekomstige handelsrelaties, en ook EU-bedrijven stelden investeringen in het VK uit.
              </p>
            </div>
          </div>
        )}

        {/* Multiple Choice Quiz - appears bottom center-right */}
        {showQuiz && (
          <div className="absolute bottom-8 left-1/2 z-40" style={{maxWidth: '420px', transform: 'translateX(-37%)'}}>
            <div className="bg-white rounded-xl p-5 shadow-2xl border-4 border-gray-800">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Wat zegt dit bewijs over de economische impact van Brexit?
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleAnswerClick('A')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer === 'A' 
                      ? 'border-green-600 bg-green-50' 
                      : selectedAnswer && selectedAnswer !== 'A'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">A.</span> Vooral het VK ondervindt negatieve gevolgen
                </button>
                <button 
                  onClick={() => handleAnswerClick('B')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer === 'B' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer && selectedAnswer !== 'B'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">B.</span> Vooral de EU ondervindt negatieve gevolgen
                </button>
                <button 
                  onClick={() => handleAnswerClick('C')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer === 'C' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer && selectedAnswer !== 'C'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">C.</span> Het VK en de EU worden ongeveer even hard geraakt
                </button>
                <button 
                  onClick={() => handleAnswerClick('D')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer === 'D' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer && selectedAnswer !== 'D'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">D.</span> Er is geen duidelijk economisch effect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Choice Quiz 2 - for statement 2 */}
        {showQuiz2 && currentStatement === 2 && (
          <div className="absolute bottom-8 left-1/2 z-40" style={{maxWidth: '420px', transform: 'translateX(-37%)'}}>
            <div className="bg-white rounded-xl p-5 shadow-2xl border-4 border-gray-800">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Wat volgt het best uit deze economische analyses?
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleAnswerClick('A')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer2 === 'A' 
                      ? 'border-green-600 bg-green-50' 
                      : selectedAnswer2 && selectedAnswer2 !== 'A'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">A.</span> Het VK heeft economische schade ondervonden door Brexit
                </button>
                <button 
                  onClick={() => handleAnswerClick('B')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer2 === 'B' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer2 && selectedAnswer2 !== 'B'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">B.</span> De EU ondervindt waarschijnlijk de meeste schade
                </button>
                <button 
                  onClick={() => handleAnswerClick('C')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer2 === 'C' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer2 && selectedAnswer2 !== 'C'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">C.</span> Brexit heeft waarschijnlijk geen merkbaar effect
                </button>
                <button 
                  onClick={() => handleAnswerClick('D')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer2 === 'D' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer2 && selectedAnswer2 !== 'D'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">D.</span> De economie van het VK groeit juist door Brexit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Choice Quiz 3 - for statement 3 */}
        {showQuiz3 && currentStatement === 3 && (
          <div className="absolute bottom-8 left-1/2 z-40" style={{maxWidth: '420px', transform: 'translateX(-37%)'}}>
            <div className="bg-white rounded-xl p-5 shadow-2xl border-4 border-gray-800">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Wat zegt dit over de economische impact van Brexit?
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleAnswerClick('A')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer3 === 'A' 
                      ? 'border-green-600 bg-green-50' 
                      : selectedAnswer3 && selectedAnswer3 !== 'A'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">A.</span> Vooral het VK ondervindt negatieve gevolgen
                </button>
                <button 
                  onClick={() => handleAnswerClick('B')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer3 === 'B' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer3 && selectedAnswer3 !== 'B'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">B.</span> Vooral de EU ondervindt negatieve gevolgen
                </button>
                <button 
                  onClick={() => handleAnswerClick('C')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer3 === 'C' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer3 && selectedAnswer3 !== 'C'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">C.</span> VK en EU ongeveer even
                </button>
                <button 
                  onClick={() => handleAnswerClick('D')}
                  className={`w-full text-left p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedAnswer3 === 'D' 
                      ? 'border-red-600 bg-red-50' 
                      : selectedAnswer3 && selectedAnswer3 !== 'D'
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-bold">D.</span> Geen duidelijk effect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Van Weel Feedback - appears above his head after correct answer */}
        {showVanWeelFeedback && currentStatement === 1 && (
          <div 
            className="absolute animate-poof-center"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="vanweel-feedback"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-md">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Van Weel:</strong> Heel goed. Ook de EU ondervindt gevolgen, maar relatief groter voor het VK. Laten we dit in de impactmeter verwerken.
              </p>
            </div>
          </div>
        )}
        
        {/* Van Weel Transition to Statement 2 */}
        {showTransitionToStatement2 && currentStatement === 2 && (
          <div 
            className="absolute animate-poof-center"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="vanweel-transition-2"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-md">
              <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                <strong>Van Weel:</strong> Zo, op naar de tweede stelling.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleShowStatement2}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  Stelling 2
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Van Weel Feedback after Quiz 2 */}
        {showVanWeelFeedback2 && currentStatement === 2 && (
          <div 
            className="absolute animate-poof-center"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="vanweel-feedback-2"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-md">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Van Weel:</strong> Inderdaad — hoewel andere factoren meespelen, wijzen de meeste studies op een negatief effect voor het VK. Laten we dit verwerken in de impactmeter.
              </p>
            </div>
          </div>
        )}
        
        {/* Van Weel Transition to Statement 3 */}
        {showTransitionToStatement3 && currentStatement === 3 && (
          <div 
            className="absolute animate-poof-center"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="vanweel-transition-3"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-md">
              <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                <strong>Van Weel:</strong> Op naar de derde en laatste stelling.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleShowStatement3}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  Stelling 3
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Van Weel Feedback after Quiz 3 */}
        {showVanWeelFeedback3 && currentStatement === 3 && (
          <div 
            className="absolute animate-poof-center"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="vanweel-feedback-3"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-md">
              <p className="text-base text-gray-800 leading-snug font-sans">
                <strong>Van Weel:</strong> Heel goed, de investeringen die achterblijven hebben vooral een negatieve impact op het VK. Laten we dit in de impactmeter verwerken.
              </p>
            </div>
          </div>
        )}

        {/* Ending Text 1 - After all impact meter filled */}
        {showEndingText1 && (
          <div 
            className="absolute animate-poof-center"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="ending-text-1"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-md">
              <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                <strong>Van Weel:</strong> Bedankt voor het debat heren. Nu heb ik genoeg informatie om een conclusie te kunnen trekken.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleEndingNext1}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  Volgende
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ending Text 2 - After characters exit - with navigation */}
        {showEndingText2 && !showFinalText && (
          <div 
            className="absolute"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="ending-text-2"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-lg">
              {/* Text content based on index */}
              {endingTextIndex === 0 && (
                <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                  <strong>Van Weel:</strong> Let wel: dit debat ging alleen over economische gevolgen. Brexit had ook veel andere gevolgen voor het VK, zoals meer grip op regelgeving en migratie.
                </p>
              )}
              {endingTextIndex === 1 && (
                <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                  <strong>Van Weel:</strong> Laten we dit gaan verwerken in onze opbrengstenmatrix.
                </p>
              )}
              {endingTextIndex === 2 && (
                <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                  <strong>Van Weel:</strong> We moeten de extremere situatie van het VK vertalen naar Nederland. Willen wij als enige het huidige EU-beleid voortzetten, dan blokkeren of verzwakken we EU-integratie: onze nettobaten dalen hard, en ook die van de overige lidstaten vallen lager uit.
                </p>
              )}
              
              {/* Navigation */}
              <div className="flex justify-between items-center">
                <span 
                  onClick={handleEndingPrev2}
                  className={`text-blue-600 font-bold cursor-pointer hover:text-blue-800 ${endingTextIndex === 0 ? 'invisible' : ''}`}
                >
                  ← Vorige
                </span>
                {endingTextIndex < 2 && (
                  <span 
                    onClick={handleEndingNext2}
                    className={`text-blue-600 font-bold cursor-pointer hover:text-blue-800`}
                  >
                    Volgende →
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Final Text - After correct answer */}
        {showFinalText && (
          <div 
            className="absolute"
            style={{left: '50%', transform: 'translateX(-50%)', bottom: '420px', zIndex: 25}}
            key="final-text"
          >
            <div className="relative bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-gray-800 max-w-lg">
              <p className="text-base text-gray-800 leading-snug font-sans mb-4">
                <strong>Van Weel:</strong> Heel goed! Zet één land niet in op meer EU-integratie, dan schaadt dat vooral zichzelf, maar het raakt ook de andere lidstaten.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  ✈️ Reis terug naar Nederland
                </button>
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
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: level === 4 ? 'white' : 'transparent',
              border: '2px solid white',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes poofCenter {
          0% { opacity: 0; transform: translateX(-50%) scale(0.7); }
          50% { opacity: 0.6; transform: translateX(-50%) scale(1.08); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes poofLeft {
          0% { opacity: 0; transform: scale(0.7); }
          50% { opacity: 0.6; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes poofRight {
          0% { opacity: 0; transform: scale(0.7); }
          50% { opacity: 0.6; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
          50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3)); }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-150%); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(150%); opacity: 0; }
        }
        .animate-poof-center {
          animation: poofCenter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-poof-left {
          animation: poofLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-poof-right {
          animation: poofRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .slide-out-left {
          animation: slideOutLeft 1s ease-in-out forwards;
        }
        .slide-out-right {
          animation: slideOutRight 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
