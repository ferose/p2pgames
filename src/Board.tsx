// Deprecated

import * as React from 'react';
import './Board.css';
import _ from 'lodash';

export enum CellType {
  Blank = "blank",
  Red = "red",
  Blue = "blue",
}

/**
 * CellType[Rows][Columns]
 */
type Grid = CellType[][];

type Point = {row: number, col: number};

export interface IBoardProps {
}

export interface IBoardState {
  grid: Grid;
  headerColumn: number | null;
  currentPlayer: CellType;
  winner: Point[] | null;
}

/**
 * @param grid
 * @param col
 *
 * @returns True if successfully inserted
 */
function insertPiece(grid: Grid, col: number, currentPlayer: CellType): boolean {
  let row = grid.length-1;
  while (row >= 0 && grid[row][col] !== CellType.Blank) {
    row--;
  }
  if (row < 0) {
    return false;
  }
  grid[row][col] = currentPlayer;
  return true;
}

function findWinner(grid: Grid): Point[] | null {
  const coordinates: Point[] = [];

  // rows
  for (let i = 0; i < grid.length; i++){
    for (let j = 0; j < grid[i].length - 3; j++){
      if (grid[i][j] !== CellType.Blank &&
          grid[i][j] === grid[i][j+1] &&
          grid[i][j] === grid[i][j+2] &&
          grid[i][j] === grid[i][j+3]){
        coordinates.push({row:i, col:j});
        coordinates.push({row:i, col:j + 1});
        coordinates.push({row:i, col:j + 2});
        coordinates.push({row:i, col:j + 3});
        j = j + 3;
      }
    }
  }

  // columns
  for (let j = 0; j < grid[0].length; j++){
    for (let i = 0; i < grid.length - 3; i++){
      if (grid[i][j] !== CellType.Blank &&
          grid[i][j] === grid[i + 1][j] &&
          grid[i][j] === grid[i + 2][j] &&
          grid[i][j] === grid[i + 3][j]){
        coordinates.push({row:i, col:j});
        coordinates.push({row:i + 1, col:j});
        coordinates.push({row:i + 2, col:j});
        coordinates.push({row:i + 3, col:j});
        j = j + 3;
      }
    }
  }

  // top left to bottom right diagonals
  for (let i = 0; i < grid.length - 3; i++){
    for (let j = 0; j < grid[i].length - 3; j++){
      if (grid[i][j] !== CellType.Blank &&
          grid[i][j] === grid[i+1][j+1] &&
          grid[i][j] === grid[i+2][j+2] &&
          grid[i][j] === grid[i+3][j+3]){
        coordinates.push({row:i, col:j});
        coordinates.push({row:i + 1, col:j + 1});
        coordinates.push({row:i + 2, col:j + 2});
        coordinates.push({row:i + 3, col:j + 3});
        i = i + 3;
        j = j + 3;
      }
    }
  }

  // bottom left to top right diagonals
  for (let i = grid.length - 1; i > 3; i--){
    for (let j = 0; j < grid[i].length - 3; j++){
      if (grid[i][j] !== CellType.Blank &&
          grid[i][j] === grid[i-1][j+1] &&
          grid[i][j] === grid[i-2][j+2] &&
          grid[i][j] === grid[i-3][j+3]){
        coordinates.push({row:i, col:j});
        coordinates.push({row:i - 1, col:j + 1});
        coordinates.push({row:i - 2, col:j + 2});
        coordinates.push({row:i - 3, col:j + 3});
        i = i - 3;
        j = j + 3;
      }
    }
  }

  if (coordinates.length) {
    return coordinates;
  }
  return null;
}

function inWinner(winner: Point[], point:Point): boolean {
  for (const p of winner) {
    if (p.row === point.row && p.col === point.col) {
      return true;
    }
  }
  return false;
}

function createEmptyBoard(rows: Number, columns: Number) {
  const board: CellType[][] = [];
  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < columns; j++) {
      board[i].push(CellType.Blank);
    }
  }
  return board;
}

const defaultState = {
  grid: createEmptyBoard(6,7),
  headerColumn: null,
  currentPlayer: CellType.Blue,
  winner: null,
};

export default class Board extends React.Component<IBoardProps, IBoardState> {
  public constructor(props: IBoardProps) {
    super(props);
    this.state = defaultState;
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  public handleMouseOver(event: React.MouseEvent){
    const dataset = (event.currentTarget as any).dataset;
    const col = Number(dataset.col);
    this.setState({
      headerColumn: col,
    });
  }

  public handleMouseLeave(event: React.MouseEvent){
    this.setState({
      headerColumn: null,
    });
  }

  public handleClick(event: React.MouseEvent){
    event.preventDefault();

    if (findWinner(this.state.grid) !== null) {
      return;
    }

    const dataset = (event.currentTarget as any).dataset;
    const col = Number(dataset.col);
    const newGrid = _.cloneDeep(this.state.grid);
    if (insertPiece(newGrid, col, this.state.currentPlayer)) {
      this.setState({
        winner: findWinner(newGrid),
        grid: newGrid,
        currentPlayer: this.state.currentPlayer === CellType.Red ? CellType.Blue : CellType.Red,
      });
    }
  }

  private resetGame() {
    this.setState(defaultState);
  }

  private getStatus() {
    if (this.state.winner) {
      const winningPoint: Point = this.state.winner[0];
      const winningPlayer = this.state.grid[winningPoint.row][winningPoint.col];
      return `${winningPlayer} wins`;
    }
    return `${this.state.currentPlayer}'s turn`;
  }

  public render() {
    return (
      <div>
        <div className="top-bar">
          <h2>{this.getStatus()}</h2>
          <button onClick={this.resetGame}>Reset</button>
        </div>
        <table className="outer">
          <thead className="top-row">
            <tr>
              {this.state.grid[0].map((cell, j) => {
                const cellType = j === this.state.headerColumn ? `${this.state.currentPlayer} border-black` : `blank border-white`;
                return <th
                  key={j}
                  className={["circle", cellType].join(" ")}></th>
              })}
            </tr>
          </thead>
          <tbody className="board" onMouseLeave={this.handleMouseLeave}>
          {this.state.grid.map((row, i) => {
            return <tr key={i}>{row.map((cell, j) => {
              const classes = ["circle", "border-black", cell];
              if (this.state.winner && inWinner(this.state.winner, {row: i, col: j})) {
                classes.push("winner");
              }
              return <td
                key={j}
                data-row={i}
                data-col={j}
                className={classes.join(" ")}
                onMouseOver={this.handleMouseOver}
                onClick={this.handleClick}
                ></td>
            })}</tr>
          })}
          </tbody>
        </table>
      </div>
    );
  }
}
