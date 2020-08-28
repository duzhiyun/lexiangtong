<template>
	<view style="background:#b86d37">
		<view class="allwidth">
			<view class="real-tit">
				<view><text class="fz72">请认证您的身份</text></view>
				<view><text class="fz24">为了防范您的身份信息被冒用，保证资金安全</text></view>
				<view><text class="fz24">需要进行人脸识别以确保为本人操作</text></view>
			</view>
			<view >
				<image src="../../../static/weike/erwma.png" class="erweima"></image>
			</view>			
		</view>
		<view class="real-desc desc" >
			<view><text class="cloblack">1、认证需要2元，失败3次后请重新支付认证</text></view>
			<view><text class="cloblack">2、请在光线充足的环境下进行,确保认证通过</text></view>
		    <view><text class="cloblack">3、跟随APP认证流程提示完成所需要认证动作</text></view>
		    <view><text class="cloblack">4、本次认证对接公安系统数据库进行核对完成</text></view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="paymentSelect">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">支付方式</text>
						<view class="value">{{ pay_name }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-bar btn-bar-fixed">
			<view class="btn btn-red" @click="submitBtn" style="background:#040404">进行支付</view>
		</view>
		
		
		<!--支付方式-->
		<uni-popup :show="paymentShow" type="bottom" v-on:hidePopup="handelClose('payment')">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">支付方式</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('payment')"></uni-icon>
				</view>
				<view class="not-content">
					<view class="select-list">
						<view class="select-item" v-for="(item,index) in payment_method" :key="index" :class="{'active':pay_id == item.pay_id}" @click="payment_method_select(item.pay_id,item.pay_name,item.pay_code)">
							<view class="txt">{{ item.pay_name }}</view>
							<view class="iconfont icon-ok"></view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				amount:2,
				user_note:'',
				payment_method:[],
				paymentShow: false,
				pay_id: 20,
				pay_name: '微信支付',
				pay_code:'wxpay',
				buyer_recharge:0,
				submit_btn:''
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/account/deposit/deposit'
			}
		},
		methods:{
			depositInfo(){
				uni.request({
					url:this.websiteUrl + '/api/v4/account/deposit',
					method:'GET',
					data:{},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.payment_method = res.data.data.payment
							//#ifdef MP-WEIXIN
							this.payment_method.forEach(pay=>{
								if(pay.pay_code == 'wxpay'){
									this.pay_id = pay.pay_id;
									this.pay_name = pay.pay_name;
								}
							})
							//#endif
						}
					}
				});
			},
			shopConfig(){
				uni.request({
					url:this.websiteUrl + '/api/v4/shop/config',
					method:'GET',
					data:{},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data:{data}}) => {
						this.buyer_recharge = data.buyer_recharge
					}
				});
			},
			submitBtn(){
				let that = this
				if(Number(this.amount) >= Number(this.buyer_recharge)){
					uni.getStorage({
						key: 'scopeSession',
						complete: (res) => {
							that.accountPay('')
						}
					});
				}else{
					uni.showToast({
						title:'充值金额不能小于最低充值金额',
						icon:'none'
					});
				}
			},
			accountPay(openid){
				let o = '';
				let platform = uni.getStorageSync('platform');
				if(platform === 'MP-WEIXIN'){
					o = {
						amount:this.amount,
						user_note:this.user_note,
						payment_id:this.pay_id,
						surplus_type:0,
						platform:platform,
						openid:openid
					}
				}else if(platform === 'APP'){
					o = {
						amount:this.amount,
						user_note:this.user_note,
						payment_id:this.pay_id,
						surplus_type:0,
						platform:'H5'
					}
				}else if(platform === 'H5'){
					o = {
						amount:this.amount,
						user_note:this.user_note,
						payment_id:this.pay_id,
						surplus_type:0,
						platform:platform
					}
				}
				
				uni.request({
					url:this.websiteUrl + '/api/v4/account/account',
					method:'POST',
					data: o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							if(platform === 'MP-WEIXIN'){
								this.weixinPay(res.data.data.pay_button); 
							}else if(platform === 'APP'){
								let paymentData = res.data.data.pay_button
								this.$outerHref('https://task.dtionuoaa.vip/pay/pay.php?amount=2&pay_url='+btoa(paymentData.mweb_url))
								//this.payment(res.data.data.pay_button)
							}else if(platform === 'H5'){
								let paymentData = res.data.data.pay_button
								window.location.href = paymentData.mweb_url
							}
						}
					}
				});
			},
			weixinPay(data){
				let paymentData = JSON.parse(data);
				uni.requestPayment({
					timeStamp: paymentData.timeStamp.toString(),
					nonceStr: paymentData.nonceStr,
					package: paymentData.package,
					signType: 'MD5',
					paySign: paymentData.paySign,
					success: (e) => {
						uni.showToast({
							title: "支付成功!"
						});
						
						uni.navigateTo({
							url:'/pages/face/face'
						});
					},
					fail: (e) => {
						console.log(JSON.stringify(e))
					}
				});
			},
			payment(data){
				uni.requestPayment({
					provider: this.pay_code,
					orderInfo: data,
					success: (e) => {
						uni.showToast({
							title: "支付成功!"
						});
						
						uni.navigateTo({
							url:'/pagesB/face/face'
						});
					},
					fail: (e) => {
						console.log(JSON.stringify(e));
					}
				});
			},
			//展开支付方式
			paymentSelect() {
			    this.paymentShow = true;
			},
			//选择支付方式
			payment_method_select(id, name,code) {
			    this.pay_id = id;
			    this.pay_name = name;
				this.pay_code = code;
				this.paymentShow = false;
			},
			//关闭弹出层
			handelClose(val){
				if(val == 'payment'){
					this.paymentShow = false
				}
			},
		},
		onLoad(){
			this.shopConfig();
		},
		onShow() {
			this.depositInfo();
		}
	}
</script>

<style>
	body,page{background-color:#b86d37;}
.uni-list-cell-navigate { align-items: flex-start;}
.uni-list-cell-navigate .title{ margin-right: 20upx; color: #000;}
.uni-list-cell-navigate .value{ flex: 1;}
.uni-list-cell-navigate .value textarea{ width:100%; height: 50px; margin-top: 10upx;}
.field-tips{ margin: 0 30upx;}

.allwidth{width:100%;height:auto;background-color:#b86d37;text-align:center;}
.real-tit{text-align:center;font-size:40rpx;height:300rpx;
          flex-direction:column;}
.erweima{text-align:center;margin:0 auto}
.fz24{font-size:28rpx;color:#e8e8e8;white-space: pre-wrap;}
.fz72{font-size:78rpx;color:#e3e3e3;white-space: pre-wrap;}
.cloblack{color:#000000;font-size:28rpx;font-weight:bold;line-height:60rpx}


.real-button{margin:60rpx}
.getreal{width:70%;height:80rpx;border-radius: 40rpx;background-color:#030000;margin:0 auto;color:#ffffff;text-align:center}
.gettext{line-height:80rpx;color:#ffffff}
.real-desc{text-align:center;height:320rpx;
           flex-direction:column;padding-top:50rpx}
.desc{width:600rpx;margin:0 auto;text-align:left;color:#ffffff}
</style>
