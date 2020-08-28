<template>
	<view>
		     <view class="content">
				<view class="list-ul pt20">
					 <view class="list-left">买入:</view>
					 <view class="list-right">{{buy_sn}}</view>
				</view>
<!-- 				<view class="list-ul">
					 <view class="list-left">数量:</view>
					 <view class="list-right">{{snumber}}</view>
				</view> -->
				<view class="list-ul">
					 <view class="list-left">价格</view>
					 <view class="list-right">{{samount}}</view>
				</view>
			</view>
			<view class="content">
				<view class="list-ul pt20">
					 <view class="list2-left">银行账号</view>
					 <view class="list2-right">
						 <input type="text"  class="inp-100" name="bank" v-model="bank"  placeholder=" 请输入开户行" />
				     </view>
				</view>
				<view class="list-ul pt20">
					 <view class="list2-left">银行卡号</view>
					 <view class="list2-right">
						 <input type="number"  class="inp-100" name="banknumber" v-model="banknumber"  placeholder=" 请输入银行卡号" />
				     </view>
				</view>
				<view class="list-ul pt20">
					 <view class="list2-left">支付宝号</view>
					 <view class="list2-right">
						 <input type="text"  class="inp-100" name="alipay" v-model="alipay"  placeholder="请输入支付宝账号" />	
				     </view>
				</view>
				<view class="list-ul pt20">
					 <view class="list2-left">收款人姓名</view>
					 <view class="list2-right">
						 <input type="text"  class="inp-100" name="myusername" v-model="myusername"  placeholder="收款人姓名" />	
				     </view>
				</view>				<view class="list-ul">
					 <view class="list2-left">交易密码</view>
					 <view class="list2-right">
						  <input type="password" name="password" v-model="password" placeholder="请输入您的交易密码" class="inp-100" @click="focusclick()" />
					 </view>
				</view>
				<view class="list-ul">
					 <view class="list2-left">购买人</view>
					 <view class="list2-right">
						 {{username}}
				     </view>
				</view>
				<view class="list-ul">
					 <view class="list2-left">手机号</view>
					 <view class="list2-right">
						{{mobile}}
					 </view>
				</view>					
		    </view>
			
			<view class="mp690">
				<button  class="loading-btn"  @click="buyocc()">确认卖出</button>
			</view>	
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	import store from '@/store';
	
	export default {
		data() {
			return {
				id:0,
				buy_sn:'',
				snumber:0,
				samount:0,
				unit:2,
				number:0,
				password:'',
				username:'',
				mobile:'',
				bank:'',
				banknumber:'',
				alipay:'',
				myusername:''
			}
		},
		methods: {
			showindex(){
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/buy', 
					data: {type:1,id:this.id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.mobile = res.data.data.user.mobile_phone
							this.username = res.data.data.user.nick_name
							this.buy_sn = res.data.data.trade.buy_sn
							this.snumber = res.data.data.trade.number
							this.number = res.data.data.trade.number
							this.samount = Math.round(res.data.data.trade.amount)
							this.bank = res.data.data.real.bank_name
							this.banknumber = res.data.data.real.bank_card
							this.myusername = res.data.data.real.real_name
							this.alipay = res.data.data.real.alipay
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						store.commit('toggleCheckout',false)
						console.log(JSON.stringify(res))
					}
				});
			},
		
		    buyocc(){
				let that = this;
				uni.showModal({
					title: '购买规则确认',
					content: '购买者必须在120分钟内进行付款并确认，否则作封号处理',
					success: function (res) {
						if (res.confirm) {	
							that.buyclick();
						} else if (res.cancel) {
							return false;
						}
					},
				});				
			},
			
			buyclick(){
				if(!this.bank){
					uni.showToast({ title: '开户行不能为空', icon: "none" });
					return false;
				}
				if(!this.banknumber){
					uni.showToast({ title: '银行卡号不能为空', icon: "none" });
					return false;
				}
				if(!this.alipay){
					uni.showToast({ title: '支付宝账号不能为空', icon: "none" });
					return false;
				}
				if(!this.myusername){
					uni.showToast({ title: '请填写收款人姓名', icon: "none" });
					return false;
				}
				if(!this.password){
					uni.showToast({ title: '交易密码不能为空', icon: "none" });
					return false;
				}
				if(store.state.checkout){
					return false
				}
				store.commit('toggleCheckout',true)
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/buy', 
					data: {
						type:2,
					    id:this.id,
						number:this.number,
						unit:this.unit,
						zfpwd:this.password,
						bank:this.bank,
						banknumber:this.banknumber,
						alipay:this.alipay,
						username:this.myusername
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
										url:'/pagesC/jiaoyi/jiaoyimysell/selling',	
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
			}
		},
		onLoad(e){
			this.id = e.id
			this.showindex()
		},
		onShow(e){
			this.id = e.id
			this.showindex()
		}
	}
</script>

<style>
page,body{background:#d9d9d9}
.content{margin:20rpx auto;
		width:710rpx;
		height:auto;
		border-radius:10rpx;
		background-color:#FF0000;
		overflow:hidden;
		padding-top:10rpx;
		}
.list-ul{    width:710rpx;
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
.list-left{width:15%;
		margin-left:20rpx;
		height:70rpx;
		line-height:70rpx;
		text-align:center;
		color:#000000;
		font-size:32rpx;
		text-align:left;
		}
.list-right{width:70%;
		margin-left:20rpx;
		height:70rpx;
		line-height:70rpx;
		text-align:center;
		color:#000000;
		font-size:32rpx;
		text-align:left;
		}
.list2-left{width:20%;
		margin-left:20rpx;
		height:100rpx;
		line-height:100rpx;
		text-align:center;
		color:#000000;
		font-size:28rpx;
		text-align:left;
		}
.list2-right{width:70%;
		margin-left:20rpx;
		height:100rpx;
		line-height:100rpx;
		text-align:center;
		color:#000000;
		font-size:28rpx;
		text-align:left;
		}
.inp-100{height:100rpx;
		line-height:100rpx;
        color:#000000;
		border-bottom:1px solid #000000;
		font-size:24rpx
		}
.list3-left{width:20%;
		margin-left:20rpx;
		height:70rpx;
		line-height:70rpx;
		text-align:center;
		color:#000000;
		font-size:28rpx;
		text-align:left;
		}
.list3-right{width:70%;
		margin-left:20rpx;
		height:70rpx;
		line-height:70rpx;
		text-align:center;
		color:#000000;
		font-size:28rpx;
		text-align:left;
		} 
.mt20{margin-top:20rpx}
.pt20{padding-top:20rpx}
.loading-btn{width:100%;border:#FF0000 solid 1upx;background-color:#FF0000;border-radius:30upx;color:#FFFFFF}
.mp690{width:690rpx;margin:0 auto;height:auto}	
	
</style>
