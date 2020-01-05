import * as React from 'react';
import styles from './JumpKick.module.scss';
import { JumpKickConsts } from './physics/JumpKickConsts';
import WebpackWorker from './physics/Physics.worker.ts';
import { JumpKickSerializedGameState } from './physics/JumpKickGameState';
import { JumpKickInputType } from './physics/JumpKickStateInterface';
import Texture from './texture.json';
import { store } from '../../Store';
import { setInGameAction } from '../../duck/actions';
import { ObjectWithValues } from '../../utilities/Types';

interface IJumpKickProps {}
interface IJumpKickState {}

export class JumpKick extends React.Component<IJumpKickProps, IJumpKickState> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private physicsWorker: Worker;
    private lastState?: JumpKickSerializedGameState;
    private images: ObjectWithValues<HTMLImageElement> = {};

    public constructor(props: IJumpKickProps) {
        super(props);
        this.canvasRef = React.createRef();

        this.physicsWorker = new WebpackWorker();
        this.physicsWorker.addEventListener("message", this.onMessage);

        const imageNames = [
            "texture.png",
            "jumpkickbg0.svg",
            "jumpkickbg1.svg",
            "jumpkickbg2.svg",
            "jumpkickbg3.svg",
            "jumpkickbg4.svg",
        ]
        for (const name of imageNames) {
            const image = new Image(1, 1);
            image.src = "img/" + name;
            this.images[name] = image;
        }
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

        ctx.fillStyle = "#7a7c92";
        ctx.fillRect(0, 0, Number(JumpKickConsts.width), Number(JumpKickConsts.height));

        // ctx.fillStyle = "#DDEDAA";
        // ctx.fillRect(0, this.lastState.groundY, Number(JumpKickConsts.width), Number(JumpKickConsts.height.minus(this.lastState.groundY)));

        const parallaxMult = [
            1,
            0.75,
            0.25,
            0,
            0
        ];
        for (let i = parallaxMult.length-1; i >= 0; i--) {
            ctx.drawImage(this.images[`jumpkickbg${i}.svg`],
            Math.round(Number(this.lastState.viewport.x)*parallaxMult[i]), Number(this.lastState.viewport.y), Number(this.lastState.viewport.width), Number(this.lastState.viewport.height),
            0, 0, Number(JumpKickConsts.width), Number(JumpKickConsts.height));
        }

        const players = [this.lastState.redPlayer, this.lastState.bluePlayer];

        for (const player of players) {
            ctx.save();
            const s = Texture.frames[player.sprite as "Idle_000.png"].frame;
            // ctx.translate(-Number(player.x) + Number(s.w)/2, 0);
            const scaleX = player.flip ? -1 : 1;
            if (player.flip) {
                ctx.scale(-1, 1);
            }
            ctx.drawImage(this.images["texture.png"],
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

            case "ArrowUp":
                keyType = JumpKickInputType.viewportUp;
                break;
            case "ArrowDown":
                keyType = JumpKickInputType.viewportDown;
                break;
            case "ArrowLeft":
                keyType = JumpKickInputType.viewportLeft;
                break;
            case "ArrowRight":
                keyType = JumpKickInputType.viewportRight;
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
