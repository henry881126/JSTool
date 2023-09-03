
//  字典翻译
 export function publicLableValueC(data,val){
    let getLabel = ''
      data.forEach(item=>{
        if(item.value == val){
          getLabel = item.label
          
        } 
      })  
      return getLabel
  }
  // / 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
  export function groupingData(data, filed) {
    // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
    let map = {};
    // dest主要保存分组后的数据
    let dest = [];
    // 循环遍历传入的data
    data.forEach((item) => {
      // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
      if (!map[item[filed]]) {
        dest.push({
          [filed]: item[filed],
          list: [item],
        });
        // 进行一次新添对象的记录
        map[item[filed]] = item;
        // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
      } else {
        dest.forEach((dItem) => {
          if (dItem[filed] == item[filed]) {
            dItem.list.push(item);
          }
        });
      }
    });
    return dest;
  }
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

