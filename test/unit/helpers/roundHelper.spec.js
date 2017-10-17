import Big from 'big.js';

import { round,  roundAsBig } from '~/helpers/roundHelper';
import {
  ROUNDING_TYPE_NORMAL,
  ROUNDING_TYPE_ROUND_DOWN,
  ROUNDING_TYPE_ROUND_UP,
  ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE,
} from '~/constants';

export default function () {

  describe('Rounding Helpers', () => {

    describe('round()', () => {

      it('accept {number|string|Big} as parameter', () => {
        expect(round(1.234, 2, ROUNDING_TYPE_NORMAL)).toEqual('1.23');
        expect(round(1.235, 2, ROUNDING_TYPE_NORMAL)).toEqual('1.24');
        expect(round('1.234', 2, ROUNDING_TYPE_NORMAL)).toEqual('1.23');
        expect(round('1.235', 2, ROUNDING_TYPE_NORMAL)).toEqual('1.24');
        expect(round(Big('1.234'), 2, ROUNDING_TYPE_NORMAL)).toEqual('1.23');
        expect(round(Big('1.235'), 2, ROUNDING_TYPE_NORMAL)).toEqual('1.24');
      });

      it('round to n dp correctly', () => {
        expect(round(1.23, 0)).toEqual('1');
        expect(round(1.49, 0)).toEqual('1');
        expect(round(1.54, 0)).toEqual('2');
        expect(round(1.23, 1)).toEqual('1.2');
        expect(round(1.49, 1)).toEqual('1.5');
        expect(round(1.54, 1)).toEqual('1.5');
        expect(round(1.699, 2)).toEqual('1.70');
        expect(round(1.999, 2)).toEqual('2.00');
        expect(round(1.2, 2)).toEqual('1.20');
        expect(round(1, 2)).toEqual('1.00');
      });

      it('round down correctly', () => {
        expect(round(1.999, 0, ROUNDING_TYPE_ROUND_DOWN)).toEqual('1');
        expect(round(1.999, 1, ROUNDING_TYPE_ROUND_DOWN)).toEqual('1.9');
        expect(round(1.999, 2, ROUNDING_TYPE_ROUND_DOWN)).toEqual('1.99');
      });

      it('round up correctly', () => {
        expect(round(1.111, 0, ROUNDING_TYPE_ROUND_UP)).toEqual('2');
        expect(round(1.111, 1, ROUNDING_TYPE_ROUND_UP)).toEqual('1.2');
        expect(round(1.111, 2, ROUNDING_TYPE_ROUND_UP)).toEqual('1.12');
      });

      it('round to nearest 5 correctly', () => {
        expect(round(1.1, 0, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1');
        expect(round(1.5, 0, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('2');
        expect(round(1.24, 1, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.0');
        expect(round(1.25, 1, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.5');
        expect(round(1.74, 1, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.5');
        expect(round(1.75, 1, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('2.0');
        expect(round(1.424, 2, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.40');
        expect(round(1.425, 2, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.45');
        expect(round(1.474, 2, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.45');
        expect(round(1.475, 2, ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE)).toEqual('1.50');
      });

    });

  });

}
