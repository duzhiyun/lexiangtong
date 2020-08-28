<template>
<view>
	<view class="secul">
		<view class="secli"  @click="changetab(1)" :class="[tab==1?'tab-active':'']">创始团队  </view>
		<view class="secli"  @click="changetab(2)" :class="[tab==2?'tab-active':'']"> 创始股东 </view>
		<view class="secli"  @click="changetab(3)" :class="[tab==3?'tab-active':'']"> 创始合伙人 </view>
	</view>
	<view style="width:100%;height:80rpx"></view>
	
	<view class="wklist  uc-page03 nons" :class="[tab==1?'taba':'']">
		<view class="userlist" v-for="(item,index) in bean" :key="index">
			<view class="userul liti"> 
			    <view class="usertitle">
				   <view class="user-title-name">创始团队 </view>
				   <view class="usermoney">     {{item.reward}} (待释放)    </view>
				</view>
				<view class="userleft">
					<view class="userimg"><image src="../../static/hxsimg/headerimg.png" class="u-img"></image></view>
					<view class="user-name">					
						<view class="username"><text>{{item.nick_name}} </text></view>
						<view class="account"><text>{{item.mobile}}</text></view>
					</view>
				</view>
				<view  class="userright ovc">					
					<view class="userint">释放数量：{{item.percent}}%/月</view>	
					
					<view class="userendtime">释放时间：{{item.update_date}}</view>
				</view>							
			</view>
	
		</view>	
	</view>	  

	<view class="wklist  nons" :class="[tab==2?'taba':'']">
		<view class="userlist" v-for="(item,index) in bean" :key="index">
			<view class="userul liti"> 
			    <view class="usertitle">
				   <view class="user-title-name">创始股东 </view>
				   <view class="usermoney">     {{item.reward}} (待释放)    </view>
				</view>
				<view class="userleft">
					<view class="userimg"><image src="../../static/hxsimg/headerimg.png" class="u-img"></image></view>
					<view class="user-name">					
						<view class="username"><text>{{item.nick_name}} </text></view>
						<view class="account"><text>{{item.mobile}}</text></view>
					</view>
				</view>
				<view  class="userright ovc">					
					<view class="userint">释放数量：{{item.percent}}%/月</view>	
					
					<view class="userendtime">释放时间：{{item.update_date}}</view>
				</view>							
			</view>
	
		</view>	
	</view>
	<view class="wklist  nons" :class="[tab==3?'taba':'']">
		<view class="userlist" v-for="(item,index) in bean" :key="index">
			<view class="userul liti"> 
			    <view class="usertitle">
				   <view class="user-title-name">联合创始人 </view>
				   <view class="usermoney">     {{item.reward}} (待释放)    </view>
				</view>
				<view class="userleft">
					<view class="userimg"><image src="../../static/hxsimg/headerimg.png" class="u-img"></image></view>
					<view class="user-name">					
						<view class="username"><text>{{item.nick_name}} </text></view>
						<view class="account"><text>{{item.mobile}}</text></view>
					</view>
				</view>
				<view  class="userright ovc">					
					<view class="userint">释放数量：{{item.percent}}%/月</view>	
					
					<view class="userendtime">释放时间：{{item.update_date}}</view>
				</view>							
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
				bean:[],
				tab:1,
				type:7,
				page:1,
				size:6
			}
		},
		methods: {
			changetab(i){
				this.tab = i
				this.bean = []
				this.page = 1
				this.beanlist()
			},
			beanlist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/bean', 
					data: {page:this.page,size:this.size,type:this.type,status:this.tab},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.bean = res.data.data.bean
							this.page = this.page + 1
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/bean', 
					data: {page:this.page,size:this.size,type:this.type,status:this.tab},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.bean.length;
							for(let i=0;i<len;i++){
								this.bean.push(res.data.data.bean[i])
							}
							this.page = this.page + 1
						}
					}
				});
			}
		},
		onLoad(e){
			this.beanlist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.morelist()
			}
		}
		 
	}
</script>
<style>
	.secul{whdth:690upx;height:80upx;display: flex;justify-content: space-between;
	       text-align: center;margin-bottom:10rpx;border:1px solid #FFFfFF;
		   position: fixed;
		   left: 0;
		   width: 100%;
		   overflow: hidden; 
		   box-sizing: border-box;
		   z-index: 998;
		   transition-property: all;
		   }   
	.secli{width:50%;height:80rpx;line-height:80rpx;
		   color:#000000;
		   }		   
	.tab-active{background-color:#ffffff;color:#aa0000}	
	.nons{display:none}	
	.taba{display:block}
	 
	.uni-input{height:80upx}
	
	.userul{
		width:710rpx;
		height:220rpx;
		border:1rpx solid #00aa00;
		margin:20rpx auto;
		align-items:center;
		flex-wrap:wrap;display: flex; flex-direction:row;
		border-radius: 15rpx;
		background-color:#ffffff;
	}
	.usertitle{
		border-bottom:1rpx solid #d9d9d9 ;
		width:710rpx;
		height:60rpx;

		align-items:center;
		justify-content:space-around;
		display: flex;
	}
	.user-title-name{
		width:50%;   
		height:60rpx; 
		line-height:60rpx;
		padding-left:30rpx;
		display: flex;
	}
	.usermoney{
		width:50%;   
		height:60rpx;
		line-height:60rpx;
		padding-left:40rpx;
		display: flex;
		background-image:url(../../static/weike/doumoney.png);
		background-size:30rpx;
		background-position: 0 45%;
		background-repeat: no-repeat;
	   
	}
	.userleft{
		align-items:center;
		display: flex;
		justify-content: space-between;	
		width:45%;
		}
	.userright{
		align-items:center;
		display: flex;
		justify-content: space-between;		
		width:55%;
		background-image:url(../../static/weike/jianbei.png);
		background-size:15%;
		background-position: 95% 25%;
		background-repeat: no-repeat;
		}	
	.userimg{width:120rpx;height:120rpx}
	.user-name{width:230rpx;height:150rpx}
	.username{width:100%;height:75rpx; align-items:flex-end;display: flex;}
	.account{width:100%; height:75rpx;  align-items:stretch; display: flex;}
    .u-img{width:100rpx;height:100rpx;border-radius:50rpx;margin:10rpx}
	.ovc{flex-wrap:wrap;display: flex; flex-direction:row;}	
	.userint{width:80%;     height:75rpx;align-items:flex-end;display: flex;}
	.userendtime{width:100%;height:75rpx;align-items:stretch;display: flex;}
	.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}
	
</style>
