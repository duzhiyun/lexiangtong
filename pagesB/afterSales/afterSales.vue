<template>
	<view>
		<view class="section-list">
			<template v-if="order_id == 0">
			  <template v-if="refoundList && refoundList.length > 0">
			  <section class="user-item" v-for="(itemList,index) in refoundList" :key="index">
			      <view class="item-hd">
			          <view class="subHead">
			              <view class="h4">
			                  <text class="label">退换货流水号：</text>
			                  <text class="span">{{ itemList.return_sn }}</text>
			              </view>
			              <view class="p">
			                  <text class="label">申请时间： </text>
			                  <text class="m-r05">{{ itemList.apply_time }}</text>
			                  <text class="color-red m-r05" v-if="itemList.agree_apply == 0">待同意</text>
			                  <text class="color-red m-r05" v-else-if="itemList.agree_apply == 1">已同意</text>
			                  <text class="color-red m-r05" v-else>已拒绝</text>
			                  <text class="color-red">{{ itemList.reimburse_status }}</text>
			              </view>
			          </view>
			      </view>
			      <view class="flow-checkout-pro">
			          <view class="item-bd">
			              <view class="list-bd-box">
			                  <ul class="dis-box">
			                      <li class="reture-left-img">
			                          <view class="img-box">
			                              <image :src="itemList.goods_thumb" class="img" v-if="itemList.goods_thumb" ></image>
			                          </view>
			                      </li>
			                      <li class="reture-right-cont">
			                          <h4 class="ellipsis-one">{{ itemList.goods_name }}</h4>
			                          <view class="reture-footer">
			                              <view class="price">
			                                  <text class="span" v-if="itemList.get_return_goods">数量×{{ itemList.get_return_goods.return_number }}</text>
			                              </view>
			                              <view class="fr">
			                                  <template v-if="itemList.refound_cancel">
			                                  <view class="btn-default-new" @click="cancelRefound(itemList.ret_id)">取消申请</view>
			                                  </template>
			                                  <template v-if="itemList.activation_type">
			                                      <view class="btn-default-new" @click="applyRefoundjihuo(itemList.ret_id)">已激活</view>
			                                  </template>
			                                  <view class="btn-default-new" @click="applyRefoundView(itemList.ret_id)">查看详情</view>
			                              </view>
			                          </view>
			                      </li>
			                  </ul>
			              </view>
			          </view>
			      </view>
			  </section>
			  </template>
			  <template v-else>
			      <dsc-not-content></dsc-not-content>
			  </template>
			</template>
			<template v-else>
			  <section class="user-item" v-if="orderRefound">
			      <view class="item-hd">
			          <view class="subHead">
			              <h4>
			                  <label>订单号：</label>
			                  <span>{{ orderRefound.order_sn }}</span>
			              </h4>
			              <p>
			                  <span>申请时间： </span>
			                  <span class="m-r05">{{ orderRefound.formated_add_time }}</span>
			              </p>
			          </view>
			      </view>
			      <view class="flow-checkout-pro">
			          <view class="item-bd">
			              <view class="list-bd-box" v-for="(item,index) in orderRefound.goods" :key="index">
			                  <ul class="dis-box">
			                      <li class="reture-left-img">
			                          <view class="img-box">
			                              <img :src="item.goods_thumb" class="img" v-if="item.goods_thumb" />
			                          </view>
			                      </li>
			                      <li class="reture-right-cont">
			                          <h4 class="ellipsis-one">{{ item.goods_name }}</h4>
			                          <view class="reture-footer">
			                              <view class="price">
			                                  <text class="color-red">{{ item.goods_price }}</text>
			                                  <span>×{{ item.goods_number }}</span>
			                              </view>
			                              <view class="fr">
			                                  <template v-if="item.is_refound">
			                                      <span class="color-red f-06">已申请</span>
			                                  </template>
			                                  <template v-else>
			                                      <template v-if="(item.goods_cause && item.goods_cause.length == 0) || item.extension_code == 'virtual_card' || item.extension_code == 'package_buy'">
			                                          <view class="btn-default-new disabled">申请售后</view>
			                                      </template>
			                                      <template v-else>
			                                          <view v-if="orderRefound.all_refound != 1" class="btn-default-new" @click="applyRefound(item.rec_id,orderRefound.order_id)">申请售后</view>
			                                      </template>
			                                  </template>
			                              </view>
			                          </view>
			                      </li>
			                  </ul>
			              </view>
			          </view>
			          <view class="padding-all" v-if="orderRefound.all_refound == 1">
			              <van-button size="large" tag="a" @click="applyRefound('all',orderRefound.order_id)">批量申请售后</van-button>
			          </view>
			      </view>
			  </section>
			</template>
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
				order_id:0,
				page:1,
				size:10,
			};
		},
		computed:{
			...mapState({
			    orderRefound: state => state.user.orderRefound
			}),
			refoundList:{
			    get(){
			        return this.$store.state.user.refoundList
			    },
			    set(val){
			        this.$store.state.user.refoundList = val
			    }
			}
		},
		methods:{
			//列表
			setRefoundList(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}

				if(this.order_id == 0){
				    this.$store.dispatch('setRefoundList',{
				        page:1,
				        size:10,
				        order_id:this.order_id
				    })
				}else{
				    this.$store.dispatch('setOrderRefound',{
				        order_id:this.order_id
				    })
				}
			},
	        applyRefound(rec_id,order_id){
	            if(rec_id == 'all'){
	                let rec_all = this.orderRefound.goods.map(function(val,index){ return val.rec_id});
	                rec_id = rec_all.join(',')
	            }
	            uni.navigateTo({
	            	url:'/pagesB/afterSales/applyReturn/applyReturn?rec_id=' + rec_id + '&order_id=' + order_id,
	            })
	        },
	        applyRefoundView(ret_id){
	            uni.navigateTo({
	            	url:'/pagesB/afterSales/detail/detail?ret_id=' + ret_id,
	            })
	        },
	        applyRefoundjihuo(ret_id){
            	let that = this;
	            uni.showModal({
	                title: '提示',
	                content: '确定要激活此退换货吗？',
	                success(res){
	                	if(res.confirm){
			                uni.request({
			                	url:that.websiteUrl + '/api/v4/refound/active_return_order',
			                	method:'POST',
			                	data: {ret_id:ret_id},
			                	header: {
			                		'Content-Type': 'application/json',
			                		'token': uni.getStorageSync('token')
			                	},
			                	success: (res) => {
			                		if(res.data.status == 'success'){
			                			if(res.data.data.code == 0){
			                			    uni.showModal({
			                			        title: '提示',
			                			        content: '退换货订单已激活'
			                			    });
			                			    that.setRefoundList()
			                			}else{
			                			    uni.showModal({
			                			        title: '提示',
			                			        content: res.data.data.msg
			                			    });
			                			}
			                		}
			                	}
			                });
			            }
		            }
	            });
	        },
	        cancelRefound(ret_id){
            	let that = this;
	            uni.showModal({
	                title: '提示',
	                content: '确定要取消申请退换货吗？',
	                success(res){
	                	if(res.confirm){
	                		uni.request({
	                			url:that.websiteUrl + '/api/v4/refound/cancel',
	                			method:'POST',
	                			data: {ret_id:ret_id},
	                			header: {
	                				'Content-Type': 'application/json',
	                				'token': uni.getStorageSync('token')
	                			},
	                			success: (res) => {
	                				if(res.data.status == 'success'){
	                					if(res.data.data.code == 0){
	                					    uni.showModal({
	                					        title: '提示',
	                					        content: '退换货订单已取消'
	                					    });
	                					    that.setRefoundList()
	                					}else{
	                					    uni.showModal({
	                					        title: '提示',
	                					        content: res.data.data.msg
	                					    });
	                					}
	                				}
	                			}
	                		});
	                	}
		            }
	            })
	        },
		},
		onLoad(e) {
			this.order_id = e.id ? e.id : 0;
			this.setRefoundList(1)
		},
		onReachBottom(){
			if(this.page * this.size == this.refoundList.length){
				this.page ++
				this.setRefoundList()
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
.m-r05{ margin-right: 10upx; }
.btn-default-new {
	display: inline-block;
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
.user-item .item-bd {
    padding: 28upx 26upx;
    border-top: 1upx solid #f0f0f0;
}
.user-item .subHead .h4 .label,
.user-item .subHead .p .label{
    font-size: 28upx;
    color: #999;
    font-weight: 400;
}
.user-item .subHead p span {
    height: 40upx;
    line-height: 40upx;
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
		font-size: 26upx;
		color: #999;
		margin-top: 10upx;
	}

	.reture-footer{
		margin-top: 5upx;
	}

	.p-virtual{
		margin-top: 8upx;

		.virtual-item{ color: #999; line-height: 1.5 }
	}
	.price .span{ color: #999; font-size: 28upx; }
}

.reture-right-san{
	margin: 66upx 0 0 10upx;
}

.product-list{
	.product-div{
		padding: 26upx 0 0;
	}
}
</style>
