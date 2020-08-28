<template>
	<view class="container fixed-bottom-padding">
		<scroll-view class="scrollList" scroll-y :style="{height:winHeight + 'px'}">
			<view class="goods-wrap">
				<view class="banner">
					<swiper indicator-dots="true" @change="swiperChange">
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
					<view class="price-box">
						<view class="left">
							<view class="price-weight">{{auction.formated_current_price}}</view>
							<view class="price-row">
								<view class="tag">
									<view class="tag-icon"><text class="iconfont icon-xidi-paimai"></text></view>
									<view class="tag-right-cont">拍卖</view>
								</view>
								<view class="sub">
									<text>一口价:</text>
									<text v-if="auction.no_top == 0">{{auction.formated_end_price}}</text>
									<text v-else>不封顶</text>
								</view>
							</view>
						</view>
						<view class="right">
							<block v-if="auction.status_no == 0">
								<text>活动未开始</text>
							</block>
							<block v-if="auction.status_no == 1">
								<text>距离结束还剩:</text>
								<view class="data"><uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="dateTime" v-if="dateTime"></uni-countdown></view>
							</block>
							<block v-else>
								<text class="end">活动已结束</text>
							</block>
						</view>
					</view>
					<view class="title">
						<view class="goods-name twolist-hidden"><text>{{auction.goods_name}}</text></view>
						<view class="goods_shipai" v-if="auction.formated_deposit">保证金:{{auction.formated_deposit}}</view>
						<view class="uni-flex-common uni-space-between">
							<view class="goods_shipai" v-if="auction.formated_amplitude">加价幅度:{{auction.formated_amplitude}}</view>
							<text style="color: #999999; font-size: 25upx;">拍卖机构 {{auctionGoodsData.auction_goods.rz_shopName}}</text>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="auctionProcess">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">竞拍流程</text>
								<view class="value"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-collapse">
							<view class="uni-list-cell-navigate items" :class="listshow ? 'uni-active' : ''">
								<view class="item">
									<view class="value">
										<uni-number-box :value="price" :step="auction.amplitude" :min="auction.current_price" :max="end_price" @change="bindChange"></uni-number-box>
										<text style="margin-left: 20upx; color: #f92028;">最低加价:{{auction.amplitude}} * N</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="$outerHref('/pagesA/auction/log/log?act_id='+act_id,'app')">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">出价记录</text>
								<view class="value"></view>
							</view>
						</view>
					</view>
					<view class="auction-log">
						<view class="log-item" v-for="(item,index) in auctionGoodsData.auction_log" :key="index">
							<view class="lie">
								<view class="name">
									<uni-tag text="领先" size="small" type="error" v-if="index == 0"></uni-tag>
									<uni-tag text="出价" size="small" type="error" v-else></uni-tag>
									<text v-if="item.user_name">{{item.user_name}}</text>
								</view>
								<view class="time" v-if="item.bid_time">{{item.bid_time}}</view>
							</view>
							<view class="uni-red" v-if="item.formated_bid_price">{{item.formated_bid_price}}</view>
						</view>
						<view class="log-more" @click="$outerHref('/pagesA/auction/log/log?act_id='+act_id,'app')">查看更多</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="auctionGoodsData.hot_goods && auctionGoodsData.hot_goods.length > 0">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title">
							<view class="uni-list-cell-navigate">
								<text class="title">拍卖推荐</text>
								<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0">
									<view class="scroll-view-item" v-for="(item,index) in auctionGoodsData.hot_goods" :key="index" @click="detailHref(item)">
										<image :src="item.goods_thumb" mode="widthFix"></image>
										<text class="name uni-ellipsis">{{ item.goods_name }}</text>
										<view class="price uni-flex">
											<view class="price-original">{{ item.formated_start_price }}</view>
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
							<block v-if="actPromise">
								<rich-text :nodes="actPromise"></rich-text>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</view>
						<view v-show="current === 2">
							<block v-if="actEnsure">
								<rich-text :nodes="actEnsure"></rich-text>
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
				<view class="btn btn-btn" v-if="auction.status_no === 1" @click="auctionBid()">我要出价</view>
				<block v-else>
					<view class="btn btn-btn" v-if="auction.is_winner === 1" @click="auctionBuy()">立即购买</view>
					<view class="btn btn-org" v-else>活动已结束</view>
				</block>
			</view>
		</view>
		
		<uni-popup :show="processShow" type="bottom" v-on:hidePopup="handelClose('process')">
			<view class="title">
				<view class="txt">拍卖流程</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('process')"></uni-icon>
			</view>
			<view class="rule">
				<view>1、获取资格 <text class="ml20">用户账号当前积分大于出价所需积分</text></view>
				<view>2、拍的商品 <text class="ml20">保证竞拍结束出价最低且唯一，获得竞拍商品 </text></view>
				<view>3、确认订单 <text class="ml20">填写订单信息，提交订单</text></view>
				<view>4、支付订单 <text class="ml20">支付已提交的订单</text></view>
				<view>5、竞拍成功 <text class="ml20">支付成功后等待收货，竞拍完成</text></view>
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
			<navigator url="../auction" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>拍卖首页</text>
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
				tabs: ['拍卖介绍','服务保障','竞拍攻略'],
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
                auctionGoodsData: state => state.ump.auctionGoodsData,
			}),
			goodsInfo(){
				return this.auctionGoodsData.auction_goods
			},
			auction(){
				return this.auctionGoodsData.auction
			},
			auction_log(){
				return this.auctionGoodsData.auction_log
			},
			gallerylList() {
			    return this.auctionGoodsData.goods_img
			},
			dateTime(){
				let dataTime = this.auction.endTime
				if(dataTime != ''){
					return this.$formatDateTime(dataTime)
				}
			},
			price:{
				get(){
					return this.auction.current_price_int
				},
				set(val){
					this.auction.current_price_int = val
				}
			},
			end_price(){
				let end_price = 100000000000000000;
				if(this.auction.end_price > 0){
					end_price = this.auction.end_price
				}
	
				return end_price
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
			actPromise(){
				let result = this.auction.act_promise
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
				
				if(result){
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			},
			actEnsure(){
				let result = this.auction.act_ensure
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
				
				if(result){
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
					return this.auction.is_collect
				},
				set(val){
					this.auction.is_collect = val
				}
			},
		},
		onShareAppMessage(res){
			return {
			  title: this.goodsInfo.goods_name,
			  path: '/pagesA/auction/detail/detail?id=' + this.cat_id
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'auction/detail/' + this.cat_id + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		onLoad(e){
			this.act_id = e.act_id ? e.act_id : 0;
			this.loadInfo();
			this.getRegionData(); //根据缓存获取地区
		},
		methods: {
			loadInfo(){
				this.$store.dispatch('setAuctionGoods',{
					id: this.act_id
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
			//出价
			auctionBid(){
				this.$store.dispatch('setAuctionBid',{
					id: this.act_id,
					price_times:this.price
				}).then(res => {
					let data = res.data
					if(data.error == 0){
						uni.showToast({
							title:'出价成功'
						})
						this.loadInfo()
					}else{
						uni.showToast({
							icon:'none',
							title:data.msg
						})
					}
				})
			},
			auctionBuy(){
				if(this.$isLogin()){
					this.$store.dispatch('setAuctionBuy',{
						id: this.act_id,
					}).then(res =>{
						let data = res.data.data
						if(data.error == 0){
							uni.navigateTo({
								url:'/pages/checkout/checkout?rec_type=' + data.flow_type + '&type_id=' + data.extension_id
							})
						}else{
							uni.showToast({
								icon:'none',
								title:data.msg
							})
						}
					})
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
					url:'/pagesA/auction/detail/detail?id=' + item.act_id
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
			auctionGoodsData(){
				this.dscLoading = false
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
