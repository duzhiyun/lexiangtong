<template>
	<view>
		<!--goodslist-->
		<view class="goods-list">
			<block v-if="drpGoodsList.length > 0">
				<view class="goods-item" v-for="(item,index) in drpGoodsList" :key="index">
					<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
					<view class="goods-right">
						<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
						<view class="plan-box"><view class="price">{{item.shop_price_formated}}</view></view>
						<view class="plan-box">
							<view class="bl" v-if="item.commission == 1">
								<view class="num">{{item.dis_commission}}%</view>
								<view class="cont-tag">佣金比例</view>
							</view>
							<view class="btn" :class="{'btn-disabled': item.drp_type}" @click="submitBtn(item.goods_id)">
								{{ item.drp_type == false ? '我要代言' : '取消代言' }}</view>
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
	import uniLoadMore from '@/components/uni-load-more.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	export default {
		data() {
			return {
				loadMoreText: "加载中...",
				showLoadMore: false,
				page:1,
				size:10,
				dscLoading:true,
				cat_id:0
			}
		},
		components: {
			uniLoadMore,
			dscNotContent,
			dscCommonNav,
		},
		onUnload(){
			this.loadMoreText = "加载更多";
			this.showLoadMore = false;
		},
		onReachBottom(){
			this.showLoadMore = true
			if(this.page * this.size == this.drpGoodsList.length){
				this.page ++
				this.drpGoods()
			}else{
				this.loadMoreText = "没有更多数据了"
				return;
			}
		},
		computed: {
			drpGoodsList:{
				get(){
					return this.$store.state.drp.dapList
				},
				set(val){
					this.$store.state.drp.dapList = val	
				}
			}
		},
		methods: {
			drpGoods() {
				this.$store.dispatch('setDrpList',{
					cat_id: this.cat_id,
				})
			},
			submitBtn(id){
				this.$store.dispatch('setDrpGoodsAdd',{
					goods_id: id,
				})
			}
		},
		onLoad(e) {
			this.cat_id = e.id
			this.drpGoods()
		},
		watch:{
			drpGoodsList(){
				this.dscLoading = false
			}
		}
	}
</script>

<style>
.bl{ display: flex; flex-direction: row; }
.bl .num{ height: 46upx; line-height: 46upx; border: 2upx solid #f92028; color: #f92028; padding: 0 10upx;border-radius: 6upx 0  0 6upx; font-size: 25upx;}
.bl .cont-tag{height: 50upx; line-height: 50upx; background: #f92028; color: #FFFFFF; border-radius: 0 6upx 6upx 0; padding: 0 10upx;font-size: 25upx;}
</style>
