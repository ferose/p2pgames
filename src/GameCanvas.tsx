import * as React from 'react';

type Cursor = {
    x: number,
    y: number,
}

const NUM_ROWS = 6;
const NUM_COLS = 7;

export default class GameCanvas extends React.Component<any,any> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    private _cursor: Cursor | null = null;

    public constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
    }

    private get canvas() {
        return this.canvasRef.current;
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const margin = 10;
        const boardPadding = 20;
        const cellSpacing = 10;
        let width = canvas.width-margin*2;
        let cellSize = (width-boardPadding*2-cellSpacing*(NUM_COLS-1))/NUM_COLS;
        let height = boardPadding*2+cellSize*(NUM_ROWS+1)+cellSpacing*(NUM_ROWS);

        if (height > canvas.height-margin*2) {
            height = canvas.height-margin*2;
            cellSize = (height-boardPadding*2-cellSpacing*(NUM_ROWS))/(NUM_ROWS+1);
            width = boardPadding*2+cellSize*NUM_COLS+cellSpacing*(NUM_COLS-1);
        }

        if (cellSize <= 0) {
            return;
        }

        ctx.fillStyle = "yellow";
        ctx.fillRect((canvas.width-width)/2, (canvas.height-height)/2+cellSize+cellSpacing, width, height-cellSize-cellSpacing);
        ctx.strokeRect((canvas.width-width)/2, (canvas.height-height)/2+cellSize+cellSpacing, width, height-cellSize-cellSpacing);

        ctx.fillStyle = "white";
        for (let col = 0; col < NUM_COLS; col++) {
            for (let row = 1; row < NUM_ROWS+1; row++) {
                ctx.beginPath();
                ctx.arc(
                    (canvas.width-width)/2+boardPadding+col*(cellSize+cellSpacing)+cellSize/2,
                    (canvas.height-height)/2+boardPadding+row*(cellSize+cellSpacing)+cellSize/2,
                    cellSize/2,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();
            }
        }

        if (this.cursor) {
            ctx.beginPath();
            let col = Math.round((this.cursor.x-(canvas.width-width)/2-boardPadding-margin-cellSize/2+cellSpacing)/(cellSize+cellSpacing));
            if (col >= 0 && col <= NUM_COLS-1){
                ctx.arc(
                    (canvas.width-width)/2+boardPadding+col*(cellSize+cellSpacing)+cellSize/2,
                    (canvas.height-height)/2+cellSize/2,
                    cellSize/2,
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
    }

    public updateDimensions = () => {
        if (!this.canvas) {
            return;
        }
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

      /**
     * Add event listener
     */
    componentDidMount() {
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
        this.cursor = {
            x: e.clientX,
            y: e.clientY,
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
        const touch = e.touches[0];
        this.cursor = {
            x: touch.clientX,
            y: touch.clientY,
        };
    }

    public render() {
        return (
            <canvas
                ref={this.canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseMove={this.onMouseMove}
                onTouchMove={this.onTouchMove}
                onTouchStart={this.onTouchMove}
                onMouseOut={this.onMouseOut}
                onTouchEnd={this.onTouchEnd}
            ></canvas>
        );
    }
}