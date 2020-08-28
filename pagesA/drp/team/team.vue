<template>
	<view >
		<view  class="bannervs bgind bg">
			<view class="secul">				
				<view class="taball secli">
					<view v-for="(tab,index) in tabBars" :key="index" :class="[active==index ?'tab-active':'tab-two']"  @click="commonTabs(index)">
						<text>{{ tab }}</text>
					</view>
			    </view>				
			</view>
		</view>
		<view class="section-list" v-if="active == 0">
			<block v-if="drpTeamData && drpTeamData.length > 0">
				<view  v-for="(item,index) in drpTeamData" :key="index">
					<view class="list liti" style="width:96%;margin:10rpx auto;border-radius:20rpx">	
						<view class="left">
							<view class="picture">
								<image :src="item.user_picture" mode="widthFix" v-if="item.user_picture"></image>
								<image src="../../../static/user_default.png" mode="widthFix" v-else></image>
							</view>
							<view class="con">
								<view class="name nohh">									 
									<view class="price" >【{{item.mobile_phone}}】</view>
									<view>{{item.user_id}}</view>
								</view>
								<view class="time"> 注册时间：{{item.reg_time}}</view>
							</view>
						</view>
						<view class="right">
							<view class="price" ><text>{{item.grade || ''}} </text></view>			
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
		</view>
		<view class="section-list" v-else>
			<block v-if="drpOffkineUserData && drpOffkineUserData.length > 0">
				<view   v-for="(item,index) in drpOffkineUserData" :key="index">
					<view class="list liti" style="width:96%;margin:10rpx auto;border-radius:20rpx">
						<view class="left">
							<view class="picture">
								<image :src="item.user_picture" mode="widthFix" v-if="item.user_picture"></image>
								<image src="../../../static/user_default.png" mode="widthFix" v-else></image>
							</view>
							<view class="con">
								<view class="name">
									 
									<view class="price" >【{{item.nick_name}}】</view>
									<view>{{item.user_id}}</view>
									 
								</view>
								<view class="time">加入时间：{{item.reg_time}}</view>
							</view>
						</view>
						<view class="right">						
							<view class="price" ><text> {{item.grade || ''}}  </text></view>
						</view>
					</view>
				</view>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
		</view>
		
		<dsc-common-nav>
			
		</dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import * as localConfig from '@/config/local/config';
	const webUrl = localConfig.websiteUrl
	
	export default {
		data() {
			return {
				tabBars:['我的团队','团队成员'],
				active:0,
				size:10,
				page:1,
				user_id:0,  
				index:0,
				grade:'T2',
				drpTeamData:[],
				drpOffkineUserData:[]
			}
		},
		components:{
			uniIcon,
			dscCommonNav,
			dscNotContent
		},
		onLoad(e) {
			this.user_id = e.parent_id ? e.parent_id : 0;
			this.tabBars[0] = '我的团队：'+e.client
			this.tabBars[1] = '团队成员：'+e.team_num
		},
		onShow(){
			this.myDrpTeam()
		},
		methods: {
			myDrpTeam() {
				uni.request({
					url: webUrl + '/api/v4/drp/team', 
					data: {page:this.page,size:this.size,user_id:this.user_id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(res)
						if(res.data.status == 'success'){
							let len = res.data.data.team_info.length;
							for(let i=0;i<len;i++){
								this.drpTeamData.push(res.data.data.team_info[i])
							}
							this.page = this.page + 1
						}
					}
				});
			},
			//下级会员
			drpOffline() {
				uni.request({
					url: webUrl + '/api/v4/drp/offline_user', 
					data: {page:this.page,size:this.size,user_id:this.user_id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.user_list.length;
							for(let i=0;i<len;i++){
								this.drpOffkineUserData.push(res.data.data.user_list[i])
							}
							this.page = this.page + 1
						}
					}
				});
			},
			commonTabs(index) {
				this.active = index
				this.page = 1
				this.drpOffkineUserData = []
				this.drpTeamData = []
				if(index == 0){
					this.myDrpTeam()
				}else{
					this.drpOffline()
				}
			}
		},
		onReachBottom(){
			if(this.active == 0){
				this.myDrpTeam()
			}else{
				this.drpOffline()
			}
		}
	}
</script>

<style scoped>
.section-list .tit{ display: flex; flex-direction: row; padding: 20upx 40upx; background: #FFFFFF;}
.section-list .tit .t1{ width: 70%; }
.section-list .tit .t2{ width: 30%; }
.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}

.section-list .list{ padding: 20upx 0; display: flex; flex-direction: row; background-color: #FFFFFF;width:660rpx}
.section-list .list .left{ display: flex; flex-direction: row; width: 70%;}
.section-list .list .left .picture{ width: 70rpx; height: 70rpx; margin: 20rpx;}
.section-list .list .left .picture image{ width: 100%; height: auto; }
.section-list .list .left .con{ display: flex; flex-direction: column;}
.section-list .list .left .con .name{ font-size: 28upx; display: flex;flex-direction: row;}
.section-list .list .left .con .time{ font-size: 25upx; color: #999999;}

.section-list .list .right{ flex: 1; display: flex; flex-direction: row; justify-content: center; align-items: center;}
.section-list .list .right .price{ color: #f92028; font-size: 30upx; line-height:35upx; text-align:right}

.bgind{background-size:100% 100%; background-repeat: no-repeat;}
.uni-view{font-size:28rpx}
.bannervs{width:100%;height:100rpx}
.uni-flex{display: flex;flex-direction: row;}
.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}

.secul{whdth:690upx;
		text-align: center;margin-bottom:10rpx;	position: fixed;left: 0;width: 100%;overflow: hidden; 
		box-sizing: border-box;	z-index: 998;	transition-property: all;	background:#f0f0f0;
}  
.taball{display: flex;justify-content: space-between;border-bottom:1px solid #d9d9d9}
.secli{height:90rpx;line-height:90rpx;color:#fa160e;
	  width: 100%;z-index: 998;}	
.tab-active{background-color:#ffffff;width:50%;text-align:center;line-height:80rpx}	
.tab-active text{color:#060606;line-height:80RPX}	
.tab-two{color:#040404;background-color:#f8f8f8;width:50%;text-align:center;line-height:80rpx}
.tab-two text{color:#060606;line-height:80RPX}	
.nohh{white-space: nowrap; text-overflow:ellipsis;  overflow:hidden;}
</style>
