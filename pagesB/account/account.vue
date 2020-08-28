<template>
	<view class="account">
	    <!-- <view class="user-pur-box">
	    	<view  class="item"   @click="clickPay">
	    		<image src="../../static/recharge_1.png"></image>充值</view>
	    	<view  @click="$outerHref('../../pagesA/zhuangzhang/zhuangzhang?gf='+account.user_money,$isLogin())" hover-class="none" class="item">
	    		<image src="../../static/recharge_2.png"></image>转帐
	    	</view>			
	    </view> -->
		<view class="purse-header-box">
			<view class="text">乐享通商城CNY余额（元）</view>
			<view class="value">
				<view class="money" v-if="account.user_money">{{ account.user_money }}</view>
				<view class="frozen-money" ><navigator  url="detail/detail"  hover-class="none">资金详情</navigator></view>
			</view>
			<view class="user-money-list">
				<navigator url="../bonus/bonus" class="money-item text-left" hover-class="none" >冻结余额:<block v-if="account.frozen_money">{{ account.frozen_money }}</block></navigator>
				<view class="money-item text-right">消费金：<block v-if="account.pay_points">{{ account.pay_points }}</block></view> 
				
			</view>
		</view>
		
		
		
		
		<view class="purse-header-box" style="background-color:#FF010C">
			<view class="text">乐券</view>
			<view class="value">
				<view class="money" v-if="account.task.point">{{ account.task.point }}</view>
				<view class="frozen-money" ><navigator  url="/pagesA/drp/log/log"  hover-class="none">乐券详情</navigator></view>
				<view class="frozen-money"  @click="$outerHref('../../pagesC/money/poing-bean/poing-bean?money='+account.task.bean,$isLogin())">众筹乐豆</view>	
			</view>
			<view class="user-money-list">		
				<view class="money-item text-right"> </view> 
			</view>
		</view>		
		
		<view class="purse-header-box" style="background-color:#ffaa00">
			<view class="text">乐享值</view>
			<view class="value">
				<view class="money" v-if="account.task.price">{{ account.task.price }}</view>
				<view class="frozen-money"  @click="$outerHref('../../pagesC/zrwshop/zrwshop',$isLogin())"  >获得乐享值 </view>
			</view>
			<view class="user-money-list">
				<view class="money-item text-right"> </view> 
			</view>
		</view>		
		
		<view class="purse-header-box" style="background-color:#000000">
			<view class="text">交易钱包</view>
			<view class="value">
				<view class="money" v-if="account.task.bean_income">{{ account.task.bean_income }}</view>
				<view class="frozen-money"  @click="$outerHref('../../pagesA/drp/withdraw/withdraw?money='+account.task.bean_income,$isLogin())" >转余额账户 </view>
			</view>
			<view class="user-money-list">
				<view class="money-item text-right"> </view> 
			</view>
		</view>	
	
		<view class="purse-header-box" style="background-color:#00aa00">
			<view class="text">乐豆</view>
			<view class="value">
				<view class="money" v-if="account.task.bean">{{ account.task.bean }}</view>
				<view class="frozen-money"  @click="$outerHref('../../pagesA/drp/withdraw/withoffer?money='+account.task.bean,$isLogin())">转交易账户</view>
			</view>
			<view class="user-money-list">
				<view class="money-item text-left" hover-class="none"  @click="$outerHref('../../pagesC/daily-tasks/money-tasks',$isLogin())"><block v-if="account.income.profit">存豆生息：{{ account.income.profit }}</block></view>
				<view class="money-item text-right"> 已收益   </view>
			</view>
		</view>	
		
		
		
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon.vue";
	export default {
		components:{
			uniIcon
		},
		data() {
			return {
				account:Object,
				value_card:Object
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/account/account'
			}
		},
		methods:{
			clickPay(){
				// #ifdef APP-PLUS
                this.$outerHref(this.$websiteUrl+'user/account/deposit')
				// #endif
				// #ifdef H5
				uni.navigateTo({
					url:'/pagesB/account/deposit/recharge'
				})																
				// #endif
			}
		},
		onLoad() {
			this.$store.dispatch('setAccount').then(res =>{
				this.account = res.data
				this.value_card = res.data.value_card;
			})
		}
	}
</script>

<style>
.account{ padding: 30upx;}
.account .purse-header-box{margin-top:20rpx; margin-bottom:10rpx;padding: 20upx; width: 100%; box-sizing: border-box; border-radius: 10upx; background-color: #0196fd; box-shadow: 0px 4px 18px rgba(0, 128, 248, 0.4) !important; color: #FFFFFF;}
.account .purse-header-box .value{ display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
.account .purse-header-box .value .money{ font-size: 40upx;}
.account .purse-header-box .value .frozen-money{ padding: 0 20upx; border: 1px solid #80ccff; height: 20px; line-height: 20px; border-radius: 10px; font-size: 25upx;}
.account .purse-header-box .user-money-list{ display: flex; flex-direction: row; margin-top: 50upx;}
.account .purse-header-box .user-money-list .money-item{ flex: 1 1 0%;}
.account .user-pur-box{ padding: 20upx; margin-top: 20upx; background-color: #FFFFFF; display: flex; flex-direction: row; border-radius: 10upx;}
.account .user-pur-box .item{ flex: 1 1 0%; display: flex; flex-direction: row; align-items: center; justify-content: center;}
.account .user-pur-box .item:first-child image{ width: 26px; height: 17px; margin-right: 20upx;}
.account .user-pur-box .item:last-child image{ width: 18px; height: 17px; margin-right: 20upx;}
.account .my-nav-box{ margin-top: 20upx; border-radius: 10upx; background: #FFFFFF;}
.account .my-nav-box .item{ display: flex; padding: 20upx; border-bottom: 1px solid #f6f6f9; justify-content: space-between; align-items: center;}
.account .my-nav-box .item .tit .iconfont{ margin-right: 10upx; font-size: 14px;}
</style>