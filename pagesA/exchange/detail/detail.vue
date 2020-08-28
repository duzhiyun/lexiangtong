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
					<view class="goods-price">
						<text class="price-original" v-if="goodsInfo.exchange_integral">{{ goodsInfo.exchange_integral }}</text>
						<text class="price-label">积分</text>
						<text class="price-favour" v-if="goodsInfo.market_price">市场价:{{ goodsInfo.market_price }}</text>
					</view>
					<view class="title">
						<view class="goods-name twolist-hidden"><uni-tag :text="goodsInfo.rz_shopName" size="small" type="error" v-if="goodsInfo.rz_shopName"></uni-tag><text>{{goodsInfo.goods_name}}</text></view>
						<view class="goods_shipai" v-if="goodsInfo.goods_shipai">{{goodsInfo.goods_shipai}}</view>
						<view class="goods_outer">
							<view class="text-left" v-if="goodsInfo.sales_volume">销量 {{ goodsInfo.sales_volume }}</view>
							<view class="text-right" v-if="goodsInfo.goods_number">当前库存 {{ goodsInfo.goods_number }}</view>
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
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-collapse">
							<view class="uni-list-cell-navigate" :class="[listshow ? 'uni-active' : '',attr.length > 0 ? 'uni-navigate-bottom' : '']" hover-class="uni-list-cell-hover" @click="trigerCollapse()">
								<text class="title">已选</text>
								<view class="value">{{ attr_name }}</view>
							</view>
							<view class="uni-list-cell-navigate items" :class="listshow ? 'uni-active' : ''">
								<block v-if="listshow">
									<view class="item" v-for="(item,index) in attr" :key="index">
										<text class="title">{{ item.attr_name }}</text>
										<view class="value">
											<view>
												<view class="sku-list" v-for="(option,listIndex) in item.attr_key" :key="listIndex" :class="{'active':goodsAttrInit[index] == option.goods_attr_id}" @click="attrChange(index,option.goods_attr_id)">{{ option.attr_value }}</view>
											</view>
										</view>
									</view>
								</block>
								<view class="item">
									<text class="title">数量</text>
									<view class="value"><uni-number-box :value="number" :min="1" :max="stock" @change="bindChange"></uni-number-box></view>
								</view>
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
			<view class="btn-bar">
				<view class="btn btn-red" @click="onExchange">立即兑换</view>
			</view>
		</view>
		
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
		
		<dsc-common-nav></dsc-common-nav>
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
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				goods_id:0,
				poster:false,
				current: 0,
				tabs: ['商品详情', '规格参数'],
				num:1,
				ruleShow:false
			}
		},
		components:{
			uniSegmentedControl,
			uniIcon,
			uniNumberBox,
			uniCountdown,
			uniTag,
			uniPopup,
			dscNotContent,
			dscCommonNav
		},
		computed:{
			...mapState({
                goodsInfo: state => state.ump.exchangeDetailData,
			}),
			gallerylList() {
			    return this.goodsInfo.gallery_list
			},
			attr() {
				return this.$store.state.ump.exchangeDetailData.exchange_goods_attr
			},
			goodsAttrInit() {
				return this.$store.state.ump.goodsAttrInit
			},
			goodsAttrOper() {
				return this.$store.state.goods.goodsAttrOper
			},
			//已选
			attr_name: {
				get() {
					return this.attr != '' ? this.$store.state.ump.exchangeDetailData.attr_name : this.num
				},
				set(val) {
					this.$store.state.ump.exchangeDetailData.attr_name = val
				}
			},
			number:{
				get(){
					return this.goodsInfo.is_minimum > 0 ? this.goodsInfo.minimum : 1
				},
				set(val){
					this.num = val
				},
			},
			stock() {
				return this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
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
			goodsCollectStatue(){
                return this.$store.state.user.goodsCollectStatue
            },
            is_collect:{
                get(){
					return this.$store.state.ump.exchangeDetailData.is_collect
				},
				set(val){
					this.$store.state.ump.exchangeDetailData.is_collect = val
				}
            },
		},
		onShareAppMessage(res){
			return {
			  title: this.goodsInfo.goods_name,
			  path: '/pagesA/exchange/detail/detail?id=' + this.goods_id
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'seckill/detail?id=' + this.goods_id + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		onLoad(e){
			this.goods_id = e.id ? e.id : 0;
			this.loadGoodsInfo();
		},
		methods: {
			loadGoodsInfo(){
				this.$store.dispatch('setExchangeDetail',{
					id: this.goods_id,
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
			onExchange(){
				let newAttr = []
				this.addCartClass = false

				if (this.attr.length > 0) {
					newAttr = this.goodsAttrInit
				}

				this.$store.dispatch('setExchangeBuy',{
					goods_id: this.goods_id,
					num: this.num,
					attr: newAttr
				}).then(({data})=>{
					if(data.error == 0){
						uni.navigateTo({
							url:'/pages/checkout/checkout?rec_type=4'
						})
					}else{
						uni.showToast({
							icon:'none',
							title:data.msg
						});
					}
				})
			},
			bindChange(e){
				this.num = e
			},
			changeAttr() {
			    this.$store.dispatch('setGoodsAttrOper', {
			        goods_id: this.goods_id,
			        num: this.num,
			        attr_id: this.goodsAttrInit
			    })
			},
			//关闭Popup
			handelClose(val){
				if(val == 'rule'){
					this.ruleShow = false
				}
			},
			handleRule(){
				this.ruleShow = true
			},
		},
		watch:{
			goodsCollectStatue() {
			    this.goodsCollectStatue.forEach((v) => {
			        if (v.id == this.goodsInfo.goods_id) {
			            this.is_collect = v.status
			        }
			    })
			},
			goodsAttrInit(){
				this.changeAttr();
			},
			goodsAttrOper() {
			    if (this.goodsAttrOper) {
			        this.attr_name = this.goodsAttrOper.attr_name
			    }
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

.price-favour{ margin-top: 10upx;}

.goods_outer{ padding: 0; margin-top: 10upx;}

.uni-list-cell-navigate{ justify-content: flex-start; } 
.uni-list-cell-navigate .title{ min-width: 100upx; color: #999999; margin-right: 15upx;}
.uni-list-cell .iconfont{ color: #f92028; margin-right: 10upx;}
.uni-list-cell-title .uni-list-cell-navigate{ flex-direction: column; }
.uni-list-cell-title .uni-list-cell-navigate.uni-navigate-right:after{ top: 35%;}
.uni-list-cell-title .uni-list-cell-navigate .title{ width: 100%; color: #333333; font-weight: 600; font-size: 32upx; margin-bottom: 20upx;}
.uni-list-cell-title .uni-list-cell-navigate .value{ display: flex; align-items: center; color: #999999;}
</style>
