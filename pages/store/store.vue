<template>
	<view class="store-box">
		<view class="store-header" id="storeHeader" ref="storeHeader">
			<view class="uni-card uni-card-not">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="handelRegionShow">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<text class="title">地区选择：</text>
							<view class="value">{{regionData.regionSplic}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<scroll-view class="scrollList" scroll-y :style="{height:winHeight + 'px'}">
			<view class="store-list">
				<view class="item" :class="{'active':store_id == item.id, 'disabled': item.is_stocks == 0}" v-for="(item,index) in storeContent" :key="index" @click="storeClick(item.id,item.is_stocks)">
					<view class="flow-have-adr">
						<view class="head">
							<view class="name">{{ item.stores_name }}</view>
						</view>
						<view class="address">[{{ item.address }} {{ item.stores_address }}]</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="store-footer" id="storeFooter" ref="storeFooter">
			<form @submit="formSubmit">
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">到店时间：</text>
								<view class="value">
									<picker mode="date" :value="dataTime" :start="startDate" :end="endDate" @change="bindDateChange">{{dataTime}}</picker>
								</view>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="title">手机号码：</text>
								<view class="value">
									<input placeholder="请填写手机号码" type="tel" name="mobile" v-model="mobile" />
								</view>
							</view>
						</view>
						<view class="btn-warp">
							<button class="btn btn-close" @click="onClose">关闭</button>
							<button class="btn" formType="submit">马上自提</button>
						</view>
					</view>
				</view>
			</form>
		</view>
		
		<!--地区-->
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
		
		<mpvue-picker themeColor="#007AFF" ref="mpvuePicker" mode="selector" deepLength="1" :pickerValueDefault="pickerValueDefault"
		  @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	function getDate(type) {
		const date = new Date();
	
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();      
	
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	}
	
	import { mapState } from 'vuex'
	
	import uniIcon from '@/components/uni-icon.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				rec_id:'',
				goods_id:0,
				attr_id:0,
				num:1,
				mobile:'',
				dataTime: getDate({
					format: true
				}),
				startDate:getDate('start'),
				endDate:getDate('end'),
				storeContent:[],
				store_id:0,
				regionShow: false,
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
				curRegion:'province',
				navHeight:0,
				height:0,
			}
		},
		components:{
			uniIcon,
			uniPopup,
			mpvuePicker,
			dscCommonNav
		},
		computed:{
			...mapState({
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
			}),
			winHeight(){
				return uni.getSystemInfoSync().windowHeight - this.height - this.navHeight;
			}
		},
		methods: {
			storeList(){
				let o = {}
				if(this.rec_id){
					o = {
						province_id:this.regionData.province.id,
						city_id:this.regionData.city.id,
						district_id:this.regionData.district.id,
						street_id:this.regionData.street.id,
						goods_id:0,
						rec_id:this.rec_id,
						page:1,
						size:10
					}
				}else{
					o = {
						province_id:this.regionData.province.id,
						city_id:this.regionData.city.id,
						district_id:this.regionData.district.id,
						street_id:this.regionData.street.id,
						goods_id:this.goods_id,
						spec_arr:this.attr_id,
						page:1,
						size:10
					}
				}
				
				uni.request({
					url:this.websiteUrl + '/api/v4/offline-store/list',
					method:'GET',
					data: o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						this.storeContent = res.data.data.list
						this.storeContent.forEach((v,i)=>{
							if(i == 0 && v.is_stocks != 0){
								this.store_id = v.id
							}
						})
						
						this.mobile = res.data.data.phone ? res.data.data.phone : ''
					}
				})
			},
			bindDateChange: function(e) {
				this.dataTime = e.target.value
			},
			handelRegionShow(){
				this.getRegionData();
				this.regionShow = true
			},
			handelClose(val){
				if(val == 'region'){
					this.regionShow = false
				}
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
			// 地区选框当前项弹出时默认选中
			pickDefaultIndex(level){
				let id = 0;
				if(level == 1){
					id = this.regionData.province.id
				}else if(level == 2){
					id = this.regionData.city.id
				}else if(level == 3){
					id = this.regionData.district.id
				}else if(level == 4){
					id = this.regionData.street.id
				}
				const array = Array.from(this.pickerValueArray);
				let flag = false;
				for(let i = 0; i < array.length; i++){
					if(array[i].id == id){
						this.pickerValueDefault = [i];
						flag = true
						break;
					}
				}
				if(!flag) this.pickerValueDefault = [0];
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
				}
				
				this.regionShow = false
				
				this.storeList()
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
							this.regionData.street.name = data.street ? data.street.name : '请选择'
							
							this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
							
							this.storeList()
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
								
								this.storeList()
							}
						});
					}
				});
			},
			onClose(){
				if(this.rec_id){
					uni.reLaunch({
						url:"/pages/cart/cart"
					})
				}else{
					uni.reLaunch({
						url:'/pages/goodsDetail/goodsDetail?id=' + this.goods_id
					})
				}
			},
			formSubmit(e){
				var rule = [
					{
						name: "mobile",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "手机号码不能为空"
					},
					{
						name: "mobile",
						checkType: "phoneno",
						checkRule: "",
						errorMsg: "手机号码不正确"
					},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if (checkRes) {
					if(this.$isLogin()){
						if(this.rec_id){
							uni.request({
								url:this.websiteUrl + '/api/v4/cart/offline/update',
								method:'POST',
								data: {
									rec_id:this.rec_id,
									store_id:this.store_id,
									store_mobile:this.mobile,
									take_time:this.dataTime,
									num:''
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash':uni.getStorageSync('client_hash')
								},
								success: (res) => {
									let data = res.data.data
									if(data.error == 0){
										uni.navigateTo({
											url:"../checkout/checkout?rec_type=12&store_id="+this.store_id
										})
									}else{
										uni.showToast({
											title:data.msg,
											icon:'none'
										});
									}
								}
							})
						}else{
							this.$store.dispatch('setStoresCart',{
								goods_id:this.goods_id,
								store_id:this.store_id,
								num: this.num,
								spec: this.attr_id,
								store_mobile:this.mobile,
								take_time:this.dataTime,
								warehouse_id:'0',
								area_id:'0',
								parent_id:'0',
								quick:1,
								rec_type:12,
								parent:0
							}).then(res=>{
								if(res.data == true){
									uni.navigateTo({
										url:"../checkout/checkout?rec_type=12&store_id="+res.store_id
									})
								}else{
									if(res.data.error == 1){
										uni.showToast({
											title:res.data.msg,
											icon:'none'
										});
									}else{
										uni.showToast({
											title:'门店自提失败',
											icon:'none'
										});
									}
								}
							})
						}
					}else{
						uni.showModal({
							content:'请登录会员',
							success:(res)=>{
								if(res.confirm){
									uni.navigateTo({
										url:'/pages/login/login?delta=1'
									})
								}
							}
						})
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			storeClick(id,is_stocks){
				if(is_stocks != 0){
					this.store_id = id
				}else{
					uni.showToast({
						title:'库存不足，不可提交',
						icon:'none'
					});
				}
			}
		},
		onReady(){
			let that = this
			var view = uni.createSelectorQuery().select("#storeFooter");
			var view2 = uni.createSelectorQuery().select("#storeHeader");
			view.boundingClientRect(data => {
				that.height = data.height
			}).exec();
			
			view2.boundingClientRect(data => {
				that.navHeight = data.height
			}).exec();
		},
		onLoad(e) {
			this.goods_id = e.id ? e.id : 0;
			this.attr_id = e.attr_id ? e.attr_id : '';
			this.num = e.num ? e.num : 0;
			this.rec_id = e.rec_id ? e.rec_id : ''
			
			this.getRegionData(); //根据缓存获取地区
		},
		watch:{
			provinceData(){
				this.pickerValueArray = this.provinceData
				this.pickDefaultIndex(1)
			},
			cityData(){
				this.pickerValueArray = this.cityData
				this.pickDefaultIndex(2)
			},
			districtData(){
				this.pickerValueArray = this.districtData
				this.pickDefaultIndex(3)
			},
			streetData(){
				this.pickerValueArray = this.streetData
				this.pickDefaultIndex(4)
			}
		}
	}
</script>

<style>
.uni-card{ margin: 0;}
.uni-list-cell-navigate{ justify-content: flex-start; } 
.uni-list-cell-navigate .title{ min-width: 100upx; color: #999999; margin-right: 15upx;}

.store-footer .uni-list-cell-navigate .value{ flex: 1; }
.store-footer .uni-list-cell-navigate .value picker{ width: 100%;}

.scrollList{ padding: 20upx; box-sizing: border-box;}
.store-list .item{ background: #FFFFFF; padding: 20upx; box-shadow: 1px 0px 5px rgba(100, 100, 100, 0.2); border: 1px solid #fff; margin-bottom: 20upx;}
.store-list .item.active{ border: 1px dashed #ec5151; color: #ec5151;}
.store-list .item:last-child{ margin-bottom: 0;}

.btn-warp{ display: flex; flex-direction: row; justify-content: center; align-items: center;}
.btn-warp .btn{ width: 50%; background: #f92028; color: #FFFFFF; border-radius: 0; border: 0;}
.btn-warp .btn-close{ background: #fba534;}
</style>
