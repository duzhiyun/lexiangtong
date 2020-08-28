<template>
	<view class="container flow-checkout" v-if="crowdCheckoutData">		
		<view class="flow-checkout-adr" @click="checkoutAddress">
			<view class="adr-content">
				<view class="title" v-if="crowdCheckoutData.default_address">
					<text class="name">{{ crowdCheckoutData.default_address.consignee }}</text>
					<text class="mobile">{{ crowdCheckoutData.default_address.mobile }}</text>
				</view>
				<view class="address">{{ consignee_address }}</view>
			</view>
			<uni-icon type="forward" size="18" color="#999999"></uni-icon>
		</view>
		<view class="goods-li bg-color-write " v-if="cart_goods">			
			<view class="bg-color-write li" @click="$outerHref('/pagesA/crowdfunding/detail/detail?id='+cart_goods.id,'app')">
				<view class="left p-r">
					<img class="title-img" :src="cart_goods.title_img" v-if="cart_goods.title_img" />
					<img class="title-img" src="../../../static/not_goods.png" v-else />
				</view>
				<view class="right">
					<text class="f-05 color-3 title">{{cart_goods.title}}</text>
					<view class="goods-num">
						<view class="list f-03 color-9">已筹资金：
							<text class="color-red">{{cart_goods.formated_price}}</text>元
						</view>
						<view class="list f-02 color-9">支持人数{{cart_goods.join_num}}人</view>
					</view>
					<view class="ect-progress dis-box">
						<view class="wrap box-flex">
							<text class="bar"  :style="{width:cart_goods.baifen_bi + '%'}">
								<text class="color"></text>
							</text>
						</view>
						<view class="txt">{{cart_goods.baifen_bi}}%</view>
					</view>
					<view class="goods-cont f-03 color-7">
						{{cart_goods.content}}
					</view>
				</view>
			</view>
		</view>	
			
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">配送费用</text>
						<view class="value">
							<text class="uni-red" >{{ shipping_fee }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate justify-content-fs">
						<text class="title">买家留言</text>
						<view class="value">
							<input placeholder="选填（50）" v-model="postscriptValue[index]" />
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate justify-content-fe">
						<view class="value">共 {{crowdCheckoutData.number}} 件商品，合计：<text class="uni-red">{{ crowdCheckoutData.total.amount_formated }}</text></view>
					</view>
				</view>
			</view>
		</view>	
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="paymentSelect">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">支付方式</text>
						<view class="value">{{ pay_name }}</view>
					</view>
				</view>				
			</view>
		</view>		
		<view class="uni-card uni-card-not" v-if="crowdCheckoutData.use_surplus > 0">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<text class="title">是否使用余额</text>
						<view class="value"><switch :checked="surplusSelf" @change="surplusSelfHandle" /></view>
					</view>
				</view>
			</view>
		</view>		
		<view class="btn-goods-action">
			<view class="submit-bar-text">
				<text>应付总额：</text>
				<view class="submit-bar-price">{{ amountTotal }}</view>
			</view>
			<view class="btn-bar">
				<button class="btn btn-red" :disabled="disabled" @click="onSubmit">立即付款</button>
			</view>
		</view>		
		
		<!--支付方式-->
		<uni-popup :show="paymentShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose('payment')">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">支付方式</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('payment')"></uni-icon>
				</view>
				<view class="not-content">
					<scroll-view :scroll-y="true" class="select-list">
						<view class="select-item" v-for="(item,index) in payment_method" :key="index" :class="{'active':pay_id == item.pay_id}" @click="payment_method_select(item.pay_id,item.pay_name)">
							<view class="txt">{{ item.pay_name }}</view>
							<view class="iconfont icon-ok"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapState} from 'vuex'
import uniIcon from "@/components/uni-icon.vue";
import uniPopup from '@/components/uni-popup.vue';

export default{
    data() {
        return {
			loading:true,
            routerName:'crowd_funding',
			paymentShow: false,
            pay_name:'',
            cur_id:1,   
            value:'',
            radio:1,
            apart:'apart',
            showBase: false,
            use_surplus_val:0,
            pay_id: null,
			pid: this.pid,
			id:this.id,
			number: this.number	
        }
    },
	components:{ 
		uniIcon,
		uniPopup
    },
    //初始化加载数据
     onLoad(e){
		this.pid = e.pid,
		this.id  = e.id,
		this.number  = e.number		
        this.checkoutDefault()
    },
    computed: {
        ...mapState({
            crowdCheckoutData: state => state.crowdfunding.crowdCheckoutData,
        }),
        consignee_title(){
            if(this.crowdCheckoutData.default_address){
                return this.crowdCheckoutData.default_address.consignee +' '+ this.crowdCheckoutData.default_address.mobile
            }else{
                return ''
            }
        },
        consignee_address(){
            if(this.crowdCheckoutData.default_address){
                return this.crowdCheckoutData.default_address.province+this.crowdCheckoutData.default_address.city+this.crowdCheckoutData.default_address.district+this.crowdCheckoutData.default_address.address
            }else{
                return ''
            }
        },
        surplusSelf: {
            get() {
                return this.use_surplus_val == 0 ? false : true
            },
            set(val) {
                this.use_surplus_val = val == true ? 1 : 0
            }
        },
        cart_goods(){
            return this.crowdCheckoutData.cart_goods
        },
        order(){
            return this.crowdCheckoutData.order
        },
        total(){
            return this.crowdCheckoutData.total
        },
        amountTotal(){
            return this.crowdCheckoutData.total.amount_formated			
        },
        payment_method() {
            return this.crowdCheckoutData.payment_list ? this.crowdCheckoutData.payment_list : ''
        },
        shipping_fee(){
            return this.total.shipping_fee != 0 ? this.total.shipping_fee : '免运费'
        }
    },
    methods:{
        checkoutDefault(){
            this.$store.dispatch('setCrowdfundingCheckout',{
                pid: this.pid,
                id:this.id,
                number: this.number	,
            })
        },
		//展开支付方式
		paymentSelect() {
			this.paymentShow = true
		},
        payment_method_select(id, name) {
            this.pay_id = id
            this.pay_name = name
        },
		//是否使用余额
		surplusSelfHandle(e){
			this.use_surplus_val = e.detail.value == true ? 1 : 0
		},
		//关闭弹出层
		handelClose(val){
			if(val == 'payment'){
				this.paymentShow = false
			}
		},
		//选择收货地址
        checkoutAddress() {                 
			uni.navigateTo({
				url:'/pagesB/address/address?type=checkout'
			})
        },
		// 立即付款
        onSubmit(){
            this.$store.dispatch('setCrowdfundingDone',{
                pid: this.pid,
                id:this.id,
                number: this.number,
                pay_id:this.pay_id,
                is_surplus: this.use_surplus_val,
            }).then(res=>{
				uni.reLaunch({
					url:'/pages/done/done?order_sn='+res
				})               
            })
        },
    },
    watch:{
        crowdCheckoutData(){
            //默认选中在线支付
            if (this.pay_name == '' && this.crowdCheckoutData.error != 'address') {
                this.payment_method.forEach(v => {
                    if (v.pay_code == 'onlinepay') {
                        this.pay_name = v.pay_name
                        this.pay_id = v.pay_id
                    }
                })
            }

            if (this.crowdCheckoutData.error == 'address') {
				uni.navigateTo({
					url:'/pagesB/address/address?type=checkout'+'&routerLink=crowdfunding-checkout'+'&pid='+this.pid+'&id='+this.id+'&number='+this.number
				})
            }
        },
        payment_method() {
            if (this.payment_method == '') {
				uni.showToast({
					title:'未安装支付方式',
					icon:'none'
				})
                return false
            }
        },
    }
}
</script>


<style>	
	/* 列表 */
	.goods-li {overflow: hidden}
	.goods-li .li:first-child {border-top: none;}
	.goods-li .li {border-radius: 5px;background: #fff;overflow: hidden;padding: 20upx;}
	.goods-li .li .left {width: 27%;}
	.goods-li .li .left, .goods-li .li .right {float: left;}
	.p-r {position: relative;}
	.goods-li .li .right {width: 70%; padding-left: 20upx;}
	.flow-checkout .goods-li .li .title {margin-bottom: 4upx;overflow: hidden;text-overflow: ellipsis; display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;height: 64upx;}
	.flow-checkout .goods-li .li .goods-cont, .flow-checkout .goods-li .li .goods-num {overflow: hidden;}
	.flow-checkout .goods-li .li .goods-cont .list, .flow-checkout .goods-li .li .goods-num .list { width: 50%;float: left;}
	.color-9 {color: #999;}
	.f-03 {font-size: 26upx;}
	.f-02 {font-size: 24upx;}
	.color-red {color: #f92028;}
	.ect-progress {margin: 18upx 0;}
	.dis-box {display: -webkit-box;}
	.ect-progress .wrap {position: relative; margin-bottom: 2px; height: 5px; border-radius: 5px; background-color: #efeeee; overflow: hidden;}
	.box-flex {-webkit-box-flex: 1;display: block!important; width: 100%;}
	.ect-progress .bar, .ect-progress .color {display: block;height: 100%;border-radius: 4px;}
	.ect-progress .bar, .ect-progress .color {display: block;height: 100%;border-radius: 4px;}
	.ect-progress .color {width: 100%; background: #f92028;}
	.ect-progress .txt {font-size: 24upx; text-align: right; color: #777; line-height: 10upx; padding-left: 20upx;}
	.ect-progress .color {width: 100%; background: #f92028;}
	.goods-li .li .left .title-img {width: 100%; display: block;}
	
	
	
	
	
</style>
