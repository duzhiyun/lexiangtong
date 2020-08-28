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
							<view class="price-weight">{{goodsInfo.sec_price_format}}</view>
							<view class="price-row">
								<view class="tag">
									<view class="tag-icon"><text class="iconfont icon-lightning"></text></view>
									<view class="tag-right-cont">秒杀</view>
								</view>
								<view class="sub"><text>市场价</text><view class="price-original">¥{{goodsInfo.market_price}}</view></view>
							</view>
						</view>
						<view class="right">
							<block v-if="goodsInfo.status">
								<text>距离结束还剩:</text>
							</block>
							<block v-else>
								<text>即将开始还剩:</text>
							</block>
							<view class="data">
								<block v-if="isTimeEnd">
									<uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="dateTime" v-if="dateTime"></uni-countdown>
								</block>
								<block v-else>
									<text class="end">活动结束</text>
								</block>
							</view>
						</view>
					</view>
					<view class="title">
						<view class="goods-name twolist-hidden"><uni-tag :text="goodsInfo.rz_shopName" size="small" type="error" v-if="goodsInfo.rz_shopName"></uni-tag><text>{{goodsInfo.goods_name}}</text></view>
						<view class="goods_shipai" v-if="goodsInfo.goods_shipai">{{goodsInfo.goods_shipai}}</view>
						<view class="goods_outer">
							<view class="text-left">销量 {{ goodsInfo.sales_volume }}</view>
							<view class="text-center">当前库存 {{ goodsInfo.sec_num }}</view>
							<view class="text-right" v-if="goodsInfo.sec_limit">限购 {{ goodsInfo.sec_limit }}</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-navigate">
							<text class="title">数量</text>
							<view class="value"><uni-number-box :value="num" :min="1" :max="goodsInfo.sec_limit" @change="bindChange"></uni-number-box></view>
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
				<view class="btn btn-red" v-if="goodsInfo.status && goodsInfo.is_end === 0" @click="seckillCheckout()">立即抢购</view>
				<view class="btn btn-org" v-if="!goodsInfo.status && goodsInfo.is_end === 0">即将开始</view>
				<view class="btn btn-org" v-if="!goodsInfo.status && goodsInfo.is_end !== 0">已结束</view>
			</view>
		</view>
		
		<dsc-common-nav>
			<navigator url="../seckill" class="nav-item" slot="right">
				<view class="iconfont icon-team"></view>
				<text>秒杀首页</text>
			</navigator>
		</dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	import uniTag from "@/components/uni-tag.vue";
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				seckill_id:0,
				tomorrow:0,
				poster:false,
				seckillTime:'',
				current: 0,
				tabs: ['商品详情', '规格参数'],
				num:1,
			}
		},
		components:{
			uniSegmentedControl,
			uniIcon,
			uniNumberBox,
			uniCountdown,
			uniTag,
			dscNotContent,
			dscCommonNav
		},
		computed:{
			...mapState({
                goodsInfo: state => state.ump.seckillDetailData,
			}),
			gallerylList() {
			    return this.goodsInfo.pictures
			},
			isTimeEnd(){
				return this.goodsInfo.formated_end_date > this.goodsInfo.current_time ? true : false
			},
			dateTime(){
				let dataTime = this.goodsInfo.formated_end_date
				if(dataTime != ''){
					return this.$formatDateTime(dataTime)
				}
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
                    return this.$store.state.ump.seckillDetailData.is_collect
                },
                set(val){
                    this.$store.state.ump.seckillDetailData.is_collect = val
                }
            },
		},
		onShareAppMessage(res){
			return {
			  title: this.goodsInfo.goods_name,
			  path: '/pagesA/seckill/detail/detail?id=' + this.seckill_id + '&tomorrow=' + this.tomorrow
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'seckill/detail?seckill_id=' + this.seckill_id + '&tomorrow=' + this.tomorrow + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		onLoad(e){
			this.seckill_id = e.id;
			this.tomorrow = e.tomorrow ? e.tomorrow : 0;
			this.loadGoodsInfo();
		},
		methods: {
			loadGoodsInfo(){
				this.$store.dispatch('setSeckillDetail',{
					seckill_id: this.seckill_id,
					tomorrow: this.tomorrow
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
			seckillCheckout(){
				let cur_number = Number(this.goodsInfo.order_number) + Number(this.num)

                if(this.goodsInfo.sec_limit === 0 || (this.goodsInfo.sec_limit >= cur_number)){
                    this.$store.dispatch('setSeckillBuy',{
                        sec_goods_id: this.seckill_id,
                        number:this.num,
                        warehouse_id:0,
                        area_id:0,
                        area_city:0,
                        goods_spec:0
                    }).then(res => {
						let data = res.data					
                        if(data){
							uni.navigateTo({
								url:'/pages/checkout/checkout?rec_type=' + data.flow_type + '&type_id=' + data.extension_id
							})
                        }
                    })
                }else{
					let title = ''
					if(this.goodsInfo.order_number > 0){
						title = "你已购买"+ this.goodsInfo.order_number +"件,累积购买不能超过限购数";
					}else{
						title = "购买商品不能超过限购数";
					}
					
					uni.showToast({
						title:title,
						icon:'none',
						duration:1000
					})
                }
			},
			bindChange(e){
				this.num = e
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
</style>
