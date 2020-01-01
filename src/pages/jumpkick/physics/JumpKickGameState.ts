import { JumpKickPlayer } from "./JumpKickPlayer";
import { IPhysicsObject } from "./JumpKickStateInterface";

export class JumpKickGameState implements IPhysicsObject {
    public frameNumber = 0;
    public bluePlayer = new JumpKickPlayer();

    public step(dt:number) {
        this.frameNumber++;
        this.bluePlayer.step(dt);
    }
}