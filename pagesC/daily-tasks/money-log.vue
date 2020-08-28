<template>
	<view>
		<view  class="bannervs bgind bg">			
			<view class="secul">
				<view  class="toppul">
				    <view class="toppli"><text>总数 : </text><text>{{beans}} </text></view>
				</view>
				<view class="taball">
					<view class="secli"  @click="changetab(5)" :class="[tab==5?'tab-active':'']"><text> 正在存款</text> </view>
					<view class="secli"  @click="changetab(6)" :class="[tab==6?'tab-active':'']"><text> 已结束</text> </view>
			    </view>				
			</view>
		</view>
			
		<view class="shoplist"  :class="[tab==5?'taba':'tabaa']">
			<view class="taskli  " v-for="(item,index) in bean" :key="index">
				 <view class="shopli-top uni-flex">
					 <view class="shop-top-title"><text>{{item.title}}(存单ID {{item.id}})</text></view>
					
					 <view class="collect" ><text>生息中</text></view>
				 </view>				
				 <view class="shopli-bottom uni-flex">
					 <view class="shopli-content"> 
					    <view><text>存入量 \n {{item.bean}}</text></view>
						<view><text>总时长/日收益 \n {{item.day}}天/{{item.takings}} </text></view>	
						<view><text>已收益 \n<text>{{item.sum || 0}}</text></text></view>
					 </view>
				 </view>
				 <view class="conduct uni-flex" >
					 <view class="jindu">						 
						 <view class="jdkuang" :style="{width:item.percent+'%'}"> </view>						
					 </view>
					 <view class='jdtiao'>
					      <text>完成进度{{item.percent || 0}}%</text>
					 </view>
				</view>
				 <view class="cdtime uni-flex " >
					<text style="font-size:16rpx;line-height:30rpx">{{item.end_date}} 结束</text>
				 </view>
			</view>
	    </view>
		
		<view class="shoplist history"  :class="[tab==6?'taba':'tabaa']">
			<view class="taskli  liti" v-for="(item,index) in bean" :key="index">
				 <view class="shopli-top uni-flex">
					 <view class="shop-top-title"><text>{{item.title}}</text></view>
					 <view class="shop-top-pre"><text>{{item.sum || 0}}乐豆</text></view>
					 <view class="collect"><text>已结束</text></view>
				 </view>				
				 <view class="shopli-bottom uni-flex">
					 <view class="shopli-content"> 
						<view><text>总时长 \n {{item.day}}天</text></view>						
						<view><text>存入数量 \n {{item.bean}}</text></view>
						<view><text>每日收益 \n {{item.takings}}</text></view>
					 </view>
				 </view>
				 <view class="conduct uni-flex" >
					 <view class="jindu">						 
						 <view class="jdkuang" style="width:100%"> </view>						
					 </view>
					 <view class='jdtiao'>
					      <text>完成进度{{item.percent || 0}}%</text>
					 </view>
				</view>
				 <view class="cdtime uni-flex " >
					<text style="font-size:16rpx;line-height:30rpx">{{item.end_date}} (结束)</text>
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
				tab:5,
				bean:[],
				type:5,
				page:1,
				size:6,
				beans:0,
				contribution:0,
				dot:0,
				house_id:0
			}
		},
	   methods: {
			changetab(i){
				this.tab = i
				this.bean = []
				this.type = i
				this.page = 1
				this.beanlist()
			},
			beanlist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/bean', 
					data: {page:this.page,size:this.size,type:this.type,house_id:this.house_id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.bean = res.data.data.bean
							this.page = this.page + 1
							this.beans = res.data.data.member.point
							this.contribution = res.data.data.member.contribution
							this.dot = res.data.data.member.dot
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/bean', 
					data: {page:this.page,size:this.size,type:this.type,house_id:this.house_id},
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
							this.beans = res.data.data.member.bean
							this.contribution = res.data.data.member.contribution
							this.dot = res.data.data.member.dot
						}
					}
				});
			},
			get:function(id,amount){
				let that = this
				amount = Math.round(amount)
				uni.showModal({
					content: '确认存储乐豆',
					success: function (res) {
						if (res.confirm){
							uni.request({
								url: webUrl + '/api/v4/task/beanstore',  
								data: {id:id,amount:amount},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token')
								},
								success: (res) => {
									if(res.data.status == 'success'){
										uni.showToast({
											title: res.data.data,
											duration:2000,
											success(){
												that.type = 5
												that.tab = 5
												that.page = 1
												that.beanlist()
											}
										});
									}else{
										uni.showToast({
											title: res.data.errors.message,
											icon: "none"
										});
									}
								},error:(res)=>{
									console.log(JSON.stringify(res))
								}
							});
						}else if (res.cancel) {
							
						}
					}
				})
			},
			harvest:function(id){
				let that = this
				uni.showModal({
					content: '确认收取该任务？',
					success: function (res) {
						if (res.confirm){
							uni.request({
								url: webUrl + '/api/v4/task/beanharvest',  
								data: {id:id},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token')
								},
								success: (res) => {
									if(res.data.status == 'success'){
										uni.showToast({
											title: res.data.data,
											duration:2000,
											success(){
												that.type = 2
												that.tab = 2
												that.page = 1
												that.beanlist()
											}
										});
									}else{
										uni.showToast({
											title: res.data.errors.message,
											icon: "none"
										});
									}
								},error:(res)=>{
									console.log(JSON.stringify(res))
								}
							});
						}else if (res.cancel) {
							
						}
					}
				})
			}
		},
		onLoad(e){
			if(e.id != undefined){
				this.house_id = e.id
			}
			this.beanlist()
		},
		onNavigationBarButtonTap(e) {
				uni.navigateTo({
					url:"../../pagesC/jiaoyi/shopjiaoyi"
				});
				
			},

		onReachBottom(){
			if(this.page != 1){
				this.morelist()
			}
		}
	}
</script>

<style>
page,body{background-color:#000000}
.bg{background-color:#000000}


.img100{width:100%;height:100%}
.bgind{background-size:100% 100%; background-repeat: no-repeat;}
.uni-view{font-size:28rpx}
.bannervs{width:100%;height:250rpx;}
.uni-flex{display: flex;flex-direction: row;}
.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}

.secul{whdth:690upx;height:220upx;padding-top:30rpx;
		text-align: center;margin-bottom:10rpx;	position: fixed;left: 0;width: 100%;overflow: hidden; 
		box-sizing: border-box;	z-index: 998;	transition-property: all;	background:#000000;
}   
.toppul{whdth:680upx;
		height:80upx;
		line-height:80rpx;
		color:#ffffff;
		display: flex;
		justify-content: center;
		text-align: center;
			
}
.toppli{
        height:80rpx;
		line-height:80rpx;
		color:#ffffff;
		margin:0 auto;
		border-radius:50rpx;
		background-image:url(../../static/weike/doumoney.png);
		background-size:60rpx;
		background-position: 5% 50%;
		background-repeat: no-repeat;
		font-size:30rpx ;
		text-align:left;
		padding-left:90rpx
		}
.taball{display: flex;justify-content: space-between;}
.secli{width:50%;height:80rpx;line-height:80rpx;color:#ffffff;
		left: 0;width: 100%;z-index: 998;}		   


.tab-active{color:#ffffff;}	
.tab-active text{color:#ffffff;border-bottom:6rpx solid #ffffff;padding-bottom:15rpx}	
.taba{display:block}
.tabaa{display:none}


.shoplist{ margin:0 auto; width:700rpx; height:auto; margin-top:-30rpx;  border-radius: 20rpx; z-index: 999;padding-top:15rpx;}
.taskli{width:690rpx;border-radius: 25rpx;border:1rpx solid #e1e1e1;
        overflow:hidden;margin:15rpx auto;	height:270rpx;background-color:#ffffff;}
.shopli-top{width:690rpx;height:80rpx;color:#000000; justify-content:space-between;  line-height:80rpx;	border-bottom:1rpx solid #e3e3e3;}
.shop-top-title{
	line-height:80rpx;
	padding-left:60rpx;
	font-size:28rpx;
	color:#000000;
	font-weight:bold;
	background-image:url(../../static/weike/doumoney.png);
	background-size:32rpx;
	background-position: 20rpx 50%;
	background-repeat: no-repeat;

}
.shop-top-pre{line-height:80rpx;padding-right:30rpx;color:#09BB07}
.shopli-bottom{width:690rpx;height:100rpx;justify-content:space-between}
.shopli-bottom-content{line-height:40rpx;height:120rpx;padding-left:30rpx;width:470rpx;flex-direction:column;font-size:20rpx;margin-bottom:10rpx;}
.shopli-bottom-content text{font-size:20rpx}
.shopli-bottom-buy{margin:30rpx 0;width:160rpx;height:50rpx;border-radius: 20rpx;background-color:#FFA538;color:#ffffff;text-align:center;margin-right:20rpx;line-height:50rpx}

.conduct{width:690rpx;height:30rpx;justify-content:space-between;margin-top:10rpx}
.shopli-content{
		line-height:30rpx;
		height:100rpx;
		width:100%;
		font-size:20rpx;
		justify-content:space-around;
		display: flex;
		text-align:center;
		font-size:20rpx;
}
.jindu{height:10rpx;width:50%;border:1rpx solid #000000;border-radius: 10rpx;overflow:hidden;margin-left:10%;margin-top:10rpx;margin-bottom:10rpx;justify-content:space-between}
.jdkuang{background:#e7cd36;height:30rpx;width:80%;line-height:30rpx;text-align:center}
.jdtiao{font-size:8rpx;line-height:30rpx;margin-right:10%}
.cdtime{width:60%;text-align:center;height:30rpx;padding-left:70rpx}
.collect{width:150rpx;height:50rpx;margin-top:15rpx;border-radius: 15rpx;background-color:#e7cd36;color:#ffffff;text-align:center;margin-right:60rpx;line-height:50rpx}
.hcollect{width:150rpx;height:50rpx;margin-top:15rpx;border-radius: 15rpx;background-color:#818181;color:#ffffff;text-align:center;margin-right:30rpx;line-height:50rpx}
.history{ }
.history .collect{background-color:#818181;}
.history .jdkuang{background:#818181;}
</style>
