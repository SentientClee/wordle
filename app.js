const { useState, useEffect } = React;

const WORD = words[Math.floor(Math.random() * words.length)];
const MAX_GUESSES = 6;

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
  const [currKey, setCurrKey] = useState();
  const [letters, setLetters] = useState([]);
  const [message, setMessage] = useState();

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
    if (!currKey) {
      return;
    }

    if (currKey === "enter") {
      if (letters.length < 5) {
        setMessage("Not enough letters");
        return;
      }

      setMessage("");
    }

    if (currKey === "backspace") {
      setLetters(letters.slice(0, letters.length - 1));
    }

    if (alphabet.includes(currKey) && letters.length < 5) {
      setLetters([...letters, currKey]);
    }

    // Reset currKey so you can enter the same consecutive letter i.e. "a", "a"
    setCurrKey(undefined);
  }, [currKey]);

  let gameRows = [];
  for (let i = 0; i < 6; i++) {
    gameRows.push(<GameRow key={i} />);
  }

  return (
    <div className="game-container">
      <div className="gameboard">{gameRows}</div>
      <div>{message}</div>
    </div>
  );
}

function GameRow() {
  let gameTiles = [];
  for (let i = 0; i < 5; i++) {
    gameTiles.push(<GameTile key={i} />);
  }

  return <div className="game-row">{gameTiles}</div>;
}

function GameTile(props) {
  return <div className="tile">{props.letter || ""}</div>;
}
