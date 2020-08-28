<template>
	<view class="uni-page-body tabbar-padding-bottom">
		<block v-for="(item,index) in modules" :key="index">
			<dsc-search v-if="item.module == 'search'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-search>
			<dsc-slide v-if="item.module == 'slide'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-slide>
			<dsc-title v-if="item.module == 'title'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-title>
			<dsc-announcement v-if="item.module == 'announcement'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-announcement>
			<dsc-nav v-if="item.module == 'nav'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-nav>
			<dsc-line v-if="item.module == 'line'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-line>
			<dsc-blank v-if="item.module == 'blank'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-blank>
			<dsc-jigsaw v-if="item.module == 'jigsaw'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-jigsaw>
			<dsc-product v-if="item.module == 'product'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-product>
			<dsc-coupon v-if="item.module == 'coupon'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-coupon>
			<dsc-count-down v-if="item.module == 'count-down'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-count-down>
			<dsc-store v-if="item.module == 'store'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-store>
		</block>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
		
		<uni-popup :show="bonusShow" v-on:hidePopup="handelClose">
			<icon class="close" @click="handelClose"><image src="../../static/close.png" mode="widthFix" class="img"></image></icon>
			<image :src="bonusData.popup_ads" class="img" mode="widthFix" v-if="bonusData.popup_ads"></image>
		</uni-popup>
		
		<tabbar :curpage="curpage"></tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import uniCountdown from "@/components/uni-countdown.vue"
	import uniPopup from '@/components/uni-popup.vue'
	
	// custom components
	import dscSlide from '@/components/visualization/slide/Frontend'
	import dscTitle from '@/components/visualization/title/Frontend'
	import dscAnnouncement from '@/components/visualization/announcement/Frontend'
	import dscNav from '@/components/visualization/nav/Frontend'
	import dscLine from '@/components/visualization/line/Frontend'
	import dscBlank from '@/components/visualization/blank/Frontend'
	import dscJigsaw from '@/components/visualization/jigsaw/Frontend'
	import dscProduct from '@/components/visualization/product/Frontend'
	import dscCoupon from '@/components/visualization/coupon/Frontend'
	import dscCountDown from '@/components/visualization/count-down/Frontend'
	import dscButton from '@/components/visualization/button/Frontend'
	import dscSearch from '@/components/visualization/search/Frontend'
	import dscStore from '@/components/visualization/store/Frontend'
	import dscShopSigns from '@/components/visualization/shop-signs/Frontend'
	import dscShopMenu from '@/components/visualization/shop-menu/Frontend'
	
	import tabbar from "@/components/tabbar/tasktabbar.vue";
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		components: {
			uniNavBar,
			uniIcon,
			uniCountdown,
			uniPopup,
			dscSlide,
			dscTitle,
			dscAnnouncement,
			dscNav,
			dscLine,
			dscBlank,
			dscJigsaw,
			dscProduct,
			dscCoupon,
			dscCountDown,
			dscButton,
			dscSearch,
			dscStore,
			dscShopSigns,
			dscShopMenu,
			tabbar
		},
		data() {
			return {
				token:'',
				timer: '',
				productList: [],
				renderImage: false,
				bonusShow:false,
				dscLoading:true,
				curpage:'',
				ru_id:0
			}
		},
		computed:{
			...mapState({
				//modules: state => state.shop.modules,
				bonusData: state => state.common.bonusData,
			}),
			modules:{
				get(){
					return this.$store.state.shop.modules
				},
				set(val){
					this.$store.state.shop.modules = val
				}
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pages/index/index'
			}
		},
		onLoad(e) {
			uni.hideTabBar();
		},
		onShow(e) {
			let pages = getCurrentPages()
			this.curpage = pages[pages.length - 1].route
			
			if(uni.getStorageSync('bonusShow')){
				this.bonusShow = true
			}
			
			this.$store.dispatch('setHome');			//获取可视化信息
		},
		onPullDownRefresh(){
			uni.showLoading({title: '加载中'});
			this.modules = []
			this.initData();
		},
		methods: {
			initData(){
				setTimeout(() => {
					this.$store.dispatch('setHome');
					
					uni.stopPullDownRefresh();
				}, 300);
			},
			//关闭Popup
			handelClose(){
				this.bonusShow = false
				
				uni.setStorage({
					key:'bonusShow',
					data:false
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		},
		watch:{
			modules(){
				this.dscLoading = false
			},
			bonusData(){
				// if(this.bonusData && this.bonusData.open == 1){
				// 	this.bonusShow = true
				// }
			}
		}
	}
</script>

<style>
	.uni-page-body .uni-navbar-header .uni-navbar-header-btns:first-child{ width: 60upx; justify-content: center; padding-left: 12upx;}
	.uni-page-body .more-link{ display: flex; flex-direction: row; align-items: center; font-size: 25upx; }
	.uni-page-body .more-link .txt{ padding: 0 10upx 0 20upx; border-left: 1px solid #e3e8ee; line-height: 1.2; margin-left: 10upx;}
	.uni-page-body .more-link .uni-icon{ line-height: 1.8;}
	.uni-page-body .uni-popup-middle{ padding: 0; width: 80%; height: auto; background: none;}
	
	.uni-page-body .input-view .uni-icon{ display: block; }
	
	.uni-page-body .uni-popup-middle .close{ width: 30upx; height: 30upx; position: absolute; top: -32upx; right: -10upx;}
</style>
