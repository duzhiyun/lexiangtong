<template>
	<view class="user-default tabbar-padding-bottom gbg">
		<view class="user-header" :class="{'mp-header':mpChecked && data.is_drp > 0}">
			<view class="user-header-box">
				<view class="head-img" @click="$outerHref('../../pagesB/profile/profile',$isLogin())">
					<image :src="data.avatar" v-if="data.avatar" class="img"></image>
					<image src="../../static/user_default.png" v-else class="img"></image>
				</view>
				<view class="head-admin">
					<view class="header-admin-box">
						<block v-if="data">
							<view class="name" v-if="data.name !=''">{{ data.name }}</view>
							<view class="name" v-else>{{ data.username }}</view>
						</block>
						<block v-else>
							<navigator url="../login/login" hover-class="none" class="name">未登录</navigator>
						</block>
						<view class="header-icon">
							<view @click="$outerHref('../../pagesB/profile/profile',$isLogin())"><view class="iconfont icon-set"></view></view>
							<view @click="$outerHref('../../pagesB/message/message',$isLogin())" class="iconfont icon-message"></view>
						</view>
					</view>
					<view class="header-rank uni-ellipsis" v-if="data.user_rank">{{ data.user_rank }}</view>
				</view>
			</view>
<!-- 			<view class="exclusive" v-if="mpChecked && data.is_drp > 0">
				<view class="left">
					<view class="icon_vip"><image src="../../static/vip/icon-vip.png" mode="widthFix"></image></view>
					<text>高级VIP</text>
				</view>
				<view class="center">购物省钱 分享赚钱</view>
				<navigator open-type="navigateTo" url="/pagesA/drp/drpinfo/drpinfo" class="right" v-if="data.drp_shop.audit == 1 && data.drp_shop.status == 1">
					<text>我的VIP</text>
					<uni-icon type="forward" size="18" color="#E3C49E"></uni-icon>
				</navigator>
				<view @click="$outerHref('/pagesA/drp/register/register',$isLogin())" class="right" v-else>
					<text>立即开通</text>
					<uni-icon type="forward" size="18" color="#E3C49E"></uni-icon>
				</view>
			</view>
			<view class="bg-radius" v-if="mpChecked && data.is_drp > 0"></view>
			<view class="bg">
				<block v-if="data.drp_shop.audit == 1 && data.drp_shop.status == 1">
					<image src="../../static/vip/bg-1.jpg" mode="widthFix" />
				</block>
				<block v-else>
					<image src="../../static/vip/bg-2.jpg" mode="widthFix" />
				</block>
			</view> -->
		</view>
		<view class="user-function-ward">
			<view class="user-function-list">
				<view class="user-item-title">
					<view class="tit">我的钱包</view>
					<view @click="$outerHref('../../pagesB/account/account',$isLogin())" class="more">
						<text>资金管理</text>
						<uni-icon type="forward" size="18" color="#999999"></uni-icon>
					</view>
				</view>
				<view class="user-items user-account-items">
					<view @click="$outerHref('../../pagesB/account/account',$isLogin())" class="user-item">
						<view class="tit">{{ data.user_money || 0 }}</view>
						<view class="text">余额</view>
					</view>
					<view @click="$outerHref('../../pagesB/bonus/bonus',$isLogin())" class="user-item">
						<view class="tit">{{ data.bonus || 0 }}</view>
						<view class="text">红包</view>
					</view>
					<view @click="$outerHref('../../pagesB/account/account',$isLogin())" class="user-item">
						<view class="tit">{{ data.pay_points || 0 }}</view>
						<view class="text">积分</view>
					</view>
					<view @click="$outerHref('../../pagesB/coupon/coupon',$isLogin())" class="user-item">
						<view class="tit">{{ data.coupons_num || 0 }}</view>
						<view class="text">优惠券</view>
					</view>
				</view>
			</view>
			<view class="user-function-list">
				<view class="user-item-title">
					<view class="tit">我的订单</view>
					<view @click="$outerHref('../../pagesB/order/order',$isLogin())" class="more">
						<text>全部订单</text>
						<uni-icon type="forward" size="18" color="#999999"></uni-icon>
					</view>
				</view>
				<view class="user-items">
					<view @click="$outerHref('../../pagesB/order/order?tab=1',$isLogin())" class="user-item">
						<view class="tit">
							<image src="../../static/icon-001.png"></image>
							<view class="num" v-if="data.pay_count > 0">{{ data.pay_count }}</view>
						</view>
						<view class="text">待付款</view>
					</view>
					<view @click="$outerHref(host + 'team/order')" class="user-item">
						<view class="tit">
							<image src="../../static/icon-002.png"></image>
							<view class="num" v-if="data.team_num > 0">{{ data.team_num }}</view>
						</view>
						<view class="text">待拼团</view>
					</view>
					<view @click="$outerHref('../../pagesB/order/order?tab=2',$isLogin())" class="user-item">
						<view class="tit">
							<image src="../../static/icon-003.png"></image>
							<view class="num" v-if="data.confirmed_count > 0">{{ data.confirmed_count }}</view>
						</view>
						<view class="text">待收货</view>
					</view>
					<view @click="$outerHref('../../pagesB/comment/comment',$isLogin())" class="user-item">
						<view class="tit">
							<image src="../../static/icon-004.png"></image>
							<view class="num" v-if="data.not_comment > 0">{{ data.not_comment }}</view>
						</view>
						<view class="text">待评价</view>					
					</view>
					<view @click="$outerHref('../../pagesB/afterSales/afterSales',$isLogin())" class="user-item">
						<view class="tit">
							<image src="../../static/icon-005.png"></image>
							<view class="num" v-if="data.return_count > 0">{{ data.return_count }}</view>
						</view>
						<view class="text">退换货</view>
					</view>
				</view>
			</view>
			<view class="user-function-list">
				<view class="user-item-title">
					<view class="tit">全部工具</view>
				</view>
				<view class="user-items user-nav-items">
					<view @click="$outerHref('../../pagesB/collectionGoods/collectionGoods',$isLogin())" class="user-item">
						<view class="tit"><image src="../../static/icon-006.png"></image></view>
						<view class="text">收藏的商品</view>
					</view>
					<view @click="$outerHref('../../pagesB/collectionShop/collectionShop',$isLogin())" class="user-item">
						<view class="tit"><image src="../../static/icon-007.png"></image></view>
						<view class="text">关注的店铺</view>
					</view>

					<view @click="$outerHref('../../pagesB/history/history',$isLogin())" class="user-item">
						<view class="tit"><image src="../../static/icon-013.png"></image></view>
						<view class="text">浏览记录</view>
					</view>
					<view @click="$outerHref('../../pagesA/drp/drp',$isLogin())" class="user-item" v-if="mpChecked && data.is_drp > 0">
						<view class="tit"><image src="../../static/icon-009.png"></image></view>
						<view class="text">我的微店</view>
					</view>
					<view @click="$outerHref(host + 'crowdfunding')" class="user-item" v-if="mpChecked">
						<view class="tit"><image src="../../static/icon-010.png"></image></view>
						<view class="text">我的微筹</view>
					</view>
					<view @click="$outerHref('../../pagesA/team/team',$isLogin())" class="user-item" v-if="mpChecked && data.is_team > 0">
						<view class="tit"><image src="../../static/icon-011.png"></image></view>
						<view class="text">拼团频道</view>
					</view>
					<view @click="merchantsChange" class="user-item" v-if="mpChecked">
						<view class="tit"><image src="../../static/icon-012.png"></image></view>
						<view class="text">我要入驻</view>
					</view>
					<view @click="$outerHref('../../pagesA/bargain/bargain',$isLogin())" class="user-item" v-if="mpChecked && data.is_bargain > 0">
						<view class="tit"><image src="../../static/icon-014.png"></image></view>
						<view class="text">我的砍价</view>
					</view>
					<view @click="$outerHref('../../pagesA/giftcard/giftcard',$isLogin())" class="user-item" v-if="mpChecked">
						<view class="tit"><image src="../../static/icon-017.png"></image></view>
						<view class="text">礼品卡</view>
					</view>
					<view @click="$outerHref('../../pagesA/giftcard/order/order',$isLogin())" class="user-item" v-if="mpChecked">
						<view class="tit"><image src="../../static/icon-018.png"></image></view>
						<view class="text">我的提货</view>
					</view>
					<view @click="$outerHref(host + 'user/auction')" class="user-item" v-if="mpChecked">
						<view class="tit"><image src="../../static/icon-016.png"></image></view>
						<view class="text">我的拍卖</view>
					</view>
				</view>
			</view>
		</view>
		<tabbar :curpage="curpage"></tabbar>
	  
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import tabbar from "@/components/tabbar/tasktabbar.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js'
	export default {
		mixins:[universal],
		components: {
			tabbar,
			uniIcon
		},
		data() {
			return {
				token:'',
				show:false,
				curpage:''
			};
		},
		computed: {
			...mapState({
				data: state => state.user.userInfo,
				mpChecked: state => state.common.mpChecked
			})
		},
		methods:{
			initData(){
				setTimeout(() => {
					this.loadUserProfile();
					
					uni.stopPullDownRefresh();
				}, 300);
			},
			loadUserProfile(){
				this.$store.dispatch('userProfile')
			},
			merchantsChange(){
				this.$outerHref(this.$websiteUrl + 'user/merchants')
				// if(this.data.is_suppliers > 0){
				// 	this.show = true;
				// }else{
				// 	this.$outerHref(this.$websiteUrl + 'user/merchants')
				// }
			}
		},
		onLoad(){
			
		},
		onShow(){
			if(isLogin()){
				let pages = getCurrentPages()
				this.curpage = pages[pages.length - 1].route
				
				this.loadUserProfile();
			}else{
				uni.showToast({
					title: '请登录查看更多内容',
					icon: "none",
					success(){
						setTimeout(function (){
							uni.reLaunch({
								url:'/pages/login/login'
							})
						},2000)
					}
				});
			}
		},
		onPullDownRefresh(){
			this.initData();
		}
	}
</script>

<style>
	page,body{background:#000000}
.user-default{ padding-bottom: 100upx;}
.user-default .user-header{ position: relative; height: 250upx; overflow: hidden;}
.user-default .bg{ position: absolute; top: 0; left: 0;}
.user-default .bg image{ width: 750upx; height: 250upx; }

/* #ifdef APP-PLUS */
.user-default .user-header{ position: relative; height: 250upx; overflow: hidden;}
.user-default .bg image{ width: 750upx; height: 250upx; }

.user-default .user-header.mp-header{ height: 393upx;}
.user-default .user-header.mp-header .bg image{ height: 393upx; }
/* #endif */

.user-default .user-header.mp-header{ height: 350upx;}

.user-default .user-header-box{ display: flex; flex-direction: row; position: relative; z-index: 1; padding: 50upx 30upx 0 30upx;}
.user-default .user-header-box .head-img{ width: 140upx; height: 140upx; margin-right: 30upx; border-radius: 50%; border:5upx solid rgba(255, 255, 255, 0.29);}
.user-default .user-header-box .head-img .img{ border-radius: 50%;}
.user-default .user-header-box .head-admin{ flex: 1; }
.user-default .user-header-box .header-admin-box{ display: flex; flex-direction: row; justify-content:space-between;color: #FFFFFF; font-size: 30upx;}
.user-default .user-header-box .header-admin-box .name{ overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 30upx;}
.user-default .user-header-box .header-admin-box .header-icon{ display: flex; flex-direction: row;}
.user-default .user-header-box .header-admin-box .header-icon .iconfont{ font-size: 18px;}
.user-default .user-header-box .header-admin-box .header-icon .icon-set{ margin-right: 30upx;}
.user-default .user-header-box .header-rank{ background: linear-gradient(90deg, rgba(235, 212, 181, 0.2), rgba(203, 169, 128, 0.2)); color: #E9D1B2; padding: 0 24upx; border-radius: 30upx; display: inline-block;}

.exclusive{ position: absolute; left: 30upx; right: 30upx; bottom: 0; z-index: 2; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 20upx 20upx 30upx 20upx; font-size: 28upx; background-image: url(../../static/vip/bg-vip.png); background-size: 100% 100%; border-radius: 20upx;}
.exclusive .left{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center;}
.exclusive .left .icon_vip,
.exclusive .left .icon_vip image{ width: 30upx; height: 30upx; line-height: 30upx;}
.exclusive .left text{ margin-left: 10upx; font-weight: 600;}
.exclusive .center{ flex: 1; position: relative; padding: 0 0 0 20upx; margin-left: 20upx; color: #805223;}
.exclusive .center::after{ content: " "; position: absolute; z-index: 2;background-color: #885E2B; width: 2upx; height: 20upx; left: 0; top: 50%; margin-top: -10upx;}
.exclusive .right{ background: #000000; border-radius: 30upx; padding: 5upx 15upx 5upx 20upx; display: flex; flex-direction: row; justify-content: center;align-items: center; position: relative; z-index: 33;}
.exclusive .right text{ color: #E3C49E; font-size: 25upx;}
.exclusive .right .uni-icon{ display: block;}
.bg-radius{ background-image: url(../../static/vip/bg-radius.png); background-size: 100% 100%; width: 750upx; height: 30upx; position: absolute; bottom: 0; z-index: 2;}

.user-function-ward{ padding: 0 30upx; }
.user-function-list{ background: #FFFFFF; margin-top: 30upx; border-radius: 15upx; box-shadow: 0 0.5rem 1rem 0 rgba(95, 95, 95, 0.1);}
.user-function-list .user-item-title{ padding: 20upx; border-bottom: 1px solid #f6f6f6; display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
.user-function-list .user-item-title .tit{ font-size: 32upx;}
.user-function-list .user-item-title .more{ font-size: 26upx; color: #999999; display: flex; flex-direction: row; align-items: center; justify-content: center; line-height: normal;}
.user-function-list .user-item-title .more .uni-icon{ display: block;}
.user-function-list .user-items{ display: flex; flex-direction: row;}
.user-function-list .user-items .user-item{ overflow: hidden; flex: 1 1 0%; padding: 30upx 20upx; text-align: center;}
.user-function-list .user-items .user-item .tit{ font-size: 32upx; color: #AC8054; position: relative;}
.user-function-list .user-items .user-item .tit image{ width: 54upx; height: 54upx;}
.user-function-list .user-items .user-item .text{ font-size: 25upx; color: #333333;}
.user-function-list .user-account-items .user-item .tit{ overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.user-function-list .user-items .user-item .num{ position:absolute; font-size: 20upx; min-width: 36upx; height: 36upx; border-radius: 50%; background: #f92028; color: #fff; text-align: center; top: -10upx; right: 15%;}

.user-function-list .user-nav-items{ flex-wrap: wrap;}
.user-function-list .user-nav-items .user-item{ width: 25%; flex: none; padding: 40upx 0 25upx;}
</style>
