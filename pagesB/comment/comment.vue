<template>
	<view class="container">
		<block v-if="commentList.length > 0">
		<view class="section-list">
			<view class="product-list">
				<view class="product-items">
					<view class="item" v-for="(item,index) in commentList" :key="index">
						<navigator class="product-img" :url="'/pages/goodsDetail/goodsDetail?id='+item.goods_id" hover-class="none">
							<image :src="item.goods_thumb" v-if="item.goods_thumb"></image>
						</navigator>
						<view class="product-info">
							<navigator :url="'/pages/goodsDetail/goodsDetail?id='+item.goods_id" class="product-name twolist-hidden">{{ item.goods_name }}</navigator>
							<view class="product-row">
								<view class="price">{{ item.shop_price }}</view>
							</view>
							<view class="product-row-fr">
								<view class="btn-bar-min">
									<navigator :url="'../commentDetail/commentDetail?id='+item.rec_id" hover-class="none"><view class="btn btn-bor-red">评价晒单</view></navigator>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	export default {
		data() {
			return {
				sign:0,
				page:1,
				size:10
			};
		},
		components:{
			dscNotContent,
			dscCommonNav
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/comment/comment'
			}
		},
		computed:{
			commentList:{
				get(){
					return this.$store.state.user.commentList
				},
				set(val){
					this.$store.state.user.commentList = val  
				}
			}
		},
		methods:{
			commentListHandle(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}

				this.$store.dispatch('setCommentList',{
					sign:this.sign,
					page:this.page,
					size:this.size 
				})
			}
		},
		onLoad(){
			this.commentListHandle()
		},
		onReachBottom(){
			if(this.page * this.size == this.commentList.length){
				this.page ++
				this.commentListHandle()
			}
		}
	}
</script>

<style>

</style>
