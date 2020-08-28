<template>
	<view class="drp-info tabbar-padding-bottom">
		<block v-if="drpdata.error == 0 || drpdata.audit == 1">
		<view class="drp-warp">
			<view class="tip" v-if="drpdata.expiry && drpdata.expiry.expiry_status > 0 && drpdata.expiry.card_expiry_status == 1">{{drpdata.expiry.expiry_time_notice}}</view>
			<view class="tip" v-if="drpdata.expiry.card_expiry_status != 1">{{drpdata.expiry.card_status_notice}}</view>
			<view class="header">
				<view class="header-top">
					<view class="header-img" @click="drpHref"><image :src="drpdata.shop_info.user_picture" class="img" /></view>
					<view class="header-right">
						<view class="tit">{{drpdata.shop_info.shop_name}}</view>

                        <block v-if="drpdata.expiry.expiry_status == 1">
                            <view class="time" >权益有效期：已过期</view>
                        </block>
                        <block v-else>
                            <view class="time" v-if="drpdata.expiry.expiry_type == 'forever'">权益有效期：永久性</view>
                            <view class="time" v-else-if="drpdata.expiry.expiry_type == 'days'">权益有效期：{{drpdata.expiry.expiry_time_format}}</view>
                            <view class="time" v-else-if="drpdata.expiry.expiry_type == 'timespan'">权益有效期：{{drpdata.expiry.expiry_time_format}}</view>
                        </block>

                        <view class="rank">
							<view class="vip">
								<view class="icon"><image src="../../../static/vip/icon-vip.png" class="img" mode="widthFix"></image></view>
								<text>{{drpdata.user_rank}}</text>
							</view>
							<view class="more" @click="drpApplyHref">详情<uni-icon type="forward" size="18" color="#666666"></uni-icon></view>
						</view>
					</view>
				</view>
				<view class="header-bottom" :class="{'bor':drpdata.expiry.card_expiry_status == 1 || (drpdata.expiry.expiry_status == 1 || (drpdata.expiry.expiry_status == 1 && drpdata.expiry.card_expiry_status == 2))}" v-if="drpdata.expiry && drpdata.expiry.expiry_status != 0">
					<view class="item" @click="drpRenew" v-if="drpdata.expiry.card_expiry_status == 1">续费</view>
					<view class="item" v-if="drpdata.expiry.expiry_status == 1 || (drpdata.expiry.expiry_status == 1 && drpdata.expiry.card_expiry_status == 2)" @click="applyAgain">重新购买</view>
				</view>
			</view>
			<view class="section protection" v-if="card && protectionList.length > 0">
				<view class="tit">
					<view>享受权益</view>
					<view class="more" @click="protectionHref(0)">更多<uni-icon type="forward" size="18" color="#805223"></uni-icon></view>
				</view>
				<view class="value">
					<view class="item-list" v-for="(item,index) in protectionList" :key="index" @click="protectionHref(index)">
						<view class="icon"><image :src="item.icon" class="img" /></view>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
			<view class="section section-money">
				<view class="tit">我的资产</view>
				<view class="items">
					<view class="item" @click="withdraw">
						<text class="txt">{{drpdata.surplus_amount}}</text>
						<text class="span">可提现佣金</text>
					</view>
					<view class="item">
						<text class="txt">{{drpdata.totals}}</text>
						<text class="span">累积佣金</text>
					</view>
					<view class="item">
						<text class="txt">{{drpdata.today_total}}</text>
						<text class="span">今日收入</text>
					</view>
					<view class="item">
						<text class="txt">{{drpdata.total_amount}}</text>
						<text class="span">总销售额</text>
					</view>
				</view>
			</view>
		</view>
		<view class="team-box">
			<view class="tit">
				<icon class="row"></icon>
				<text>我的团队</text>
			</view>
			<view class="items">
				<view class="item item1">
					<text class="num">{{drpdata.sum_count}}</text>
					<icon class="link"></icon>
					<text class="text">会员总数</text>
				</view>
				<view class="item item2">
					<text class="num">{{drpdata.team_count}}</text>
					<icon class="link"></icon>
					<text class="text">直属会员</text>
				</view>
				<view class="item item3">
					<text class="num">{{drpdata.user_count}}</text>
					<icon class="link"></icon>
					<text class="text">直属会员下级</text>
				</view>
			</view>
			<view class="button" @click="inviteFriends()">
				<text>邀请好友</text>
				<uni-icon type="arrowright" color="#805223" size="24"></uni-icon>
			</view>
		</view>
		<view class="nav-items">
			<navigator url="../team/team" class="item">
				<view class="icon"><image src="../../../static/vip/info-icon1.png" class="img" mode="widthFix"></image></view>
				<text>我的团队</text>
			</navigator>
			<navigator url="../log/log" class="item">
				<view class="icon"><image src="../../../static/vip/info-icon2.png" class="img" mode="widthFix"></image></view>
				<text>佣金明细</text>
			</navigator>
			<navigator url="../rank/rank" class="item">
				<view class="icon"><image src="../../../static/vip/info-icon3.png" class="img" mode="widthFix"></image></view>
				<text>财富榜</text>
			</navigator>
			<navigator url="../drp" class="item">
				<view class="icon"><image src="../../../static/vip/info-icon4.png" class="img" mode="widthFix"></image></view>
				<text>我的微店</text>
			</navigator>
		</view>
		<view class="adv" v-if="drpdata.banner && drpdata.banner.length > 0">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in drpdata.banner" :key="index">
					<view class="swiper-item"><image :src="item.pic"></image></view>
				</swiper-item>
			</swiper>
		</view>
		</block>
		<block v-else>
			<view class="ectouch-notcont">
				<view class="img"><image src="../../../static/no_content.png" mode="widthFix"></image></view>
				<block v-if="viewStatus == 1">
					<block v-if="viewAudit == 0">
						<view class="cont">店铺申请已提交,正在审核,请联系管理员</view>
					</block>
					<block v-if="viewAudit == 2">
						<view class="cont">店铺申请被拒绝,请联系管理员</view>
					</block>
				</block>
				<block v-if="viewStatus == 2">
					<view class="cont">您还未购买成为分销商<navigator url="/pagesA/drp/register/register" class="uni-red">去购买</navigator></view>
				</block>
				<block v-if="viewStatus == 3">
					<view class="cont">店铺已关闭，请联系管理员</view>
				</block>
			</view>
		</block>

		<!--续费方式-->
		<uni-popup :show="renewShow" type="bottom" mode="fixed" v-on:hidePopup="renewClose">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">请选择续费方式</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="renewClose"></uni-icon>
				</view>
				<view class="not-content">
					<scroll-view :scroll-y="true" class="select-list">
						<view class="select-item" v-for="(item,index) in card.receive_value" :key="index" :class="{'active':renew_type == item.type}" @click="renew_method_select(item.type)">
							<view class="txt" v-if="item.type == 'integral'">积分换取</view>
							<view class="txt" v-if="item.type == 'order'">消费金额累积</view>
							<view class="txt" v-if="item.type == 'buy'">在线购买</view>
							<view class="txt" v-if="item.type == 'goods'">购买指定等值精选商品</view>
							<view class="txt" v-if="item.type == 'free'">免费领取</view>
							<view class="iconfont icon-ok"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>

		<dsc-loading :dscLoading="dscLoading"></dsc-loading>

		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>我的微店</text>
			</navigator>
		</dsc-common-nav>
		<!-- <tabbar :curpage="curpage"></tabbar> -->
	</view>
</template>

<script>
	import { mapState } from 'vuex'

	import uniPopup from "@/components/uni-popup.vue";
	import uniIcon from "@/components/uni-icon.vue";
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import tabbar from "@/components/tabbar/tabbar.vue";

	export default {
		data() {
			return {
				autoplay: true,
				interval: 5000,
				duration: 500,
				dscLoading:true,
				curpage:'',
				renewShow:false,
				renew_type:''
			}
		},
		components:{
			uniIcon,
			uniPopup,
			dscNotContent,
			dscCommonNav,
			tabbar
		},
		computed:{
			...mapState({
				drpdata: state => state.drp.drpData
			}),
			viewStatus(){
				return this.drpdata ? this.drpdata.error : 0
			},
			viewAudit(){
				return this.drpdata ? this.drpdata.audit : 0
			},
			card(){
				return this.drpdata.membership_card_info ? this.drpdata.membership_card_info : ''
			},
			protectionList(){
				return this.card ? this.card.user_membership_card_rights_list : ''
			},
			receive_type_renew(){
				return this.drpdata.shop_info.receive_type_format
			}
		},
		methods: {
			inviteFriends(){
				uni.navigateTo({
					url:'../card/card'
				})
			},
			drpHref(){
				uni.navigateTo({
					url:'../drp'
				})
			},
			protectionHref(index){
				uni.navigateTo({
					url:'../protection/protection?card_id='+this.card.id+'&index='+index
				})
			},
			drpApplyHref(){
				uni.navigateTo({
					url:'../apply/apply?card_id='+this.card.id
				})
			},
			withdraw(){
				uni.navigateTo({
					url:'../withdraw/withdraw'
				})
			},
			drpRenew(){
				this.renewShow = true
			},
			applyAgain(){
				uni.navigateTo({
					url:"../register/register?membership_card_id_repeat=" + this.drpdata.shop_info.membership_card_id
				})
			},
			renewClose(){
				this.renewShow = false
			},
			renew_method_select(type){
				this.renew_type = type;

				if(this.card.id){
					uni.navigateTo({
						url:"../apply/apply?receive_type=" + type + "&membership_card_id_renew=" + this.card.id
					})
				}else{
					uni.navigateTo({
						url:"../apply/apply?receive_type=" + type
					})
				}
			}
		},
		onLoad(){

		},
		onShow() {
			// let pages = getCurrentPages()
			// this.curpage = pages[pages.length - 1].route

			this.$store.dispatch('setDrp')
		},
		watch:{
			drpdata(){
				this.dscLoading = false
			},
			viewStatus(){
				if(this.viewStatus == 2){
					uni.redirectTo({
						url:'register/register'
					})
				}
			}
		}
	}
</script>

<style>
.drp-info{ padding-bottom: 50upx; }
.drp-warp{ padding: 20upx 20upx 120upx 20upx; background: linear-gradient(0deg, #565555, #1c1c1c); }
.drp-warp .tip{ padding: 20upx; font-size: 25upx; background: #3b3b3b; color: #ecd8be; border-radius: 20upx; margin-bottom: 20upx; }
.drp-warp .header{padding: 20upx; background-image: url(../../../static/vip/info-bg.png); background-size: 100% 100%; border-radius: 20upx; margin-bottom: 20upx;}
.drp-warp .header-top{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; }
.drp-warp .header-top .header-img{ width: 120upx; height: 120upx; overflow: hidden; border-radius: 100%; border:5upx solid rgba(255,255,255,.3); }
.drp-warp .header-top .header-right{ flex: 1; margin-left: 20upx; }
.drp-warp .header-top .header-right .rank{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
.drp-warp .header-top .header-right .vip{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; background: linear-gradient(0deg, #151515, #2a2724); padding: 0 25upx 0 20upx; border-radius: 50upx; margin-top: 5upx;}
.drp-warp .header-top .header-right .time{ font-size: 25upx; color: #666666;}
.drp-warp .header-top .header-right .rank .more{ color: #666666;}
.drp-warp .header-top .header-right .vip .icon{ width: 40upx; height: 40upx; margin-right: 10upx;}
.drp-warp .header-top .header-right .vip text{ color: #E3C49E;}

.drp-warp .header-bottom{ margin-top: 20upx; padding-top: 20upx; display: flex; justify-content: flex-start; }
.drp-warp .header-bottom.bor{ border-top: 2upx solid #dea35a; }
.drp-warp .header-bottom .item{ background: #dea35a; display: flex; justify-content: center; align-items: center; height: 52upx; padding: 0 30upx; border-radius: 26upx; color: #FFFFFF; font-size: 25upx; margin-right: 20upx;}

.section{ background: #FFFFFF; box-shadow: 0 10upx 30upx 0 rgba(68, 79, 90, 0.11); border-radius: 20upx; margin-bottom: 20upx;}
.section .tit{ padding: 10upx 20upx; color: #805223; border-bottom: 2upx solid #E3D6C4; display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
.section .items{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center;}
.section .item{ flex: 1; width: 25%; padding: 25upx 0; display: flex; flex-direction: column; justify-content: center; align-items: center;}
.section .item .txt{ color: #AC8054; font-weight: 500;}
.section .item:first-child .txt{ color: #F2041A;}
.section .item .span{ color: #232323; font-size: 25upx;}

.team-box{ margin: -120upx 20upx; padding: 20upx; background: #FFFFFF; box-shadow: 0 10upx 20upx 0 rgba(95, 95, 95, 0.1); border-radius: 20upx;}
.team-box .tit{ display: flex; justify-content: center; align-items: center; position: relative; height: 60upx; margin: 10upx 0 30upx;}
.team-box .tit .row{ width: 200upx; height: 4upx; background: #000000;}
.team-box .tit text{ font-size: 33upx; font-weight: 600; padding: 0 10upx; background: #FFFFFF; position: absolute;}
.team-box .items{ display: flex; flex-direction: row;}
.team-box .item{ flex: 1 1 0%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #FCF3E7; border-radius: 10upx; margin: 0 10upx; height: 160upx;}
.team-box .item1{ margin-right: 10upx;}
.team-box .item3{ margin-left: 10upx;}
.team-box .item .num{ font-size: 32upx; font-weight: 700; color: #3A3A3A; }
.team-box .item .link{ background: linear-gradient(90deg, #ecd8be, #dbb280); width: 30upx; height: 4upx; margin: 10upx 0 15upx; }
.team-box .item .text{ color: #805223; font-size: 25upx;}

.team-box .button{ width: 100%; height: 100upx; line-height: 100upx; background: linear-gradient(118deg, #ecd8be, #dbb280); border-radius: 50upx; color: #805223; font-size: 40upx; text-align: center; margin:40upx 0; font-weight: 600; display: flex; flex-direction: row; justify-content: center; align-items: center;}
.team-box .button text{ margin-right: 10upx;}
.team-box .button .uni-icon{ height: 100upx; line-height: 110upx; display: block;}

.nav-items{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; flex-wrap: wrap; margin: 145upx 20upx 0upx;}
.nav-items .item{ width: 48.5%; padding: 20upx 40upx; margin-bottom: 20upx; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; background: #FFFFFF; box-shadow: 0 10upx 20upx 0 rgba(95, 95, 95, 0.1); border-radius: 10upx; box-sizing: border-box;}
.nav-items .item .icon{ width: 80upx; height: 80upx; margin-right: 20upx;}
.nav-items .item text{ height: 80upx; line-height: 80upx; color: #805223;}

.ectouch-notcont{ padding: 100upx 0 150upx; text-align: center;}
.ectouch-notcont .img{ width: 280upx; height: 280upx; margin: 0 auto;}
.ectouch-notcont .img image{ width: 100%;}
.ectouch-notcont .cont{ color: #999999; font-size: 30upx; display: block; flex-direction: row;}

.adv{ width: 720upx; height: 200upx; margin: 0 auto;}
.adv .swiper,
.adv .swiper .swiper-item{ width: 720upx; height: 200upx;}
.adv .swiper .swiper-item image{ width: 720upx; height: 200upx; }

.protection .value{
	border-radius: 20upx;
	display: flex;
	flex-direction: row;
	padding: 20upx 20upx 0 20upx;
	font-size: 24upx;
	flex-wrap: wrap;
}
.protection .value .item-list{
	width: 25%;
	text-align: center;
	margin-bottom: 20upx;
	box-sizing: border-box;
}
.protection .value .item-list .icon{
	width: 100%;
	border-radius: 50%;
	width: 130upx;
	height: 130upx;
	margin: 0 auto;
}
.protection .value .item-list .icon .img{ border-radius: 50%; }
.protection .value .item-list .text{
	margin-top: 10upx;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
