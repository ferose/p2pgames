import * as React from 'react';
import styles from './JumpKick.module.scss';

interface IJumpKickProps {}
interface IJumpKickState {}

export class JumpKick extends React.Component<IJumpKickProps, IJumpKickState> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    public constructor(props: IJumpKickProps) {
        super(props);
        this.canvasRef = React.createRef();
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

    componentDidMount() {
        window.requestAnimationFrame(this.draw);
    }

    public render() {
        return (
            <canvas
                ref={this.canvasRef}
                width="256"
                height="224"
                className={styles.container}
            ></canvas>
        )
    }
}
