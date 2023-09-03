<script>
export default {
  name: "mergeTable",
  methods: {
    mTableMerge: function ({ rowIndex, columnIndex, row, column }) {
      let prop = column.property;
      let table = this.mTable['list'];
      let lastRow = table[rowIndex - 1];
      if (columnIndex === 0) {
        if (rowIndex > 0 && lastRow[prop] === row[prop]) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === table.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (row[prop] === table[rowIndex + rowspan][prop]) {
            rowspan++
            if(rowIndex + rowspan >= table.length) {
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
        let lastKey = 'time'
        prop = 'lifnrTxt'
        if (rowIndex > 0 && lastRow[prop] === row[prop] && lastRow[lastKey] === row[lastKey]) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === table.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (row[prop] === table[rowIndex + rowspan][prop] && table[rowIndex + rowspan][lastKey] === row[lastKey]) {
            rowspan++
            if(rowIndex + rowspan >= table.length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
    },
    qTableMerge: function ({ rowIndex, columnIndex, row, column }) {
      let prop = column.property;
      let table = this.qTable['list'];
      let lastRow = table[rowIndex - 1];
      if (columnIndex === 0) {
        if (rowIndex > 0 && lastRow[prop] === row[prop]) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === table.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (row[prop] === table[rowIndex + rowspan][prop]) {
            rowspan++
            if(rowIndex + rowspan >= table.length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
      if (columnIndex === 1) {
        let lastKey = 'compCodeTxt'
        if (rowIndex > 0 && lastRow[prop] === row[prop] && lastRow[lastKey] === row[lastKey]) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === table.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (row[prop] === table[rowIndex + rowspan][prop] && table[rowIndex + rowspan][lastKey] === row[lastKey]) {
            rowspan++
            if(rowIndex + rowspan >= table.length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
    },
    yTableMerge: function ({ rowIndex, columnIndex, row, column }) {
      let prop = column.property;
      let table = this.yTable['list'];
      let lastRow = table[rowIndex - 1];
      if (columnIndex === 0) {
        if (rowIndex > 0 && lastRow[prop] === row[prop]) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === table.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (row[prop] === table[rowIndex + rowspan][prop]) {
            rowspan++
            if(rowIndex + rowspan >= table.length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
      if (columnIndex === 1) {
        let lastKey = 'lifnrTxt'
        if (rowIndex > 0 && lastRow[prop] === row[prop] && lastRow[lastKey] === row[lastKey]) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if(rowIndex === table.length - 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          let rowspan = 1;
          while (row[prop] === table[rowIndex + rowspan][prop] && table[rowIndex + rowspan][lastKey] === row[lastKey]) {
            rowspan++
            if(rowIndex + rowspan >= table.length) {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1
          }
        }
      }
    },
  }
}
</script>