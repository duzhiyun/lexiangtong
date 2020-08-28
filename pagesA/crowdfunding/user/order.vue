<template>    
	<view class="container-tab-bar">
		<view class="tab-bar">
			<view v-for="(item,index) in tabs" :key="index" :class="['tab-item',status==index ? 'active' : '']" @click="teamNav(item)">
				<text>{{ item }}</text>
			</view>
		</view>	
		<view class="section-list">
			<view v-if="crowdOrderData && crowdOrderData.length > 0">
				<view class="user-item user-order-item" v-for="(item,index) in crowdOrderData" :key="index">
					<view class="item-hd">
						<view class="shop-name">订单状态</view>
						<view class="order-status uni-red">{{item.orderstatus}}</view>
					</view>	
					<view class="item-bd">						
						<view class="subHead">
							<view class="item">
								<view class="tit">订单号：</view>
								<view class="value" @click="$outerHref('/pagesA/crowdfunding/user/orderdetail?id='+item.order_id,'app')">{{ item.order_sn }}</view>
							</view>
							<view class="item">
								<view class="tit">下单时间：</view>
								<view class="value time">
									<view>{{ item.add_time }}</view>
								</view>
							</view>	
						</view>
						<view class="product-list product-list-max" >
							<view class="product-items">
								<view class="item" @click="$outerHref('/pagesA/crowdfunding/user/orderdetail?id='+item.order_id,'app')">									
									<view class="product-img">
										<image :src="item.title_img" v-if="item.title_img"></image>
										<image src="../../../static/gift-icon.png" class="icon"></image>
									</view>									
								</view>
							</view>
							<view class="product-more" @click="$outerHref('/pagesA/crowdfunding/user/orderdetail?id='+item.order_id,'app')">								
								<view class="reture-right-cont">
									<text class="twolist-hidden f-06">{{ item.title }}</text>
									<text class="f-03 color-7 m-top04">支持金额：<text class="color-red">{{ item.total_fee }}</text>元</text>
									<view class="f-03 color-7 m-top02">{{item.content}}</view>
								</view>
							</view>
						</view>	
						<view class="list-item-box"><!-- 共{{item.order_goods_num}}款商品 --> 合计：<text class="uni-red">{{ item.total_fee }}</text></view>
					</view>
					<view class="item-fd">
						<view class="btn-bar-min">
							<view class="btn" v-if="item.total_amount > 0 && item.handler != 7 && item.handler != 8" @click="onlinepay(item.order_sn)">立即付款</view>
							<view class="btn" v-if="item.handler == 2"  @click="receivedOrder(item.order_id)">确认收货</view>
							<view @click="$outerHref('/pagesA/crowdfunding/user/orderdetail?id='+item.order_id,'app')" hover-class="none"><view class="btn">查看订单</view></view>
							
						</view>
					</view>
				</view>
			</view>	
			<view v-else>
				<dsc-not-content></dsc-not-content>
			</view>
		</view>	
		<CroTabbar /> 
	</view>
    
</template>
<script>
    import { mapState } from 'vuex'
    import CroTabbar from '../components/croTabbar' 
	import dscNotContent from '@/components/dsc-not-content.vue';

    export default {
        name: "bargain-order",
        components: {
            CroTabbar,
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
                tabs: ['全部订单', '待支付', '待发货', '待收货', '已完结'],
            }
        },
        //初始化加载数据
        created() {
            this.Order(this.status)
        },
        computed: {
            crowdOrderData:{
                get(){
                    return this.$store.state.crowdfunding.crowdOrderData
                },
                set(val){
                    this.$store.state.crowdfunding.crowdOrderData = val
                }
            }
        },
        methods: {
            teamNav(item) {
                if(item =='全部订单'){
                    this.status = 0
                }else if(item=='待支付'){
                    this.status = 1
                }else if(item=='待发货'){
                    this.status = 2
                }else if(item =='待收货'){
                    this.status = 3
                }else{
                    this.status = 4
                }
                this.Order(this.status)
            },
            Order(status,page) {
                if(page){
                    this.page = page
                    this.size = Number(page) * 10
                }
                this.$store.dispatch('setCrowdfundingOrder',{
                    status: status,
                    size:this.size,
                    page:this.page,
                })
            },
			//确认收货
			receivedOrder(id){
				this.$store.dispatch('setReceivedOrder',{
					order_id:id
				}).then(res=>{
					if(res.data == true){
						uni.showToast({
							title:'订单已确认收货',
							icon:'none'
						});
						this.Order(this.status)
					}
				})
			},
			//立即支付
			onlinepay(id){
				uni.navigateTo({
					url:'/pages/done/done?order_sn=' + id
				})
			}
			
        },
		onReachBottom(){
			if(this.page * this.size == this.crowdOrderData.length){
				this.page ++
				this.Order()
			}
		}
    };
</script>

<style>
	.color-7 {color: #777;}
	.m-top04 {margin-top: 8upx;	}
	.f-03 {font-size: 26upx;}
</style>
