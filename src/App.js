import React, { useState, useEffect } from "react";
import { Board } from "./Components/Board";
import { ResetButton } from "./Components/ResetButton";
import { ScoreBoard } from "./Components/ScoreBoard";
import './App.css';

const App = () => {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const [xPlaying, setXPlaying] = useState(true);
  const initialScores = (() => {
    const storedScores = localStorage.getItem('ticTacToeScores');
    return storedScores ? JSON.parse(storedScores) : { xScore: 0, oScore: 0 };
  })();
  const [scores, setScores] = useState(initialScores);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
  }, [scores]);

  const handleBoxClick = (boxIdx) => {
    if (!board[boxIdx] && !gameOver) {
      const updatedBoard = board.map((value, idx) => (idx === boxIdx ? (xPlaying ? "X" : "O") : value));
      setBoard(updatedBoard);
      const winner = checkWinner(updatedBoard);

      if (winner) {
        setGameOver(true);
        setScores((prevScores) => ({
          ...prevScores,
          [winner === "O" ? "oScore" : "xScore"]: prevScores[winner === "O" ? "oScore" : "xScore"] + 1,
        }));
      } else {
        setXPlaying(!xPlaying);
      }
    }
  }

  const checkWinner = (board) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];

      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        return board[x];
      }
    }
    return null;
  }

  const resetBoard = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
  }

  return (
    <div className="App">
      <ScoreBoard scores={scores} xPlaying={xPlaying} />
      <Board board={board} onClick={gameOver ? resetBoard : handleBoxClick} />
      <ResetButton resetBoard={resetBoard} />
    </div>
  );
}

export default App;
