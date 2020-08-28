<template>
	<view class="vip-apply">
		<view class="img"><image src="../../../static/vip/apply-img-1.jpg" alt="" mode="widthFix"></image></view>
		<view class="img"><image src="../../../static/vip/apply-img-2.jpg" alt="" mode="widthFix"></image></view>
		<view class="img"><image src="../../../static/vip/apply-img-3.png" alt="" mode="widthFix"></image></view>
		<view class="img title-how"><image src="../../../static/vip/title-how.png" alt="" mode="widthFix"></image></view>
		<view v-for="(channel,index) in apply_channel" :key="index">
			<view class="apply-box" v-if="channel.receive_type == 'integral'">
				<view class="title">0{{index+1}}.积分换取</view>
				<view class="body">
					<view class="text">积分累计达<span class="number">{{channel.content.buy_pay_point}}</span>可申请成为高级会员</view>
					<view class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">正在审核中...</view>
					<view class="v-btn" v-else :data-type="channel.receive_type" :data-number="channel.content.user_pay_point" @click="clickSubmit">我要申请</view>
				</view>
			</view>
			<view class="apply-box" v-if="channel.receive_type== 'order'">
				<view class="title">0{{index+1}}.消费金额累积</view>
				<view class="body">
					<view class="text">在平台消费累计达<span class="number">{{channel.content.buy_money}}</span>可申请成为高级会员</view>
					<view class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">正在审核中...</view>
					<view class="v-btn" v-else :data-type="channel.receive_type" :data-number="channel.content.user_order_money" @click="clickSubmit">我要申请</view>
				</view>
			</view>
			<view class="apply-box" v-if="channel.receive_type== 'buy'">
				<view class="title">0{{index+1}}.在线购买</view>
				<view class="body">
					<view class="text">在线购买价值<span class="number">{{channel.content.price}}</span>的高级会员，支持开发票</view>
					<view class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">正在审核中...</view>
					<view class="v-btn" v-else :data-type="channel.receive_type" @click="clickSubmit">立即购买</view>
				</view>
			</view>
			<view class="apply-box" v-if="channel.receive_type== 'goods'">
				<view class="title title-big">0{{index+1}}.购买指定等值精选商品</view>
				<view class="body">
					<view class="text">购买以下任意一件精选商品，即可成为高级会员</view>
					<view class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">正在审核中...</view>
					<view class="v-btn" v-else :data-type="channel.receive_type" @click="clickSubmit">我要申请</view>
				</view>
			</view>
			<view class="apply-box" v-if="channel.receive_type== 'free'">
				<view class="title title-big">0{{index+1}}.免费领取</view>
				<view class="body">
					<view class="text">在线免费成为高级会员，即可享受专属福利</view>
					<view class="v-btn disabled" v-if="applySuccess && type == channel.receive_type">正在审核中...</view>
					<view class="v-btn" v-else :data-type="channel.receive_type" @click="clickSubmit">我要申请</view>
				</view>
			</view>
		</view>
		<view class="vip-popup mod-popup" :class="{'show':applyPopupShow}">
			<!-- <view class="p-close" @click='closePopup'><van-icon name="clear" /></view> -->
			<view class="p-content">
				<view class="p-icon" v-if="popupStep == 2 || popupStep == 3">
					<view class="loader04" v-if="popupStep == 2"></view>
					<view class="p-icon-success" v-if="popupStep == 3"></view>
				</view>
				<view>{{validMsg}}</view>
				<!-- <view v-html="validNumber" v-if="validNumber.length > 0" class="number"></view> -->
				<view v-if="validTip.length > 0" :class="{'uni-green': formValid, 'uni-red': !formValid}">{{validTip}}</view>
			</view>
			<view class="p-handler">
				<block v-if="popupStep == 1">
				<view class="v-btn" @click='submit' v-if="formValid">提交申请</view>
				<view class="v-btn" @click='closePopup' v-else>关闭窗口</view>
				</block>
				<block v-if="popupStep == 2">
				<view class="v-btn disabled">申请提交中，请勿关闭窗口</view>
				</block>
				<block v-if="popupStep == 3">
				<view class="v-btn" @click='closePopup'>关闭窗口</view>
				</block>
			</view>
		</view>
		<view class="mod-mask" :class="{'show':applyPopupShow}" @click='closePopup'></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				registerCont: '',
				apply_channel: '',
				goodsHasBuy: false,
				applyPopupShow: false,
				formValid: true,
				validMsg: '',
				validNumber: '',
				validTip: '',
				popupStep: 1,
				applySuccess: false,
				type: 0,
				buy_pay_point:0,
				user_pay_point:0,
				buy_money:0,
				user_order_money:0,
				membership_card_id_repeat:''
			}
		},
		components:{
			dscNotContent,
			dscCommonNav,
		},
		onLoad(e) {
			this.membership_card_id_repeat = e.membership_card_id_repeat;
			
			this.application()
		},
		computed:{
			...mapState({
				status: state => state.drp.status,
				error: state => state.drp.error
			})
		},
		methods: {
			application(){
				this.$store.dispatch('setDrpApplyList').then(res => {
					let data = res.data;
					if(data.shop_info){
						uni.navigateTo({
							url:'/pagesA/drp/drpinfo/drpinfo'
						})
					}else{
						this.registerCont = data.notice
						// 分销申请方式
						this.apply_channel = data.apply_channel
						// 判断是否已购买商品
						for (var i = this.apply_channel.length - 1; i >= 0; i--) {
							if(this.apply_channel[i].receive_type == 'goods'){
								if(this.apply_channel[i].content.goods_list){
									for(var j = this.apply_channel[i].content.goods_list.length - 1; j>=0; j--){
										if(this.apply_channel[i].content.goods_list[j].is_buy == 1){
											this.goodsHasBuy = true
											break;
										}
									}
								}
							}
						}
					}
				});
			},
			closePopup(){
				this.applyPopupShow = false;	
			},
			clickSubmit(e){
				if(this.applySuccess){
					return false;
				}
				
		    	this.type = e.currentTarget.dataset.type;

		    	for(let i = 0; i < this.apply_channel.length; i++){
		    		if(this.apply_channel[i].receive_type == 'order'){
		    			this.buy_money = this.apply_channel[i].content.buy_money
		    			this.user_order_money = this.apply_channel[i].content.user_order_money
		    		}
					
		    		if(this.apply_channel[i].receive_type == 'integral'){
		    			this.buy_pay_point = this.apply_channel[i].content.buy_pay_point
		    			this.user_pay_point = this.apply_channel[i].content.user_pay_point
		    		}
		    	}
		    	
				if(this.type == 'integral'){
					if(this.membership_card_id_repeat){
						uni.navigateTo({
							url:'../apply/apply?receive_type='+this.type + '&point='+this.buy_pay_point + '&membership_card_id_repeat='+this.membership_card_id_repeat
						})
					}else{
						uni.navigateTo({
							url:'../apply/apply?receive_type='+this.type + '&point='+this.buy_pay_point
						})
					}
		    	}else{
		    		// 指定金额购买
					if(this.membership_card_id_repeat){
						uni.navigateTo({
							url:'../apply/apply?receive_type='+this.type + '&membership_card_id_repeat='+this.membership_card_id_repeat
						})
					}else{
						uni.navigateTo({
							url:'../apply/apply?receive_type='+this.type
						})
					}
		    	}
			},
			submit(){
				uni.navigateTo({
					url:'../apply/apply?receive_type='+this.type
				})
			}
		}
	}
</script>

<style scoped lang="scss">
/*高级会员结算页*/
.img image{ width: 100%; }
.mod-popup{
    position: fixed;
    top: 50%;
    left: 50%;
    max-height: 100%;
    overflow-y: auto;
    background-color: #fff;
    -webkit-transition: .3s ease-out;
    transition: .3s ease-out;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(-50%,-50%,0);
    transform: translate3d(-50%,-50%,0);
    z-index: 2018;
    display: none;
    &.show{
    	display: block;
    	animation: fadeIn .5s;
    }
}
.mod-mask{
	position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.7);
    z-index: 2017;
    display: none;
    &.show{
    	display: block;
    	animation: fadeIn .5s;
    }
}
@keyframes fadeIn{
	0%{ opacity: 0; }
	100%{ opacity: 1; }
}
.vip-apply{
    background: #232222; min-height: 100vh; overflow: hidden;
    .img{
        img{ width: 100%; vertical-align: top; }
    }
    .title-how{ width: 73%; margin: 5% auto; }
    .apply-box{
        margin: 0 5% 5%;
        .title{
            width: 100%; max-width: 420upx; height: 68upx; line-height: 68upx; background: url(../../../static/vip/apply-title-small.png) no-repeat center; 
            background-size: contain; text-align: center;
            color: #573B1A; font-size: 36upx; margin: 0 auto -55.4upx; font-weight: bold; font-style: italic; position: relative; z-index: 3;
            &.title-big{ background-image: url(../../../static/vip/apply-title-big.png); max-width: 534upx; }
        }
        .body{
            background: #F2EEE9; border-radius: 20upx; min-height: 112upx; text-align: center; padding-bottom: 18upx; padding-top: 86upx;
            .text{
                padding: 0 20upx 20upx; color: #805223; font-size: 26upx;
                .number{ font-size: 32upx; font-weight: 700; margin: 0 12upx 0 4upx; font-style: italic;}
            }
        }
        .v-btn{
            width: 100%;
            max-width: 360upx;
            margin: 0 auto 10upx;
            text-align: center;
            line-height: 60upx;
            background: #000;
            color: #E3C49E;
            border-radius: 30upx;
            box-shadow: 0 12px 6px -8px rgba(0,0,0,0.3);
            font-size: 30upx;
            cursor: pointer;
            &.disabled{ opacity: 0.6; }
        }
    }
    .apply-goods-list{
        margin: 0 3%;
        .item{
            float: left; width: 45.88%; margin: 0 2.06% 4.12%; background: #fff; border-radius: 10upx; overflow: hidden; position: relative;
            .link{ position: absolute; z-index: 10; top: 0; right: 0; bottom: 0; left: 0; }
            .img{ 
                position: relative;  
                .tag{ 
                    position: absolute; z-index: 2; left: -54upx; top: 6upx; background: #000; color: #573B1A; width: 166upx; text-align: center; line-height: 40upx; background:linear-gradient(90deg,#EBD5B9,#DCB483); transform: rotate(-45deg);
                    &:before,
                    &:after{ content:''; height: 0; width: 100%; position: absolute; left: 0; border-top: 1px solid #c19a6d; transform: translate(0,-.5px);}
                    &:before{ top: 4upx; }
                    &:after{ bottom: 4upx; }
                }
            }
            .title{ font-size: 28upx; height: 74upx; line-height: 36upx; overflow: hidden; word-break: break-all; padding: 10upx 4upx 0 14upx; margin-bottom: 10upx;}
            .info{ 
                padding: 0 16upx 20upx 10upx; overflow: hidden; line-height: 48upx; font-size: 28upx;
                .price{ float: left; width: 50%; color: #f92028; font-size: 26upx; }
                .i-btn{ float: left; width: 50%; border-radius: 6upx; text-align: center; background:linear-gradient(118deg,rgba(236,216,190,1),rgba(219,178,128,1)); color: #64503E; }
            }
        }
    }
}
.vip-popup{
    padding: 40upx; border-radius: 20upx; width: 460upx; overflow: hidden;
    .p-close{ position: absolute; right: 20upx; top: 20upx; .van-icon{ font-size: 46upx; color: #dcdcdc; }}
    .p-content{
        text-align: center; margin-bottom: 32upx;
        p{ 
            color: #888; font-size: 28upx; margin: 10upx 0;
            &.number{ font-size: 32upx; color: #333; }
            &.green{ color: #41d357; }
            &.red{ color: #fc6c6c; }
        }
        .p-icon{
            margin-bottom: 20upx;
            .p-icon-success{
                width: 93.4upx;
                height: 93.4upx;
                background: url(../../../static/vip/icon-success.png) no-repeat center;
                background-size: contain;
                margin: 0 auto;
            }
        }
    }
    .p-handler{
        .v-btn{
            text-align: center;
            width: 100%;
            margin: 0 auto 10upx;
            text-align: center;
            line-height: 60upx;
            background: #000;
            color: #E3C49E;
            border-radius: 30upx;
            box-shadow: 0 12px 6px -8px rgba(0,0,0,0.3);
            font-size: 30upx;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &.disabled{ background: #b0b0b0; color: #fff; }
        }
    }
}
.loader04 {
    width: 93.4upx;
    height: 93.4upx;
    border: 3.4upx solid #e7d2b5;
    border-radius: 50%;
    position: relative;
    animation: loader-rotate 1s ease-in-out infinite;
    top: 50%;
    margin: 0 auto;
    &:after {
        content: '';
        width: 16.6upx;
        height: 16.6upx;
        border-radius: 50%;
        background: #d5aa75;
        position: absolute;
        top: -10upx;
        left: 50%;
        margin-left: -8.4upx;
    }
}
@keyframes loader-rotate {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
</style>
