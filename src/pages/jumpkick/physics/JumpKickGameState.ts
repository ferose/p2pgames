import { JumpKickPlayer } from "./JumpKickPlayer";
import { IPhysicsObject, JumpKickPlayerType } from "./JumpKickStateInterface";
import { JumpKickConsts } from "./JumpKickConsts";
import Big from 'big.js';

const playerStartGap = Big(10);
const playerWidth = Big(70);
const playerHeight = Big(70);

export class JumpKickGameState implements IPhysicsObject {
    public leftPlayer = new JumpKickPlayer({
        x: playerStartGap,
        y: Big(10),
        width: playerWidth,
        height: playerHeight,
        type: JumpKickPlayerType.LeftPlayer,
    });
    public rightPlayer = new JumpKickPlayer({
        x: JumpKickConsts.width.minus(playerStartGap).minus(playerWidth),
        y: Big(10),
        width: playerWidth,
        height: playerHeight,
        type: JumpKickPlayerType.RightPlayer,
    });

    public frameNumber = 0;
    public groundY = JumpKickConsts.height.minus(40);
    public gravityAY = Big("0.0001");

    private static instance: JumpKickGameState;

    private constructor() {
        // NOOP
    }

    static getInstance(): JumpKickGameState {
        if (!JumpKickGameState.instance) {
            JumpKickGameState.instance = new JumpKickGameState();
        }
        return JumpKickGameState.instance;
    }

    public getOpponent(player: JumpKickPlayer) {
        return player === this.leftPlayer ? this.rightPlayer : this.leftPlayer;
    }

    public step(dt:Big) {
        this.frameNumber++;

        const players = [this.leftPlayer, this.rightPlayer];
        for (const player of players) {
            player.step(dt);
        }
    }

    public serialize() {
        return {
            frameNumber: this.frameNumber,
            redPlayer: this.leftPlayer.serialize(),
            bluePlayer: this.rightPlayer.serialize(),
            groundY: Number(this.groundY),
        }
    }
}

const gameState = JumpKickGameState.getInstance();
export type IJumpKickSerializedGameState = ReturnType<typeof gameState.serialize>
