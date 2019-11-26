import * as React from 'react';
import './GameCanvas.css';
import { createBoardCanvas } from './canvas/BoardCanvas';
import { GameState } from './model/GameState';
import { disableBodyScroll } from 'body-scroll-lock';

type Cursor = {
    x: number,
    y: number,
}

const numRows = 6;
const numCols = 7;
const boardPadding = 20;
const circleSpacing = 10;
const margin = 10;

export default class GameCanvas extends React.Component<any,any> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    private _cursor: Cursor | null = null;
    private boardCanvas: HTMLCanvasElement | null = null;
    private gameState = new GameState();

    public constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
    }

    private get canvas() {
        return this.canvasRef.current;
    }

    private getBoardDimensions() {
        const canvas = this.canvas;
        if (!canvas) {
            return null;
        }
        let width = canvas.width-margin*2;
        let circleSize = (width-boardPadding*2-circleSpacing*(numCols-1))/numCols;
        let height = boardPadding*2+circleSize*(numRows+1)+circleSpacing*(numRows);

        if (height > canvas.height-margin*2) {
            height = canvas.height-margin*2;
            circleSize = (height-boardPadding*2-circleSpacing*(numRows))/(numRows+1);
            width = boardPadding*2+circleSize*numCols+circleSpacing*(numCols-1);
        }
        return {width, height, circleSize};
    }

    private draw = () => {
        window.requestAnimationFrame(this.draw);

        const canvas = this.canvas;
        if (!canvas || !canvas.getContext) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const dimensions = this.getBoardDimensions();

        if (!dimensions || dimensions.circleSize <= 0) {
            return;
        }

        this.updateDimensions();

        const width = dimensions.width;
        const height = dimensions.height;
        const circleSize = dimensions.circleSize;

        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.cursor) {
            ctx.beginPath();
            let col = Math.round((this.cursor.x-(canvas.width-width)/2-boardPadding-margin-circleSize/2+circleSpacing)/(circleSize+circleSpacing));
            if (col >= 0 && col <= numCols-1){
                ctx.arc(
                    (canvas.width-width)/2+boardPadding+col*(circleSize+circleSpacing)+circleSize/2,
                    (canvas.height-height)/2+circleSize/2,
                    circleSize/2,
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = "#d2a3a9";
                ctx.fill();
                ctx.stroke();
            }

            ctx.fillStyle = "red";
            ctx.fillRect(this.cursor.x-5, this.cursor.y-5, 10, 10);
        }

        if (this.boardCanvas) {
            ctx.drawImage(
                this.boardCanvas,
                (canvas.width-this.boardCanvas.width)/2,
                (canvas.height-this.boardCanvas.height)/2 + (circleSize + circleSpacing)/2
            );
        }

        ctx.restore();
    }

    public updateDimensions = () => {
        if (!this.canvas) return;
        const dpr = window.devicePixelRatio || 1;
        if (this.canvas.width === Math.round(window.innerWidth*dpr) && this.canvas.height === Math.round(window.innerHeight*dpr)) return;
        this.canvas.width = Math.round(window.innerWidth*dpr);
        this.canvas.height = Math.round(window.innerHeight*dpr);

        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        const dimensions = this.getBoardDimensions();
        if (!dimensions) return;
        this.boardCanvas = createBoardCanvas({
            numCols,
            numRows,
            boardPadding,
            circleSpacing,
            maxWidth: dimensions.width,
            maxHeight: dimensions.height,
        });
    }

      /**
     * Add event listener
     */
    componentDidMount() {
        if (this.canvas) {
            disableBodyScroll(this.canvas);
        }
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
        window.requestAnimationFrame(this.draw);
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    private set cursor(c:Cursor|null) {
        this._cursor = c;
    }

    private get cursor() {
        return this._cursor;
    }

    private onMouseMove = (e: React.MouseEvent) => {
        const dpr = window.devicePixelRatio || 1;
        this.cursor = {
            x: e.clientX*dpr,
            y: e.clientY*dpr,
        }
    }

    private onMouseOut = (e: React.MouseEvent) => {
        this.cursor = null;
    }

    private onTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        this.cursor = null;
    }

    private onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        const dpr = window.devicePixelRatio || 1;
        const touch = e.touches[0];
        this.cursor = {
            x: touch.clientX*dpr,
            y: touch.clientY*dpr,
        };
    }

    public render() {
        return (
            <canvas
                ref={this.canvasRef}
                width={1}
                height={1}
                onMouseMove={this.onMouseMove}
                onTouchMove={this.onTouchMove}
                onTouchStart={this.onTouchMove}
                onMouseOut={this.onMouseOut}
                onTouchEnd={this.onTouchEnd}
            ></canvas>
        );
    }
}
