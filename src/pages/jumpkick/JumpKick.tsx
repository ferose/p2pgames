import * as React from 'react';
import styles from './JumpKick.module.scss';
import { JumpKickConsts } from './JumpKickConsts';
import WebpackWorker from './Physics.worker.ts';

interface IJumpKickProps {}
interface IJumpKickState {}

export class JumpKick extends React.Component<IJumpKickProps, IJumpKickState> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private physicsWorker: Worker;

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

        ctx.save();

        ctx.fillStyle="red";
        ctx.fillRect(0, 0, 256, 224);

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(40, 40, 20, 0, 2*Math.PI);
        ctx.fill();

        ctx.restore();
    }

    private onMessage = (event: MessageEvent) => {
        console.log(event);
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
                width={JumpKickConsts.width}
                height={JumpKickConsts.height}
                className={styles.container}
            ></canvas>
        )
    }
}
