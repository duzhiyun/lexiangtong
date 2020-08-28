<template>
	<view class="container fixed-bottom-padding">
		<scroll-view class="scrollList" scroll-y>
			<view class="goods-wrap">
				<view class="banner">
					<swiper indicator-dots="true" @change="swiperChange">
						<swiper-item v-if="goodsInfo.goods_video">
							<view class="goods-video" v-if="poster">
								<video :src="goodsInfo.goods_video" @error="videoErrorCallback" controls show-center-play-btn="true" autoplay="true"></video>
							</view>
							<view class="goods-img-first" v-else>
								<image :src="gallerylList[0]" class="imgbox" @click="onPlay" v-if="gallerylList"></image>
								<view class="playicon" @click="onPlay">
									<view class="iconfont icon-play"></view>
								</view>
							</view>
						</swiper-item>
						<block v-if="gallerylList.length > 0">
							<swiper-item v-for="(item,index) in gallerylList" :key="index">
								<image :src="item" class="imgbox"></image>
							</swiper-item>
						</block>
						<block v-else>
							<swiper-item><image :src="goodsInfo.goods_img" class="imgbox"></image></swiper-item>
						</block>
					</swiper>
				</view>
				<view class="cont-box">
					<view class="title">
						<view class="goods-price">
							<text class="price-original">{{ goodsInfo.team_price }}</text>
							<text class="price-favour">{{ goodsInfo.shop_price }}</text>
						</view>
						<view class="goods-name twolist-hidden"><uni-tag text="自营" size="small" type="error"></uni-tag><text>{{goodsInfo.goods_name}}</text></view>
						<view class="goods_outer">
							<view class="text-left">销量 {{ goodsInfo.sales_volume }}</view>
							<view class="text-right">当前库存 {{ goodsInfo.goods_number }}</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)">
					<view class="uni-list">
						<view class="uni-list-cell" v-if="goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)">
							<view class="uni-list-cell-navigate">
								<text class="title">服务</text>
								<view class="value">
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_reality">正品保证</text>
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_return">七天无理由退换</text>
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_fast">闪速配送</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title" hover-class="uni-list-cell-hover" @click="handleRule">
							<view class="uni-list-cell-navigate">
								<text class="title">拼团规则</text>
								<view class="steps">
									<view class="item" v-for="(item,index) in steps" :key="index">
										<view class="num">{{index+1}}</view>
										<view class="tit">{{item.title}}</view>
										<view class="n-list-xian"></view>
									</view>
								</view>
								<uni-icon type="arrowdown" size="24" color="#777777"></uni-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="team-log-box" v-if="teamDetailData.team_log && teamDetailData.team_log.length > 0">
					<view class="title">不想开团，和以下小伙伴一起拼了</view>
					<view class="team-list-box" v-for="(item,index) in teamDetailData.team_log" :key="index">
						<view class="left">
							<image :src="item.user_picture" v-if="item.user_picture" mode="widthFix"></image>
							<image src="../../../static/user_default.png" mode="widthFix" v-else></image>
						</view>
						<view class="con">
							<view class="header">
								<view class="tit">{{ item.user_name }}</view>
								<view class="txt">还差<text class="uni-red">{{item.surplus}}</text>人成团</view>
							</view>
							<view class="time">
								<block v-if="dateTime[index]">
									剩余<uni-countdown notStyle="true" :timer="dateTime[index]"></uni-countdown>结束
								</block>
								<block v-else>
									<text class="end">活动结束</text>
								</block>
							</view>
						</view>
						<view class="right" @click="onTeamCheckout(item.team_id)">去参团</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="teamDetailData.new_goods && teamDetailData.new_goods.length > 0">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title">
							<view class="uni-list-cell-navigate">
								<text class="title">团购推荐</text>
								<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0">
									<view class="scroll-view-item" v-for="(item,index) in teamDetailData.new_goods" :key="index">
										<image :src="item.goods_thumb" mode="widthFix"></image>
										<text class="name uni-ellipsis">{{ item.goods_name }}</text>
										<view class="price uni-flex">
											<view class="price-original">{{ item.team_price }}</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="goods-desc">
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
		</scroll-view>
		<view class="btn-goods-action">
			<view class="item" @click="collection">
				<block v-if="is_collect == 1"><view class="iconfont icon-collection-alt"></view></block>
				<block v-else><view class="iconfont icon-collection"></view></block>
				<text class="txt">收藏</text>
			</view>
			<view class="item pr" @click="onCart">
				<view class="iconfont icon-cart"><text class="icon">{{ cart_number }}</text></view>
				<text class="txt">购物车</text>
				<view class="add_num" :class="{'show':addCartClass == true}">+{{ num }}</view>
			</view>
			<view class="btn-bar">
				<block v-if="team_id > 0">
					<view class="btn btn-org" @click="onceTeam"><view>立即开团</view></view>
					<view class="btn btn-red" @click="onTeamSku('team')"><view>去参团</view></view>
				</block>
				<block v-else>
					<view class="btn btn-org" @click="onTeamSku('ordinary')">
						<text class="mt10">单独购买</text>
						<text>{{goodsInfo.shop_price}}</text>
					</view>
					<view class="btn btn-red" @click="onTeamSku('team')">
						<text class="mt10">{{goodsInfo.team_num}}人团</text>
						<text>{{goodsInfo.team_price}}</text>
					</view>
				</block>
			</view>
		</view>
		
		<dsc-common-nav>
			<navigator url="../team" class="nav-item" slot="right">
				<view class="iconfont icon-team"></view>
				<text>拼团频道</text>
			</navigator>
		</dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
		
		<uni-popup :show="ruleShow" type="bottom" v-on:hidePopup="handleClose('rule')">
			<view class="title">
				<view class="txt">拼团规则</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handleClose('rule')"></uni-icon>
			</view>
			<view class="rule">
				<view>1.开团：在商城内选择喜欢的商品，点击“去开团”，付款成功后即为开团成功；</view>
				<view>2.参团：进入朋友分享的页面，点击“立即参团”，付款后即为参团成功，若多人同时支付，按先支付成功的用户获得参团资格，参团订单未支付不计入参团数量，团过期未支付订单失效，但参团人信息也会显示在团里面；</view>
				<view>3.成团：在开团或参团之后,可以点击“分享出去”，在有效时间凑齐成团人数即拼团成功；</view>
				<view>4.组团失败：在有效时间内未凑齐人数，即为组团失败，此时商城会将原款分别退回；</view>
			</view>
		</uni-popup>
		
		<uni-popup :show="showBase" type="bottom" v-on:hidePopup="handleClose('base')">
			<view class="attr-goods-box">
				<view class="attr-goods-header">
					<view class="attr-img">
						<image :src="goodsAttrOper.attr_img" mode="widthFix" v-if="goodsAttrOper.attr_img"></image>
						<image :src="goodsInfo.goods_thumb" mode="widthFix"></image>
					</view>
					<view class="attr-info">
						<block v-if="attr">
							<view class="attr-price" v-if="purchaseType == 'team'">{{goodsAttrOper.goods_price_formated}}</view>
							<view class="attr-price" v-else>{{goodsAttrOper.spec_price_formated}}</view>
							<view class="attr-stock">库存：<block v-if="goodsAttrOper.stock !== 'undefined'">{{ goodsAttrOper.stock }}</block><text class="uni-red" v-if="purchaseType == 'team'">(限购:{{goodsInfo.astrict_num}})</text></view>
							<view class="attr-other">已选：<block v-if="goodsAttrOper.attr_name">{{ goodsAttrOper.attr_name }}</block> {{ num }}件</view>
						</block>
						<block v-else>
							<view class="attr-name twolist-hidden">{{goodsInfo.goods_name}}</view>
							<view class="attr-price" v-if="purchaseType == 'team'">{{goodsAttrOper.goods_price_formated}}</view>
							<view class="attr-price" v-else>{{goodsAttrOper.spec_price_formated}}</view>
							<view class="attr-stock">库存：<block v-if="goodsAttrOper.stock !== 'undefined'">{{ goodsAttrOper.stock }}</block><text class="uni-red" v-if="purchaseType == 'team'">(限购:{{goodsInfo.astrict_num}})</text></view>
						</block>
					</view>
				</view>
				<view class="attr-goods-content">
					<view class="sku-item" v-for="(item,index) in attr" :key="index">
						<text class="sku-tit">{{ item.attr_name }}</text>
						<view class="sku-list"><text v-for="(option,listIndex) in item.attr_key" :key="listIndex" :class="{'active':goodsAttrInit[index] == option.goods_attr_id}" @click="attrChange(index,option.goods_attr_id)">{{ option.attr_value }}</text></view>
					</view>
				</view>
				<view class="attr-goods-number">
					<text class="tit">数量</text>
					<view class="stepper"><uni-number-box :value="num" :min="1" :max="goodsInfo.astrict_num" @change="bindChange"></uni-number-box></view>
				</view>
				<view class="btn-bar">
					<block v-if="purchaseType == 'team'">
						<view class="btn btn-red" @click="onTeamClicked" v-if="stock">确定</view>
						<view class="btn btn-disabled" v-else>库存不足</view>
					</block>
					<block v-else>
						<block v-if="stock">
							<view class="btn btn-org" @click="onBuyClicked">立即购买</view>
							<view class="btn btn-red" @click="onAddCartClicked(0)">加入购物车</view>
						</block>
						<block v-else>
							<view class="btn btn-disabled">库存不足</view>
						</block>
					</block>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import uniTag from "@/components/uni-tag.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				winHeight: 0,
				tabs: ['商品详情', '规格参数'],
				poster:false,
				goods_id:'',
				team_id:'',
				parent_id:'',
				onceTeamType:false,
				steps:[
					{title:'选择商品'},
					{title:'开团/参团'},
					{title:'邀请好友'},
					{title:'人满成团'}
				],
				showBase:false,
				ruleShow:false,
				current: 0,
				num:1,
				addCartClass:false,
				purchaseType:'',
				dscLoading:true
			}
		},
		components: {
			uniSegmentedControl,
			uniIcon,
			uniTag,
			uniPopup,
			uniNumberBox,
			uniCountdown,
			dscNotContent,
			dscCommonNav,
		},
		onShareAppMessage(res){
			return {
			  title: this.goodsInfo.goods_name,
			  path: '/pagesA/team/detail/detail?goods_id='+this.goods_id + '&team_id='+this.team_id
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'team/detail?goods_id=' + this.goods_id + '&team_id=' + this.team_id + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		computed: {
			...mapState({
				teamDetailData: state => state.team.teamDetailData
			}),
			goodsInfo(){
				return this.teamDetailData.goods_info
			},
			gallerylList(){
				return this.teamDetailData.goods_img
			},
			attr(){
				return this.teamDetailData.goods_properties    //商品属性 
			},
			goodsAttrInit(){
				return this.$store.state.team.goodsAttrInit    //商品属性id 
			},
			goodsAttrOper(){
				return this.$store.state.team.goodsAttrOper
			},
			stock() {
				return this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
			},
			dateTime(){
				let arr = []
				if(this.teamDetailData.team_log){
					this.teamDetailData.team_log.forEach(res=>{
						arr.push(this.$formatDateTime(res.end_time));
					})
				}
				return arr;
			},
			goodsDesc(){
				let result = ''
				if(this.goodsInfo.desc_mobile != ''){
					result = this.goodsInfo.desc_mobile
				}else{
					result = this.goodsInfo.goods_desc;
				}
				
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
				const regex3 = new RegExp('<div class="tools"', 'gi');
				
				if(result){
					result = result.replace(reg, '');
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex3, '<div class="tools" style="display:none;"');
				}
				return result
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
			goodsCollectStatue() {
			    return this.$store.state.user.goodsCollectStatue
			},
			is_collect: {
			    get() {
			        return this.goodsInfo.is_collect
			    },
			    set(val) {
			        this.goodsInfo.is_collect = val
			    }
			},
        },
		methods: {
			loadGoodsInfo(){
				this.$store.dispatch('setTeamDetail',{
					goods_id: this.goods_id,
					team_id: this.team_id
				})
			},
			onTeamSku(type){
				this.showBase = true;
				this.purchaseType = type;
				this.changeAttr();
			},
			onceTeam(){
				this.showBase = true;
				this.onceTeamType = true;
				this.changeAttr();
			},
			changeAttr(){
				this.$store.dispatch('setTeamProperty',{
					goods_id: this.goods_id,
					num: this.num,
					attr_id:this.goodsAttrInit,
					warehouse_id: 0,
					area_id: 0
				})
			},
			//属性切换
			attrChange(index,id){
				this.goodsAttrInit.splice(index,1,id)
			},
			onAddCartClicked(type){
				this.addCartClass = false
				let newAttr = []

				if (this.attr.length > 0) {
					newAttr = this.goodsAttrInit
				}
				
				this.$store.dispatch('setAddCart',{
					goods_id:this.goods_id,
					num:this.num,
					spec:newAttr,
					warehouse_id:'0',
					area_id:'0',
					parent_id:'0',
					rec_type:type
				}).then(res => {
					if (res.data == true) {
					    if (type == 10) {
							uni.navigateTo({
								url:'/pages/checkout/checkout?rec_type='+type
							});
					    } else {
					        this.addCartClass = true
							
							uni.showToast({
								title:'已加入购物车',
								icon:'success',
								duration:1000
							})
							
					        this.cart_number = parseInt(this.cart_number) + this.num
					    }
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none',
							duration:1000
						})
					}
				})
			},
			onBuyClicked(){
				//立即购买
				this.onAddCartClicked(10)
			},
			//确定购买
			onTeamClicked() {
				uni.showLoading({ title:'去结算', mask:true })
				let newAttr = []
				
				if (this.attr.length > 0) {
					newAttr = this.goodsAttrInit
				}
				
				let team_id = this.onceTeamType === false ? this.team_id : 0
				this.$store.dispatch('setTeamBuy',{
					goods_id:this.goods_id,
					team_id:team_id,
					t_id:this.goodsInfo.id,
					num:this.num,
					attr_id:newAttr
				}).then(res =>{
					if(res.status == 'success'){
						let data = res.data
						if(data.error == 0){
							uni.navigateTo({
								url:'/pages/checkout/checkout?rec_type=' + data.rec_type + '&type_id=' + data.t_id + '&team_id=' + data.team_id,
								complete: () => {
									uni.hideLoading();
								}
							});
						}else{
							uni.hideLoading();
							uni.showToast({
								title:data.msg,
								icon:'none',
							})
						}
					}
				})
			},
			onTeamCheckout(id){
			  this.team_id = id
			  this.onTeamSku('team')
			},
			bindChange(e){
				this.num = e
			},
			onCart(){
				uni.reLaunch({
					url: '/pages/cart/cart'
				});
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
			handleRule(){
				this.ruleShow = true
			},
			//关闭Popup
			handleClose(val){
				if(val == 'rule'){
			        this.ruleShow = false
			    }else if(val == 'base'){
					this.showBase = false
				}
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
						goods_id: this.goods_id,
						status: this.is_collect
					})
				}else{
					uni.showModal({
						content:'请登录后收藏该商品',
						success:(res)=>{
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/user/login/login'
								})
							}
						}
					})
				}
			},
		},
		onLoad(e){
			this.goods_id = e.goods_id;
			this.team_id = e.team_id ? e.team_id : 0;
			this.parent_id = e.parent_id ? e.parent_id : 0;
			
			this.loadGoodsInfo();
			
			let difHeight = 105
			if(uni.getSystemInfoSync().model == 'Redmi Note 7'){
				difHeight = 26
			}
			this.winHeight = uni.getSystemInfoSync().windowHeight - difHeight;
		},
		onShow(){
			if(this.parent_id > 0){
				uni.setStorage({
					key:'parent_id',
					data:this.parent_id
				})
			}
		},
		watch:{
			teamDetailData(){
				this.dscLoading = false
				
				if(this.teamDetailData.error == 1){
					uni.showModal({
						content: this.teamDetailData.msg,
						showCancel: false,
						success:function(res){
							if (res.confirm) {
								uni.reLaunch({
									url:'../team'
								})
							}
						}
					});
				}
			},
			goodsCollectStatue() {
			    this.goodsCollectStatue.forEach((v) => {
			        if (v.id == this.goods_id) {
			            this.is_collect = v.status
			        }
			    })
			},
		}
	}
</script>

<style scoped>
.cont-box .title .goods-price{ padding: 0;}

.goods_outer{ padding: 0; margin-top: 10upx;}

.uni-list-cell-navigate{ justify-content: flex-start; }
.uni-list-cell-navigate .title{ min-width: 100upx; color: #999999; margin-right: 15upx;}
.uni-list-cell .iconfont{ color: #f92028; margin-right: 10upx;}
.uni-list-cell-title .uni-list-cell-navigate{ flex-direction: column; }
.uni-list-cell-title .uni-list-cell-navigate.uni-navigate-right:after{ top: 35%;}
.uni-list-cell-title .uni-list-cell-navigate .title{ width: 100%; color: #333333; font-size: 30upx; margin-bottom: 20upx;}
.uni-list-cell-title .uni-list-cell-navigate .value{ display: flex; align-items: center; color: #999999;}

.steps{ display: flex; flex-direction: row; width: 100%; justify-content: center; align-items: center;}
.steps .item{ position: relative; width: 25%; color: #777; text-align: center; margin: 20upx 0;}
.steps .item .num{ position: relative; width: 40upx; height: 40upx; line-height: 40upx; font-size: 24upx; border-radius: 50%; border:1px solid #e7e8ef; margin: 0 auto; z-index: 2; background: #FFFFFF;}
.steps .item .tit{ font-size: 24upx; margin-top: 20upx;}
.steps .item .n-list-xian{ position: absolute; border-top: 1px solid #e7e8ef; height: 1px; z-index: 1; width: 100%; top: 22%;}
.steps .item:first-child .n-list-xian{ left: 50%; width: 60%; }
.steps .item:last-child .n-list-xian{ right: 50%; width: 60%; }

.rule{ padding: 20upx; border-top: 1px solid #e7e8ef; }
.rule view{ text-align: left; font-size: 25upx; color: #999;}

.scroll-view { white-space: nowrap;width: 100%; }
.scroll-view-product{ overflow: hidden; }
.scroll-view-product .scroll-view-item{ width:238upx; line-height: 1.8; padding-bottom: 15upx; display: inline-block; margin-left: -1px; background-color: #FFFFFF;}
.scroll-view-product .scroll-view-item:first-child{ margin-left: 0;}
.scroll-view-product .scroll-view-item image{ width: 238upx; height: 238upx;}
.scroll-view-product .scroll-view-item .name{ width: 100%; font-size:25upx; display: block; padding:0 10upx; box-sizing: border-box;}
.scroll-view-product .scroll-view-item .price{ display: flex; align-items: center; padding:0 10upx;}
.scroll-view-product .scroll-view-item .price-original{ color: #fd0225; font-size:25upx;}
.scroll-view-product .scroll-view-item .price-favour{ color: #888888; text-decoration: line-through; font-size:20upx; margin-left: 10upx;}

.btn-goods-action .btn-bar .btn{ line-height: normal; }
.btn-goods-action .btn-bar .btn text{ display: block;}

.attr-goods-box{ position: relative; }
.attr-goods-box .attr-goods-header{ padding: 20upx; }
.attr-goods-box .attr-goods-header .attr-img{ position: absolute; box-shadow: 2px 2px 15px rgba(46,58,76,.17)!important; width: 200upx; height: 200upx; border-radius: 10upx; top: -40upx; overflow: hidden;}
.attr-goods-box .attr-goods-header .attr-img image{ width: 100%;}
.attr-goods-box .attr-goods-header .attr-info{ margin-left: 220upx; text-align: left;}
.attr-goods-box .attr-goods-header .attr-info .attr-price{ font-size: 35upx; color: #f92028; height: 60upx;}
.attr-goods-box .attr-goods-header .attr-info .attr-stock{ color: #888; font-size: 26upx;}
.attr-goods-box .attr-goods-header .attr-info .attr-other{ color: #888; font-size: 26upx;}
.attr-goods-box .attr-goods-content{ min-height: 240upx; max-height: 480upx; overflow-y: auto; padding: 0 20upx; text-align: left;}
.attr-goods-box .attr-goods-content .sku-item{ padding-bottom: 20upx;}
.attr-goods-box .attr-goods-content .sku-item .sku-tit{ color: #888888;}
.attr-goods-box .attr-goods-content .sku-item .sku-list{ display: flex; flex-direction: row; justify-content: flex-start; flex-wrap: wrap;}
.attr-goods-box .attr-goods-content .sku-item .sku-list text{ padding: 5upx 30upx; border:1px solid #e6e6e6; background: #FFFFFF; margin: 10upx 20upx 10upx 0; font-size: 26upx; color: #333; border-radius: 8upx;}
.attr-goods-box .attr-goods-content .sku-item .sku-list text.active{ border-color: #f92028; color: #f92028;}
.attr-goods-box .attr-goods-number{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding:20upx 20upx 30upx 20upx;}
.attr-goods-box .attr-goods-number .tit{ width: 200upx; text-align: left; color: #888;}
.attr-goods-box .attr-goods-number .stepper{ flex: 1 1 0%; display: flex; justify-content: flex-end;}

.team-log-box{ padding: 20upx; background: #FFFFFF;}
.team-log-box .title{ color: #999999; font-size: 30upx; }
.team-list-box{ display: flex; flex-direction: row; margin-top: 10upx; border: 1px solid #f92028; border-radius: 50upx;}
.team-list-box .left{ width: 100upx; height: 100upx; border-radius: 100%; overflow: hidden;}
.team-list-box .left image{ width: 100%;}
.team-list-box .con{ flex: 1 1 0%; margin: 0 10upx;}
.team-list-box .con .header{ display: flex; flex-direction: row; justify-content: space-between;}
.team-list-box .con .time{ color: #999999; font-size: 25upx; display: flex; flex-direction: row;}
.team-list-box .right{ line-height: 100upx; background: #f92028; padding: 0 20upx; text-align: center; color: #FFFFFF; font-size: 30upx; border-radius: 0 50upx 50upx 0; overflow: hidden; margin-right: -1px;}
</style>
