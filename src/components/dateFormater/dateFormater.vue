<script>
export default {
  name: "dateFormater",
  methods: {
    getFormatMonth: function (timestamp, sp = '-') {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
      return yyyy + sp + mm;
    },
    getFormatMonthNext: function (timestamp, sp = '-') {
      let date = new Date(timestamp);
      let yyyy = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
      let mm
      if(date.getMonth() === 11) {
        mm = '01'
      } else {
        mm = date.getMonth() < 8 ? '0' + (date.getMonth() + 2) : date.getMonth() + 2;
      }
      return yyyy + sp + mm;
    },
    getFormatMonthPre: function (timestamp, sp = '-') {
      let date = new Date(timestamp);
      let yyyy = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
      let mm
      if(date.getMonth() === 0) {
        mm = 12
      } else {
        mm = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
      }
      return yyyy + sp + mm;
    },
    getFormatYear: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      return yyyy;
    },
    getFormatYearPre: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      return yyyy - 1;
    },
    getFormatYearNext: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      return yyyy + 1;
    },
    getFormatDate: function (timestamp, sp = '-') {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
      let dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      if(sp === '年月日') {
        return yyyy + '年' + mm + '月' + dd + '日';
      } else {
        return yyyy + sp + mm + sp + dd;
      }
    },
    getFormatHours: function (timestamp, sp = '-') {
      let date = new Date(timestamp);
      let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return hh + sp + mm + sp + ss;
    },
    getFormatDateDetail: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
      let dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return yyyy + '年' + mm + '月' + dd + '日';
    },
    getFormatMonthDetail: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      return yyyy + '年' + mm + '月';
    },
    getFormatWeek: function (timestamp) {
      let date = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
      }
      return date[new Date(timestamp).getDay()]
    }
  }
}
</script>