<template>
	<view class="header" :style="{marginTop:statusBarHeight+'px'}">
		<text class="header-left">&#xe662;</text>
		<view class="header-center">
			<view class="header-item">
				<text class="header-item-title">关注</text>
				<view class="header-item-line" :class="{'activate-line': current === 0}"></view>
			</view>
			<view class="header-item">
				<text class="header-item-title">推荐</text>
				<view class="header-item-line" :class="{'activate-line': current === 1}"></view>
			</view>
		</view>
		<text class="header-right">&#xe6ad;</text>
	</view>
</template>
<script>
	export default {
		props: {
			statusBarHeight: {
				default: 0
			},
			current: {
				default: 0
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.header {
		position: absolute;
		left: 0;
		right: 0;
		flex-direction: row;
		height: 100rpx;
		line-height: 100rpx;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.header-center {
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.header-left,
	.header-right {
		color: #999;
		height: 100rpx;
		line-height: 100rpx;
		align-items: flex-start;
		justify-content: flex-end;
		font-family: iconfont;
	}

	.header-item {
		align-items: center;
	}

	.header-item-title {
		width: 120rpx;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 600;
	}

	.header-item-line {
		height: 8rpx;
		line-height: 8rpx;
		width: 40rpx;
		border-radius: 10rpx;
	}
</style>
