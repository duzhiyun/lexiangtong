<template>
    <view class="con">
        <view class="con_main drp-select cro_funing cro-user">
            <!--店铺信息-->
            <view class="header fun-header">
                <view class="header-img">
                    <img :src="crowdUserData.user_picture" class="img" />
                </view>
                <view class="admin color-white">
                    <text class="f-05">{{crowdUserData.user_name}}</text>
                    <text class="f-03 m-top04">会员等级：{{crowdUserData.rank_name ? crowdUserData.rank_name : ''}}</text>
                </view>
            </view>
			
			<view class="my-nav-box">
				<navigator @click="$outerHref('/pagesA/crowdfunding/user/order','app')" hover-class="none" class="item">
					<view class="tit"><text class="iconfont icon-detail color-red"></text>我的订单</view>
					<uni-icon type="arrowright" size="18" color="#999999"></uni-icon>
				</navigator>
				<navigator @click="$outerHref('/pagesA/crowdfunding/user/buy','app')" hover-class="none" class="item">
					<view class="tit"><text class="iconfont icon-detail color-red"></text>我的支持</view>
					<uni-icon type="arrowright" size="18" color="#999999"></uni-icon>
				</navigator>
				<navigator @click="$outerHref('/pagesA/crowdfunding/user/focus','app')" hover-class="none" class="item">
					<view class="tit"><text class="iconfont icon-detail color-red"></text>我的关注</view>
					<uni-icon type="arrowright" size="18" color="#999999"></uni-icon>
				</navigator>
			</view>   
			
			<view class="my-nav-box">
				<navigator hover-class="none" class="item">
					<view class="tit"><text class="iconfont icon-detail color-red"></text>项目推荐</view>
				</navigator>
			</view> 
			<!--商品列表-->
			<view class="goods-li" v-if="crowdBestData && crowdBestData.length > 0">
				<view class="bg-color-write li" v-for='(item,index) in crowdBestData' :key="index"
					@click="$outerHref('/pagesA/crowdfunding/detail/detail?id='+item.id,'app')">
					<view class="left p-r">
						<img class="title-img" :src="item.title_img" />
					</view>
					<view class="right">
						<text class="f-05 color-3 title">{{item.title}}</text>
						<view class="goods-num">
							<view class="list f-03 color-9">支持人数
								<text class="color-red">{{item.join_num}}</text>人
							</view>
							<view class="list f-03 color-9">剩余时间：{{item.shenyu_time}}天</view>
						</view>
						<view class="ect-progress dis-box">
							<view class="wrap box-flex">
								<text class="bar"  :style="{width:item.baifen_bi + '%'}">
									<text class="color"></text>
								</text>
							</view>
							<view class="txt">{{item.baifen_bi}}%</view>
						</view>
						<view class="goods-cont">
							<view class="list f-03 color-9">已筹
								<text class="color-red">{{item.join_money_formated}}</text>
							</view>
							<view class="list f-03 color-9">目标
								<text class="color-red">{{item.amount_formated}}</text>
							</view>
						</view>
					</view>
				</view>
            </view>
			<view v-else>
				<dsc-not-content></dsc-not-content>
			</view>
            <CroTabbar/>
        </view>
		<dsc-common-nav></dsc-common-nav>		
    </view>
</template>
<script>
	import { mapState } from 'vuex'
	import CroTabbar from '../components/croTabbar' 
	import dscNotContent from '@/components/dsc-not-content.vue'; 
	import uniIcon from "@/components/uni-icon.vue";
	import dscCommonNav from '@/components/dsc-common-nav.vue';

    export default {
        name: "auction-detail",
        components: {
            CroTabbar,
			dscNotContent,
			uniIcon,
			dscCommonNav
        },
        data() {
            return {
                routerName:'crowd_funding',
                disabled:false,
                loading:true,
                size:10,
                page:1,
            }
        },
        //初始化加载数据
        created() {
            this.$store.dispatch('setCrowdfundingUser')
            this.crowdGoods()
        },
        computed: {
            ...mapState({
                crowdUserData: state => state.crowdfunding.crowdUserData,
            }),
            crowdBestData:{
                get(){
                    return this.$store.state.crowdfunding.crowdBestData
                },
                set(val){
                    this.$store.state.crowdfunding.crowdBestData = val
                }
            }
        },
        methods: {
            loadMore(){
                setTimeout(() => {
                    this.disabled = true
                    if(this.page * this.size == this.crowdGoodsData.length){
                        this.page ++
                        this.crowdGoods()		
                    }
                },200);
            },
            crowdGoods() {
                this.$store.dispatch('setCrowdfundingBest',{
                    page:this.page,
                    size:this.size
                })
            },
            detailClick(item){
                this.$router.push({
                    name:'crowdfunding-detail',
                    params:{
                        id:item.id
                    }
                })
            }
        },
		onReachBottom(){
			if(this.page * this.size == this.crowdBestData.length){
				this.page ++
				this.crowdGoods()
			}
		}
    };
</script>
<style scoped>
	/* 会员信息 */
	.con {max-width: 640px;min-width: 320px;min-height: 100vh;margin-right: auto;margin-left: auto;overflow: hidden;}
	.con_main {padding-bottom: 200upx;}
	.drp-select {-webkit-box-orient: horizontal;-webkit-box-direction: normal;flex-direction: row;-webkit-box-pack: start;justify-content: flex-start;padding-bottom: 40upx;}
	.drp-select .header {background: url(../../../static/wd_bg.jpg) no-repeat; background-size: 100% 100%; padding: 40upx 15upx 120upx;display: flex;-webkit-box-align: center;align-items: center;}
	.drp-select .fun-header .header-img {margin-right: 10px;}
	.drp-select .header .header-img {width: 120upx;height: 120upx;border: 120upx5 solid hsla(0,0%,100%,.29); border-radius: 50%;-webkit-box-sizing: content-box;box-sizing: content-box;}
	.drp-select .fun-header .admin {display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;flex-direction: column;-webkit-box-flex: 1; flex: 1;}
	.f-05 {font-size: 30;}
	.m-top04 {margin-top: 8upx;}
	.f-03 {font-size: 26upx;}
	.m-top08 {margin-top: 16upx;}
	.color-white {color: #fff;}
	/* 导航 */
	.my-nav-box {margin-top:20rpx;border-radius:10rpx;background:#FFFFFF;}
	.my-nav-box .item {display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:20rpx;border-bottom:1px solid #f6f6f9;-ms-flex-pack:justify;
	justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;}
	.my-nav-box .item .tit .iconfont {margin-right:10rpx;font-size:14px;}
	/* 列表 */
	.goods-li {overflow: hidden; margin-bottom: 20upx;}
	.goods-li .li:first-child {border-top: none;}
	.goods-li .li {border-radius: 5px;background: #fff;overflow: hidden;padding: 20upx;}
	.goods-li .li .left {width: 27%;}
	.goods-li .li .left, .goods-li .li .right {float: left;}
	.p-r {position: relative;}
	.goods-li .li .right {width: 70%; padding-left: 20upx;}
	.cro_funing .goods-li .li .title {margin-bottom: 4upx;overflow: hidden;text-overflow: ellipsis; display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;height: 64upx;}
	.cro_funing .goods-li .li .goods-cont, .cro_funing .goods-li .li .goods-num {overflow: hidden;}
	.cro_funing .goods-li .li .goods-cont .list, .cro_funing .goods-li .li .goods-num .list { width: 50%;float: left;}
	.color-9 {color: #999;}
	.f-03 {font-size: 26upx;}
	.color-red {color: #f92028;}
	.ect-progress {margin: 18upx 0;}
	.dis-box {display: -webkit-box;}
	.ect-progress .wrap {position: relative; margin-bottom: 2px; height: 5px; border-radius: 5px; background-color: #efeeee; overflow: hidden;}
	.box-flex {-webkit-box-flex: 1; -moz-box-flex: 1; display: block!important; width: 100%;}
	.ect-progress .bar, .ect-progress .color {display: block;height: 100%;border-radius: 4px;}
	.ect-progress .bar, .ect-progress .color {display: block;height: 100%;border-radius: 4px;}
	.ect-progress .color {width: 100%; background: #f92028;}
	.ect-progress .txt {font-size: 24upx; text-align: right; color: #777; line-height: 10upx; padding-left: 20upx;}
	.ect-progress .color {width: 100%; background: #f92028;}
	.goods-li .li .left .title-img {width: 100%; display: block;}


</style>