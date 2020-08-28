<template>
	<view>
		<view class="secul">
			<view class="secli"  @click="changetab('a')" :class="[tab=='a'?'tab-active':'']">未审核</view>
			<view class="secli"  @click="changetab('b')" :class="[tab=='b'?'tab-active':'']">已通过</view>
			<view class="secli"  @click="changetab('c')" :class="[tab=='c'?'tab-active':'']">未通过</view>
			<view class="secli"  @click="changetab('d')" :class="[tab=='d'?'tab-active':'']">已放弃</view>
		</view> 	
        <view style="width:100%;height:80rpx"></view>
		
		<view class="wklist  uc-page03 nons" :class="[tab=='a'?'taba':'taba']">
			<view class="fblist" v-for="(item,index) in apply" :key="index">
				<view class="uli uni-flex liti">
					<view class="uli-left">						
						<view class="image-view"><image :src="geturl(item.ico)" class="imgcss"></image></view>
						<view class="grade" v-if="item.level == 0"><span>普通会员</span></view>
						<view class="grade" v-if="item.level == 1"><span>VIP会员</span></view>
						<view class="grade" v-if="item.level == 2"><span>白银VIP</span></view>
						<view class="grade" v-if="item.level == 3"><span>黄金VIP</span></view>
						<view class="grade" v-if="item.level == 4"><span>铂金VIP</span></view>
						<view class="grade" v-if="item.level == 5"><span>钻石VIP</span></view>
					</view>
					<view  class="uli-mide">					
						<view style="display: flex;justify-content:space-between;">							
						    <span>标题:{{item.title}}</span>							
						</view>
						<view style="display: flex;justify-content:space-between;">
							<span>提交:{{item.create_date}}</span>
							<span>【编号:{{item.id}}】</span>
						</view>
						<view style="display: flex;justify-content:space-between;">	
							<view>用户:{{item.nick_name}}</view>
							<view class="ulimoney" style="color:#ff0000">{{item.price}}</view>
						</view>	
						
					</view>
				</view>				
				<view class="uni-flex chaozuo" v-if="item.status == 1">
					<view class="libox"  @click="gotourl(item.id)">						
						查阅审核
					</view>
					<view  class="libox" @click="pass(item.id)">					
						直接通过			
					</view>					
				</view>
				<view class="uni-flex chaozuo" v-if="item.status == 2">
					<view class="libox"  @click="gotourl(item.id)">						
						查阅详情
					</view>
					<view  class="libox">					
						任务已通过			
					</view>					
				</view>
				<view class="uni-flex chaozuo" v-if="item.status == -1">
					<view class="libox"  @click="gotourl(item.id)">						
						查阅详情
					</view>
					<view  class="libox">					
						任务已失败			
					</view>					
				</view>
				<view class="uni-flex chaozuo" v-if="item.status == -2">
					<view class="libox"  @click="gotourl(item.id)">						
						查阅详情
					</view>
					<view  class="libox">					
						任务已放弃		
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
				tab:'a',
				status:1,
				apply:[],
				page:1,
				size:6,
				type:3,
				task_id:0
			}
		},
		methods: {
			applylist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/apply', 
					data: {page:this.page,size:this.size,status:this.status,type:this.type,task_id:this.task_id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.apply = res.data.data
							this.page = this.page + 1
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/apply', 
					data: {page:this.page,size:this.size,status:this.status,type:this.type,task_id:this.task_id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.length;
							for(let i=0;i<len;i++){
								this.apply.push(res.data.data[i])
							}
							this.page = this.page + 1
						}
					}
				});
			},
			geturl:function(ico){
				return  ico
			},
			changetab:function(i){
				this.tab = i
				if(i == 'a'){
					this.status = 1
				}else if(i == 'b'){
					this.status = 2
				}else if(i == 'c'){
					this.status = -1
				}else if(i == 'd'){
					this.status = -2
				}
				this.page = 1
				this.applylist();
			},
			pass:function(id){
				let that = this
				uni.showModal({
					content: '确认审核通过？',
					success: function (res) {
						if (res.confirm) {
							uni.request({
								url: webUrl + '/api/v4/task/pass',  
								data: {id:id},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token')
								},
								success: (res) => {
									if(res.data.status == 'success'){
										uni.showToast({
											title: '审核成功',
											duration: 2000,
											success(){
												that.status = 2
												that.tab = 'b'
												that.page = 1
												that.applylist();
											}
										});
									}else{
										uni.showToast({ title: res.data.errors.message, icon: "none" });
									}
								},error:(res)=>{
									console.log(JSON.stringify(res))
								}
							});
						}else if (res.cancel) {
							
						}
					}
				});
			},
			gotourl(id){
				uni.navigateTo({			
					url:'/pagesC/zrwrwfb/toexamine/toexamine?id='+id						
				})
			}
		},
		onLoad(e){
			if(e.id != undefined){
				this.task_id = e.id
			}
			this.page = 1
			this.applylist();
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
		   background:#f5f5f5;
		   }		   
	.tab-active{background-color:#ffffff;color:#aa0000}	
	.nons{display:none}	
	.taba{display:block}
	.duicon24{height:44upx;width:44upx}
	.uni-input{height:80upx}
	.wklist{width:692rpx;height:auto;margin:0 auto}
	
.fblist	{
	width:100%;height:220rpx;border-radius: 15rpx;
	border:1rpx solid #e1e1e1;overflow:hidden;margin:30rpx 0;
	display: flex; flex-direction:column
	}
.uli{
	width:100%;height:180rpx;
	border-bottom:1rpx solid #e1e1e1;overflow:hidden;
	display: flex;justify-content:space-between;
 }
.chaozuo{
	 justify-content:space-between;
 }
.libox{height:60rpx;text-align:center;font-size:24rpx;line-height:60rpx;flex-grow:1;border-right:1px solid #d9d9d9}
.libox:last-child{border:none}	
		 
	.uli-left{width:120rpx;height:180rpx;}
	.grade{width:120rpx;height:40rpx;color:#000000;line-height:40rpx;text-align:center;font-size:24rpx}
	.image-view{width:120rpx;height:120rpx}
	.imgcss{width:90rpx;height:90rpx;margin:15rpx;margin-bottom:15rpx}
	.uli-mide{line-height:40rpx;padding:0rpx 20rpx;width:620rpx}
	.sums{margin-left:20rpx;min-width:120rpx;padding-left:10rpx;padding-right:10rpx;color:#d81e07;
	      height:45rpx;border-radius: 15rpx;top:0;z-index: 1;border:2rpx solid #d81e07;line-height:45rpx}	  
	.uliname{width:60%;height:40rpx}
	.ulimoney{
		width:150rpx;
		text-align:right;color:#d81e07;
		line-height:50rpx;height:50rpx;font-weight: bold;
		background-image:url(/static/weike/ulimoney.png);
		background-size: 20%;
		background-repeat: no-repeat;
		background-position: 100% 50%;
		padding-right: 20px;
	}
	
</style>

