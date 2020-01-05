import Big from "big.js";

export class BigMath {
    public static one = Big(1);
    public static zero = Big(0);

    public static min(...values:Big[]) {
        let minVal = values[0];
        for (let i = 1; i < values.length; i++) {
            const v = values[i];
            if (v.lt(minVal)) {
                minVal = v;
            }
        }
        return minVal;
    };

    public static max(...values:Big[]) {
        let maxVal = values[0];
        for (let i = 1; i < values.length; i++) {
            const v = values[i];
            if (v.gt(maxVal)) {
                maxVal = v;
            }
        }
        return maxVal;
    };

    public static mean(...values:Big[]) {
        let avg = BigMath.zero;
        let t = BigMath.one;
        for (const x of values) {
            avg = avg.add(x.minus(avg).div(t));
            t = t.add(BigMath.one);
        }
        return avg;
    };
}
