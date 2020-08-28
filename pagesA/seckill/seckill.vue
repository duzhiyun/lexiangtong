<template>
	<view class="seckill-box">
		<block v-if="seckillTimeData.list">
			<view class="seckill-time-tab">
				<view class="item" :class="{'active': firstIndex == index}" v-for="(item,index) in seckillTimeData.list" :key="index" @click="handleFilter(item,index)">
					<view class="title">{{item.title}}</view>
					<view class="text" v-if="item.status && !item.soon && !item.is_end">抢购进行中</view>
					<view class="text" v-if="!item.status && item.soon && !item.is_end">即将开始</view>
					<view class="text" v-if="!item.status && !item.soon && item.is_end">已结束</view>
				</view>
			</view>
			<swiper class="swiper-box" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" v-if="seckillTimeData.banner_ads && seckillTimeData.banner_ads.length > 0">
				<swiper-item v-for="(item,index) in seckillTimeData.banner_ads" :key="index">
					<view class="swiper-item" @click="$outerHref(item.link)">
						<image :src="item.ad_code" class="img" v-if="item.ad_code"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="seckill-content">
				<view class="head">
					<view class="left">更多爆款，限时抢购</view>
					<view class="right">
						<text v-if="status">距结束</text>
						<text v-else>距开始</text>
						<view class="data">
							<uni-countdown fontColor="#FFFFFF" bgrColor="#000000" :timer="seckillTime" v-if="seckillTime"></uni-countdown>
						</view>
					</view>
				</view>
				<block v-if="seckillData">
					<view class="goods-list">
						<view class="goods-item" v-for="(item,index) in seckillData" :key="index" @click="detailClick(item)">
							<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
							<view class="goods-right">
								<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
								<view class="plan-box">
									<view class="left">
										<view class="tit"><text class="color" :style="{width:item.percent + '%'}"></text></view>
										<view class="em">{{item.percent}}%</view>
									</view>
									<view class="right">已抢{{item.sales_volume.valid_goods}}件</view>
								</view>
								<view class="plan-box">
									<view class="price">¥{{item.sec_price}}<text class="daily-price">¥{{item.market_price}}</text></view>
									<view class="btn" v-if="item.status">马上抢</view>
									<view class="btn btn-soon" v-if="item.soon">即将开始</view>
								</view>
							</view>
						</view>
					</view>
					<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
				</block>
				<block v-else>
					<dsc-not-content></dsc-not-content>
				</block>
			</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		
		<dsc-common-nav>
			<navigator url="../seckill" class="nav-item" slot="right">
				<view class="iconfont icon-team"></view>
				<text>秒杀首页</text>
			</navigator>
		</dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniCountdown from "@/components/uni-countdown.vue";
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	export default {
		data() {
			return {
				firstIndex: 0,
				firstId: 0,
				tomorrow: 0,
				status: true,
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				size: 10,
                page: 1,
				seckillTime: '',
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components: {
			uniCountdown,
			dscNotContent,
			dscCommonNav
		},
		onLoad(){
			this.$store.dispatch('setSeckillTime')
		},
		onUnload(){
			this.loadMoreText = "加载更多",
			this.showLoadMore = false;
		},
		onReachBottom(){
			this.showLoadMore = true
			if(this.page * this.size == this.seckillData.length){
				this.page ++
				this.seckillClick()
			}else{
				this.loadMoreText = "没有更多数据了"
				return;
			}
		},
		onShareAppMessage(res){
			return {
			  title: '更多秒杀活动等你来',
			  path: '/pagesA/seckill/seckill'
			}
		},
		computed:{
			...mapState({
                seckillTimeData: state => state.ump.seckillTimeData
			}),
			seckillData:{
                get(){
                    return this.$store.state.ump.seckillData
                },
                set(val){
                  this.$store.state.ump.seckillData = val
                }
            }
		},
		methods: {
			seckillClick(page) {
                if(page){
                    this.page = page
                    this.size = Number(page) * 10
                }
				
				if(page == 1){
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				}

				this.$store.dispatch('setSeckill',{
                    id:this.firstId,
                    tomorrow: this.tomorrow,
                    page: this.page,
                    size: this.size,
                })
				
				this.loadMoreText = "加载中..."
            },
			handleFilter(item,index){
				this.firstIndex = index
				
				this.firstId = item.id
				this.tomorrow = item.tomorrow || 0
				this.status = item.status
				this.seckillTime = item.frist_end_time
				this.seckillClick(1)
			},
			detailClick(item) {
				uni.navigateTo({
					url:'/pagesA/seckill/detail/detail?id=' + item.id + '&tomorrow=' + this.tomorrow
				})
            },
		},
		watch:{
			seckillTimeData(){
				this.firstId = this.seckillTimeData.list[this.firstIndex].id
				this.tomorrow = this.seckillTimeData.list[this.firstIndex].tomorrow || 0
				this.status = this.seckillTimeData.list[this.firstIndex].status
				this.seckillTime = this.seckillTimeData.list[this.firstIndex].frist_end_time
				
				this.seckillClick(1)
			}
		}
	}
</script>

<style scoped>
.seckill-box{ padding-top: 120upx; }
.seckill-time-tab{ width: 100%; position: fixed; top: 0; z-index: 499; display: flex; flex-direction: row; background: linear-gradient(to right, #FA2829, #FE522C);}
.seckill-time-tab .item{ width: 25%; height: 100upx; font-size: 24upx; color: #ffffff; padding:10upx 0; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;}
.seckill-time-tab .item view{ line-height: 1.5;}
.seckill-time-tab .item .title{ padding: 0 20upx; font-size: 28upx;}
.seckill-time-tab .item.active .title{ background: #F6E2E1;color: #FA2829;border-radius: 2rem;font-weight: bold;position: relative; }

.swiper-box{ width:750upx; height: 336upx;}
.swiper-item{ width:750upx; height: 336upx; }

.seckill-content .head{ background: #f4f4f4; display: flex; justify-content: space-between; align-items: center; padding: 30upx;}
.seckill-content .head .left{ font-size: 32upx; font-weight: bold; color: #333333;}
.seckill-content .head .right{ display: flex; align-items: center; }
.seckill-content .head .right text{ font-size: 28upx; margin-right: 10upx;}

.goods-list{ background: #ffffff; }
</style>
