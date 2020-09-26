<template>
	<view>
		<view class="fabu-top">
			<view class="fabu-title"><text>需求：{{item.title}}</text></view>
			<view class="fabu-nav"> 
			    <view class="fabu-team"><text>{{item.name}}</text></view>
				 <view class="fabu-team"><text>赚：{{item.price}}乐券</text></view>
				 <view class="fabu-team"><text>赚：{{item.dot}}任务点</text></view>
				 <view class="fabu-team"><text>押：{{item.cash_pledge}}乐券</text></view>
			</view>
			<view class="fabu-nav" style="border-top:1px solid #515151;margin-top:40rpx;border-bottom:1px solid #515151;"> 
				<view class="fabu-imgteam ren-suma"><text>{{item.apply_num}}人已赚 </text></view>
				<view class="fabu-imgteam ren-sumb"><text>剩余{{item.max_num-item.apply_num}}人</text></view>
				<view class="fabu-imgteam ren-sumc"><text>编号:{{id}}</text></view>
	
			</view>
		</view>
		<view class="fabu-header">
			<view class="fabu-header-left">
				<image :src="gethead(item.user.user_picture)" style="width:140rpx; height:140rpx"></image>
			</view>
			<view class="fabu-header-mid">
				<view class="fabu-name"> 
				   <text style="height:50rpx;font-size:36rpx;line-height:50rpx;color:#cacaca">{{item.user.nick_name}}</text> 
				 </view>
				<view class="fabu-userinfo" v-if="item.user.real == 1">
					<view  class="fabu-more"><text>已实名认证</text></view>
					<view  class="fabu-more"><text>已缴预付</text></view>
				</view>
				<view class="fabu-userinfo" v-else>
					<view  class="fabu-more"><text>未实名认证</text></view>
					<view  class="fabu-more"><text>已缴预付</text></view>
				</view>
			</view>
			<view class="fabu-header-right">
				{{item.max_num * item.price}}乐券
			</view>
		</view>
		<view class="fabu-one"></view>
		
<!-- 		<view class="fabu-two" >
			<view class="fabu-two-title" style="width:50%"><text>任务链接</text></view>
			<view class="fabu-two-link">
				<text>打开链接</text>
			</view>
			<view class="fabu-two-link" style="background:#000000;color:#FFFFFF">
				<text>复制链接</text>
			</view>
		</view> -->
		<view class="fabu-two" style="border:none">
			<view class="fabu-two-title" style="width:50%"><text>任务步骤</text></view>
		</view>
		<view class="fabu-three"  >
			<view style="width:94%;margin:30rpx auto" v-for="(item,index) in description" :key="index">
				<view><text style="font-size:36rpx;font-weight: bold;">【第{{index+1}}步】</text></view>
				<view style="padding-left:20rpx"><text>{{item}}</text></view>
				<view>
					<image :src="image[index]" style="width:500rpx; margin:80rpx" @click="previewi(index)"></image>
				</view>
			</view>
			<view style="width:94%;margin:30rpx auto" v-for="(item,index) in oimage" :key="index">
				<view>
					<image :src="item" style="width:500rpx; margin:80rpx" @click="previewo(index)"></image>
				</view>
			</view>
		</view>
		<view class="footer">			 
			<view   @click="gotozrwvip(id)" style="color:#ffffff;font-size:36rpx">领取任务</view>
		</view>
		
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config';
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js'
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				id:0,
				item:[],
				description:[],
				image:[],
				oimage:[]
			}
		},
		methods: {
			previewi(index){
			    uni.previewImage({urls: [this.image[index]]});
			},
			previewo(index){
			    uni.previewImage({urls: [this.oimage[index]]});
			},
			gethead(ico){
				if(ico == ''){
					return '../../../static/hxsimg/headerimg.png'
				}else{
					return ico
				}
			},
			gotozrwvip: function(id){
				uni.request({
					url: webUrl + '/api/v4/task/get',  
					data: {id:id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({
								title: '领取成功',
								duration: 2000,
								success(){
									uni.reLaunch({
										url:'/pagesC/zrwflow/zrwflowlist' 
									})
								}
							});
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});
			},
			applydetail:function(){
				uni.request({
					url: webUrl + '/api/v4/task/detail', 
					data: {id:this.id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.item = res.data.data
							let len = this.item.description.length
							let ll = 0
							for(let i=0;i<len;i++){
								if(this.item.description[i] != ''){
									this.description.push(this.item.description[i])
									this.image.push(this.item.step_info[i])
									ll = ll + 1;
								}
							}
							let olen = this.item.step_info.length
							for(let i=ll;i<olen;i++){
								if(this.item.step_info[i] != ''){
									this.oimage.push(this.item.step_info[i])
								}
							}
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});
			},
			copy:function(link){
				uni.setClipboardData({
					data: link,
					success: function () {
						uni.showToast({ title: '复制链接成功'});
					}
				});	
			},
			outlink:function(link,type){
				if(type == 5){
					if(link.substr(0,7).toLowerCase() == "http://" || link.substr(0,8).toLowerCase() == "https://"){
						link = link;
					}else{
						link = "http://" + link;
					}
				}else if(type == 1){
					link = "snssdk1128://app?url=" + link;
				}else if(type == 2){
					link = "kwai://app?url=" + link;
				}else if(type == 3){
					link = "weishiiosscheme://app?url=" + link;
				}else if(type == 4){
					link = "taobao://" + link;
				}else if(type == 6){
					uni.navigateTo({
						url:link
					})
					return false
				}
				plus.runtime.openURL(link);
			},
			geturl:function(ico){
				return  ico
			},
			commit:function(){
				if(this.image[0] == '/static/hxsimg/errorImage.jpg' && this.image.length==1){
					uni.showToast({
						title:'至少要上传一张任务截图',
						icon:'none'
					})
					return false;
				}
				let o = {
					id:this.id,
					image:this.image
				}
				uni.request({
					url: webUrl + '/api/v4/task/commit',  
					data: o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({
								title: '提交成功',
								duration: 2000,
								success(){
									uni.reLaunch({
										url:'/pagesC/zrwflow/zrwflowlist'
									})
								}
							});
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});
			},
			gotozrwrenwu(){
				uni.navigateTo({
					url:'/pagesC/zrwrenwu/zrwrenwu'
				})
			},	
			gotozrwshop(){
				uni.reLaunch({
					url:'/pagesC/zrwflow/zrwflowlist'
				})
			},
			gotologin(){
				uni.navigateTo({
					url:'/pages/login/login?delta=1'
				})
			}
			
		},
		onLoad(e) {
			if(e.id != undefined){
				this.id = e.id
				this.applydetail()
				
			}
		}
	}
</script>

<style>
page,body{background:#000000}
.fabu-top{width:94%;background:#000000;margin:20rpx auto;padding-bottom:100rpx}
.fabu-title{color:#cacaca;line-heighe:30rpx;margin-left:20rpx;margin-bottom:30rpx;font-size:36rpx;white-space:nowrap;overflow:hidden ; text-overflow:ellipsis;}
.fabu-nav{
	width:100%;
	line-height:30rpx;
	display: flex;
	flex-direction:row;
	justify-content: space-between;
	color:#cacaca;
	flex-wrap:wrap;
	}
.fabu-team{font-size:20rpx;width:20%;margin:10rpx 2%;border-radius: 50rpx;
border:1rpx solid #cacaca;text-align:center;}
.fabu-imgteam{
			font-size:24rpx; 
			 margin:10rpx 10rpx; 
			text-align:left;padding-left:30rpx;
			background-size:40rpx;
			background-repeat:no-repeat;
			background-position-x:0;
			background-position-y: 50%;	 
			padding-left:50rpx;
		 }

.fabu-header{margin-top:-100rpx;display: flex;flex-direction: row;justify-content: center;overflow: hidden;
			width:100%;border-top-left-radius:40rpx;border-top-right-radius:40rpx;height:180rpx;background:#ffffff}
.fabu-header-left{width:140rpx;height:140rpx;margin:20rpx;background:#cacaca;border-radius: 90rpx;overflow: hidden;}
.fabu-header-mid{width:300rpx;height:180rpx; }
.fabu-header-right{color:#c77f2b;width:250rpx;height:180rpx;text-align:center;display:flex; justify-content: center;align-items: center;font-size:36rpx;}
.fabu-one{width:100%;height:20rpx;background:#f3f3f3}

.fabu-name{font-size:20rpx;width:100%; text-align:left;height:50%;
         flex-wrap:wrap-reverse;display:flex;
	}
.fabu-userinfo{
	width:100%;
	line-height:30rpx;
	display: flex;
	flex-direction:row;
	justify-content: flex-start;
	color:#cacaca;
	}
.fabu-more{font-size:20rpx;width:50%;margin:10rpx 2%;border-radius:20rpx;border:1rpx solid #cacaca;text-align:center;}
.fabu-two{width:94%;background:#ffffff;padding:10rpx 3% ;display: flex;
	     flex-direction:row;	justify-content: flex-start;border-bottom:1rpx solid #d9d9d9}
.fabu-two-title{line-height:80rpx;font-size:36rpx;font-weight:bold}
.fabu-two-link{height:50rpx;width:20%;border:1px solid #000701;padding:0  20rpx;border-radius:40rpx;margin:15rpx;text-align:center}
.fabu-three{width:100%;min-height:1000rpx;background:#ffffff;padding-top:30rpx;padding-bottom:120rpx}
.footer{
	height: 100upx;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #000000;
	color: #6e6d6b;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 2upx solid #e2e2e2;
	z-index: 99999;
	padding-bottom: env(safe-area-inset-bottom);
}
  .ren-suma{
		  background-image:url(../../../static/hxsimg/ok.png);
	  }
	  .ren-sumb{
	 	   background-image:url(../../../static/hxsimg/headerimg.png);
	   }
	    .ren-sumc{
	    	   background-image:url(../../../static/hxsimg/id.png);
	      }
</style>
