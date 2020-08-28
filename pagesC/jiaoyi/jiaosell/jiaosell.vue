<template>
	<view >
	<view class="lvru"> 
		<view class="banners">
			<view class="bin_one"> 当前可用乐券</view>
			<view class="bin_two"> {{money}}</view>
		</view>	
	</view>	
	<view class="lvru"> 
		<!-- <view class="list-ul">
			<view class="list-name"> 手续费：</view>
			<view class="list-inp"> 1% </view>					
		</view> -->
		<view class="list-ul">
			<view class="list-name"> 最大交易：</view>
			<view class="list-inp"> 100000(数量为10的倍数) </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 单个价格：</view>
			<view class="list-inp"> 
			    <input type="number"  class="inp-100"  placeholder-style="color:#909090"  name="sunit"  v-model="sunit"  :placeholder='allia'  :focus="true" /> 
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 购买总量：</view>
			<view class="list-inp"> 
			    <input type="number"  class="inp-100" placeholder-style="color:#909090" name="number" v-model="snumber"  placeholder="请输入要购买的总量" :focus="true" />	
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 最低限额：</view>
			<view class="list-inp"> 
			    <input type="number"  class="inp-100" placeholder-style="color:#909090" name="min_number" v-model="min_number"  placeholder="请输入最低交易数量" :focus="true" />	
		    </view>					
		</view>
		<view class="list-ul">
			<view class="list-name"> 支付密码：</view>
			<view class="list-inp">
				<input type="password"  placeholder-style="color:#909090" name="password" v-model="password" placeholder="请输入您的交易密码" class="inp-100"/>
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
	const tradeUrl = localConfig.tradeUrl
	
	export default {
		data() {
			return {
				unit:1,
				number:'',
				sunit:'',
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
				money:0,
				min_number:"",
				allia:''
			};
		},
		methods:{
			sell(){
				if(!this.sunit){
					uni.showToast({ title: '单价不能为空', icon: "none" });
					return false;
				}
				if(!this.snumber){
					uni.showToast({ title: '总数量不能为空', icon: "none" });
					return false;
				}
				if(!this.min_number){
					uni.showToast({ title: '最低交易限额不能为空', icon: "none" });
					return false;
				}
				// let amount = this.sunit * this.snumber
				// if(!Number.isInteger(amount)){
				// 	uni.showToast({ title: '总价必须为整数', icon: "none" });
				// 	return false;
				// }
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
				store.commit('toggleCheckout',true)
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/onhook', 
					data: {
						unit:this.sunit,
						number:this.snumber,
						zfpwd:this.password,
						min_number:this.min_number,
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
									uni.navigateTo({
										url:'/pagesC/jiaoyi/shopjiaoyi',	
									})
								}
							});
						}else{
							uni.showToast({ title: res.data.errors.messag, icon: "none" });
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
							this.allia ='请在'+res.data.data.interval_min +'-'+ res.data.data.interval_max+'元之间输入'
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
		background-color:#f9f9f9;	
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
    .inp-100{width:80%;height:70upx;line-height:70upx;color:#000000;border-bottom:1px solid #000000;font-size:24rpx}
    
	.textcolor{color:#e7cd36;margin-left:20rpx;}
	.lvru{width:650rpx;height:auto; 
	      border-radius: 20rpx;overflow: hidden;padding:20rpx;
		  margin:1rpx auto}
	
	
	.disnone{display:none}
	.banners{width:96%;height:160rpx;text-align:center;font-size:30rpx;padding-top:30rpx ;}
	.bin_one{text-align:center;font-size:50rpx;}
	.bin_two{text-align:center;font-size:50rpx;color:#e7cd36}
	.loadin-go{
		width:80%;
		height:300upx;
		margin:0 auto;
		margin-top:30upx;
	}
	.loading-btn{width:80%;border:#000000 solid 1upx;background-color:#000000;border-radius:15upx;color:#e7cd36}
	
	
	
	
	
	
</style>
