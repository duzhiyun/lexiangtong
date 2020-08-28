<template>
	<view>
		<view class="footer">
			<view class="footer_item" :class="{'active': curpage == item.pagePath,'big_item':item.size == 'big'}" @click="changeNav(item.pagePath)" v-for="(item,index) in list" :key="index">
				<image :src="curpage == item.pagePath ? item.selectedIconPath : item.iconPath" mode="widthFix"></image>
				<text>{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['curpage'],
		data() {
			return {
				curIndex:0,
				list: [{
						"pagePath": "pages/zrwindex/zrwindex",
						"iconPath": "/static/tabBar/tabBar_1.png",
						"selectedIconPath": "/static/tabBar/tabBar_cur_1.png",
						"text": "首页"
					},

					{
						"pagePath": "pagesC/vidoe-index/index",
						"iconPath": "/static/tabBar/vidoe_off.png",
						"selectedIconPath": "/static/tabBar/vidoe_on.png",
						"text": "视频"
					}, {
						// "pagePath": "pagesC/vidoe-index/le_leyou",
						"pagePath": "pages/index/index",
						"iconPath": "/static/tabBar/shop_off.png",
						"selectedIconPath": "/static/tabBar/shop_on.png",
						"text": "乐享购"
					},
					// {
					// 	"pagePath": "pagesC/vidoe-index/live_vidoe",
					// 	"iconPath": "/static/tabBar/lebo_off.png",
					// 	"selectedIconPath": "/static/tabBar/lebo_on.png",
					// 	"text": "乐播"
					// },
					{
						"pagePath": "pages/user/user",
						"iconPath": "/static/tabBar/tabBar_4.png",
						"selectedIconPath": "/static/tabBar/tabBar_cur_4.png",
						"text": "我的"
					}
				]
			};
		},
		methods:{
			changeNav(url){
				if(url != this.curpage){
					uni.reLaunch({
						url:'/' + url
					})
				}
			}
		},
		computed:{
			
		}
	}
</script>

<style>
.footer{
	height: 100upx;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #000000;
	color: #6e6d6b;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 2upx solid #e2e2e2;
	z-index: 99999;
	padding-bottom: env(safe-area-inset-bottom);
}
.footer_item{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 20%;
	font-size: 24upx;
	height: 100upx;
}
.footer_item.active{
	color: #e7cd36;
}
.footer_item image{
	width: 50upx;
	height: 50upx;
}

.footer_item.big_item{
	position: relative;
	top: -30upx;
	height: 200upx;
}
.footer_item.big_item image{
	width: 100upx;
	height: 100upx;
}
.footer_item.big_item text{
	color: #b88f56;
}
</style>
