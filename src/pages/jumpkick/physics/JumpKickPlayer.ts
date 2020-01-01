import { IPhysicsObject } from "./JumpKickStateInterface";

export class JumpKickPlayer implements IPhysicsObject{
    public x = 0;
    public y = 0;

    private vx = 0;
    private vy = 0.01;

    public step(dt:number) {
        this.x += this.vx*dt;
        this.y += this.vy*dt;
    }
}
