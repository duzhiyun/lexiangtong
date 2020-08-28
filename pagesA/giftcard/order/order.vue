<template>
	<view class="giftcard-order">
		<view class="goods-list" v-if="list.length > 0">
			<view class="goods-item" v-for="(item,index) in list" :key="index" @click="detailClick(item)">
				<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
				<view class="goods-right">
					<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
					<view class="plan-box">
						<view>卡号：{{item.gift_sn}}</view>
						<view class="uni-red" v-if="item.status == 1">待发货</view>
						<view class="btn" @click="pickGoods" v-else-if="item.status == 2">确认收货</view>
						<view class="uni-red" v-else>已完成</view>
					</view>
				</view>
			</view>
		</view>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		
		<dsc-common-nav>
			<navigator url="../giftcard" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>礼品卡</text>
			</navigator>
		</dsc-common-nav>
	</view>
</template>

<script>
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	export default {
		data() {
			return {
				id: '',
				page: 1,
				size: 10,
				list: [],
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components:{
			dscCommonNav,
			dscNotContent
		},
		methods: {
			loadOrder(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
				
				uni.request({
					url:this.websiteUrl + '/api/v4/gift_gard/take_list',
					data:{
						page:this.page,
						size:this.size
					},
					method:'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						let data = res.data.data;
						
						if(res.data.status == 'success'){
							if(this.page > 1){
								data.forEach(v=>{
									this.list.push(v);
								})
							}else{
								this.list = data
							}
						}
					},
				});
			}
		},
		onUnload(){
			this.loadMoreText = "加载更多",
			this.showLoadMore = false;
		},
		onReachBottom(){
			this.showLoadMore = true
			
			if(this.page * this.size == this.list.length){
				this.page ++
				this.loadOrder()
			}else{
				this.loadMoreText = "没有更多数据了"
				return;
			}
		},
		onLoad(){
			this.loadOrder(1);
		},
	}
</script>

<style>

</style>
