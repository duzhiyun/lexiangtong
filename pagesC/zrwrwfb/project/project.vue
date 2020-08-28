<template>
	<view>
		<view class="secul">
			<view class="secli"  @click="changetab(1)" :class="[tab==1?'tab-active':'']"> 进行中</view>
			<view class="secli"  @click="changetab(2)" :class="[tab==2?'tab-active':'']"> 已完成</view>
		</view>
		
		<view style="width:100%;height:80rpx"></view>	

		<view class="wklist  uc-page03 nons" :class="['taba']" >
			
			<view class="fblist"  v-for="(item,index) in task" :key="index">
				<view class="uli uni-flex liti">
					<view class="uli-left">						
						<view class="image-view"><image :src="item.tushi" class="imgcss"></image></view>
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
						<view style="display: flex;justify-content:space-between;color:#ff0000">	
							<span>金额:{{item.price}}/{{item.price * item.max_num}}</span>
							<span>完成:{{item.apply_num}}/{{item.max_num}}</span>
						</view>	
						<view style="display: flex;justify-content:space-between;">	
							<span>结束:{{item.end_date}}</span>
							<span>【编号:{{item.id}}】</span>
						</view>
					</view>
				</view>				
				<view class="uni-flex chaozuo">
					<view class="libox"  @click="gotozrwrenwu(item.id)">
						审核
					</view>
					<view  class="libox"  @click="gotozrwvip(item.id)">
						编缉
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
				array:['普通任务','VIP会员','白银VIP','黄金VIP','铂金VIP','钻石VIP'],
				cate:['所有类型'],
				index:0,
				cindex:0,
				task:[],
				page:1,
				size:6,
				level:-1,
				cid:-1,
				get:false,
				tab:1,
				zt:'3'
			}
		},
		methods: {
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
						}
					}
				});
			},
			morelist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/apply', 
					data: {page:this.page,size:this.size,status:this.tab,type:2},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.length;
							for(let i=0;i<len;i++){
								this.task.push(res.data.data[i])
							}
							this.page = this.page + 1
						}
					}
				});
			},
			changetab:function(i){
				this.tab = i
				this.task =[]
				this.page = 1
				this.morelist()
			},
			geturl(ico){
				return  ico
			},
			gotozrwvip(id){
				uni.navigateTo({
					url:'/pagesC/zrwrwfb/myzrwrwfb/myzrwrwfb?id='+id 
				})
			},
			gotozrwrenwu(id){
				uni.navigateTo({
					url:'/pagesC/zrwrwfb/taskmanagement/taskmanagement?id='+id
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
				this.cid = e.cid
				this.cindex = e.cid
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
			this.morelist()
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
	
	
</style>

