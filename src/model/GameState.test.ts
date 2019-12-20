import { GameState, Circle, CircleType } from './GameState';
import { UserManager } from './UserManager';

describe('Win condition', () => {
    const gameState = new GameState({numCols:5, numRows:6, setMessage:()=>{}, userManager: new UserManager()});

    test('empty state', () => {
        expect(gameState.findWinningCircles()).toBeNull();
    })

    test('Vertical matches', () => {
        gameState.moves = [
            new Circle({x: 0, y: 1, type: CircleType.red}),
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
        ];
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 0, y: 1, type: CircleType.red}),
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
        ]);
    });

    test('Matching at start', () => {
        gameState.moves = [
            new Circle({x: 0, y: 0, type: CircleType.red}),
            new Circle({x: 0, y: 1, type: CircleType.red}),
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
        ];
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 0, y: 0, type: CircleType.red}),
            new Circle({x: 0, y: 1, type: CircleType.red}),
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
        ]);
    });

    test('Matching at end', () => {
        gameState.moves = [
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
            new Circle({x: 0, y: 5, type: CircleType.red}),
            new Circle({x: 0, y: 6, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
            new Circle({x: 0, y: 5, type: CircleType.red}),
            new Circle({x: 0, y: 6, type: CircleType.red}),
        ]);
    });

    test('Long match', () => {
        gameState.moves = [
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
            new Circle({x: 0, y: 5, type: CircleType.red}),
            new Circle({x: 0, y: 6, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
            new Circle({x: 0, y: 5, type: CircleType.red}),
            new Circle({x: 0, y: 6, type: CircleType.red}),
        ]);
    });

    test('Short match', () => {
        gameState.moves = [
            new Circle({x: 0, y: 2, type: CircleType.red}),
            new Circle({x: 0, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toBeNull();
    });

    test('Different colors', () => {
        gameState.moves = [
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 1, y: 1, type: CircleType.red}),
            new Circle({x: 1, y: 2, type: CircleType.blue}),
            new Circle({x: 1, y: 3, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toBeNull();
    });

    test('Subset match', () => {
        gameState.moves = [
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 1, y: 1, type: CircleType.red}),
            new Circle({x: 1, y: 2, type: CircleType.red}),
            new Circle({x: 1, y: 3, type: CircleType.red}),
            new Circle({x: 1, y: 4, type: CircleType.blue}),
            new Circle({x: 1, y: 5, type: CircleType.blue}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 1, y: 1, type: CircleType.red}),
            new Circle({x: 1, y: 2, type: CircleType.red}),
            new Circle({x: 1, y: 3, type: CircleType.red}),
        ]);
    });

    test('Horizontal match', () => {
        gameState.moves = [
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 2, y: 0, type: CircleType.red}),
            new Circle({x: 3, y: 0, type: CircleType.red}),
            new Circle({x: 4, y: 0, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 2, y: 0, type: CircleType.red}),
            new Circle({x: 3, y: 0, type: CircleType.red}),
            new Circle({x: 4, y: 0, type: CircleType.red}),
        ]);
    });

    test('Top left to bottom right match for top half', () => {
        gameState.moves = [
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 2, y: 1, type: CircleType.red}),
            new Circle({x: 3, y: 2, type: CircleType.red}),
            new Circle({x: 4, y: 3, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 1, y: 0, type: CircleType.red}),
            new Circle({x: 2, y: 1, type: CircleType.red}),
            new Circle({x: 3, y: 2, type: CircleType.red}),
            new Circle({x: 4, y: 3, type: CircleType.red}),
        ]);
    });

    test('Top left to bottom right match for bottom half', () => {
        gameState.moves = [
            new Circle({x: 0, y: 1, type: CircleType.red}),
            new Circle({x: 1, y: 2, type: CircleType.red}),
            new Circle({x: 2, y: 3, type: CircleType.red}),
            new Circle({x: 3, y: 4, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 0, y: 1, type: CircleType.red}),
            new Circle({x: 1, y: 2, type: CircleType.red}),
            new Circle({x: 2, y: 3, type: CircleType.red}),
            new Circle({x: 3, y: 4, type: CircleType.red}),
        ]);
    });

    test('Test bottom left to top right', () => {
        gameState.moves = [
            new Circle({x: 3, y: 1, type: CircleType.red}),
            new Circle({x: 2, y: 2, type: CircleType.red}),
            new Circle({x: 1, y: 3, type: CircleType.red}),
            new Circle({x: 0, y: 4, type: CircleType.red}),
        ]
        expect(gameState.findWinningCircles()).toEqual([
            new Circle({x: 0, y: 4, type: CircleType.red}),
            new Circle({x: 1, y: 3, type: CircleType.red}),
            new Circle({x: 2, y: 2, type: CircleType.red}),
            new Circle({x: 3, y: 1, type: CircleType.red}),
        ]);
    });
});
