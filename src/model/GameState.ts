import _ from 'lodash';

export class Pair<X=number, Y=number> {
    constructor(public x:X, public y:Y) {}
}

export class Circle {
    public x:number;
    public y:number;
    public alpha: number = 1;
    public scale:number = 1;
    constructor(params: {
        x:number,
        y:number,
        alpha?:number,
        scale?:number,
    }) {
        this.x = params.x;
        this.y = params.y;
        if (_.isNumber(params.alpha)) {
            this.alpha = params.alpha
        }
        if (_.isNumber(params.scale)) {
            this.scale = params.scale
        }
    }
}

export class GameState {
    /**
     * x or col position
     * y or row position
     * -1 y means header row
     */
    public animatedCircle = new Circle({x: 0, y:-1, alpha:0});
    constructor() {
    }
}