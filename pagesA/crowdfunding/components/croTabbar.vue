<template>	
	<view class="footer-nav">
		<view class="van-hairline--top-bottom ect-tabbar van-tabbar van-tabbar--fixed" style="z-index: 1;">
			<view class="van-tabbar-item van-tabbar-item--active" @click="$outerHref('/pagesA/crowdfunding/crowd','app')">
				<view class="van-tabbar-item__icon"><i class="van-icon van-icon-home"></i></view>
				<view class="van-tabbar-item__text">微筹广场</view>
			</view>
			<view class="van-tabbar-item" @click="$outerHref('/pagesA/crowdfunding/user/order','app')">
				<view class="van-tabbar-item__icon"><i class="van-icon van-icon-records"></i></view>
				<view class="van-tabbar-item__text">微筹订单</view>
			</view>
			<view class="van-tabbar-item" @click="$outerHref('/pagesA/crowdfunding/user/user','app')">
				<view class="van-tabbar-item__icon"><i class="van-icon van-icon-contact"></i></view>
				<view class="van-tabbar-item__text">微筹中心</view>
			</view>
		</view>
	</view>
</template>
<script>
    export default {
        name: "team-tabbar",
        components: {
        },
        data() {
            return {
                active: 0
            }
        }
    }
</script>
<style>
	.van-tabbar {height: 100upx;}
	.van-tabbar--fixed {left: 0;bottom: 0;position: fixed;}
	.van-tabbar {width: 100%;display: flex; background-color: #fff;}
	.van-tabbar-item--active {color: #1989fa;}
	.van-tabbar-item {-webkit-box-flex: 1;flex: 1;display: flex;line-height: 1;font-size: 12px;-webkit-box-align: center;align-items: center;-webkit-box-orient: vertical;
		-webkit-box-direction: normal;flex-direction: column;-webkit-box-pack: center;justify-content: center;}
	.van-tabbar-item__icon {font-size: 18px;position: relative; margin-bottom: 5px;}
	.footer-nav .van-tabbar-item--active .van-tabbar-item__text {color: #f92028;}
	.van-tabbar-item__icon {font-size: 18px;position: relative; margin-bottom: 5px;}
	.footer-nav .van-tabbar-item--active .van-tabbar-item__text {color: #f92028;}
	.van-tabbar-item__icon .van-icon {display: block;}
	.van-icon {position: relative;font: normal normal normal 14px/1 vant-icon;font-size: inherit;text-rendering: auto;}
</style>