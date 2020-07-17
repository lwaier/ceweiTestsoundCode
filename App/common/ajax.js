//自定义post 方法


import {IP} from '@/common/config.js'; //服务地址

export default (api,options) =>{
	return new Promise((resolve,reject)=>{
		
		let obj = {
			url:IP+api, 
			method:"POST",
		}
		if(options){
			obj.data = options
		}
		uni.request({
			...obj,
			success:(data)=>{
				resolve(data)
			},
			fail:(err)=>{
				reject(err)
			}
		})
	})
}