<template>
	<view class="edit_index">
		<!-- 页面头部 -->
		<liwei-header>
			  <template slot="middle">
					<text>demo</text>
			   </template>
			   <template slot="right">
			   		<text  @click="gobackHome">首页</text>
			    </template>
		</liwei-header>
		<!-- form表单 -->
		<view class="my_form">
			<liwei-myFormItem v-for="(itemvalue,itemKey) in formInfo" :key="itemKey" :title=" titleFn(itemKey) ">
				<!-- 班级名称 -->
				<picker mode="selector" :range="classList" @change="pickerSelectFn($event,'0')" v-if="itemKey=='className'" :value="classListValue">
					<view class="class_name">{{formInfo.className?formInfo.className:'请选择'}}</view>
				</picker>
				
				<!-- 学生姓名 -->
				<input type="text" class="user_name_age" v-model="formInfo.userName" placeholder="学生姓名" v-if="itemKey=='userName'"/>
				
				<!-- 学生年龄 -->
				<input type="number" class="user_name_age" v-model="formInfo.userAge" placeholder="学生年龄" v-if="itemKey=='userAge'"/>
				
				<!-- 学生生日 -->
				 <picker mode="date" :value="formInfo.userBirthday" start="1970-1-1" end="2030-10-1" class="user_birthday"
				 @change="bindDateChange" v-if="itemKey=='userBirthday'">
						<view class="uni-input">{{formInfo.userBirthday?formInfo.userBirthday:'选择日期'}}</view>
				 </picker>
				 
				 <!-- 学生身高 -->
				 <input type="number" class="user_name_age" v-model="formInfo.userHeight" placeholder="学生身高" v-if="itemKey=='userHeight'"/>
				 
				 <!-- 是否vip -->
				 <switch :checked="formInfo.isVip" @change="switchChange" v-if="itemKey=='isVip'"/>
				 
				 <!-- 学生头像 -->
				 <view class="user_avatar" v-if="itemKey=='userAvatar'&&!formInfo.userAvatar" @click="upFile">
					<text class="iconfont iconjia"></text>
				 </view>
				 <view class="user_avatar_on" v-if="itemKey=='userAvatar'&&formInfo.userAvatar" @click="preAndReplace">
				 	<image :src="IP+formInfo.userAvatar" mode="aspectFill" style="width: 100%;height: 100%;"></image>	
				 </view>
				 
				 <!-- 学生等级 -->
				 <picker mode="selector" :range="userStageList" @change="pickerSelectFn($event,'1')" v-if="itemKey=='userStage'" :value="userStageListValue">
				 	<view class="class_name">{{formInfo.userStage?formInfo.userStage:'请选择'}}</view>
				 </picker>
				 
				 <!-- 学生爱好 -->
				  <checkbox-group v-if="itemKey=='userHoppy'" class="user_hoppy" @change="selectUserHoppy">
					 <label v-for="(item,index) in userHoppyList" :key="index" style="margin-right: 6upx;">
						 <checkbox :value="item.id" :checked="item.checked" />{{item.text}}
					 </label>
				 </checkbox-group>
				 
			</liwei-myFormItem>
			
			<!-- 学生描述 -->
			<view class="user_description">
				<view class="user_description_title">学生描述</view>
				<view style="width: 550upx;">
					<textarea :value="userDescription?userDescription:''" @input="getValue" placeholder="多行文本输入框" class="user_description_content" />
				</view>
			</view>
			
			<!-- 学生自传 -->
			<view class="user_description user_zz" v-if="id">
				<view class="user_description_title" style="padding-top: 8upx;width: 30upx;">学生描述</view>
				<view style="width: 650upx;" v-if="detail">
					<Editor @getDetail="getDetailFn" :detail="detail"></Editor>
				</view>
			</view>
			<view class="user_description user_zz"  v-else>
				<view class="user_description_title" style="padding-top: 8upx;width: 30upx;">学生描述</view>
				<view style="width: 650upx;">
					<Editor @getDetail="getDetailFn"></Editor>
				</view>
			</view>
			
			
		</view>
		
		<button type="primary" class="save" @click="saveFn">保存</button>
		
	</view>
	
</template>

<script>
	import {IP} from '@/common/config.js'; //服务地址
	import Editor from './components/editor.vue'; //引用Uni原生富文本组件
	import {mapState,mapActions} from 'vuex'
	import Throttle from '@/common/debounce.js'
	
	export default{
		data(){
			return {
				id:'', //用户id  --空-新增  --不为空-编辑
				formInfo:{
					className:'',	//班级名称
					userName:'', //学生姓名
					userAge:'', //学生年龄
					userBirthday:'', //学生生日
					userHeight:'', //学生身高
					isVip:false, //是否vip
					userAvatar:'', //学生头像
					userStage:'',	//学生等级
					userHoppy:'', //学生爱好
				},
				userDescription:'', //学生描述
				detail:'', //学生简介
				
				classList:[
					'软件1011',
					'软件2012',
					'软件3013',
					'软件4014',
					'软件5015',
					'软件6016'
				], //应从后台获取,属于此次机考边缘功能我就不写这部分数据获取的接口了
				classListValue:0,
				userStageList:[
					'前端架构师',
					'高级前端工程师',
					'中级前端工程师',
					'初级前端工程师'
				],
				userStageListValue:0,
				userHoppyList:[
					{
						id:'000',
						text:'篮球',
						checked:false
					},
					{
						id:'001',
						text:'足球',
						checked:false
					},
					{
						id:'002',
						text:'羽毛球',
						checked:false
					},
					{
						id:'003',
						text:'跑步',
						checked:false
					},
				],
				
				
				IP,//远程服务地址
			}
		},
		computed:{
			...mapState(['user']),
			titleFn(){
				return (itemKey) =>{
					switch(itemKey){
						case 'className':
						return '学生班级'
						case 'userName':
						return '学生姓名'
						case 'userAge':
						return '学生年龄'
						case 'userBirthday':
						return '学生生日'
						case 'userHeight':
						return '学生身高'
						case 'isVip':
						return '是否VIp'
						case 'userAvatar':
						return '学生头像'
						case 'userStage':
						return '学生等级'
						case 'userHoppy':
						return '学生爱好'
						default :
						return '大佬您好,我是您的忠实小迷弟,这里的filter用得还行吧,请给我面试加分噢'
					}
				}
			}
		},
		components:{
			Editor, //富文本
		},
		onLoad(options){
			if(options.id){
				//此时是编辑状态
				this.id = options.id; 
				this.getOneUserInfo({id:this.id}).then(res=>{
					this.formInfo = {
						className:res.className,	//班级名称
						userName:res.userName, //学生姓名
						userAge:res.userAge, //学生年龄
						userBirthday:res.userBirthday, //学生生日
						userHeight:res.userHeight, //学生身高
						isVip:res.isVip, //是否vip
						userAvatar:res.userAvatar, //学生头像
						userStage:res.userStage,	//学生等级
						userHoppy:res.userHoppy, //学生爱好
					}
					this.userDescription=JSON.parse(res.userDescription) //学生描述
					this.detail=res.detail//学生简介	
							
					this.classListValue = this.classList.indexOf(this.formInfo.className); //初始化选择器value--班级名称
					this.userStageListValue = this.userStageList.indexOf(this.formInfo.userStage); //初始化选择器value--学生等级
					this.userHoppyList=this.userHoppyList.map(item=>{
						if(this.formInfo.userHoppy.indexOf(item.id)!=-1){
							item.checked = true;
						}
						return item
					})
				})
			}
		},
		methods:{
			...mapActions([
				'saveUserInfo',//保存用户信息
				'getOneUserInfo', //得到用户信息
			]),
			gobackHome(){
				uni.reLaunch({
					url:'/pages/index/index'
				}); //返回首页 --此处禁止使用navigateTo--避免跳转次数累计溢出
			},
			//选择班级
			pickerSelectFn(data,type){
				let index = data.detail.value; //获取选择的索引
				if(type=='0'){
					this.formInfo.className = this.classList[index]; //获取选择的值
				}else{
					this.formInfo.userStage = this.userStageList[index]; //获取选择的值
				}
				
			},
			//选择日期
			bindDateChange(data){
				this.formInfo.userBirthday =  data.detail.value; //获取选择的日期
			},
			//选择否是vip
			switchChange(data){
				this.formInfo.isVip =  data.detail.value; //获取是否是Vip
			},
			//选择爱好
			selectUserHoppy(data){
				this.formInfo.userHoppy =  data.detail.value; //获取用户选择的爱好
			},
			//上传头像
			upFile(){
				let that = this
				uni.chooseImage({
					count:1,
					success:function(data){
						let img = data.tempFiles[0].path ;
						let bsize = data.tempFiles[0].size ;
						let mSize = bsize/1024/1024
						if(mSize<=50){
							//此处先上传 上传后得到地址 然后将该地址放入数组中准备上传
							uni.uploadFile({
								url: that.IP+'CeiWeiXinXiComputerTest/upImg',
								filePath: img,
								name: 'file',
								success: function(res) {
									uni.hideLoading()
									let data = JSON.parse(res.data)
									if(data.code == '000000'){
										let imgSrc = data.result;
										that.formInfo.userAvatar = imgSrc.substring(7).split('\\').join('/');
									}else{
										
									}
									
								}
							})

						}else{
							uni.showToast({
								title:'您的图片过大',
								icon:"none"
							})
						}
					}
				})
			},
			//预览或更改头像
			preAndReplace(){
				let that = this;
				uni.showActionSheet({
					itemList:['预览头像','修改头像'],
					success(res) {
						if(res.tapIndex==0){
							uni.previewImage({
								urls: [that.IP + that.formInfo.userAvatar]
							}); //预览头像
						}else{
							that.upFile(); //修改头像
						}
					},
				})
			},
			//学生描述值(可能存在换行 故用函数处理字符串)
			getValue(data){
				this.userDescription=data.detail.value;
			},
			getDetailFn(detail){
				this.detail = detail;
			},
			msgToast(title){
				uni.showToast({
					icon:'none',
					title,
				})
			},
			//保存用户信息 (节流--4s)
			saveFn:Throttle.throttle(function(){
				let userDescription = JSON.stringify(this.userDescription); //学生描述
				let detail = this.detail; //学生简介
				let data = {
					id:this.id,
					...this.formInfo,
					userDescription,
					detail,
				}
				if(!data.className){
					this.msgToast('请选择班级')
					return;
				}
				if(!data.userName){
					this.msgToast('请填写姓名')
					return;
				}
				if(!data.userHeight){
					this.msgToast('请填写身高')
					return;
				}
				if(!data.userStage){
					this.msgToast('请选择学生等级')
					return;
				}

				this.saveUserInfo({data}); //发送action 保存用户信息
			},4000,1)
				

		}
	}
</script>

<style lang="scss" scoped>
	.edit_index{
		background-color: #f1f1f1;
		padding-bottom: 130upx;
		.my_form{
			margin-top: 60upx;
			padding-top: 20upx;
			overflow: hidden;
			.class_name,.user_birthday{
				font-size: 28upx;
			}
			.user_name_age{
				text-align: right;
				font-size: 28upx;
			}
			.user_hoppy{
				font-size: 28upx;
			}
			.user_avatar{
				width: 80upx;
				height: 80upx;
				border: 2upx dashed #cccccc ;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.user_avatar_on{
				width: 80upx;
				height: 80upx;
			}
		}
		.user_description{
			display: flex;
			justify-content: space-between;
			margin-top: 30upx;
			padding: 20upx 20upx;
			background-color: #FFFFFF;
			.user_description_title{
				width: 150upx;
				font-size: 28upx;
				margin-right: 10upx;
			}
			.user_description_content{
				font-size: 26upx;
				height: 130upx;
			}
		}
		.user_zz{
			
		}
		.save{
			width: 100%;
			height: 92upx;
			position: fixed;
			left: 0;bottom: 0;
		}
	}
	
	
</style>
