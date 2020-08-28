<template>
	<block v-if="list.length > 0">
		<view class="uni-product-list" :class="{'product-list-medium':mode !== 'grid'}">
			<view class="uni-product" v-for="(item,index) in list" :key="index">
				<view class="image-view" v-if="routerName == 'bargain'" @click="detailLink(routerName,item.id)">
					<image v-if="item.goods_thumb" class="uni-product-image" :src="item.goods_thumb"></image>
					<image v-else class="uni-product-image" src="../static/no_image.jpg"></image>
					<view class="bargain-tag" v-if="routerName == 'bargain'"><view class="iconfont icon-renshu"></view>{{item.total_num}}人参与</view>
				</view>
				<view class="image-view" @click="detailLink(routerName,item.goods_id)" v-else>
					<image v-if="item.goods_thumb" class="uni-product-image" :src="item.goods_thumb"></image>
					<image v-else class="uni-product-image" src="../static/no_image.jpg"></image>
					<view class="bargain-tag" v-if="routerName == 'bargain'"><view class="iconfont icon-renshu"></view>{{item.total_num}}人参与</view>
				</view>
				<view class="uni-product-info">
					<view class="uni-product-title" @click="detailLink(routerName,item.id)" v-if="routerName == 'bargain'">{{item.goods_name}}</view>
					<view class="uni-product-title" @click="detailLink(routerName,item.goods_id)" v-else>{{item.goods_name}}</view>
					<view class="uni-product-price" v-if="routerName == 'bargain'">
						<view class="box"><text class="gay del">原价{{item.shop_price}}</text></view>
						<view class="box">
							<text class="gay">低价</text>
							<text class="uni-product-price-original">{{item.target_price}}</text>
						</view>
					</view>
					<view class="uni-product-price" :class="{'uni-juc-center':productOuter}" v-else>
						<text class="uni-product-price-original">{{item.shop_price_formated}}</text>
					</view>
					<view class="outer" v-if="routerName == 'drp' && item.commission == 1">
						<view class="commission-tag mt10">
							<view class="num">{{item.dis_commission}}%</view>
							<view class="cont-tag">佣金比例</view>
						</view>
					</view>
					<view class="outer" v-if="!productOuter && routerName == 'goods'">
						<view class="left uni-ellipsis">
							<text class="tag" v-if="(item.user_id > 0 && item.self_run == 1) || item.user_id == 0">自营</text>
							<text class="tag" @click="$outerHref('/pages/shop/shopHome/shopHome?ru_id=' + item.user_id,'app')" v-else>进店</text>
							<text class="sales-volume">{{ item.sales_volume }}人已购买</text>
						</view>
						<view class="add-cart" @click="addCart(item.goods_id,index)">
							<text class="iconfont icon-cart"></text>
							<view class="add_num" :class="{'show':addCartClass == true && index == curIndex}">+1</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</block>
	<block v-else>
		<dsc-not-content></dsc-not-content>
	</block>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	import universal from '@/common/mixins/universal.js';
	export default {
		mixins:[universal],
		props:{
			list:Array,
			mode:{
				type:String,
				default:'grid'
			},
			routerName:{
				type:String,
				default:'goods'
			},
			productOuter:{
				type:Boolean,
				default:false
			},
			guessList:{
				type:Boolean,
				default:false
			},
		},
		data() {
			return {
				addCartClass:false,
				curIndex:null
			};
		},
		components:{
			dscNotContent
		},
		methods:{
			addCart(id,index){
				this.addCartClass = false
				this.curIndex = null
				this.$store.dispatch('setAddCart',{
					goods_id:id,
					num:1,
					spec:[],
					warehouse_id:'0',
					area_id:'0',
					parent_id:'0'
				}).then(res => {
					if(res.data == true){
						this.addCartClass = true
						this.curIndex = index
						uni.showToast({
							title:'商品已加入购物车',
							icon:'none'
						})
					}
				})
			},
			detailLink(routerName,id){
				if(routerName == 'goods' || routerName == 'drp'){
					//猜你喜欢商品链接
					if(this.guessList){
						uni.redirectTo({
							url:'/pages/goodsDetail/goodsDetail?id='+id
						})
					}else{
						this.list.forEach(v=>{
							if(v.goods_id == id){
								//判断是否是预售
								if(v.get_presale_activity){
									uni.navigateTo({
										url:'/pagesA/presale/detail/detail?act_id='+v.get_presale_activity.act_id
									})
								}else{
									uni.navigateTo({
										url:'/pages/goodsDetail/goodsDetail?id='+id
									})
								}
							}
						});
					}
				}else if(routerName == 'bargain'){
					uni.navigateTo({
						url:'/pagesA/bargain/detail/detail?id='+id
					})
				}
			}
		}
	}
</script>

<style>
	/*product-list*/
	.uni-product-list{ padding: 0 18upx; margin-top: 18upx; box-sizing: border-box;}
	.uni-product-list .uni-product-title{ font-size: 28upx; height: 80upx;}
	.uni-product-list .outer{ width: 100%; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: center;}
	.uni-product-list .outer .left{ width: 260upx;}
	.uni-product-list .outer .tag{ background-color: #fef0f0; color: #f92028; padding: 5upx 10upx; border-radius: 10upx;}
	.uni-product-list .outer .sales-volume{ font-size: 26upx; margin-left: 10upx; color: #999999;}
	.uni-product-list .outer .icon-cart{ color: #f92028; font-size: 35upx; margin-right: 10upx;}
	
	.product-list-medium .uni-product{ flex-direction: row; justify-content: space-between; width: 100%;}
	.product-list-medium .uni-product .image-view{ width: 220upx; height: 220upx;}
	.product-list-medium .uni-product-info{ width: auto; flex: 1 1 0%;}
	
	.add-cart{ position: relative;}
	.add_num{ right: 5px;}
	
	.image-view{ position: relative;}
	.bargain-tag{ display: flex; flex-direction: row; align-items: center; font-size: 25upx; background: rgba(0,0,0,0.4); border-radius: 20upx; position: absolute; bottom: 10upx; right: 10upx; padding: 3upx 20upx; color: #FFFfff;}
	.bargain-tag .iconfont{ line-height: 1; margin-right: 10upx;}
	
	.uni-product-price .box{ line-height: 1.5;}
	.uni-product-price .gay{ color: #999999; margin-right: 5upx;}
	.uni-product-price .del{ text-decoration: line-through; font-size: 24upx;}
</style>
