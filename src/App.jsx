import GameBoard from "./components/gameboard/GameBoard";
import Player from "./components/player/Player";
import { useState } from "react";
import Log from "./components/log/Log";
import { WINNING_COMBINATIONS } from "./winning-combination";
import GameOver from "./components/game-over/GameOver";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

const PLAYERS = {  
  X: "Player 1",
  O: "Player 2"}

const SYMBOLS = {
    X: "X",
    O: "O"
  }

function deriveActivePlayer(gameTurns) {
  let currentPlayer = SYMBOLS.X;
  if (gameTurns.length > 0 && gameTurns[0].player === SYMBOLS.X) {
    currentPlayer = SYMBOLS.O;
  }
  return currentPlayer;
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map((innerArray) => [...innerArray])];
    
  for(const turn of gameTurns){
      const {square, player} = turn;
      const {row, col} = square;
      gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, gameTurns, players){
  let winner;
  console.log("GameBoard: ", gameBoard);
  let hasDrawn;
  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column]; 
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      winner = players[firstSquareSymbol];
    }
    if(gameTurns.length === 9 && !winner){
      hasDrawn = true;
    }
  }
  console.log("Winner: ",winner, "Drawn: ", hasDrawn);
  return {winner, hasDrawn};
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS)

  const gameBoard = deriveGameBoard(gameTurns);
  const activePlayer = deriveActivePlayer(gameTurns);
  const {winner, hasDrawn} = deriveWinner(gameBoard, gameTurns, players);

  function handlePlayerSave(symbol, newName){ 
    setPlayers((prevPlayers) =>{
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    })
  }

  function handleRematchClick(){
    setGameTurns([]);
  }

  function handleSquareSelect(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      let currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol={SYMBOLS.X}
            isActive={activePlayer === SYMBOLS.X ? true : false}
            onSaveClick = {handlePlayerSave}
          />
          <Player
            initialName={PLAYERS.O}
            symbol={SYMBOLS.O}
            isActive={activePlayer === SYMBOLS.O ? true : false}
            onSaveClick = {handlePlayerSave}
          />
        </ol>
        {(winner || hasDrawn) && <GameOver winner={winner} onRematchCLick = {handleRematchClick}></GameOver>}
        <GameBoard
          onSelectSquare={handleSquareSelect}
          symbol={activePlayer === SYMBOLS.X ? SYMBOLS.X : SYMBOLS.O}
          board={gameBoard}
        ></GameBoard>
      </div>
      <Log turns={gameTurns}></Log>
    </main>
  );
}

export default App;
