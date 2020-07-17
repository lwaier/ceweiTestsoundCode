import Vue from 'vue'
import App from './App'
import store from './store'
import PostApi from '@/common/ajax.js'


//将请求方法挂入原型链
Vue.prototype.$post = PostApi;

Vue.prototype.xiaobai = 'POST';


Vue.config.productionTip = false



App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
