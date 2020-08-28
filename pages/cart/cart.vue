<template>
	<view class="container app-header-top">
		<view v-if="goodsCartList.length > 0">
			<view class="header-address">
				<view class="address-box" @click="handleRegion">
					<view class="iconfont icon-location"></view>
					<text>{{ regionSplic }}</text>
				</view>
				<view class="address-box"></view>
				<view class="h-edit uni-red" @click="onEdit">
					<text v-if="!batchEdit">编辑</text>
					<text v-else>完成</text>
				</view>
			</view>
			<view class="card-goods">
				<view class="card-goods-group" v-for="(storeList,listIndex) in goodsCartList" :key="listIndex">
					<view class="card-shop-head">
						<view class="head-left">
							<view class="checkbox" :class="{'checked':checkedShop[listIndex]}" @click="checkShop(checkedShop[listIndex],storeList,listIndex)">
								<view class="checkbox-icon">
									<uni-icon type="checkmarkempty" size="22" color="#ffffff"></uni-icon>
								</view>
							</view>
							<view class="checkbox-con" @click="$outerHref('/pages/shop/shopHome/shopHome?ru_id=' + storeList.store_id,'app')" v-if="storeList.store_id > 0">{{ storeList.store_name }}<uni-icon type="arrowright" size="16" color="#333333"></uni-icon></view>
							<view class="checkbox-con" v-else>{{ storeList.store_name }}</view>
						</view>
						<view class="head-right uni-red" @click="handleCoupon(storeList.store_id)" v-if="storeList.coupuns_num > 0">领取优惠券</view>
					</view>
					<view class="card-shop-box">
						<view class="card-act-goods" v-for="(actItem,actIndex) in storeList.new_list" :key="actIndex">
							<view class="cart-act-title" v-if="actItem.act_type != null">
								<view class="txt">
									<view class="em-icon" :class="{'active-zeng':actItem.act_type == 0,'active-zhekou':actItem.act_type == 2}">{{ actItem.act_type_txt }}</view>
									<view class="act-name" v-if="actItem.act_type == 0">
										<view v-if="actItem.available">已满{{ actItem.min_amount }} <text class="uni-red" @click="receiveGift(actItem.act_id,false)">领取赠品</text></view>
										<view v-else>购物满{{ actItem.min_amount }},可领取赠品, <text class="uni-red" @click="receiveGift(actItem.act_id,true)">查看赠品</text></view>
									</view>
									<view class="act-name" v-else-if="actItem.act_type == 1">
										<view v-if="actItem.available">已满{{ actItem.min_amount }}（立减{{actItem.act_type_ext_format}}）</view>
										<view v-else>满{{ actItem.min_amount }}减{{ actItem.act_type_ext_format }}</view>
									</view>
									<view class="act-name" v-else>
										<view v-if="actItem.available">已满{{ actItem.min_amount }}（享{{ actItem.act_type_ext_format }}折优惠）</view>
										<view v-else>购物满{{ actItem.min_amount }}享受{{ actItem.act_type_ext_format }}折优惠</view>
									</view>
								</view>
								<view class="more" @click="$outerHref('/pages/cart/coudan/coudan?act_id='+actItem.act_id,'app')">
									<view v-if="actItem.available">再逛逛</view>
									<view v-else>去凑单</view>
									<uni-icon type="arrowright" size="16" color="#f92028"></uni-icon>
								</view>
							</view>
							<view class="cart-goods-item" v-for="(item,index) in actItem.act_goods_list" :key="index">
								<scroll-view scroll-x="true" scroll-y="true" class="scroll-view-G" :scroll-left="scrollLeft">
									<view class="scroll-view-item scroll-view-item-left">
										<view class="uni-flex">
											<view class="checkbox" :class="{'checked':item.is_checked}" @click="checkGoods(item.rec_id,listIndex)">
												<view class="checkbox-icon"><uni-icon type="checkmarkempty" size="22" color="#ffffff"></uni-icon></view>
											</view>
											<view class="checkbox-con" style="flex: 1 1 0%;">
												<view class="cart-goods-info">
													<view class="goods-img">
														<navigator :url="'/pages/goodsDetail/goodsDetail?id='+item.goods_id" hover-class="none"><image :src="item.goods_thumb" v-if="item.goods_thumb" class="image"></image></navigator>
														<block v-if="item.is_invalid == 0 && item.product_number == 0">
														<view class="mask"></view>
														<view class="mash-text">无货</view>
														</block>
														<block v-if="item.is_invalid == 1">
														<view class="mask"></view>
														<view class="mash-text">已失效</view>
														</block>
														<block v-if="item.xiangou_error > 0">
														<view class="mask"></view>
														<view class="mash-text">已满限购</view>
														</block>
													</view>
													<view class="cart-goods-content">
														<view class="goods-title twolist-hidden"><navigator :url="'/pages/goodsDetail/goodsDetail?id='+item.goods_id" hover-class="none">{{ item.goods_name }}</navigator></view>
														<view class="goods-attr" v-if="item.goods_attr">{{ item.goods_attr }}</view>
														<view class="goods-info">
															<view class="price">{{ item.goods_price_format }}</view>
															<view class="oper">
																<view class="uni-number-min"><uni-number-box :value="item.goods_number" :min="item.is_minimum > 0 ? item.minimum : 1" :max="item.product_number" @change="goodsNumberhandle($event,item.rec_id,item.act_id,storeList.store_id)" :disabled="stepDisabled.length > 0 ? stepDisabled[listIndex][index].type : false"></uni-number-box></view>
																<view class="oper-icon"></view>
															</view>
														</view>
														<view class="goods-other" v-if="actItem.act_type != null" @click="onFavourableList(item.goods_id,item.ru_id,item.act_id,item.rec_id)">
															<view class="em-icon" :class="{'active-zeng':actItem.act_type == 0,'active-zhekou':actItem.act_type == 2}">{{ actItem.act_type_txt }}</view>
															<view class="act-name uni-ellipsis">{{ actItem.act_name }}</view>
															<uni-icon type="arrowdown" size="18" color="#999999"></uni-icon>
														</view>
													</view>
												</view>
												<view class="goods-store" v-if="item.store_count > 0">
													<view>支持<text class="uni-red">门店自提</text>服务</view>
												</view>
											</view>
										</view>
									</view>
									<view class="scroll-view-item scroll-view-item-right" @click="deleteCartGoods(item.rec_id)">
										<view>删除</view>
									</view>
								</scroll-view>
								
							</view>
							<!-- 赠品 -->
							<view class="cart-goods-item cart-goods-item-outer" v-for="(item,index) in actItem.act_cart_gift" :key="index">
								<view class="checkbox-con">
									<view class="cart-goods-info">
										<view class="goods-img">
											<image :src="item.goods_thumb" v-if="item.goods_thumb" class="image"></image>
											<image src="../../static/gift-icon.png" class="icon"></image>
										</view>
										<view class="cart-goods-content">
											<view class="goods-title twolist-hidden">{{ item.goods_name }}</view>
											<view class="goods-attr" v-if="item.goods_attr">{{ item.goods_attr }}</view>
											<view class="goods-info">
												<view class="price">{{ item.goods_price_format }}</view>
												<view class="oper"><view class="stepper stepper_sum">x{{ item.goods_number }}</view></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="shop-store-cart" v-if="shopStore[listIndex][0]">
						<view class="store-btn" @click="shopStoreCart(listIndex)"><icon class="iconfont icon-store-alt"></icon>门店自提</view>
					</view>
				</view>
			</view>
			<view class="cart-submit">
				<view class="checkall">
					<view class="checkbox" :class="{'checked':checkedAll}" @click="checkAll">
						<view class="checkbox-icon">
							<uni-icon type="checkmarkempty" size="22" color="#ffffff"></uni-icon>
						</view>
						<label>全选</label>
					</view>
				</view>
				<view class="submit-bar-text">
					<view>
						<text>合计:</text>
						<view class="submit-bar-price">{{totalPriceTip}}</view>
					</view>
					<view class="submit-bar-sub" v-if="ratePrice > 0">(税费 {{ ratePriceTip }})</view>
					<view class="submit-bar-sub" v-if="favourablePrice != 0">(不含运费，已节省 {{ favourableTip }})</view>
				</view>
				<view class="btn-bar">
					<block v-if="!batchEdit">
						<button class="btn" :class="[disabled ? 'btn-disabled' : 'btn-red']" :disabled="disabled" :loading="loading" @click="onSubmit">{{submitBarText}}</button>
						<!-- <block v-if="count > 0">
							<button class="btn btn-red" @click="onSubmit">{{submitBarText}}</button>
						</block>
						<block v-else>
							<view class="btn btn-disabled">{{submitBarText}}</view>
						</block> -->
					</block>
					<button class="btn" :class="[length > 0 ? 'btn-red' : 'btn-disabled']" :disabled="!length > 0" @click="onBatchDelete" v-else>批量删除</button>
				</view>
			</view>
		</view>
		<view class="flow-no-cart" v-else>
			<view class="gwc-bg"><view class="iconfont icon-cart"></view></view>
			<text>您的购物车还是空空的，快去逛逛吧！</text>
			<view class="card-btn">
				<navigator url="/pages/index/index" open-type="switchTab" hover-class="none"><button type="default" plain="true">去逛逛</button></navigator>
				<button type="default" plain="true" @click="$outerHref('../../pagesB/collectionGoods/collectionGoods',$isLogin())">看看关注</button>
			</view>
		</view>
		
		<view class="goods-detail-guess" v-if="goodsGuessList">
			<view class="title"><text>猜你喜欢</text></view>
			<view class="product-list-lie">
				<dsc-product-list :list="goodsGuessList" :productOuter="productOuter"></dsc-product-list>
			</view>
		</view>
		
		<!-- 领取赠品列表 -->
		<uni-popup :show="giftShow" type="bottom" v-on:hidePopup="handelClose('gift')">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">可领取最多{{ act_type_ext }}件商品
						<button type="warn" size="mini" @click="submitGift" v-if="!giftDisabled">提交</button>
					</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('gift')"></uni-icon>
				</view>
				<view class="content">
					<scroll-view scroll-y style="height:250px;">
						<view class="cart-goods-item" v-for="(item,index) in giftList" :key="index">
							<view class="checkbox" :class="{'checked':item.is_checked}" @click="checkGift(item.id)">
								<view class="checkbox-icon"><uni-icon type="checkmarkempty" size="22" color="#ffffff"></uni-icon></view>
							</view>
							<view class="checkbox-con">
								<view class="cart-goods-info">
									<view class="goods-img">
										<image :src="item.thumb" v-if="item.thumb" class="image"></image>
									</view>
									<view class="cart-goods-content">
										<view class="goods-title twolist-hidden">{{ item.name }}</view>
										<view class="goods-info">
											<view class="price">{{ item.price_formated }}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>		
			</view>
		</uni-popup>
		
		<!-- 促销活动 -->
		<uni-popup :show="favourableShow" type="bottom" v-on:hidePopup="handelClose('favourable')">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">可选促销</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('favourable')"></uni-icon>
				</view>
				<view class="content">
					<scroll-view scroll-y style="height:200px;">
						<view class="cart-goods-item" v-for="(item,index) in favourableList" :key="index">
							<view class="checkbox" :class="{'checked':item.is_checked}" @click="onFavourableTab(item.act_id,item.rec_id)">
								<view class="checkbox-icon"><uni-icon type="checkmarkempty" size="22" color="#ffffff"></uni-icon></view>
							</view>
							<view class="act-item-right">
								<view class="em-icon active-zhekou" v-if="item.act_type == 0">满赠</view>
								<view class="em-icon active-jian" v-else-if="item.act_type == 1">满减</view>
								<view class="em-icon active-zhekou" v-else-if="item.act_type == 2">满折</view>
								<view class="act-name uni-ellipsis">{{ item.act_name }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 优惠券 -->
		<uni-popup :show="couponShow" type="bottom" v-on:hidePopup="handelClose('coupon')">
			<view class="title">
				<view class="txt">领取优惠券 ({{ coupuns_num }})</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('coupon')"></uni-icon>
			</view>
			<view class="content">
				<scroll-view scroll-y style="height:300px;">
					<view class="items" v-if="cartCouponsList.length > 0">
						<view class="item" v-for="(item,index) in cartCouponsList" :key="index">
							<view class="left">
								<view class="price">
									<view class="em">￥</view>
									<view class="strong-text">{{ item.cou_money }}</view>
									<view class="couons-text">满{{ item.cou_man }}元可用</view>
								</view>
								<view class="con">
									<view class="range-item">{{ item.cou_name }}</view>
									<view class="range-item">{{ item.cou_start_time }} 至 {{ item.cou_end_time }}<text class="uni-red">(每人限领{{ item.cou_user_num}}张)</text></view>
								</view>
								<image src="../../static/coupons-print.png" v-if="item.cou_is_receive == 1"></image>
							</view>
							<view class="right" @click="handelReceive(item.cou_id)">
								<text v-if="item.cou_is_receive == 1 && isLogin">已领取</text>
								<text v-else>领取</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
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
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">市</text>
								<view class="value" @click="selectRegion('city')"><text class="uni-blue">{{ regionData.city.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">区/县</text>
								<view class="value" @click="selectRegion('district')"><text class="uni-blue">{{ regionData.district.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
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
		<mpvue-picker themeColor="#007AFF" ref="mpvuePicker" mode="selector" deepLength=1 :pickerValueDefault="pickerValueDefault"
		  @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		  
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
		
		<tabbar :curpage="curpage"></tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniNumberBox from "@/components/uni-number-box.vue";
	import uniIcon from "@/components/uni-icon.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import dscProductList from '@/components/dsc-product-list.vue';
	import universal from '@/common/mixins/universal.js';
	import tabbar from "@/components/tabbar/tasktabbar.vue";
	
	export default {
		mixins:[universal],
		components: {
			uniNumberBox,
			uniIcon,
			uniPopup,
			mpvuePicker,
			dscProductList,
			tabbar
		},
		data() {
			return {
				loading:true,
				disabled:true,
				default:true,
				checkedAll:true,
				checkedGoodsId:[],
				totalPrice:0,
				ratePrice:0,
				ratePriceTip:'',
				favourablePrice:0,
				count:0,
				coupuns_num:0,
				productOuter:true,
				batchEdit:false,
				couponShow:false,
				favourableShow:false,
				favourableList:[],
				giftShow:false,
				giftList:[],
				act_type_ext:0,
				checkGiftStr:'',
				checkGiftArr:[],
				giftDisabled:false,
				scrollLeft:0,
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
				dscLoading:true,
				stepDisabled:[],
				curpage:'',
				shopStore:[],
				timer:''
			};
		},
		computed:{
			...mapState({
				checkedGoods: state => state.shopping.checkedGoods,	//购物车商品列表
				cartCouponsList: state => state.shopping.cartCouponsList, //优惠券列表
				goodsGuessList: state => state.shopping.goodsGuessList, //猜你喜欢
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
				allGoodsListId: state => state.shopping.allGoodsListId
			}),
			goodsCartList:{
				get(){
					return this.$store.state.shopping.goodsCartList
				},
				set(val){
					this.$store.state.shopping.goodsCartList = val
				}
			},
			checkedShop:{
				get(){
					return this.$store.state.shopping.checkedShop
				},
				set(val){
					this.$store.state.shopping.checkedShop = val
				}
			},
			submitBarText() {
				return '去结算' + (this.count ? `(${this.count})` : '')
			},
			totalPriceTip(){
				return this.totalPrice
			},
			favourableTip(){
				return this.favourablePrice
			},
			//配送地区
			regionSplic(){
				return this.regionData.regionSplic
			},
			isLogin(){
				return this.$isLogin()
			},
			length(){
				return this.checkedGoodsId ? this.checkedGoodsId.length : 0
			}
		},
		onShow(){
			let pages = getCurrentPages()
			this.curpage = pages[pages.length - 1].route
			
			this.goodsList();
			
			//获取购物车数量
			this.$store.dispatch('setCommonCartNumber');
		},
		onPullDownRefresh(){
			this.initData();
		},
		methods:{
			initData(){
				setTimeout(() => {
					this.goodsList();
					uni.stopPullDownRefresh();
				}, 300);
			},
			//购物车列表
			goodsList(){
				this.$store.dispatch('setGoodsCart',{
					warehouse_id:0,
					area_id:0
				})
			},
			//选择店铺
			checkShop(checked,shop,index){
				this.checkedShop.splice(index,1,!checked)
				if(!checked){
					shop.new_list.forEach((act)=>{
						act.act_goods_list.forEach((g)=>{
							this.checkedGoods[index].push(g.rec_id)
						})
					})
				}else{
					this.checkedGoods[index] = []
				}
				this.changeGoods()
			},
			//选择购物车商品
			checkGoods(rec_id,index){
				let clength = []
				
				this.checkedGoods.forEach((v,i)=>{
					if(i == index){
						if(v.indexOf(rec_id) > -1){
							v.splice(v.indexOf(rec_id),1)
						}else{
							v.push(rec_id)
						}
					}
				})
				
				//获取店铺下商品数量
				this.goodsCartList.forEach((v,index)=>{
					let arr = []
					v.new_list.forEach((act)=>{
						act.act_goods_list.forEach((g)=>{
							arr.push(g)
						})
					})

					clength.push(arr.length)
				})
				
				//商品勾选状态 改变店铺勾选状态
				this.checkedShop[index] = (clength[index] == this.checkedGoods[index].length)
				
				this.changeGoods()
			},
			//商品勾选变化更新购物车列表
			changeGoods(){
				this.checkedGoodsId = [];
				
				this.checkedGoods.forEach((v,i)=>{
					v.forEach(i=>{
						this.checkedGoodsId.push(i)
					})
				})
				
				this.checkAllOper();
				
				this.loading = true
				
				//更新购物车商品列表
				this.$store.dispatch('setCartChecked',{
					rec_id:this.checkedGoodsId,
					sel_flag:'cart_sel_flag',
				}).then(({data:data})=>{
					this.totalPrice = data.goods_amount_formated        //商品价格
					this.favourablePrice = data.discount_formated       //购物车优惠价格
					this.count = data.cart_number                       //购物车勾选商品数量
					
					if(data.cross_border){ //跨境
						this.ratePrice = data.rate_price              	//税费
						this.ratePriceTip = data.rate_formated        	//税费格式化
					}
					
					if(data.cart_fav_box){                              //数量改变触发优惠活动条件，更新购物车
						this.goodsCartList = data.cart_fav_box
						this.loading = false
					}
				})
			},
			//默认进购物车全部勾选商品
			changeDefaultGooods(){
				this.default = false;
				this.checkAllOper();
				this.$store.dispatch('setCartDefault',{
					rec_id:this.checkedGoodsId
				}).then(({ data:data })=>{
					this.totalPrice = data.goods_amount_formated  	//商品价格
					this.favourablePrice = data.discount_formated 	//购物车优惠价格
					this.count = data.cart_number                 	//购物车勾选商品数量
					
					//跨境
					if(data.cross_border){
						this.ratePrice = data.rate_price		  	//税费
						this.ratePriceTip = data.rate_formated		//税费格式化
					}
					
					this.loading = false
				})
			},
			//更新购物车全选状态
			checkAllOper(){
				let cAll = 0
				
				this.checkedShop.forEach(v=>{
					if(!v){
						cAll++
					}
				})
				if(cAll > 0){
					this.checkedAll = false
				}else{
					this.checkedAll = true
				}
			},
			//全选
			checkAll(){
				this.checkedAll = this.checkedAll ? false : true
				
				this.goodsCartList.forEach((v,i)=>{
					this.checkedShop.splice(i,1,this.checkedAll)
					this.checkedGoods[i] = []
					if(this.checkedAll){
						v.new_list.forEach((act)=>{
							act.act_goods_list.forEach((g)=>{
								this.checkedGoods[i].push(g.rec_id)
							})
						})
					}
				})
				
				this.changeGoods()
			},
			//修改购物车商品数量
			goodsNumberhandle(e,id,act_id,store_id){
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.stepDisabled.forEach((v,i)=>{
						v.forEach((s,d)=>{
							if(s.id == id){
								this.stepDisabled[i][d].type = true
							}
						})
					})
					
					this.$store.dispatch('setUpdateNumber',{
						rec_id:id,
						num:e
					}).then(({data:data})=>{
						this.stepDisabled.forEach((v,i)=>{
							v.forEach((s,d)=>{
								if(s.id == id){
									this.stepDisabled[i][d].type = false
								}
							})
						})
						this.totalPrice = data.goods_amount_formated 	//商品价格
						this.favourablePrice = data.discount_formated   //购物车优惠价格
						this.count = data.cart_number             		//购物车勾选商品数量
						
						//跨境
						if(data.cross_border){
							this.ratePrice = data.rate_price			//税费
							this.ratePriceTip = data.rate_formated      //税费格式化
						}
						
						if(data.cart_fav_box){ //数量改变触发优惠活动条件，更新购物车
							this.goodsCartList.forEach((v)=>{
								if(v.store_id == store_id){
									v.new_list.forEach((g,i)=>{
										if(g.act_id == act_id){
											v.new_list[i] = data.cart_fav_box
										}
									})
								}
							})
						}
					})
				},1000)
			},
			//优惠活动列表
			onFavourableList(goods_id,ru_id,act_id,rec_id){
				this.$store.dispatch('setFavourable',{
					goods_id:goods_id,
					ru_id:ru_id,
					act_id:act_id,
					rec_id:rec_id
				}).then(({data:data})=>{
					this.favourableList = data.favourable
					this.favourableShow = true
					this.favourableList.forEach((v)=>{
						if(v.is_checked){
							this.checkFavourable = v.act_id
						}
					})
				})
			},
			//选择优惠活动
			onFavourableTab(act_id,rec_id){
				this.favourableList.forEach(v=>{
					v.is_checked = false
					if(act_id == v.act_id){
						v.is_checked = true
					}
				})
				
				this.$store.dispatch('setChangefav',{
					act_id:act_id,
					rec_id:rec_id
				}).then(({data:data})=>{
					uni.showToast({
						title:data.msg,
						icon:'none'
					})
					
					if(data.error == 0){
						this.goodsList()
						this.favourableShow = false
					}
				})
			},
			//赠品弹出层
			receiveGift(act_id,type){
				this.giftShow = true
				this.giftDisabled = type
				this.$store.dispatch('setGiftList',{
					act_id:act_id
				}).then(({data:data})=>{
					this.giftList = data.giftlist 
					this.act_type_ext = parseInt(data.act_type_ext)
					this.giftList.forEach((v)=>{
						if(v.is_checked){
							if(this.act_type_ext > 1){
								this.checkGiftArr.push(v.id)
							}else{
								this.checkGiftStr = v.id
							}
						}
					})
				})
			},
			//选择赠品
			checkGift(id){
				if(!this.giftDisabled){
					this.giftList.forEach((v)=>{
						if(this.act_type_ext > 1){
							if(id == v.id){
								v.is_checked = v.is_checked ? false : true
								if(v.is_checked){
									this.checkGiftArr.push(v.id)
								}else{
									var index = this.checkGiftArr.indexOf(v.id)
									if(index > -1){
										this.checkGiftArr.splice(index,1)
									}
								}
							}
						}else{
							v.is_checked = false
							if(id == v.id){
								v.is_checked = true
								this.checkGiftStr = v.id
							}
						}
					})
				}else{
					uni.showToast({
						title:'未达到领取赠品条件',
						icon:'none'
					})
				}
			},
			//提交赠品
			submitGift(){
				let act_id = 0
				let ru_id  = 0
				let select_gift
				this.giftList.forEach(v=>{
					act_id = v.act_id
					ru_id = v.ru_id
				})

				if(this.act_type_ext > 1){
					select_gift = this.checkGiftArr
				}else{
					select_gift = this.checkGiftStr
				}

				this.$store.dispatch('setGiftChecked',{
					act_id:act_id,
					ru_id:ru_id,
					select_gift:select_gift
				}).then(({data:data})=>{
					uni.showToast({
						title:data.message
					})
					if(data.error == 0){
						this.goodsList()
						this.giftShow = false
					}
				})
			},
			//优惠券列表
			handleCoupon(ru_id) {
				this.couponShow = true

				this.goodsCartList.forEach(v=>{
					if(v.store_id == ru_id){
						this.coupuns_num = v.coupuns_num
					}
				})

				this.$store.dispatch('setCoupons', {
					ru_id: ru_id
				})
			},
			//优惠券领取
			handelReceive(val,ru_id) {
				this.$store.dispatch('setGoodsCouponReceive', {
					cou_id: val
				}).then(({data:data}) => {
					uni.showToast({
						title:data.msg,
						icon:'none'
					})
					
					this.$store.dispatch('setCoupons', {
						ru_id: ru_id
					})
				})
			},
			//猜你喜欢
			goodsGuessHandle(){
				this.$store.dispatch('setGoodsGuess',{
					warehouse_id:0,
					area_id:0
				})
			},
			//删除购物车商品
			deleteCartGoods(val,is_gift){
				let that = this
				if(is_gift){
					this.checkGift = ''
					this.checkGiftArr = []
				}

				uni.showModal({
					content:'您确定要删除此商品吗？',
					success:function(res){
						that.scrollLeft = 1
						if(res.confirm){
							that.$store.dispatch('setCartGoodsDelete',{
								rec_id:val
							}).then(res=>{
								if(res == 1){
									uni.showToast({
										title:'删除成功',
										icon:'success'
									})
									that.goodsList();
									that.changeGoods();
								}else{
									uni.showToast({
										title:'删除失败',
										icon:'fail'
									})
								}
							})
						}
					},
					fail:function(res){
						
					}
				})
			},
			//编辑
			onEdit(){
				this.batchEdit = this.batchEdit ? false : true
			},
			//批量删除
			onBatchDelete(){
				this.$store.dispatch('setCartBatchDelete',{
					rec_id:this.checkedGoodsId
				}).then(res=>{
					if(res.error == 0){
						uni.showToast({
							title:'删除成功',
							icon:'success'
						});
						this.goodsList()
					}else{
						uni.showToast({
							title:'删除失败',
							icon:'none'
						})
					}
				})
			},
			//关闭弹出层
			handelClose(val){
				if(val == 'gift'){
					this.giftShow = false
				}else if(val == 'favourable'){
					this.favourableShow = false
				}else if(val == 'coupon'){
					this.couponShow = false
				}else if(val == 'region'){
					this.regionShow = false
				}
			},
			//提交购物车到结算页面
			onSubmit() {
				let fald = true
				//验证库存是否不足
				this.goodsCartList.forEach((f) => {
					f.new_list.forEach((act)=>{
						act.act_goods_list.forEach((g)=>{
							if(g.product_number == 0 && g.is_checked == true){
								uni.showToast({ 
									title:g.goods_name + '库存不足，不可提交',
									icon:'none'
								});
								fald = false
								return false
							}
					
							if(g.is_invalid == 1 && g.is_checked == true){
								uni.showToast({
									title:g.goods_name + '商品下架或者删除，不可提交',
									icon:'none'
								});
								fald = false
								return false
							}

							if(g.xiangou_error > 0){
								let msg = ''
								if(g.xiangou_can_buy_num > 0){
									msg = g.goods_name + '只可购买' + g.xiangou_can_buy_num + '件'
								}else{
									msg = g.goods_name + '限购已满'
								}
								uni.showToast({
									title:msg,
									icon:'none'
								});
								fald = false
								return false
							}
						})
					})
				})
				
				if(this.checkedGoodsId.length > 0 && fald){
					if(this.$isLogin()){
						uni.navigateTo({
							url:'/pages/checkout/checkout'
						})
					}else{
						uni.showModal({
							content: "您需要登录会员!",
							success:(res)=>{
								if(res.confirm){
									uni.navigateTo({
										url:'/pages/login/login?delta=1'
									})
								}
							}
						})
					}
				}
			},
			handleRegion(){
				this.getRegionData();
				
				this.regionShow = true
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
					this.regionData.street.name = e.label
					this.regionData.street.id = e.value[0]
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
			submitRegion(){
				this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
				
				//存本地缓存
				uni.setStorage({
					key:'regionData',
					data:this.regionData
				})
				
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
				
				this.regionShow = false
			},
			getRegionData(){
				//判断地区是否为空调用定位地区
				uni.getStorage({
					key:'regionData',
					success:(res)=>{
						let data = res.data;
						if(res.data){
							this.regionData.province.id = data.province ? data.province.id : ''
							this.regionData.province.name = data.province ?  data.province.name : ''
							this.regionData.city.id = data.city ? data.city.id : ''
							this.regionData.city.name = data.city ? data.city.name : ''
							this.regionData.district.id = data.district ? data.district.id : ''
							this.regionData.district.name = data.district ? data.district.name : ''
							this.regionData.street.id = data.street ? data.street.id : ''
							this.regionData.street.name = data.street ? data.street.name : '请选择'
							
							this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
						}
					},
					fail: (res) => {
						//读取缓存
						uni.getStorage({
							key:'userRegion',
							success:(res)=>{
								let data = res.data;
								if(res.data){
									this.regionData.province.id = data.province ? data.province.id : ''
									this.regionData.province.name = data.province ?  data.province.name : ''
									this.regionData.city.id = data.city ? data.city.id : ''
									this.regionData.city.name = data.city ? data.city.name : ''
									this.regionData.district.id = data.district ? data.district.id : ''
									this.regionData.district.name = data.district ? data.district.name : ''
									this.regionData.street.id = data.street ? data.street.id : ''
									this.regionData.street.name = data.street ? data.street.name : '请选择'
									
									this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
								}
							}
						});
					}
				});
			},
			shopStoreCart(index){
				let rec_id = ''
				if(this.$isLogin()){
					this.goodsCartList.forEach((v,i)=>{
						if(index == i){
							v.new_list.forEach((act)=>{
								act.act_goods_list.forEach(goods=>{
									if(goods.store_count > 0 && goods.is_checked > 0){
										rec_id += goods.rec_id + ','
									}
								})
							})
						}
					})
					
					rec_id = rec_id.substr(0, rec_id.length - 1)
					
					if(rec_id.length > 0){
						uni.navigateTo({
							url:'/pages/store/store?rec_id=' + rec_id
						})
					}else{
						uni.showToast({ title:'请勾选门店商品', icon:'none' });
					}
				}else{
					uni.showModal({
						content: "您需要登录会员!",
						success:(res)=>{
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/login/login?delta=1'
								})
							}
						}
					})
				}
			}
		},
		onLoad(e) {
			this.goodsGuessHandle(); //猜你喜欢
			
			this.getRegionData(); //根据缓存获取地区
		},
		watch:{
			goodsCartList(){
				let obj = {}
				let arr = []
				let shopArr = []
				let shopState = false
				this.dscLoading = false
				if(this.default){
					this.checkedGoodsId = []
					this.checkedGoods.forEach((v,index)=>{
						v.forEach(i=>{
							this.checkedGoodsId.push(i)
						})
					})
					
					this.allGoodsListId.forEach((v,index)=>{
					  arr[index] = []
			
					  v.forEach(i=>{
						obj = {
						  id:i,
						  type:false
						}
						
						arr[index].push(obj)
					  })
					})
					
					this.stepDisabled = arr
					
					//初始化选中商品
					this.changeDefaultGooods()
				}
				
				//选中门店
				this.goodsCartList.forEach((v,index)=>{
				  shopArr[index] = []
				  shopState = false
				  v.new_list.forEach((act)=>{
					act.act_goods_list.forEach(goods=>{
					  if(goods.store_count > 0){
						shopState = true
					  }
					})
				  })
				  shopArr[index].push(shopState);
				})
				
				//门店自提按钮
				this.shopStore = shopArr
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
			},
			count(){
				//获取购物车数量
				this.$store.dispatch('setCommonCartNumber');
				
				if(this.count > 0){
					this.disabled = false
				}else{
					this.disabled = true
				}
			},
			checkedGoodsId(){
				console.log(this.checkedGoodsId)
			}
		}
	}
</script>

<style>
/* .container{ padding-bottom: 300upx;} */
.header-address{ display: flex; flex-direction: row; justify-content: space-between; padding: 20upx;}
.header-address .address-box{ display: flex; flex-direction: row; }
.header-address .address-box .iconfont{ margin-right: 10upx;}

.card-goods{}
.card-goods-group{ margin-bottom: 20upx; }
.card-shop-head{ display: flex; flex-direction: row; padding: 0 20upx 20upx; justify-content: space-between;}
.card-shop-head .head-left,
.card-shop-head .head-right{ display: flex; flex-direction: row;}


.checkbox-icon .uni-icon{ display: block;}

.card-shop-box{ padding: 0 20upx; }
.card-act-goods{ display: flex; flex-direction: column; margin-bottom: 20upx;}
.card-act-goods:last-child{ margin-bottom: 0;}
.cart-act-title{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding:0 0 20upx 60upx;}
.cart-act-title .txt{ display: flex; flex-direction: row; align-items: center; color: #333333;}
.cart-act-title .txt .em-icon{ margin-right: 20upx;}
.cart-act-title .txt .act-name view{ font-size: 25upx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
.cart-act-title .more{ display: flex; flex-direction: row; color: #f92028; align-items: center;}
.cart-goods-item{ display: flex; flex-direction: row; overflow: hidden; width: 100%;}

.cart-goods-item .checkbox-con{ border-bottom: 1px solid #E5E5E5; }
.cart-goods-item:last-child .checkbox-con{ border-bottom: 0;}

.cart-goods-info{ background-color: #FFFFFF; padding: 20upx; display: flex; flex-direction: row;}
.cart-goods-info .goods-img{ width: 180upx; height: 180upx; position: relative;}
.cart-goods-info .image{ width: 180upx; height: 180upx;}
.cart-goods-info .goods-img .icon{ position: absolute; width: 80upx; height: 80upx; top: 0; left: 0;}
.cart-goods-info .goods-img .icon image{ width: 100%; height: 100%;}
.cart-goods-info .goods-img .mask{ top: 0; right: 0; bottom: 0; left: 0; position: absolute; z-index: 99; background: rgba(0,0,0,.7); }
.cart-goods-info .goods-img .mash-text{ width: 100%; color: #fff; text-align: center; z-index: 123;position: absolute; top: 0; bottom: 0; line-height: 180upx;}

.cart-goods-item-outer .cart-goods-info{ background: #fff9f8;}
.cart-goods-item-outer .checkbox-con{ padding-left: 60upx;}

.cart-goods-content{ flex: 1 1 0%; margin-left: 20upx;}
.cart-goods-content .goods-title{ font-size: 25upx; margin-bottom: 10upx;}
.cart-goods-content .goods-attr{ color: #999999; font-size: 25upx;}
.cart-goods-content .goods-info{ display: flex; flex-direction: row; align-items: center; justify-content: space-between;}
.cart-goods-content .goods-info .price{ color: #f92028;}
.cart-goods-content .goods-info .stepper_sum{ color: #999999;}
.cart-goods-content .goods-other{ width: 100%; display: flex; flex-direction: row; align-items: center; margin-top: 15upx; position: relative;}
.cart-goods-content .goods-other .em-icon{ padding: 0 3px; margin-right: 2px;}
.cart-goods-content .goods-other .act-name{ width: calc(100% - 45px); font-size: 25upx; color: #999999; }
.cart-goods-content .goods-other .uni-icon{ position: absolute; right: 0; top: 2px;}

.scroll-view-G{ display: flex; align-items: center; width: 100%; white-space: nowrap; overflow: hidden;}
.scroll-view-item{ width: 100%; height: 100%; display: inline-block; vertical-align: middle; box-sizing: border-box;}
.scroll-view-item-right{ width: 20%;margin-left: 10px; height: 100%; line-height: 100%; text-align: center; background: #f92028; color: #FFFFFF; position: relative;}
.scroll-view-item-right view{ height: 100%; display: flex; align-items: center; justify-content: center;}

.em-icon{ width: 25px; height: 20px; line-height: 20px; padding: 0 5px; border-radius: 10px; color: #FFFFFF; background: #f92028; font-size: 22upx; text-align: center;}
.em-icon.active-zeng{ background-color: #9251e5; }
.em-icon.active-zhekou{ background-color: #fc9b1f; }

.cart-submit{ width: 100%; display: flex; flex-direction: row; background-color: #FFFFFF; position: fixed; bottom: 122upx; left: 0; z-index: 99; align-items: center; border-top: 1px solid #e3e8ee;}
.cart-submit .checkall{ padding: 0 20upx; }
.cart-submit .checkall .checkbox .checkbox-icon{ margin-right: 20upx;}
.cart-submit .submit-bar-text{ text-align: right; width: 350upx; margin-right: 20upx;}
.cart-submit .submit-bar-text view{ line-height: 1.5; }
.cart-submit .submit-bar-text text{ margin-right: 10upx;}
.cart-submit .submit-bar-price{ display: inline-block; color: #f92028; font-weight: 500; font-size: 32upx;}
.cart-submit .submit-bar-sub{ font-size: 25upx; color: #999999;}

.flow-no-cart{ background: #FFFFFF; margin: 20upx; border-radius: 10upx; text-align: center; overflow: hidden;}
.flow-no-cart .gwc-bg{ display: flex; width: 180upx; height: 180upx; border-radius: 50%; background: #fcfcfc; justify-content: center; align-items: center; border: 1px solid #d9d9d9; margin: 40px auto 20px;}
.flow-no-cart .gwc-bg .iconfont{ font-size: 40px; color: #d9d9d9;}
.flow-no-cart text{ color: #333333; font-size: 30upx; }
.flow-no-cart .card-btn{ display: flex; flex-direction: row; justify-content: center; align-items: center; margin: 20px 0 40px;}
.flow-no-cart .card-btn button{ margin: 0 5px; border-color: #d9d9d9; font-size: 16px;}

.goods-detail-guess{ padding-bottom: 120upx; }

.act-item-right{ display: flex; flex-direction: row; align-content: center; padding: 10upx 20upx 10upx 0;}
.act-item-right .em-icon{ margin-right: 20upx;}
.act-item-right .act-name{ font-size: 25upx; color: #999999;}

.activity-popup .cart-goods-item{ min-height: initial;}

.goods-store{ background: #FFFFFF; padding: 10upx 20upx; text-align: right;}
.shop-store-cart{ padding: 0 20upx; display: flex; justify-content: flex-end; align-items: flex-end;}
.shop-store-cart .store-btn{ border: 1px solid #f42424; color: #f42424; line-height: normal; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 10upx 20upx; margin: 20upx 0 0 0; }
.shop-store-cart .store-btn .iconfont{ vertical-align: top; margin: -16upx 10upx 0 0;}

/* #ifdef APP-PLUS */
.app-header-top{ padding-top: 80upx;}
/* #endif */
</style>
