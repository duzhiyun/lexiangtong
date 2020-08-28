<template>
	<view class="container-tab-bar">
		<view class="tab-bar">
			<view v-for="(tab,index) in tabBars" :key="index" :class="['tab-item',active == index ? 'active' : '']" @click="orderStatusHandle(index)">
				<text>{{ tab }}</text>
			</view>
		</view>
		<view class="section-list">
			<block v-if="drpOrderData && drpOrderData.length > 0">
				<view class="drp-order-list" v-for="(item,index) in drpOrderData" :key="index">
					<view class="order-box">
						<view class="order-header">
							<view class="name">买家：{{item.buy_user_name}}</view>
							<view class="uni-red">{{ item.status == 0 ? '未分成':'已分成'}}</view>
						</view>
						<view class="order-sn">
                            <view v-if="item.log_type == 0 || item.log_type == 2">
                                订单号：<text>{{item.order_sn}}</text>
                            </view>

							<view>{{item.add_time_format}}</view>
						</view>
					</view>
                    <block v-if="item.log_type == 0 || item.log_type == 2">
                        <view class="goods-list" v-for="(goods,goodsIndex) in item.goods_list" :key="goodsIndex" @click="clickHref(item.order_id)">
                            <view class="left"><image :src="goods.goods_thumb" mode="widthFix"></image></view>
                            <view class="right">
                                <view class="name">{{goods.goods_name}}</view>
                                <view class="out">
                                    <view class="price uni-red">{{goods.goods_price_format}}</view>
                                    <view class="number">×{{goods.goods_number}}</view>
                                </view>
                            </view>
                        </view>
                    </block>

                    <block v-else-if="item.log_type == 1">
                        <view class="goods-list" v-for="(goods,goodsIndex) in item.goods_list" :key="goodsIndex">
                            <view class="left"><image :src="goods.goods_thumb" mode="widthFix"></image></view>
                            <view class="right">
                                <view class="name">{{goods.goods_name}}</view>
                                <view class="out">
                                    <view class="price uni-red">{{goods.goods_price_format}}</view>
                                    <view class="number">×{{goods.goods_number}}</view>
                                </view>
                            </view>
                        </view>
                    </block>

					<view class="text-right">
						<view>佣金比例：<text class="uni-red">{{item.level_per}}</text>,获得佣金：<text class="uni-red">{{item.money_format}}</text></view>
					</view>
				</view>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
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
				tabBars:['全部','已分成','未分成'],
				active:0,
				status:2,
				size:10,
				page:1,
			}
		},
		components:{
			uniIcon,
			dscCommonNav,
			dscNotContent
		},
		onLoad() {

		},
		onShow() {
			this.orderList()
		},
		computed: {
			drpOrderData:{
				get(){
					return this.$store.state.drp.drpOrderData
				},
				set(val){
					this.$store.state.drp.drpOrderData = val
				}
			}
		},
		methods: {
			orderList(page) {
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}

				this.$store.dispatch('setDrpOrder',{
					page: this.page,
					size: this.size,
					status: this.status
				})
			},
			orderStatusHandle(index){
				this.active = index

				if(index == 0){
					this.status = 2
				}else if(index == 2){
					this.status = 0
				}else{
					this.status = 1
				}
				this.orderList(1)
			},
            clickHref(id){
                uni.navigateTo({
                    url:'/pagesA/drp/orderDetail/orderDetail?order_id='+id
                });
            }
		}
	}
</script>

<style>
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
