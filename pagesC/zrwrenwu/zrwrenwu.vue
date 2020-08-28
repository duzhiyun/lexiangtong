<template>
	<view>
		<view class="bannervs ">
			<view class="secul uni-view uni-flex">
				<view class="tableft taball secli " style="border-right:1rpx solid #d9d9d9">
					<picker @change="bindPickerChange" :value="index" :range="cate">
						<view style="line-height:80rpx;color:#000000">{{cate[cindex]}}</view>
					</picker>
				</view>
				<view class="tableft  taball secli">
					<picker @change="bindPickerChanges" :value="index" :range="array">
						<view style="line-height:80rpx;color:#000000">{{array[index]}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="wklist">
			<view class="uli uni-flex liti" @click="gotozrwvip(item.id,item.level)" hover-class="hoverclass" v-for="(item,index) in task" :key="index" >	
				<view class="uli-left"> 
					<image :src="geturl(item.ico)" class="imgcss" style="width:100rpx;height:100rpx"></image>
				</view>
				<view  class="uli-mide">					 
					<view class="title mb10"><span>{{item.title}}</span></view>
					<view >
						   <span class="lei duzyborder"> 编号:{{item.id}}</span> 
					       <span class="lei duzyborder">{{item.name}}</span>
				    </view>				
				</view>
				<view  class="uli-right duzyborder mt10 duzybradius">
					<view class="ulimoney duzycolor">￥{{item.price}}</view>
					<view class="ulibuy duzybg">剩余 {{item.leftnum}}</view>
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
				array:['普通任务','VIP会员','白银VIP','黄金VIP','铂金VIP','钻石VIP'],
				cate:['所有类型'],
				index:0,
				cindex:0,
				task:[],
				page:1,
				size:6,
				level:0,
				cid:-1,
				mylevel:-1,
				get:false
			}
		},
		methods: {
			bindPickerChange: function(e) {
				this.cindex = e.target.value
				if(e.target.value == 0){
					this.cid = -1
				}else{
					this.cid = e.target.value
				}
				this.page = 1
				this.tasklist()
			},
			bindPickerChanges: function(e) {
				this.index = e.target.value
				if(e.target.value == 0){
					this.level = 0
				}else{
					this.level = e.target.value
				}
				this.page = 1
				this.tasklist()
			}, 
			tasklist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/info', 
					data: {page:this.page,size:this.size,level:this.level,cid:this.cid},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.cate.length;
							for(let i=0;i<len;i++){
								this.cate.push(res.data.data.cate[i].name)
							}
							this.mylevel = res.data.data.level
							this.task = res.data.data.task
							this.page = this.page + 1
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/info', 
					data: {page:this.page,size:this.size,level:this.level,cid:this.cid},
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
				return  ico
			},
			gotozrwvip(id,level){
				if(this.mylevel == -1){
					uni.showToast({
						title: '请登录查看更多内容',
						duration: 2000,
						icon:'none'
					});
					return false
				}
				if(level>this.mylevel){
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
			gotozrwrenwu(){
				uni.navigateTo({
					url:'/pagesC/zrwrenwu/zrwrenwu'
				})
			},	
			gotozrwshop(){
				uni.navigateTo({
					url:'/pagesC/zrwshop/zrwshop'
				})
			}
		},
		onLoad(e){
			if(e.cid != undefined){
				this.cid = e.cid;
				this.cindex = e.cid;
			}else{
				this.cid = -1
				this.cindex = 0
			}
			
			if(e.level != undefined){
				this.level = e.level
				this.index = e.level
			}else{
				this.level = 0 
				this.index = 0
			}
			this.page = 1
			uni.showTabBar()
			this.tasklist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.morelist()
			}
		}
	}
</script>

<style>
.tab{width:100%;height:90rpx;display: flex;flex-direction: row;top:0;z-index: 1;position: fixed;background-color:#ffffff}
.tabright,.tableft{width:50%;height:90rpx;padding-left:20%;
    background-image: url(../../static/weike/vvv.png);
	background-repeat: no-repeat;
	background-position: 80% 45%;
	line-height:90rpx
}
 .uni-flex{display: flex;flex-direction: row;}   
	
.wklist{width:692rpx;height:auto;margin:0 auto}
.uli{   width:100%;height:135rpx;border-radius: 15rpx;
	     border:1rpx solid #e1e1e1;overflow:hidden;margin:20rpx 0;
		 display: flex;justify-content:space-between;
		 }
.uli-left{width:120rpx;height:130rpx;}
.grade{width:120rpx;height:50rpx;color:#ffffff;line-height:50rpx;text-align:center}
.image-view{width:120rpx;height:120rpx}
.imgcss{width:90rpx;height:90rpx;margin:15rpx}
.uli-mide{line-height:50rpx;padding:10rpx 10rpx;width:420rpx;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.title{font-size:28rpx;}
.lei{border-radius: 15rpx;padding:0 10rpx;width:auto;line-height:30rpx;margin:0 10rpx}

.sums{margin-left:20rpx;min-width:120rpx;padding-left:10rpx;padding-right:10rpx;;
      height:45rpx;border-radius: 15rpx;top:0;z-index: 1;border:2rpx solid;line-height:45rpx}
			
.uli-right{width:100rpx;
		   margin-right: 5px;
		   text-align:center;
	       height:70rpx;
		   margin-top:30rpx
 }
.ulimoney{width:100%;
	font-size:24rpx; 
	line-height:40rpx;
	height:40rpx;
	font-weight: bold;
	}
.ulibuy{	  
	   width:100%;
	   height:30rpx;
	   line-height:30rpx;
	   text-align:center;
	   color:#ffffff;
	   font-size:20rpx;
}
.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}
.hoverclass{background-color:#F0F0F0}


.hoverclass{background-color:#F0F0F0}

.uni-view{font-size:28rpx}
.bannervs{width:100%;height:100rpx}
.uni-flex{display: flex;flex-direction: row;}
.secul{whdth:690rpx;
	   text-align: center;
	   margin-bottom:10rpx;	
	   position: fixed;
	   left: 0;width: 100%;
	   overflow: hidden; 
	   box-sizing: border-box;	
	   z-index: 998;	
	   transition-property: all;	
	   background:#f0f0f0;
}  
.taball{display: flex;justify-content: space-between;border-bottom:1px solid #d9d9d9}
.secli{height:90rpx;line-height:90rpx;color:#fa160e;
	  width: 100%;z-index: 998;}	
.tab-active{background-color:#ffffff;width:50%;text-align:center;line-height:80rpx}	
.tab-active text{color:#060606;line-height:80RPX}	
.tab-two{color:#040404;background-color:#f8f8f8;width:50%;text-align:center;line-height:80rpx}
.tab-two text{color:#060606;line-height:80RPX}	
</style>
