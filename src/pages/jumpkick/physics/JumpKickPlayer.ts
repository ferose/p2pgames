import { IPhysicsObject } from "./JumpKickStateInterface";
import Big from 'big.js';

export class JumpKickPlayer implements IPhysicsObject{
    public x = Big(0);
    public y = Big(0);

    private vx = Big(0);
    private vy = Big(0.01);

    public step(dt:Big) {
        this.x = this.x.add(this.vx.mul(dt));
        this.y = this.y.add(this.vy.mul(dt));
    }

    public serialize() {
        return {
            x: Number(this.x),
            y: Number(this.y),
        }
    }
}
