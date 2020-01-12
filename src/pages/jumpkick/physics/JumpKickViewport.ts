import Big from "big.js";
import { IPhysicsObject } from "./JumpKickStateInterface";
import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import { BigMath } from "../../../utilities/BigMath";

export class JumpKickViewport implements IPhysicsObject {
    public x = Big(0);
    public y = Big(0);
    public width = JumpKickConsts.width;
    public height = JumpKickConsts.height;

    public step(dt:Big) {
        const {redPlayer, bluePlayer} = JumpKickGameState.getInstance();
        const redHitbox = redPlayer.getHitBox();
        const blueHitbox = bluePlayer.getHitBox();
        const centerX = BigMath.mean(redHitbox.left, redHitbox.right, blueHitbox.left, blueHitbox.right);
        this.x = centerX.sub(this.width.div(2));
        if (this.x.lt(0)) {
            this.x = Big(0);
        } else if (this.x.plus(this.width).gt(JumpKickConsts.worldWidth)) {
            this.x = JumpKickConsts.worldWidth.minus(this.width);
        }
        this.y = JumpKickConsts.worldHeight.sub(this.height).add("25");
    }

    public serialize() {
        return {
            x: this.x.toFixed(0),
            y: this.y.toFixed(0),
            width: this.width.toFixed(),
            height: this.height.toFixed(),
        }
    }
}