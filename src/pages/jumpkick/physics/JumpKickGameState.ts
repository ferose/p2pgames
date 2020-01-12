import { JumpKickPlayer } from "./JumpKickPlayer";
import { IPhysicsObject, JumpKickPlayerType } from "./JumpKickStateInterface";
import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickViewport } from "./JumpKickViewport";
import Big from 'big.js';

const playerStartDistance = Big(180);

const worldCenter = JumpKickConsts.worldWidth.div(2);
const leftPlayerX = worldCenter.minus(JumpKickConsts.playerWidth.div(2)).minus(playerStartDistance.div(2));
const rightPlayerX = worldCenter.minus(JumpKickConsts.playerWidth.div(2)).plus(playerStartDistance.div(2));

export class JumpKickGameState implements IPhysicsObject {
    public redPlayer = new JumpKickPlayer({
        x: leftPlayerX,
        y: Big(10),
        type: JumpKickPlayerType.RedPlayer,
        flip: false,
    });
    public bluePlayer = new JumpKickPlayer({
        x: rightPlayerX,
        y: Big(10),
        type: JumpKickPlayerType.BluePlayer,
        flip: true,
    });

    public viewport = new JumpKickViewport();
    public frameNumber = 0;
    public groundY = JumpKickConsts.height.minus("-35");
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
        return player === this.redPlayer ? this.bluePlayer : this.redPlayer;
    }

    private handleCollision() {
        let redHit = false;
        let blueHit = false;
        if (this.redPlayer.isHitWith(this.bluePlayer)) {
            redHit = true;
        }
        if (this.bluePlayer.isHitWith(this.redPlayer)) {
            blueHit = true;
        }
        if (redHit) {
            this.redPlayer.die();
        }
        if (blueHit) {
            this.bluePlayer.die();
        }
    }

    public step(dt:Big) {
        this.frameNumber++;

        const players = [this.redPlayer, this.bluePlayer];
        for (const player of players) {
            player.step(dt);
        }

        this.handleCollision();

        this.viewport.step(dt);
    }

    public serialize() {
        return {
            frameNumber: this.frameNumber,
            redPlayer: this.redPlayer.serialize(),
            bluePlayer: this.bluePlayer.serialize(),
            groundY: Number(this.groundY),
            viewport: this.viewport.serialize(),
        }
    }
}

const gameState = JumpKickGameState.getInstance();
export type JumpKickSerializedGameState = ReturnType<typeof gameState.serialize>
