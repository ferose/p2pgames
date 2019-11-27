/**
 * @param params.numRows number of rows
 * @param params.numCols number of columns
 * @param params.boardPadding space between board edge and circle
 * @param params.circleSpacing space between each circle
 */
export function createBoardCanvas(params: {
    numRows: number,
    numCols: number,
    boardPadding: number,
    circleSpacing: number,
    maxWidth: number,
    maxHeight: number,
}) : HTMLCanvasElement | null {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.save();

    const boardPadding = params.boardPadding;
    const circleSpacing = params.circleSpacing;

    let width = params.maxWidth;
    let circleSize = (width-boardPadding*2-circleSpacing*(params.numCols-1))/params.numCols;
    let height = boardPadding*2+circleSize*(params.numRows)+circleSpacing*(params.numRows-1);

    if (height > params.maxHeight) {
        height = params.maxHeight;
        circleSize = (height-boardPadding*2-circleSpacing*(params.numRows-1))/(params.numRows);
        width = boardPadding*2+circleSize*params.numCols+circleSpacing*(params.numCols-1);
    }

    if (circleSize <= 0) return null;

    width = Math.round(width);
    height = Math.round(height);

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeRect(0, 0, width-1, height-1);

    ctx.globalCompositeOperation = "destination-out";

    ctx.fillStyle = "white";
    for (let col = 0; col < params.numCols; col++) {
        for (let row = 0; row < params.numRows; row++) {
            ctx.beginPath();
            ctx.arc(
                boardPadding+col*(circleSize+circleSpacing)+circleSize/2,
                boardPadding+row*(circleSize+circleSpacing)+circleSize/2,
                circleSize/2,
                0,
                2 * Math.PI
            );
            ctx.fill();
            ctx.stroke();
        }
    }

    ctx.globalCompositeOperation = "source-over";

    for (let col = 0; col < params.numCols; col++) {
        for (let row = 0; row < params.numRows; row++) {
            ctx.beginPath();
            ctx.arc(
                boardPadding+col*(circleSize+circleSpacing)+circleSize/2,
                boardPadding+row*(circleSize+circleSpacing)+circleSize/2,
                circleSize/2,
                0,
                2 * Math.PI
            );
            ctx.stroke();
        }
    }

    ctx.restore();
    return canvas;
}
