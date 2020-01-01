import { JumpKickPlayer } from "./JumpKickPlayer";
import { IPhysicsObject } from "./JumpKickStateInterface";
import Big from 'big.js';

export class JumpKickGameState implements IPhysicsObject {
    public frameNumber = 0;
    public bluePlayer = new JumpKickPlayer();

    public step(dt:Big) {
        this.frameNumber++;
        this.bluePlayer.step(dt);
    }

    public serialize() {
        return {
            bluePlayer: this.bluePlayer.serialize()
        }
    }
}

const dummyState = new JumpKickGameState();
export type IJumpKickSerializedGameState = ReturnType<typeof dummyState.serialize>
