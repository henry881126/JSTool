// 判断身份证
isCardNo(num) {
    num = num.toUpperCase()
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
        return false
    }
    let len, re
    len = num.length
    if (len === 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
        let arrSplit = num.match(re)

        let dtmBirth = new Date(
            '19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]
        )
        let bCorrectDay
        bCorrectDay =
            dtmBirth.getYear() === Number(arrSplit[2]) &&
            dtmBirth.getMonth() + 1 === Number(arrSplit[3]) &&
            dtmBirth.getDate() === Number(arrSplit[4])
        if (!bCorrectDay) {
            return false
        } else {
            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
            let nTemp = 0
            let i
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6)
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i]
            }
            num += arrCh[nTemp % 11]
            return true
        }
    }
    if (len === 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
        let arrSplit = num.match(re)
        let dtmBirth = new Date(
            arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]
        )
        let bCorrectDay =
            dtmBirth.getFullYear() === Number(arrSplit[2]) &&
            dtmBirth.getMonth() + 1 === Number(arrSplit[3]) &&
            dtmBirth.getDate() === Number(arrSplit[4])
        if (!bCorrectDay) {
            return false
        } else {
            let valnum
            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
            let nTemp = 0

            for (let i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i]
            }
            valnum = arrCh[nTemp % 11]
            if (valnum !== num.substr(17, 1)) {
                return false
            }
            return true
        }
    }
    return false
},
// 根据身份证获取年龄
getAge(id) {
    if (isNaN(id)) return
    var ic = String(id)
    var myDate = new Date()
    var month = myDate.getMonth() + 1
    var day = myDate.getDate()
    var age = ''
    ic.substring(7)
    if (ic.length === 15) {
        age = myDate.getFullYear() - (1900 + ic.substring(6, 8) / 1) - 1
        if (ic.substring(8, 10) <= month && ic.substring(10, 12) <= day) {
            age++
        }
    } else if (ic.length === 18) {
        age = myDate.getFullYear() - ic.substring(6, 10) - 1
        if (ic.substring(10, 12) <= month && ic.substring(12, 14) <= day) {
            age++
        }
    }
    return age
},
// 获取当前时间
getTime() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    // 这样写显示时间在1~9会挤占空间；所以要在1~9的数字前补零;
    if (hour < 10) {
        hour = '0' + hour
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }

    let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    return time
},
