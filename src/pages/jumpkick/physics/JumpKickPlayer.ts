import { IPhysicsObject, JumpKickPlayerType } from "./JumpKickStateInterface";
import Big from 'big.js';
import { JumpKickGameState } from "./JumpKickGameState";
import { JumpKickSprite } from "./JumpKickSprite";

enum PlayerState {
    Attack = "Attack",
    Die = "Die",
    Idle = "Idle",
    Jump = "Jump",
}

export class JumpKickPlayer implements IPhysicsObject{
    public x: Big;
    public y: Big;
    public width: Big;
    public height: Big;
    public type: JumpKickPlayerType;

    private vx = Big(0);
    private vy = Big(0);
    private ax = Big(0);
    private ay = Big(0);
    private _state = PlayerState.Idle;
    private sprite: JumpKickSprite;

    constructor(params: {
        x: Big,
        y: Big,
        width: Big,
        height: Big,
        type: JumpKickPlayerType
    }) {
        this.x = params.x;
        this.y = params.y;
        this.width = params.width;
        this.height = params.height;
        this.type = params.type;
        this.sprite = new JumpKickSprite(PlayerState.Idle);
    }

    public step(dt:Big) {
        const gameState = JumpKickGameState.getInstance();
        const dt2 = dt.mul(4);

        if (this.state === PlayerState.Attack) {
            this.vy = Big("0.06");
        } else {
            this.vy = this.vy.add(this.ay.add(gameState.gravityAY).mul(dt2).div(2))
        }
        this.vx = this.vx.add(this.ax.mul(dt2).div(2))

        this.x = this.x.add(this.vx.mul(dt2));
        this.y = this.y.add(this.vy.mul(dt2));

        if (this.isTouchingGround()) {
            this.y = gameState.groundY.minus(this.height);
            this.vy = Big(0);
            this.vx = Big(0);
            this.state = PlayerState.Idle;
        }

        this.sprite.step(dt);
    }

    public jump() {
        if (this.isTouchingGround()) {
            this.vy = Big("-0.15");
            this.state = PlayerState.Jump;
        }
    }

    public kick() {
        if (!this.isTouchingGround()) {
            const gameState = JumpKickGameState.getInstance();
            const opponent = gameState.getOpponent(this);
            this.state = PlayerState.Attack;
            this.vx = Big("0.02").mul(opponent.x.gt(this.x) ? 1 : -1);
        }
    }

    public isTouchingGround() {
        return this.y.plus(this.height).gte(JumpKickGameState.getInstance().groundY);
    }

    public serialize() {
        return {
            x: this.x.toFixed(0),
            y: this.y.toFixed(0),
            width: this.width.toFixed(),
            height: this.height.toFixed(),
            sprite: this.sprite.serialize(),
        }
    }

    private set state(val:PlayerState) {
        this._state = val;
        this.sprite.spriteName = val;
        this.sprite.loop = val === PlayerState.Idle;
    }

    private get state() {
        return this._state;
    }
}
