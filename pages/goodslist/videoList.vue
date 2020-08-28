<template>
	<view class="container">
		<view class="header">
			<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" statusBar="false" fixed="false" leftState="false" rightState="false" @click-right="rightClick">
				<view class="input-view">
					<input confirm-type="search" disabled="true" @click="searchFocus" class="input" type="text" :placeholder="placeholder" />
					<uni-icon type="search" size="22" color="#666666" class="right-icon" @click="searchFocus"></uni-icon>
				</view>
			</uni-nav-bar>
		</view>
		<view class="video-list" :class="{'video-list-grid':mode === 'grid'}" v-if="!dscLoading">
			<view class="videolist">
				<block v-if="list.length > 0">
					<view class="videolist-item" v-for="(item,index) in list" :key="index" @click="showPopup(index)">
						<view class="inner">
							<view class="img">
								<image :src="item.goods_thumb" v-if="item.goods_thumb"></image>
								<image src="../../static/no_image.jpg" v-else></image>
							</view>
							<view class="i-mask"></view>
							<view class="info">
								<view class="i-play"></view>
								<view class="i-top">
									<view class="sales"><text v-if="item.sales_volume">{{item.sales_volume}}</text><text>0</text>件已售</view>
								</view>
								<view class="i-bottom">
									<view class="name">{{item.goods_name}}</view>
									<view class="uni-flex">
										<view class="shop uni-flex-item">
											<image class="shop-logo" :src="item.shop_logo" v-if="item.shop_logo"></image>
											{{item.get_seller_shop_info.shop_name}}
										</view>
										<view class="comment"><i></i><span v-if="item.comment_num">{{item.comment_num}}</span><span v-else>0</span></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<dsc-not-content></dsc-not-content>
				</block>
			</view>
		</view>

		<uni-popup class="video-popup" :show="isPopupVisible" type="right" v-on:hidePopup="closeRightDrawer()">
			<view class="video">
				<video :src="popupInfo.goods_video" id="movie" loop controls="false" :data-src="popupInfo.goods_video"></video>
			</view>
			<view class="close" @click="hidePopup"></view>
			<view class="bottom">
				<view class="goodsinfo" @click="hrefClick('/pages/goodsDetail/goodsDetail?id='+popupInfo.goods_id)">
					<view class="img">
						<img :src="popupInfo.goods_thumb" v-if="popupInfo.goods_thumb">
						<img src="../../static/no_image.jpg" v-else>
					</view>
					<view class="text">
						<view class='h3'>{{popupInfo.goods_name}}</view>
						<view class="p">{{popupInfo.shop_price_formated}}</view>
					</view>
				</view>
				<view class="like" :class="{'active':popupInfo.is_collect == 1}" @click="collection()">
					<view class="i"></view>
					<text v-if="popupInfo.is_collect == 1">已关注</text>
					<text v-else>关注</text>
				</view>
			</view>
		</uni-popup>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniNavBar from '../../components/uni-nav-bar.vue'
	import uniIcon from '../../components/uni-icon.vue'
	import uniDrawer from '../../components/uni-drawer.vue'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	import uniPopup from '@/components/uni-popup.vue';
	
	export default {
		mixins:[universal],
		components: {
			uniNavBar,
			uniIcon,
			uniDrawer,
			uniPopup,
			dscCommonNav
		},
		data() {
			return {
				disabled:false,
				loading:true,
				mode:'large',
				isPopupVisible:false,
				page:1,
				size:10,
				winHeight:600,
				cou_id:0,
				placeholder:'输入搜索关键词',
				dscLoading:true,
				list:[],
				popupInfo:null
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pages/goodslist/goodslist'
			}
		},
		computed:{
		},
		methods:{
			getList(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
				
				uni.request({
					url: this.websiteUrl + '/api/v4/goods/goodsvideo',
					method: 'POST',
					data: {
						size:this.size,
						page:this.page,
						sort: 'goods_id',
						order: 'desc'
					},
					header: {
						'Content-Type': 'application/json',
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						if(!page){
							this.list = this.list.concat(data);
						}else{
							this.list = data;
						}
						if(this.list.length>=10){
							this.mode = 'grid'
						}else{
							this.mode = 'large'
						}
						this.dscLoading = false
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			showPopup(index){
				let item = this.list[index];
				this.popupInfo = item;
				this.videoPlay();
				this.isPopupVisible = true;
			},
			hidePopup(){
				this.isPopupVisible = false;
				this.videoPause();
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
				
			},
			hrefClick(url){
				uni.navigateTo({
					url:url
				})
			},
	        videoPlay(){
	        	let that = this;
	        	setTimeout(function(){
		            that.videoContext.play();
	        	},300)
	        },
	        videoPause(){
	            this.videoContext.pause();
	        },
			//收藏
			collection(){
				let that = this
				if(this.$isLogin()){
					uni.request({
						url: this.websiteUrl + '/api/v4/collect/collectgoods',
						method: 'POST',
						data: {
							goods_id: this.popupInfo.goods_id,
		                    status: this.popupInfo.is_collect != undefined ? this.popupInfo.is_collect : false
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token')
						},
						success: (res) => {
							let data = res.data.data
		                	if(data.error == 0){
		                		uni.showToast({
									title:data.msg
								})
			                	that.popupInfo.is_collect = !that.popupInfo.is_collect
		                	}
						},
						fail: (err) => {
							console.error(err)
						}
					})
				}else{
					uni.showModal({
						content:'请登录后收藏该商品',
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
		},
		onLoad(e) {
			this.getList(1);
			this.winHeight = uni.getSystemInfoSync().screenHeight - 95;
			this.videoContext = uni.createVideoContext('movie')
		},
		onReachBottom(){
			if(this.page * this.size == this.list.length){
				this.page ++
				this.getList()
			}
		},
		watch:{
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
	
</style>
<style lang="scss" scoped>
.secrch-warp{
	.input-text{
		.search-check{
			width: 92upx;
			height: 92upx;
			top: 0;
			right: 0;
			.iconfont{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			}
		}
	}
}
.video-list{
	padding: 10upx 0;
}
.videolist{
	margin: 0 10upx;
	overflow: hidden;
}
.videolist-item{
	float: left;
	overflow: hidden;
	width: 100%;
	transition: width .2s;
	.inner{
		margin: 10upx;
		background: #000;
		border-radius: 20upx;
		overflow: hidden;
		position: relative;
	}
	.img{
		opacity: .8;
		position: relative;
		padding-top: 100%;
		image{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.i-mask{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 30%;
		z-index: 2;
		background: rgba(255,255,255,0);
		background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,255,255,0)), color-stop(100%, rgba(0,0,0,0.6)));
		background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: -o-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#000000', GradientType=0 );
	}
	.info{
		position: absolute;
		z-index: 3;
		top: 30upx;
		left: 30upx;
		right: 30upx;
		bottom: 30upx;
		.i-play{
			width: 100upx;
			height: 100upx;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			margin: auto;
	    	background: url(../../static/video/play.png) no-repeat center;
	    	background-size: contain;
		}
		.i-top{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			.sales{
				background: rgba(0,0,0,.5);
				color: #fff;
				display: inline-block;
				height: 40upx;
				line-height: 40upx;
				padding: 0 20upx;
				border-radius: 20upx;
				&:before{
					content:'';
					display: inline-block;
					width: 10upx;
					height: 10upx;
					border-radius: 100%;
					vertical-align: 2upx;
					background:linear-gradient(90deg,rgba(254,76,76,1),rgba(253,47,47,1));
					margin-right: 10upx;
				}
			}
		}
		.i-bottom{
			bottom: 0;
			position: absolute;
			left: 0;
			right: 0;
			.name{
				color: #fff;
				font-size: 32upx;
				height: 40upx;
				line-height: 40upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-bottom: 14upx;
			}
			.shop{
				font-size: 28upx;
				color: #d0d0d0;
				line-height: 46upx;
				height: 46upx;
				overflow: hidden;
				white-space: nowrap;
				.shop-logo{
					display: inline-block;
					width: 46upx;
					height: 46upx;
					vertical-align: top;
					margin-right: 10upx;
					overflow: hidden;
					background: #fff;
					border-radius: 100%;
				}
			}
			.comment{
				color: #fff;
			    font-size: 28upx;
			    line-height: 46upx;
		    	padding-left: 14upx;
			    i{
			    	display: inline-block;
			    	width: 28upx;
			    	height: 28upx;
			    	vertical-align: -4upx;
			    	background: url(../../static/video/comment.png) no-repeat center;
			    	background-size: contain;
			    	margin-right: 10upx;
			    }
			}
		}
	}
}
.video-list-grid{
	.inner{
		border-radius: 14upx;
	}
	.videolist-item{
		width: 50%;
		.info{
			left: 20upx;
			top: 14upx;
			right: 20upx;
			bottom: 14upx;
			.i-play{
				width: 54upx;
				height: 54upx;
			}
			.i-bottom{
				.name{
					font-size: 26upx;
					margin-bottom: 0;
				}
				.shop{
					font-size: 24upx;
					height: 34upx;
					line-height: 34upx;
					.shop-logo{
						width: 34upx;
						height: 34upx;
					}
				}
				.comment{
					font-size: 24upx;
					line-height: 34upx;
				}
			}
		}
	}
}
/*弹窗*/
.video-popup{
	background: #000;
	.video{
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: #000;
		video{
			position: absolute;
			width: 100%;
			max-height: 100%;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
	}
	.close{
		position: absolute;
		right: 40upx;
		top: 40upx;
		width: 80upx;
		height: 80upx;
		background: rgba(0,0,0,.3) url(../../static/video/close.png) no-repeat center;
		background-size: 26upx;
		border-radius: 100%;
	}
	.bottom{
		position: absolute;
		bottom: 40upx;
		left: 36upx;
		right: 40upx;
		text-align: center;
		.goodsinfo{
			background: #fff;
			height: 108upx;
			padding: 4upx;
			display: inline-block;
			width: 70%;
			border-radius: 10upx;
			.img{
				float: left;
				width: 100upx;
				height: 100upx;
				border-radius: 10upx;
				overflow: hidden;
				image{ width: 100upx; height: 100upx; display: block; vertical-align: top;}
			}
			.text{
				margin-left: 120upx;
				padding-top: 14upx;
				text-align: left;
				.h3,
				.p{
					line-height: 36upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 28upx;
				}
				.p{
					color: #FD2F2F;
				}
			}
		}
		.like{
			display: inline-block;
			vertical-align: top;
			color: #fff; 
			height: 104upx;
			line-height: 104upx;
			width: 22%;
			margin-left: 34upx;
			.i{
				display: inline-block;
				width: 28upx;
				height: 24upx;
				vertical-align: -4upx;
				background: url(../../static/video/heart.png) no-repeat left bottom;
				background-size: 28upx;
				margin-right: 10upx;
			}
			&.active .i{
				background-position: left top;
			}
		}
	}
}
</style>