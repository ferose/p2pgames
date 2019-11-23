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

        const boardPadding = 10;
        const cellSpacing = 5;
        let cellSize = (canvas.width-boardPadding*2-cellSpacing*(NUM_COLS-1))/NUM_COLS;
        let width = canvas.width;
        let height = boardPadding*2+cellSize*NUM_ROWS+cellSpacing*(NUM_ROWS-1);

        if (height > canvas.height) {
            cellSize = (canvas.height-boardPadding*2-cellSpacing*(NUM_ROWS-1))/NUM_ROWS;
            width = boardPadding*2+cellSize*NUM_COLS+cellSpacing*(NUM_COLS-1);
            height = canvas.height;
        }

        ctx.fillStyle = "yellow";
        ctx.fillRect((canvas.width-width)/2, (canvas.height-height)/2, width, height);

        ctx.fillStyle = "white";
        for (let col = 0; col < NUM_COLS; col++) {
            for (let row = 0; row < NUM_ROWS; row++) {
                ctx.fillRect(
                    (canvas.width-width)/2+boardPadding+col*(cellSize+cellSpacing),
                    (canvas.height-height)/2+boardPadding+row*(cellSize+cellSpacing),
                    cellSize,
                    cellSize);
            }
        }

        if (this.cursor) {
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