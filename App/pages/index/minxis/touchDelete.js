export default {
	data(){
		return{
			left:0, //滑动盒子margin-left初始化值
			startX: null, //开始滑动x坐标值
			delBtnWidth: 140, //删除按钮宽度单位（rpx）
		}
	},
	methods:{
		//滑动开始
		touchS: function(e) {
			if (e.touches.length == 1) {
				this.startX = e.touches[0].clientX
			}
		},
		
		//滑动移动
		touchM: function(e) {
	
			if (e.touches.length == 1) {
				var moveX = e.touches[0].clientX;
				var disX = this.startX - moveX;
				var delBtnWidth = this.delBtnWidth;
				var left = "";
				if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
					left = "0rpx";
				} else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
					left = disX + "rpx";
					if (disX >= delBtnWidth) {
						this.left = "-" + delBtnWidth + "rpx";
					}
				}
				// var list = this.list;
				// if (index !== "" && index !== null) {
				// 	this.$set(list[parseInt(index)],'left',left)
				// }
			}
		},
		
		//滑动结束
		touchE: function(e) {
			if (e.mp.changedTouches.length == 1) {
				var endX = e.mp.changedTouches[0].clientX;
				var disX = this.startX - endX;
				var delBtnWidth = this.delBtnWidth;
				//如果距离小于删除按钮的1/3，不显示删除按钮
				var left = disX > delBtnWidth / 3 ? "-" + delBtnWidth + "rpx" : "0rpx";
				var list = this.list;
				this.left=left
			}
		},
	}
}