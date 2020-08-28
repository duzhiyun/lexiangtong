import Vue from 'vue'
import App from './App'

import _mixins from './common/_mixins';
import _common from './common/common';

import hxNavbar from "./components/hx-navbar/hx-navbar.vue";
Vue.component('hx-navbar',hxNavbar);
// 关闭生产提示
Vue.config.productionTip = false;
// 小程序页面组件和这个`App.vue`组件的写法和引入方式是一致的，为了区分两者，需要设置`mpType`值
App.mpType = 'app';

Vue.mixin(_mixins);
Vue.mixin(_common);
Vue.mixin({
    onLoad() {
        if (this.$initData$) {
            Object.assign(this, JSON.parse(this.$initData$))
        } else {
            this.$initData$ = JSON.stringify(this.$data)
        }
    }
})
import uView from "uview-ui";
Vue.use(uView);

import store from './store'
import * as localConfig from './config/local/config'

import outerHref from '@/common/outerHref'
import request from '@/common/request.js'
import isLogin from '@/common/mixins/isLogin'
import dateFormat from '@/common/mixins/date-format'

import dscLoading from '@/components/dsc-loading.vue'

// Promise.prototype.finally = function(callback) {
//     let constructor = this.constructor;
//     return this.then(function(value) {
//         return constructor.resolve(callback()).then(function() {
//             return value
//         })
//     }, function(issue) {
//         return constructor.resolve(callback()).then(function() {
//             throw issue
//         })
//     })
// }


Vue.config.productionTip = false

Vue.prototype.$outerHref = outerHref
Vue.prototype.$isLogin = isLogin
Vue.prototype.$http = request
Vue.prototype.$formatDateTime = dateFormat.formatDateTime
Vue.prototype.$customBar = 88

Vue.prototype.$store = store

Vue.prototype.websiteUrl = localConfig.websiteUrl
Vue.prototype.$websiteUrl = localConfig.websiteUrl + '/mobile/#/'

Vue.component('dsc-loading',dscLoading)

/**
 * Date 对象新增 format 原型
 */
Date.prototype.format = dateFormat.format

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
