<template>
	<view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate justify-content-fs">
						<text class="title">提现账户</text>
						<view class="value">{{ bank_cur }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate justify-content-fs">
						<text class="title">提现金额(元)</text>
						<view class="value">
							<input placeholder="请输入提现金额" name="amount" v-model="amount" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="field-tips">最低可提现金额：<text class="uni-red"><block  v-if="buyer_cash > 0">￥{{ buyer_cash }}</block><block v-else>不限</block></text></view>
		<view class="field-tips" v-if="account">本次最大提现额度：<text class="uni-red">{{ account }}</text></view>
		<view class="btn-bar btn-bar-fixed">
			<block v-if="msg == ''">
			<view class="btn btn-red" @click="submitBtn">提交申请</view>
			</block>
			<block v-else=""><view class="btn btn-disabled2">{{msg}}</view></block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount:'',
				account:'',
				bank:[],
				bank_id:-1,
				bank_cur:'',
				msg:'',
				buyer_cash:0
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/account/raply/raply'
			}
		},
		methods:{
			raplayInfo(){
				uni.request({
					url:this.websiteUrl + '/api/v4/account/reply',
					method:'GET',
					data:{},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data:{data}}) => {
						if(data.code == 0){
							this.bank = data.bank
							if(data.ptype == 1){
								this.bank_cur = this.bank[0].bank_card
							}else{
								this.bank_cur = this.bank[0].alipay
							}
							this.account = data.surplus_amount
						}else{
							this.msg = data.msg
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
						this.buyer_cash = data.buyer_cash
					}
				});
			},
			submitBtn(){
				if(Number(this.amount) >= Number(this.buyer_cash)){
					uni.request({
						url:this.websiteUrl + '/api/v4/account/account',
						method:'POST',
						data:{
							amount:this.amount,
							surplus_type:1
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: ({data:{data}}) => {
							uni.showToast({
								title:data.msg,
								icon:'none'
							});
							
							uni.navigateTo({
								url:'/pagesB/account/account'
							})
						}
					});
				}else{
					uni.showToast({
						title:'提现金额不能小于最低提现金额',
						icon:'none'
					});
				}
			}
		},
		onLoad(){
			this.raplayInfo()

			this.shopConfig()
		}
	}
</script>

<style>
.uni-list-cell-navigate { align-items: flex-start;}
.uni-list-cell-navigate .title{ margin-right: 20upx; color: #000;}
.uni-list-cell-navigate .value textarea{ width:240px; height: 50px; margin-top: 10upx;}
.field-tips{ margin: 0 30upx;}
</style>
