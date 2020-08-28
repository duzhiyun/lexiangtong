<template>
	<view class="shop-detail" v-if="shopDetail">
		<dsc-shop-header :shopInfo="shopInfo" :shopIndex="shopIndex" :shopScore="shopScore" :shopCollect="shopCollect" @update="updateInfo"></dsc-shop-header>
		<view class="shopping-info-nums">
			<view class="item" @click="$outerHref('/pages/shop/shopGoods/shopGoods?ru_id='+shopDetail.ru_id + '&type=goods_id','app')">
				<text class="tit">{{ shopDetail.count_goods }}</text>
				<text class="text">全部商品</text>
			</view>
			<view class="item" @click="$outerHref('/pages/shop/shopGoods/shopGoods?ru_id='+shopDetail.ru_id + '&type=store_new','app')">
				<text class="tit">{{ shopDetail.count_goods_new }}</text>
				<text class="text">新品</text>
			</view>
			<view class="item" @click="$outerHref('/pages/shop/shopGoods/shopGoods?ru_id='+shopDetail.ru_id + '&type=is_promote','app')">
				<text class="tit">{{ shopDetail.count_goods_promote }}</text>
				<text class="text">促销</text>
			</view>
		</view>
		<view class="uni-card uni-card-not uni-card-contact">
			<view class="uni-list uni-collapse-left">
				<view class="uni-list-cell" @click="onChat(0,shopDetail.ru_id)">
					<view class="uni-list-cell-navigate">
						<text class="title">在线客服</text>
						<view class="value"><icon class="iconfont icon-kefu"></icon></view>
					</view>
				</view>
				<view class="uni-list-cell" @click="handleCode">
					<view class="uni-list-cell-navigate">
						<text class="title">店铺二维码</text>
						<view class="value"><icon class="iconfont icon-904anquansaoma"></icon></view>
					</view>
				</view>
				<view class="uni-list-cell" @click="makePhone(shopDetail.kf_tel)">
					<view class="uni-list-cell-navigate">
						<text class="title">商家电话</text>
						<view class="value"><icon class="iconfont icon-a"></icon></view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not uni-card-address">
			<view class="uni-list uni-collapse-left">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">公司简介</text>
					</view>
				</view>
				<view class="uni-list-cell" @click="seeLicense">
					<view class="uni-list-cell-navigate">
						<text class="title">证照信息</text>
						<view class="value"><icon class="iconfont icon-yanzheng" style="color: #21ba45;"></icon></view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">公司名称：{{ shopDetail.shop_name }}</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">所在地区：{{ shopDetail.shop_address }}</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">主营品牌：{{ shopDetail.shoprz_brandName }}</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">商家等级：<image :src="shopDetail.grade_img" mode="widthFix" v-if="shopDetail.grade_img"></image> {{ shopDetail.grade_name }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup :show="show" type="middle" @hidePopup="handelClose('code')">
			<view class="code-popup">
				<view class="tit">{{ shopDetail.shop_name }}</view>
				<view class="qrode"><image :src="shopDetail.shop_qrcode" mode="widthFix" class="img"></image></view>
				<text>邀请好友扫一扫分享店铺给TA</text>
			</view>
		</uni-popup>
		
		<uni-popup :show="LicenseShow" type="right" @hidePopup="handelClose('license')">
			<view class="license-popup">
				<view class="tit">商城网店经营者营业执照信息</view>
				<view class="license-content" v-if="basic_info">
					<view>企业名称：{{ basic_info.companyName }}</view>
					<view>营业执照注册号：{{ basic_info.business_license_id }}</view>
					<view>法定代表名称：{{ basic_info.legal_person }}</view>
					<view>营业执照所在地：{{ basic_info.license_comp_adress }}</view>
					<view>企业注册资金：{{ basic_info.registered_capital }}</view>
					<view>营业执照有效期：{{ basic_info.business_term }}</view>
					<view>营业执照经营范围：{{ basic_info.busines_scope }}</view>
					<view>公司地址：{{ basic_info.company_located }}</view>
					<view>店铺名称：{{ basic_info.shop_name }}</view>
					<view class="help">注：以上营业执照信息，根据国家工商总局《网络交易管理办法》要求对入驻商家营业执照信息进行公示，除企业名称通过认证之外，其余信息由卖家自行申报填写。如需进一步核实，请联系当地工商行政管理部门。</view>
				</view>
				<uni-icon type="closeempty" size="60" @click="handelClose('license')"></uni-icon>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import dscShopHeader from '@/components/dsc-shop-header.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniIcon from '@/components/uni-icon.vue'
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				ru_id: 0,
				show: false,
				shopScore:true,
				shopCollect:true,
				shopIndex: 0,
				LicenseShow:false
			}
		},
		components:{
			uniPopup,
			uniIcon,
			dscShopHeader
		},
		computed:{
			...mapState({
				shopDetail: state => state.shop.shopDetail
			}),
			basic_info(){
				return this.shopDetail.basic_info
			},
			is_collect_shop:{
				get(){
					return this.shopDetail.is_collect_shop
				},
				set(val){
					this.shopDetail.is_collect_shop = val
				}
			},
			count_gaze:{
				get(){
					return this.shopDetail.count_gaze
				},
				set(val){
					this.shopDetail.count_gaze = val
				}
			},
			shopInfo(){
				let arr = []

				arr[this.shopIndex] = {
					shopName:this.shopDetail.shop_name,
					logo:this.shopDetail.logo_thumb,
					ru_id:this.shopDetail.ru_id,
					commentdelivery:this.shopDetail.commentdelivery,
					commentdelivery_font:this.shopDetail.commentdelivery_font,
					commentrank:this.shopDetail.commentrank,
					commentrank_font:this.shopDetail.commentrank_font,
					commentserver:this.shopDetail.commentserver,
					commentserver_font:this.shopDetail.commentserver_font,
					count_gaze:this.count_gaze,
					is_collect_shop:this.is_collect_shop,
				}

				return arr
			},
		},
		methods: {
			updateInfo(obj){
				this.is_collect_shop = obj.is_collect_shop
				this.count_gaze = this.is_collect_shop == 1 ? this.count_gaze + 1 : this.count_gaze - 1 
			},
			handleCode(){
				this.show = true;
			},
			makePhone(val){
				if(val){
					uni.makePhoneCall({
					    phoneNumber: val
					});
				}else{
					uni.showToast({ title:'该店铺未设置客服电话', icon:'none' });
				}
			},
			handelClose(val){
				if(val == 'code'){
					this.show = false
				}else if(val == 'license'){
					this.LicenseShow = false
				}
			},
			seeLicense(){
			  this.LicenseShow = true
			},
		},
		onLoad(e){
			this.ru_id = e.id ? e.id : 0;
	
			this.$store.dispatch('setShopDetail',{
				ru_id:this.ru_id
			})
		},
	}
</script>

<style>
.shop-detail{ height: 100vh;}
.shopping-info-nums{ display: flex; flex-direction: row; align-items: center; justify-content:center; background: #FFFFFF; border-top: 2upx solid #f6f6f9; padding: 10upx 0;}
.shopping-info-nums .item{ flex: 1; width: 33.3%; display: flex; flex-direction: column; justify-content: center; align-items: center;}
.shopping-info-nums .item .tit{ font-size: 35upx; font-weight: 600;}
.shopping-info-nums .item .text{ font-size: 25upx; color: #999999;}

.uni-card .uni-list-cell .title{ font-size: 30upx; color: #333333; }
.uni-card .uni-list-cell .value .iconfont{ font-size: 36upx;}
.uni-card .uni-list-cell .title image{ width: 40upx; height: 40upx;}

.shop-detail .uni-popup-middle{ width: 74%; padding: 0; height: auto; border-radius: 0; background: #f7f7f7; }
.shop-detail .code-popup{ width: 100%;}
.shop-detail .code-popup .tit{ padding: 20upx; color: #444444; border-bottom: 2upx solid #eee; text-align: center; font-size: 30upx; }
.shop-detail .code-popup .qrode{ width: 450upx; height: 450upx; padding: 20upx; background: #FFFFFF; margin: 20upx auto;}
.shop-detail .code-popup text{ color: #777777; text-align: center; padding: 15upx; border-top: 2upx solid #eee; display: block;}

.shop-detail .license-popup .tit{ padding: 20upx; text-align: center; font-size: 30upx;}
.shop-detail .license-popup .license-content{ padding: 20upx; }
.shop-detail .license-popup .license-content .help{ margin-top: 20upx; font-weight: 600;}
.shop-detail .license-popup .uni-icon{ margin: 50upx auto; display: flex; justify-content: center; align-items: center; }
</style>
