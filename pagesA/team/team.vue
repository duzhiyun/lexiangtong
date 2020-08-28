<template>
	<view class="uni-tab-bar fixed-bottom-padding">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view class="swiper-tab-list" :class="{'active' : tc_id == 0}" @click="tapTab(0)">全部</view>
			<view v-for="(tab,index) in tabBars" :key="index" :class="['swiper-tab-list',tc_id == index+1 ? 'active' : '']" @click="tapTab(tab.tc_id)">{{tab.name}}</view>
		</scroll-view>
		<view class="wapper">
			<block v-if="tc_id === 0">
				<!--banner-->
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" v-if="teamIndexData.banner && teamIndexData.banner.length>0">
					<swiper-item v-for="(item,index) in teamIndexData.banner" :key="index">
						<view class="swiper-item"><image :src="item.pic" mode="widthFix"></image></view>
					</swiper-item>
				</swiper>
				<!--banner_bottom-->
				<view class="adv banner-bottom" v-if="teamIndexData.banner_bottom && teamIndexData.banner_bottom.length>0">
					<view class="col" v-for="(item,index) in teamIndexData.banner_bottom" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
				</view>
				<!--hot-->
				<view class="section section-hot" v-if="(teamIndexData.ad_hot_left && teamIndexData.ad_hot_left.length>0) || (teamIndexData.ad_hot_right && teamIndexData.ad_hot_right.length>0)">
					<view class="title">热门活动</view>
					<view class="con">
						<view class="left adv">
							<view class="col" v-for="(item,index) in teamIndexData.ad_hot_left" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
						</view>
						<view class="right adv">
							<view class="col" v-for="(item,index) in teamIndexData.ad_hot_right" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
						</view>
					</view>
				</view>
				<!--best-->
				<view class="section section-best" v-if="(teamIndexData.ad_best_left && teamIndexData.ad_best_left.length>0) || (teamIndexData.ad_best_right && teamIndexData.ad_best_right.length>0)">
					<view class="title">精选商品</view>
					<view class="con">
						<view class="left adv">
							<view class="col" v-for="(item,index) in teamIndexData.ad_best_left" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
						</view>
						<view class="right adv">
							<view class="col" v-for="(item,index) in teamIndexData.ad_best_right" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<block v-if="teamCateData">
				<!--banner-->
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" v-if="teamCateData.banner && teamCateData.banner.length > 0">
				 	<swiper-item v-for="(item,index) in teamCateData.banner" :key="index">
				 		<view class="swiper-item"><image :src="item.pic" mode="widthFix"></image></view>
				 	</swiper-item>
				</swiper>
				<!--nav-->
				<view class="nav" v-if="teamCateData.team_categories_child && teamCateData.team_categories_child.length > 0">
					<view class="item" v-for="(item,index) in teamCateData.team_categories_child" :key="index">
						<view class="icon"><image :src="item.tc_img" mode="widthFix"></image></view>
						<view class="txt">{{item.name}}</view>
					</view>
				</view>
				<!--banner_bottom-->
				<view class="adv banner-bottom" v-if="teamCateData.banner_bottom && teamCateData.banner_bottom.length > 0">
					<view class="col" v-for="(item,index) in teamCateData.banner_bottom" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
				</view>
				<!--left-->
				<view class="adv flex-ban" v-if="teamCateData.ads_left && teamCateData.ads_left.length > 0">
					<view class="col" v-for="(item,index) in teamCateData.ads_left" :key="index"><image :src="item.pic" mode="widthFix"></image></view>
				</view>
				</block>
			</block>
			<!--goodslist-->
			<view class="goods-list">
				<block v-if="teamGoodsData && teamGoodsData.length > 0">
					<view class="goods-item" v-for="(item,index) in teamGoodsData" :key="index" @click="detailClick(item)">
						<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
						<view class="goods-right">
							<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
							<view class="plan-box"><view class="shop-price">单买价{{item.shop_price}}</view></view>
							<view class="plan-box">
								<view class="num">{{item.team_num}}人团</view>
								<view class="price">{{item.team_price}}</view>
								<view class="btn">去开团</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<dsc-not-content></dsc-not-content>
				</block>
			</view>
			
			<view class="uni-loadmore" v-if="showLoadMore && page > 1">{{loadMoreText}}</view>
		</view>
		
		<dsc-tabbar :tabbar="tabbar"></dsc-tabbar>
		
		<dsc-common-nav></dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniLoadMore from '@/components/uni-load-more.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscTabbar from '@/components/dsc-tabbar.vue';
	
	export default {
		data() {
			return {
				loadMoreText: "加载中...",
				showLoadMore: false,
				autoplay: true,
				interval: 5000,
				duration: 500,
				scrollLeft: 0,
				tc_id:0,
				page:1,
				size:10,
				dscLoading:true,
				tabbar:{
					type:'team',
					index:0,
					curpage:''
				},
			}
		},
		components: {
			uniLoadMore,
			dscNotContent,
			dscCommonNav,
			dscTabbar
		},
		onUnload(){
			this.loadMoreText = "加载更多";
			this.showLoadMore = false;
		},
		onReachBottom(){
			this.showLoadMore = true
			if(this.page * this.size == this.teamGoodsData.length){
				this.page ++
				this.getGoodsList()
			}else{
				this.loadMoreText = "没有更多数据了"
				return;
			}
		},
		onShareAppMessage(res){
			return {
			  title: '拼团首页',
			  path: '/pagesA/team/team'
			}
		},
		computed:{
			...mapState({
                teamIndexData: state => state.team.teamIndexData,
                teamCateData: state => state.team.teamCateData,
            }),
			teamGoodsData:{
                get(){
                    return this.$store.state.team.teamGoodsData
                },
                set(val){
                    this.$store.state.team.teamGoodsData = val
                }
            },
			tabBars(){
				return this.teamIndexData.team_categories
			},
		},
		methods: {
			teamNav(){
				this.$store.dispatch('setTeamIndex');
				this.getGoodsList();
			},
			tapTab(id){
				this.dscLoading = true;
				this.tc_id = id;
				if(id > 0){
					this.$store.dispatch('setTeamCate',{
						tc_id: this.tc_id
					});
					this.getGoodsList();
				}else{
					this.teamNav();
				}
			},
			getGoodsList() {
                this.$store.dispatch('setTeamGoods',{
                    size: this.size,
                    page: this.page,
                    tc_id: this.tc_id
                });
            },
			detailClick(item){
				uni.navigateTo({
					url:'/pagesA/team/detail/detail?goods_id='+item.goods_id + '&team_id=0'
				})
			}
		},
		onLoad() {
			let pages = getCurrentPages()
			this.tabbar.curpage = pages[pages.length - 1].route
			
			this.teamNav();
		},
		watch:{
			teamIndexData(){
				this.dscLoading = false
			},
			teamCateData(){
				this.dscLoading = false
			}
		}
	}
</script>

<style scoped>
.uni-swiper-tab{ background: #FFFFFF; z-index: 9999; position: fixed; top: 0;}

.wapper{ padding-top: 50px;}

.adv{ display:flex; flex-direction:row; line-height: none; }
.col { line-height: none; font-size: 0; }
.col image{ width: 100%;}

.banner-bottom .col{ width: 50%; }
.flex-ban{ flex-wrap: wrap; margin-top: 20upx;}
.flex-ban .col{ width: 50%; border-right: 1px solid #f4f4f4; box-sizing: border-box;}

.section{ margin-top: 20upx; background-color: #FFFFFF; }
.section .title{ padding: 20upx 30upx; border-bottom: 1px solid #f4f4f4;}
.section .con{ display: flex; flex-direction: row; }
.section .con .adv{ width: 50%;}
.section .con .adv .col{ width: 100%;}
.section .con .right{ flex-direction: column; }
.section .con .right .col{ border-bottom: 1px solid #f4f4f4; border-left: 1px solid #f4f4f4;}

.goods-list{ margin-top: 20upx; }

.nav{ display: flex; flex-direction: row; justify-content: center; align-items: center; background-color: #ffffff; padding:20upx;}
.nav .item{ width: 25%; padding: 20upx; text-align: center;}
.nav .item .icon{ width: 100%; font-size: 0;}
.nav .item .icon image{ width: 100%; }
.nav .item .txt{ color: #333333; margin-top: 5upx;}
</style>
