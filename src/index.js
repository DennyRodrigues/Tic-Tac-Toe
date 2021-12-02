import React from "react";
import ReactDOM from "react-dom";
import "./index.css";


function Square(props) {
  return (
    <button className="square" onClick={props.onClickHandler}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    // Create an array of squares to be render, will be 9 in total(making a board). Each square will have an index to indicate it's position(middle square, top-left, etc...)
    let boardSquares = Array(9).fill('').map((square, index) => {
      return(
      <Square
      key={index}
        value={this.props.currentPosition[index]}
        onClickHandler={() => {
          this.props.changeSquareSymbol(index);
        }}
      />)
  }
    );
    return (
      <div className='board'>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // History will be an array. Inside the array will be another array of squares and this last array of square will be filled along the game with 'X', 'O', or null to indicate which square is filled with what
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      historyIndex: 0,
      // It will be used to change the status, which will indicate if the next movement is 'X' or 'O'   
      isFirstPlayer: true,
    };
  }
  // This will create a new history containing the last movement. It will be called everytime a player makes a movement.
  changeSquareSymbol(squareId) {
    const history = this.state.history.slice(0, this.state.historyIndex + 1);
    const current = history[history.length - 1];
    const tempSquares = current.squares.slice();
    if (calculateWinner(tempSquares) || tempSquares[squareId]) {
      return;
    }

    if (this.state.isFirstPlayer) {
      tempSquares[squareId] = "X";
    } else {
      tempSquares[squareId] = "O";
    }
    this.setState({
      history: history.concat([
        {
          squares: tempSquares,
        },
      ]),
      historyIndex: history.length,
      isFirstPlayer: !this.state.isFirstPlayer,
    });
  }
  // Function to go back movements in the game timeline.It works changing the state of historyIndex which meanins the game will render a board a past game, and also changes which player will play now. After the player clicked, all the moves history  will still be there, it will ony change after the player makes a movement. 
  jumpTo(newHistoryIndex) {
    this.setState({
      historyIndex: newHistoryIndex,
      isFirstPlayer: newHistoryIndex % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const currentPosition = history[this.state.historyIndex];
    const winner = calculateWinner(currentPosition.squares);
    const historyIndex = this.state.historyIndex;

    // Make a list of buttons to go to previous positions or the start of the game. 
    const moves = history.map((currentHistory, index) => {
      let description;
      if (index) {
        description = "Go to move #" + index;
      } else {
        description = "Go to game start";
      }
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{description}</button>
        </li>
      );
    });

    // Display which player is the next or the winner of the game(if any)
    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } 
    // When historyIndex = 9, it indicates that no more movements are possible because all the squares are filled, which means is a draw.
    else if(historyIndex === 9){
      status = `It's a draw!`

    }
    else {
      status = `Next player: ${this.state.isFirstPlayer ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className='status-container'>
          <p className='status'>{status}</p>
          <div className='restart-container'>
          {winner || historyIndex ===9?<button 
          onClick={() => this.jumpTo(0)}
          className='restart-button'
          >Restart Game </button>
          :<div></div>}
          </div>
        </div>
        <div className='board-container'>
        <Board
            currentPosition={currentPosition.squares}
            isFirstPlayer={this.state.isFirstPlayer}
            changeSquareSymbol={(squareId) => this.changeSquareSymbol(squareId)}
          />

        </div>
        <div className="game-info">
          <h3 className="game-info-title">Game Timeline</h3>
          <ol className='game-info-list'>{moves}</ol>
        </div>
      </div>
    );
  }
}
// The layout of the page,
function Layout(props){
  return <div className='layout'>
    <h1 >Tic-Tac-Toe</h1>
    <Game/>
    </div>
}

// ========================================

ReactDOM.render(<Layout />, document.getElementById("root"));

// Function to calculate the winner using the current position of the game
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
