import Big from 'big.js';

export type Box = {
    x: Big,
    y: Big,
    width: Big,
    height: Big,
}

export type BoxEdges = {
    left: Big,
    right: Big,
    top: Big,
    bottom: Big,
}

export const JumpKickConsts = {
    worldWidth: Big(512),
    worldHeight: Big(256),
    width: Big(256),
    height: Big(224),
    fps: Big(60),

    playerWidth: Big(105),
    playerHeight: Big(105),

    hitbox: {
        x: Big(32),
        y: Big(12),
        width: Big(43),
        height: Big(78),
    } as Box,

    headbox: {
        x: Big(39),
        y: Big(22),
        width: Big(28),
        height: Big(26),
    } as Box,

    hurtbox: {
        x: Big(61),
        y: Big(68),
        width: Big(23),
        height: Big(19),
    } as Box,
}
