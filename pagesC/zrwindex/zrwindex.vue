<template>
	<view>
		<view class="banner">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" class="g-banner" indicator-color="rgba(255, 255, 255, .9)" indicator-active-color="#0a95db">
				<swiper-item v-for="(item,index) in banner" :key="index" @click="$outerHref(item.ad_link,'app')">
					<view class="swiper-item">
						<image :src="item.ad_code" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="news">
			 <text>{{notice}}</text>
		</view>
		<view class="navs">
			 
			<view class="team-box" @click="gotozrwrenwu(1)">
				<view class="navsimg"><image src="../../static/weike/liuliang.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>流量任务</span></view>
			</view>
			
			<view class="team-box" @click="gotozrwrenwu(2)">
				<view class="navsimg"><image src="../../static/weike/tuiguang.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>推广任务</span></view>
			</view>
			<view class="team-box" @click="gotozrwrenwu(3)">
				<view class="navsimg"><image src="../../static/weike/tiyan.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>体验任务</span></view>
			</view>
			<view class="team-box" @click="gotozrwrenwu(4)">
				<view class="navsimg"><image src="../../static/weike/yinxiao.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>营销任务</span></view>
			</view>
			<view class="team-box" @click="gotozrwrenwu(5)">
				<view class="navsimg"><image src="../../static/weike/youxi.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>试玩任务</span></view>
			</view>
			<view class="team-box" @click="gotozrwrenwu(6)">
				<view class="navsimg"><image src="../../static/weike/yuedu.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>阅读任务</span></view>
			</view>
			<view class="team-box" @click="gotozrwrenwu(7)">
				<view class="navsimg"><image src="../../static/weike/jineng.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>技能派单</span></view>
			</view>
			<view class="team-box" @click="gotozrwrenwu(8)">
				<view class="navsimg"><image src="../../static/weike/xianxia.png" class="navsimgcss"></image></view>
				<view class="navsspan"><span>线下任务</span></view>
			</view>		
		</view>
		
		<view class="bannertwo" @click="$outerHref('../../pages/user/qrcode',$isLogin())">
			<image src="../../static/weike/twoban.png" class="img100"></image>
		</view>
		
		
		<view class="tab liti">
			<view class="tableft"  @click="gotozrwrenwuforlevel(0)"><text>普通任务</text></view>
			<view class="tabright" @click="gotozrwrenwuforlevel(1)"><text>高级任务</text></view>
		</view>
		<view class="wklist">
			<view class="uli uni-flex liti" @click="gotozrwvip(item.id,item.level)" hover-class="hoverclass" v-for="(item,index) in task" :key="index" >
				<view class="uli-left">
					<view class="grade" v-if="item.level == 0"><span>普通会员</span></view>
					<view class="grade" v-if="item.level == 1"><span>VIP会员</span></view>
					<view class="grade" v-if="item.level == 2"><span>白银VIP</span></view>
					<view class="grade" v-if="item.level == 3"><span>黄金VIP</span></view>
					<view class="grade" v-if="item.level == 4"><span>铂金VIP</span></view>
					<view class="grade" v-if="item.level == 5"><span>钻石VIP</span></view>
					<view class="image-view"><image :src="geturl(item.ico)" class="imgcss"></image></view>
				</view>
				<view  class="uli-mide">					
					<span>编号 : {{item.id}}</span><span class="sums">剩余:{{item.leftnum}}</span><br>
					<span>要求 : {{item.title}}</span><br>
					<span>分类 : {{item.name}}</span>					
				</view>
				<view  class="uli-right">
					<view class="ulimoney">￥{{item.price}}</view>
					<view class="ulibuy">领取</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	 import * as localConfig from '@/config/local/config';
	 import { mapState } from 'vuex'
	 import uniIcon from "@/components/uni-icon.vue";
	 import universal from '@/common/mixins/universal.js';
	 import isLogin from '@/common/mixins/isLogin.js'
	 const webUrl = localConfig.websiteUrl
	 export default {
		data() {
			return {
				banner:[],
				task:[],
				notice:'',
				page:1,
				size:5,
				get:false,
				level:-1
			}
		},
		methods: {
			bannerlist:function(){
				uni.request({
					url: webUrl + '/api/v4/task', 
					data: {page:this.page,size:this.size},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.banner = res.data.data.banner
							this.task = res.data.data.task
							this.notice = res.data.data.notice
							this.level = res.data.data.level
							this.page = this.page + 1
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task',  
					data: {page:this.page,size:this.size},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.task.length;
							for(let i=0;i<len;i++){
								this.task.push(res.data.data.task[i])
							}
							this.page = this.page + 1
						}
					}
				});
			},
			geturl(ico){
				return   ico
			},
			gotozrwvip(id,level){
				if(this.level == -1){
					uni.showToast({
						title: '请登录查看更多内容',
						duration: 2000,
						icon:'none'
					});
					return false
				}
				if(level>this.level){
					uni.showToast({
						title: '您的等级不足以查看该内容',
						duration: 2000,
						icon:'none'
					});
					return false
				}
				uni.navigateTo({
					url:'/pagesC/zrwword/zrwdetail/zrwdetail?id='+id 
				})
			},
			gotozrwrenwu(cid){
				uni.reLaunch({
					url:'/pagesC/zrwrenwu/zrwrenwu?cid='+cid
				})
			},
			gotozrwrenwuforlevel(level){
				uni.reLaunch({
					url:'/pagesC/zrwrenwu/zrwrenwu?level='+level
				})
			},
			gotozrwshop(){
				uni.navigateTo({
					url:'/pagesC/zrwshop/zrwshop'
				})
			}
		},
		onLoad(e){
			this.page = 1
			uni.showTabBar()
			this.bannerlist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.morelist()
			}
		}
	}
</script>

<style>
uni-view,text{font-size:24rpx}
.img100{width:100%;height:100%}
.uni-view{font-size:28rpx}
.banner{width:100%;height:350rpx;background-color:#d81e07}
.bannertwo{width:740rpx;height:204rpx;margin:0 auto;margin-top:20rpx}
.news{width:632rpx;height:80rpx;border-bottom:1rpx solid #e7e7e7;
    margin:0 auto;
	background-image:url(../../static/weike/messg.png);
	background-size:5%;
	background-repeat: no-repeat;
	background-position: 10rpx 50%;
	line-height:80rpx;
	padding-left:60rpx
}

.uni-flex{display: flex;flex-direction: row;}

.navs{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;align-content: flex-start}
.team-box{width:25%;height:170rpx;}
.navsimg{width:100%;height:100rpx;overflow:hidden;text-align:center;padding-top:20rpx}
.navsimgcss{width:90rpx;height:90rpx;margin:5rpx}
.navsspan{line-height:50rpx;height:50rpx;text-align:center}


.tab{width:692rpx;height:134rpx;margin:0 auto 30rpx auto;border-radius:15rpx;display: flex;flex-direction: row;}
.tableft{width:50%;height:64rpx;border-right: 1rpx solid #bababa;padding-left:20%;
    background-image: url(../../static/weike/putong.png);
	background-size:15%;
	background-repeat: no-repeat;
	background-position: 20% 50%;
	margin:35rpx 0;
	line-height:64rpx
}
.tabright{width:50%;height:64rpx;margin:35rpx 0;padding-left:20%;
    background-image: url(../../static/weike/zhuangshi.png);
	background-size:15%;
	background-repeat: no-repeat;
	background-position: 20% 50%}
.wklist{width:692rpx;height:auto;margin:0 auto}
.uli{width:100%;height:180rpx;border-radius: 15rpx;
	     border:1rpx solid #e1e1e1;overflow:hidden;margin:30rpx 0;
		 display: flex;justify-content:space-between;
		 }
.uli-left{width:120rpx;height:170rpx;}
.grade{width:120rpx;height:50rpx;background-color:#d81e07;color:#ffffff;line-height:60rpx;text-align:center}
.image-view{width:120rpx;height:120rpx}
.imgcss{width:90rpx;height:90rpx;margin:15rpx}
.uli-mide{line-height:50rpx;padding:10rpx 20rpx;width:420rpx}
.sums{margin-left:20rpx;min-width:120rpx;padding-left:10rpx;padding-right:10rpx;color:#d81e07;
      height:45rpx;border-radius: 15rpx;top:0;z-index: 1;border:2rpx solid #d81e07;line-height:45rpx}	  
.uli-right{width:150rpx;
		   height:170rpx;
		   padding-right:20rpx;
		   text-align:right;
		   display: flex;
		   flex-direction:row-reverse;
		   flex-wrap:wrap ;		  
 }
.ulimoney{width:100%;
	font-size:28rpx; 
	text-align:right;
	color:#d81e07;
	line-height:80rpx;
	height:80rpx;
	font-weight: bold;
	    background-image:url(../../static/weike/ulimoney.png);
	    background-size: 20%;
	    background-repeat: no-repeat;
	    background-position: 100% 50%;
	    padding-right: 15px;
	}
.ulibuy{	  
	   width:120rpx;
	   height:60rpx;
	   margin:15rpx 0;
	   line-height:60rpx;
	   text-align:center;
	   background-color:#d81e07;
	   color:#ffffff;
	   border-radius:10rpx;
}
.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}
.hoverclass{background-color:#F0F0F0}
</style>
