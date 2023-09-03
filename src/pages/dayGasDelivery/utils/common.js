
export function getFormatTime(timestamp) {
    let date = new Date(timestamp);
    let yyyy = date.getFullYear();
    let mm =
      date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return yyyy + "-" + mm + "-" + dd;
  }
export function getCusYear(strDate) {
    if (strDate && strDate.length === 0) return "";
    let date = new Date(strDate);
    let y = date.getFullYear();
    let m = date.getMonth() + 1 + "";
    let d = date.getDate() + "";
    return (
      y +
      "/" +
      (m.length === 1 ? "0" + m : m) +
      "/" +
      (d.length === 1 ? "0" + d : d)
    );
  }
export function getCusYear1(strDate) {
    if (strDate && strDate.length === 0) return "";
    let date = new Date(strDate);
    let y = date.getFullYear();
    let m = date.getMonth() + 1 + "";
    let d = date.getDate() + "";
    return (
      y +
      "-" +
      (m.length === 1 ? "0" + m : m) +
      "-" +
      (d.length === 1 ? "0" + d : d)
    );
  }
  export function yanzhdate(arr) {
    let startTimeArr = []
    let endTimeArr = []
    arr.forEach(item=>{
      startTimeArr.push(item.startTime ? new Date(item.startTime).getTime() : '')
      endTimeArr.push(item.endTime ? new Date(item.endTime).getTime() : '')
    })
    let allStartTime = startTimeArr.sort() // 排序
    let allEndTime = endTimeArr.sort()
    let result = 0 // 判断时间是否有重复区间
    for (let k = 0; k < allStartTime.length; k++) {
      if (k > 0) {
        if (allStartTime[k] <= allEndTime[k - 1]) {
          result += 1
        }
      }
    }
    return result > 0
  }
   /** 获取两个日期之间的间隔日期
 * @param { Date | number | string } startTime 开始时间 标准时间格式 时间戳格式 字符串格式(2008-08-08,2008-8-8,2008-08-8,2008-8-08)
 * @param { Date | number | string } endTime 结束时间 标准时间格式 时间戳格式 字符串格式(2008-08-08,2008-8-8,2008-08-8,2008-8-08)
 *  */
    export function getBetweenDate(startTime,endTime){
    // 校验时间格式
    if (typeof startTime === 'string') {
        const reg = /^\d{4}-(0?[1-9]|1[0-2])-((0?[1-9])|((1|2)[0-9])|30|31)$/g
        if (!reg.test(startTime)) throw `开始时间：${startTime}时间格式错误`
    }
    if (typeof endTime === 'string') {
        const reg = /^\d{4}-(0?[1-9]|1[0-2])-((0?[1-9])|((1|2)[0-9])|30|31)$/g
        if (!reg.test(endTime)) throw `结束时间：${endTime}时间格式错误`
    }
    let start = new Date(startTime)
    let end= new Date(endTime)
    const resultTime = []
    // 当 开始时间小于结束时间的时候进入循环
    while (start <= end) {
        let getDay = start.getDate()
        // 月份需要加 1
        let getMonth = start.getMonth() + 1
        let getYear = start.getFullYear()
        /**
         * 拼接时间格式
         * (getMonth >= 10 ? `${getMonth}` : `0${getMonth}`) 自动给 小于10的时间前面补0
         */
        let setTime =
            `${getYear}-` +
            (getMonth >= 10 ? `${getMonth}` : `0${getMonth}`) +
            '-' +
            (getDay >= 10 ? `${getDay}` : `0${getDay}`)

        resultTime.push(setTime)
        /**
         * 重新设置开始时间
         * 使用 setFullYear() 方法会自动将时间累加，返回的是时间戳格式
         * 使用 new Date() 将时间重新设置为标准时间
         * getMonth - 1 将月份时间重新还原
         */
        start = new Date(start.setFullYear(getYear, getMonth - 1, getDay + 1))
    }
    return resultTime
}

