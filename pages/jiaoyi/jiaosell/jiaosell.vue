<template>
	<view >
	<view class="lvru"> 
		<view class="banners">
			<view class="bin_one"> 当前乐豆</view>
			<view class="bin_two"> {{money}}</view>
		</view>	
	</view>	
	<view class="lvru"> 
		<view class="list-ul">
			<view class="list-name"> 手续费：</view>
			<view class="list-inp"> 25% </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 最大交易：</view>
			<view class="list-inp"> 50000(数量为100的倍数) </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 购买数量：</view>
			<view class="list-inp"> 
			    <input type="number"  class="inp-100" name="number" v-model="snumber"  placeholder="请输入数量" :focus="true" />	
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 支付密码：</view>
			<view class="list-inp">
				<input type="password" name="password" v-model="password" placeholder="请输入您的交易密码" class="inp-100"/>
		    </view>					
		</view>
	</view>	
<!--    <view class="lvru"> 
		<view class="list-ul">
			<view class="list-name"> 银行帐户：</view>
			<view class="list-inp"> 
			    <input type="text"  class="inp-100" name="bank" v-model="bank"  placeholder=" 请输入开户行" :disabled="obank" />	
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 银行卡号：</view>
			<view class="list-inp"> 
			    <input type="text"  class="inp-100" name="banknumber" v-model="banknumber"  placeholder="请输入银行卡号" :disabled="obanknumber"/>	
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 支付宝号：</view>
			<view class="list-inp"> 
			    <input type="text"  class="inp-100" name="alipay" v-model="alipay"  placeholder="请输入支付宝账号" :disabled="oalipay"/>	
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 收款姓名：</view>
			<view class="list-inp"> 
			    <input type="text"  class="inp-100" name="username" v-model="username"  placeholder="请输入收款人姓名" :disabled="ousername"/>	
		    </view>					
		</view>
		
		<view class="disnone">
		  <input type="number" class="btn" name="unit" v-model="sunit"   placeholder="输入单价" />
		  <view class="btn"></view>
		</view>
	</view> -->
		<view class="loadin-go">
			<button  class="loading-btn"  @click="sell()">确认并挂买</button>
		</view>	
	

	
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config'
	import store from '@/store';
	const webUrl = localConfig.websiteUrl
	
	export default {
		data() {
			return {
				unit:2, 
				number:'',
				sunit:2,
				snumber:'',
				password:'',
				bank:'',
				banknumber:'',
				alipay:'',
				username:'',
				obank:false,
				obanknumber:false,
				oalipay:false,
				ousername:false,
				money:0
			};
		},
		methods:{
			sell(){
				if(!this.sunit){
					uni.showToast({ title: '单价不能为空', icon: "none" });
					return false;
				}
				if(!this.snumber){
					uni.showToast({ title: '数量不能为空', icon: "none" });
					return false;
				}
				let amount = this.sunit * this.snumber
				if(!Number.isInteger(amount)){
					uni.showToast({ title: '总价必须为整数', icon: "none" });
					return false;
				}
				if(!this.password){
					uni.showToast({ title: '交易密码不能为空', icon: "none" });
					return false;
				}
				// if(!this.bank){
				// 	uni.showToast({ title: '开户行不能为空', icon: "none" });
				// 	return false;
				// }
				// if(!this.banknumber){
				// 	uni.showToast({ title: '银行卡号不能为空', icon: "none" });
				// 	return false;
				// }
				// if(!this.alipay){
				// 	uni.showToast({ title: '支付宝账号不能为空', icon: "none" });
				// 	return false;
				// }
				// if(!this.username){
				// 	uni.showToast({ title: '请填写收款人姓名', icon: "none" });
				// 	return false;
				// }
				if(store.state.checkout){
					return false
				}
				console.log(this.sunit)
				store.commit('toggleCheckout',true)
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/onhook', 
					data: {
						unit:this.sunit,
						number:this.snumber,
						zfpwd:this.password,
						type:1,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						store.commit('toggleCheckout',false)
						if(res.data.status == 'success'){
							uni.showToast({ 
								title: res.data.data, 
								duration:1000,
								success:(res)=>{
									uni.reLaunch({
										url:'/pagesC/jiaoyi/shopjiaoyi',	
									})
								}
							});
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						store.commit('toggleCheckout',false)
						console.log(JSON.stringify(res))
					}
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
							this.money = res.data.data.user_money
							if(res.data.data.self.bank){
								this.bank = res.data.data.self.bank
								this.obank = true
							}
							if(res.data.data.self.banknumber){
								this.banknumber = res.data.data.self.banknumber
								this.obanknumber = true
							}
							if(res.data.data.self.alipay){
								this.alipay = res.data.data.self.alipay
								this.oalipay = true
							}
							if(res.data.data.self.username){
								this.username = res.data.data.self.username
								this.ousername = true
							}
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						store.commit('toggleCheckout',false)
						console.log(JSON.stringify(res))
					}
				});
			}
		},
		computed:{
			sum:function(){
				let amount = this.unit * this.number
				if(isNaN(amount)){
					return 0
				}else{
					return amount
				}
			},
			ssum:function(){
				let amount = this.sunit * this.snumber
				if(isNaN(amount)){
					return 0
				}else{
					return amount
				}
			}
		},
		onLoad(){
			this.showindex();
		},
		onShow(){
			this.showindex();
		}
	}
</script>

<style lang="scss">
	
body,page{
		background-color:#e8e8e8;	
		background-repeat: no-repeat;	
		justify-content:center;
	}
	
	.list-ul{ width:650rpx;
	         height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: flex-start;
			 padding:0 20rpx;
			 margin:0 auto;
			 background-color:#ffffff;	
			 padding-bottom:10rpx;
	
	}
	.list-inp{width:70%;
	        height:70rpx;        
			line-height:70rpx;
			text-align:center;
			color:#000000;
			font-size:24rpx;
			text-align:left;
	}
	.list-name{
		width:20%;
		margin-left:50rpx;
		height:70rpx;
		line-height:70rpx;
		text-align:center;
		color:#000000;
		font-size:24rpx;
		text-align:left;
	}
    .inp-100{height:70upx;line-height:70upx;color:#000000;border-bottom:1px solid #000000;font-size:24rpx}
    
	.textcolor{color:#ff0000;margin-left:20rpx;}
	.lvru{width:700rpx;height:auto;background-color:#ffffff;
	      border-radius: 20rpx;overflow: hidden;padding:20rpx;
		  margin:20rpx auto}
	
	
	.disnone{display:none}
	.banners{width:100%;height:210rpx;text-align:center;font-size:50rpx;padding-top:30rpx ;}
	.bin_one{text-align:center;font-size:50rpx;}
	.bin_two{text-align:center;font-size:50rpx;color:#FF495E}
	.loadin-go{
		width:80%;
		height:300upx;
		margin:0 auto;
		margin-top:30upx;
	}
	.loading-btn{width:100%;border:#FF0000 solid 1upx;background-color:#FF0000;border-radius:30upx;color:#FFFFFF}
	
	
	
	
	
	
</style>
