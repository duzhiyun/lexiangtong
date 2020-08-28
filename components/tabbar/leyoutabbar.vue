<template>
	<view>
		<view class="footer">
			<view class="footer_item" :class="{'active': curpage == item.pagePath,'big_item':item.size == 'big'}" @click="changeNav(item.pagePath)"
			 v-for="(item,index) in list" :key="index">
				<image :src="curpage == item.pagePath ? item.selectedIconPath : item.iconPath" mode="widthFix"></image>
				<text>{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['curpage'],
		data() {
			return {
				curIndex: 0,
				"list": [{
						"pagePath": "pagesD/chat/index",
						"iconPath": "/static/theme/default/tabBar/1_0.png",
						"selectedIconPath": "/static/theme/default/tabBar/1_1.png",
						"text": "消息"
					},
					{
						"pagePath": "pagesD/friend/index",
						"iconPath": "/static/theme/default/tabBar/2_0.png",
						"selectedIconPath": "/static/theme/default/tabBar/2_1.png",
						"text": "通讯录"
					},
					{
						"pagePath": "pagesD/push/game",
						"iconPath": "/static/theme/default/tabBar/3_0.png",
						"selectedIconPath": "/static/theme/default/tabBar/3_1.png",
						"text": "探索"
					},
					{
						"pagePath": "pagesD/my/index",
						"iconPath": "/static/theme/default/tabBar/4_0.png",
						"selectedIconPath": "/static/theme/default/tabBar/4_1.png",
						"text": "我的"
					}
				]
			};

		},
		methods: {
			changeNav(url) {
				if (url != this.curpage) {
					uni.navigateTo({
						url: '/' + url
					})
				}
			}
		},
		created() {
			uni.hideTabBar()
		},
		computed: {

		}
	}
</script>


<style>
	.footer {
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #ededed;
		color: #6e6d6b;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 2upx solid #e2e2e2;
		z-index: 99999;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.footer_item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 20%;
		font-size: 24upx;
		height: 100upx;
	}

	.footer_item.active {
		color: #e7cd36;
	}

	.footer_item image {
		width: 50upx;
		height: 50upx;
	}

	.footer_item.big_item {
		position: relative;
		top: -30upx;
		height: 200upx;
	}

	.footer_item.big_item image {
		width: 100upx;
		height: 100upx;
	}

	.footer_item.big_item text {
		color: #b88f56;
	}
</style>
