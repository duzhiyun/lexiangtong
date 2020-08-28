<template>
	<view class="container">
		<view class="vip-buy">
			<view class="head">
				<view class="title">高级会员卡</view>
				<view class="notice">
					<h3>
						<!-- <a href="javascript:;" class="more">{{$t('lang.view_euity')}}<i class="iconfont icon-more"></i></a> -->
						<b>新手必读</b>
					</h3>
					<p v-html="purchaseData.novice"></p>
				</view>
			</view>
			<view class="bg-color-write">
				<view class="cell-box">
					<view class="cell-title">应付总额</view>
					<view class="cell-content">{{ purchaseData.price }}</view>
				</view>
				<view class="cell-box">
					<view class="cell-title">支付方式</view>
					<view class="cell-content">在线支付</view>
				</view>
			</view>
		</view>
		<view class="vip-fixed-bottom">
			<view class="item article-confirm">
				<view class="radio-wrap" @click="toggleConfirm"><i class="radio-icon" :class="{'active': confirm}"></i>已阅读并同意</view>
				<view class="a" @click="$outerHref(host+'articleDetail/'+purchaseData.agreement_id)">《{{wgtinfo.name}}高级用户正式期协议》</view>
			</view>
			<view class="item vip-btn" @click="onSubmit">
				<span>立即支付</span>
				<span class="number">{{ purchaseData.price }}</span>
			</view>
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
	
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	export default {
		data() {
			return {
				amount: '',
				confirm: true,
				wgtinfo:{}
			}
		},
		components:{
			uniIcon,
			dscCommonNav,
			dscNotContent
		},
		onLoad() {
			this.wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'))
			this.load();
		},
		computed: {
			...mapState({
				purchaseData: state => state.drp.purchaseData
			})
		},
		methods: {
			load(){
				this.$store.dispatch('setDrpPurchase');
			},
			onSubmit(){
				if(this.confirm){
					// #ifdef APP-PLUS
					this.$outerHref(this.$websiteUrl+'drp/drpDone')
					// #endif
					
					// #ifdef MP-WEIXIN
					uni.navigateTo({
						url:"../done/done"
					})
					// #endif
				}else{
					uni.showToast({
						title: '请先勾选协议'
					})
				}
			},
			toggleConfirm(){
				this.confirm = !this.confirm
			}
		}
	}
</script>

<style scoped lang="scss">
@mixin box-flex(){
    box-flex: 1;
    -webkit-box-flex: 1; 
    -moz-box-flex: 1; 
    -ms-box-flex: 1; 
    display: block !important; 
    width: 100%;
}

@mixin box(){
    display: -webkit-box; 
    display: -moz-box; 
    display: -ms-box; 
     display: flex;/*duzy*/
}
.bg-color-write{ background: #fff; }
.vip-buy{
    .head{
        background:linear-gradient(0deg, #696969 0%, #151515 30%); overflow: hidden;
        .title{ 
            color: #EBD6BA; text-align: center; font-size: 30upx; line-height: 82upx;
            &:before,
            &:after{ content:''; width: 52.6upx; height: 8.4upx; margin: 0 12upx; vertical-align: middle; display: inline-block; background-size: contain; background-position: center; background-repeat: no-repeat;}
            &:before{ background-image: url(../../../static/vip/title-star-l.png); }
            &:after{ background-image: url(../../../static/vip/title-star-r.png); }
        }
        .notice{ 
            background: #FCF3E7; margin: 0 25upx 25upx; border-radius: 20upx; padding: 25upx;
            h3{
                margin-bottom: 20upx;
                b{ font-size: 36upx; }
                a{ 
                    float: right; 
                    .iconfont{ font-size: 20upx; margin-left: 2upx; }
                }
            }
            p{ color: #805223; line-height: 1.6; }
        }
    }
}
.cell-box{ 
    padding: 20upx; border-bottom: 1px solid #f6f6f9; @include box();
    &:last-child{ border-bottom: 0 none; }
    .cell-title{ font-size: 28upx; line-height: 40upx; @include box-flex();}
    .cell-content{ text-align: right; line-height: 40upx;}
}
.vip-fixed-bottom{
    background-color: #fff;
    height: 94upx;
    padding-bottom: env(safe-area-inset-bottom);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    box-shadow: 1px 0 5px rgba(100, 100, 100, 0.1);
    @include box();
    .item{
        @include box-flex();
        &.vip-btn{
            text-align: center; line-height: 94upx; font-size: 28upx; color: #463015;
            background:linear-gradient(118deg,rgba(236,216,190,1),rgba(219,178,128,1));
            .number{ font-size: 32upx; font-weight: 700; margin-left: 4upx; }
        }
        &.article-confirm{
            text-align: center;
            .radio-wrap{ 
                line-height: 36upx; margin-top: 10upx; margin-bottom: 8upx; 
                .radio-icon{ 
                    position: relative; margin-right: 4upx;
                    width: 36upx; height: 36upx; border-radius: 36upx; display: inline-block; vertical-align: bottom; 
                    background: linear-gradient(118deg,rgba(236,216,190,1),rgba(219,178,128,1)); border-radius:50%;
                    &:before{ content:''; position: absolute; width: 18upx; height: 10upx; border-width: 1px; border-color: transparent transparent #fff #fff; border-style: solid; left: 10upx; top: 10upx; transform: rotate(-45deg); opacity: 0; transition: all .2s;}
                    &:after{ content: ''; position: absolute; left: 3px; top: 3px; bottom: 3px; right: 3px; background: #fff; transition: all .2s; border-radius: 100%;}
                    &.active:before{ transform: rotate(-45deg); opacity: 1; }
                    &.active:after{ transform: scale(0); opacity: 0; }
                }
            }
            .a{ color: #C79557; font-size: 20upx; }
        }
    }
}
</style>
