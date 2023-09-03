import api from '@/api/index'
// login
import {loadSessionStorage, saveSessionStorage} from '@/utils/cache'

const user = {
    getters: {
        loginName: state => state.loginName,
        loginToken: state => state.loginToken,
        menuPermission: state => state.menuPermission,
        companyList: state => state.companyList,
        curCom: state => state.curCom,
        curComName: state => state.curComName,
        curComInfo: state => state.curComInfo,
        hasOverView: state => state.hasOverView,
        menu: state => state.menu,
        currentMenu: state => state.currentMenu,
        userInfo: state => state.userInfo,
        navIsCollapse: state => state.navIsCollapse,
        theme: state => state.theme,
        currentUrl: state => state.currentUrl,
        qiyuanToken: state => state.qiyuanToken,
    },
    state: {
        loginName: loadSessionStorage('LOGIN_NAME', ''),
        loginToken: loadSessionStorage('LOGIN_TOKEN', ''),
        menuPermission: loadSessionStorage('MENU_PERMISSION', ''),
        companyList: loadSessionStorage('COMPANY_LIST', ''),
        curCom: loadSessionStorage('CUR_COM', ''),
        curComName: loadSessionStorage('CUR_COM_NAME', ''),
        curComInfo: loadSessionStorage('CUR_COM_INFO'),
        hasOverView: loadSessionStorage('HAS_OVERVIEW', ''),
        menu: loadSessionStorage('MENU', ''),
        currentMenu: loadSessionStorage('CURRENT_MENU', ''),
        userInfo: loadSessionStorage('USER_INFO', ''),
        navIsCollapse: loadSessionStorage('NAV_IS_COLLAPSE', false),
        theme: loadSessionStorage('THEME', ''),
        currentUrl: loadSessionStorage('CURRENT_URL', ''),
        qiyuanToken: loadSessionStorage('QIYUAN_TOKEN', ''),
    },

    mutations: {
        SET_LOGIN_NAME: (state, name) => {
            saveSessionStorage('LOGIN_NAME', name)
            state.loginName = name
        },
        SET_LOGIN_TOKEN: (state, token) => {
            saveSessionStorage('LOGIN_TOKEN', token)
            state.loginToken = token
        },
        SET_MENU_PERMISSION: (state, menuPermission) => {
            saveSessionStorage('MENU_PERMISSION', menuPermission)
            state.menuPermission = menuPermission
        },
        SET_COMPANY_LIST: (state, companyList) => {
            saveSessionStorage('COMPANY_LIST', companyList)
            state.companyList = companyList
        },
        SET_CUR_COM: (state, curCom) => {
            saveSessionStorage('CUR_COM', curCom);
            state.curCom = curCom;
        },
        SET_CUR_COM_NAME: (state, curComName) => {
            saveSessionStorage('CUR_COM_NAME', curComName);
            state.curComName = curComName;
        },
        SET_CUR_COM_INFO: (state, curComInfo) => {
            saveSessionStorage('CUR_COM_INFO', curComInfo);
            state.curComInfo = curComInfo;
        },
        SET_HAS_OVERVIEW: (state, hasOverView) => {
            saveSessionStorage('HAS_OVERVIEW', hasOverView)
            state.hasOverView = hasOverView
        },
        SET_MENU: (state, menu) => {
            saveSessionStorage('MENU', menu)
            state.menu = menu
        },
        SET_CURRENT_MENU: (state, currentMenu) => {
            saveSessionStorage('CURRENT_MENU', currentMenu)
            state.currentMenu = currentMenu
        },
        SET_USER_INFO: (state, userInfo) => {
            saveSessionStorage('USER_INFO', userInfo)
            state.userInfo = userInfo
        },
        SET_NAV_IS_COLLAPSE: (state, navIsCollapse) => {
            saveSessionStorage('NAV_IS_COLLAPSE', navIsCollapse)
            state.navIsCollapse = navIsCollapse
        },
        SET_THEME: (state, theme) => {
            saveSessionStorage('THEME', theme)
            state.theme = theme
        },
        CLEAR_SESSION_STORAGE(state) {
            sessionStorage.clear();
            for (let key in state) {
                state[key] = ''
            }
        },
        SET_CURRENT_URL: (state, currentUrl) => {
            saveSessionStorage('CURRENT_URL', currentUrl)
            state.currentUrl = currentUrl
        },
        SET_QIYUAN_TOKEN: (state, qiyuanToken) => {
            saveSessionStorage('QIYUAN_TOKEN', qiyuanToken)
            state.qiyuanToken = qiyuanToken
        },        
    },
    actions: {
        // 用户名登录
        Login({commit}, userInfo) {
            // return false
            return new Promise((resolve, reject) => {
                api.login({
                    account: userInfo.loginType === 1 ? userInfo.phone : userInfo.username,
                    accountPwd: userInfo.loginType === 1 ? userInfo.message : userInfo.password,
                    loginType: userInfo.loginType
                }).then(res => {
                    if (res.errorCode === '200') {
                        const data = res.data[0];
                        data.password = userInfo.password
                        commit('SET_LOGIN_TOKEN', data.token);
                        commit('SET_LOGIN_NAME', data.name);
                        commit('SET_USER_INFO', data);
                        commit('SET_QIYUAN_TOKEN',data['gsmToken']) // 保存返回的气源管理系统的token
                        resolve(res.data[0])
                    } else {
                        reject(res.errorMsg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                api.logout().then(() => {
                    commit('CLEAR_SESSION_STORAGE')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user
