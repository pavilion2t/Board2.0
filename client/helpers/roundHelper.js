import Big from 'big.js';

import {
    ROUNDING_TYPE_ROUND_DOWN,
    ROUNDING_TYPE_ROUND_UP,
    ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE } from '../constants';

export const BIGJS_ROUND_DOWN = 0;
export const BIGJS_ROUND_HALF_UP = 1;
export const BIGJS_ROUND_HALF_EVEN = 2;
export const BIGJS_ROUND_UP = 3;

export function round(num, dp, type){
    let n = Big(num);
    if (type === ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE){
        if (dp === 0){
            return n.toFixed(0);
        } else {
            return Big(n.times(2).toFixed(dp-1)).div(2).toFixed(dp);
        }
    } else if (type === ROUNDING_TYPE_ROUND_DOWN){
        return n.round(dp, BIGJS_ROUND_DOWN).toFixed(dp);
    } else if (type === ROUNDING_TYPE_ROUND_UP){
        return n.round(dp, BIGJS_ROUND_UP).toFixed(dp);
    } else {
        return n.toFixed(dp);
    }
}

export function roundAsBig(num, dp, type){
    return Big(round(num, dp, type));
}
