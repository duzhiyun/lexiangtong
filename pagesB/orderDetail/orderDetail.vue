<template>
	<view class="container fixed-bottom-padding">
		<view class="flow-checkout-adr flow-store-adr" v-if="orderDetail.offline_store">
			<uni-icon type="location" size="28" color="#999999"></uni-icon>
			<view class="store-content">
				<view class="tit">{{ orderDetail.offline_store.stores_name }}</view>
				<text v-if="orderDetail.pick_code">提货码: {{ orderDetail.pick_code }}</text>
				<text>服务电话: {{ orderDetail.offline_store.stores_tel }}</text>
				<text>营业时间: {{ orderDetail.offline_store.stores_opening_hours }}</text>
			</view>
		</view>
		<view class="flow-checkout-adr" v-else>
			<view class="adr-content">
				<view class="title">
					<text class="name">{{ orderDetail.consignee }}</text>
					<text class="mobile">{{ orderDetail.mobile }}</text>
				</view>
				<view class="address">{{ orderDetail.address }}</view>
			</view>
		</view>
		<view class="section-list">
			<view class="user-item">
				<view class="item-hd">
					<view class="shop-name">{{orderDetail.shop_name}}</view>
					<!-- #ifdef MP-WEIXIN-->
					<button open-type="contact" type="default" size="5" session-from="weapp" class="kefu kefu-cantact">
						<text>联系客服</text>
						<text class="iconfont icon-kefu uni-red"></text>
					</button>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS || H5 -->
					<view class="kefu" @click="onChat(0,orderDetail.shop_id)">
						<text>联系客服</text>
						<text class="iconfont icon-kefu uni-red"></text>
					</view>
					<!-- #endif -->
				</view>
				<view class="item-bd">
					<view class="subHead">
						<view class="item">
							<view class="tit">订单号：</view>
							<view class="value">{{ orderDetail.order_sn }}</view>
						</view>
						<view class="item">
							<view class="tit">下单时间：</view>
							<view class="value time">{{ orderDetail.add_time }}</view>
							<view class="tag">
								<block v-if="orderDetail.team_id > 0">
									<block v-if="orderDetail.failure != 1">拼团订单</block>
									<block v-else>拼团失败</block>
								</block>
								<block v-if="orderDetail.extension_code == 'bargain_buy'">砍价订单</block>
							</view>
						</view>
					</view>
					<view class="product-list product-list-max" v-if="listShow">
						<view class="product-items">
							<navigator :url="'/pages/goodsDetail/goodsDetail?id='+goodsItem.goods_id" class="item" hover-class="none" v-for="(goodsItem,goodsIndex) in orderDetail.goods" :key="goodsIndex">
								<view class="product-img">
									<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
									<image src="../../static/gift-icon.png" class="icon" v-if="goodsItem.is_gift > 0"></image>
									<image src="../../static/parts-icon.png" class="icon" v-if="goodsItem.parent_id > 0"></image>
								</view>
							</navigator>
						</view>
						<view class="product-more" @click="onListShow">
							<text>共 {{ length }} 款</text>
							<uni-icon type="forward" size="18" color="#999999"></uni-icon>
						</view>
					</view>
					<view class="product-list" v-else>
						<view class="product-items">
							<navigator :url="'/pages/goodsDetail/goodsDetail?id='+goodsItem.goods_id" class="item" hover-class="none" v-for="(goodsItem,goodsIndex) in orderDetail.goods" :key="goodsIndex">
								<view class="product-img">
									<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
									<image src="../../static/gift-icon.png" class="icon" v-if="goodsItem.is_gift > 0"></image>
									<image src="../../static/parts-icon.png" class="icon" v-if="goodsItem.parent_id > 0"></image>
								</view>
								<view class="product-info">
									<view class="product-name twolist-hidden">{{ goodsItem.goods_name }}</view>
									<view class="product-row">
										<view class="price">{{ goodsItem.goods_price_formated }}</view>
										<view class="number">x{{ goodsItem.goods_number }}</view>
									</view>
									<view class="product-attr">{{ goodsItem.goods_attr }}</view>
								</view>
							</navigator>
						</view>
						<view class="product-more" @click="onListShow" v-if="length > 1"><uni-icon type="arrowdown" size="18" color="#999999"></uni-icon></view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="orderDetail.shipping_id && !orderDetail.offline_store">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">配送方式</text>
						<view class="value">
							<text class="mr10">{{ orderDetail.shipping_name }}</text><text class="uni-red">{{ orderDetail.shipping_fee_formated }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-custom" v-if="orderDetail.postscript && !orderDetail.main_count > 0">
					<view class="uni-list-cell-navigate">
						<view class="value">
							<view>买家留言：{{ orderDetail.postscript }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">支付方式</text>
						<view class="value">{{ orderDetail.pay_name }}</view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-custom" v-if="orderDetail.exchange_goods == 0">
					<view class="uni-list-cell-navigate">
						<text class="title">发票信息</text>
						<view class="value">
							<block v-if="orderDetail.invoice_type == 1">
								<view>发票内容：增值税发票</view>
							</block>
							<block v-if="orderDetail.invoice_type == 0">
								<view>发票抬头：{{ orderDetail.inv_payee }}</view>
								<view>发票内容：{{ orderDetail.inv_content }}</view>
							</block>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.bonus_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">红包</text>
						<view class="value">
							<text class="mr10">红包金额</text><text class="uni-red">{{ orderDetail.bonus }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.coupons_type > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">优惠券</text>
						<view class="value">
							<text class="mr10">优惠券金额</text><text class="uni-red">{{ orderDetail.coupons }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.vc_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">储值卡</text>
						<view class="value">
							<text class="mr10">储值卡金额</text><text class="uni-red">{{ orderDetail.card_amount }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.integral > 0 && orderDetail.exchange_goods == 0">
					<view class="uni-list-cell-navigate">
						<text class="title">积分</text>
						<view class="value">
							<text class="mr10">积分抵扣金额</text><text class="uni-red">{{ orderDetail.integral_money }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<text class="title">商品金额</text>
						<view class="value uni-red">{{ orderDetail.goods_amount_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="discount > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">商品优惠</text>
						<view class="value uni-red">-{{ orderDetail.discount_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="!orderDetail.offline_store">
					<view class="uni-list-cell-navigate">
						<text class="title">配送运费</text>
						<view class="value uni-red">+{{ orderDetail.shipping_fee_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.rate_fee > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">综合税费</text>
						<view class="value uni-red">+{{ orderDetail.rate }}</view>
					</view>
				</view>
				<block v-if="orderDetail.membership_card_id && orderDetail.membership_card_id > 0">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="title">购买权益卡金额</text>
							<view class="value uni-red">+{{ orderDetail.membership_card_buy_money_formated }}</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="title">购买权益卡折扣</text>
							<view class="value uni-red">-{{ orderDetail.membership_card_discount_price_formated }}</view>
						</view>
					</view>
				</block>
				<view class="uni-list-cell" v-if="orderDetail.bonus_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">使用红包</text>
						<view class="value uni-red">-{{ orderDetail.bonus }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.coupons_type > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">使用优惠券</text>
						<view class="value uni-red">-{{ orderDetail.coupons }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.vc_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">使用储值卡</text>
						<view class="value uni-red">-{{ orderDetail.card_amount }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.integral > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">使用积分</text>
						<view class="value uni-red">-{{ orderDetail.integral }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.surplus > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">使用余额<block v-if="orderDetail.presale_final_pay">(支付定金)</block></text>
						<view class="value uni-red">-{{ orderDetail.surplus_formated  }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.money_paid > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">支付金额</text>
						<view class="value uni-red">-{{ orderDetail.money_paid_formated }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="orderDetail.delay === 1">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">延迟收货</text>
						<view class="value">
							<block v-if="orderDetail.delay_type == '申请'">
								<button type="warn" size="mini" @click="delayOrder(orderDetail.order_id)">{{ orderDetail.delay_type }}</button>
							</block>
							<block v-else>
								<text class="uni-red">{{ orderDetail.delay_type }}</text>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-goods-action" :class="{'btn-goods-action-custom':totalAmountInt > 0 || orderDetail.tracker}">
			<view class="submit-bar-text">
				<text>应付总额：</text>
				<view class="submit-bar-price">{{ amountPrice }}</view>
			</view>
			<view class="btn-bar">
				<block v-if="orderDetail.pay_name != '货到付款'">
					<view class="btn btn-red" v-if="orderDetail.total_amount > 0 && orderDetail.handler != 7 && orderDetail.handler != 8 && orderDetail.failure == 0" @click="onlinepay(orderDetail.order_sn)">立即付款</view>
				</block>
				<block v-if="orderDetail.handler == 2"><view class="btn btn-red" @click="receivedOrder(orderDetail.order_id)">确认收货</view></block>
				<block v-if="orderDetail.handler == 4"><view class="btn btn-red">已完成</view></block>
				
				<block v-if="orderDetail.handler == 1"><view class="btn btn-org" @click="onClickBigBtn(orderDetail.order_id)">取消订单</view></block>
				<block v-if="orderDetail.handler == 3"><view class="btn btn-org" @click="onCommentBtn(orderDetail.order_id)">晒单评价</view></block>
				<block v-if="orderDetail.handler == 5"><view class="btn btn-org">付款</view></block>
				<block v-if="orderDetail.handler == 6"><view class="btn btn-org">已确认</view></block>
				<block v-if="orderDetail.handler == 7"><view class="btn btn-org">已取消</view></block>
				<block v-if="orderDetail.handler == 8"><view class="btn btn-org">无效订单</view></block>
				<block v-if="orderDetail.tracker"><view class="btn btn-org" @click="$outerHref(orderDetail.tracker)">订单跟踪</view></block>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		components:{
			uniIcon
		},
		data() {
			return {
				length:0,
				order_id:0,
				buttonText:'立即付款'
			};
		},
		computed:{
			...mapState({
				orderDetail: state => state.user.userOrderDetail
			}),
			goods(){
				return this.orderDetail.goods
			},
			discount(){
				return Number(this.orderDetail.discount)
			},
			amountPrice(){
				let price = 0
				if(this.orderDetail.total_amount){
					price = this.orderDetail.total_amount ? this.orderDetail.total_amount : this.orderDetail.goods_amount
				}

				return '¥' + price
			},
			totalAmountInt(){
			  return Number(this.orderDetail.total_amount)
			},
			listShow:{
				get(){
				  return this.$store.state.user.listShow
				},
				set(val){
				  this.$store.state.user.listShow = val
				}
			},
			pay_code(){
			  return this.orderDetail.pay_code ? this.orderDetail.pay_code : 'balance'
			}
		},
		methods:{
			orderLoad(id){
				this.$store.dispatch('setOrderDetail',{
					order_id:id
				});
			},
			onListShow(){
				this.listShow = this.listShow ? false : true;
			},
			//取消订单
			onClickBigBtn(id){
				this.$store.dispatch('setOrderHandler',{
					order_id:id
				}).then(res=>{
					if(res.data == true){
						uni.showToast({
							title:'订单已取消',
							icon:'none'
						})
						this.orderLoad(id);
					}
				})
			},
			//延迟收货
			delayOrder(id){
				this.$store.dispatch('setDelayOrder',{
					order_id:id
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					});
					
					if(res.data.error == 0){
						this.orderLoad(id);
					}
				})
			},
			//晒单评论
			onCommentBtn(id){
				
			},
			//确认收货
			receivedOrder(id){
				this.$store.dispatch('setReceivedOrder',{
					order_id:id
				}).then(res=>{
					if(res.data == true){
						uni.showToast({
							title:'订单已确认收货',
							icon:'none'
						});
						this.orderLoad(id);
					}
				})
			},
			//立即支付
			onlinepay(id,pay){
				uni.navigateTo({
					url:'/pages/done/done?order_sn=' + id
				})
			}
		},
		onLoad(e){
			this.order_id = e.id;
		},
		onShow(){
			this.orderLoad(this.order_id)
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/orderDetail/orderDetail'
			}
		},
		watch:{
			goods(){
				this.length = this.goods.length
			}
		}
	}
</script>

<style>
.uni-list-cell-custom .uni-list-cell-navigate{ display: flex; flex-direction: column;}
.uni-list-cell-custom .uni-list-cell-navigate .title{ width: 100%; }
.uni-list-cell-custom .uni-list-cell-navigate .value{ width: 100%; display: flex; color: #999999; flex-direction: column;}
.uni-list-cell-custom .uni-list-cell-navigate .value view{ width: 100%;}

.uni-list-cell-title .uni-list-cell-navigate .title{ color: #000000; font-size: 30upx; flex: 1;}
.uni-list-cell-title .uni-list-cell-navigate .value{ font-size: 30upx; }
</style>
