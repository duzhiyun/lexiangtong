<template>
	<view>
		<view class="mybuy border-b" v-for="(item,index) in list" :key="index">
			<view class="list-ul">
			    <view class="titles"> 订单号：{{item.buy_sn}}</view>
			</view>
			<view class="list-ul">
			   <view class="list-li titles">卖家 ：{{item.username}}</view>
			   <view class="list-li txtcen titles">总数量 ：{{item.number}}</view>
			</view>
			<view class="list-ul">
			   <view class="list-li titles">本单数量 ：{{item.count}}</view>
			   <view class="list-li txtcen titles">本单金额 ：{{item.price}}</view>
			</view>
			<view class="list-ol">
			   <view> 手机号码 </view>
			   <view class="textblue" @click="call(item.user_name)">{{item.user_name || ''}}</view>
			</view>
			<view class="list-ol" @click="copying(item.alipay)">
			   <view> 支付宝帐号 </view>
			   <view class="textblue" >{{item.alipay}}</view>
			</view>
			<view class="list-ol"  @click="copying(item.banknumber)">
			    <view>银行名称：{{item.bank}}</view>
				<view class="textblue">银行帐户：{{item.banknumber}}</view>			  
			</view>		
			
			<view class="list-ul bt30">
			   <view class="list-li hhimg" v-if="item.status == 0">
				   <view class="fonntsize10"></view>			   				   
				   <view @click="chooseImage('front_of_id_card',index)"><image :src="item.image" class="pzimg"></image></view>
				   <view class="hhak" v-if="item.status == 0" @click="buyclick(item.id,5)">取消购买</view>
			   </view>
			   <view class="list-li hhimg" v-else-if="item.tstatus == 0">
				   <view class="fonntsize10">请上传打款凭证</view>
				   <view @click="chooseImage('front_of_id_card',index)"><image :src="item.image" class="pzimg"></image></view>
			       <view class="hhak" @click="buyclick(item.tid,3)">上传凭证</view>
			   </view>
			   <view class="list-li hhimg" v-else-if="item.tstatus == 2">
				   <view class="fonntsize10">已上传</view>
				   <view @click="chooseImage('front_of_id_card',index)"><image :src="item.image" class="pzimg"></image></view>
			       <view class="hhak" @click="buyclick(item.tid,3)">重新上传</view>
			   </view>
			   <view class="list-li hhimg" v-else>
				   <view class="fonntsize10">已上传</view>
				   <view @click="chooseImage('front_of_id_card',index)"><image :src="item.image" class="pzimg"></image></view>
			       <view class="hhak">已完成</view>
			   </view>
			   <view class="list-li hhimg" > 
			       <view class="hhmoney">总金额 :{{item.amount}}</view>
				   <view class="hhok" v-if="item.status == 0" @click="buyclick(item.id,5)">取消购买</view>
				   <view class="hhok" v-if="item.tstatus == 0" @click="buyclick(item.tid,3)">上传凭证</view>
				   <view class="hhok" v-if="item.status == 2">待待对方确认</view>
				   <view class="hhok" v-if="item.status == 3">已完成</view>
			   </view>
			</view>
			<view class="list-ol" v-if="item.status == 1">
			    <view>请在120分钟内完成付款，受投诉将作封号处理</view>					  
			</view>	
		</view>
		
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	const tradeUrl = localConfig.tradeUrl 
	export default {
		data() {
			return {
				page:1,
				size:5,
				type:2,
				list:[],
				buy_image:'',
				is_upload:false
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
			copying(link){
				uni.setClipboardData({
					data: link,
					success: function () {
						console.log('success');
						uni.showToast({ title: '复制链接成功'});
					}
				});	
			},
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
								let len = res.data.data.length;
								for(let i=0;i<len;i++){
									if(res.data.data[i].image == ''){
										res.data.data[i].image = '../../../static/hxsimg/errorImage.jpg'
									}
								}
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
			chooseImage(val,i){
				uni.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success:(res)=>{
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial',{
								file:{
									content:base64
								},
								type:val
							}).then(data=>{
								if(data.status == 'success'){
									this.list[i].image = data.data[0]
									this.buy_image = data.data[0]
									this.is_upload = true
								}
							})
						}).catch(error => {
							console.error(error,5);
						});
					}
				})
			},
			buyclick(id,type){
				if(type == 3){
					if(!this.is_upload){
						uni.showToast({ title: '请上传打款凭证', icon: "none" });
						return false;
					}
				}
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/buy', 
					data: {type:type,id:id,buy_image:this.buy_image},
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
									this.buylist()
								}
							});
						}else{
							uni.showToast({ title: res.data.errors.messag, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});
			}
		},
		
		onLoad(){
			this.page = 1
			this.buylist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.buylist(5)
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
.list-ol{width:710rpx;
         height:auto;
		 padding:0 20rpx;
		 margin:2rpx auto;
		 background-color:#ffffff;		
		 }
.textblue{ color:#007AFF}
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
.fonntsize10{font-size:26rpx;line-height:40rpx;}
.list-name{
	width:20%
}
.hhimg{height:200rpx;text-align:center}
.pzimg{width:160rpx;height:100rpx;margin:0 auto}
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
.hhak{height:40rpx;width:50%;
      background-color:#ff0000;
	  border-radius: 20rpx;
	  color:#ffffff;
	  line-height:40rpx;
	  margin:5rpx auto;
	  text-align:center;
}

.chhok{height:40rpx;width:160rpx;
      background-color:#ff0000;
	  border-radius: 20rpx;
	  color:#ffffff;
	  line-height:40rpx;
	  margin:5rpx auto;
	  text-align:center;
}
.bt30{padding-bottom:30rpx;background:#ffffff}
.border-b{border-bottom:1rpx solid #d9d9d9;}
</style>
