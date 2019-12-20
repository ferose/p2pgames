import _ from 'lodash';
import * as React from 'react';
import { UserManager } from './UserManager';

export class Pair<X=number, Y=number> {
    constructor(public x:X, public y:Y) {}
}

export enum CircleType {
    red,
    blue
}

export class Circle {
    public x:number;
    public y:number;
    public alpha: number = 1;
    public scale:number = 1;
    public type:CircleType;

    constructor(params: {
        x:number,
        y:number,
        type:CircleType,
        alpha?:number,
        scale?:number,
    }) {
        this.x = params.x;
        this.y = params.y;
        this.type = params.type;
        if (_.isNumber(params.alpha)) {
            this.alpha = params.alpha
        }
        if (_.isNumber(params.scale)) {
            this.scale = params.scale
        }
    }

    public get hexColor() {
        return this.type === CircleType.red ? "#d2a3a9" : "#89aeb2";
    }
}

export class GameState {
    /**
     * x or col position
     * y or row position
     * -1 y means header row
     */
    public animatedCircle = new Circle({x: 0, y:-1, alpha:0, type: CircleType.red});
    public moves: Circle[] = [];
    public winningCircles: Circle[] | null = null;

    private numCols: number;
    private numRows: number;
    private setMessage: (status: JSX.Element) => void;
    private userManager: UserManager;

    constructor(params: {
        numCols: number,
        numRows: number,
        setMessage: (status: JSX.Element) => void,
        userManager: UserManager,
    }){
        this.numCols = params.numCols;
        this.numRows = params.numRows;
        this.setMessage = params.setMessage;
        this.userManager = params.userManager;
        this.updateStatus();
    }

    public get currentPlayer() {
        return this.animatedCircle.type;
    }

    public set currentPlayer(type:CircleType) {
        this.animatedCircle.type = type;
    }

    /**
     * Make sure to call completeMove() once animation completes
     */
    public makeMove(x:number) {
        const circleBelow = _(this.moves)
            .filter(m => m.x === x)
            .minBy("y");
        const y = circleBelow ? circleBelow.y-1 : this.numRows-1;
        if (y < 0) return false;
        this.moves.push(new Circle({x, y, alpha:0, type: this.currentPlayer}));
        this.winningCircles = this.findWinningCircles();
        return true;
    }

    public get lastMove() : Circle | null {
        return this.moves[this.moves.length-1] || null;
    }

    public completeMove() {
        if (!this.lastMove) return;
        this.animatedCircle.y = -1;
        this.lastMove.alpha = 1;
        this.currentPlayer = this.currentPlayer === CircleType.red ? CircleType.blue : CircleType.red;
        this.updateStatus();
    }

    private getPlayerHTML(player: CircleType) {
        const playerName = player === CircleType.red ? "Red" : "Blue";
        const playerCSS = player === CircleType.red ? "red" : "blue";
        const playerHTML = <b className={playerCSS}>{playerName}</b>;
        return playerHTML;
    }

    private getLocalPlayer() {
        return this.userManager.thisIsHost() ? CircleType.red : CircleType.blue;
    }

    public isLocalPlayersTurn() {
        return this.currentPlayer === this.getLocalPlayer();
    }

    public updateStatus() {
        const player = this.winningCircles ? this.winningCircles[0].type : this.currentPlayer;
        const playerHTML = this.getPlayerHTML(player);

        if (this.winningCircles){
            this.setMessage(<span>You are {this.getPlayerHTML(this.getLocalPlayer())}. {playerHTML} wins!</span>);
        }
        else {
            this.setMessage(<span>You are {this.getPlayerHTML(this.getLocalPlayer())}. It is {playerHTML}'s turn</span>);
        }
    }

    public get isAnimating() {
        return this.lastMove && this.lastMove.alpha === 0;
    }

    /**
     * Returns a grid with [x][y] coordinates, x being col and y being row
     */
    public constructGrid() {
        const grid: (Circle|null)[][] = [];
        for (let x = 0; x < this.numCols; x++) {
            grid[x] = [];
            for (let y = 0; y < this.numRows; y++) {
                grid[x][y] = null;
            }
        }
        for (const circle of this.moves) {
            grid[circle.x][circle.y] = circle;
        }
        return grid;
    }

    public findWinningCircles(): Circle[] | null {
        const grid = this.constructGrid();

        const numMatches = 4;

        // Vertical
        for (let x = 0; x < grid.length; x++) {
            let start = 0;
            for (let end = 1; end < grid[x].length; end++) {
                const startCircle = grid[x][start];
                const endCircle = grid[x][end];
                if (startCircle === null ||
                    endCircle === null ||
                    startCircle.type !== endCircle.type) {
                    if (end - start >= numMatches) {
                        return grid[x].slice(start, end) as Circle[];
                    }
                    start = end;
                }
            }
            if (grid[x].length - start >= numMatches) {
                return grid[x].slice(start, grid[x].length) as Circle[];
            }
        }

        // Horizontal
        for (let y = 0; y < grid[0].length; y++) {
            let start = 0;
            for (let end = 1; end < grid.length; end++) {
                const startCircle = grid[start][y];
                const endCircle = grid[end][y];
                if (startCircle === null ||
                    endCircle === null ||
                    startCircle.type !== endCircle.type) {
                    if (end - start >= numMatches) {
                        return grid.map((circles) => circles[y]).slice(start, end) as Circle[];
                    }
                    start = end;
                }
            }
            if (grid.length - start >= numMatches) {
                return grid.map((circles) => circles[y]).slice(start, grid.length) as Circle[];
            }
        }

        // Top left to bottom right
        for (let x = -grid[0].length; x < grid.length; x++) {
            let start = 0;
            if (x < 0) {
                start = -x;
            }
            let end = start+1;
            for (; end < grid[0].length && x+end < grid.length; end++) {
                const startCircle = grid[x+start][start];
                const endCircle = grid[x+end][end];
                if (startCircle === null ||
                    endCircle === null ||
                    startCircle.type !== endCircle.type) {
                    if (end - start >= numMatches) {
                        const result = [];
                        for (let i = start; i < end; i++) {
                            result.push(grid[x+i][i]);
                        }
                        return result as Circle[];
                    }
                    start = end;
                }
            }
            if (end - start >= numMatches) {
                const result = [];
                for (let i = start; i < end; i++) {
                    result.push(grid[x+i][i]);
                }
                return result as Circle[];
            }
        }


        // Bottom left to top right
        for (let x = -grid[0].length; x < grid.length; x++) {
            let start = 0;
            if (x < 0) {
                start = -x;
            }
            let end = start+1;
            for (; end < grid[0].length && x+end < grid.length; end++) {
                const startCircle = grid[x+start][grid[0].length-1-start];
                const endCircle = grid[x+end][grid[0].length-1-end];
                if (startCircle === null ||
                    endCircle === null ||
                    startCircle.type !== endCircle.type) {
                    if (end - start >= numMatches) {
                        const result = [];
                        for (let i = start; i < end; i++) {
                            result.push(grid[x+i][grid[0].length-1-i]);
                        }
                        return result as Circle[];
                    }
                    start = end;
                }
            }
            if (end - start >= numMatches) {
                const result = [];
                for (let i = start; i < end; i++) {
                    result.push(grid[x+i][grid[0].length-1-i]);
                }
                return result as Circle[];
            }
        }

        return null;
    }
}