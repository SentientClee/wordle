const { useState, useEffect } = React;

const WORD = words[Math.floor(Math.random() * words.length)];
console.log(WORD);

function getWordMap() {
  const wordMap = {};
  Array.from(WORD).forEach((char) => {
    if (!wordMap[char]) {
      wordMap[char] = 1;
    } else {
      wordMap[char]++;
    }
  });
  return wordMap;
}

function App() {
  return (
    <div className="app-container">
      <Header />
      <Game />
    </div>
  );
}

function Header() {
  return <div className="header">Wordleneed</div>;
}

function Game() {
  const [gameOver, setGameOver] = useState(false);
  const [currAttempt, setCurrAttempt] = useState(0);
  const [currKey, setCurrKey] = useState("");
  const [letters, setLetters] = useState(["", "", "", "", "", ""]);
  const [evaluations, setEvaluations] = useState([[], [], [], [], [], []]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onKeydown = (e) => {
      // Do not trigger with modifiers other than shift
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const keyLower = e.key.toLowerCase();
      if (allowedKeys.includes(keyLower)) {
        setCurrKey(keyLower);
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, []);

  useEffect(() => {
    if (!currKey || gameOver) {
      return;
    }

    // reset message shown to user
    setMessage("");

    if (currKey === "enter") {
      if (letters[currAttempt].length < 5) {
        setMessage("Not enough letters");
        return;
      }

      if (!wordList.includes(letters[currAttempt])) {
        setMessage("Not in word list");
        return;
      }

      // compare entered word to correct word
      if (letters[currAttempt] === WORD) {
        setMessage("Correct!");
        setGameOver(true);
      } else {
        // evaluate word
        // get wordmap
        let wordMap = getWordMap();
        let guess = Array.from(letters[currAttempt]);

        // find all correct indexes first
        let correctIndexes = [];
        guess.forEach((char, i) => {
          if (char === WORD[i]) {
            correctIndexes.push(i);
            wordMap[char]--;
          }
        });

        // store evaluation state
        let newEvaluations = [...evaluations];
        newEvaluations[currAttempt] = guess.map((char, i) => {
          if (correctIndexes.includes(i)) {
            return "correct";
          }

          if (wordMap[char] && wordMap[char] > 0) {
            wordMap[char]--;
            return "present";
          }

          return "absent";
        });
        console.log(newEvaluations);
        setEvaluations(newEvaluations);

        // increment currAttempt
        setCurrAttempt(currAttempt + 1);

        // check if currAttempts are at max then reveal word and end game
        if (currAttempt === 6) {
          setMessage(WORD);
          setGameOver(true);
        }
      }
    }

    if (currKey === "backspace") {
      const newLetters = [...letters];
      newLetters[currAttempt] = letters[currAttempt].slice(
        0,
        letters[currAttempt].length - 1
      );
      setLetters(newLetters);
    }

    if (alphabet.includes(currKey) && letters[currAttempt].length < 5) {
      const newLetters = [...letters];
      newLetters[currAttempt] += currKey;
      setLetters(newLetters);
    }

    // Reset currKey so you can enter the same consecutive letter i.e. "a", "a"
    setCurrKey(undefined);
  }, [currKey]);

  let gameRows = [];
  for (let i = 0; i < 6; i++) {
    const rowLetters = letters[i];
    gameRows.push(<GameRow key={i} letters={rowLetters} />);
  }

  return (
    <div className="game-container">
      <div className="gameboard">{gameRows}</div>
      <div>{message}</div>
    </div>
  );
}

function GameRow(props) {
  let gameTiles = [];
  for (let i = 0; i < 5; i++) {
    const letters = props.letters || "";
    gameTiles.push(<GameTile key={i} letter={letters[i]} />);
  }

  return <div className="game-row">{gameTiles}</div>;
}

function GameTile(props) {
  const letter = props.letter || "";
  return <div className="tile">{letter.toUpperCase()}</div>;
}
