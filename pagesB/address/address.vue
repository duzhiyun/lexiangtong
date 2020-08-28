<template>
	<view class="container">
		<view class="address-items">
			<view class="address-item" v-for="(item,index) in addressList" :key="index">
				<view class="checkbox" :class="{'checked':item.id == iSaddress}" @click="checkAddress(item.id)">
					<view class="checkbox-icon">
						<uni-icon type="checkmarkempty" size="18" color="#ffffff"></uni-icon>
					</view>
				</view>
				<view class="address-content">
					<view class="left" @click="checkAddress(item.id)">
						<view class="title">
							<text class="name">{{ item.name }}</text>
							<text class="mobile">{{ item.mobile }}</text>
						</view>
						<view class="address">{{ item.province_name }} {{ item.city_name }} {{item.district_name}} {{item.street_name}} {{item.address}}</view>
					</view>
					<view class="right" @click="addressEdit(item.id)">
						<uni-icon type="forward" size="18" color="#999999"></uni-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-bar btn-bar-fixed">
			<!-- #ifdef MP-WEIXIN -->
			<view class="btn btn-white">
				<view class="uni-red" @click="wxAddress">微信导入</view>
			</view>
			<view class="btn btn-red">
				<view @click="addressAdd">新增收货地址</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="btn btn-white">
				<view class="uni-red" @click="addressAdd">新增收货地址</view>
			</view>
			<!-- #endif -->
		</view>
		<uni-popup :show="infoShow" type="right" v-on:hidePopup="handelClose('address')">
			<view class="popup-right-show address-info-show">
				<form @submit="formSubmit">
					<view class="uni-card uni-card-not">
						<view class="uni-list">
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">收货人</text>
									<view class="value"><input placeholder="姓名" name="consignee" v-model="consignee"></view>
								</view>
							</view>
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">联系方式</text>
									<view class="value"><input placeholder="手机号码" type="digit" name="mobile" v-model="mobile"></view>
								</view>
							</view>
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">所在地区</text>
									<view class="value"><text class="uni-blue" @click="selectRegion('province')">{{ regionData.province.name }}</text></view>
								</view>
							</view>
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">市</text>
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
									<view class="value"><input placeholder="详细地址需填写楼栋楼层或房间号信息" name="address" v-model="address"></view>
								</view>
							</view>
						</view>
					</view>
					<view class="btn-bar btn-bar-radius">
						<button class="btn btn-red" formType="submit" type="primary">确认</button>
						<button class="btn btn-white" type="primary" @click="addressDelete(address_id)" v-if="address_id">删除</button>
						<button class="btn btn-white" type="primary" @click="addressColse" v-else>关闭</button>
					</view>
				</form>
			</view>
		</uni-popup>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		 
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import uniIcon from "@/components/uni-icon.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	
	var  graceChecker = require("@/common/graceChecker.js");
	
	export default {
		components: {
			uniIcon,
			uniPopup,
			mpvuePicker,
			dscCommonNav
		},
		data() {
			return {
				type:'',
				infoShow:false,
				statetype:'',
				consignee:'',
				mobile:'',
				address:'',
				address_id:0,
				themeColor: '#007AFF',
				mode: 'selector',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				regionData:{
					province:{
						id:'',
						name:'--请选择--'
					},
					city:{
						id:'',
						name:'--请选择--',
					},
					district:{
						id:'',
						name:'--请选择--',
					},
					street:{
						id:'',
						name:'--请选择--',
					},
				},
				curRegion:'province'
			};
		},
		computed:{
			...mapState({
				addressList: state => state.user.addressList,
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
			}),
			iSaddress:{
				get(){
					return this.$store.state.user.addressId
				},
				set(value){
					this.$store.dispatch('userAddressDefault',{
						address_id:value
					})
				}
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/address/address'
			}
		},
		methods:{
			userAddressDelete(value){
				this.$store.dispatch('userAddressDelete',{
					address_id:value
				})
			},
			addressAdd(){
				this.consignee = ''
				this.mobile = ''
				this.address = ''
				this.regionData.province.id = ''
				this.regionData.province.name = '--请选择--'
				this.regionData.city.id = ''
				this.regionData.city.name = '--请选择--'
				this.regionData.district.id = ''
				this.regionData.district.name = '--请选择--'
				this.regionData.street.id = ''
				this.regionData.street.name = '--请选择--'
				this.pickerValueArray = []
				this.address_id = 0
				this.infoShow = true
			},
			//微信导入
			wxAddress(){
				uni.chooseAddress({
					success: (res) => {
						if(res.errMsg == 'chooseAddress:ok'){
							uni.showLoading({
								title:'导入中'
							})
							this.$store.dispatch('userWxImportAddress',{
								provinceName:res.provinceName,
								cityName:res.cityName,
								countyName:res.countyName,
								detailInfo:res.detailInfo,
								telNumber:res.telNumber,
								userName:res.userName
							}).then(result => {
								console.log(result)
								uni.hideLoading();
								if(result.status == 'success'){
									this.address_id = 0
									this.consignee = result.data.consignee ? result.data.consignee : ''
									this.mobile = result.data.mobile ? result.data.mobile : ''
									this.address = result.data.address ? result.data.address : ''
									this.regionData.province.id = result.data.province ? result.data.province : ''
									this.regionData.province.name = res.provinceName ? res.provinceName : ''
									this.regionData.city.id = result.data.city ? result.data.city : ''
									this.regionData.city.name = res.cityName ? res.cityName : ''
									this.regionData.district.id = result.data.district ? result.data.district : ''
									this.regionData.district.name = res.countyName ? res.countyName : ''
									this.regionData.street.id = ''
									this.regionData.street.name = '--请选择--'
									
									this.infoShow = true
								}else{
									uni.showToast({
										title:'导入失败',
										icon:'none'
									})
								}
							})
						}
					},
					fail: (res) => {
						console.log(res)
					}
				})
			},
			addressEdit(val){
				this.infoShow = true
				this.address_id = val
				this.$store.dispatch('userAddressInfo',{
					address_id:val
				}).then(res=>{
					if(res.data){
						this.consignee = res.data.consignee
						this.mobile = res.data.mobile
						this.address = res.data.address
						
						this.regionData.province.id = res.data.province
						this.regionData.province.name = res.data.province_name
						this.regionData.city.id = res.data.city
						this.regionData.city.name = res.data.city_name
						this.regionData.district.id = res.data.district
						this.regionData.district.name = res.data.district_name
						this.regionData.street.id = res.data.street
						this.regionData.street.name = res.data.street_name
					}
				})
			},
			addressDelete(val){
				this.infoShow = false
				uni.showModal({
					title:'',
					content:'您确定要删除此收货方式？',
					success: (res) => {
						uni.showLoading({title: '加载中'});

						if(res.confirm){
							this.$store.dispatch('userAddressDelete',{
								address_id:val
							})
						}
					}
				})
			},
			addressColse(){
				this.infoShow = false
			},
			formSubmit(e){
				var rule = [
					{name:"consignee", checkType : "notnull", checkRule:"",  errorMsg:"收货人不能为空"},
					{name:"mobile", checkType : "phoneno", checkRule:"",  errorMsg:"手机号码不正确"},
					{name:"address", checkType : "notnull", checkRule:"",  errorMsg:"详细地址不能为空"}
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					if(this.regionData.province.id == ''){
						uni.showToast({title:"省/直辖市不能为空", icon:"none"});
						return false
					}
					
					if(this.regionData.city.id == ''){
						uni.showToast({title:"市区不能为空", icon:"none"});
						return false
					}
					
					if(this.regionData.district.id == ''){
						uni.showToast({title:"区/县不能为空", icon:"none"});
						return false
					}
					
					if(this.regionData.street.id == ''){
						uni.showToast({title:"街道不能为空", icon:"none"});
						return false
					}
					
					uni.showLoading({title: '加载中'});
					this.$store.dispatch('userAddressAdd',{
						address_id:this.address_id,
						consignee:this.consignee,
						mobile:this.mobile,
						address:this.address,
						country:1,
						province:this.regionData.province.id,
						city:this.regionData.city.id,
						district:this.regionData.district.id,
						street:this.regionData.street.id
					}).then(res => {
						uni.hideLoading();
						if(res.status == 'success'){
							uni.showToast({title:"保存成功", icon:"success"});
							
							this.infoShow = false
							if(this.statetype == 'true'){
								uni.navigateBack({
									delta:1
								})
							}else{
								this.$store.dispatch('userAddress');
							}
						}else{
							uni.showToast({title:"保存失败", icon:"none"});
						}
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			checkAddress(val){
				this.iSaddress = val;
				if(this.type){
					uni.navigateBack({
						delta:1
					})
				}
			},
			handelClose(val){
				if(val == 'address'){
					this.infoShow = false
				}
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
			}
		},
		onLoad(e){
			this.type = e.type;
			this.$store.dispatch('userAddress');
			if(e.statetype == 'true'){
				this.statetype = e.statetype
				this.infoShow = true
			}
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

<style>
.address-items{}
.address-item{ background: #FFFFFF; padding: 20upx; display: flex; flex-direction: row; margin-bottom: 20upx;}
.address-item:last-child{ margin-bottom: 0; }
.address-item .address-content{ display: flex; flex-direction: row; flex: 1; justify-content: space-between; align-items: center;}
.address-item .address-content .left{ flex: 1;}
.address-item .address-content .left view{ line-height: 1.5; font-size: 26upx;}
.address-item .address-content .title{ font-weight: 700;}
.address-item .address-content .title .name{ margin-right: 15upx;}
.address-item .address-content .address{ color: #666666;}
.address-item .address-content .right{ display: flex; flex-direction: row;}
.address-item .address-content .right view{ line-height: 1.5; font-size: 26upx; padding: 20upx;}

.address-info-show .uni-card{ margin: 0;}
.address-info-show .uni-card .uni-list-cell-navigate{ padding: 0;}
.address-info-show .uni-card .uni-list-cell-navigate .title{ padding: 20upx 30upx; min-width: 100upx;}
.address-info-show .uni-card .uni-list-cell-navigate .value text{ width: 100%;}
.address-info-show .btn-bar{ margin: 30upx 40upx; display: flex; flex-direction: column;}
.address-info-show .btn-bar .btn{ width: 100%; margin-bottom: 30upx;}
</style>
