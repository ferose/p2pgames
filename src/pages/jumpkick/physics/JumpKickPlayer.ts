import { IPhysicsObject } from "./JumpKickStateInterface";
import Big from 'big.js';

export class JumpKickPlayer implements IPhysicsObject{
    public x: Big;
    public y: Big;
    public width: Big;
    public height: Big;

    private vx = Big(0);
    private vy = Big(0);
    private ax = Big(0);
    private ay = Big(0.0001);
    private color: string;

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
        this.vy = this.vy.add(this.ay.mul(dt).div(2))
        this.vx = this.vx.add(this.ax.mul(dt).div(2))

        this.x = this.x.add(this.vx.mul(dt));
        this.y = this.y.add(this.vy.mul(dt));
    }

    public serialize() {
        return {
            x: Number(this.x),
            y: Number(this.y),
            width: Number(this.width),
            height: Number(this.height),
            color: this.color,
        }
    }
}
