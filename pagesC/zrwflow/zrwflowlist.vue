<template>
	<view>
		<view class="secul">
			<view class="secli"  @click="changetab('a')" :class="[tab=='a'?'tab-active':'']"> 待完成 </view>
			<view class="secli"  @click="changetab('b')" :class="[tab=='b'?'tab-active':'']"> 待审核 </view>
			<view class="secli"  @click="changetab('c')" :class="[tab=='c'?'tab-active':'']"> 已完成 </view>
		</view>
		<view style="width:100%;height:80rpx"></view>
		<view class="wklist  uc-page03 nons" :class="[tab=='a'?'taba':'taba']">
			<view class="uli uni-flex liti" @click="gotozrwword(item.id)" v-for="(item,index) in apply" :key="index">
				<view class="uli-left">						
					<view class="image-view">
						<image :src="item.tushi" class="imgcss"></image>
					</view>
					<view class="ulibuy" v-if="item.status==0">进行中</view>
					<view class="ulibuy" v-if="item.status==1">待审核</view>
					<view class="ulibuy" v-if="item.status==2">已完成</view>
				</view>
				<view  class="uli-mide">					
					<view style="width:420rpx"><span>要求 : {{item.title}}</span></view>
					<view  style="width:420rpx"><span>截止 : {{item.end_date}}</span></view>	          
				</view>
				<view  class="uli-right">
					<view class="ulimoney">￥{{item.price}}</view>
					<view class="ulibuy" >【ID:{{item.id}}】</view>
					
				</view>
			</view>	
		</view>	

		<view class="wklist  uc-page03 nons" :class="[tab=='b'?'':'']">
			<view class="uli uni-flex liti" @click="gotozrwword()">
				<view class="uli-left">						
					<view class="image-view"><image src="/static/weike/douyin.png" class="imgcss"></image></view>
					<view class="grade"><span>天王</span></view>
				</view>
				<view  class="uli-mide">					
					<span>编号 : 10002</span><br>
					<span>要求 : 点赞+评论+关注</span><br>
					<span>时间 : 2020-02-08 20:00</span>					
				</view>
				<view  class="uli-right">
					<view class="ulimoney">￥20.00</view>
					<view class="ulibuy" v-if="zt==1">【进行中】</view>
					<view class="ulibuy" v-if="zt==2">【待审核】</view>
					<view class="ulibuy" v-if="zt==3">【已完成】</view>
				</view>
			</view>
		</view>
		<view class="wklist  uc-page03 nons" :class="[tab=='c'?'':'']">
			<view class="uli uni-flex liti" @click="gotozrwword()">
				<view class="uli-left">						
					<view class="image-view"><image src="/static/weike/douyin.png" class="imgcss"></image></view>
					<view class="grade"><span>天王</span></view>
				</view>
				<view  class="uli-mide">					
					<span>编号 : 10002</span><br>
					<span>要求 : 点赞+评论+关注</span><br>
					<span>时间 : 2020-02-08 20:00</span>					
				</view>
				<view  class="uli-right">
					<view class="ulimoney">￥20.00</view>
					<view class="ulibuy" v-if="zt==1">【待完成】</view>
					<view class="ulibuy" v-if="zt==2">【待审核】</view>
					<view class="ulibuy" v-if="zt==3">【已完成】</view>
				</view>
			</view>
		</view>
		<tabbar :curpage="curpage"></tabbar>
		
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config';
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js';
	import tabbar from "@/components/tabbar/taskfooter.vue";
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				tab:'a',
				status:0,
				apply:[],
				page:1,
				size:6,
				type:1
			}
		},
		components:{
			tabbar,
			uniIcon,
			universal,
			isLogin
		},
		methods: {
			applylist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/apply', 
					data: {page:this.page,size:this.size,status:this.status,type:this.type},
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
					data: {page:this.page,size:this.size,status:this.status,type:this.type},
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
			geturl(ico){
				if(this.CheckUrl(ico)){
					return ico
				}else{
					return  ico
				}
			},
			CheckUrl(str){
				var RegUrl = new RegExp();
				RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
				if (!RegUrl.test(str)) {
					return false;
				}
				return true;
			},
			changetab:function(i){
				this.tab = i
				if(i == 'a'){
					this.status = 0
				}else if(i == 'b'){
					this.status = 1
				}else if(i == 'c'){
					this.status = 2
				}
				this.page = 1
				this.applylist();
			},
			gotozrwword(id){
				uni.navigateTo({			
					url:'/pagesC/zrwword/zrwword?id='+id						
				})
			}
		},
		onLoad(e){
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
	       text-align: center;margin-bottom:10rpx;border:1px solid #818181;
		   position: fixed;
		   left: 0;
		   width: 100%;
		   overflow: hidden; 
		   box-sizing: border-box;
		   z-index: 998;
		   transition-property: all;
		   }   
	.secli{width:50%;height:80rpx;line-height:80rpx;background-color:#060606;
		   color:#e7cd36;
		   }		   
	.tab-active{background-color:#414141;color:#e7cd36}	
	.nons{display:none}	
	.taba{display:block}
	.duicon24{height:44upx;width:44upx}
	.uni-input{height:80upx}
	
	.wklist{width:710rpx;height:auto;margin:0 auto}
	.uli{width:100%;height:180rpx;border-radius: 15rpx;
	     border:1rpx solid #e1e1e1;overflow:hidden;margin:30rpx 0;
		 display: flex;justify-content:space-between;
		 }
	.uli-left{width:120rpx;height:180rpx; text-align:center;padding:10rpx;}
	.grade{width:120rpx;height:40rpx;color:#000000;line-height:40rpx;text-align:center;}
	.image-view{width:120rpx;height:120rpx}
	.imgcss{width:100rpx;height:100rpx;margin:10rpx;}
	.uli-mide{line-height:40rpx;padding:25rpx 20rpx;width:400rpx;flex-wrap:wrap;align-items:center;display: flex;}
	.sums{margin-left:20rpx;min-width:120rpx;padding-left:10rpx;padding-right:10rpx;color:#d81e07;
	      height:45rpx;border-radius: 15rpx;top:0;z-index: 1;border:2rpx solid #d81e07;line-height:45rpx}	  
	.uli-right{width:120rpx;
			  height:180rpx;
			  text-align:right;
			  display: flex;
			  flex-direction:row-reverse;
			  flex-wrap:wrap ;	
			 align-content: flex-start;
			 align-items: flex-start;
			 margin-right:20rpx;
			
			 
	 }
	.ulimoney{width:100%; text-align:right;color:#d81e07;
	          line-height:60rpx;height:70rpx;font-weight: bold;margin-top:30rpx;
			  background-image:url(/static/weike/ulimoney.png);
			  background-size: 20%;
			  background-repeat: no-repeat;
			  background-position: 100% 50%;
			  padding-right: 15px;
			  font-size:36rpx;
			  
			  
	 }
	.ulibuy{
		   width:130rpx;
		   height:40rpx;
		   line-height:40rpx;
		   text-align:center;
		   color:#000000;
		  
   }
</style>
