//除法
numDiv(arg1, arg2) {
  if (arg1 && arg2 || arg1 === 0) {
    var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = 6;
    m = (r2.split(".")[1] ? r2.split(".")[1].length : 0)
      - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", ""))
      * Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal
      .toFixed(parseInt(6)));
  }
},
// 减法
Subtr(arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);

},
// 加法
accAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
},
//乘法 
accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
},


// 只允许input输入数字和固定位数的小数
checkNum(value, integerMax, digits) {
  let reg;
  if (integerMax) {
    reg = new RegExp(`^(\\-)*(\\d{${integerMax}}).*$`); // 通过 integerMax 限制整数位,
    if (!value.includes('.')) {
      value = value.replace(reg, '$1$2');
    }
  }
  if (digits) {
    reg = new RegExp(`^(-)*(\\d*)\\.(\\d{0,${digits}}).*$`); // 通过 digits 限制小数位,
    value = value.replace(reg, '$1$2.$3');
  }
  if (integerMax && digits) {
    reg = new RegExp(`^(-)*(\\d{${integerMax}}).*\\.(\\d{0,${digits}}).*$`);
  } else {
    reg = new RegExp(`^(-)*(\\d*).*\\.(\\d{0,2}).*$`);
  }

  value = value.replace(reg, '$1$2.$3');
  return value
},

inputValue(row) {
  if (this.isWanUnit) {
    row.reviewGasNum = row.reviewGasNum.replace(/[^\d.]/g, "");
    if (row.reviewGasNum.indexOf('.') != -1) {
      row.reviewGasNum = this.checkNum(row.reviewGasNum, 6, 4)
    } else {
      row.reviewGasNum = this.checkNum(row.reviewGasNum, 6, 0)
    }
  } else {
    row.reviewGasNum = row.reviewGasNum.replace(/[^\d]+/g, '').substring(0, 9)
  }
}

