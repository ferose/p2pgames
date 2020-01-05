import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import Big from 'big.js';
import { JumpKickInputType } from "./JumpKickStateInterface";

(() => {
    const gameState = JumpKickGameState.getInstance();
    const dt = Big(1).div(JumpKickConsts.fps).mul(1000);

    onmessage = function(e) {
        const viewportInc = Big(1);

        switch (e.data) {
            case JumpKickInputType.redJump:
                gameState.leftPlayer.jump();
                break;
            case JumpKickInputType.blueJump:
                gameState.rightPlayer.jump();
                break;
            case JumpKickInputType.redKick:
                gameState.leftPlayer.kick();
                break;
            case JumpKickInputType.blueKick:
                gameState.rightPlayer.kick();
                break;

            case JumpKickInputType.viewportUp:
                gameState.viewport.y = gameState.viewport.y.minus(viewportInc);
                break;
            case JumpKickInputType.viewportDown:
                gameState.viewport.y = gameState.viewport.y.plus(viewportInc);
                break;
            case JumpKickInputType.viewportLeft:
                gameState.viewport.x = gameState.viewport.x.minus(viewportInc);
                break;
            case JumpKickInputType.viewportRight:
                gameState.viewport.x = gameState.viewport.x.plus(viewportInc);
                break;
        }
    }

    setInterval(() => {
        gameState.step(dt);
        const serializedGameState = gameState.serialize();
        postMessage(serializedGameState);
    }, Number(dt));
})();

