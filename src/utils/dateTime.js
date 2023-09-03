export function getCurrentTime() {
    const day = new Date()
    day.setTime(day.getTime())
    return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
}
export function getNowTime() {
    const day = new Date()
    day.setTime(day.getTime())
    let month = day.getMonth() + 1
    month = month < 10 ? "0" + month : month
    let date = day.getDate()
    date = date < 10 ? "0" + date : date
    return day.getFullYear() + '/' + month + '/' + date
}
export function getYesterdayTime() {
    const day = new Date()
    day.setTime(day.getTime()- 24*60*60*1000)
    let month = day.getMonth() + 1;
    month = month < 10 ? "0" + month : month
    let days = day.getDate();
    days = days < 10 ? "0" + days:days 
    return day.getFullYear() + '/' + month  + '/' + days 
}
export function getLastMonthTime() {
    const day = new Date();
    day.setMonth(day.getMonth()-1);
    let month = day.getMonth() + 1;
    month = month < 10 ? "0" + month : month
    return day.getFullYear() + '/' + month
}
export function getCurrentYearTime() {
    const day = new Date()
    return day.getFullYear()
}
export function formatCurrentTime() {  // 2020/01/01格式
    const day = new Date()
    let year = day.getFullYear(); //得到年份
    let month = day.getMonth();//得到月份
    let date = day.getDate();//得到日期
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    return year + "/" + month + "/" + date;
}