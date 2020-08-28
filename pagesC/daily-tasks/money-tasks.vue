<template>
	<view>
		<view  v-bind:style="{background: 'url('+imageURL+')',backgroundSize:'100%'}"  class="bannervs bgind">			
			
		</view>
		<view class="shoplist">
			 <view class="taskli  liti" v-for="(item,index) in bean" :key="index">
				 <view class="shopli-top uni-flex">
					 <view class="shop-top-title uni-flex">
						 <view style="margin-right:10rpx;border-radius: 50rpx;width:50rpx;height:50rpx;color:#ffffff;background-color:#e7cd36;text-align:center"><text>保</text></view>
						 <view><text>存券生息</text></view>
					 </view>
					 <view class="shop-top-pre" @click="log(item.id)"><text>已存:{{item.sum}} 【收益】 </text></view>
				 </view>				
				 <view class="shopli-mid uni-flex" style="padding-top:20rpx">
					 <view class="shopli-mid-left"> 
					    <text style="font-size:50rpx;line-height:70rpx;color:#000000">{{item.percent || 0}}%\n</text>						
			 			<text style="font-size:20rpx;line-height:30rpx">预期收益\n</text>
					 </view>
					 <view class="shopli-mid-conter" style="line-height:80rpx">
						<view class="doumoney"><text style="line-height:50rpx"> {{item.min_bean}} 个起存</text></view> 
						<view  class="datatime"><text style="line-height:50rpx"> {{item.day}}个自然日</text></view>
					 </view>
					 <view class="shopli-mid-right" >
					 	 <view class="deposit" @click="set(item.id,item.min_bean)"> <text> 存入 </text></view>
					 </view>
				 </view>
				 <view class="shopli-mid-bottomone uni-flex" >
				 		<text class="cld9d9d9 fz28"> 项目规模：{{item.scale_bean}}乐券日付息，到期还本  </text>			
				 </view>
				 <view class="shopli-mid-bottomtwo uni-flex" >
				 	<view class="conduct uni-flex" >
					     <view >
							 <text class="fz28">完成进度:</text>
						 </view>
				 		 <view class="jindu">						 
				 			 <view class="jdkuang" :style="{width:item.percents+'%'}"> </view>						
				 		 </view>
				 		 <view class='jdtext'>
				 		      <text>{{item.percents || 0}}%</text>
				 		 </view>
				 	</view>			
				 </view>
			 </view>
			 
	    </view>			
		<uni-popup :show="showBase" type="middle" v-on:hidePopup="handleClose('base')">
			<view class="attr-goods-box">
				<view class="attr-goods-number">
					<text class="tit">存入数量</text>
					<view class="stepper">
						<uni-number-box :value="num" :min="num" :max="1000000" @change="bindChange"></uni-number-box>
				    </view>
				</view>
				<view class="attr-goods-number">
					<text class="tit">支付密码</text> 
					<view class="stepper">
						<input type="password" name="password" placeholder="请输入6位支付密码" v-model="password" class="inp-100" />
				    </view>
				</view>
				<view class="btn-bar" >
					<block>
						<view class="btn btn-red" @click="get()">确定</view>
					</block>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config'
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue"
	import universal from '@/common/mixins/universal.js'
	import isLogin from '@/common/mixins/isLogin.js'
	import uniPopup from '@/components/uni-popup.vue'
	import uniNumberBox from '@/components/uni-number-box.vue'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				tab:4,
				bean:[],
				type:4,
				page:1,
				size:6,
				beans:0,
				num:100,
				password:'',
				id:0,
				showBase:false,
				imageURL:"https://task.dtionuoaa.vip/bgimg/deposit.png"	
			}
		},
		components: {
			uniNumberBox,
			uniPopup
		},
	   methods: {
		    log(id){
				uni.navigateTo({
					url:'/pagesC/daily-tasks/money-log?id='+id
				})
			},
			bindChange(e){
				this.num = e
			},
			//关闭Popup
			handleClose(val){
				if(val == 'rule'){
			        this.ruleShow = false
			    }else if(val == 'base'){
					this.showBase = false
				}
				this.page = 1
				this.bean = []
				this.beanlist()
			},
			changetab(i){
				this.tab = i
				this.type = i
				this.page = 1
				this.beanlist()
			},
			beanlist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/bean', 
					data: {
						page:this.page,
						size:this.size,
						type:this.type
					},
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
			set:function(id,min){
				this.id = id
				this.num = Math.round(min)
				this.showBase = true
			},
			get:function(){
				if(this.password.trim() == ''){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'支付密码不能为空'
					})
					return false;
				}
				uni.request({
					url: webUrl + '/api/v4/task/beanstore',  
					data: {id:this.id,amount:this.num,password:this.password},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.handleClose('base')
							uni.showToast({
								title: res.data.data,
								duration:2000
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
		onNavigationBarButtonTap(e) {
				uni.navigateTo({
					url:"../../pagesC/jiaoyi/shopjiaoyi"
				});
				
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
page,body{background-color:#ffffff}
.bg{background-color:#00aa00}
.inp-100{height:27upx;line-height:27upx;font-size:23upx;color:#000000;border:1upx solid #d2d6dd;padding: 1upx 1upx 1upx 1upx;text-align:center;} 


.img100{width:100%;height:100%}
.bgind{background-size:100%; background-repeat: no-repeat;}
.uni-view{font-size:24rpx}
.bannervs{width:100%;height:350rpx;}
.uni-flex{display: flex;flex-direction: row;}
.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}

.shoplist{  width:750rpx; height:auto; margin-top:-30rpx; background-color:#ffffff; border-radius: 20rpx; z-index: 999;padding-top:15rpx;}
.taskli{width:690rpx;border-radius: 25rpx;border:1rpx solid #e1e1e1;overflow:hidden;margin:15rpx 30rpx;	height:350rpx;}
.shopli-top{
	width:690rpx;
	height:80rpx;
	color:#000000;
	justify-content:space-between;  
	line-height:80rpx;	
	border-bottom:1rpx solid #e3e3e3;
}
.shop-top-title{
	line-height:80rpx;
	padding:15rpx 0;
	padding-left:20rpx;
	font-size:28rpx;
	color:#000000;
	font-weight:bold;
}
.shop-top-pre{line-height:80rpx;padding-right:30rpx;color:#e7cd36}
.shopli-mid{width:690rpx;height:120rpx;justify-content:space-between}

.shopli-mid-left{
	line-height:40rpx;
	height:120rpx;
	padding-left:30rpx;
	width:200rpx;
	flex-direction:column;
	font-size:20rpx;
	margin-bottom:10rpx;
	border-right:1rpx solid #cfcfcf;
	text-align:center
	}
.shopli-mid-left text{font-size:20rpx}

.shopli-mid-conter{width:270rpx;line-height:80rpx}
.shopli-mid-right{padding-right:20rpx; }
.shopli-mid-bottomone{padding-left:40rpx;margin-top:10rpx}
.shopli-mid-bottomtwo{padding-left:40rpx}

.conduct{width:690rpx;height:50rpx;justify-content:flex-start;}
.jindu{
	height:20rpx;
	width:50%;
	border:1rpx solid #000000;
	border-radius: 10rpx;
	overflow:hidden;
	margin:15rpx;
	justify-content:flex-start
}
.jdkuang{background:#ff0000;height:30rpx;width:80%;line-height:30rpx;text-align:center}
.jdtext{font-size:28rpx;line-height:50rpx;margin-right:40rpx}
.cdtime{width:60%;text-align:center;height:30rpx;padding-left:70rpx}

.deposit{
	margin:30rpx 0;width:120rpx;
	height:60rpx;border-radius: 15rpx;
	background-color:#000000;
	color:#ffffff;
	text-align:center;
	line-height:60rpx;	
	}
.cld9d9d9{color:#d9d9d9}
.fz28{font-size:28rpx;}
.doumoney{
	background-image:url(../../static/weike/doumoney.png);
	background-size:13%;
	background-position: 0 50%;
	background-repeat: no-repeat;
	padding-left:40rpx

}
.datatime{background-image:url(../../static/weike/datatime.png);
    background-size:13%;
	background-position: 0 50%;
	background-repeat: no-repeat;
	padding-left:40rpx
}

.attr-goods-box{ position: relative; }
.attr-goods-box .attr-goods-header{ padding: 10upx; }
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
.attr-goods-box .attr-goods-content .sku-item .sku-list text.active{ border-color: #000000; color: #000000;}
.attr-goods-box .attr-goods-number{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding:20upx 20upx 30upx 20upx;}
.attr-goods-box .attr-goods-number .tit{text-align: left; font-size:30rpx;color: #888;padding:0 15rpx}
.attr-goods-box .attr-goods-number .stepper{ flex: 1 1 0%; display: flex; justify-content: flex-end;}
</style>
