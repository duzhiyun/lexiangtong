<template>
	<view class="exchange">
		<view class="filter-tab">
			<view class="filter-items">
				<view class="item" :class="{'active':filter.sort === 'goods_id'}" @click="handleFilter('goods_id',filter.order)">
					<text class="txt">综合</text>
				</view>
				<view class="item" :class="[{'active':filter.sort === 'amount'}]" @click="handleFilter('amount',filter.order)">
					<text class="txt">兑换量</text>
					<text class="iconfont" :class="[(filter.order === 'ASC' && filter.sort === 'amount') ? 'icon-arrow-up' : 'icon-arrow-down']"></text>
				</view>
				<view class="item" :class="[{'active':filter.sort === 'popularity'}]" @click="handleFilter('popularity',filter.order)">
					<text class="txt">积分值</text>
					<text class="iconfont" :class="[(filter.order === 'ASC' && filter.sort === 'popularity') ? 'icon-arrow-up' : 'icon-arrow-down']"></text>
				</view>
			</view>
		</view>
		<view class="goods-list">
			<block v-if="exchangeIndexData && exchangeIndexData.length > 0">
				<view class="goods-item" v-for="(item,index) in exchangeIndexData" :key="index" @click="detailClick(item)">
					<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
					<view class="goods-right">
						<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
						<view class="plan-box"><view class="price">积分{{item.exchange_integral}}</view></view>
						<view class="plan-box">
							<view class="num">市场价:{{item.market_price}}</view>
							<view class="btn">立即兑换</view>
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
			
			<view class="uni-loadmore" v-if="showLoadMore && page > 1">{{loadMoreText}}</view>
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
				size:10,
				page:1,
				active: 0,
				filter: {
					sort: 'goods_id',
					order: 'DESC',
				},
				loadMoreText: "加载中...",
				showLoadMore: false,
				dscLoading:true,
			}
		},
		components:{
			uniLoadMore,
			dscNotContent,
			dscCommonNav,
		},
		computed:{
			...mapState({
				exchangeIndexData: state => state.ump.exchangeIndexData
			}),
		},
		methods: {
			goodsList(sort, order) {
				this.$store.dispatch('setExchangeIndex',{
					children: 0,
					min: 0,
					max: 0,
					size:this.size,
					page:this.page,
					sort: this.filter.sort,
					order: this.filter.order,
				});
			},
			handleFilter(val, order) {
				this.page = 1;
				if (order && this.filter.sort == val) {
					this.filter.order = order == 'DESC' ? 'ASC' : 'DESC'
				}
				this.filter.sort = val;
				this.goodsList();
			},
			detailClick(item){
				uni.navigateTo({
					url:"/pagesA/exchange/detail/detail?id=" + item.goods_id
				})
			},
		},
		onLoad(){
			this.goodsList();
		},
		onUnload(){
			this.loadMoreText = "加载更多";
			this.showLoadMore = false;
		},
		onReachBottom(){
			this.showLoadMore = true
			if(this.page * this.size == this.exchangeIndexData.length){
				this.page ++
				this.goodsList()
			}else{
				this.loadMoreText = "没有更多数据了"
				return;
			}
		},
		watch:{
			exchangeIndexData(){
				this.dscLoading = false
			},
		}
	}
</script>

<style>
	/*filter*/
	.filter-tab{ background: #FFFFFF;}
	.filter-items{ display: flex; flex-direction: row; height: 80upx;}
	.filter-items .item{ display: flex; flex: 1 1 0%; justify-content: center; align-items: center;}
	.filter-items .item .iconfont{ font-size: 20upx; margin-left: 5upx;}
	.filter-items .item .icon-filter{ margin: 3px 8upx 0 0;}
	.filter-items .item.active,.filter-items .item.active .iconfont{ color: #f92028; }
	.filter-items .item.a-change .iconfont{ transform: rotate(-180deg); }
</style>
