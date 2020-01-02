import { IPhysicsObject } from "./JumpKickStateInterface";
import Big from 'big.js';
import { JumpKickGameState } from "./JumpKickGameState";

export class JumpKickPlayer implements IPhysicsObject{
    public x: Big;
    public y: Big;
    public width: Big;
    public height: Big;

    private vx = Big(0);
    private vy = Big(0);
    private ax = Big(0);
    private ay = Big(0);
    private color: string;
    private kickState = false;

    constructor(params: {
        x: Big,
        y: Big,
        width: Big,
        height: Big,
        color: string
    }) {
        this.x = params.x;
        this.y = params.y;
        this.width = params.width;
        this.height = params.height;
        this.color = params.color;
    }

    public step(dt:Big) {
        const gameState = JumpKickGameState.getInstance();

        if (this.kickState) {
            this.vy = Big("0.04");
        } else {
            this.vy = this.vy.add(this.ay.add(gameState.gravityAY).mul(dt).div(2))
        }
        this.vx = this.vx.add(this.ax.mul(dt).div(2))

        this.x = this.x.add(this.vx.mul(dt));
        this.y = this.y.add(this.vy.mul(dt));

        if (this.isTouchingGround()) {
            this.y = gameState.groundY.minus(this.height);
            this.vy = Big(0);
            this.vx = Big(0);
        }
    }

    public jump() {
        if (this.isTouchingGround()) {
            this.vy = Big("-0.1");
            this.kickState = false;
        }
    }

    public kick() {
        if (!this.isTouchingGround()) {
            const gameState = JumpKickGameState.getInstance();
            const opponent = gameState.getOpponent(this);
            this.kickState = true;
            this.vx = Big("0.02").mul(opponent.x.gt(this.x) ? 1 : -1);
        }
    }

    public isTouchingGround() {
        return this.y.plus(this.height).gte(JumpKickGameState.getInstance().groundY);
    }

    public serialize() {
        return {
            x: this.x.toFixed(),
            y: this.y.toFixed(),
            width: this.width.toFixed(),
            height: this.height.toFixed(),
            color: this.color,
        }
    }
}
