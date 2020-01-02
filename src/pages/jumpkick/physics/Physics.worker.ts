import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import Big from 'big.js';
import { JumpKickInputType } from "./JumpKickStateInterface";

(() => {
    const gameState = JumpKickGameState.getInstance();
    const dt = Big(1).div(JumpKickConsts.fps).mul(1000);
    const dt2 = dt.mul(4);

    onmessage = function(e) {
        switch (e.data) {
            case JumpKickInputType.redJump:
                gameState.redPlayer.jump();
                break;
            case JumpKickInputType.blueJump:
                gameState.bluePlayer.jump();
                break;
            case JumpKickInputType.redKick:
                gameState.redPlayer.kick();
                break;
            case JumpKickInputType.blueKick:
                gameState.bluePlayer.kick();
                break;
        }
    }

    setInterval(() => {
        gameState.step(dt2);
        const serializedGameState = gameState.serialize();
        postMessage(serializedGameState);
    }, Number(dt));
})();

