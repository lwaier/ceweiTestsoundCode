<template>
	<view class="header">
		<view>
			<text class="iconfont iconfanhui" @click="goBack"></text>
		</view>
		<view>
			<slot name="middle" v-if="middle"></slot>
		</view>
		<view>
			<slot name="right" v-if="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			middle:{
				type:Boolean,
				default:true
			},
			right:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header{
		width: 738upx;
		height: 60upx;
		padding: 14upx 6upx;
		background-color: rgb(7, 130, 255);
		color: #FFFFFF;
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;top: 0;
		z-index: 100;
		.iconfanhui{
			font-size: 16upx;
		}
		view:nth-child(1){
			width: 80upx;
			text-align: left;
			display: flex;
			align-items: center;
		};
		view:nth-child(2){
			flex: 1;
			text-align: center;
			font-size: 28upx;
		};
		view:nth-child(3){
			width: 80upx;
			text-align: center;
			font-size: 28upx;
		}
	}
</style>
