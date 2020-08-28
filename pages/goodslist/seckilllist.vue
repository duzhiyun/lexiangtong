<template>
	<view class="container">
		<view class="header">
			<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" statusBar="false" fixed="false" leftState="false" @click-right="rightClick">
				<view class="input-view">
					<input confirm-type="search" disabled="true" @click="searchFocus" class="input" type="text" :placeholder="placeholder" />
					<uni-icon type="search" size="22" color="#666666" class="right-icon" @click="searchFocus"></uni-icon>
				</view>
				<view slot="right"><text class="iconfont" @click="handleViewSwitch" :class="[mode === 'grid' ? 'icon-grid' : 'icon-list']"></text></view>
			</uni-nav-bar>
			<dsc-filter :filter="filter" :isPopupVisible="isPopupVisible" v-on:getFilter='handleFilter' @setPopupVisible="setPopupVisible"></dsc-filter>
		</view>
		<view class="product-list-lie" v-if="!dscLoading">
			<dsc-product-list :list="cateGoodsList" :mode="mode" v-if="cateGoodsList"></dsc-product-list>
		</view>
		<uni-drawer :visible="isPopupVisible" mode="right" @close="closeRightDrawer">
			<view class="con-filter-div">
				<view class="mod_list">
					<view class="item radio-switching">
						<view class="li_line">
							<text class="big">自营产品</text>
							<view class="right"><switch :checked="checkedSelf" @change="switchChange" /></view>
						</view>
					</view>
				</view>
				
				<view class="tags_selection">
					<text :class="{'active':filter.goods_num == 1}" @click="handleTags('hasgoods')">仅看有货</text>
					<text :class="{'active':filter.promote == 1}" @click="handleTags('promote')">促销</text>
				</view>
				<view class="mod_list">
					<view class="item">
						<view class="li_line">
							<text class="big">价格区间</text>
						</view>
						<view class="filterlayer_price">
							<view class="filterlayer_price_area">
								<input type="number" placeholder="最低价" class="filterlayer_price_area_input" v-model="filter.min" />
								<view class="filterlayer_price_hang"></view>
								<input type="number" placeholder="最高价" class="filterlayer_price_area_input" v-model="filter.max" />
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list not">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover">
						<view class="uni-list-cell-navigate uni-navigate-right" @click="selectBrand">
							品牌
							<text v-if="filter.brandResultName.length > 0" class="right-con">{{ filter.brandResultName }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="filterlayer_bottom_buttons">
				<view class="filterlayer_bottom_button" @click="closeRightDrawer">关闭</view>
				<view class="filterlayer_bottom_button active" @click="submitFilter">确认</view>
			</view>
		</uni-drawer>
		<uni-drawer :visible="isPopupBrand" mode="right" @close="closeRightDrawerBrand">
			<view class="sf_layer">
				<view class="sf_layer_sub_title">
					<view class="tit">已选品牌：</view>
					<text v-if="filter.brandResultName.length > 0" class="uni-ellipsis">{{ filter.brandResultName }}</text>
				</view>
				<scroll-view :scroll-y="true" class="uni-center center-box" :style="{height:winHeight-80 + 'px'}">
					<checkbox-group @change="onBrandResult">
						<label class="uni-list-item uni-list-cell uni-list-cell-pd" v-for="item in filter.brandResult" :key="item.brand_id">
							<view><checkbox :value="item.brand_id" :checked="item.checked" /></view>
							<view>{{item.brand_name}}</view>
						</label>
					</checkbox-group>
				</scroll-view>
				<view class="filterlayer_bottom_buttons">
					<view class="filterlayer_bottom_button" @click="closeRightDrawerBrand">取消</view>
					<view class="filterlayer_bottom_button active" @click="confirmSelectBrand">确认</view>
				</view>
			</view>
		</uni-drawer>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon.vue'
	import uniDrawer from '@/components/uni-drawer.vue'
	import dscFilter from '@/components/dsc-filter.vue'
	import dscProductList from '@/components/dsc-seckill-list.vue'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		components: {
			uniNavBar,
			uniIcon,
			uniDrawer,
			dscFilter,
			dscProductList,
			dscCommonNav
		},
		data() {
			return {
				queryObj:'',
				disabled:false,
				loading:true,
				mode:'grid',
				filter:{
					sort:'goods_id',
					order:'desc',
					goods_num:'0',
					promote:'0',
					min:'',
					max:'',
					brand_id:[],
					brandResult:[],
					brandResultName:'',
					self:'0',
					intro:''
				},
				isFilter:true,
				isPopupVisible:false,
				isPopupBrand:false,
				swiperOption:{
					direction: 'vertical',
					slidesPerView: 'auto',
					freeMode: true
				},
				cat_id:0,
				page:1,
				size:10,
				winHeight:600,
				cou_id:0,
				placeholder:'输入搜索关键词',
				dscLoading:true,
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pages/goodslist/goodslist'
			}
		},
		computed:{
			...mapState({
				cateGoodsList: state => state.category.cateGoodsList
			}),
			checkedSelf(){
				return this.filter.self == '0' ? false : true
			}
		},
		methods:{
			getGoodsList(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
				
				if(this.filter.promote == 1){
					this.filter.intro = 'promote'
				}else{
					this.filter.intro = ''
				}
				
				if(this.queryObj.keywords){
					this.$store.dispatch('setGoodsList',{
						keywords:[this.queryObj.keywords],
						brand:this.filter.brand_id,
						min:this.filter.min,
						max:this.filter.max,
						goods_num:this.filter.goods_num,
						size:this.size,
						page:this.page,
						sort:this.filter.sort,
						order:this.filter.order,
						self:this.filter.self,
						intro:this.filter.intro,
						cou_id:this.cou_id
					})
				}else{
					this.$store.dispatch('setGoodsList',{
						cat_id:this.cat_id,
						brand:this.filter.brand_id,
						min:this.filter.min,
						max:this.filter.max,
						goods_num:this.filter.goods_num,
						size:this.size,
						page:this.page,
						sort:this.filter.sort,
						order:this.filter.order,
						self:this.filter.self,
						cou_id:this.cou_id
					})
				}
			},
			handleViewSwitch(){
				this.mode = this.mode === 'grid' ? 'list' : 'grid'
			},
			setPopupVisible(val){
				this.isPopupVisible = val;
			},
			handleFilter(o){
				this.filter.sort = o.sort;
				this.filter.order = o.order;

				this.getGoodsList(1);
			},
			handleTags(val){
				if(val == 'hasgoods'){
					this.filter.goods_num = this.filter.goods_num == 0 ? 1 : 0;
				}else{
					this.filter.promote = this.filter.promote == 0 ? 1 : 0;
				}
			},
			closeRightDrawer(){
				this.isPopupVisible = false;
			},
			submitFilter(){
				this.isPopupVisible = false;
				this.getGoodsList(1);
			},
			selectBrand(){
				this.isPopupBrand = this.isPopupBrand == false ? true : false;
				
				uni.request({
					url:this.websiteUrl + '/api/v4/catalog/brandlist',
					method:'POST',
					data:{
						cat_id:this.cat_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if(res.data.data.length > 0){
							this.filter.brandResult = res.data.data
						}
					}
				})
			},
			onBrandResult(e){
				let arr = ''
				this.filter.brandResult.forEach(i => {
					e.detail.value.forEach(v => {
						if(v == i.brand_id){
							arr += i.brand_name + ','
						}
					})
				})
				this.filter.brand_id = e.detail.value
				this.filter.brandResultName = arr
			},
			closeRightDrawerBrand(){
				this.filter.brand_id = []
				this.filter.brandResultName = ''
				this.isPopupBrand = false
			},
			confirmSelectBrand(){
				this.isPopupBrand = false
			},
			switchChange(e){
				this.filter.self = e.detail.value == true ? 1 : 0
			},
			searchFocus(){
				uni.reLaunch({
					url: '/pages/search/search'
				});
			},
			leftClick(){
				
			},
			rightClick(){
				
			},
			confirm(){
				
			}
		},
		onLoad(e) {
			this.queryObj = e;
			this.cat_id = 881;
			this.cou_id = e.cou_id;
			
			if(this.queryObj.keywords){
				this.placeholder = this.queryObj.keywords
			}
			
			this.getGoodsList(1);
			this.winHeight = uni.getSystemInfoSync().screenHeight - 95;
		},
		onShow() {
			this.cat_id = 881;
			this.getGoodsList(1);
		},
		onReachBottom(){
			if(this.page * this.size == this.cateGoodsList.length){
				this.page ++
				this.getGoodsList()
			}
		},
		watch:{
			cateGoodsList(){
				this.dscLoading = false
			},
			isPopupVisible(){
				if(this.isPopupVisible == false){
					this.filter.self = '0'
					this.filter.goods_num = '0'
					this.filter.promote = '0'
					this.filter.min = ''
					this.filter.max = ''
					this.filter.brand_id = []
				}
			}
		}
	}
</script>

<style>
	/*header*/
	.header .uni-navbar { border-bottom: solid 1px #e6e6e6;}
	.header .uni-navbar view{ line-height: 50px;}
	.header .uni-navbar-header{ height: 50px;}
	.header .uni-navbar-header .uni-navbar-header-btns{ padding: 0;}
	.header .uni-navbar-container{ margin: 0 20upx;}
	.header .uni-navbar .input-view{background-color: #FFFFFF; border:1px solid #e6e6e6; margin: 9px 0;}
	.header .uni-navbar .input-view .uni-icon{ display: block; }
	
	/*popop*/
	.con-filter-div{ padding-bottom: 50px; }
	.mod_list{ background: #ffffff; margin-bottom: 20upx;}
	.mod_list .item .li_line{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 20upx;}
	.mod_list .item.radio-switching{ padding: 20upx; }
	.mod_list .item.radio-switching .li_line{ padding: 0;}
	.tags_selection{ background: #FFFFFF; margin-bottom: 20upx; padding: 20upx 0 0 20upx; display: flex; flex-direction:row;}
	.tags_selection text{  padding: 5upx 30upx; background: #f7f7f7; border-radius: 10upx; margin: 0 20upx 20upx 0; border:1px solid #f7f7f7;}
	.tags_selection .active{ background: #FFFFFF; border:1px solid #e93b3d; color: #e93b3d;}
	
	.filterlayer_price{ padding: 20upx; position: relative;}
	.filterlayer_price:before{ content: "";position: absolute;z-index: 1;pointer-events: none;background-color: #e5e5e5;height: 1px;left: 0;right: 0;top: 0;}
	.filterlayer_price .filterlayer_price_area{ display: flex;}
	.filterlayer_price_area_input{ flex: 1; background: #f7f7f7; color: #333333; padding: 10upx; text-align: center; }
	.filterlayer_price_hang{ width: 50upx; position: relative;}
	.filterlayer_price_hang:before{ content: "";position: absolute;top: 50%;left: 50%;margin-left: -5px;width: 10px;height: 1px;background-color: #f1f1f1;}
	
	.filterlayer_bottom_buttons{ display: flex; flex-direction: row; position:absolute; bottom: 0; width: 100%; background: #FFFFFF; z-index: 9;}
	.filterlayer_bottom_button{ height: 49px; line-height: 49px; flex: 1; text-align: center; box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.07);}
	.filterlayer_bottom_button.active{ background-color: #e93b3d; color: #ffffff;}
	
	.sf_layer{ background: #FFFFFF; height: 100%;}
	.sf_layer .sf_layer_sub_title{ display: flex; flex-direction: row; align-items: center; padding: 20upx; background-color: #FFFFFF;}
	.sf_layer .sf_layer_sub_title .tit{ width: 150upx;}
	.sf_layer .sf_layer_sub_title text{ flex: 1 1 0%;}
	
	.center-box{ width: 100%; background: #FFFFFF;}
</style>
