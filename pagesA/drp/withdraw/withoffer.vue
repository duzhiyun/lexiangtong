<template>
	<view class="container">
		<view class="drp-withdraw">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column">
					<view class="title">当前可转出：<block v-if="drpTransData.max_money">{{drpTransData.max_money}}乐豆</block></view>
					<view style="width:95%;margin:0 auto;display: flex;align-items:center; flex-direction:row"> 
					    <view class="drp-duzytitle">输入转出数量</view><view style="border-bottom:1px solid #000000;"><input class="uni-input" type="number" v-model="amount" focus placeholder="请输入转出乐豆" /></view>		
					</view>
					
					<view class="sub">余额<block v-if="money">{{money}}</block>,最多可转<block v-if="drpTransData.max_money">{{drpTransData.max_money}}</block></view>
					<view class="sub"></view>
				</view>
				<view class="btn-bar btn-bar-radius">
					<button class="btn btn-red" formType="submit">转出到交易积分</button>
				</view>
			</form>
		</view>
		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>我的微店</text>
			</navigator>
		</dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	export default {
		data() {
			return {
				amount:'',
				money:0
			}
		},
		components:{
			uniIcon,
			uniCollapse,
			uniCollapseItem,
			dscCommonNav,
			dscNotContent
		},
		onLoad(e) {
			if(e.money != undefined){
				this.money = e.money
			}
			this.load();
		},
		computed: {
			...mapState({
				drpTransData: state => state.drp.drpTransData,
			})
		},
		methods: {
			load(){
				this.$store.dispatch('setDrpTrans',{type:1});
			},
			formSubmit(e){
				let minMoney = parseInt(this.drpTransData.min_money)
				let maxMoney = parseInt(this.drpTransData.max_money)
				let inputValue = parseInt(this.amount)
				
				if (inputValue < minMoney) {
					uni.showToast({
						title: '金额不能小于' + minMoney + '元',
						icon: 'none'
					});
				} else if (inputValue > maxMoney) {
					uni.showToast({
						title: '金额超出最大转出额度',
						icon: 'none'
					});
				} else {
					this.$store.dispatch('setDrpTransferred',{
						amount:inputValue,
						type:1
					}).then(res=>{
						if(res.status == 'success'){
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							});
							
							if(res.data.error == 0){
								uni.reLaunch({
									url:'/pages/user/user'
								});
							}
						}else{
							uni.showToast({
								title:'提现失败',
								icon:'none'
							});
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
.drp-withdraw{ background: #FFFFFF; }
.drp-withdraw .title{ font-size: 35upx; test-align:center;}
.drp-withdraw .sub{ padding: 0 25upx; color: #999999;}
.drp-duzytitle{font-size: 33upx;margin:20rpx 0}
.drp-withdraw .btn-bar{ margin: 25upx; }
</style>
