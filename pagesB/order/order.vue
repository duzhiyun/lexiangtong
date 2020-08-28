<template>
	<view class="container-tab-bar">
		<view class="tab-bar">
			<view v-for="(tab,index) in tabBars" :key="index" :class="['tab-item',status==index ? 'active' : '']" @click="orderStatusHandle(index)">
				<text>{{ tab }}</text>
			</view>
		</view>
		<view class="section-list">
			<block v-if="orderList && orderList.length > 0">
			<view class="user-item user-order-item" v-for="(item,index) in orderList" :key="index">
				<view class="item-hd">
					<view class="shop-name">{{item.shop_name}}</view>
					<view class="order-status uni-red">{{item.order_status}}</view>
				</view>
				<view class="item-bd">
					<view class="subHead">
						<view class="item">
							<view class="tit">订单号：</view>
							<view class="value"><navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">{{ item.order_sn }}</navigator></view>
						</view>
						<view class="item">
							<view class="tit">下单时间：</view>
							<view class="value time">
								<view>{{ item.add_time }}</view>
								<uni-tag text="拼团" size="small" type="error" v-if="item.team_id > 0"></uni-tag>
								<uni-tag text="砍价" size="small" type="error" v-if="item.extension_code == 'bargain_buy'"></uni-tag>
								<uni-tag text="拍卖" size="small" type="error" v-if="item.extension_code == 'auction'"></uni-tag>
								<uni-tag text="门店自提" size="small" type="error" v-if="item.is_store_order == 1"></uni-tag>
							</view>
						</view>
					</view>
					<view class="product-list product-list-max" v-if="item.order_goods.length > 1">
						<view class="product-items">
							<view class="item" v-for="(goodsItem,goodsIndex) in item.order_goods" :key="goodsIndex">
								<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
								<view class="product-img">
									<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
									<image src="../../static/gift-icon.png" class="icon" v-if="goodsItem.is_gift > 0"></image>
								</view>
								</navigator>
							</view>
						</view>
						<view class="product-more">
							<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
							<text>共 {{ item.order_goods_num }} 款</text>
							<uni-icon type="forward" size="18" color="#999999"></uni-icon>
							</navigator>
						</view>
					</view>
					<view class="product-list" v-else>
						<view class="product-items">
							<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
							<view class="item" v-for="(goodsItem,goodsIndex) in item.order_goods" :key="goodsIndex">
								<view class="product-img">
									<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
									<image src="../../static/gift-icon.png" class="icon" v-if="goodsItem.is_gift > 0"></image>
								</view>
								<view class="product-info">
									<view class="product-name twolist-hidden">{{ goodsItem.goods_name }}</view>
								</view>
							</view>
							</navigator>
						</view>
						<view class="product-more">
							<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
							<text>共 {{ item.order_goods_num }} 款</text>
							<uni-icon type="forward" size="18" color="#999999"></uni-icon>
							</navigator>
						</view>
					</view>
					<view class="list-item-box">共{{item.order_goods_num}}款商品 合计：<text class="uni-red">{{ item.total_amount_formated }}</text></view>
				</view>
				<view class="item-fd">
					<view class="btn-bar-min">
						<view class="btn" @click="delayOrder(item.order_id)" v-if="item.delay === 1">延迟收货</view>
						<view class="btn" @click="delOrder(item.order_id)" v-if="item.order_del > 0">删除订单</view>
						<view class="btn" @click="delRestore(item.order_id)" v-if="item.is_restore === 1">订单还原</view>
						<view class="btn" @click="refoundHandle(item.order_id)" v-if="item.handler_return && item.extension_code != 'package_buy'">申请售后</view>
						<view class="btn" @click="cancelOrder(item.order_id)" v-if="item.handler === 1  && item.is_restore === 0">取消订单</view>
						<view class="btn" @click="receivedOrder(item.order_id)" v-else-if="item.handler === 2  && item.is_restore === 0">确认收货</view>
						<view class="btn" v-else-if="item.handler === 0  && item.is_restore === 0">晒单评价</view>
						<view class="btn" @click="onlinepay(item.order_sn,item.pay_code)" v-if="item.online_pay && item.failure == 0 && item.is_restore === 0">立即支付</view>
						<view class="btn" @click="buyAgain(item.order_id)" v-if="item.order_status == '已完成' && item.is_store_order == 0">再次购买</view>
						<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none" v-if="item.is_restore === 0"><view class="btn">查看订单</view></navigator>
						
					</view>
				</view>
			</view>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
		</view>
		<dsc-common-nav></dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import uniTag from "@/components/uni-tag.vue";
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	export default {
		components: {
			uniTag,
			uniIcon,
			dscCommonNav,
			dscNotContent
		},
		data() {
			return {
				tabBars:['所有订单','待付款','待收货','已完成','回收站'],
				disabled:false,
				loading:true,
				page:1,
				size:10,
				status:0,
				type:'type',
				dscLoading:true
			};
		},
		computed:{
			...mapState({
				orderCount: state => state.user.userorderCount
			}),
			orderList:{
				get(){
					return this.$store.state.user.userOrderList
				},
				set(val){
					this.$store.state.user.userOrderList = val
				}
			},
		},
		methods:{
			//订单列表
			setOrderList(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}

				this.$store.dispatch('setOrderList',{
					page:this.page,
					size:this.size,
					status:this.status,
					type:this.type
				})
			},
			//订单切换
			orderStatusHandle(index){
				this.status = index
				this.setOrderList(1)
			},
			//立即支付
			onlinepay(id,code){
				uni.navigateTo({
					url:'/pages/done/done?order_sn=' + id,
				})
			},
			//申请退换货
			refoundHandle(id){
				// this.$outerHref(this.$websiteUrl+'user/refound?id='+id)
				uni.navigateTo({
					url:'/pagesB/afterSales/afterSales?id=' + id,
				})
			},
			//删除订单
			delOrder(id){
				this.$store.dispatch('setDeleteOrder',{
					order_id:id
				}).then(res=>{
					if(res.data == true){
						uni.showToast({
							title:'订单删除成功',
							icon:'none'
						});
						this.setOrderList(); 
					}
				})
			},
			//订单还原
			delRestore(id){
				this.$store.dispatch('setRestoreOrder',{
					order_id:id
				}).then(res=>{
					if(res.data == true){
						uni.showToast({
							title:'订单已还原',
							icon:'none'
						});
						this.setOrderList(1)
					}
				})
			},
			//取消订单
			cancelOrder(id){
				this.$store.dispatch('setOrderHandler',{
					order_id:id
				}).then(res=>{
					if(res.data == true){
						uni.showToast({
							title:'订单已取消',
							icon:'none'
						});
						this.setOrderList();
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
						this.setOrderList();  
					}
				})
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
						this.setOrderList()
					}
				})
			},
			//再次购买
			buyAgain(id){
				this.$store.dispatch('setbuyAgain',{
					id:id
				}).then(res=>{
					if(res.data.error == 0){
						if(res.data.cant_buy_goods.length == 0){
							uni.reLaunch({
								url:'/pages/cart/cart'
							});
						}else{
							uni.showModal({
								content:'订单包含活动或无库存商品,再看看其他商品吧~',
								cancelText:'去购物车',
								confirmText:'留在本页',
								success:(res)=>{
									if(res.cancel){
										uni.reLaunch({
											url:'/pages/cart/cart'
										});
									}
								}
							})
						}
					}else{
						uni.showToast({
							title:'参数有误',
							icon:'none'
						});
						this.setOrderList(1)
					}
				})
			}
		},
		onLoad(e){
			if(e.tab){
				this.orderStatusHandle(e.tab)
			}
		},
		onShow(){
			this.setOrderList(1)
		},
		onReachBottom(){
			if(this.page * this.size == this.orderList.length){
				this.page ++
				this.setOrderList()
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/order/order'
			}
		},
		watch:{
			orderList(){
				this.dscLoading = false
			}
		}
	}
</script>

<style>
.section-list{ margin-top: 20upx;}
.product-list .product-info{ display: flex; align-items: center;}
.product-list .product-more{ display: flex; align-items: center;}
</style>
