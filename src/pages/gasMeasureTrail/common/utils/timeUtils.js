var dayjs = require('dayjs');
var dayOfYear = require('dayjs/plugin/dayOfYear')
dayjs.extend(dayOfYear);
var weekday = require('dayjs/plugin/weekday')
dayjs.extend(weekday)
var weekYear = require('dayjs/plugin/weekYear')
dayjs.extend(weekYear)
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

export function getDefaultWeekRange(weeknum = 11) {//例如 最近12周
    const endDayofYear = dayjs(endDay).dayOfYear()-7
    const endDay = dayjs().dayOfYear(endDayofYear)
    // const endDay = dayjs().weekday(6)
    const dayofYear = dayjs(endDay).dayOfYear(); //今天的前一周是第几天
    const startDay = dayjs().dayOfYear(dayofYear - 7 * weeknum-1); 
    console.log('startDay', startDay.$d, 'endDay', endDay.$d)
    return [startDay.$d, endDay.$d]
}

export function getDefaultDayRange(daynum = 7) {//例如 最近12天
    const startDay = dayjs().dayOfYear(dayjs().dayOfYear() - daynum );
    const endDay = dayjs().dayOfYear(dayjs().dayOfYear() -  1);
    const dayRangeValue = [dayjs(startDay).format('YYYY/MM/DD'), dayjs(endDay).format('YYYY/MM/DD')];
    console.log('dayRangeValue', dayRangeValue)
    return dayRangeValue;
}
export function geFormatWeek(data) { // 2020/01
    if(dayjs(data).year() === 2021) {
        return `${dayjs(data).year()}/${(dayjs(data).week() - 1).toString().padStart(2, '0')}`
    }
    return `${dayjs(data).year()}/${(dayjs(data).week().toString().padStart(2, '0'))}`
}
export function getDefaultDay() { //上一天
    const dayofYear = dayjs().dayOfYear()-1
    const endDay = dayjs().dayOfYear(dayofYear)
    return dayjs(endDay).format('YYYY/MM/DD')
}

export function getDefaultWeek() { //上一周
    const dayofYear = dayjs().dayOfYear()-7
    const endDay = dayjs().dayOfYear(dayofYear)
    return dayjs(endDay).format('YYYY/MM/DD')
}

export function getDefaultYear() {
    console.log('year', dayjs().year())
    return (dayjs().year() - 1).toString()
}

export function weekLimitRange() { }
export function dayLimitRange() { }
export function yearLimitRange() { }
