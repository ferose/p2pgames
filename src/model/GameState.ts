export class Pair<A=number, B=number> {
    constructor(public a:A, public b:B) {}
}

export class GameState {
    /**
     * a is row
     * b is col
     */
    public animatedCirclePosition = new Pair(0,0);
    constructor() {
    }
}