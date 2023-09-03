/**
 * 保留4位小数，且去除末尾0，
 * 如：原值为123.45678，处理后为123.4568；
 *     原值为123.45000，处理后为123.45；
 *     原值为123.000，处理后为123
 */
export function reserveFourDecimal(val) {
    if(!isNaN(val)) {
        return parseFloat(val.toFixed(4))
    }
    return val
}

/**
 * 保留6位小数，且去除末尾0
 */
export function reserveSixDecimal(val) {
    if(!isNaN(val)) {
        return parseFloat(val.toFixed(6))
    }
    return val
}