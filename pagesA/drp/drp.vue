<template>
	<view class="container">
		<block v-if="viewStatus == 0 || (viewStatus == 1 && viewAudit == 1)">
		<view class="drp-select">
			<view class="header">
				<view class="header-warp">
					<view class="header-img"><image :src="drpdata.shop_info.user_picture" /></view>
					<view class="header-time">开店时间:{{drpdata.shop_info.create_time}}</view>
				</view>
				<view class="header-bg"><image src="../../static/vip/wd_bg.jpg" mode="widthFix"></image></view>
			</view>
			<view class="drp-money-list">
				<view class="drp-items">
					<navigator :url="'./list/list?shop_id='+ drpdata.shop_info.id +'&parent_id='+drpdata.shop_info.user_id+'&model='+model" class="drp-item">
						<view class="icon"><image src="../../static/vip/wd_icon1.png" mode="widthFix"></image></view>
						<text>我的代言</text>
					</navigator>
					<navigator url="./order/order" class="drp-item">
						<view class="icon"><image src="../../static/vip/wd_icon2.png" mode="widthFix"></image></view>
						<text>代言订单</text>
					</navigator>
					<navigator :url="'./shop/shop?shop_id='+ drpdata.shop_info.id +'&parent_id='+drpdata.shop_info.user_id" class="drp-item">
						<view class="icon"><image src="../../static/vip/wd_icon3.png" mode="widthFix"></image></view>
						<text>查看微店</text>
					</navigator>	
					<navigator url="./set/set" class="drp-item">
						<view class="icon"><image src="../../static/vip/wd_icon4.png" mode="widthFix"></image></view>
						<text>微店设置</text>
					</navigator>
				</view>
				<view class="money-bottom" v-if="drpdata.shop_info.type > 0">
					<button type="warn" @click="userDrp" v-if="drpdata.shop_info.type == 1">选择代言分类</button>
					<button type="warn" @click="userDrp" v-else>选择代言商品</button>
				</view>
			</view>
			
			<view class="goods-list mt20">
				<view class="title">
					<image src="../../static/vip/ico_tit_left.png" class="icon"></image>
					<text>热门商品</text>
					<image src="../../static/vip/ico_tit_right.png" class="icon"></image>
				</view>
				<block v-if="drpGoodsList && drpGoodsList.length > 0">
					<view class="goods-item" v-for="(item,index) in drpGoodsList" :key="index" @click="detailClick(item)">
						<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
						<view class="goods-right">
							<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
							<view class="plan-box"><view class="price">{{item.shop_price_formated}}</view></view>
							<view class="plan-box" v-if="item.commission == 1">
								<view class="commission-tag">
									<view class="num">{{item.dis_commission}}%</view>
									<view class="cont-tag">佣金比例</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<dsc-not-content></dsc-not-content>
				</block>
			</view>
		</view>
		</block>
		<block v-else>
			<view class="ectouch-notcont">
				<view class="img"><image src="../../static/no_content.png" mode="widthFix"></image></view>
				<template v-if="viewStatus == 1">
					<template v-if="viewAudit == 0">
						<view class="cont">店铺申请已提交,正在审核,请联系管理员</view>
					</template>
					<template v-if="viewAudit == 2">
						<view class="cont">店铺申请被拒绝,请联系管理员</view>
					</template>
				</template>
				<template v-if="viewStatus == 2">
					<view class="cont">您还未购买成为分销商<navigator url="register/register" class="uni-red">去购买</navigator></view>
				</template>
				<template v-else-if="viewStatus == 3">
					<view class="cont">店铺已关闭,请联系管理员 <navigator url="/pagesA/drp/drpinfo/drpinfo" class="uni-red">返回</navigator></view>
				</template>
			</view>
		</block>
		
		<dsc-common-nav></dsc-common-nav>
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniIcon from "@/components/uni-icon.vue";
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	export default {
		data() {
			return {
				status:4,
				size:10,
				page:1,
				dscLoading:true,
			}
		},
		components:{
			uniIcon,
			dscNotContent,
			dscCommonNav
		},
		computed:{
			...mapState({
				drpdata: state => state.drp.myDrpData
			}),
			viewStatus(){
				return this.drpdata.error
			},
			viewAudit(){
				return this.drpdata.audit
			},
			drpGoodsList:{
				get(){
					return this.$store.state.drp.drpGoodsList
				},
				set(val){
					this.$store.state.drp.drpGoodsList = val
				}
			},
			model(){
				if(this.drpdata.shop_info){
					return this.drpdata.shop_info.type ? this.drpdata.shop_info.type : 0
				}else{
					return 0
				}
			}
		},
		methods: {
			//商品列表
			drpGoods(shop_id, user_id) {
				this.$store.dispatch('setDrpGoodsList',{
					id: shop_id,
					uid: user_id,
					size: this.size,
					page: this.page,
					status: this.status,
					model: this.model
				});
			},
			drpSet(){
				uni.navigateTo({
					url:'set/set'
				})
			},
			withdraw(){
				uni.navigateTo({
					url:'withdraw/withdraw'
				})
			},
			userDrp(){
				uni.navigateTo({
					url:'category/category'
				})
			},
			detailClick(item){
				uni.navigateTo({
					url:'/pages/goodsDetail/goodsDetail?id=' +item.goods_id
				})
			}
		},
		onLoad(){
			this.$store.dispatch('setMyDrp')
		},
		onShow() {
			if(this.drpdata.shop_info){
				this.drpGoods(this.drpdata.shop_info.id,this.drpdata.shop_info.user_id)
			}
		},
		watch:{
			drpdata(){
				this.dscLoading = false
			},
			viewStatus(){
				if(this.viewStatus == 2){
					uni.redirectTo({
						url:'register/register'
					})
				}
			}
		}
	}
</script>

<style scoped>
.header{color: #FFFFFF; position: relative; height: 320upx;}
.header .header-warp{ display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; padding: 30upx 0 0 0;}
.header .header-warp .header-img{ width: 120upx; height: 120upx; overflow: hidden; border-radius: 100%; border:5upx solid rgba(255,255,255,.3); }
.header .header-warp .header-img image{ width: 100%; height: 100%;}
.header .header-warp .header-time{ margin-top: 10upx; display: flex; justify-content: center; font-size: 28upx;}
.header .header-bg{ position: absolute; top: 0; left: 0; right: 0; width: 750upx; height: 320upx; z-index: 1;}
.header .header-bg image{width: 750upx; height: 320upx;}

.drp-money-list{ position: relative; z-index: 3; background: #FFFFFF; margin:-70upx 30upx 0; border-radius: 30upx; padding: 40upx 30upx; box-shadow: 0 20upx 30upx 0 rgba(68, 79, 90, 0.11);}
.drp-money-list .money-bottom{ padding: 20upx 10upx;}
.drp-money-list .money-bottom button{ background: linear-gradient(-88deg, #ff4f2e, #f91f28); border-radius: 50upx;}
.drp-money-list .drp-items{ display: flex; flex-direction: row; flex-wrap: wrap; background: #FFFFFF;}
.drp-money-list .drp-items .drp-item{ width: 25%; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box; padding: 20upx 0;}
.drp-money-list .drp-items .drp-item .icon,
.drp-money-list .drp-items .drp-item .icon image{ width: 60upx; height: 60upx;}
.drp-money-list .drp-items .drp-item text{ color: #777777; font-size: 25upx; margin-top: 10upx;}

.goods-list .title{ background: none; display: flex; flex-direction: row; justify-content: center; align-items: center;padding: 30upx 20upx;}
.goods-list .title .icon{ width: 40upx; height: 24upx;}
.goods-list .title text{ font-size: 40upx; margin: 0 20upx; }
.goods-list .goods-item{ background: none; }
.goods-list .goods-item .goods-left,
.goods-list .goods-item .goods-left image{ width: 230upx; height: 230upx;}

.ectouch-notcont{ padding: 100upx 0 150upx; text-align: center;}
.ectouch-notcont .img{ width: 280upx; height: 280upx; margin: 0 auto;}
.ectouch-notcont .img image{ width: 100%;}
.ectouch-notcont .cont{ color: #999999; font-size: 30upx; display: block; flex-direction: row;}
</style>
