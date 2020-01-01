import * as React from 'react';
import styles from './JumpKick.module.scss';
import { JumpKickConsts } from './physics/JumpKickConsts';
import WebpackWorker from './physics/Physics.worker.ts';
import { IJumpKickSerializedGameState } from './physics/JumpKickGameState';

interface IJumpKickProps {}
interface IJumpKickState {}

export class JumpKick extends React.Component<IJumpKickProps, IJumpKickState> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private physicsWorker: Worker;
    private lastState?: IJumpKickSerializedGameState;

    public constructor(props: IJumpKickProps) {
        super(props);
        this.canvasRef = React.createRef();

        this.physicsWorker = new WebpackWorker();
        this.physicsWorker.addEventListener("message", this.onMessage);
    }

    private get canvas() {
        return this.canvasRef.current as HTMLCanvasElement;
    }

    private draw = (time:number) => {
        window.requestAnimationFrame(this.draw);
        const canvas = this.canvas;
        if (!canvas.getContext) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        if (!this.lastState) {
            return;
        }

        ctx.save();

        ctx.clearRect(0, 0, 256, 224);

        ctx.fillStyle = "#DDEDAA";
        ctx.fillRect(0, this.lastState.groundY, Number(JumpKickConsts.width), Number(JumpKickConsts.height.minus(this.lastState.groundY)));

        const players = [this.lastState.redPlayer, this.lastState.bluePlayer];
        for (const player of players) {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        ctx.restore();
    }

    private onMessage = (event: MessageEvent) => {
        this.lastState = event.data;
    }

    componentDidMount() {
        window.requestAnimationFrame(this.draw);
    }

    componentWillUnmount() {
        this.physicsWorker.terminate();
    }

    public render() {
        return (
            <canvas
                ref={this.canvasRef}
                width={Number(JumpKickConsts.width)}
                height={Number(JumpKickConsts.height)}
                className={styles.container}
            ></canvas>
        )
    }
}
