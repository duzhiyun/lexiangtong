<template>
	<view class="giftcard-address">
		<form @submit="formSubmit">
		<view class="uni-card uni-card-not">
			<view class="header-title">收货地址</view>
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
					<view class="uni-list-cell-navigate">
						<text class="title">收货人</text>
						<view class="value"><input placeholder="请输入收货人" name="consignee" v-model="consignee"></view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
					<view class="uni-list-cell-navigate">
						<text class="title">手机号</text>
						<view class="value"><input placeholder="请输入收货人手机号" name="mobile" v-model="mobile"></view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" @click="handleRegion">
					<view class="uni-list-cell-navigate">
						<text class="title">所在地区</text>
						<view class="value">{{ regionSplic }}</view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
					<view class="uni-list-cell-navigate">
						<text class="title">详细地址</text>
						<view class="value"><input placeholder="请输入详细地址" name="address" v-model="address"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-bar btn-bar-fixed">
			<button formType="submit" type="primary" class="btn btn-red">保存</button>
		</view>
		</form>
		
		<uni-popup :show="regionShow" type="right" v-on:hidePopup="handelClose('region')">
			<view class="popup-right-show region-info-show">
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">地址</text>
								<view class="value">
									<block v-if="regionData.province.id">{{ regionData.province.name }}</block>
									<block v-if="regionData.city.id">{{ regionData.city.name }}</block>
									<block v-if="regionData.district.id">{{ regionData.district.name }}</block>
									<block v-if="regionData.street.id">{{ regionData.street.name }}</block>
								</view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">所在地区</text>
								<view class="value" @click="selectRegion('province')"><text class="uni-blue">{{ regionData.province.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">市</text>
								<view class="value" @click="selectRegion('city')"><text class="uni-blue">{{ regionData.city.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">区/县</text>
								<view class="value" @click="selectRegion('district')"><text class="uni-blue">{{ regionData.district.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">乡镇/街道</text>
								<view class="value" @click="selectRegion('street')"><text class="uni-blue">{{ regionData.street.name }}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<view class="btn btn-white">
					<view class="uni-red" @click="handelClose('region')">关闭</view>
				</view>
				<view class="btn btn-btn">
					<view @click="submitRegion">保存</view>
				</view>
			</view>
		</uni-popup>
		 <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		  @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import uniPopup from '@/components/uni-popup.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	var graceChecker = require("@/common/graceChecker.js");
	
	export default {
		data() {
			return {
				goods_id:'',
				consignee:'',
				mobile:'',
				email:'',
				address:'',
				regionShow: false,
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
					regionSplic:''
				},
			}
		},
		components:{
			uniPopup,
			mpvuePicker
		},
		computed:{
			...mapState({
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
			}),
			//配送地区
			regionSplic(){
				return this.regionData.regionSplic
			},
		},
		methods: {
			handleRegion(){
				this.regionShow = true
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
			submitRegion(){
				this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
				
				//存本地缓存
				uni.setStorage({
					key:'regionData',
					data:this.regionData
				})
				
				if(!this.regionData.province.id > 0){
					uni.showToast({ title:'请选择地区', icon:'none' });
					return false
				}else if(!this.regionData.city.id > 0){
					uni.showToast({ title:'请选择城市', icon:'none' });
					return false
				}else if(!this.regionData.district.id > 0){
					uni.showToast({ title:'请选择区县', icon:'none' });
					return false
				}else if(!this.regionData.street.id > 0){
					uni.showToast({title:"街道不能为空", icon:"none"});
					return false
				}
				
				this.regionShow = false
			},
			//关闭Popup
			handelClose(val){
				this.regionShow = false
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
			formSubmit(e){
				var rule = [
					{name:"consignee", checkType : "notnull", checkRule:"",  errorMsg:"收货人不能为空"},	
					{name:"mobile", checkType : "phoneno", checkRule:"",  errorMsg:"手机号码不正确"},
					{name:"address", checkType : "notnull", checkRule:"",  errorMsg:"详细地址不能为空"},
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
					
					uni.request({
						url:this.websiteUrl + '/api/v4/gift_gard/check_take',
						data:{
							goods_id:this.goods_id,
							consignee:this.consignee,
							mobile:this.mobile,
							country:1,
							province:this.regionData.province.id,
							city:this.regionData.city.id,
							district:this.regionData.district.id,
							street:this.regionData.street.id,
							address:this.address
						},
						method:'GET',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token')
						},
						success: (res) => {
							uni.hideLoading();
							
							let data = res.data
							uni.showToast({
								title:data.data.msg,
								icon:'none'
							});
							if(data.data.error == 0){
								setTimeout(()=>{
									uni.redirectTo({
										url:'/pagesA/giftcard/order/order'
									})
								},500)
							}
						},
					});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(e){
			this.goods_id = e.id;
			
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

<style>
.header-title{ padding: 20upx 30upx; border-bottom: 1px solid #DDDDDD; font-size: 30upx; }
.uni-list-cell::after{ left: 0;}
</style>
