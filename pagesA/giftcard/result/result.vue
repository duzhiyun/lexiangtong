<template>
	<view class="giftcard-result">
		<view class="title">
			<view class="left">礼品卡商品列表</view>
			<view class="right">
				<view class="card-number">卡号：{{id}}</view>
				<view class="btn" @click="logOut">退出</view>
			</view>
		</view>
		<view class="result-content">
			<view class="goods-list" v-if="list.length > 0">
				<view class="goods-item" v-for="(item,index) in list" :key="index" @click="detailClick(item)">
					<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
					<view class="goods-right">
						<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
						<view class="plan-box">
							<view class="price">{{item.shop_price}}</view>
							<view class="btn" @click="pickGoods(item.goods_id)">提货</view>
						</view>
					</view>
				</view>
			</view>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		
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
				id:'',
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
			checkLoginGift(){
				uni.request({
					url:this.websiteUrl + '/api/v4/gift_gard',
					data:{},
					method:'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						let data = res.data;
						if(data.status == 'success'){
							if(data.data.error != 0){
								uni.showToast({
									title:data.data.msg,
									icon:'success'
								});
								
								setTimeout(()=>{
									uni.redirectTo({
										url:'/pagesA/giftcard/giftcard'
									})
								},1000)
							}
						}else{
							if(data.errors.code == 12){
								uni.showToast({
									title:'用户未登录',
									icon:'none'
								})
								
								setTimeout(()=>{
									uni.navigateTo({
										url:'/pages/login/login?delta=1'
									})
								},1000)
							}
						}
					}
				})
			},
			loadList(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
				
				uni.request({
					url:this.websiteUrl + '/api/v4/gift_gard/gift_list',
					data: {
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
							this.id = data.gif;
							if(this.page > 1){
								data.goods.forEach(v=>{
									this.list.push(v);
								})
							}else{
								this.list = data.goods;
							}
						}
					},
				});
			},
			logOut(){
				uni.request({
					url:this.websiteUrl + '/api/v4/gift_gard/exit_gift',
					data:{},
					method:'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						let data = res.data
						uni.showToast({
							title:data.data.msg,
							icon:'none'
						});
						if(data.data.error == 0){
							setTimeout(()=>{
								uni.redirectTo({
									url:'/pagesA/giftcard/giftcard'
								})
							},1000)
						}
					},
				});
			},
			pickGoods(id){
				uni.navigateTo({
					url:'/pagesA/giftcard/address/address?id='+id
				})
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
				this.loadList()
			}else{
				this.loadMoreText = "没有更多数据了"
				return;
			}
		},
		onLoad(){
			this.loadList(1);
		},
		onShow(){
			this.checkLoginGift();
		}
	}
</script>

<style>
.giftcard-result .title{ background: #FFFFFF; display: flex; justify-content: space-between; align-items: center; padding: 20upx; margin-bottom: 20upx; position: fixed; top: 0; left: 0; right: 0;}
.giftcard-result .title .right{ display: flex; flex-direction: row; align-items: center; justify-content: flex-end;}
.giftcard-result .title .right .card-number{ margin-right: 10upx; }
.giftcard-result .title .right .btn{ padding: 0upx 25upx; color: #f92028; border:2upx solid #f92028; }

.giftcard-result .result-content{ margin-top: 120upx;}
</style>
