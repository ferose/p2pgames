import _ from 'lodash';

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

    constructor(public numCols: number, public numRows: number) {
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
    }

    public get isAnimating() {
        return this.lastMove && this.lastMove.alpha === 0;
    }
}