/* 
Number("123") returns 123

Number("abc") returns NaN

Number.isFinite(...) returns false for NaN, Infinity, and -Infinity
 */
export function toNumberSafe(str, fallback = 0) {
    const num = Number(str);
    return Number.isFinite(num) ? num : fallback;
}