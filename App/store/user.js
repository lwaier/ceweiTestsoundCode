import POST from '@/common/ajax.js'
import {timeToString} from '@/common/api.js'


export default {
	state:{
		userInfoList:'', //初始化为空
		isRef:0, //是否刷新
	},
	mutations:{
		//保存用户信息
		saveUserInfoList(state,{data,isOnReachBottom}){
			//isOnReachBottom --undefind-普通刷新 --true-上拉加载
			
			if(isOnReachBottom){
				state.userInfoList = [...state.userInfoList,...data]; //上拉加载
			}else{
				uni.stopPullDownRefresh(); //上拉刷新完成
				state.userInfoList = data; //普通刷新
			}
			
			
		},
		
		//修改用户是否处于修改状态
		setIsEdit(state,{index}){
			state.userInfoList[index].isEdit = !state.userInfoList[index].isEdit; //取反即可
			state.userInfoList = state.userInfoList.map((item,indexnew)=>{
				if(indexnew!=index){
					item.isEdit = false; //其他用户全部取false,表示未编辑
				}
				return item;
			})
		},
		//让观察者更新
		setIsRef(state){
			state.isRef++
		}
	},
	actions:{
		//保存用户信息
		saveUserInfo({commit},{data}){
			POST('CeiWeiXinXiComputerTest/saveUserInfo',data).then(res=>{
				if(res.data.code == '000000'){
					commit('setIsRef')
					uni.showToast({
						icon:'success',
						title:'保存成功'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1,
						})
					},2000)
				}
			})
		},
		//查询用户信息列表
		async getUserInfoList({commit},{data,isOnReachBottom}){
			
			return await new Promise((reslove)=>{
				POST('CeiWeiXinXiComputerTest/getUserInfoList',data).then(res=>{
					if(res.data.code == '000000'){
						let list = res.data.result.map((item,index)=>{
							let obj = {
								id:item._id, //用户id
								userName:item.userName, //用户名
								userHeight:item.userHeight, //学生身高
								isVip:item.isVip?'是':'否', //是否vip
								className:item.className,	//班级名称
								userStage:item.userStage,	//学生登记
								createTime:timeToString(item.createTime),	//创建时间
								changeTime:item.changeTime,	//创建时间
								isEdit:false
							}; //取到组件需要的数据
							return obj
						})
						
						commit('saveUserInfoList',{data:list,isOnReachBottom});
						
						reslove(res.data.allPageNumber); //将用户数量返回
					}
				})
			}); //将用户数量放入.then 用户展示页面判断是否可上拉刷新
			
			
		},
		//得到单个用户的信息
		async getOneUserInfo({commit},{id}){
			return await new Promise((reslove)=>{
				POST('CeiWeiXinXiComputerTest/getOneUserInfo',{
					id,
				}).then(res=>{
					if(res.data.code == '000000'){
						reslove(res.data.result)
					}
				})
			}) 
		},
		//删除某个用户信息
		async deleteOneUserInfo({commit},{id,index}){
			return await new Promise((reslove)=>{
				POST('CeiWeiXinXiComputerTest/deleteOneUserInfo',{
					id,
				}).then(res=>{
					if(res.data.code == '000000'){
						commit('setIsRef')
						reslove(true)
					}
				})
			}) 
			
		},
	}
}