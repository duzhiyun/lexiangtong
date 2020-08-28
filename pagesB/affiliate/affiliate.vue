<template>
	<view class="container">
		<view class="affiliate-cont-box" v-if="share && share.on > 0">
			<view class="header">
			<image :src="shareImg" v-if="shareImg" class="img"></image>
			<view class="share-ewm-box"><text>长按二维码发送给朋友</text></view>
			</view>
			<block v-if="share.on == 1">
				<block v-if="share.config.separate_by == 0">
					<view class="affiliate-cont">
						<view class="affiliate-warp">
							<view class="title">我推荐的会员</view>
							<view class="table">
								<view class="tr">
									<view class="th">等级</view>
									<view class="th">人数</view>
									<view class="th">积分分成</view>
									<view class="th">现金分成</view>
								</view>
								<view class="tr" v-for="(item,index) in affdb" :key="index">
									<view class="td">{{ index }}</view>
									<view class="td">{{ item.num }}</view>
									<view class="td">{{ item.point }}</view>
									<view class="td">{{ item.money }}</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>
		</view>
		<view v-else>
			<dsc-not-content :isSpan="false">
				<block slot="spanCon">亲，未开启推荐分成</block>
			</dsc-not-content>
		</view>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	import universal from '@/common/mixins/universal.js';
	export default {
		mixins:[universal],
		data() {
			return {
				affdb:[],
				all_res:[],
				config_info:[],
				share:{},
				shareImg:'',
				dscLoading:true,
			};
		},
		components:{
			dscCommonNav,
			dscNotContent
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/affiliate/affiliate'
			}
		},
		onLoad(){
			uni.request({
				url:this.websiteUrl + '/api/v4/invite',
				method:'GET',
				data:{
					page:1,
					size:10
				},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success:(res) => {
					this.affdb = res.data.data.affdb
					this.all_res = res.data.data.all_res
					this.config_info = res.data.data.config_info
					this.share = res.data.data.share
					this.shareImg = res.data.data.img_src
				}
			})
		},
		watch:{
			share(){
				this.dscLoading = false
			}
		}
	}
</script>

<style>
.affiliate-cont-box{ background-color: #fb9c0e; padding-bottom: 30px;}
.affiliate-cont-box .header{ width: 750upx; height: 1177upx; position: relative;}
.affiliate-cont-box .header .share-ewm-box{ position: absolute; top: 80%; left: 31%; width: 48%;}
.affiliate-cont-box .header .share-ewm-box text{ border:1px solid #ec5051; border-radius: 20upx; color: #f92028; text-align: center; padding: 5upx 20upx; font-size: 25upx;}

.affiliate-cont{ padding: 0 30upx;}
.affiliate-cont .affiliate-warp{ background: #FFFFFF; border-radius: 15upx; padding: 20upx 0;}
.affiliate-cont .affiliate-warp .title{ padding: 0 30upx; font-weight: bold;}
.affiliate-cont .affiliate-warp .table .td,.affiliate-cont .affiliate-warp .table .th{ text-align: center;}
.affiliate-cont .affiliate-warp .table .th{ background-color: #ffe7d1;}
</style>
