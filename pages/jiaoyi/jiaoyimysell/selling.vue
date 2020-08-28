<template>
	<view>
		<view class="mybuy border-b" v-for="(item,index) in list" :key="index">
			<view class="list-ul">
			    <view class="titles"> 订单号：{{item.trade_sn}}</view>
			</view>
			<view class="list-ul">
			   <view class="list-li titles">数量：{{item.number}}</view>
			   <view class="list-li titles" >买家 ：{{item.nick_name}}</view>		
			</view>
			<view class="list-ul">
			   <view class="list-li titles" @click="call(item.mobile_phone)">手机 ：{{item.mobile_phone}}</view>			
			</view>
			<view class="list-ul bt30">
			   <view class="list-li hhimg" v-if="item.bstatus == 0">
				   <view class="fonntsize10">未交易</view>
				   <view><image src="../../../static/hxsimg/nopay.jpg" class="pzimg"></image></view>
			   </view>
			   <view class="list-li hhimg" v-else-if="item.bstatus == 1">
				   <view class="fonntsize10">未打款</view>
				   <view><image src="../../../static/hxsimg/nopay.jpg" class="pzimg"></image></view>
			   </view>
			   <view class="list-li hhimg" v-else>
				   <view class="fonntsize10">已上传</view>
				   <view><image :src="item.buy_image" class="pzimg" @click="preview(index)"></image></view>
			   </view>
			   <view class="list-li hhimg">
				   <view class="hhmoney">金额 :{{item.amount}}</view>
				   <view class="hhok" v-if="item.bstatus == 0">未交易</view>
				   <view class="hhok" v-if="item.bstatus == 1" @click="buyclick(item.id,5)">待付款</view>
				   <view class="hhok" v-if="item.bstatus == 2" @click="buyclick(item.id,4)">确认收款</view>
				   <view class="hhok" v-if="item.bstatus == 3">已完成</view>
			   </view>
			</view>
		</view>				
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				page:1,
				size:5,
				type:3,
				list:[],
			}
		},
		methods: {
			call(mobile){
				uni.makePhoneCall({
			        phoneNumber: mobile, 
					success: (res) => {
						console.log('调用成功!')	
					},
					fail: (res) => {
						console.log('调用失败!')
					}
			    });
			},
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
				if(type == 4 || type == 7){
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
				}else if(type == 5){
					uni.showToast({ title: '未上传凭证不能点确认收款', icon: "none" });
					return false;
				}else{
					uni.showToast({ title: '订单已完成'});
					return false;
				}
			},
			preview(index){
			    uni.previewImage({urls: [this.list[index].buy_image]});
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
.hhok{height:60rpx;width:60%;
      background-color:#ff0000;
	  border-radius: 20rpx;
	  color:#ffffff;
	  line-height:60rpx;
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
