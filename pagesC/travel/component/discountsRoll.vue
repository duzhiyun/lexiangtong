<template>
	<view class="content">
		<view class="xian">
			<view style="color:rgb(220, 220, 220);">
				———
			</view>
			<view class="xianBottom">
				暂无数据
			</view>
			<view style="color:rgb(220, 220, 220);">
				———
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.xian {
		margin-top: 20rpx;
		display: flex;
		height: 100rpx;
		justify-content: center;
		align-items: center;
		.xianBottom {
			width: 120rpx;
			height: 40rpx;
			text-align: center;
			background-color: rgb(235, 235, 235);
			font-size: 23rpx;
			line-height: 40rpx;
			color: rgb(165, 165, 165);
		}
	}
</style>
