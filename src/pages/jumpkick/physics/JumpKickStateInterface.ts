import Big from 'big.js';

export interface IPhysicsObject {
    step(dt: Big) : void;
    serialize() : any;
}

export enum JumpKickInputType {
    leftJump,
    leftKick,
    rightJump,
    rightKick,
}

export enum JumpKickPlayerType {
    LeftPlayer,
    RightPlayer,
}