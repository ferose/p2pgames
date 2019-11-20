import * as React from 'react';
import './Board.css';

export enum CellType {
  Blank = "blank",
  Red = "red",
  Blue = "blue",
}

export interface IBoardProps {
}

export interface IBoardState {
  /**
   * CellType[Rows][Columns]
   */
  grid: CellType[][];
}

function createEmptyBoard(rows: Number, columns: Number) {
  const board: CellType[][] = [];
  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < columns; j++) {
      board[i].push(CellType.Blank);
    }
  }
  board[0][0] = CellType.Blue;
  board[0][1] = CellType.Blue;
  board[0][2] = CellType.Blue;
  board[0][3] = CellType.Blue;

  board[1][0] = CellType.Red;
  board[1][1] = CellType.Red;
  board[1][2] = CellType.Red;
  board[1][3] = CellType.Red;
  return board;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  public constructor(props: IBoardProps) {
    super(props);
    this.state = {
      grid: createEmptyBoard(6,7)
    }
  }

  public render() {
    return (
      <table className="board">
        <tbody>
        {this.state.grid.map((row, i) => {
          return <tr key={i}>{row.map((cell, j) => {
            return <td key={j} className={[cell, "circle"].join(" ")}></td>
          })}</tr>
        })}
        </tbody>
      </table>
    );
  }
}
