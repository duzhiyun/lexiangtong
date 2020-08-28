<template>
    <view class=" con" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
        <view class="team-order con_main cro_funing">
			<view class="tab-bar">
				<view v-for="(item,index) in tabs" :key="index" :class="['tab-item',status==index ? 'active' : '']" @click="teamNav(item)">
					<text>{{ item }}</text>
				</view>
			</view>			
             <!--商品列表-->
			<view class="goods-li" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300" v-if="crowdBuyData && crowdBuyData.length > 0">
				<view class="show bg-color-write li"  v-for='(item,index) in crowdBuyData' :key="index"
					@click="$outerHref('/pagesA/crowdfunding/detail/detail?id='+item.id,'app')">
					<view class="left p-r">
						<img class="title-img" :src="item.title_img" v-if="item.title_img" />
						<img class="title-img" src="../../../static/not_goods.png" v-else />
						<!-- <view class="raise-cate-tag"><i class="iconfont icon-gerenzhongxin icon-geren"></i>{{item.join_num}}</view> -->
					</view>
					<view class="right">
						<text class="f-05 color-3">{{item.title}}</text>
						<view class="goods-num">
							<view class="list f-02 color-9">支持人数
								<text class="color-red">{{item.join_num}}</text>人
							</view>
							<view class="list f-02 color-9">剩余时间：{{item.shenyu_time}}天</view>
						</view>
						<view class="ect-progress dis-box">
							<text class="wrap box-flex">
								<text class="bar" :style="{width:item.baifen_bi + '%'}">
									<text class="color"></text>
								</text>
							</text>
							<text class="txt">{{item.baifen_bi}}%</text>
						</view>
						<view class="goods-cont">
							<view class="list f-02 color-9">已筹：
								<text class="color-red">{{item.join_money}}</text>
							</view>
							<view class="list f-02 color-9">目标：
								<text class="color-red">{{item.amount}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<dsc-not-content></dsc-not-content>
			</view>
        </view>
    </view>
</template>
<script>
	import { mapState } from 'vuex'
	import dscNotContent from '@/components/dsc-not-content.vue';

    export default {
        name: "bargain-order",
        components: {
			dscNotContent
        },
        data() {
            return {
                routerName:'crowd_funding',
                disabled:false,
			    loading:true,
				size:10,
                page:1,
                status:0,
                active: 0,
                tabs: ['全部项目', '进行中', '已成功'],
            };
        },
        //初始化加载数据
        created() {
            this.Buy(this.status)
        },
        computed: {
            crowdBuyData:{
                get(){
                    return this.$store.state.crowdfunding.crowdBuyData
                },
                set(val){
                    this.$store.state.crowdfunding.crowdBuyData = val
                }
            }
        },
        methods: {
            teamNav(item) {
                if(item == '全部项目'){
                    this.status = 0
                }else if(item=='进行中'){
                    this.status = 1
                }else{
                    this.status = 2
                }
                this.Buy(this.status)
            },
            Buy(status,page) {
				if(page){
				    this.page = page
				    this.size = Number(page) * 10
				}
                this.$store.dispatch('setCrowdfundingBuy',{
                    status: status,
                    size:this.size,
                    page:this.page,
                });
            },
        },
		onReachBottom(){
			if(this.page * this.size == this.crowdBuyData.length){
				this.page ++
				this.Buy()
			}
		}
    };
</script>


<style>
	.con {max-width: 640px; min-width: 320px;min-height: 100vh;margin-right: auto; margin-left: auto; overflow: hidden;	}
	.con_main {padding-bottom: 200upx;	}
	.van-tabs--line {padding-top: 44px;}
	.van-tabs { position: relative;}
	
	/* 列表 */
	.goods-li {overflow: hidden; margin-bottom: 20upx; padding-top:48px;}
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
