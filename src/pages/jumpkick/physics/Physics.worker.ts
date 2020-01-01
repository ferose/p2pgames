import { JumpKickConsts } from "../JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";

(() => {
    const gameState = new JumpKickGameState();
    const dt = (1/JumpKickConsts.fps)*1000;
    setInterval(() => {
        gameState.step(dt);
        postMessage(gameState);
    }, dt);
})();

