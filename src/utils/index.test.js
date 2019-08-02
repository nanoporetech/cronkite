import {validateArray} from './index.js'

describe('Dashboard utils', () => {

    it('validates an array', () => {
        const symbol = Symbol('dummy')
        expect(validateArray([])).toStrictEqual([]);
        expect(validateArray({})).toStrictEqual({});
        expect(validateArray(true)).toStrictEqual(true);
        expect(validateArray("foo")).toStrictEqual("foo");
        expect(validateArray(null)).toStrictEqual(null);
        expect(validateArray(undefined)).toStrictEqual(undefined);
        expect(validateArray(symbol)).toStrictEqual(symbol);
        expect(validateArray(Infinity)).toStrictEqual(Infinity);
    })

    it('validates modifies tuples to coordinates', () => {
        expect(validateArray([[0, 1]])).toStrictEqual([{x: 0, y: 1}]);
        expect(validateArray([[0, 1], [1, 2]])).toStrictEqual([{x: 0, y: 1},{x: 1, y: 2}]);
        expect(validateArray([{x: 0, y: 1},{x: 1, y: 2}])).toStrictEqual([{x: 0, y: 1},{x: 1, y: 2}]);
    })

})