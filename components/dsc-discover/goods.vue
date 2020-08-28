<template>
	<view class="product-info-warp" v-if="discoverGoods">
		<navigator :url="'/pages/goodsDetail/goodsDetail?id='+discoverGoods.goods_id" hover-class="none" class="goods">
			<view class="product-img"><img :src="discoverGoods.goods_thumb" class="img"></view>
			<view class="product-name twolist-hidden">{{ discoverGoods.goods_name }}</view>
			<view class="user-more"><uni-icon type="forward" size="18" color="#999999"></uni-icon></view>
		</navigator>
	</view>
</template>

<script>
import uniIcon from "@/components/uni-icon.vue";

export default{
	props:['discoverGoods'],
	components: {
		uniIcon,
	},
	data(){
		return{}
	}
}
</script>

<style>
.product-info-warp{ padding: 20upx; background: #FFFFFF; margin-bottom: 15upx;}
.product-info-warp .goods{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; }
.product-info-warp .product-img{ width: 100upx; height: 100upx; border: 2upx solid #F6F6F9;}
.product-info-warp .product-name{ flex: 1; margin: 0 20upx;}
</style>