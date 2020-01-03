import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import Big from 'big.js';
import { JumpKickInputType } from "./JumpKickStateInterface";

(() => {
    const gameState = JumpKickGameState.getInstance();
    const dt = Big(1).div(JumpKickConsts.fps).mul(1000);

    onmessage = function(e) {
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
        }
    }

    setInterval(() => {
        gameState.step(dt);
        const serializedGameState = gameState.serialize();
        postMessage(serializedGameState);
    }, Number(dt));
})();

