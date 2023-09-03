<script>
export default {
  name: "spanMerge",
  methods: {
    objectSpanMethod({ rowIndex, columnIndex, row }) {
      if (columnIndex === 0 || columnIndex === 10) {
        let date = row.reportTime;
        if (rowIndex > 0 && this.replyTable['list'][rowIndex - 1].reportTime === date) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === this.replyTable['list'].length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (date === this.replyTable['list'][rowIndex + rowspan].reportTime) {
            rowspan++
            if(rowIndex + rowspan >= this.replyTable['list'].length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
      if (columnIndex === 1 || columnIndex === 2) {
        let compCode = row.compCode;
        let date = row.reportTime
        if (rowIndex > 0 && this.replyTable['list'][rowIndex - 1].compCode === compCode && this.replyTable['list'][rowIndex - 1].reportTime === date) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === this.replyTable['list'].length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (compCode === this.replyTable['list'][rowIndex + rowspan].compCode && this.replyTable['list'][rowIndex + rowspan].reportTime === date) {
            rowspan++
            if(rowIndex + rowspan >= this.replyTable['list'].length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>