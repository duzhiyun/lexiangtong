<template>
	<view class="footer">
		<view class="footer-item" @tap="goPath" data-url="/pagesC/vidoe-index/index" :data-index="1">
			<text class="footer-item-title">首页</text>
			<view class="footer-item-line" :class="{'activate-line': current === 1}"></view>
		</view>
		<view class="footer-item" @tap="goPath" data-url="/pagesC/vidoe-index/nearby" :data-index="2">
			<text class="footer-item-title" style="color: #999;">同城</text>
			<view class="footer-item-line" :class="{'activate-line': current === 2}"></view>
		</view>
		<view class="footer-item">
			<text class="footer-item-title" style="color: #999;">消息</text>
			<view class="footer-item-line" :class="{'activate-line': current === 3}"></view>
		</view>
		<view class="footer-item">
			<text class="footer-item-title" style="color: #999;">我的</text>
			<view class="footer-item-line" :class="{'activate-line': current === 4}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			current: {
				default: 1
			}
		},
		data() {
			return {

			}
		},
		methods: {
			goPath: function(e) {
				var url = e.target.dataset.url;
				var index = e.target.dataset.index;
				this.$emit("change", index)
				if (index === 1) {
					uni.navigateBack()
				} else {
					uni.navigateTo({
						url: url,
						animationType:"none"
					})
				}
			}
		}
	}
</script>
<style scoped>
	.footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		align-items: center;
		justify-content: center;
		border-top-width: 1rpx;
		border-color: rgba(255, 255, 255, 0.1);
		flex-direction: row;
	}

	.footer-item {
		position: relative;
		height: 100rpx;
		line-height: 100rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 190rpx;
	}

	.footer-item-title {
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: 600;
	}

	.footer-item-line {
		width: 40rpx;
		height: 5rpx;
		line-height: 5rpx;
		position: absolute;
		bottom: 0;
		border-radius: 10rpx;
	}
</style>
