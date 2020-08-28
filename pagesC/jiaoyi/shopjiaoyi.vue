<template>
	<view>
		<view class="banners bing"  v-bind:style="{background: 'url('+imageURL+')',backgroundSize:'100%'}"  >
			<view  style="padding-top:50rpx" >	
				<view  class="money_one"  >
					<view class="money_li liti"><text>乐券\n{{money}}</text> </view>
					<view class="money_li liti"><text>购买中\n{{sum}}点</text></view>
					<view class="money_li liti"><text>限价区间\n{{min}}-{{max}}元</text></view>
				</view>
				<view  class="money_one" style="margin-top:20rpx">
					<view class="money_li liti"><text>挂买总数\n{{count}}</text></view>
					<view class="money_li liti"><text>已成交量\n{{finish}}</text></view>
					<view class="money_li liti"><text>日成交量\n{{today}}</text></view>
				</view>
			</view>
		</view>
		 
		<view  class="nav_ul">
			<view class="nav_li liti" @click="$outerHref('/pagesC/jiaoyi/jiaosell/jiaosell',$isLogin())"><text>买乐券</text></view>
			<view class="nav_li liti" @click="$outerHref('/pagesC/jiaoyi/jiaoyimybuy/jiaoyimybuy',$isLogin())"><text>我的买单</text></view>
			<view class="nav_li liti" @click="openshows()"> <text>卖乐券</text>  </view>
			<view class="nav_li liti" @click="$outerHref('/pagesC/jiaoyi/jiaoyimysell/selling',$isLogin())"><text>我的卖单</text></view>
		</view>
		
		<view class="content1">		
			<view  class="list-ul" v-for="(item,index) in list" :key="index">				
				<view class="list-ol uni-flex-common  uni-space-between" >
					<view class="uni-flex">
						 <view style="margin-right:30rpx;border-radius: 50rpx;width:50rpx;height:50rpx;color:#ffffff;background-color:#e77109;text-align:center"><text>买</text></view>
						 <view ><text>{{item.nick_name}}</text></view>
					 </view>					
				</view>
				<view class="list-ol uni-flex-common  uni-space-between">					
					 <view style="margin-right:30rpx;margin-left:10rpx;width:180rpx">
						 <text>总量：{{item.number}} </text>
					 </view>	 
					 <view style="margin-right:30rpx;text-align:left;width:250rpx"><text>还需：{{item.remaining_number}} </text></view>		 
					 <view class="list-li">  </view>
				</view>
				<view class="list-ol  uni-flex-common  uni-space-between">
					<view style="margin-right:30rpx;margin-left:10rpx;width:180rpx">
					   <text class="textred">单价：{{item.unit_price}}元 </text>
					</view>	
					<view style="margin-right:30rpx;text-align:left;width:250rpx"><text>总额：{{item.remaining_amount}}元</text></view>
				    <view class="list-li buyin" @click="buyClick(item)">卖给他</view>
				</view>
				
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
				money:0,
				count:0,
				finish:0,
				today:0,
				min:0,
				max:0,
				imageURL:"",
				page:1,
				size:15,
				type:1,
				list:[]
			}
		},

		onLoad(){
			this.showindex()
			this.page = 1
			this.buylist()
		},
		onShow(){
			this.showindex()
			this.page = 1
			this.buylist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.buylist(15)
			}
		},
		methods: {
			buylist(size = 0){
				if(size){
					this.size = size
				}
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/tradelist', 
					data: {page:this.page,size:this.size,type:this.type},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							if(size){
								let len = res.data.data.length;
								for(let i=0;i<len;i++){
									this.list.push(res.data.data[i])
								}
							}else{
								this.list = res.data.data
							}
							this.page = this.page + 1;
						}else{
							uni.showToast({ title: res.data.errors.messag, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});	
			},
			buyClick(item){
				uni.navigateTo({
					url:'/pagesC/jiaoyi/buyinfo/buyinfo?id='+item.id,					
				 })
			},
			opencss(url){
				uni.navigateTo({
					url:url,	
				})
			},
			openshows(){
				uni.showToast({
					title: '优先提供给买单再挂卖单',
					icon: 'none'
				});
			},
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
							this.sum = res.data.data.sum
							this.money = res.data.data.user_money
							this.count = res.data.data.count
							this.finish = res.data.data.finish
							this.today = res.data.data.today
							this.min = res.data.data.interval_min
							this.max = res.data.data.interval_max
						}else{
							uni.showToast({ title: res.data.errors.messag, icon: "none" });
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
	body{background:rgb(94, 94, 94);}
	page{background:rgb(94, 94, 94);}
	.banners{width:100%;height:auto;}
	.bing{width:750rpx;height:350rpx}
	.uni-flex{display: flex;flex-direction: row;}
	.nav_ul{ width:730rpx;
			 height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: space-around;
			 margin:20rpx auto;
	}
	.nav_li{width:44%;
			height:80rpx;
			background-color:#000000;
			line-height:80rpx;
			text-align:center;
			color:#ffffff;
			font-size:28rpx;
			margin:0 1%;
	}
	.money_one{ width:660rpx;
			 height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: space-around;
			 margin:0 auto;
	}
	.money_li{
			width:50%;
			height:100rpx;
			line-height:50rpx;
			text-align:center;
			color:#ffffff;
			font-size:28rpx;
			border:1rpx solid #aaa6a5;
			border-radius: 10rpx;
			margin:0 10rpx;
	}
	.aui-wallet-head{background-position-x: 1%;
				background-position-y: 50%;
	}


	.user_help,.user_jifen{width:650upx;background:#ffffff;border-radius: 10upx; padding:40rpx 40rpx}
	.user_help{
			
			border-radius: 15upx;
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
	
.content1{	width:92%;
            margin:0 auto;			
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
			justify-content: space-between;	 
		}	

.list-ul{ width:100%;
			 height:160rpx;
			 padding:10rpx 20rpx;
			 background-color:#000000;		
			 border-radius: 10rpx;
			 margin-bottom:10rpx;
			 color:#adadad;
	}
.list-ol{height:50rpx;width:100%}	
.list-title{ width:100%;
			 height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: space-around;
			 background-color:#adadad;	
			 align-items:center;
			 margin-bottom:10rpx;
	}
	.list-li{width:150rpx;
			height:100rpx;        
			line-height:100rpx;			
			color:#000000;
			font-size:26rpx;
			margin-bottom:1rpx;		
	}
	.list-name{
		width:150rpx;
		line-height:35rpx;
		background-image:url(../../static/weike/buy.png);
		background-size:60rpx;
		background-position: 0 50%;
		background-repeat: no-repeat;
		padding-left:70rpx;
		align-items:center;
		display: flex;
		justify-content: space-between;
	}
	.buyin{
		height:50rpx;
		border-radius: 10rpx;
		background:#eb9414;	
		line-height:50rpx;
		margin:25rpx 0;
		color:#ffffff;
		text-align:center;
		font-size:26rpx;
	}
	.textcolor{color:#00aa00;}
	.textred{color:#f10000;}
</style>

