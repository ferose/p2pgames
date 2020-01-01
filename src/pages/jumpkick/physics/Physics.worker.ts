import { JumpKickConsts } from "./JumpKickConsts";
import { JumpKickGameState } from "./JumpKickGameState";
import Big from 'big.js';
import { JumpKickInputType } from "./JumpKickStateInterface";

(() => {
    const gameState = new JumpKickGameState();
    const dt = Big(1).div(JumpKickConsts.fps).mul(1000);

    onmessage = function(e) {

        switch (e.data) {
            case JumpKickInputType.redJump:
                // postMessage("red jump");
                gameState.redPlayer.jump();
                break;
            case JumpKickInputType.blueJump:
                // postMessage("blue jump");
                gameState.bluePlayer.jump();
                break;
        }
    }

    setInterval(() => {
        gameState.step(dt);
        const serializedGameState = gameState.serialize();
        postMessage(serializedGameState);
    }, Number(dt));
})();

