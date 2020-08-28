<template>
	<view>
		<view class="mybuy border-b" v-for="(item,index) in list" :key="index">
			<view class="list-ul">
			    <view class="titles"> 订单号：{{item.trade_sn}}</view>
			</view>
			<view class="list-ul">
			   <view class="list-li titles">数量：{{item.number}}</view>
			   <view class="list-li titles">金额：{{item.amount}}</view>
			</view>
			<view class="list-ul">
			   <view class="list-li titles">剩余数量：{{item.remaining_number}}</view>
			   <view class="list-li titles">剩余金额：{{item.remaining_amount}}</view>
			</view>
			<view class="list-ul">
			   <view class="list-li titles" v-if="item.status == -1">挂卖已取消</view>
			   <view class="list-li titles" v-if="item.remaining_amount == item.amount && item.status == 0">待售中</view>
			   <view class="list-li hhok" v-if="item.remaining_amount == item.amount && item.status == 0" @click="buyclick(item.id,6)">取消挂卖</view>
			   <view class="list-li titles" v-else-if="item.status == 1">确认中</view>
			   <view class="list-li titles" v-else-if="item.status == 2">已完成</view>
			   <view class="list-li titles" v-else-if="item.status == 0">部分已售出</view>
			</view>
		</view>
						
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				page:1,
				size:5,
				type:4,
				list:[]
			}
		},
		methods: {
			selllist(size = 0){
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
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});	
			},
			buyclick(id,type){
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/buy', 
					data: {type:type,id:id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({ 
								title: res.data.data,
								duration:1000,
								success:(res)=>{
									this.page = 1
									this.selllist()
								}
							});
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});
			}
		},
		onLoad(){
			this.page = 1
			this.selllist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.selllist(5)
			}
		}
	}
</script>

<style>
.mybuy{border-radius: 50rpx;margin:10rpx auto;width:710rpx;height:auto;}
.list-ul{ width:710rpx;
         height:auto;
		 display: -webkit-flex; /* Safari */
		 -webkit-justify-content: space-around; /* Safari 6.1+ */
		 display: flex;
		 justify-content: space-between;
		 padding:0 20rpx;
		 margin:2rpx auto;
		 background-color:#ffffff;	 
			 
}
.titles{line-height:80rpx;height:80rpx;width:100%}
.list-li{width:50%;
        height:auto;        
		text-align:center;
		color:#000000;
		font-size:28rpx;
		margin-bottom:1rpx;
		text-align:left;
}
.txtcen{text-align:center;}
.fonntsize10{font-size:20rpx;line-height:40rpx}
.list-name{
	width:20%
}
.hhimg{height:200rpx;text-align:center}
.pzimg{width:160rpx;height:160rpx;margin:0 auto}
.hhtext{height:40rpx;width:100%}
.hhmoney{height:100rpx;
		width:100%;
		padding:20rpx;
		line-height:60rpx;
		text-align:center;
 }      
.hhok{height:50rpx;width:30%;
      background-color:#ff0000;
	  border-radius: 20rpx;
	  color:#ffffff;
	  line-height:50rpx;
	  margin:20rpx auto;
	  text-align:center;
}
.hhok2{height:60rpx;width:60%;

	  color:#000000;
	  line-height:60rpx;
	  margin:20rpx auto;
	  text-align:center;
}


.bt30{padding-bottom:30rpx;background:#ffffff}
.border-b{border-bottom:1rpx solid #d9d9d9;}
</style>
