import { JumpKickPlayer } from "./JumpKickPlayer";
import { IPhysicsObject } from "./JumpKickStateInterface";
import { JumpKickConsts } from "./JumpKickConsts";
import Big from 'big.js';

const playerStartGap = Big(10);
const playerWidth = Big(30);
const playerHeight = Big(60);

export class JumpKickGameState implements IPhysicsObject {
    public redPlayer = new JumpKickPlayer({
        x: playerStartGap,
        y: Big(10),
        width: playerWidth,
        height: playerHeight,
        color: "#BD4F6C",
    });
    public bluePlayer = new JumpKickPlayer({
        x: JumpKickConsts.width.minus(playerStartGap).minus(playerWidth),
        y: Big(10),
        width: playerWidth,
        height: playerHeight,
        color: "#93B5C6",
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
        return player === this.redPlayer ? this.bluePlayer : this.redPlayer;
    }

    public step(dt:Big) {
        this.frameNumber++;

        const players = [this.redPlayer, this.bluePlayer];
        for (const player of players) {
            player.step(dt);
        }
    }

    public serialize() {
        return {
            frameNumber: this.frameNumber,
            redPlayer: this.redPlayer.serialize(),
            bluePlayer: this.bluePlayer.serialize(),
            groundY: Number(this.groundY),
        }
    }
}

const gameState = JumpKickGameState.getInstance();
export type IJumpKickSerializedGameState = ReturnType<typeof gameState.serialize>
