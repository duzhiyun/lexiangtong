<template>
	<view class="container fixed-bottom-padding">
		<scroll-view class="scrollList" scroll-y :style="{height:winHeight + 'px'}">
			<view class="goods-wrap">
				<view class="banner">
					<swiper indicator-dots="true" @change="swiperChange">
						<swiper-item v-if="goodsInfo.goods_video">
							<view class="goods-video" v-if="poster">
								<video :src="goodsInfo.goods_video" @error="videoErrorCallback" controls show-center-play-btn="true" autoplay="true"></video>
							</view>
							<view class="goods-img-first" v-else>
								<image :src="gallerylList[0].img_url" class="imgbox" @click="onPlay" v-if="gallerylList"></image>
								<view class="playicon" @click="onPlay">
									<view class="iconfont icon-play"></view>
								</view>
							</view>
						</swiper-item>
						<block v-if="gallerylList.length > 0">
							<swiper-item v-for="(item,index) in gallerylList" :key="index">
								<image :src="item.img_url" class="imgbox"></image>
							</swiper-item>
						</block>
						<block v-else>
							<swiper-item><image :src="goodsInfo.goods_img" class="imgbox"></image></swiper-item>
						</block>
					</swiper>
				</view>
				<view class="cont-box">
					<view class="price-box">
						<view class="left">
							<view class="price-weight"><uni-tag text="折扣" size="small" type="error" v-if="groupbuyDetailData.zhekou < 10"></uni-tag>{{groupbuyDetailData.formated_cur_price}}</view>
							<view class="price-row">
								<view class="tag">
									<view class="tag-icon"><text class="iconfont icon-tixingnaozhong"></text></view>
									<view class="tag-right-cont">团购</view>
								</view>
								<view class="sub"><text>市场价</text><view class="price-original">{{goodsInfo.market_price}}</view></view>
							</view>
						</view>
						<view class="right">
							<block v-if="groupbuyDetailData.is_end == 0">
								<text>距离结束还剩:</text>
								<view class="data"><uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="dateTime" v-if="dateTime"></uni-countdown></view>
							</block>
							<block v-else>
								<text class="end">活动已结束</text>
							</block>
						</view>
					</view>
					<view class="title">
						<view class="goods-name twolist-hidden"><uni-tag text="自营" size="small" type="error" v-if="groupbuyDetailData.user_id == 0"></uni-tag><text>{{goodsInfo.goods_name}}</text></view>
						<view class="goods_shipai" v-if="groupbuyDetailData.deposit">保证金:{{groupbuyDetailData.formated_deposit}}</view>
						<view class="goods_outer">
							<view class="text-left">销量{{ goodsInfo.sales_volume }}</view>
							<view class="text-center">当前库存 {{ goodsInfo.goods_number }}</view>
							<view class="text-right" >
								<text v-if="groupbuyDetailData.restrict_amount > 0">限购{{ groupbuyDetailData.restrict_amount }}</text>
								<text v-else>不限购</text>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="auctionProcess">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">阶梯价格</text>
								<view class="value"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)" @click="handleRule">
					<view class="uni-list">
						<view class="uni-list-cell" v-if="goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)">
							<view class="uni-list-cell-navigate">
								<text class="title">服务</text>
								<view class="value">
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_reality">货到付款</text>
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_return">七天无理由退换</text>
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_fast">闪速配送</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell not-cell-bot" hover-class="uni-list-cell-hover" @click="handleRegion">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">送至</text>
								<view class="value">{{ regionSplic }}</view>
							</view>
						</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="goodsInfo.goods_extend">
							<view class="uni-list-cell-navigate">
								<text class="title">运费</text>
								<view class="value uni-red">{{ freight }}</view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-collapse">
							<view class="uni-list-cell-navigate uni-navigate-bottom" hover-class="uni-list-cell-hover" @click="trigerCollapse()" :class="listshow ? 'uni-active' : ''">
								<text class="title">已选</text>
								<view class="value">{{ attr_name }}</view>
							</view>
							<view class="uni-list-cell-navigate items" :class="listshow ? 'uni-active' : ''">
								<view class="item" v-for="(item,index) in attr" :key="index">
									<text class="title">{{ item.attr_name }}</text>
									<view class="value">
										<view>
											<view class="sku-list" v-for="(option,listIndex) in item.attr_key" :key="listIndex" :class="{'active':goodsAttrInit[index] == option.goods_attr_id}" @click="attrChange(index,option.goods_attr_id)">{{ option.attr_value }}</view>
										</view>
									</view>
								</view>
								<view class="item">
									<text class="title">数量</text>
									<view class="value"><uni-number-box :value="number" :min="goodsInfo.is_minimum > 0 ? goodsInfo.minimum : 1" :max="stock" @change="bindChange"></uni-number-box></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="groupbuyDetailData.merchant_group && groupbuyDetailData.merchant_group.length > 0">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title">
							<view class="uni-list-cell-navigate">
								<text class="title">团购推荐</text>
								<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0">
									<view class="scroll-view-item" v-for="(item,index) in groupbuyDetailData.merchant_group" :key="index" @click="detailHref(item)">
										<image :src="item.goods_thumb" mode="widthFix"></image>
										<text class="name uni-ellipsis">{{ item.goods_name }}</text>
										<view class="price uni-flex">
											<view class="price-original">{{ item.shop_price }}</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
				<view class="goods-desc" id="tab2">
					<view class="uni-common-mt">
						<uni-segmented-control :current="current" :values="tabs" v-on:clickItem="onClickItem" styleType="text" activeColor="#f92028"></uni-segmented-control>
					</view>
					<view class="content">
						<view v-show="current === 0">
							<block v-if="goodsDesc">
								<rich-text :nodes="goodsDesc"></rich-text>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</view>
						<view v-show="current === 1">
							<block v-if="goodsBuyDesc">
								<rich-text :nodes="goodsBuyDesc"></rich-text>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</view>
						<view v-show="current === 2">
							<block v-if="goodsInfo.attr_parameter">
								<view class="table">
									<view class="tr">
										<view class="td">商品编号</view>
										<view class="td">{{goodsInfo.goods_sn}}</view>
									</view>
									<view class="tr colspan">
										<view class="td">主体</view>
									</view>
									<view class="tr">
										<view class="td">品牌</view>
										<view class="td">{{ goodsInfo.brand_name }}</view>
									</view>
									<view class="tr">
										<view class="td">商品重量</view>
										<view class="td">{{ goodsInfo.goods_weight }}kg</view>
									</view>
									<view class="tr colspan">
										<view class="td">产品规格</view>
									</view>
									<view class="tr" v-for="(item,index) in goodsInfo.attr_parameter" :key="index">
										<view class="td">{{item.attr_name}}</view>
										<view class="td">{{item.attr_value}}</view>
									</view>
								</view>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="btn-goods-action">
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="contact" type="default" size="5" session-from="weapp" class="item btn-cantact">
				<view class="iconfont icon-service"></view>
				<text class="txt">客服</text>
			</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS || H5 -->
			<view class="item" @click="onChat(goodsInfo.goods_id,goodsInfo.user_id)">
				<view class="iconfont icon-service"></view>
				<text class="txt">客服</text>
			</view>
			<!-- #endif -->
			<view class="item" @click="collection">
				<block v-if="is_collect == 1"><view class="iconfont icon-collection-alt"></view></block>
				<block v-else><view class="iconfont icon-collection"></view></block>
				<text class="txt">收藏</text>
			</view>
			<view class="item" v-if="groupbuyDetailData.user_id && mpChecked" @click="$outerHref('/pages/shop/shopHome/shopHome?ru_id='+groupbuyDetailData.user_id,'app')">
				<view class="iconfont icon-shop"></view>
				<text class="txt">店铺</text>
			</view>
			<view class="btn-bar">
				<view class="btn btn-btn" v-if="groupbuyDetailData.is_end == 0" @click="onCheckoutClicked()">立即团</view>
				<view class="btn btn-org" v-else>活动已结束</view>
			</view>
		</view>
		
		<!--阶梯价格-->
		<uni-popup :show="processShow" type="bottom" v-on:hidePopup="handelClose('process')">
			<view class="title">
				<view class="txt">阶梯价格</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('process')"></uni-icon>
			</view>
			<view class="groupbuy-price-list">
				<view class="li li-tit">
					<text>价格</text>
					<text>数量</text>
				</view>
				<view class="li" v-for="(item , index) in groupbuyDetailData.price_ladder" :key="index">
					<text>{{item.amount}}</text>
					<text>{{ item.formated_price }}</text>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup :show="ruleShow" type="bottom" v-on:hidePopup="handelClose('rule')">
			<view class="title">
				<view class="txt">服务说明</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('rule')"></uni-icon>
			</view>
			<view class="rule">
				<view v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_reality">货到付款：支持送货上门后再收款，支持现金、POS机刷卡等方式</view>
				<view v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_return">七天无理由退换：自实际收货日期的次日起7天内，商品完好，可进行无理由退换货</view>
				<view v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_fast">闪速配送：上午下单，下午送达</view>
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
		
		<mpvue-picker themeColor="#007AFF" ref="mpvuePicker" mode="selector" deepLength="1" :pickerValueDefault="pickerValueDefault"
		  @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		
		<dsc-common-nav>
			<navigator url="../groupbuy" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>团购首页</text>
			</navigator>
		</dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	import uniTag from "@/components/uni-tag.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				act_id:0,
				poster:false,
				seckillTime:'',
				current: 0,
				tabs: ['商品详情','团购说明','规格参数'],
				ladderFristNum:1,
				processShow:false,
				num:1,
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
				ruleShow: false
			}
		},
		components:{
			uniSegmentedControl,
			uniIcon,
			uniNumberBox,
			uniCountdown,
			uniTag,
			uniPopup,
			mpvuePicker,
			dscNotContent,
			dscCommonNav
		},
		computed:{
			...mapState({
                groupbuyDetailData: state => state.ump.groupbuyDetailData,
				shipping_fee: state => state.shopping.shipping_fee,//配送运费信息
				mpChecked: state => state.common.mpChecked,
			}),
			goodsInfo(){
				return this.groupbuyDetailData.goods
			},
			goods_id(){
				return this.goodsInfo.goods_id
			},
			gallerylList() {
			    return this.goodsInfo.gallery_list
			},
			attr(){
				return this.goodsInfo.group_buy_attr
			},
			goodsAttrInit() {
				return this.$store.state.ump.goodsAttrInit
			},
			goodsAttrOper() {
				return this.$store.state.goods.goodsAttrOper
			},
			//此商品在购物车中数量
			cart_number: {
			    get() {
			        return this.goodsInfo.cart_number
			    },
			    set(val) {
			        this.goodsInfo.cart_number = val
			    }
			},
			//已选
			attr_name: {
				get() {
					return this.attr != '' ? this.goodsInfo.attr_name + ' ' + this.num + this.goodsInfo.goods_unit : this.num + this.goodsInfo.goods_unit
				},
				set(val) {
					this.goodsInfo.attr_name = val
				}
			},
			stock() {
				let number = 0
				if(this.groupbuyDetailData.restrict_amount > 0){
					number = this.groupbuyDetailData.restrict_amount
				}else{
					number = this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
				}

				return number
			},
			dateTime(){
				let dataTime = this.groupbuyDetailData.xiangou_end_date
				if(dataTime != ''){
					return this.$formatDateTime(dataTime)
				}
			},
			number:{
				get(){
					let number = 0
					this.groupbuyDetailData.price_ladder.forEach((v,i)=>{
						if(i == 0){
							number = v.amount
							this.num = v.amount
							this.ladderFristNum = v.amount
						}
					})
					return number
				},
				set(val){
					this.num = val
				}
			},
			//数量变化是阶梯价格变化
			ladderPrice(){
				let price = this.groupbuyDetailData.formated_cur_price

				this.groupbuyDetailData.price_ladder.forEach((v)=>{
					if(this.number >= v.amount){
						price = v.formated_price
						return false
					}
				})

				return price
			},
			goodsDesc(){
				let result = this.goodsInfo.goods_desc;
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
			
				if(result){
					result = result.replace(reg, '');
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			},
			goodsBuyDesc(){
				let result = this.groupbuyDetailData.act_desc
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
				
				if(result){
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			},
			//配送地区
			regionSplic(){
				return this.regionData.regionSplic
			},
			//运费
			freight() {
			    return this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee.shipping_fee_formated : '该地区不支持配送'
			},
			goodsCollectStatue(){
			    return this.$store.state.user.goodsCollectStatue
			},
			is_collect:{
			    get(){
					return this.$store.state.ump.groupbuyDetailData.goods.is_collect
				},
				set(val){
					this.$store.state.ump.groupbuyDetailData.goods.is_collect = val
				}
			},
		},
		onShareAppMessage(res){
			return {
			  title: this.goodsInfo.goods_name,
			  path: '/pagesA/groupbuy/detail/detail?id=' + this.cat_id
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'groupbuy/detail?group_buy_id=' + this.cat_id + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		onLoad(e){
			this.act_id = e.id ? e.id : 0;
			this.loadPresaleInfo();
			this.getRegionData(); //根据缓存获取地区
		},
		methods: {
			loadPresaleInfo(){
				this.$store.dispatch('setGroupbuyDetail',{
					group_buy_id: this.act_id,
					warehouse_id: 1,
					area_id: 2
				})
			},
			//banner滚动
			swiperChange(e){
				this.poster = false
			},
			//视频自动播放
			onPlay(){
				this.poster = true
			},
			//视频播放错误
			videoErrorCallback(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			handleRegion(){
				this.getRegionData();
				this.regionShow = true
			},
			onCheckoutClicked(){
				let newAttr = []

				if (this.attr.length > 0) {
					newAttr = this.goodsAttrInit
				}
				
				let xianggou = Number(this.groupbuyDetailData.order_number) + Number(this.num);
				if(this.$isLogin()){
					if(this.groupbuyDetailData.restrict_amount > 0){
						if(xianggou <= this.groupbuyDetailData.restrict_amount){ //判断是否超出限购
							this.$store.dispatch('setGroupBuy',{
								group_buy_id:this.act_id,
								number:this.num,
								spec:newAttr,
							}).then(({ data })=>{
								if(data.error == 1){
									uni.showToast({
										title:data.message,
										icon:'none'
									})
								}else{
									uni.navigateTo({
										url:'/pages/checkout/checkout?rec_type='+ data.flow_type + '&type_id=' + data.extension_id
									})
								}
							})
						}else{
							uni.showToast({
								title:'你已购买' + this.groupbuyDetailData.order_number + '件,累积购买不能超过限购数',
								icon:'none'
							})
						}
					}else{
						this.$store.dispatch('setGroupBuy',{
							group_buy_id:this.act_id,
							number:this.num,
							spec:newAttr,
						}).then(({ data })=>{
							if(data.error == 1){
								uni.showToast({
									title:data.message,
									icon:'none'
								})
							}else{
								uni.navigateTo({
									url:'/pages/checkout/checkout?rec_type='+ data.flow_type + '&type_id=' + data.extension_id
								})
							}
						})
					}
				}else{
					uni.showModal({
						content:'请登录会员',
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
			changeAttr() {
			    this.$store.dispatch('setGoodsAttrOper', {
			        goods_id: this.goods_id,
			        num: this.num,
			        attr_id: this.goodsAttrInit
			    })
			},
			trigerCollapse(){
				this.listshow = this.listshow ? false : true
			},
			//属性切换
			attrChange(index,id){
				this.goodsAttrInit.splice(index,1,id)
			},
			bindChange(e){
				this.num = e
			},
			//运费
			shippingFee(val) {
			    this.$store.dispatch('setShippingFee', {
			        goods_id: this.goods_id,
			        position: JSON.stringify(val)
			    })
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
			// 地区选框当前项弹出时默认选中
			pickDefaultIndex(level){
				let id = 0;
				if(level == 1){
					id = this.regionData.province.id
				}else if(level == 2){
					id = this.regionData.city.id
				}else if(level == 3){
					id = this.regionData.district.id
				}else if(level == 4){
					id = this.regionData.street.id
				}
				const array = Array.from(this.pickerValueArray);
				let flag = false;
				for(let i = 0; i < array.length; i++){
					if(array[i].id == id){
						this.pickerValueDefault = [i];
						flag = true
						break;
					}
				}
				if(!flag) this.pickerValueDefault = [0];
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
				}else if(!this.regionData.street.id > 0){
					uni.showToast({title:"街道不能为空", icon:"none"});
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
							this.regionData.street.name = data.street ? data.street.name : ''
							
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
			//关闭Popup
			handelClose(val){
				if(val == 'process'){
			        this.processShow = false
			    }else if(val == 'region'){
					this.regionShow = false
				}else if(val == 'rule'){
					this.ruleShow = false
				}
			},
			auctionProcess() {
				this.processShow = !this.processShow
			},
			detailHref(item){
				uni.navigateTo({
					url:'/pagesA/groupbuy/detail/detail?id=' + item.act_id
				})
			},
			//收藏
			collection(){
				if(this.$isLogin()){
					this.$store.dispatch('setCollectGoods', {
						goods_id: this.goodsInfo.goods_id,
						status: this.is_collect
					})
				}else{
					uni.showModal({
						content:'请登录后收藏该商品',
						success:(res)=>{
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/login/login'
								})
							}
						}
					})
				}
			},
			handleRule(){
				this.ruleShow = true
			},
		},
		watch:{
			goodsInfo(){
				this.dscLoading = false
				
				if(this.goodsInfo.is_minimum > 0){
					this.num = this.goodsInfo.minimum
				}
			},
			regionSplic(){
				let shipping_region = {
			        province_id: this.regionData.province.id,
			        city_id: this.regionData.city.id,
			        district_id: this.regionData.district.id,
			        street_id: this.regionData.street.id
			    }
			
			    //运费
			    this.shippingFee(shipping_region)
			},
			goodsAttrInit(){
				this.changeAttr()
				this.storeBtn = true
			},
			goodsAttrOper() {
			    if (this.goodsAttrOper) {
			        this.attr_name = this.goodsAttrOper.attr_name
			    }
			},
			goodsCollectStatue() {
			    this.goodsCollectStatue.forEach((v) => {
			        if (v.id == this.goodsInfo.goods_id) {
			            this.is_collect = v.status
			        }
			    })
			},
		}
	}
</script>

<style scoped>
.cont-box .title .goods_shipai{ color: #f92028;}

.price-box{ display: flex; flex-direction: row; justify-content: center;}
.price-box .left{ flex: 1; padding: 20upx; background: linear-gradient(90deg,#f22c8f,#f23256); color: #FFFFFF;}
.price-box .left view{ line-height: 1.2;}
.price-box .left .price-weight{ font-size: 36upx; font-weight: 700;}
.price-box .left .price-row{ display: flex; flex-direction: row; justify-content: flex-start;}
.price-box .left .price-row .tag{ display: flex; flex-direction: row; overflow: hidden;}
.price-box .left .price-row .tag-icon{ background: #FFFFFF; width: 50upx; border-radius: 20upx 0 0 20upx; display: flex; flex-direction: row; justify-content: center; align-items: center;}
.price-box .left .price-row .tag-icon .iconfont{ color: #f23157; font-size: 24upx;}
.price-box .left .price-row .tag-right-cont{ border: 1px solid #FFFFFF; padding: 0 20upx;}
.price-box .left .price-row .sub{ display: flex; flex-direction: row; margin-left: 10upx; font-size: 25upx; align-items: center;}
.price-box .left .price-row .sub .price-original{ font-size: 25upx; margin-left: 10upx;text-decoration:line-through;}
.price-box .right{ display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20upx; background: #ffeae9;}
.price-box .right text{ color: #f23157;}

.goods_outer{ padding: 0; margin-top: 10upx;}

.uni-list-cell-navigate{ justify-content: flex-start; } 
.uni-list-cell-navigate .title{ min-width: 100upx; color: #999999; margin-right: 15upx;}
.uni-list-cell .iconfont{ color: #f92028; margin-right: 10upx;}
.uni-list-cell-title .uni-list-cell-navigate{ flex-direction: column; }
.uni-list-cell-title .uni-list-cell-navigate.uni-navigate-right:after{ top: 35%;}
.uni-list-cell-title .uni-list-cell-navigate .title{ width: 100%; color: #333333; font-weight: 600; font-size: 32upx; margin-bottom: 20upx;}
.uni-list-cell-title .uni-list-cell-navigate .value{ display: flex; align-items: center; color: #999999;}

.groupbuy-price-list{ padding: 20upx 0; border-top: 2upx solid #F4F4F4;}
.groupbuy-price-list .li{ display: flex; flex-direction: row;}
.groupbuy-price-list .li text{ padding: 10upx 20upx; width: 50%; box-sizing: border-box; flex: 1; display: flex; justify-content: center; align-items: center;}
.groupbuy-price-list .li.li-tit text{ color: #f92028;}
</style>
