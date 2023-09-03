import store from '@/store'
import authList from '@/permission/authList'

/*
    elType: c (组件), e (普通元素)------default:c
    dataType: p(省) c (市)  -------- default p
 */

function authCheck(el, params, vnode) {
    let { elType = 'c', dataType = 'p' } = params.value || {}
    let isShow = false
    if (elType === 'c') {
        const compName = vnode.tag.split("-").slice(-1)[0]
        isShow = authList[compName]?.includes(dataType)
    }
    !isShow ? el.style.display = 'none': null
}

export default {
    authCheck
}
