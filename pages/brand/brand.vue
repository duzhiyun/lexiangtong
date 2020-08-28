<template>
	<view class="brand-warp">
		<view class="brand-header">
			<view class="bg-img"><image src="../../static/brand_header_bg.jpg" class="img" mode="widthFix"></image></view>
			<view class="cont-box" @click="$outerHref('/pages/brand/detail/detail?id='+best.brand_id,'app')">
				<view class="b-img"><image :src="best.index_img" class="img" mode="widthFix"></image></view>
				<view class="b-con">
					<view class="top">
						<text class="tit">今日最大牌</text>
						<text class="subtit">每日精选 品牌大促</text>
					</view>
					<view class="bottom">
						<view class="time">日期：<text class="uni-red">{{best.time}}</text></view>
						<view class="name">品牌：<text>{{best.brand_name}}</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="brand-section">
			<view class="title">热门大牌</view>
			<swiper indicator-dots="true" class="swiper">
				<swiper-item v-for="(item,index) in hot" :key="index">
					<view class="brand-list-box">
						<view class="header">
							<view class="shop-top">
								<view class="b-img" @click="$outerHref('/pages/brand/detail/detail?id='+item.brand_id,'app')"><image :src="item.brand_msg.brand_logo" mode="widthFix"></image></view>
								<view class="b-con">
									<text class="name">{{item.brand_msg.brand_name}}</text>
									<text class="txt">共有 {{item.brand_msg.goods_count}} 件商品</text>
								</view>
								<view class="b-btn" @click="$outerHref('/pages/brand/detail/detail?id='+item.brand_id,'app')">进入专区</view>
							</view>
							<image src="../../static/shopping_info_b.jpg" class="bg" mode="widthFix"></image>
						</view>
						<view class="brand-adv">
							<view class="brand-adv-left" v-for="(goodsItme,goodsIndex) in item.goods" :key="goodsIndex" v-if="goodsIndex == 0" @click="$outerHref('/pages/goodsDetail/goodsDetail?id='+goodsItme.goods_id,'app')">
								<image :src="goodsItme.goods_thumb" mode="widthFix" class="img"></image>
							</view>
							<view class="brand-adv-right">
								<view class="brand-right-box" v-for="(goodsItme,goodsIndex) in item.goods" :key="goodsIndex" v-if="goodsIndex > 0 && goodsIndex < 3" @click="$outerHref('/pages/goodsDetail/goodsDetail?id='+goodsItme.goods_id,'app')">
									<image :src="goodsItme.goods_thumb" mode="widthFix" class="img"></image>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="brand-section">
			<view class="title">推荐大牌</view>
			<view class="items">
				<view class="item" v-for="(item,index) in recommend" :key="index" @click="$outerHref('/pages/brand/detail/detail?id='+item.brand_id,'app')"><image :src="item.brand_logo" mode="widthFix"></image></view>
				<view class="item item-last" @click="$outerHref('/pages/brand/list/list','app')">查看更多</view>
			</view>
		</view>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import universal from '@/common/mixins/universal.js';
	export default {
		mixins:[universal],
		data() {
			return {
				outer:true,
				best:{},
				hot:[],
				recommend:[],
				dscLoading:true
			}
		},
		methods: {
			
		},
		onLoad(){
			this.$store.dispatch('setBrand').then(res=>{
				this.best = res.best
				this.hot = res.hot
				this.recommend = res.recommend
			})
		},
		watch:{
			recommend(){
				this.dscLoading = false
			}
		}
	}
</script>

<style>
.brand-warp{}
.brand-warp .brand-header{ position: relative; background: #fff;}
.brand-warp .brand-header .bg-img{ width: 100%; position: absolute; top: 0; left: 0; right: 0;}
.brand-warp .brand-header .cont-box{ display: flex; padding: 30upx 30upx 0 30upx; flex-direction: row;}
.brand-warp .brand-header .cont-box .b-img{ width: 50%;}
.brand-warp .brand-header .cont-box .b-con{ width: 50%; display: flex; flex-direction: column;}
.brand-warp .brand-header .cont-box .b-con .top{ display: flex; flex-direction: column; padding: 20upx 0 0 20upx;}
.brand-warp .brand-header .cont-box .b-con .top .tit{ color: #FFFFFF; font-size: 36upx;}
.brand-warp .brand-header .cont-box .b-con .top .subtit{ color: rgba(255,255,255,.5);}
.brand-warp .brand-header .cont-box .b-con .bottom{ padding:60upx 0 0 20upx; }
.brand-warp .brand-header .cont-box .b-con .bottom view{ line-height: 1.5; color: #999;}
.brand-warp .brand-header .cont-box .b-con .bottom .name text{ color: #333333;}

.brand-section{ margin-top: 20upx; background: #FFFFFF;}
.brand-section .title{ padding: 20upx; font-size: 32upx; }

.swiper{ height: 375px;}

.brand-adv{ display: flex; width: 100%; flex-direction: row;}
.brand-adv .brand-adv-left{ padding: 10upx; width: 66.6%; flex: 1; box-sizing: border-box; }
.brand-adv .brand-adv-right{ width: 33.3%; display: flex; flex-direction: column; }

.brand-section .items{ display: flex; flex-wrap:wrap;}
.brand-section .items .item{ width: 25%; flex: 1; box-sizing: border-box; padding: 20upx; display: flex; flex-direction: row; justify-content: center; align-items: center;border-bottom: 1px solid #f6f6f9;border-right: 1px solid #f6f6f9;}
.brand-section .items .item-last{ background: #F2031F; color: #FFFFFF;}
</style>
