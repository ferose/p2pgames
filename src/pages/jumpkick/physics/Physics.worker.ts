import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import Big from 'big.js';
import { JumpKickInputType } from "./JumpKickStateInterface";

(() => {
    const gameState = JumpKickGameState.getInstance();
    const dt = Big(1).div(JumpKickConsts.fps).mul(1000);

    onmessage = function(e) {
        switch (e.data) {
            case JumpKickInputType.leftJump:
                gameState.redPlayer.jump();
                break;
            case JumpKickInputType.rightJump:
                gameState.bluePlayer.jump();
                break;
            case JumpKickInputType.leftKick:
                gameState.redPlayer.kick();
                break;
            case JumpKickInputType.rightKick:
                gameState.bluePlayer.kick();
                break;
        }
    }

    setInterval(() => {
        gameState.step(dt);
        const serializedGameState = gameState.serialize();
        postMessage(serializedGameState);
    }, Number(dt));
})();

