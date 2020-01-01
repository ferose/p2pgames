import Big from 'big.js';

export interface IPhysicsObject {
    step(dt: Big) : void;
    serialize() : any;
}