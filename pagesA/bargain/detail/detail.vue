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
					<view class="bargain-time">
						<text>距离结束还剩</text>
						<view class="data">
							<block v-if="isTimeEnd">
								<uni-countdown fontColor="#FFFFFF" splitorColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="dateTime" v-if="dateTime"></uni-countdown>
							</block>
							<block v-else>
								<text class="end">活动结束</text>
							</block>
						</view>
					</view>
				</view>
				<view class="cont-box">
					<view class="title">
						<view class="goods-name twolist-hidden"><uni-tag text="砍" size="small" type="error"></uni-tag><text>{{goodsInfo.goods_name}}</text></view>
						<view class="goods-price">
							<block v-if="bargainDetailData.bargain_info.final_price">
								<text>砍后价：</text>
								<text class="price-original">{{ bargainDetailData.bargain_info.final_price }}</text>
							</block>
							<block v-else>
								<text>原价：</text>
								<text class="price-original">{{ goodsInfo.goods_price }}</text>
							</block>
						</view>
						<view class="bargain-progressbar">
							<view class="plan-left plan-common"></view>
							<view class="wrap" style="border-radius: 0">
								<view class="bar" :style="{width:goodsInfo.bargain_bar + '%'}">
									<view class="color"></view>
								</view>
							</view>
							<view class="plan-right plan-common"></view>
						</view>
						<view class="goods_outer">
							<view class="text-left" v-if="goodsInfo.target_price">底价{{ goodsInfo.target_price }}</view>
							<view class="text-right" v-if="goodsInfo.shop_price">原价{{ goodsInfo.shop_price }}</view>
						</view>
						<view class="bargain-tip">
							<view class="join">已有<text class="number" v-if="goodsInfo.total_num">{{goodsInfo.total_num}}</text>人发起砍价</view>
							<view class="triangle"></view>
							<view class="order">
								<swiper autoplay="true" circular="true" interval="5000">
									<swiper-item v-for="(item, index) in bargainDetailData.bargain_list" :key="index">
										<view class="cont">
											<text class="uni-red">{{ item.user_name }}</text> 给您砍了 <text class="uni-red">{{ item.subtract_price }}</text>
										</view>
									</swiper-item>
								</swiper>
							</view>
						</view>
					</view>
				</view>
				<!--砍完价后的列表-->
				<view class="bargian-user" v-if="bargainJoin">
					<view class="left">
						<image v-if="bargainDetailData.bargain_info.user_picture" :src="bargainDetailData.bargain_info.user_picture" mode="widthFix"></image>
						<image v-else src="../../../static/user_default.png" mode="widthFix"></image>
					</view>
					<view class="right">
						<view class="tit">{{bargainDetailData.bargain_info.user_name}}<text v-if="bargainDetailData.bargain_info.rank">当前发起砍价排名：{{bargainDetailData.bargain_info.rank}}</text></view>
						<view class="subtit">
							<block v-if="addBargain == 1">您已经帮自己砍下了第一刀，共砍掉了</block>
							<block v-else>您已经帮好友砍下了一刀，共砍掉了</block>
							<text class="uni-red" v-if="bargainDetailData.bargain_info.subtract_price">{{bargainDetailData.bargain_info.subtract_price}}元</text>
						</view>
					</view>
				</view>
				<!--活动规则-->
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title" hover-class="uni-list-cell-hover" @click="handleRule">
							<view class="uni-list-cell-navigate">
								<text class="title">砍价规则</text>
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
				<!--亲友帮-->
				<view class="qinyou">
					<view class="uni-common-mt">
						<uni-segmented-control :current="rankCurrent" :values="rankTabs" v-on:clickItem="onRankItem" styleType="text" activeColor="#f92028"></uni-segmented-control>
					</view>
					<view class="qinyou-cont">
						<block v-if="rankCurrent === 0">
							<block v-if="bargainDetailData.bargain_ranking != ''">
								<view class="item" v-for="(item, index) in bargainDetailData.bargain_ranking" :key="index" v-if="index < lengthNum">
									<view class="icon">
										<image src="../../../static/rank-1.png" mode="widthFix" v-if="item.rank===1"></image>
										<image src="../../../static/rank-2.png" mode="widthFix" v-if="item.rank===2"></image>
										<image src="../../../static/rank-3.png" mode="widthFix" v-if="item.rank===3"></image>
									</view>
									<view class="left">
										<image :src="item.user_picture" class="img" v-if="item.user_picture"></image>
										<image src="../../../static/user_default.png" class="img" v-else></image>
									</view>
									<view class="con">{{item.user_name}}</view>
									<view class="right">砍掉<text class="uni-red">{{item.money}}</text>元</view>
								</view>
								<view class="showMore" @click="showMore">{{ lengthMore }}</view>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</block>
						<block v-if="rankCurrent === 1">
							<block v-if="bargainDetailData.bargain_list != ''">
							<view class="item" v-for="(item, index) in bargainDetailData.bargain_list" :key="index">
								<view class="left">
									<image :src="item.user_picture" class="img" v-if="item.user_picture"></image>
									<image src="../../../static/user_default.png" class="img" v-else></image>
								</view>
								<view class="con">
									<text>{{item.user_name}}</text>
									<text>{{item.add_time}}</text>
								</view>
								<view class="right">砍掉<text class="uni-red">{{item.subtract_price}}</text>元</view>
							</view>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</block>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="bargainDetailData.new_goods && bargainDetailData.new_goods.length > 0">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title">
							<view class="uni-list-cell-navigate">
								<text class="title">团购推荐</text>
								<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0">
									<view class="scroll-view-item" v-for="(item,index) in bargainDetailData.new_goods" :key="index">
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
			<view class="btn-bar">
				<block v-if="goodsInfo.bs_id > 0">
					<block v-if="addBargain == 1">
						<block v-if="bargainJoin == 1">
							<!-- #ifdef MP-WEIXIN -->
							<button class="btn btn-org" :data-id="goodsInfo.bs_id" open-type="share">让朋友帮砍</button>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<button class="btn btn-org" :data-id="goodsInfo.bs_id" @tap="appShare">让朋友帮砍</button>
							<!-- #endif -->
							<button class="btn btn-red" @click="onBuyClicked">立即购买</button>
						</block>
						<block v-else>
							<button class="btn btn-red" @click="bargainBid">自砍一刀</button>
						</block>
					</block>
					<block v-else>
						<button class="btn btn-org" @click="cutDown" v-if="bargainJoin == 1">已帮TA砍价</button>
						<button class="btn btn-org" @click="bargainBid" v-else>帮砍一刀</button>
						
						<button class="btn btn-red" @click="myBargain" v-if="goodsInfo.is_add_bargain == 1">我的活动</button>
						<button class="btn btn-red" @click="bargainLog" v-else>我要参与</button>
					</block>
				</block>
				<block v-else>
					<view class="btn btn-red" @click="bargainLog">
						<text class="mt10">我要参与</text>
					</view>
				</block>
			</view>
		</view>
		
		<dsc-common-nav>
			<navigator url="../bargain" class="nav-item" slot="right">
				<view class="iconfont icon-bargain"></view>
				<text>砍价频道</text>
			</navigator>
		</dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
		
		<!--拼团规则弹框-->
		<uni-popup :show="ruleShow" type="bottom" v-on:hidePopup="handleClose('rule')">
			<view class="title">
				<view class="txt">规则详情</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handleClose('rule')"></uni-icon>
			</view>
			<view class="rule">
				<view>1.参与活动：点击参与活动，自己砍一刀;</view>
				<view>2.邀请好友：在参与活动之后。可以点击“找亲友帮我砍” 分享给好友帮你砍价;</view>
				<view>3.砍到最低价：邀请好友砍价，砍到最低价时点击购买。</view>
			</view>
		</uni-popup>
		
		<uni-popup :show="bidShow" type="middle" v-on:hidePopup="handleClose('bid')">
			<view class="bargain-friends">
				<view class="tit">砍价提示</view>
				<view class="image"><image src="../../../static/bargain_s.jpg" mode="widthFix"></image></view>
				<view class="cont">您砍掉了<text class="uni-red" v-if="bargainBidData.subtract_price">¥{{bargainBidData.subtract_price}}</text>元</view>
				<view class="footer" @click="confirmBid(bs_id)">我知道了</view>
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
						<view class="attr-name twolist-hidden">{{goodsInfo.goods_name}}</view>
						<view class="attr-price" v-if="goodsAttrOper.goods_price"><text>原价：</text>{{goodsAttrOper.goods_price}}</view>
						<view class="attr-stock" v-if="goodsAttrOper.target_price">底价：{{goodsAttrOper.target_price}}</view>
						<view class="attr-stock" v-if="goodsAttrOper.stock !== 'undefined'">库存：{{ goodsAttrOper.stock }}</view>
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
					<view class="stepper"><uni-number-box :value="num" :min="1" :max="goodsInfo.astrict_num" disabled="true"></uni-number-box></view>
				</view>
				<view class="btn-bar">
					<view class="btn btn-red" @click="bargainLogCheckout" v-if="stock">确定</view>
					<view class="btn btn-disabled" v-else>库存不足</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	import uniIcon from '@/components/uni-icon.vue';
	import uniTag from "@/components/uni-tag.vue";
	import uniPopup from '@/components/uni-popup.vue';
	
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				winHeight: 0,
				tabs: ['商品详情', '规格参数'],
				current: 0,
				rankTabs: ['排行榜', '亲友帮'],
				rankCurrent:0,
				poster:false,
				id:'',
				bs_id:'',
				onceTeamType:false,
				steps:[
					{title:'点击砍价'},
					{title:'邀友帮砍'},
					{title:'砍到底价'},
					{title:'下单购买'}
				],
				showBase:false,
				ruleShow:false,
				num:1,
				addCartClass:false,
				dscLoading:true,
				bidShow:false,
				
				lengthNum:10,
				isLengthShow:true,
				lengthMore:"查看更多"
			}
		},
		components: {
			uniSegmentedControl,
			uniIcon,
			uniTag,
			uniPopup,
			uniCountdown,
			uniNumberBox,
			dscNotContent,
			dscCommonNav,
		},
		onShareAppMessage(res){
			if (res.from === 'button') {// 来自页面内分享按钮
				return {
				  title: '朋友，请帮我砍一刀！',
				  path: '/pagesA/bargain/detail/detail?id='+ this.id +'&bs_id='+res.target.dataset.id
				}
			}else{
				return {
				  title: this.goodsInfo.goods_name,
				  path: "/pageA/bargain/detail/detail?id=" + this.id + '&bs_id=' + this.goodsInfo.bs_id
				}
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'bargain/detail/' + this.id + '?bs_id=' + this.goodsInfo.bs_id + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.bargain_desc ? this.goodsInfo.bargain_desc : this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		computed: {
			...mapState({
				bargainDetailData: state => state.bargain.bargainDetailData
			}),
			goodsInfo(){
				return this.bargainDetailData.goods_info
			},
			gallerylList(){
				return this.bargainDetailData.goods_img
			},
			attr(){
				return this.bargainDetailData.goods_properties    //商品属性
			},
			goodsAttrInit(){
				return this.$store.state.bargain.goodsAttrInit    //商品属性id
			},
			goodsAttrOper(){
				return this.$store.state.bargain.goodsAttrOper
			},
			stock() {
				return this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
			},
			isTimeEnd(){
				return this.goodsInfo.end_time > this.goodsInfo.current_time ? true : false
			},
			dateTime(){
				let dataTime = this.goodsInfo.end_time
				
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
			addBargain:{
				get(){
					return this.$store.state.bargain.addBargain
				},
				set(val){
					this.$store.state.bargain.addBargain = val
				}
			},
			bargainBidData:{
				get(){
					return this.$store.state.bargain.bargainBidData
				},
				set(val){
					this.$store.state.bargain.bargainBidData = val
				}
			},
			bargainJoin:{
				get(){
					return this.$store.state.bargain.bargainJoin
				},
				set(val){
					this.$store.state.bargain.bargainJoin = val
				}
			},
        },
		methods: {
			goodsDetail(bsId) {
				this.$store.dispatch('setBargainDetail',{
					id: this.id,
					bs_id: bsId
				})
			},
			closeSku() {
				this.showBase = false;
				this.bargainBidData.bargain_join =''
			},
			changeAttr(){
				this.$store.dispatch('setBargainProperty',{
					id: this.id,
					num: this.num,
					attr_id:this.goodsAttrInit,
					warehouse_id: 0,
					area_id: 0
				})
			},
			//参与砍价
			bargainLog() {
				this.showBase = true
				this.changeAttr()
			},
			//确定参与
			bargainLogCheckout() {
				let newAttr = []
				
				if (this.attr.length > 0) {
					newAttr = this.goodsAttrInit
				}
				
				if(this.$isLogin()){
					if(this.goodsAttrOper.stock > 0){
						this.$store.dispatch('setBargainLog',{
							id: this.id,
							num: this.num,
							attr_id: newAttr,
							warehouse_id: 1,
							area_id: 1
						}).then(res =>{
							uni.showToast({ title:res.data.msg, icon:'none' });
							this.showBase = false
							if(res.data.error == 0){
								this.addBargain = res.data.add_bargain
								this.goodsDetail(res.data.bs_id)
							}
						})
					}else{
						uni.showToast({ title:'库存不足', icon:'none' });
					}
				}else{
					uni.showModal({
						content:'未登录不可以参与砍价',
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
			//去砍一刀
			bargainBid() {
				if(this.$isLogin()){
					this.$store.dispatch('setBargainBid',{
						id: this.goodsInfo.id,
						bs_id: this.goodsInfo.bs_id
					}).then(res => {
						if(res.data.error == 0){
							this.bargainBidData = res.data
							this.bargainJoin = res.data.bargain_join
							this.bidShow = true
						}else{
							uni.showToast({ title:res.data.msg, icon:'none' });
						}
					})
				}else{
					uni.showModal({
						content:'未登录不可以帮砍价',
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
			//属性切换
			attrChange(index,id){
				this.goodsAttrInit.splice(index,1,id)
			},
			onBuyClicked(){
				this.$store.dispatch('setBargainBuy',{
					id: this.goodsInfo.id,
					bs_id: this.goodsInfo.bs_id,
					goods_id: this.goodsInfo.goods_id,
					num: this.num
				}).then(res => {
					console.log(res)
					if(res.data.error == 0){
						uni.navigateTo({
							url:'/pages/checkout/checkout?rec_type=8&type_id='+res.data.bs_id
						})
					}else{
						uni.showToast({ title:res.data.msg, icon:'none' });
					}
				})
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
				}else if(val == 'bid'){
					this.bidShow = false
				}
			},
			confirmBid(bs_id){
				this.bidShow = false
				this.goodsDetail(bs_id);
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			onRankItem(index){
				if(this.rankCurrent !== index){
					this.rankCurrent = index;
				}
			},
			myBargain(){
				uni.navigateTo({
					url:'../mylist/mylist'
				})
			},
			//亲友帮、排行榜
			handleFilter(index) {
				this.filter = index
			},
			//拼团规则
			goodsRule() {
				this.ruleShow = !this.ruleShow
			},
			//分享
			shareClick() {
				this.shareState = true
			},
			//app分享
			appShare(){
				let shareInfo = {
					href:this.$websiteUrl + 'bargain/detail/' + this.id + '?bs_id=' + this.goodsInfo.bs_id + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.bargain_desc ? this.goodsInfo.bargain_desc : this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			},
			showMore(){
				this.isLengthShow = !this.isLengthShow;
				this.lengthNum = this.isLengthShow ? 10 : this.bargainDetailData.bargain_ranking.length;
				this.lengthMore = this.isLengthShow ? '查看更多' : '收起';
			}
		},
		onLoad(e){
			this.id = e.id;
			this.bs_id = e.bs_id ? e.bs_id : 0;
			
			let difHeight = 105
			if(uni.getSystemInfoSync().model == 'Redmi Note 7'){
				difHeight = 26
			}
			this.winHeight = uni.getSystemInfoSync().windowHeight - difHeight;
		},
		onShow(){
			this.goodsDetail(this.bs_id)
		},
		watch:{
			bargainDetailData(){
				this.dscLoading = false
			}
		}
	}
</script>

<style scoped>
.banner{ position: relative;}
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

.attr-goods-box{ position: relative; }
.attr-goods-box .attr-goods-header{ padding: 20upx; }
.attr-goods-box .attr-goods-header .attr-img{ position: absolute; box-shadow: 2px 2px 15px rgba(46,58,76,.17)!important; width: 200upx; height: 200upx; border-radius: 10upx; top: -40upx; overflow: hidden;}
.attr-goods-box .attr-goods-header .attr-img image{ width: 100%;}
.attr-goods-box .attr-goods-header .attr-info{ margin-left: 220upx; text-align: left;}
.attr-goods-box .attr-goods-header .attr-info .attr-price{ font-size: 35upx; color: #f92028; height: 60upx;}
.attr-goods-box .attr-goods-header .attr-info .attr-price text{ color: #888; font-size: 26upx; }
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

/*砍价*/
.bargain-progressbar{ position: relative;}
.bargain-progressbar .plan-common{ width: 12upx; height: 12upx; border-radius: 100%; position: absolute; border:6upx solid #efeeee; top: -8upx;}
.bargain-progressbar .plan-left{ border-color: #f92028; left: 0;}
.bargain-progressbar .plan-right{ border-color: #efeeee; right: 0;}
.bargain-progressbar .wrap{ height: 10upx; background-color: #efeeee; margin: 0 24upx;}
.bargain-progressbar .wrap .bar,
.bargain-progressbar .wrap .bar .color{ height: 100%; display: block; border-radius: 8upx;}
.bargain-progressbar .wrap .bar .color{ width: 100%; background: #ffa538; }

.bargain-tip{ position: relative; margin-top: 20upx; display: flex; flex-direction: row;}
.bargain-tip .join{ display: inline-block; background: #f92028; color: #FFFFFF; text-align: center; width: 44%; font-size: 25upx; height: 50upx; line-height: 50upx;}
.bargain-tip .triangle{ border: 25upx solid transparent; border-left-color: #f92028; overflow: hidden; height: 0; width: 0; z-index: 1;}
.bargain-tip .order{ flex: 1 1 0%; margin-left: -45upx;}
.bargain-tip .order swiper{ height: 40upx; background: #ffcc33; margin-top: 5upx; line-height: 40upx; padding-left: 30upx;}
.bargain-tip .order .cont{ font-size: 25upx;}
.bargain-tip .order .cont text{ margin: 0 5upx;}

.bargain-time{ display: flex; flex-direction: row; padding: 20upx; color: #FFFFFF; justify-content: space-between; position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; background: rgba(0,0,0,.6); }

.qinyou{ background: #FFFFFF; margin-top: 20upx;}
.qinyou-cont .item{ display: flex; flex-direction: row;padding: 20upx; border-bottom: 1px solid #e3e8ee;}
.qinyou-cont .item .icon{ width: 72upx; display: flex; flex-direction: row; align-items: center;}
.qinyou-cont .item .icon image{ width: 60%;}
.qinyou-cont .item .left{ width: 120upx; height: 120upx; margin-right: 20upx; display: flex; flex-direction: row; align-items: center; }
.qinyou-cont .item .left image{ width: 100%; border-radius: 100%; overflow: hidden; }
.qinyou-cont .item .con{ display: flex; justify-content: flex-start; align-items: center; flex: 1 1 0%; }
.qinyou-cont .item .right{ display: flex; flex-direction: row; align-items: center; color: #999999; font-size: 25upx;}

.bargian-user{ display: flex; padding: 20upx 20upx 0 20upx;}
.bargian-user .left{ width: 100upx; height: 100upx; margin-right: 20upx;}
.bargian-user .left image{ width: 100%; border-radius: 100%; overflow: hidden; }
.bargian-user .right{ flex: 1 1 0%;}
.bargian-user .right .tit{ font-size: 30upx;}
.bargian-user .right .tit text{ font-size: 25upx; padding: 0 20upx; border: 1px solid #f92028; color: #f92028; border-radius: 20upx; margin-left: 10upx;}
.bargian-user .right .subtit{ font-size: 25upx; color: #999999;}

.bargain-friends{ background: #FFFFFF; width: 100%;}
.bargain-friends .tit{ text-align: center; font-size: 30upx; border-bottom: 1px solid #eee;}
.bargain-friends .image{ width: 180upx; margin: 30upx auto;}
.bargain-friends .image image{ width: 100%;}
.bargain-friends .cont{ padding: 0 20upx; text-align: center; font-size: 25upx; }
.bargain-friends .cont text{ margin: 0 5upx;}
.bargain-friends .footer{ width: 100%; text-align: center; background: #ff495e; color: #FFFFFF; font-size: 25upx; padding: 5upx 0; border-radius: 8upx; margin-top: 20upx;}

.showMore{ display: flex; justify-content: center; align-items: center; padding: 20upx 0; color: #999; }
</style>
