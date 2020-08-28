<template>
	<view>
		<view class="user-detail">
		    <view class="section-list">
		    	<view class="detail-title">退换货申请详情</view>
    		    <view class="product-list uni-card" v-if="refoundDetail">
    		    	<view class="product-items">
    		          <view class="item">
    	                <view class="product-img"><image class="img" :src="refoundDetail.goods_thumb"></image></view>
    	                <view class="product-info">
    	                  <view class="product-name twolist-hidden">{{ refoundDetail.goods_name }}</view>
    	                  <view class="product-row">
    	                    <view class="price">{{ refoundDetail.goods_price }}</view>
    	                    <view class="number">x{{refoundDetail.return_number}}</view>
    	                  </view>
	                      <view class="p-t-remark" v-if="refoundDetail.get_order_return">{{ refoundDetail.get_order_return.attr_val }}</view>
                        </view>
    		          </view>
    		      	</view>
    		    </view>
		    </view>
		    <view class="section-list">
    		    <view class="uni-card uni-card-not">
    		    	<view class="padding-all">
			    	  <view class="detail-title">详细信息</view>
    			      <view class="select-one-1">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">退换货流水号:</text>
                            	<view class="value color-red">{{refoundDetail.return_sn}}</view>
                            </view>
                        </view>
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">申请时间:</text>
                            	<view class="value color-red">{{refoundDetail.apply_time}}</view>
                            </view>
                        </view>
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">服务类型:</text>
                            	<view class="value color-red">
                            		<block v-if="refoundDetail.return_type == 0">
                            		维修
                            		</block>
                            		<block v-else-if="refoundDetail.return_type == 1">
                            		退货
                            		</block>
                            		<block v-else-if="refoundDetail.return_type == 2">
                            		换货
                            		</block>
                            		<block v-else="refoundDetail.return_type == 3">
                            		仅退款
                            		</block>
                            	</view>
                            </view>
                        </view>
    			      </view>
    		      	</view>
    		    </view>
		    	<view class="uni-card uni-card-not">
    		    	<view class="padding-all">
			    	  <view class="detail-title">订单状态</view>
    			      <view class="select-one-1">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">订单状态:</text>
                            	<view class="value color-red">{{refoundDetail.return_status1}} - {{refoundDetail.refound_status1}}</view>
                            </view>
                        </view>
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">问题描述:</text>
                            	<view class="value color-red">{{refoundDetail.return_brief}}</view>
                            </view>
                        </view>
                        <block v-if="refoundDetail.return_status == 6">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">拒绝原因:</text>
                            	<view class="value color-red">{{refoundDetail.action_note}}</view>
                            </view>
                        </view>
                        </block>
                        <block v-else>
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">退换货原因:</text>
                            	<view class="value color-red">{{refoundDetail.return_cause}}</view>
                            </view>
                        </view>
                        </block>
                        <block v-if="refoundDetail.return_type == 1 || refoundDetail.return_type == 3">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">商品退款:</text>
                            	<view class="value color-red">{{refoundDetail.formated_should_return}}</view>
                            </view>
                        </view>
                        </block>
			            <block v-if="refoundDetail.return_shipping_fee > 0 ">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">运费退款:</text>
                            	<view class="value color-red">+ {{refoundDetail.formated_return_shipping_fee}}</view>
                            </view>
                        </view>
                        </block>
						  <block v-if="refoundDetail.goods_coupons > 0 ">
							  <view class="uni-list-cell uni-list-cell-last">
								  <view class="uni-list-cell-navigate">
									  <text class="t-title">优惠券:</text>
									  <view class="value color-red">- {{refoundDetail.formated_goods_coupons}}</view>
								  </view>
							  </view>
						  </block>
			            <block v-if="refoundDetail.goods_bonus > 0 ">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">红包:</text>
                            	<view class="value color-red">- {{refoundDetail.formated_goods_bonus}}</view>
                            </view>
                        </view>
                        </block>
			    		<block v-if="refoundDetail.actual_return > 0">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">合计已退款:</text>
                            	<view class="value color-red">{{refoundDetail.formated_actual_return}}</view>
                            </view>
                        </view>
                        </block>
                      </view>
                    </view>
                </view>
		        <block v-if="refoundDetail.img_list && refoundDetail.img_list.length > 0">
		    	<view class="uni-card uni-card-not">
    		    	<view class="padding-all">
    			      <view class="select-one-1">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">凭证图片:</text>
                            	<view class="value color-red"></view>
                            </view>
                        </view>
    			        <view class="uni-list-cell uni-list-cell-last">
	    			        <view class="uni-list-cell-navigate">
	                            <view class="goods-info-img-box">
	                              <view class="goods-info-img" v-for="(item,index) in refoundDetail.img_list" :key="index">
	                                <img :src="item.img_file" />
	                              </view>
	                            </view>
                            </view>
                        </view>
                      </view>
                    </view>
                </view>
		        </block>
		    	<view class="uni-card uni-card-not">
    		    	<view class="padding-all">
    			      <view class="select-one-1">
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">收货人:</text>
                            	<view class="value color-red">{{refoundDetail.addressee}}</view>
                            </view>
                        </view>
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">手机号码:</text>
                            	<view class="value color-red">{{refoundDetail.phone}}</view>
                            </view>
                        </view>
    			        <view class="uni-list-cell uni-list-cell-last">
                            <view class="uni-list-cell-navigate">
                            	<text class="t-title">详细地址:</text>
                            	<view class="value color-red">{{refoundDetail.address_detail}}</view>
                            </view>
                        </view>
                      </view>
                    </view>
                </view>
		        <block v-if="refoundDetail.agree_apply == 1 && refoundDetail.return_type != 3">
		            <block v-if="refoundDetail.back_shipp_shipping">
        		    	<view class="uni-card uni-card-not">
            		    	<view class="padding-all">
        			    	  <view class="detail-title">快递信息 <text class="help color-red">(用户寄出)</text></view>
            			      <view class="select-one-1">
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">快递公司:</text>
                                    	<view class="value color-red">{{refoundDetail.back_shipp_shipping}}</view>
                                    </view>
                                </view>
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">快递单号:</text>
                                    	<view class="value color-red">{{refoundDetail.back_invoice_no}}</view>
                                    </view>
                                </view>
            			        <!-- <view class="uni-list-cell uni-list-cell-last" v-if="refoundDetail.back_invoice_no_btn">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title"></text>
                                    	<view class="value"><a :href="refoundDetail.back_invoice_no_btn" class="btn-default-new current">订单跟踪</a></view>
                                    </view>
                                </view> -->
                              </view>
                            </view>
                        </view>
		            </block>
		            <block v-else>
		                <view class="detail-title m-top10">快递信息 <span class="help color-red">(请填写您寄回商品的快递信息)</span></view>
		                <van-cell-group class="van-cell-noright m-top08">
		                    <van-cell title="快递公司：">
		                        <view class="select-one-1">
		                            <select class="select form-control parent_cause_select" v-model="shippingSelect">
		                                <option v-for="item in shipping_list" :value="item.shipping_id">{{ item.shipping_name }}</option>
		                                <option value="999">其他快递</option>
		                            </select>
		                        </view>
		                    </van-cell>
		                    <van-cell title="其他快递：" v-if="shippingSelect == 999">
		                        <van-field placeholder="填写快递公司" v-model="other_express" class="van-cell-ptb0" />
		                    </van-cell>
		                    <van-cell title="快递单号：">
		                        <van-field placeholder="请填写快递单号" v-model="express_sn" class="van-cell-ptb0" />
		                    </van-cell>
		                    <view class="filter-btn">
		                        <view class="btn btn-submit" @click="submitBtn">提交</view>
		                    </view>
		                </van-cell-group>
        		    	<view class="uni-card uni-card-not">
            		    	<view class="padding-all">
        			    	  <view class="detail-title">快递信息 <text class="help color-red">(请填写您寄回商品的快递信息)</text></view>
            			      <view class="select-one-1">
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">快递公司:</text>
                                    	<view class="value"><input placeholder="请填写快递公司" v-model="address"></view>
                                    </view>
                                </view>
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">其他快递:</text>
                                    	<view class="value"><input placeholder="请填写快递公司" v-model="other_express"></view>
                                    </view>
                                </view>
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">快递单号:</text>
                                    	<view class="value"><input placeholder="请填写快递单号" v-model="express_sn"></view>
                                    </view>
                                </view>
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="btn-bar">
                                      <view class="btn btn-red">
                                      	<view @click="submitBtn">提交申请</view>
                                      </view>
                                    </view>
                                </view>
                              </view>
                            </view>
                        </view>
		            </block>

		            <block v-if="refoundDetail.out_shipp_shipping">
		                <view class="uni-card uni-card-not">
            		    	<view class="padding-all">
        			    	  <view class="detail-title">快递信息 <text class="help color-red">(商家发货)</text></view>
            			      <view class="select-one-1">
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">快递公司:</text>
                                    	<view class="value color-red">{{refoundDetail.out_shipp_shipping}}</view>
                                    </view>
                                </view>
            			        <view class="uni-list-cell uni-list-cell-last">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title">快递单号:</text>
                                    	<view class="value color-red">{{refoundDetail.out_invoice_no}}</view>
                                    </view>
                                </view>
            			        <!-- <view class="uni-list-cell uni-list-cell-last" v-if="refoundDetail.out_invoice_no_btn">
                                    <view class="uni-list-cell-navigate">
                                    	<text class="t-title"></text>
                                    	<view class="value"><a :href="refoundDetail.out_invoice_no_btn" class="btn-default-new current">订单跟踪</a></view>
                                    </view>
                                </view> -->
                              </view>
                            </view>
                        </view>
		            </block>
		        </block>
		    </view>
	        <view class="btn-bar btn-bar-fixed" v-if="refoundDetail.status > 0">
	        	<view class="btn btn-red">
	        		<block v-if="refoundDetail.status == 3"><view @click="receivedOrder">确认收货</view></block>
	        		<block v-else-if="refoundDetail.status == 4 || refoundDetail.status == 1"><view>已完成</view></block>
	        		<block v-else-if="refoundDetail.status == 6"><view>已拒绝</view></block>
	        		<block v-else-if="refoundDetail.agree_apply == 0"><view>待同意</view></block>
	            </view>
	        </view>
		</view>
		<dsc-common-nav></dsc-common-nav>
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		components:{
			dscCommonNav,
			dscNotContent
		},
		data() {
			return {
				ret_id:0,
	            shippingSelect:999,
	            other_express:'',
	            express_sn:''
			};
		},
		computed:{
	        ...mapState({
	            refoundDetail: state => state.user.refoundDetail
	        }),
	        shipping_list(){
	            return this.refoundDetail.shipping_list ? this.refoundDetail.shipping_list : []
	        }
		},
		methods:{
			refoundLoad(){
			    this.$store.dispatch('setReturnDatail',{
			        ret_id:this.ret_id
			    })
			},
			receivedOrder(){
		    	uni.showModal({
		    	  title: '提示',
		    	  content: '你确认已经收到货物了吗？',
		    	  success(res){
		    	  	if(res.confirm){
		    	  		uni.request({
		    	  			url:this.websiteUrl + '/api/v4/refound/affirm_receive',
		    	  			method:'POST',
		    	  			data: {ret_id:this.ret_id},
		    	  			header: {
		    	  				'Content-Type': 'application/json',
		    	  				'token': uni.getStorageSync('token')
		    	  			},
		    	  			success: (res) => {
		    	  				uni.showModal({
		    	  				    title: '提示',
		    	  				    content: res.data.data.msg
		    	  				});
		    	  				if(res.data.data.code == 0){
		    	  				    this.refoundLoad()
		    	  				}
		    	  			}
		    	  		});
		        	}
		    	  }
		    	})
			},
			submitBtn(){
			    if(this.other_express ==''){
			        uni.showModal({
			            title: '提示',
			            content: '填写快递公司'
			        });
			        return false
			    }else if(this.express_sn == ''){
			        uni.showModal({
			            title: '提示',
			            content: '请填写快递单号'
			        });
			        return false
			    }

			    let o ={
			        shipping_id:this.shippingSelect,
			        express_name:this.other_express,
			        express_sn:this.express_sn,
			        order_id:this.refoundDetail.order_id,
			        ret_id:this.refoundDetail.ret_id
			    }
			    uni.request({
			    	url:this.websiteUrl + '/api/v4/refound/edit_express',
			    	method:'POST',
			    	data: o,
			    	header: {
			    		'Content-Type': 'application/json',
			    		'token': uni.getStorageSync('token')
			    	},
			    	success: (res) => {
			    		uni.showModal({
			    		    title: '提示',
			    		    content: res.data.data.msg
			    		});
			    		if(res.data.data.code == 0){
			    		    this.refoundLoad()
			    		}
			    	}
			    });
			}
		},
		onLoad(e) {
			this.ret_id = e.ret_id ? e.ret_id : 0
			this.refoundLoad()
		},
		watch:{
			shippingSelect(){
			    if(this.shipping_list.length > 0){
			        this.shipping_list.forEach(res=>{
			            if(res.shipping_id == this.shippingSelect){
			                this.other_express = res.shipping_name
			            }
			        })
			    }
			}
		}
	}
</script>
<style lang="scss" scoped>
@mixin box(){
    display: -webkit-box; 
    display: -moz-box; 
    display: -ms-box; 
     display: flex;/*duzy*/
}
@mixin box-flex(){
    box-flex: 1;
    -webkit-box-flex: 1; 
    -moz-box-flex: 1; 
    -ms-box-flex: 1; 
    display: block !important; 
    width: 100%;
}
.dis-box{ @include box(); }
.color-red {
    color: #f92028;
}
.fr{ float: right; }
.btn-default-new {
    padding: 6upx 16upx;
    font-size: 28upx;
    width: auto;
    border: 1upx solid #ccc;
    border-radius: 5upx;
    color: #333;
    margin-left: 10upx;
}
.btn-default-new.disabled {
    background-color: #fff;
    border: 1upx solid #ccc;
    color: #ccc;
}
.user-detail{ padding-bottom: 100upx; }
.user-item .item-bd {
    padding: 28upx 26upx;
    border-top: 1upx solid #f0f0f0;
}
.user-item .subHead h4 label {
    font-size: 1.4rem;
    color: #999;
    font-weight: 400;
}
.user-item .subHead p span {
    height: 2rem;
    line-height: 2rem;
    display: inline-block;
    float: left;
}
.reture-left-img{
	width: 140upx;
	margin: 0 12upx 12upx 0;

	.img-box{
		position: relative;
		display: block;
		padding-top: 100%;

		.img{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		span{
			position: absolute;
			font-size: 28upx;
			left: 1px;
			right: 0;
			bottom: 0;
			padding: 8upx 0;
			text-align: center;
			display: block;
			background: rgba(0,0,0,0.6);
			color: #fff;
		}
	}
}

.reture-right-cont{
	margin-left: 8upx;
	@include box-flex();

	h4{
		font-size: 30upx;
		color: #444;
	}

	.p-attr{
		font-size: 1.3rem;
		color: #999;
		margin-top: .5rem;
	}

	.reture-footer{
		margin-top: 42upx;
	}

	.p-virtual{
		margin-top: 8upx;

		.virtual-item{ color: #999; line-height: 1.5 }
	}
}

.reture-right-san{
	margin: 66upx 0 0 10upx;
}

.product-list{
	.product-div{
		padding: 26upx 0 0;
	}
}
.detail-title {
    padding: 22upx;
    border-bottom: 1upx solid #f6f6f9;
    font-size: 32upx;
    background-color: #fff;
}
.uni-list-cell-navigate{
	border-bottom: 1upx solid #f6f6f9;
}
.goods-info-img-box{
	overflow: hidden;
	.goods-info-img{
		float: left;
		position: relative;
		width: 200upx;
		height: 200upx;
		border: 1px solid #ccc;
		margin: 0 20upx 20upx 0;
		image{ position: absolute; width: 100%; height: 100%; left: 0; top: 0; }
		.iconfont{ position: absolute; right: 3upx; top: 3upx; z-index: 3; color: #f00; text-shadow: 0 0 3upx rgba(0,0,0,.3)}
	}
}
.uni-list-cell-navigate .value{
	flex: 1;
	margin-left: 10upx;
}
</style>
