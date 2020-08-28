<template>
	<view>
		<view  class="bannervs bgind bg ">			
			<view class="secul">
				<view  class="toppul">
				    <view class="toppli"> <text>乐豆\n</text><text>{{beans}} </text></view>
					<view class="toppli"> <text>贡献值\n</text><text>{{contribution}}</text></view>
					<view class="toppli"> <text>任务点\n</text><text>{{dot}}</text></view>
				</view>
				<view class="taball">
					<view class="secli"  @click="changetab(1)" :class="[tab==1?'tab-active':'']"><text>可承接</text>  </view>
					<view class="secli"  @click="changetab(2)" :class="[tab==2?'tab-active':'']"><text> 正在进行</text> </view>
					<view class="secli"  @click="changetab(3)" :class="[tab==3?'tab-active':'']"><text> 已结束</text> </view>
			    </view>				
			</view>
		</view>
		<view class="shoplist"  :class="[tab==1?'taba':'tabaa']">
			 <view class="taskli  liti" v-for="(item,index) in bean" :key="index">
				 <view class="shopli-top uni-flex">
					 <view class="shop-top-title"><text>{{item.title}}</text></view>
					 <view class="shop-top-pre" v-if="item.need_bean>0"><text>需抵押{{item.need_bean}}乐豆</text></view>
					 <view class="shop-top-pre" v-else><text>消耗{{item.price}}乐享值</text></view>
				 </view>				
				 <view class="shopli-bottom uni-flex">
					 <view class="shopli-bottom-content"> 
					    <text>任务周期：{{item.day}}天\n</text>						
			 			<text>完成收益：{{item.get_bean-item.need_bean}}个乐豆\n</text>
						<text>获贡献值：{{item.contribution}}点</text>
					 </view>
					 <view class="shopli-bottom-buy" @click="get(item.id)"><text>承接任务</text></view>
				 </view>
			 </view>			
		</view>	
			
		<view class="shoplist"  :class="[tab==2?'taba':'tabaa']">
			<view class="taskli  liti" v-for="(item,index) in bean" :key="index" style="height:250rpx">
				 <view class="shopli-top uni-flex">
					 <view class="shop-top-title"><text>{{item.title}}</text></view>
					 <view class="shop-top-pre"><text> {{item.sum || 0}}乐豆</text></view>
					 <view class="hcollect" v-if="item.is_harvest"><text>已收取</text></view>
					 <view class="collect" @click="harvest(item.id)" v-else><text>收取</text></view>
				 </view>				
				 <view class="shopli-bottom uni-flex">
					 <view class="shopli-content"> 
						<view><text>总时长 \n {{item.day}}天</text></view>						
						<view><text>总收益 \n {{item.get_bean}}</text></view>
						<view><text>贡献值 \n {{item.contribution}}点</text></view>
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
		
		<view class="shoplist history"  :class="[tab==3?'taba':'tabaa']">
			<view class="taskli  liti" v-for="(item,index) in bean" :key="index">
				 <view class="shopli-top uni-flex">
					 <view class="shop-top-title"><text>{{item.title}}</text></view>
					 <view class="shop-top-pre"><text>{{item.sum || 0}}乐豆</text></view>
					 <view class="collect"><text>已结束</text></view>
				 </view>				
				 <view class="shopli-bottom uni-flex">
					 <view class="shopli-content"> 
						<view><text>总时长 \n {{item.day}}天</text></view>						
						<view><text>总收益 \n {{item.get_bean}}</text></view>
						<view><text>贡献值 \n {{item.contribution}}点</text></view>
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
				tab:2,
				bean:[],
				type:1,
				page:1,
				size:6,
				beans:0,
				contribution:0,
				dot:0
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
					data: {page:this.page,size:this.size,type:this.type},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.bean = res.data.data.bean
							this.page = this.page + 1
							this.beans = res.data.data.member.bean
							this.contribution = res.data.data.member.contribution
							this.dot = res.data.data.member.dot
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/bean', 
					data: {page:this.page,size:this.size,type:this.type},
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
			get:function(id){
				let that = this
				uni.showModal({
					content: '确认承接该任务？',
					success: function (res) {
						if (res.confirm){
							uni.request({
								url: webUrl + '/api/v4/task/beanget',  
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
			this.changetab(2);
			this.beanlist();
			
		},
		onReachBottom(){
			if(this.page != 1){
				this.morelist()
			}
		}
	}
</script>

<style>
page,body{background-color:#231e1e}
.bg{background-color:#000000}


.img100{width:100%;height:100%}
.bgind{background-size:100% 100%; background-repeat: no-repeat;}
.uni-view{font-size:28rpx}
.bannervs{width:100%;height:250rpx;}
.uni-flex{display: flex;flex-direction: row;}
/* .liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}
 */
.secul{whdth:690upx;height:220upx;padding-top:30rpx;
		text-align: center;margin-bottom:10rpx;	position: fixed;left: 0;width: 100%;overflow: hidden; 
		box-sizing: border-box;	z-index: 998;	transition-property: all;	background:#000000;
}   
.toppul{whdth:680upx;height:80upx;display: flex;justify-content: space-between;text-align: center; }
.toppli{width:50%;height:80rpx;line-height:40rpx;color:#eb9414;margin:0 20rpx;border-radius:50rpx}
.taball{display: flex;justify-content: space-between;}
.secli{width:50%;height:60rpx;line-height:60rpx;color:#eb9414;
		left: 0;width: 100%;border-radius:20rpx;z-index: 998;margin:0 30rpx;margin:0 30rpx;
		margin-top:20rpx;background:#4d3d39}		   


.tab-active{color:#ffffff;background:#eb9414;}	
.tab-active text{color:#ffffff;padding:5rpx 10rpx}	
.taba{display:block}
.tabaa{display:none}


.shoplist{  width:750rpx; height:auto; margin-top:-30rpx; background-color:#231e1e; border-radius: 20rpx; z-index: 999;padding-top:15rpx;}
.taskli{background:#000000;color:#9f9f9f;width:690rpx;border-radius: 15rpx;border:1rpx solid #e1e1e1;overflow:hidden;margin:15rpx 30rpx;	height:220rpx;}
.shopli-top{width:690rpx;height:80rpx;color:#e7802b; background:#020202;justify-content:space-between;  line-height:80rpx;	border-bottom:1rpx solid #3b3b3b;}
.shop-top-title{line-height:80rpx;padding-left:20rpx;font-size:28rpx;color:#e7802b;font-weight:bold;}
.shop-top-pre{line-height:80rpx;padding-right:30rpx;color:#e7802b}
.shopli-bottom{width:690rpx;height:100rpx;justify-content:space-between}
.shopli-bottom-content{line-height:40rpx;height:120rpx;padding-left:30rpx;width:470rpx;flex-direction:column;font-size:20rpx;margin-bottom:10rpx;}
.shopli-bottom-content text{font-size:24rpx}
.shopli-bottom-buy{margin:30rpx 0;width:160rpx;height:50rpx;border-radius: 20rpx;background-color:#e7802b;color:#ffffff;text-align:center;margin-right:20rpx;line-height:50rpx}

.conduct{width:690rpx;height:30rpx;justify-content:space-between;}
.shopli-content{
		line-height:30rpx;
		height:100rpx;
		width:100%;
		font-size:20rpx;
		justify-content:space-around;
		display: flex;
		text-align:center;
		font-size:24rpx;
}
.jindu{height:10rpx;width:50%;border:1rpx solid #000000;border-radius: 10rpx;overflow:hidden;margin-left:10%;margin-top:10rpx;margin-bottom:10rpx;justify-content:space-between}
.jdkuang{background:#ff0000;height:30rpx;width:80%;line-height:30rpx;text-align:center}
.jdtiao{font-size:24rpx;line-height:30rpx;margin-right:10%}
.cdtime{width:60%;text-align:center;height:30rpx;padding-left:70rpx}
.collect{width:150rpx;height:50rpx;margin-top:15rpx;border-radius: 15rpx;background-color:#e7802b;color:#ffffff;text-align:center;margin-right:30rpx;line-height:50rpx}
.hcollect{width:150rpx;height:50rpx;margin-top:15rpx;border-radius: 15rpx;background-color:#818181;color:#ffffff;text-align:center;margin-right:30rpx;line-height:50rpx}
.history{ }
.history .collect{background-color:#818181;}
.history .jdkuang{background:#818181;}
</style>
