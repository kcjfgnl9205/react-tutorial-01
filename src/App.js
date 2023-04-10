import { useState } from 'react';


//블럭
function Square({ value, onSquareClick, isAnswer }) {
  return (
    <button className="square" onClick={onSquareClick} style={{ backgroundColor: isAnswer && 'skyblue' }}>{value}</button>
  )
}


function Board({ xIsNext, squares, onPlay }) {
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  //드로우일경우
  const isDraw = squares.filter(el => el === null).length === 0;
  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : isDraw ? "draw" : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <>
      <div className="status">{status}</div>
      {/* 반복문으로 정렬 */}
      {
        [0, 1, 2].map((el, index) => {
          return (
            <div className="board-row">
              {
                [1, 2, 3].map((el, subIndex) => {
                  const i = (index * 3) + subIndex;
                  return <Square
                            value={squares[i]}
                            onSquareClick={() => handleClick(i)}
                            isAnswer={calculateWinnerIndex(squares)?.includes(i)}
                          />
                })
              }
            </div>
          )
        })
      }
    </>
  )
}


const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
//승자 확인
function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
//승자 확인(인덱스)
function calculateWinnerIndex(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  }

  //과거 이력리스트
  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    
    return (
      <li key={move}>
        {/* 현재이동에 대한 정보는 문자열로 표시 */}
        {
          move > 0 && currentMove === move
          ? <>You are at move #{move}</>
          : <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
