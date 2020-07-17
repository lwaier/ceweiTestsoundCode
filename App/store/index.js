import Vue from 'vue'
import Vuex from 'vuex'


//模块化vuex 引入最美乡村模块
import USER from './user.js'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		user:USER, //学生信息模块
	},
})