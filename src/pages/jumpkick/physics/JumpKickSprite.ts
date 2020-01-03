import { IPhysicsObject } from "./JumpKickStateInterface";
import Big from "big.js";

const frameInterval = Big(1000).div(8); //milliseconds

const frameCounts = {
    Attack: 6,
    Die: 12,
    Idle: 12,
    Jump: 6,
}

export class JumpKickSprite implements IPhysicsObject {
    public loop = true;

    private frame = 0;
    private elapsed = Big(0);
    private _spriteName: string;

    constructor(spriteName: string) {
        this._spriteName = spriteName;
    }

    public get spriteName() {
        return this._spriteName;
    }

    public set spriteName(val:string) {
        if (this._spriteName !== val) {
            this._spriteName = val;
            this.frame = 0;
        }
    }

    public step(dt:Big) {
        this.elapsed = this.elapsed.add(dt);
        while (this.elapsed.gte(frameInterval)) {
            this.elapsed = this.elapsed.minus(frameInterval);
            this.frame++;
        }
        const frameLength = frameCounts[this.spriteName as "Attack"];
        if (this.frame >= frameCounts[this.spriteName as "Attack"]) {
            if (this.loop) {
                this.frame = 0;
            } else {
                this.frame = frameLength-1;
            }
        }
    }

    public serialize() {
        return `${this.spriteName}_${String(this.frame).padStart(3, "0")}.png`;
    }
}