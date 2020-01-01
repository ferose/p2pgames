import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import Big from 'big.js';

(() => {
    const gameState = new JumpKickGameState();
    const dt = Big(1).div(JumpKickConsts.fps).mul(1000);
    setInterval(() => {
        gameState.step(dt);
        const serializedGameState = gameState.serialize();
        postMessage(serializedGameState);
    }, Number(dt));
})();

