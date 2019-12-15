import * as React from 'react';
import './GameCanvas.css';
import _ from 'lodash';
import { createBoardCanvas, createBlankCanvas } from './canvas/CanvasFactory';
import { GameState, Circle } from './model/GameState';
import TWEEN from '@tweenjs/tween.js';
import { UserManager } from './model/UserManager';

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

interface IGameCanvasProps {
    setMessage(status: JSX.Element): void;
}

interface IGameCanvasState {}

export default class GameCanvas extends React.Component<IGameCanvasProps,IGameCanvasState> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private divRef: React.RefObject<HTMLDivElement>;

    private _cursor: Cursor | null = null;
    private boardCanvas: HTMLCanvasElement | null = null;
    private overlayCanvas: HTMLCanvasElement | null = null;
    private overlayCanvasAlpha = 0;
    private gameState = new GameState({numCols, numRows, setMessage: this.props.setMessage});
    private animationTweenDestination = {} as Circle;
    private userManager: UserManager = new UserManager();

    public constructor(props: IGameCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.divRef = React.createRef();
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

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1;

        if (this.cursor) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.cursor.x-5, this.cursor.y-5, 10, 10);
        }

        const getCircleCoordinates = (circle:Circle) => {
            let {x, y} = circle;
            // Make sure y at -1 is at the correct position up top
            if (y < 0) {
                y *= -(-boardPadding-circleSpacing-circleSize)/(circleSpacing+circleSize);
            }
            return {
                x: (canvas.width-width)/2+boardPadding+x*(circleSize+circleSpacing)+circleSize/2,
                y: (canvas.height-height)/2+boardPadding+(y+1)*(circleSize+circleSpacing)+circleSize/2,
            }
        }

        for (const move of this.gameState.moves) {
            if (move.alpha > 0) {
                ctx.beginPath();
                const {x, y} = getCircleCoordinates(move);
                ctx.arc(x, y, (circleSize/2)*move.scale, 0, 2*Math.PI);
                ctx.globalAlpha = move.alpha;
                ctx.fillStyle = move.hexColor;
                ctx.fill();
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        if (this.gameState.animatedCircle.alpha > 0) {
            ctx.beginPath();
            const {x, y} = getCircleCoordinates(this.gameState.animatedCircle);
            ctx.arc(x, y, (circleSize/2)*this.gameState.animatedCircle.scale, 0, 2*Math.PI);
            ctx.globalAlpha = this.gameState.animatedCircle.alpha;
            ctx.fillStyle = this.gameState.animatedCircle.hexColor;
            ctx.fill();
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        let boardCanvasX = 0;
        let boardCanvasY = 0;

        if (this.boardCanvas) {
            boardCanvasX = (canvas.width-this.boardCanvas.width)/2;
            boardCanvasY = (canvas.height-this.boardCanvas.height)/2 + (circleSize + circleSpacing)/2;
            ctx.drawImage(this.boardCanvas, boardCanvasX, boardCanvasY);
        }

        if (this.overlayCanvas && this.boardCanvas && this.gameState.winningCircles) {
            const ctx2 = this.overlayCanvas.getContext('2d') as CanvasRenderingContext2D;
            ctx2.save();

            ctx2.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            ctx2.fillStyle = `rgba(0,0,0,${this.overlayCanvasAlpha})`;
            ctx2.fillRect(boardCanvasX, boardCanvasY, this.boardCanvas.width, this.boardCanvas.height);

            ctx2.globalCompositeOperation = "destination-out";
            ctx2.lineWidth = circleSize;
            ctx2.lineCap = 'round';
            ctx2.strokeStyle = 'black';
            const c1 = getCircleCoordinates(_.first(this.gameState.winningCircles) as Circle);
            const c2 = getCircleCoordinates(_.last(this.gameState.winningCircles) as Circle);
            ctx2.beginPath();
            ctx2.moveTo(c1.x, c1.y);
            ctx2.lineTo(c2.x, c2.y);
            ctx2.stroke();

            ctx2.restore();
            ctx.drawImage(this.overlayCanvas, 0, 0);
        }

        ctx.restore();
    }

    public updateDimensions = () => {
        const dpr = window.devicePixelRatio || 1;
        if (!this.divRef.current) return;
        const width = this.divRef.current.clientWidth;
        const height = this.divRef.current.clientHeight;
        if (this.canvas.width === Math.round(width*dpr) && this.canvas.height === Math.round(height*dpr)) return;
        this.canvas.width = Math.round(width*dpr);
        this.canvas.height = Math.round(height*dpr);

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        const dimensions = this.getBoardDimensions();
        this.boardCanvas = createBoardCanvas({
            numCols,
            numRows,
            boardPadding,
            circleSpacing,
            maxWidth: dimensions.width,
            maxHeight: dimensions.height,
        });

        if (this.overlayCanvas) {
            this.overlayCanvas.width = this.canvas.width;
            this.overlayCanvas.height = this.canvas.height;
        }
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
                return;
            }
        }
        if (this.animationTweenDestination.alpha !== 0) {
            this.animationTweenDestination = {alpha: 0, scale: 1.2} as Circle;
            new TWEEN.Tween(this.gameState.animatedCircle)
            .to(this.animationTweenDestination, 250)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
    }

    public clicked = () => {
        const c = this.cursor;
        if (!c) return;
        if (this.gameState.winningCircles !== null) return;
        if (this.gameState.isAnimating) return;
        if (this.animationTweenDestination.alpha === 0) return;
        const canvas = this.canvas;
        const {width, circleSize} = this.getBoardDimensions();
        let x = Math.round((c.x-(canvas.width-width)/2-boardPadding-margin-circleSize/2+circleSpacing)/(circleSize+circleSpacing));
        if (!this.gameState.makeMove(x)) return;
        if (!this.gameState.lastMove) return;
        const y = this.gameState.lastMove.y;
        const distance = Math.abs(y-this.gameState.animatedCircle.y);
        new TWEEN.Tween(this.gameState.animatedCircle)
            .to({y, alpha: 1, scale: 1} as Circle, (distance+4)*150/1)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => {
                this.gameState.completeMove();
                this.gameState.animatedCircle.alpha = 0;
                this.gameState.animatedCircle.scale = 1.2;
                this.updateTopCirclePosition();
                this.updateOverlay();
            })
            .start();
    }

    private updateTopCirclePosition() {
        const c = this.cursor
        if (c) {
            const canvas = this.canvas;
            const {width, circleSize} = this.getBoardDimensions();
            let x = Math.round((c.x-(canvas.width-width)/2-boardPadding-margin-circleSize/2+circleSpacing)/(circleSize+circleSpacing));
            if (x >= 0 && x <= numCols-1) {
                this.gameState.animatedCircle.x = x;
                this.animationTweenDestination = {x, alpha: 1, scale: 1} as Circle;
                new TWEEN.Tween(this.gameState.animatedCircle)
                    .to(this.animationTweenDestination, 250)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            }
        }
    }

    private updateOverlay() {
        // If there's no winner there's no need for an overlay
        if (!this.gameState.winningCircles) return;
        this.overlayCanvas = createBlankCanvas({
            width: this.canvas.width,
            height: this.canvas.height,
        });
        new TWEEN.Tween(this)
            .to({overlayCanvasAlpha: 0.5}, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    private get cursor() {
        return this._cursor;
    }

    private onMouseOut = (e: React.MouseEvent) => {
        this.cursor = null;
    }

    private onMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.onMouseMove(e);
        this.clicked();
    }

    private onTouchEnd = (e: React.TouchEvent) => {
        this.clicked();
        this.cursor = null;
    }

    private onMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.onMouseDown(e);
    }

    private onMouseDown = (e: React.MouseEvent) => {
        if (!this.divRef.current) return;
        const div = this.divRef.current;
        const dpr = window.devicePixelRatio || 1;
        this.cursor = {
            x: (e.pageX-div.offsetLeft)*dpr,
            y: (e.pageY-div.offsetTop)*dpr,
        }
    }

    private onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.onTouchStart(e);
    }

    private onTouchStart = (e: React.TouchEvent) => {
        if (!this.divRef.current) return;
        const div = this.divRef.current;
        const dpr = window.devicePixelRatio || 1;
        const touch = e.touches[0];
        this.cursor = {
            x: (touch.pageX-div.offsetLeft)*dpr,
            y: (touch.pageY-div.offsetTop)*dpr,
        };
    }

    public render() {
        return (
            <div className="GameCanvas" ref={this.divRef}>
                <canvas
                    ref={this.canvasRef}
                    width={1}
                    height={1}

                    onMouseMove={this.onMouseMove}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    onMouseOut={this.onMouseOut}

                    onTouchMove={this.onTouchMove}
                    onTouchStart={this.onTouchStart}
                    onTouchEnd={this.onTouchEnd}
                ></canvas>
            </div>
        );
    }
}
