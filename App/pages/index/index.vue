<template>
	<view class="content">
		<!-- 页面头部 -->
		<!-- liwei-为前缀的组件为esaycome自动引入 -->
		<liwei-header>
			  <template slot="middle">
					<text>demo</text>
			   </template>
			   <template slot="right">
			   		<text @click="addFn">新增</text>
			    </template>
		</liwei-header>
		<!-- 页面搜索 -->
		<view class="search">
			<view>
				<text>北京</text>
				<text class="iconfont iconxiala"></text>
			</view>
			<view>
				<view class="search_bgc">
					<text class="iconfont iconsousuo1"></text>
					<input type="text" v-model="searchStr" class="input_search"/>
				</view>
			</view>
			<view>
				<text class="iconfont iconsaoyisao"></text>
			</view>
		</view>
		<!-- 页面内容 -->
		<!-- 全部 -->
		<view v-if="!isAllOrFilter">
			<UserItem v-for="(item,index) in user.userInfoList" :key="index" :userInfo="item" :style="item.isEdit?'background:#eaecff':''"
			@deleteFn="deleteFn(item.id,index)"
			>
				<checkbox :checked="item.isEdit" class="user_edit" @click="userEdit(item.id,index)"/>
			</UserItem>
		</view>
		<!-- 搜索 -->
		<view v-else>
			<UserItem v-for="(item,index) in searchStrArr" :key="index" :userInfo="item" :style="item.isEdit?'background:#eaecff':''"
			@deleteFn="deleteTwoFn(item.id,index)"
			>
				<checkbox :checked="item.isEdit" class="user_edit" @click="userEdit(item.id,index)"/>
			</UserItem>
		</view>
		
		<view class="tip_more">
			{{tipMore=="1"?'~上拉加载更多数据哦~':tipMore=='2'?'~没有更多数据了哦~':''}}
		</view>
	</view>
</template>

<script>
	import UserItem from './components/userItem.vue';//单个用户信息
	import {mapState,mapActions,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				pageSize:4, //每页数量
				pageNo:1, //所在页数
				
				searchStr:'', //搜索框值 --空-查全部 --非空-查列表中对应数据
				searchStrArr:[], //搜索的内容 初始化为空
				
				allPageNumber:'', //一共的用户数量
				tipMore:'0', //--0-不显示 --1-上拉加载更多 --2-没有更多数据
			}
		},
		onLoad() {
			this.resetData()
		},
		computed:{
			...mapState([
				'user', //用户信息
			]),
			//isAllOrFilter -- 是显示全部商品还是显示搜索框中商品  --true-搜索框商品 --false-全部商品
			isAllOrFilter(){
				return this.searchStr?true:false;
			}
		},
		components:{
			UserItem, //学生信息
			// Header, //头部
		},
		watch:{
			'user.isRef'(newstr){
				this.resetData();
			},
			//检索可见内容
			searchStr(newstr){
				let that = this;
				if(newstr){
					that.searchStrArr = []; //首先清空
					this.user.userInfoList.forEach((item)=>{
						let flag = false; //初始化没有匹配到一样的值
						for(let valueKey in item){
							if(valueKey!='isEdit'&&valueKey!='changeTime'&&!flag&&item[valueKey].indexOf(newstr)!=-1){
								flag = true; //匹配到同样值
								that.searchStrArr.push(item)
							}
						}
					})

				}
			}
		},
		methods: {
			...mapActions([
				'getUserInfoList', //查询用户信息列表
				'deleteOneUserInfo', //删除某一用户
			]),
			...mapMutations([
				'setIsEdit', //更新用户是否处于编辑状态
			]),
			//初始化数据
			resetData(){
				this.pageNo = 1;
				this.getUserInfoList({data:{
					pageSize:this.pageSize,
					pageNo:this.pageNo,
				}}).then(res=>{
					this.allPageNumber = res; 
					
					if(this.pageNo*this.pageSize>=this.allPageNumber){
						//没有更多用户可加载
						this.tipMore = '2'; //界面显示没有更多数据
					}else{
						this.tipMore = '1'; //界面显示可加载更多数据
					}
					
				}); //获取用户信息列表
			},
			//新增用户
			addFn(){
				uni.navigateTo({
					url:'/pages/edit/editIndex'
				})
			},
			//修改用户
			userEdit(id,index){
				let flag = true; //该标量控制用户是否可点击编辑进入编辑页面
				
				if(this.user.userInfoList[index].isEdit==true){
					flag = false
				}
				this.setIsEdit({index})
				
				if(!flag){
					return;
				}
				uni.navigateTo({
					url:`/pages/edit/editIndex?id=${id}`
				})
			},
			//删除用户
			deleteFn(id,index){
				this.deleteOneUserInfo({id,index})
			},
			deleteTwoFn(id,index){
				this.deleteOneUserInfo({id,index}).then(res=>{
					if(res){
						//当删除成功时 删掉搜索列表对应内容
						this.searchStrArr.splice(index,1)
						
					}
				})
			},
		},
		//上拉加载更多
		onReachBottom() {

			let that = this;
			
			if(this.isAllOrFilter){
				uni.showToast({
					icon:'none',
					title:'当前状态不可上拉加载更多,请删除搜索框内容'
				})
				return
			} 
			
			if(this.tipMore=='2'){
				return
			}
			
			
			this.pageNo++; //页码增加
			
			this.getUserInfoList({
				data:{
					pageSize:this.pageSize,
					pageNo:this.pageNo,
				},
				isOnReachBottom:true
			}).then(res=>{
				this.allPageNumber = res;
				
				if(this.pageNo*this.pageSize>=this.allPageNumber){
					//没有更多用户可加载
					this.tipMore = '2'; //界面显示没有更多数据
				}else{
					this.tipMore = '1'; //界面显示可加载更多数据
				}
			}); //获取用户信息列表
		},
		//下拉刷新数据
		onPullDownRefresh() {
			let that = this;
			this.resetData()
		},
	}
</script>

<style lang="scss" scoped>
	.search{
		display: flex;
		align-items: center;
		background-color:rgb(255, 255, 255);
		color: rgb(51, 51, 51);
		height: 88upx;
		border-bottom: 2upx solid #e5e5e5;
		margin-top:88upx ;
		view:nth-child(1){
			width: 140upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
			margin-right: 4upx;
			.iconxiala{
				font-size: 38upx;
			}
		};
		view:nth-child(2){
			flex: 1;
			height: 60upx;
			.search_bgc{
				width: 96%;
				margin-left: 2%;
				height: 100%;
				background-color: #f3f3f3 !important;
				border-radius: 20upx;
				display: flex;
				align-items: center;
				.iconsousuo1{
					margin-left: 10upx;
				}
				.input_search{
					flex: 1;
					margin-left: 10upx;
					margin-right: 10upx;
					height: 90%;
				}
			}
		};
		view:nth-child(3){
			width: 110upx;
			text-align: center;
			.iconsaoyisao{
				font-size: 48upx;
			}
		}
	}
	.user_edit{
		margin: 6upx 0upx 6upx 20upx;
	}
	.tip_more{
		font-size: 28upx;
		text-align: center;
		margin-top: 40upx;
		margin-bottom: 60upx;
		color: #6c6c6c;
	}
</style>
