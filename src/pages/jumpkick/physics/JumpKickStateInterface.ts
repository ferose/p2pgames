import Big from 'big.js';

export interface IPhysicsObject {
    step(dt: Big) : void;
    serialize() : any;
}

export enum JumpKickInputType {
    redJump,
    redKick,
    blueJump,
    blueKick,
}