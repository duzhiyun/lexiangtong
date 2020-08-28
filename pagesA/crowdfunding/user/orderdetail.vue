<template>
    <view class="container fixed-bottom-padding">
		<view class="flow-checkout-adr">
			<view class="adr-content">
				<view class="title">
					<text class="name">{{ crowdDetailData.consignee }}</text>
					<text class="mobile">{{ crowdDetailData.mobile }}</text>
				</view>
				<view class="address">{{ crowdDetailData.address }}</view>
			</view>
		</view>
		<view class="section-list">
			<view class="user-item">
				<view class="item-bd">
					<view class="subHead">
						<view class="item">
							<view class="tit">订单号：</view>
							<view class="value">{{ crowdDetailData.order_sn }}</view>
						</view>
						<view class="item">
							<view class="tit">下单时间：</view>
							<view class="value time">{{ crowdDetailData.add_time }}</view>
						</view>
					</view>						
					<view class="product-list">						
						<view class="product-items">
							<view class="item" @click="$outerHref('/pagesA/crowdfunding/detail/detail?id='+crowdDetailData.id,'app')">									
								<view class="product-img">
									<image :src="crowdDetailData.title_img" v-if="crowdDetailData.title_img"></image>
									<image src="../../../static/gift-icon.png" class="icon"></image>
								</view>									
							</view>
						</view>
						<view class="product-more" @click="$outerHref('/pagesA/crowdfunding/detail/detail?id='+crowdDetailData.id,'app')">								
							<view class="reture-right-cont">
								<text class="twolist-hidden f-06">{{ crowdDetailData.title }}</text>
								<text class="f-03 color-7 m-top04">支持金额：<text class="color-red uni-red">{{ crowdDetailData.formated_goods_amount }}</text>元</text>
								<view class="f-03 color-7 m-top02">{{crowdDetailData.content}}</view>
							</view>
						</view>		
					</view>
					<view class="list-item-box">共1件商品 合计：<text class="uni-red">{{ crowdDetailData.formated_goods_amount }}</text></view>			
				</view>
			</view>
		</view>			
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">配送方式</text>
						<view class="value">
							<text class="mr10">{{ crowdDetailData.shipping_name }}</text><!-- <text class="uni-red">{{ orderDetail.shipping_fee_formated }}</text> -->
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">支付方式</text>
						<view class="value">
							<text class="mr10">{{ crowdDetailData.shipping_name }}</text><!-- <text class="uni-red">{{ orderDetail.shipping_fee_formated }}</text> -->
						</view>
					</view>
				</view>
			</view>
		</view>			
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">商品金额</text>
						<view class="value">
							<text class="mr10 uni-red">{{ crowdDetailData.formated_goods_amount }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">已付金额</text>
						<view class="value">
							<text class="mr10 uni-red">{{ crowdDetailData.formated_goods_amount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>	
    </view>
</template>
<script>	
	import { mapState } from 'vuex'
	
    export default {
        name: "team-orderdetail",
        data() {
            return {
                routerName:'crowd_funding',
            };
        },
        components: {
        },
        //初始化加载数据
        onLoad(e){
        	this.order_id = e.id
            this.$store.dispatch({
                    type: 'setCrowdfundingDetail',
                    order_id: this.order_id,
                })
        },
        computed: {
            ...mapState({
                crowdDetailData: state => state.crowdfunding.crowdDetailData,
            }),
        }
    };
</script>


<style>
</style>
