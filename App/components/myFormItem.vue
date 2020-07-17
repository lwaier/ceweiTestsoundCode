<template>
	<view class="my_form_item">
		<view class="title">
			{{title}}
		</view>
		<view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			title:{
				type:String,
				default:'我熬夜写的,腰酸背痛好可怜'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_form_item{
		margin-top: 30upx;
		background-color: #FFFFFF;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20upx;
		.title{
			width: 150upx;
			margin-right: 20upx;
			font-size: 30upx;
			@include dotted3
		}
	}
</style>
