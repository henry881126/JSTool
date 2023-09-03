<script>
export default {
  name: "spanMerge",
  methods: {
    objectSpanMethod({ rowIndex, columnIndex, row }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 6) {
        let date = row.time;
        if (rowIndex > 0 && this.calssificationSummary[rowIndex - 1].time === date) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === this.calssificationSummary.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (date === this.calssificationSummary[rowIndex + rowspan].time) {
            rowspan++
            if(rowIndex + rowspan >= this.calssificationSummary.length) {
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