<template>
	<view class="drp-order">
		<view class="header">
			<text>获得佣金（元）</text>
			<view class="price">{{drpOrderDetailData.money_format}}</view>
		</view>
		<view class="section-list">
			<view class="drp-order-list">
				<view class="order-box">
					<view class="order-header">
						<view class="name">买家：{{drpOrderDetailData.buy_user_name}}</view>
						<view class="uni-red">{{ drpOrderDetailData.status == 0 ? '未分成':'已分成'}}</view>
					</view>
					<view class="order-sn">
						<view>订单号：<text>{{drpOrderDetailData.order_sn}}</text></view>
						<view>{{drpOrderDetailData.add_time_format}}</view>
					</view>
				</view>
				<view class="goods-list" v-for="(goods,goodsIndex) in drpOrderDetailData.goods_list" :key="goodsIndex">
					<view class="left"><image :src="goods.goods_thumb" mode="widthFix"></image></view>
					<view class="right">
						<view class="name">{{goods.goods_name}}</view>
						<view class="out">
							<view class="price uni-red">{{goods.goods_price_format}}</view>
							<view class="number">×{{goods.goods_number}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>我的微店</text>
			</navigator>
		</dsc-common-nav>

		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";

	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';

	export default {
		data() {
			return {
				order_id:0
			}
		},
		components:{
			uniIcon,
			dscCommonNav,
			dscNotContent
		},
		onLoad(e) {
			this.order_id = e.order_id;
			this.load();
		},
		computed: {
			...mapState({
				drpOrderDetailData: state => state.drp.drpOrderDetailData,
			})
		},
		methods: {
			load(){
				this.$store.dispatch('setDrpOrderDetail',{
					order_id:this.order_id
				})
			}
		}
	}
</script>

<style>
.header{ background: linear-gradient(#f84d4d, #fe5b64); padding: 40upx 30upx; color: #FFFFFF;}
.header .price{ font-size: 50upx; line-height: 1.5;}

.drp-order-list{ background: #FFFFFF; margin-top: 20upx;}
.drp-order-list .order-box{ padding: 0 30upx;}
.drp-order-list .order-box .order-header{ padding: 20upx 0; display: flex; flex-direction: row; justify-content: space-between; align-items: center; border-bottom: 1px solid #f4f4f4;}
.drp-order-list .order-box .order-sn{ padding: 20upx 0;}
.drp-order-list .order-box .order-sn view{ color: #777777; line-height: 1.6; font-size: 26upx;}
.drp-order-list .order-box .order-sn text{ color: #333333;}

.goods-list{ padding: 20upx; border-top: 1px solid #f4f4f4; border-bottom: 1px solid #f4f4f4; display: flex; flex-direction: row; margin-bottom: 0;}
.goods-list .left{ width: 150upx; height: 150upx; border: 1px solid #f4f4f4;}
.goods-list .left image{ width: 100%; }
.goods-list .right{ display: flex; flex: 1 1 0%; flex-direction: column; margin-left: 20upx; }
.goods-list .right .name{ font-size: 28upx; color: #333333; line-height: 1.5;}
.goods-list .right .out{ display: flex; justify-content: space-between; align-items: center; margin-top: 20upx;}
.goods-list .right .out .number{ color: #999999; font-size: 25upx;}

.text-right{ padding: 20upx 30upx; color: #777777;}
</style>
