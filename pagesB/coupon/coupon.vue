<template>
	<view class="container-tab-bar">
		<view class="tab-bar">
			<view v-for="(tab,index) in tabBars" :key="index" :class="['tab-item',status == index ? 'active' : '']" @click="CommonTabs(index)">
				<text>{{ tab }}</text>
			</view>
		</view>
		<block v-if="couponData.length>0">
			<view class="coupon-items">
				<view class="coupon-item" v-for="(item,index) in couponData" :key="index" :class="{'g-gay':status != 0}">
					<view class="left">
						<view class="coupon-item-con">
							<view class="q-type">
								<view class="b-r-a-price">
									<text class="coupons-yan">¥</text>
									<text class="coupons-money">
										<block v-if="item.cou_type == 5">免邮</block>
										<block v-else>
											<block v-if="!item.order_sn">
												<block v-if="item.uc_money > 0">{{ item.cou_money }}</block>
												<block v-else>{{item.cou_money}}</block>
											</block>
											<block v-else>
												{{item.order_coupons}}
											</block>
										</block>
									</text>
									<view class="couons-text">
										<view>{{item.cou_type_name}}</view>
										<text>满{{ item.cou_man }}元</text>
									</view>
								</view>
								<view class="b-r-a-con">
									<view class="range-item">{{ item.cou_title }}</view>
									<view class="range-item">{{ item.store_name }}</view>
									<view class="range-item">{{item.begintime}}至{{item.endtime}}</view>
								</view>
							</view>
							<view class="coupon-image">
								<image src="../../static/coupons-print-end.png" class="img" v-if="status == 1"></image>
								<image src="../../static/coupons-print-enddata.png" v-if="status == 2" class="img"></image>
							</view>
						</view>
					</view>
					<view class="right">
						<view v-if="status == 0" @click="couponLink(item.cou_id)">立即<br>使用</view>
						<text v-else-if="status == 1">已使用</text>
						<text v-else-if="status == 2">已过期</text>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				tabBars:['未使用', '已使用', '已过期'],
				status:0,
				page:1,
				size:10,
			};
		},
		components:{
			dscNotContent
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/coupon/coupon'
			}
		},
		computed: {
			couponData:{
				get(){
					return this.$store.state.user.couponData
				},
				set(val){
					this.$store.state.user.couponData = val
				}
			}
		},
		methods: {
			CommonTabs(val) {
				this.status = val
				this.couponClick(1)
			},
			couponClick(page) {
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}

				this.$store.dispatch('setUserCoupon',{
					page: this.page,
					size: this.size,
					type: this.status
				})
			},
			couponLink(id){
				uni.navigateTo({
					url:'/pages/goodslist/goodslist?cou_id='+id
				})
			}
		},
		onLoad(){
			this.couponClick()
		},
		onReachBottom(){
			if(this.page * this.size == this.couponData.length){
				this.page ++
				this.couponClick()
			}
		}
	}
</script>

<style>

</style>
