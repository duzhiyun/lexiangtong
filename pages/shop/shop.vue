<template>
	<view>
		<view class="shop-nav-list">
			<scroll-view scroll-x="true" class="scroll-view" :scroll-left="scrollLeft">
				<view class="scroll-view-item" :class="{'active':cat_id == 0}" @click="shopCatClick(0)">
					<view class="icon"><view class="iconfont icon-menu"></view></view>
					<view class="name onelist-hidden">所有分类</view>
				</view>
				<view class="scroll-view-item" :class="{'active':cat_id == item.cat_id}" v-for="(item, index) in shopCatList" :key="index" @click="shopCatClick(item.cat_id)">
					<view class="icon">
						<image :src="item.cat_icon" class="img" v-if="item.cat_icon"></image>
						<image src="../../static/no_image.jpg" class="img" v-else></image>
					</view>
					<view class="name onelist-hidden">{{ item.cat_alias_name }}</view>
				</view>
			</scroll-view>
		</view>
		<view class="shopping-menu">
			<view class="filter-items">
				<view class="item" :class="{'active':sort == 'sort'}" @click="filterHandle('hot')">
					<text class="txt">热门</text>
					<text class="iconfont" :class="[order == 'DESC' ? 'icon-arrow-up' : 'icon-arrow-down']"></text>
				</view>
				<view class="item" :class="{'active':regionShow}" @click="filterHandle('region')">
					<text class="txt">地区</text>
					<text class="iconfont" :class="[regionShow ? 'icon-arrow-up' : 'icon-arrow-down']"></text>
				</view>
			</view>
		</view>
		<view class="store-info">
			<view class="store-list" v-for="(item,index) in shopList" :key="index">
				<view class="header">
					<view class="g-img" @click="$outerHref('/pages/shop/shopHome/shopHome?ru_id='+item.user_id,'app')"><image :src="item.logo_thumb" class="img" /></view>
					<view class="g-title">
						<view class="tit">{{ item.rz_shopName }}</view>
						<view class="gz">已经有<text class="uni-red">{{ item.count_gaze }}</text>人关注</view>
					</view>
					<view class="g-btn" :class="{'active':item.is_collect_shop == 1}" @click="collectHandle(item.user_id,item.is_collect_shop)">
						<text v-if="item.is_collect_shop == 0">未关注</text>
						<text v-else>已关注</text>
					</view>
				</view>
				<view class="shop-pic" v-if="item.goods.length > 0">
					<scroll-view scroll-x="true" class="scroll-view" :scroll-left="scrollLeft">
						<view class="product-list-item" v-for="(goodsItem,goodsIndex) in item.goods" :key="goodsIndex" @click="$outerHref('/pages/goodsDetail/goodsDetail?id='+goodsItem.goods_id,'app')">
							<view class="goods-img"><image :src="goodsItem.goods_thumb" class="img" mode="widthFix" /></view>
							<view class="shop-price">¥{{goodsItem.shop_price}}</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		
		<!--地区-->
		<uni-popup :show="regionShow" type="right" v-on:hidePopup="handelClose('region')">
			<view class="popup-right-show region-info-show">
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">地址</text>
								<view class="value">
									<block v-if="regionData.province.id">{{ regionData.province.name }}</block>
									<block v-if="regionData.city.id">{{ regionData.city.name }}</block>
									<block v-if="regionData.district.id">{{ regionData.district.name }}</block>
									<block v-if="regionData.street.id">{{ regionData.street.name }}</block>
								</view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">所在地区</text>
								<view class="value" @click="selectRegion('province')"><text class="uni-blue">{{ regionData.province.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right" v-if="regionData.province.id">
							<view class="uni-list-cell-navigate">
								<text class="title">市</text>
								<view class="value" @click="selectRegion('city')"><text class="uni-blue">{{ regionData.city.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right" v-if="regionData.city.id">
							<view class="uni-list-cell-navigate">
								<text class="title">区/县</text>
								<view class="value" @click="selectRegion('district')"><text class="uni-blue">{{ regionData.district.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right" v-if="regionData.street.id">
							<view class="uni-list-cell-navigate">
								<text class="title">乡镇/街道</text>
								<view class="value" @click="selectRegion('street')"><text class="uni-blue">{{ regionData.street.name }}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<view class="btn btn-white">
					<view class="uni-red" @click="handelClose('region')">关闭</view>
				</view>
				<view class="btn btn-btn">
					<view @click="submitRegion">保存</view>
				</view>
			</view>
		</uni-popup>
		<mpvue-picker themeColor="#007AFF" ref="mpvuePicker" mode="selector" deepLength="1" :pickerValueDefault="pickerValueDefault"
		  @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components:{
			mpvuePicker,
			uniPopup
		},
		data() {
			return {
				disabled: false,
				shopScore:false,
				size:10,
				page:1,
				cat_id:0,
				sort:'sort_order',
				order:'ASC',
				city_id:'',
				lat:'',
				lng:'',
				regionShow: false,
				pickerValueDefault: [0],
				pickerValueArray:[],
				regionData:{
					province:{
						id:'',
						name:'--请选择--'
					},
					city:{
						id:'',
						name:'--请选择--',
					},
					district:{
						id:'',
						name:'--请选择--',
					},
					street:{
						id:'',
						name:'--请选择--',
					},
					regionSplic:''
				},
				curRegion:'province',
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pages/shop/shop'
			}
		},
		computed:{
			...mapState({
				shopCatList: state => state.shop.shopCatList,
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
			}),
			shopList:{
				get(){
					return this.$store.state.shop.shopList
				},
				set(val){
					this.$store.state.shop.shopList = val	
				}
			},
			shopCollectStatue(){
				return this.$store.state.user.shopCollectStatue
			},
			userRegion(){
				return uni.getStorageSync('userRegion') !== '' ? uni.getStorageSync('userRegion') : ''
			}
		},
		methods:{
			shopListLoad(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
				
				if(this.userRegion){
					this.lat = this.userRegion.postion.lat;
					this.lng = this.userRegion.postion.lng;
				}
				
				this.$store.dispatch('setShopList',{
					cat_id:this.cat_id,
					warehouse_id:0,
					area_id:0,
					size:this.size,
					page:this.page,
					sort:this.sort,
					order:this.order,
					lat:this.lat,
					lng:this.lng,
					city_id:this.city_id
				})
			},
			shopCatClick(val){
				this.cat_id = val
				this.shopListLoad()
			},
			filterHandle(val){
				if(val == 'hot'){
					this.order = this.order == 'ASC' ? 'DESC' : 'ASC'
					this.sort = 'sort'
					this.city_id = ''
					this.shopListLoad()
				}else if(val == 'region'){
					this.handleRegion()
					this.order = 'ASC'
				}else if(val == 'distance'){
					this.order = this.order == 'ASC' ? 'DESC' : 'ASC'
					this.sort = 'distance'
					this.shopListLoad()
				}else{
					this.$store.dispatch('setShopMap',{
						lat:this.lat,
						lng:this.lng
					}).then(res=>{
						if(res.status == 'success'){
							window.location.href= res.data
						}
					})
				}
			},
			collectHandle(val,status){
				if(this.$isLogin()){
					this.$store.dispatch('setCollectShop',{
						ru_id:val,
						status:status
					})
				}else{
					uni.showModal({
						content:'请登录后关注该店铺',
						success:(res)=>{
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/login/login?delta=1'
								})
							}
						}
					})
				}
			},
			handleRegion(){
				this.regionShow = true
			},
			onConfirm(e,cur){
				let level = 0
				let arr = ['province','city','district','street']
				if(cur == 'province'){
					this.regionData.province.name = e.label
					this.regionData.province.id = e.value[0]
					level = 1
				}else if(cur == 'city'){
					this.regionData.city.name = e.label
					this.regionData.city.id = e.value[0]
					level = 2
				}else if(cur == 'district'){
					this.regionData.district.name = e.label
					this.regionData.district.id = e.value[0]
					level = 3
				}else if(cur == 'street'){
					level = 4
				}
				
				arr.forEach((v,i)=>{
					if((i+1) > level){
						this.regionData[v].id = ''
						this.regionData[v].name = '请选择'
					}
				});
			},
			onCancel(){
				this.$refs.mpvuePicker.hide()
			},
			selectRegion(val){
				this.$refs.mpvuePicker.show()
				this.curRegion = val
				if(val == 'province'){
					this.regionLoad(1,1)
				}else if(val == 'city'){
					this.regionLoad(this.regionData.province.id,2)
				}else if(val == 'district'){
					this.regionLoad(this.regionData.city.id,3)
				}else if(val == 'street'){
					this.regionLoad(this.regionData.district.id,4)
				}
			},
			regionLoad(val,level){
				this.$store.dispatch('setRegion',{
					region:val,
					level:level
				})
			},
			//关闭Popup
			handelClose(val){
				this.regionShow = false
				this.city_id = ''
				this.shopListLoad();
			},
			submitRegion(){
				if(!this.regionData.province.id > 0){
					uni.showToast({ title:'请选择地区', icon:'none' });
					return false
				}else if(!this.regionData.city.id > 0){
					uni.showToast({ title:'请选择城市', icon:'none' });
					return false
				}else if(!this.regionData.district.id > 0){
					uni.showToast({ title:'请选择区县', icon:'none' });
					return false
				}
				this.city_id = this.regionData.city.id;
				
				this.regionShow = false
				
				this.shopListLoad();
			}
		},
		onLoad(){
			this.$store.dispatch('setShopCatList');
			this.shopListLoad();
		},
		watch:{
			shopCollectStatue(){
				this.shopCollectStatue.forEach((v)=>{
					this.shopList.forEach((res) => {
						if(res.user_id == v.id){
							res.is_collect_shop = v.status
							res.count_gaze = v.status == 1 ? res.count_gaze + 1 : res.count_gaze - 1
						}
					})
				})
			},
			provinceData(){
				this.pickerValueArray = this.provinceData
			},
			cityData(){
				this.pickerValueArray = this.cityData
			},
			districtData(){
				this.pickerValueArray = this.districtData
			},
			streetData(){
				this.pickerValueArray = this.streetData
			}
		}
	}
</script>

<style>
.shop-nav-list{
	padding:20upx;
	background: #FFFFFF;
}
.scroll-view{
	white-space: nowrap;
	width: 100%;
	display: flex;
	flex-direction: row;
}
.scroll-view-item{
	width: 20%;
	display: inline-block;
	text-align: center;
	overflow: hidden;
	vertical-align: top;
}
.scroll-view-item .icon{
	width:100upx;
	height: 100upx;
	border-radius: 50%;
	border:1px solid #C5C5C5;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 15upx auto 0;
}
.scroll-view-item .icon .img{
	border-radius: 50%;
}
.scroll-view-item .icon .iconfont{
	font-size: 22px;
}
.scroll-view-item .name{
	width: 100%;
	margin-top: 15upx;
}
.scroll-view-item.active .name{
	color: #f92028;
}
.shopping-menu{
	position: relative;
	left: 0;
	right: 0;
}
.filter-items{
	background: #FFFFFF;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-top: 1px solid #f1f1f1;
	border-bottom: 1px solid #f1f1f1;
	height: 50px;
}
.filter-items .item{ width: 50%; text-align: center;}
.filter-items .item .iconfont{ font-size: 12px; margin-left: 10upx;}
.filter-items .item.active{ color: #f92028;}

.store-info{ position: relative;}
.store-info .store-list{ margin-top: 20upx; background: #FFFFFF; }
.store-info .store-list .header{ background: linear-gradient(-45deg, #fff, #fff); position: relative;display: flex; flex-direction: row; align-items: center; padding: 20upx; border-bottom: 2upx solid #ddd;}
.store-info .store-list .header .g-img{ width: 150upx; height: 150upx;}
.store-info .store-list .header .g-title{ flex: 1 1 0%; margin: 0 20upx;}
.store-info .store-list .header .g-title .tit{ font-size: 32upx; color: #333333;}
.store-info .store-list .header .g-title .gz{ color: #999999; }
.store-info .store-list .header .g-title .gz text{ margin: 0 8upx;}
.store-info .store-list .header .g-title .distance{ color: #f92028; }
.store-info .store-list .header .g-btn{ margin: 0 20upx;}
.store-info .store-list .header .g-btn text{ padding: 4upx 16upx; border:1px solid #f92028; color: #f92028; border-radius: 30upx; font-size: 14px;}
.store-info .store-list .header .g-btn.active text{ color: #ccc; border-color: #ddd; }

.shop-pic{ padding: 20upx;}
.shop-pic .product-list-item{ width: 25%; margin-right: 10upx; display: inline-block;}
.shop-pic .product-list-item .goods-img{ width: 100%; }
.shop-pic .product-list-item .shop-price{ text-align: center; color: #f92028;}
</style>
