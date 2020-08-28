<template>
	<view>
		<view class="banners">
			<image src="../../static/hxsimg/banner0.png"  class="bing"></image>
		</view>
		
		<view  class="money_one">
			<view class="money_li"><text>乐豆{money}}</text> </view>
			<view class="money_li"><text>购买中：{{sum}}</text></view>
		</view>
		
		
		<view  class="nav_ul">
			<view class="nav_li" @click="$outerHref('/pagesC/jiaoyi/jiaosell/jiaosell',$isLogin())"><text>买入</text></view>
			<view class="nav_li" @click="$outerHref('/pagesC/jiaoyi/jiaobuy/jiaobuy',$isLogin())"><text>卖出</text></view>
		</view>
		
		<view class="user_jifen">
			<view class="jfli jf" @click="$outerHref('/pagesC/jiaoyi/jiaoyimybuy/jiaoyimybuy',$isLogin())">
			   <text> 我的购买</text>                   
			   <text class="ric">查看</text>
			</view>			
		</view>
		
		<view class="user_jifen">
			<view class="jfli jf" @click="$outerHref('/pagesC/jiaoyi/jiaoyimysell/selling',$isLogin())">
				<text> 匹配交易</text>            
				<text class="ric">查看</text> 
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import isLogin from '@/common/mixins/isLogin'
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	const tradeUrl = localConfig.tradeUrl 
	export default {
		data() {
			return {
				sum:0,
				money:0
			}
		},
		onLoad(){
			this.showindex()
		},
		onShow(){
			this.showindex()
		},
		methods: {
			showindex(){
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/index', 
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.sum = Math.round(res.data.data.sum)
							this.money = Math.round(res.data.data.user_money)
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						store.commit('toggleCheckout',false)
						console.log(JSON.stringify(res))
					}
				});
			}
		}
	}
</script>

<style>
	body{background:rgb(245, 245, 245);}
	page{background:rgb(245, 245, 245);}
	.banners{width:100%;height:auto;}
	.bing{width:750rpx;height:310rpx}
	.nav_ul{ width:660rpx;
			 height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: space-around;
			 margin:20rpx auto;
	}
	.nav_li{width:45%;
			height:80rpx;
			background-color:#c8080d;
			border:1rpx solid #F0AD4E;
			line-height:80rpx;
			text-align:center;
			color:#ffffff;
			font-size:28rpx;
			margin:0 5%;
	}
	.money_one{ width:660rpx;
			 height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: space-around;
			 margin:20rpx auto;
	}
	.money_li{
			width:50%;
			height:80rpx;

			line-height:80rpx;
			text-align:center;
			color:#000000;
			font-size:28rpx;
	}
	.aui-wallet-head{background-position-x: 1%;
				background-position-y: 50%;
	}


	.user_help,.user_jifen{background:#ffffff;border-radius: 10upx; padding:40upx}
	.user_help{
			
			border-radius: 15upx;
			width: 690upx;
			height:auto;
			align-self: center;
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
			margin:20upx auto;
			padding: 5upx 20upx;
			border:1px;
		}
		.user_jifen {
			border-radius: 15upx;
			width: 690upx;
			height: auto;
			align-self: center;
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
			margin:20upx auto;
			padding: 5upx 20upx;
			border:1px;
			}
	.jfli { 	
				background-repeat: no-repeat;
				background-size:7%;
				background-position-x: 1%;
				background-position-y: 40%;
				padding-left: 62upx;
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				text-align: left;		
				color: #7a7573;
				align-self: center;
				display: flex;
				flex-wrap: wrap;
				align-content: flex-start;
				font-size: 28upx;
				justify-content: space-between;
	}
	.ric{background-image:url(../../static/hxsimg/arrow_right.png);
		 padding-right: 30upx;
		background-repeat: no-repeat;
		background-size:10%;
		background-position-x: 100%;
		background-position-y: 50%;
		font-size:10px;
		}
	.jf:nth-child(1) {
				background-image: url(../../static/img/tui.png);			 
			}
		
	.jf:nth-child(2) {
				background-image: url(../../static/img/icon-tab-005.png);
			}
		
	.jf:nth-child(3) {
				background-image: url(../../static/img/icon-tab-002.png);
	}
	.jf:nth-child(4) {
				background-image: url(../../static/img/info.png);
	}

</style>
