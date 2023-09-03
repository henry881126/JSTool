/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */ 
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {AddDayCount} time
 * @param {setDate} time
 * @returns {string}
 */

export function GetDateStr(AddDayCount,setDate) {//AddDayCount：当前日期正数往后推多少天，负数往前推多少天；setDate：指定的日期，不传则默认系统时间
  var dd = setDate ? new Date(setDate) : new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
  var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
  return y+"-"+m+"-"+d;
}

/**
 * 获取固定时间格式方法HH:mm
 * @param {string} time
 * @returns {String}
 */
 export function getHoursAndMinutes(time) {
  let date,
    arr = [];
  // console.log(time)
  if (!time) {
    date = new Date();
  } else {
    arr = time.split(' ')
    if (arr.length == 1) {
      let nowDate = new Date().toLocaleDateString().slice().replace(/\//g, '-')
      let nowtime = `${nowDate} ${time}`
      date = new Date(nowtime);
    } else {
      date = new Date(time);
    }

  }
  let hour = date.getHours();
  let minute = date.getMinutes();
  if (!time) {
    if (minute == 0) {
      minute = "00";
    } else if (minute <= 15) {
      minute = "15";
    } else if (minute <= 30) {
      minute = "30";
    } else if (minute <= 45) {
      minute = "45";
    } else {
      minute = "00";
      hour = hour + 1;
    }
  }

  if (String(hour).length === 1) {
    hour = `0${hour}`;
  }
  if (String(minute).length === 1) {
    minute = `0${minute}`;
  }
  // console.log(`${hour}:${minute}`)
  // console.log("固定时间格式:", `${hour}:${minute}`);
  return `${hour}:${minute}`; // 01:00
}