<template>
	<view>
		<block v-if="doneinfo.pay_code == 'cod' || doneinfo.pay_code == 'balance' || doneinfo.order_amount == 0">
			<view class="flow-done">
				<view class="flow-done-con">
					<block v-if="doneinfo.pay_code == 'cod'">
						<view class="iconfont icon-qian"></view>
						<view class="flow-done-title">应付款金额</view>
						<view class="flow-done-price">{{ doneinfo.order_amount_format }}</view>
					</block>
					<block v-else>
						<view class="iconfont icon-hookring2"></view>
						<view class="flow-done-title" v-if="type == 1">订单支付成功</view>
						<view class="flow-done-title" v-else-if="type == 2">请重新下单</view>
						<view class="flow-done-title" v-else-if="type == 3">恭喜您中奖了</view>
					</block>
				</view>
				<view class="flow-done-all">
					<view class="uni-card uni-card-not">
						<view class="uni-list">
							<view class="uni-list-cell">
								<view class="uni-list-cell-navigate">
									<text class="title">订单号</text>
									<view class="value">{{ order_sn }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="btn-bar">
						<block v-if="doneinfo.extension_code == 'team_buy'">
							<navigator :url="'/pagesA/team/wait/wait?team_id=' + doneinfo.team_id" class="btn btn-white">查看拼团进度</navigator>
						</block>
						<block v-else-if="doneinfo.extension_code == 'crowd_buy'">
							<navigator url='/pagesA/crowdfunding/user/order' class="btn btn-white">查看订单</navigator>
						</block>
						<block v-else>
							<navigator url='/pagesB/order/order' class="btn btn-white">查看订单</navigator>
						</block>
					</view>
				</view>
				<view class="price-box" v-if="doneinfo.is_seckill && type == 1">
					<view class="left">秒杀活动火爆进行中</view> 
					<view class="right">
						<block>
							<text>距离中奖还剩:</text>
						</block>
						<view class="data">
							<block>
								<uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="sdateTime"></uni-countdown>
							</block>
						</view>
					</view>
				</view>
				<view class="price-box" v-if="doneinfo.is_seckill && type == 2">
					<view class="left">用户{{nick_name}}在你之后下单</view> 
					<view class="right">
						<block>
							<text>距离别人中奖还剩:</text>
						</block>
						<view class="data">
							<block>
								<uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="sdateTime"></uni-countdown>
							</block>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="cashier-desk">
				<!-- #ifdef APP-PLUS -->
				<view class="header-title">需要支付：<view class="price">{{ doneinfo.order_amount_format }}</view></view>
				<view class="cashier-content">
					<view class="title">请选择支付方式</view>
					<view class="uni-list">
						<radio-group @change="radioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in payment_list" :key="index">
								<view>{{item.name}}</view>
								<view><radio :value="item.id" color="#f92028" /></view>
							</label>
						</radio-group>
					</view>
				</view>
				<view class="btn">
					<block v-if="currentPayment == 'alipay'">
						<button type="warn" class="page-body-button" @click="paymentSubimt">支付宝支付</button>
					</block>
					<block v-else-if="currentPayment == 'wxpay'">
						<button type="warn" class="page-body-button" @click="paymentSubimt">微信支付</button>
					</block>
					<block v-else-if="currentPayment == 'baidu'">
						<button type="warn" class="page-body-button" @click="paymentSubimt">百度收银台</button>
					</block>
					<block v-else-if="currentPayment == 'appleiap'">
						<button type="warn" class="page-body-button" @click="paymentSubimt">苹果支付</button>
					</block>
					<block v-else>
						<button type="warn" disabled="true">请选择支付方式</button>
					</block>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<form @submit="weixinPay" report-submit="true">
				<view class="weixin-content">
					<view class="weixin-icon"><image src="../../static/weixin-pay.png" class="img" /></view>
					<view class="weixin-price">
						<view class="text">需支付</view>
						<view class="price">{{ doneinfo.order_amount_format }}</view>
					</view>
					<view class="weixin-pay-btn">
						<button type="primary" formType="submit" class="page-body-button">微信支付</button>
					</view>
				</view>
				</form>
				<!-- #endif -->
			</view>
		</block>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	export default {
		data() {
			return {
				order_sn: '',			//订单编号
				payment_list: [],		//第三方支付方式列表
				currentPayment: '',		//当前选择的第三方支付方式
				orderInfo: '',			//订单信息
				scopeSessions: {},
				dscLoading:true,
				type:1,
				nick_name:''
			};
		},
		components:{
			dscCommonNav,
			uniCountdown
		},
		computed: {
			...mapState({
				doneinfo: state => state.shopping.doneinfo
			}),
			sdateTime(){
				let sTime = Date.parse(new Date())/1000 + 98;
			    return this.$formatDateTime(sTime-28800)
			}
		},
		methods: {
			radioChange(e) {
				let that = this
				that.currentPayment = e.detail.value;
				that.getOrderInfo(e.detail.value, that.doneinfo.order_sn)
			},
			weixinPay(e){
				//读取本地缓存scopeSession
				uni.getStorage({
					key: 'scopeSession',
					complete: (res) => {
						uni.request({
							url: this.websiteUrl + '/api/v4/payment/change_app_payment',
							method: 'GET',
							data: {
								platform: uni.getStorageSync('platform'),
								order_sn: this.doneinfo.order_sn,
								pay_code: 'wxpay',
								//openid:res.data.openid,
								//formId:e.detail.formId
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								let paymentData = res.data.data
								//let url = 'https://uni.dtionuoaa.vip/pay.php?amount='+this.doneinfo.order_amount_format+'&pay_url='+paymentData.mweb_url
								window.location.href = paymentData.mweb_url
								// if(paymentData){
								// 	uni.requestPayment({
								// 		timeStamp: paymentData.timeStamp.toString(),
								// 		nonceStr: paymentData.nonceStr,
								// 		package: paymentData.package,
								// 		signType: 'MD5',
								// 		paySign: paymentData.paySign,
								// 		success: (e) => {
								// 			uni.showLoading({
								// 			    title: '支付成功!',
								// 				mask:true
								// 			});
											
								// 			if(this.doneinfo.extension_code == 'team_buy'){
								// 				uni.redirectTo({
								// 					url:'/pagesA/team/order/order',
								// 					complete: (res) => {
								// 						uni.hideLoading()
								// 					}
								// 				})
								// 			}else{
								// 				uni.redirectTo({
								// 					url:'/pagesB/order/order',
								// 					complete: (res) => {
								// 						uni.hideLoading()
								// 					}
								// 				});
								// 			}
								// 		},
								// 		fail: (e) => {
								// 			console.log(JSON.stringify(e))
								// 		}
								// 	});
								// }
							},
							fail: (res) => {
								console.log(JSON.stringify(res))
							}
						})
					}
				});
			},
			paymentSubimt() {
				let orderInfo = this.orderInfo.replace('\\', '');
				uni.requestPayment({
					provider: this.currentPayment,
					orderInfo: orderInfo,
					success: (e) => {
						uni.showLoading({
						    title: '支付成功!',
							mask:true
						});
						
						if(this.doneinfo.extension_code == 'team_buy'){
							uni.redirectTo({
								url:'/pagesA/team/order/order',
								complete: (res) => {
									uni.hideLoading()
								}
							})
						}else{
							uni.redirectTo({
								url:'/pagesB/order/order',
								complete: (res) => {
									uni.hideLoading()
								}
							});
						}
					},
					fail: (e) => {
						console.log(JSON.stringify(e))
					}
				});
			},
			getOrderInfo(pay_code, order_sn) {
				uni.request({
					url: this.websiteUrl + '/api/v4/payment/change_app_payment',
					method: 'GET',
					data: {
						platform: uni.getStorageSync('platform'),
						order_sn: order_sn,
						pay_code: pay_code
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('trade/paycheck request success,11')
						console.log(JSON.stringify(res.data))
						this.orderInfo = res.data.data;
					},
					fail: (res) => {
						console.log('trade/paycheck request fail')
						console.log(JSON.stringify(res))
					}
				})
			}
		},
		onLoad(e) {
			this.order_sn = e.order_sn;
			if(e.type != undefined){
				this.type = e.type
			}
			if(e.nick_name != undefined){
				this.nick_name = e.nick_name
			}
			this.$store.dispatch('setDoneInfo', {
				order_sn: this.order_sn
			});

			//获取支付方式
			// #ifdef APP-PLUS
			uni.getProvider({
				service: 'payment',
				success: (res) => {
					let providerList = [];
					res.provider.map((value) => {
                        switch (value) {
                            case 'alipay':
                                providerList.push({
                                    name: '支付宝',
                                    id: value
                                });
                                break;
                            case 'wxpay':
                                providerList.push({
                                    name: '微信',
                                    id: value
                                });
                                break;
                            default:
                                break;
                        }
                    });
					
                    this.payment_list = providerList;
				}
			});
			// #endif
		},
		watch:{
			doneinfo(){
				this.dscLoading = false
			}
		}
	}
</script>

<style>
	.cashier-desk {}

	.cashier-desk .header-title {
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		font-size: 32upx;
		padding: 10upx 20upx;
	}

	.cashier-desk .header-title .price {
		color: #f92028;
		font-size: 40upx;
	}

	.cashier-desk .btn {
		position: fixed;
		margin: 0 60upx 50upx;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.cashier-desk .btn button {
		padding: 0;
		font-size: 32upx;
		color: #fff;
		border-radius: 50upx;
		border: 0 !important;
	}

	.cashier-desk .btn button::after {
		content: " ";
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: 0;
		border: none;
		-webkit-transform: scale(0);
		transform: scale(0);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		box-sizing: border-box;
		border-radius: 0;
	}

	.cashier-content {
		background: #FFFFFF;
		margin-top: 20upx;
	}

	.cashier-content .title {
		padding: 20upx;
		font-size: 32upx;
	}

	.flow-done {
		padding-top: 60px;
	}

	.flow-done-con {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		align-items: center;
	}

	.flow-done-con .iconfont {
		font-size: 80px;
		line-height: normal;
	}

	.flow-done-con .icon-qian {
		color: #EFCE0C;
	}

	.flow-done-con .icon-hookring2 {
		color: #3ec074;
	}

	.flow-done-con .flow-done-title {
		font-size: 18px;
		margin-top: 20upx;
		color: #444444;
	}
	.flow-done-con .flow-done-price{
		font-size: 28px;
		margin-top: 20upx;
		color: #444444;
	}

	.flow-done-all {
		margin-top: 30px;
	}

	.flow-done-all .uni-list-cell-navigate .title,
	.flow-done-all .uni-list-cell-navigate .value {
		font-size: 16px;
	}

	.flow-done-all .btn-bar {
		margin: 0 20px;
	}

	.flow-done-all .btn-bar .btn {
		box-shadow: none;
	}
	
	.weixin-content{ display: flex; justify-content: center; flex-direction: column; text-align: center; margin: 0 60upx; padding: 150upx 0;}
	.weixin-content .weixin-icon{ width: 120upx; height: 120upx; margin: 30upx auto;}
	.weixin-content .weixin-price .text{ font-size: 40upx; }
	.weixin-content .weixin-price .price{ color: #f92028; font-size: 48upx; margin-top: 20upx;}
	.weixin-content .weixin-pay-btn button { padding: 0;font-size: 32upx;color: #fff;border-radius: 50upx;border: 0 !important; margin-top: 50upx;}
	
	.price-box{ display: flex; flex-direction: row; justify-content: center;}
	.price-box .left{ flex: 1; padding: 20upx; background: linear-gradient(90deg,#f22c8f,#f23256); color: #FFFFFF; font-size: 38upx;}
	.price-box .left view{ line-height: 1.2;}
	.price-box .left .price-weight{ font-size: 36upx; font-weight: 600;}
	.price-box .left .price-row{ display: flex; flex-direction: row; justify-content: flex-start;}
	.price-box .left .price-row .tag{ display: flex; flex-direction: row; overflow: hidden;}
	.price-box .left .price-row .tag-icon{ background: #FFFFFF; width: 50upx; border-radius: 20upx 0 0 20upx; display: flex; flex-direction: row; justify-content: center; align-items: center;}
	.price-box .left .price-row .tag-icon .iconfont{ color: #f23157; font-size: 24upx;}
	.price-box .left .price-row .tag-right-cont{ border: 1px solid #FFFFFF; padding: 0 20upx;}
	.price-box .left .price-row .sub{ display: flex; flex-direction: row; margin-left: 10upx; font-size: 25upx; align-items: center;}
	.price-box .left .price-row .sub .price-original{ font-size: 25upx; margin-left: 10upx;text-decoration:line-through;}
	.price-box .right{ display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20upx; background: #ffeae9;}
	.price-box .right text{ color: #f23157;}
</style>
