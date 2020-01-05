import { JumpKickPlayer } from "./JumpKickPlayer";
import { IPhysicsObject, JumpKickPlayerType } from "./JumpKickStateInterface";
import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickViewport } from "./JumpKickViewport";
import Big from 'big.js';

const playerStartDistance = Big(180);
const playerWidth = Big(70);
const playerHeight = Big(70);

const worldCenter = JumpKickConsts.worldWidth.div(2);
const leftPlayerX = worldCenter.minus(playerWidth.div(2)).minus(playerStartDistance.div(2));
const rightPlayerX = worldCenter.minus(playerWidth.div(2)).plus(playerStartDistance.div(2));

export class JumpKickGameState implements IPhysicsObject {
    public leftPlayer = new JumpKickPlayer({
        x: leftPlayerX,
        y: Big(10),
        width: playerWidth,
        height: playerHeight,
        type: JumpKickPlayerType.LeftPlayer,
        flip: false,
    });
    public rightPlayer = new JumpKickPlayer({
        x: rightPlayerX,
        y: Big(10),
        width: playerWidth,
        height: playerHeight,
        type: JumpKickPlayerType.RightPlayer,
        flip: true,
    });

    public viewport = new JumpKickViewport();
    public frameNumber = 0;
    public groundY = JumpKickConsts.height.minus(40);
    public gravityAY = Big("0.0002");

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

        this.viewport.step(dt);
    }

    public serialize() {
        return {
            frameNumber: this.frameNumber,
            redPlayer: this.leftPlayer.serialize(),
            bluePlayer: this.rightPlayer.serialize(),
            groundY: Number(this.groundY),
            viewport: this.viewport.serialize(),
        }
    }
}

const gameState = JumpKickGameState.getInstance();
export type JumpKickSerializedGameState = ReturnType<typeof gameState.serialize>
