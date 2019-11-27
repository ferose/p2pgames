import * as React from 'react';
import './GameCanvas.css';
import { createBoardCanvas } from './canvas/BoardCanvas';
import { GameState, Circle } from './model/GameState';
import TWEEN from '@tweenjs/tween.js';

type Cursor = {
    x: number,
    y: number,
}

const numRows = 6;
const numCols = 7;

// windowEdge <magin> boardEdge <boardPadding> circle <circleSpacing> circle...
const boardPadding = 20;
const circleSpacing = 10;
const margin = 10;

export default class GameCanvas extends React.Component<any,any> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    private _cursor: Cursor | null = null;
    private boardCanvas: HTMLCanvasElement | null = null;
    private gameState = new GameState(numCols, numRows);
    private animationTweenDestination = {} as Circle;

    public constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
    }

    private get canvas() {
        return this.canvasRef.current as HTMLCanvasElement;
    }

    private getBoardDimensions() {
        const canvas = this.canvas;
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

    private draw = (time:number) => {
        window.requestAnimationFrame(this.draw);
        TWEEN.update(time);

        const canvas = this.canvas;
        if (!canvas.getContext) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const dimensions = this.getBoardDimensions();

        if (dimensions.circleSize <= 0) {
            return;
        }

        this.updateDimensions();

        const width = dimensions.width;
        const height = dimensions.height;
        const circleSize = dimensions.circleSize;

        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.cursor) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.cursor.x-5, this.cursor.y-5, 10, 10);
        }

        for (const move of this.gameState.moves) {
            if (move.alpha > 0) {
                ctx.beginPath();
                let {x, y} = move;
                // Make sure y at -1 is at the correct position up top
                if (y < 0) {
                    y *= -(-2*boardPadding-canvas.height+height-2*circleSize)/(2*circleSpacing+2*circleSize);
                }
                ctx.arc(
                    (canvas.width-width)/2+boardPadding+x*(circleSize+circleSpacing)+circleSize/2,
                    (canvas.height-height)/2+boardPadding+(y+1)*(circleSize+circleSpacing)+circleSize/2,
                    (circleSize/2)*move.scale,
                    0,
                    2 * Math.PI
                );
                ctx.globalAlpha = move.alpha;
                ctx.fillStyle = move.hexColor;
                ctx.fill();
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        if (this.gameState.animatedCircle.alpha > 0) {
            ctx.beginPath();
            let {x, y} = this.gameState.animatedCircle;
            // Make sure y at -1 is at the correct position up top
            if (y < 0) {
                y *= -(-boardPadding-circleSpacing-circleSize)/(circleSpacing+circleSize);
            }
            ctx.arc(
                (canvas.width-width)/2+boardPadding+x*(circleSize+circleSpacing)+circleSize/2,
                (canvas.height-height)/2+boardPadding+(y+1)*(circleSize+circleSpacing)+circleSize/2,
                (circleSize/2)*this.gameState.animatedCircle.scale,
                0,
                2 * Math.PI
            );
            ctx.globalAlpha = this.gameState.animatedCircle.alpha;
            ctx.fillStyle = this.gameState.animatedCircle.hexColor;
            ctx.fill();
            ctx.stroke();
            ctx.globalAlpha = 1;
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
        const dpr = window.devicePixelRatio || 1;
        if (this.canvas.width === Math.round(window.innerWidth*dpr) && this.canvas.height === Math.round(window.innerHeight*dpr)) return;
        this.canvas.width = Math.round(window.innerWidth*dpr);
        this.canvas.height = Math.round(window.innerHeight*dpr);

        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        const dimensions = this.getBoardDimensions();
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
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
        window.requestAnimationFrame(this.draw);

        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    private set cursor(c:Cursor|null) {
        this._cursor = c;
        if (this.gameState.isAnimating) return;
        if (c) {
            const canvas = this.canvas;
            const {width, height, circleSize} = this.getBoardDimensions();
            let x = Math.round((c.x-(canvas.width-width)/2-boardPadding-margin-circleSize/2+circleSpacing)/(circleSize+circleSpacing));
            let y = (canvas.height-height)/2;
            if (x >= 0 && x < numCols && c.y >= y && c.y <= y+height) {
                if (this.gameState.animatedCircle.alpha === 0) {
                    this.gameState.animatedCircle.x = x;
                }
                if (this.animationTweenDestination.x !== x) {
                    this.animationTweenDestination = {x, alpha: 1, scale: 1} as Circle;
                    new TWEEN.Tween(this.gameState.animatedCircle)
                        .to(this.animationTweenDestination, 250)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();
                }
            } else {
                if (this.animationTweenDestination.alpha !== 0) {
                    this.animationTweenDestination = {alpha: 0, scale: 1.2} as Circle;
                    new TWEEN.Tween(this.gameState.animatedCircle)
                    .to(this.animationTweenDestination, 250)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
                }
            }
        }
    }

    public clicked = () => {
        const c = this.cursor;
        if (!c) return;
        if (this.gameState.isAnimating) return;
        const canvas = this.canvas;
        const {width, circleSize} = this.getBoardDimensions();
        let x = Math.round((c.x-(canvas.width-width)/2-boardPadding-margin-circleSize/2+circleSpacing)/(circleSize+circleSpacing));
        if (!this.gameState.makeMove(x)) return;
        if (!this.gameState.lastMove) return;
        const y = this.gameState.lastMove.y;
        const distance = Math.abs(y-this.gameState.animatedCircle.y);
        new TWEEN.Tween(this.gameState.animatedCircle)
            .to({y, alpha: 1, size: 1}, (distance+3)*200)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => {
                this.gameState.completeMove();
                this.gameState.animatedCircle.alpha = 0;
                this.gameState.animatedCircle.scale = 1.2;
                if (this.cursor) {
                    const canvas = this.canvas;
                    const {width, circleSize} = this.getBoardDimensions();
                    let x = Math.round((this.cursor.x-(canvas.width-width)/2-boardPadding-margin-circleSize/2+circleSpacing)/(circleSize+circleSpacing));
                    if (x >= 0 && x <= numCols-1) {
                        this.cursor = this.cursor;
                        return;
                    }
                }
            })
            .start();
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

    private onMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        this.onMouseMove(e);
        this.clicked();
        this.cursor = null;
    }

    private onTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        this.clicked();
        this.cursor = null;
    }

    private onTouchMove = (e: React.TouchEvent) => {
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
                onMouseDown={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onMouseOut={this.onMouseOut}

                onTouchMove={this.onTouchMove}
                onTouchStart={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            ></canvas>
        );
    }
}
