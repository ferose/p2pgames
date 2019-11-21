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
  clicked: [number, number] | null;
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
      grid: createEmptyBoard(6,7),
      clicked: null
    }
    this.handleClick = this.handleClick.bind(this);
  }

  public handleClick(event: React.MouseEvent){
    event.preventDefault();
    const dataset = (event.currentTarget as any).dataset;
    const col = Number(dataset.col);
    const row = Number(dataset.row);
    this.setState({
      clicked: [row, col],
    });
  }

  componentDidUpdate(prevProps: IBoardProps, prevState: IBoardState): void {
    console.log(this.state.clicked);
  }

  public render() {
    return (
      <table>
        <thead className="top-row">
          <tr>
            {this.state.grid[0].map((cell, j) => {
              const cellType = j === (this.state.clicked && this.state.clicked[1]) ? "red border-black" : "blank border-white";
              return <th
                key={j}
                className={["circle", cellType].join(" ")}></th>
            })}
          </tr>
        </thead>
        <tbody className="board">
        {this.state.grid.map((row, i) => {
          return <tr key={i}>{row.map((cell, j) => {
            return <td
              key={j}
              data-row={i}
              data-col={j}
              className={["circle", "border-black", cell].join(" ")}
              onMouseOver={this.handleClick}></td>
          })}</tr>
        })}
        </tbody>
      </table>
    );
  }
}
