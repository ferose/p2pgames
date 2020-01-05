import Big from "big.js";
import { IPhysicsObject } from "./JumpKickStateInterface";
import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";

export class JumpKickViewport implements IPhysicsObject {
    public x = Big(0);
    public y = Big(0);
    public width = JumpKickConsts.width;
    public height = JumpKickConsts.height;

    public step(dt:Big) {
        const {leftPlayer, rightPlayer} = JumpKickGameState.getInstance();
        this.x = leftPlayer.x;
        this.y = Big(65);
    }

    public serialize() {
        return {
            x: this.x.toFixed(),
            y: this.y.toFixed(),
            width: this.width.toFixed(),
            height: this.height.toFixed(),
        }
    }
}