<template>
	<view>
		<view class="user-detail">
		    <view class="product-list uni-card" v-if="goodsList">
		    	<view class="product-items" v-for="(goodsInfo,index) in goodsList" :key="index">
		          <view class="item">
	                <view class="product-img"><image class="img" :src="goodsInfo.goods_img"></image></view>
	                <view class="product-info">
	                  <view class="product-name twolist-hidden">{{ goodsInfo.goods_name }}</view>
	                  <view class="product-row">
	                    <view class="price">{{ goodsInfo.shop_price_formated }}</view>
	                    <view class="number">x{{goodsInfo.goods_number}}</view>
	                  </view>
	                  <view class="price" v-if="goodsInfo.goods_bonus > 0">- {{ goodsInfo.formated_goods_bonus }}</view>
	                  <view class="p-t-remark m-top04">{{ goodsInfo.attr_name }}</view>
                    </view>
		          </view>
		      	</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
		    		<view slot="title"><text class="color-red">* 温馨提示：</text><text class="f-03 col-6">本次售后服务将由卖家<text class="color-red" v-if="goodsList">{{ goodsList[0].shop_name }}</text>为您提供</text></view>
				</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
			      <view class="h4">服务类型<text class="dot color-red">*</text></view>
			      <view class="select-one-1">
			        <ul class="ect-selects">
			          <li class="ect-select" :class="{'active':item.cause == retrun_cause_id}" v-for="(item,index) in goods_cause" @click="causeSelect(item.cause)" :key="index"><span>{{ item.lang }}</span></li>
			        </ul>
			      </view>
		      	</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
			      <view class="h4">退换货原因<text class="dot color-red">*</text></view>
			      <view class="select-one-1">
			        <view class="select-one-1">
			          <ul class="ect-selects">
			            <li class="ect-select" :class="{'active':item.cause_id == causeSelected}" v-for="(item,index) in parent_cause" @click="causeSelect2(item.cause_id)" :key="index"><span>{{ item.cause_name }}</span></li>
			          </ul>
			        </view>
			      </view>
		      	</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
			      <view class="h4">退换货数量<text class="dot color-red">*</text></view>
			      <view class="select-one-1">
			      <view class="uni-number-min"><uni-number-box :value="value" min="1" :max="applyRefoundDetail.return_goods_num" :disabled="applyRefoundDetail.return_goods_num < 2" @change="bindChange"></uni-number-box></view>
			        <view class="oper-icon"></view>
			      </view>
		      	</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
			      <view class="h4">问题描述<text class="dot color-red">*</text></view>
			      <!-- <van-field
			        v-model="return_brief"
			        placeholder="问题描述"
			        type="textarea"
			        class="not_padding"
			      /> -->
			      <view class="value"><textarea placeholder="问题描述" v-model="return_brief" :disabled="isDisabled"></textarea></view>
		      	</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
			      <view class="h4">申请凭据</view>
			      <view class="select-one-1">
			        <view class="uni-list-cell uni-list-cell-last">
                        <view class="uni-list-cell-db">有检测报告</view>
                        <switch :checked="checked" @change="switch2Change"/>
                    </view>
			      </view>
		      	</view>
		    </view>
		    <view class="uni-card uni-card-not">
		    	<view class="padding-all">
			      <view class="h4">图片信息</view>
			      <view class="goods-info-img-box" v-if="materialList.length > 0">
			        <view class="goods-info-img" v-for="(item,index) in materialList" :key="index">
			          <img :src="item" />
			          <i class="iconfont icon-delete" @click="deleteImg(index)"></i>
			        </view>
			      </view>
			        <view class="user-return-img" @tap="chooseImage('front_of_id_card')">
			          <i class="i-jia"></i>
			          <text>上传凭证</text>
			        </view>
			      <p class="f-03 col-7 m-top06"> 为了帮助我们更好的解决问题，请您上传图片<br>'注：最多可上传5张图片，支持jpg,png格式文件</p>
		      	</view>
		    </view>
		    <block v-if="consignee">
		    <view class="uni-card uni-card-not" v-if="retrun_cause_id == 0 || retrun_cause_id == 2">
		    	<view class="padding-all">
			      <view class="h4">个人信息<text class="dot color-red">*</text></view>
			      <view class="uni-list address-info-show">
			      	<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
			      		<view class="uni-list-cell-navigate">
							<text class="title">收货人</text>
						    <view class="value"><input placeholder="请输入收货人姓名" v-model="addressee"></view>
						</view>
					</view>
			      	<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
			      		<view class="uni-list-cell-navigate">
							<text class="title">手机号码</text>
						    <view class="value"><input placeholder="请输入手机号" v-model="mobile"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">省份</text>
							<view class="value"><text class="uni-blue" @click="selectRegion('province')">{{ regionData.province.name }}</text></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">城市</text>
							<view class="value"><text class="uni-blue" @click="selectRegion('city')">{{ regionData.city.name }}</text></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">区/县</text>
							<view class="value"><text class="uni-blue" @click="selectRegion('district')">{{ regionData.district.name }}</text></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">乡镇/街道</text>
							<view class="value"><text class="uni-blue" @click="selectRegion('street')">{{ regionData.street.name }}</text></view>
						</view>
					</view>
			      	<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
			      		<view class="uni-list-cell-navigate">
							<text class="title">详细地址</text>
						    <view class="value"><input placeholder="请输入详细地址" v-model="address"></view>
						</view>
					</view>
				  </view>
		      	</view>
		    </view>
		    <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		    </block>
		    <view class="uni-card uni-card-not">
		      <van-field v-model="return_remark" label="留言" placeholder="请输入留言" type="textarea" class="my-bottom" />
		    </view>
		    <view class="padding-all">
		      <view class="h4 m-b10">服务说明</view>
		      <p class="f-03 col-9">1.附件赠品，退换货时请一并退回。</p>
		      <p class="f-03 col-9 m-top04">2.关于物流损，请您在收到货时务必仔细检查，如发现商品外包装或商品本身外观存在异常，需当场向派送人员指出，并拒收整个包裹；如您在收到货后发现外观异常，请在收货24小时内提交退换货申请，如超时未申请，将无法受理。</p>
		      <p class="f-03 col-9 m-top04">3.关于商品实物与网站描述不符；保证所出商品均为正品行货，并与时下市场上同样直流商品一致，但因厂家会在没有任何提前通知的情况下更改产品包装，产地或者一些附件，所以我们无法确保您收到的货物与商城图片、产地、附件说明完全一致。</p>
		      <p class="f-03 col-9 m-top04">4、如果您在使用时对商品质量表示置疑，您可出具相关书面鉴定，我们会按照国家法律规定予以处理。</p>
		    </view>
		    <view class="btn-bar btn-bar-fixed">
		      <view class="btn btn-red" @click="submitBtn">提交申请</view>
		    </view>
		    <Region :display.sync="regionShow" :regionData.sync="regionData"></Region>
		</view>
		<dsc-common-nav></dsc-common-nav>
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniNumberBox from "@/components/uni-number-box.vue";
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	export default {
		components:{
			dscCommonNav,
			dscNotContent,
			uniNumberBox,
			mpvuePicker
		},
		data() {
			return {
				rec_id: 0,
				value:1,            //商品数量
				number:1,			//退换货数量
				checked:false,      //是否有检测报告
				return_brief:'',    //退货问题描述
				retrun_cause_id:'', //退换货服务类型
				return_remark:'',   //退换货留言
				causeSelected:'',   //退换货原因
				regionShow: false,
				themeColor: '#007AFF',
				mode: 'selector',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				regionData: {
					province: {
						id: '',
						name: '--请选择--'
					},
					city: {
						id: '',
						name: '--请选择--'
					},
					district: {
						id: '',
						name: '--请选择--'
					},
					street: {
						id: '',
						name: '--请选择--'
					},
					regionSplic: ''
				},
				materialList: []
			};
		},
		computed:{
			...mapState({
			    applyRefoundDetail: state => state.user.applyRefoundDetail,
				addressList: state => state.user.addressList,
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
			}),
			goodsList(){
			    return this.applyRefoundDetail.goods_list ? this.applyRefoundDetail.goods_list : false
			},
			consignee(){
			    return this.applyRefoundDetail.consignee
			},
			goods_cause(){
			  return this.applyRefoundDetail.goods_cause
			},
			parent_cause(){
			  return this.applyRefoundDetail.parent_cause
			},
			shippingStatus(){
			    return this.applyRefoundDetail.order ? this.applyRefoundDetail.order.shipping_status : 0
			},
			addressee:{
			  get(){
			    return this.applyRefoundDetail.consignee ? this.applyRefoundDetail.consignee.consignee : ''
			  },
			  set(val){
			    this.applyRefoundDetail.consignee.consignee = val
			  }
			},
			mobile:{
			  get(){
			    return this.applyRefoundDetail.consignee ? this.applyRefoundDetail.consignee.mobile : ''
			  },
			  set(val){
			    this.applyRefoundDetail.consignee.mobile = val
			  }
			},
			address:{
			  get(){
			    return this.applyRefoundDetail.consignee ? this.applyRefoundDetail.consignee.address : ''
			  },
			  set(val){
			    this.applyRefoundDetail.consignee.address = val
			  }
			},
			regionSplic() {
			    return this.regionData.regionSplic
			},
			returnGoodsNum(){
			   return this.applyRefoundDetail.order.shipping_status == 0 ? this.applyRefoundDetail.return_goods_num : this.number
			}
		},
		methods:{
			onRead(){
		      return file => {
		        let length = 0
		        if(file.length == undefined){
		          length = this.materialList.length + 1
		        }else{
		          length = file.length + this.materialList.length
		        }

		        if(length > 5){
		          Toast('退换货最多上传5张图片')
		        }else{
		          this.$store.dispatch('setMaterial',{
		            file:file
		          })
		        }
		      }
		    },
		    causeSelect(id){
		      this.retrun_cause_id = id
		    },
		    causeSelect2(id){
		      this.causeSelected = id
		    },
		    handelRegionShow(){
		      this.regionShow = this.regionShow ? false : true
		    },
		    submitBtn(){
		      let o = {
		        rec_id:this.rec_id,
		        last_option:String(this.causeSelected),
		        return_remark:this.return_remark,
		        return_brief:this.return_brief,
		        chargeoff_status:String(this.applyRefoundDetail.order.chargeoff_status),
		        return_type:Number(this.retrun_cause_id),
		        return_images:this.materialList,
		        return_number:this.returnGoodsNum,
		        addressee:this.addressee,
		        mobile:this.mobile,
		        code:this.email,
		        return_address:this.address,
		        province_region_id:this.regionData.province.id,
		        city_region_id:this.regionData.city.id,
		        district_region_id:this.regionData.district.id,
		        street:this.regionData.street ? this.regionData.street.id : 0
		      }

		      if(!this.retrun_cause_id){
		        uni.showModal({
		            title: '提示',
		            content: '请填写退换货服务类型'
		        });
		        return false
		      }else if(this.causeSelected == 0){
		        uni.showModal({
		            title: '提示',
		            content: '请选择退换货原因'
		        });
		        return false
		      }else if(!this.return_brief){
		        uni.showModal({
		            title: '提示',
		            content: '请填写退换货问题描述'
		        });
		        return false
		      }
		      if(o.return_type == 0 || o.return_type == 2){
		      	if(!o.province_region_id){
		      	  uni.showModal({
		      	      title: '提示',
		      	      content: '请选择所在省份'
		      	  });
		      	  return false
		      	}else if(!o.city_region_id){
		      	  uni.showModal({
		      	      title: '提示',
		      	      content: '请选择所在城市'
		      	  });
		      	  return false
		      	}else if(!o.district_region_id){
		      	  uni.showModal({
		      	      title: '提示',
		      	      content: '请选择所在区/县'
		      	  });
		      	  return false
		      	}else if(!o.street){
		      	  uni.showModal({
		      	      title: '提示',
		      	      content: '请选择所在乡镇/街道'
		      	  });
		      	  return false
		      	}else if(!o.addressee){
		      	  uni.showModal({
		      	      title: '提示',
		      	      content: '请填写详细地址'
		      	  });
		      	  return false
		      	}
		      }
		      uni.request({
		      	url:this.websiteUrl + '/api/v4/refound/submit_return',
		      	method:'POST',
		      	data: o,
		      	header: {
		      		'Content-Type': 'application/json',
		      		'token': uni.getStorageSync('token')
		      	},
		      	success: (res) => {
		      		if(res.data.status == 'success'){
						uni.showToast({
							title:res.data.data.msg,
							icon:"none"
						})
		      			if(res.data.data.code == 0){
		      			    this.returnApply()
		      			}
		      		}
		      	}
		      });
		    },
		    deleteImg(val){
		    	let that = this
				uni.showModal({
				  title: '提示',
				  content: '确定要删除此图片？',
				  success(res){
				  	if(res.confirm){
				  		that.materialList.splice(val, 1)
			    	}
				  }
				})
		    },
		    returnApply(){
		      setTimeout(() => {
		        uni.navigateTo({
		        	url:'/pagesB/afterSales/afterSales',
		        })
		      },1000)
		    },
		    switch2Change(e){
		    	this.checked = e.target.value
		    },
			selectRegion(val){
				this.$refs.mpvuePicker.show()
				this.curRegion = val
				if(val == 'province'){
					this.regionLoad(1,1)
				}else if(val == 'city'){
					this.regionLoad(this.regionData.province.id,2)
				}else if(val == 'district'){
					this.regionLoad(this.regionData.city.id,3)
				}else if(val == 'street'){
					this.regionLoad(this.regionData.district.id,4)
				}
			},
			regionLoad(val,level){
				this.$store.dispatch('setRegion',{
					region:val,
					level:level
				})
			},
			onConfirm(e,cur){
				let level = 0
				let arr = ['province','city','district','street']
				if(cur == 'province'){
					this.regionData.province.name = e.label
					this.regionData.province.id = e.value[0]
					level = 1
				}else if(cur == 'city'){
					this.regionData.city.name = e.label
					this.regionData.city.id = e.value[0]
					level = 2
				}else if(cur == 'district'){
					this.regionData.district.name = e.label
					this.regionData.district.id = e.value[0]
					level = 3
				}else if(cur == 'street'){
					this.regionData.street.name = e.label
					this.regionData.street.id = e.value[0]
					level = 4
				}
				
				arr.forEach((v,i)=>{
					if((i+1) > level){
						this.regionData[v].id = ''
						this.regionData[v].name = '请选择'
					}
				});
			},
			onCancel(){
				this.$refs.mpvuePicker.hide()
			},
			chooseImage(val){
				uni.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success:(res)=>{
						if(this.materialList.length + 1 > 5){
						  uni.showModal({
						      title: '提示',
						      content: '退换货最多上传5张图片'
						  });
						  return false;
						}
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial',{
								file:{
									content:base64
								},
								type:val
							}).then(data=>{
								this.materialList.push(data.data[0]);
							})
						}).catch(error => {
							console.error(error,5);
						});
					}
				})
			},
			bindChange(e){
				this.number = e
			},
			getRegionData(){
				//判断地区是否为空调用定位地区
				uni.getStorage({
					key:'regionData',
					success:(res)=>{
						let data = res.data;
						if(res.data){
							this.regionData.province.id = data.province ? data.province.id : ''
							this.regionData.province.name = data.province ?  data.province.name : ''
							this.regionData.city.id = data.city ? data.city.id : ''
							this.regionData.city.name = data.city ? data.city.name : ''
							this.regionData.district.id = data.district ? data.district.id : ''
							this.regionData.district.name = data.district ? data.district.name : ''
							this.regionData.street.id = data.street ? data.street.id : ''
							this.regionData.street.name = data.street ? data.street.name : ''
			
							this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
						}
					},
					fail: (res) => {
						//读取缓存
						uni.getStorage({
							key:'userRegion',
							success:(res)=>{
								let data = res.data;
								if(res.data){
									this.regionData.province.id = data.province ? data.province.id : ''
									this.regionData.province.name = data.province ?  data.province.name : ''
									this.regionData.city.id = data.city ? data.city.id : ''
									this.regionData.city.name = data.city ? data.city.name : ''
									this.regionData.district.id = data.district ? data.district.id : ''
									this.regionData.district.name = data.district ? data.district.name : ''
									this.regionData.street.id = data.street ? data.street.id : ''
									this.regionData.street.name = data.street ? data.street.name : '请选择'
			
									this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
								}
							}
						});
					}
				});
			},
		},
		onLoad(e) {
			this.rec_id = e.rec_id
			this.$store.dispatch('setApplyRefound',{
			    rec_id:e.rec_id,
			    order_id:e.order_id
			})

			this.$store.dispatch('setMaterial',{
			  file:[]
			})

			this.getRegionData(); //根据缓存获取地区
		},
		watch:{
			provinceData(){
				this.pickerValueArray = this.provinceData
			},
			cityData(){
				this.pickerValueArray = this.cityData
			},
			districtData(){
				this.pickerValueArray = this.districtData
			},
			streetData(){
				this.pickerValueArray = this.streetData
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
.col-7{
	color: #777;
}
.m-top04{ margin-top: 10upx; }
.m-top06{ margin-top: 16upx; }
.f-03{ font-size: 24upx; }
.fr{ float: right; }
.padding-all{ padding: 20upx 20upx; }
.user-detail{ padding-bottom: 100upx; }
.uni-card{
	.h4{ 
		color: #777; margin-bottom: 20upx;
		.dot{ margin-left: 10upx; }
	}
}
.select-one-1 {
    background: #fff;
    overflow: hidden;
}
.ect-selects .ect-select {
	margin: 0 6upx;
    display: inline-block;
    position: relative;
    font-size: 28upx;
    margin-right: 10upx;
}
.ect-selects .ect-select span {
    padding: 10upx 24upx;
    display: block;
    text-align: center;
    border: 1upx solid #efefef;
    border-radius: 4upx;
    color: #666;
}
.ect-selects .ect-select.active span {
    border-color: #f92028;
    color: #f92028;
}
.user-return-img{
	border: 2upx dashed #ccc;
	width: 200upx;
	height: 200upx;
	.i-jia{ 
		width: 100upx;
		height: 100upx;
		position: relative;
		margin: 32rpx auto 0;
		&:before,
		&:after{
			position: absolute;
			content: '';
			width: 6upx;
			height: 100upx;
			background: #ddd;
			left: 0;
			top: 0;
			margin: auto;
			right: 0;
			bottom: 0;
		}
		&:after{ transform: rotate(90deg); }
	}
	text{ display: block; text-align: center; padding-top: 10upx; font-size: 24upx; color: #999; }
}
.uni-list-cell:after{ left: 0; }
.uni-card .address-info-show .uni-list-cell-navigate{ padding: 0;}
.uni-card .address-info-show .uni-list-cell-navigate .title{ padding: 20upx 30upx; min-width: 100upx;}
.uni-card .address-info-show .uni-list-cell-navigate .value text{ width: 100%;}
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
</style>
