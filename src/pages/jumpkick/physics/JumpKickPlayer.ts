import { IPhysicsObject, JumpKickPlayerType } from "./JumpKickStateInterface";
import Big from 'big.js';
import { JumpKickGameState } from "./JumpKickGameState";
import { JumpKickSprite } from "./JumpKickSprite";
import { JumpKickConsts, Box, BoxEdges } from "./JumpKickConsts";
import { BigMath } from "../../../utilities/BigMath";

enum PlayerState {
    Kick = "Kick",
    Idle = "Idle",
    Jump = "Jump",
    Dive = "Dive",
    Die = "Die",
}

export class JumpKickPlayer implements IPhysicsObject{
    public x: Big;
    public y: Big;
    public type: JumpKickPlayerType;

    private vx = Big(0);
    private vy = Big(0);
    private ax = Big(0);
    private ay = Big(0);
    private _state = PlayerState.Idle;
    private sprite: JumpKickSprite;
    private flip: Boolean;

    constructor(params: {
        x: Big,
        y: Big,
        type: JumpKickPlayerType,
        flip: Boolean
    }) {
        this.x = params.x;
        this.y = params.y;
        this.type = params.type;
        this.flip = params.flip;
        this.sprite = new JumpKickSprite(PlayerState.Idle);
    }

    private getBox(b: Box) : BoxEdges {
        if (this.flip) {
            const right = this.x.add(JumpKickConsts.playerWidth).sub(b.x);
            const left = right.sub(b.width);

            const top = this.y.plus(b.y);
            const bottom = top.add(b.height);
            return {
                left,
                top,
                bottom,
                right,
            }
        } else {
            const left = this.x.plus(b.x);
            const top = this.y.plus(b.y);
            const bottom = top.add(b.height);
            const right = left.add(b.width);
            return {
                left,
                top,
                bottom,
                right,
            }
        }
    }

    public getHitBox(): BoxEdges {
        return this.getBox(JumpKickConsts.hitbox);
    }

    public getHurtBox(): BoxEdges {
        return this.getBox(JumpKickConsts.hurtbox);
    }

    public getHeadBox(): BoxEdges {
        return this.getBox(JumpKickConsts.headbox);
    }

    public isHitWith(player: JumpKickPlayer) {
        if (this.state === PlayerState.Die) {
            // Cannot hit dead player
            return false;
        }
        if (player.state !== PlayerState.Kick) {
            // Can only hit while kicking
            return false;
        }
        const hitbox = this.getHitBox();
        const hurtbox = player.getHurtBox();
        return hurtbox.right < hitbox.right &&
            hurtbox.right > hitbox.left &&
            hurtbox.bottom < hitbox.bottom &&
            hurtbox.bottom > hitbox.top;
    }

    public step(dt:Big) {
        const gameState = JumpKickGameState.getInstance();
        const dt2 = dt.mul(4);

        if (this.state === PlayerState.Kick) {
            this.vy = Big("0.10");
        } else {
            this.vy = this.vy.add(this.ay.add(gameState.gravityAY).mul(dt2).div(2))
        }

        const velocityLimit = Big("0.075");
        if (this.vy.gt(velocityLimit)) {
            this.vy = velocityLimit;
        }

        this.vx = this.vx.add(this.ax.mul(dt2).div(2))

        this.x = this.x.add(this.vx.mul(dt2));
        this.y = this.y.add(this.vy.mul(dt2));

        const {viewport} = gameState;
        if (this.x.plus(JumpKickConsts.hitbox.x) < viewport.x && this.vx < BigMath.zero) {
            this.x = viewport.x.minus(JumpKickConsts.hitbox.x);
        }
        else if (this.x.minus(JumpKickConsts.hitbox.x).plus(JumpKickConsts.playerWidth) > viewport.x.plus(viewport.width) && this.vx > BigMath.zero) {
            this.x = viewport.x.plus(viewport.width).minus(JumpKickConsts.playerWidth).plus(JumpKickConsts.hitbox.x);
        }

        if (this.isTouchingGround()) {
            this.y = gameState.groundY.minus(JumpKickConsts.playerHeight);
            this.vy = Big(0);
            this.vx = Big(0);
            if (this.state !== PlayerState.Die) {
                this.state = PlayerState.Idle;
                this.updateFlip();
            }
        }

        this.sprite.step(dt);
    }

    public jump() {
        if (this.state === PlayerState.Die) return;
        if (this.isTouchingGround()) {
            this.vy = Big("-0.15");
            this.state = PlayerState.Jump;
        }
    }

    public kick() {
        if (this.state === PlayerState.Die) return;
        const gameState = JumpKickGameState.getInstance();
        const opponent = gameState.getOpponent(this);
        if (this.isTouchingGround()) {
            this.state = PlayerState.Dive;
            this.vy = Big("-0.13");
            this.vx = Big("-0.03").mul(opponent.x.gt(this.x) ? 1 : -1);
        } else if (this.state === PlayerState.Jump) {
            this.state = PlayerState.Kick;
            this.vx = Big("0.04").mul(opponent.x.gt(this.x) ? 1 : -1);
        }
    }

    public isTouchingGround() {
        return this.y.plus(JumpKickConsts.playerHeight).gte(JumpKickGameState.getInstance().groundY);
    }

    private updateFlip() {
        const opponent = JumpKickGameState.getInstance().getOpponent(this);
        this.flip = this.x.gt(opponent.x);
    }

    private serializeEdges(edges: BoxEdges) {
        const viewport = JumpKickGameState.getInstance().viewport;
        return {
            left: edges.left.sub(viewport.x).toFixed(0),
            top: edges.top.sub(viewport.y).toFixed(0),
            right: edges.right.sub(viewport.x).toFixed(0),
            bottom: edges.bottom.sub(viewport.y).toFixed(0),
        }
    }

    public die() {
        this.state = PlayerState.Die;
    }

    public serialize() {
        const viewport = JumpKickGameState.getInstance().viewport;
        return {
            x: this.x.sub(viewport.x).toFixed(0),
            y: this.y.sub(viewport.y).toFixed(0),
            width: JumpKickConsts.playerWidth.toFixed(),
            height: JumpKickConsts.playerHeight.toFixed(),
            sprite: this.sprite.serialize(),
            flip: this.flip,

            // TODO Remove after debugging
            hitbox: this.serializeEdges(this.getHitBox()),
            headbox: this.serializeEdges(this.getHeadBox()),
            hurtbox: this.serializeEdges(this.getHurtBox()),
        }
    }

    private set state(val:PlayerState) {
        this._state = val;
        this.sprite.loop = val === PlayerState.Idle;
        let spriteName = val;
        if (val === PlayerState.Dive) {
            spriteName = PlayerState.Jump;
        }
        this.sprite.spriteName = spriteName;
    }

    private get state() {
        return this._state;
    }
}
