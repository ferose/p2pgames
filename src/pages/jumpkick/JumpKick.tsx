import * as React from 'react';
import styles from './JumpKick.module.scss';
import { JumpKickConsts } from './physics/JumpKickConsts';
import WebpackWorker from './physics/Physics.worker.ts';
import { JumpKickSerializedGameState } from './physics/JumpKickGameState';
import { JumpKickInputType } from './physics/JumpKickStateInterface';
import Texture from './texture.json';
import { store } from '../../Store';
import { setInGameAction } from '../../duck/actions';

interface IJumpKickProps {}
interface IJumpKickState {}

export class JumpKick extends React.Component<IJumpKickProps, IJumpKickState> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private physicsWorker: Worker;
    private lastState?: JumpKickSerializedGameState;
    private texture: HTMLImageElement;

    public constructor(props: IJumpKickProps) {
        super(props);
        this.canvasRef = React.createRef();

        this.physicsWorker = new WebpackWorker();
        this.physicsWorker.addEventListener("message", this.onMessage);

        const image = new Image(1, 1);
        image.src = "img/texture.png";
        this.texture = image;
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

        ctx.fillStyle = "#D7816A";
        ctx.fillRect(0, 0, Number(JumpKickConsts.width), Number(JumpKickConsts.height));

        ctx.fillStyle = "#DDEDAA";
        ctx.fillRect(0, this.lastState.groundY, Number(JumpKickConsts.width), Number(JumpKickConsts.height.minus(this.lastState.groundY)));

        const players = [this.lastState.redPlayer, this.lastState.bluePlayer];

        for (const player of players) {
            ctx.save();
            const s = Texture.frames[player.sprite as "Idle_000.png"].frame;
            // ctx.translate(-Number(player.x) + Number(s.w)/2, 0);
            const scaleX = player.flip ? -1 : 1;
            if (player.flip) {
                ctx.scale(-1, 1);
            }
            ctx.drawImage(this.texture,
                Number(s.x), Number(s.y), Number(s.w), Number(s.h),
                scaleX*Number(player.x), Number(player.y), scaleX*Number(s.w), Number(s.h));
            ctx.restore();
        }


        ctx.restore();
    }

    private onMessage = (event: MessageEvent) => {
        this.lastState = event.data;
    }

    componentDidMount() {
        window.requestAnimationFrame(this.draw);
        window.addEventListener("keydown", this.onKeyDown);
        store.dispatch(setInGameAction(true));
    }

    componentWillUnmount() {
        this.physicsWorker.terminate();
        window.removeEventListener("keydown", this.onKeyDown);
    }

    private onKeyDown = (event: KeyboardEvent) => {
        let keyType: JumpKickInputType|null = null;
        switch (event.key) {
            case "a":
                keyType = JumpKickInputType.redJump;
                break;
            case "s":
                keyType = JumpKickInputType.redKick;
                break;
            case "k":
                keyType = JumpKickInputType.blueJump;
                break;
            case "l":
                keyType = JumpKickInputType.blueKick;
                break;
        }
        if (keyType !== null) {
            this.physicsWorker.postMessage(keyType);
        }
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
