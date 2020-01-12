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

const bgImageNames = [
    "jumpkickbg0.svg",
    "jumpkickbg1.svg",
    "jumpkickbg2.svg",
    "jumpkickbg3.svg",
    "jumpkickbg4.svg",
]


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
            "texture_red.png",
            "texture_blue.png",
            ...bgImageNames
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
            ctx.drawImage(this.images[bgImageNames[i]],
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
            const texture = player === this.lastState.redPlayer ? "texture_red.png" : "texture_blue.png";
            ctx.drawImage(this.images[texture],
                Number(s.x), Number(s.y), Number(s.w), Number(s.h),
                scaleX*Number(player.x), Number(player.y), scaleX*Number(s.w), Number(s.h));

            ctx.restore();

            // ctx.save();

            // const {hitbox, hurtbox, headbox} = player;
            // ctx.fillStyle = "rgb(0,0,255,0.3)";
            // ctx.fillRect(Number(hitbox.left), Number(hitbox.top), Number(hitbox.right)-Number(hitbox.left), Number(hitbox.bottom)-Number(hitbox.top));

            // ctx.fillStyle = "rgb(255,0,0,0.3)";
            // ctx.fillRect(Number(hurtbox.left), Number(hurtbox.top), Number(hurtbox.right)-Number(hurtbox.left), Number(hurtbox.bottom)-Number(hurtbox.top));

            // ctx.fillStyle = "rgb(0,255,0,0.3)";
            // ctx.fillRect(Number(headbox.left), Number(headbox.top), Number(headbox.right)-Number(headbox.left), Number(headbox.bottom)-Number(headbox.top));

            // ctx.restore();

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
                keyType = JumpKickInputType.leftJump;
                break;
            case "s":
                keyType = JumpKickInputType.leftKick;
                break;
            case "ArrowDown":
                keyType = JumpKickInputType.rightJump;
                break;
            case "ArrowRight":
                keyType = JumpKickInputType.rightKick;
                break;
        }
        if (keyType !== null) {
            this.physicsWorker.postMessage(keyType);
        }
    }

    private onTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touches = e.touches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            if (touch.pageX < window.innerWidth/2) {
                this.physicsWorker.postMessage(JumpKickInputType.leftJump);
            } else {
                this.physicsWorker.postMessage(JumpKickInputType.leftKick);
            }
        }
    }

    public render() {
        return (
            <canvas
                ref={this.canvasRef}
                width={Number(JumpKickConsts.width)}
                height={Number(JumpKickConsts.height)}
                className={styles.container}
                onTouchStart={this.onTouchStart}
            ></canvas>
        )
    }
}
