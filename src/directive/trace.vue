<script>
import Vue from 'vue'
// import store from '../store'

/**
 * 全局自定义指令，指令名称：trace
 * el 自定义指定所在对象
 * params 模板向指令传递的参数，参数在value对象中
 */
export default Vue.directive('trace',{
    bind:(el,params) => {
        let initialParams = {
            value:{
                props:'',         // 属性名称集合，对象类型
                title:'',       // 事件名称
            }
        }
        params = {...initialParams,...params}
        el.addEventListener('click',() => {
            // let action = params.value.name || el.textContent || el.innerHTML || '页面内元素单击事件'
            // let title = '智慧分销 - ' + store.getters.currentMenu
            let title = params.value.title
            let props = params.value.props
            // let { module,action } = params.value
            // console.log('el:',el)
            // console.log('params',params)
            // console.log('el title:',title,'company:',store.getters.curComName,'loginname',store.getters.loginName,'menu:',store.getters.currentMenu)
            window.zhuge.track(title,props)        
      })
    }
})
</script>