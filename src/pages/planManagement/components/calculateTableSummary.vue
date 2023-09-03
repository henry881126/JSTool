<script>
export default {
    methods:{
        calcSummary(param) {
            console.log('param 22222',param)
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                // 首列显示文本
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                // 不参数求和的列
                if ([1,2,6].indexOf(index) != -1) {
                    return
                }
                // 将所有行中参与合计列(即不包含上面0、1、2、6)的字段值转换成数值型
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    // 遍历参与合计的行，求和
                    sums[index] = values.reduce((prev, curr) => {
                        console.log('prev:',prev,'curr:',curr)
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                } else {
                    sums[index] = '';          
                }
            });      
            return sums
        }
    }
}
</script>