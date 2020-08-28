<template>
	<view class="fixed-bottom-padding">
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view class="header-title">增票资质信息</view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">单位名称</text>
							<view class="value"><input placeholder="请填写单位名称" name="company_name" v-model="company_name" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">纳税人识别码</text>
							<view class="value"><input placeholder="请输入纳税人识别码" name="tax_id" v-model="tax_id" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">注册地址</text>
							<view class="value"><input placeholder="请输入注册地址" name="company_address" v-model="company_address" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">注册电话</text>
							<view class="value"><input placeholder="请输入注册电话" name="company_telephone" v-model="company_telephone" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">开户银行</text>
							<view class="value"><input placeholder="请输入开户银行" name="bank_of_deposit" v-model="bank_of_deposit" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">银行账户</text>
							<view class="value"><input placeholder="请输入银行账户" name="bank_account" v-model="bank_account" :disabled="isDisabled"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-card uni-card-not">
				<view class="header-title">票据收件信息</view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">姓名</text>
							<view class="value"><input placeholder="请输入姓名" name="consignee_name" v-model="consignee_name" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">手机号</text>
							<view class="value"><input placeholder="请输入收票人手机号" name="consignee_mobile_phone" v-model="consignee_mobile_phone" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" @click="handleRegion">
						<view class="uni-list-cell-navigate">
							<text class="title">所在地区</text>
							<view class="value">
								<block v-if="regionData.province.id">{{ regionData.province.name }}</block>
								<block v-if="regionData.city.id">{{ regionData.city.name }}</block>
								<block v-if="regionData.district.id">{{ regionData.district.name }}</block>
								<block v-if="regionData.street.id">{{ regionData.street.name }}</block>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">详细地址</text>
							<view class="value"><input placeholder="请输入详细地址" name="consignee_address" v-model="consignee_address" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="id > 0">
						<view class="uni-list-cell-navigate">
							<text class="title">审核状态</text>
							<view class="value">
								<view class="uni-red" v-if="audit_status == 0">未审核</view>
								<view class="uni-red" v-else-if="audit_status == 1">通过审核</view>
								<view class="uni-red" v-else-if="audit_status == 2">审核未通过</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<block v-if="id > 0">
					<view class="btn btn-org" @click="deleteInv">删除</view>
					<view class="btn btn-red" @click="editInv" v-if="isDisabled == true">修改</view>
					<button formType="submit" type="primary" class="btn btn-red" v-else>保存</button>
				</block>
				<block v-else>
					<button formType="submit" type="primary" class="btn btn-red">添加</button>
				</block>
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
				isDisabled: true,
				id: '',
                audit_status: '',
                company_name: '',
                tax_id: '',
                company_address: '',
                company_telephone: '',
                bank_of_deposit: '',
                bank_account: '',
                consignee_name: '',
                consignee_mobile_phone: '',
                consignee_address: '',
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
				curRegion:'province'
			};
		},
		components:{
			uniPopup,
			mpvuePicker
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/invoice/invoice'
			}
		},
		computed:{
			...mapState({
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
			})
		},
		methods:{
			editInv(){
				this.isDisabled = false
			},
			formSubmit(e){
				var rule = [
					{name:"company_name", checkType : "notnull", checkRule:"",  errorMsg:"请填写单位名称"},					
					{name:"tax_id", checkType : "notnull", checkRule:"",  errorMsg:"请填写纳税人识别码"},
					{name:"company_address", checkType : "notnull", checkRule:"",  errorMsg:"请填写注册地址"},
					{name:"company_telephone", checkType : "notnull", checkRule:"",  errorMsg:"请填写注册电话号"},
					{name:"bank_of_deposit", checkType : "notnull", checkRule:"",  errorMsg:"请填写开户银行"},
					{name:"consignee_name", checkType : "notnull", checkRule:"",  errorMsg:"请填写收票人姓名"},
					{name:"consignee_mobile_phone", checkType : "phoneno", checkRule:"",  errorMsg:"收票人手机号不正确"},
					{name:"consignee_address", checkType : "notnull", checkRule:"",  errorMsg:"请填写收票人详细地址"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if(checkRes){
					let o = {
						id: this.id,
						company_name: this.company_name,
						tax_id: this.tax_id,
						company_address: this.company_address,
						company_telephone: this.company_telephone,
						bank_of_deposit: this.bank_of_deposit,
						bank_account: this.bank_account,
						consignee_name: this.consignee_name,
						consignee_mobile_phone: this.consignee_mobile_phone,
						consignee_address: this.consignee_address,
						country: 1,
						province: this.regionData.province.id,
						city: this.regionData.city.id,
						district: this.regionData.district.id,
						street: this.regionData.street.id,
						invoice_type:1
					}
					
					if(this.id > 0){
						uni.request({
							url:this.websiteUrl + '/api/v4/invoice/update',
							method:'PUT',
							data:o,
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								if (res.data.status == 'success') {
									uni.showToast({ title: '修改提交成功', icon: "success" });
									
									setTimeout(()=>{
										uni.navigateTo({ url:'../account/account' });
									},1000)
								} else {
									uni.showToast({ title: '修改错误，重新填写！', icon: "none" });
								}
							}
						});
					}else{
						uni.request({
							url:this.websiteUrl + '/api/v4/invoice/store',
							method:'POST',
							data:{
								id: this.id,
								company_name: this.company_name,
								tax_id: this.tax_id,
								company_address: this.company_address,
								company_telephone: this.company_telephone,
								bank_of_deposit: this.bank_of_deposit,
								bank_account: this.bank_account,
								consignee_name: this.consignee_name,
								consignee_mobile_phone: this.consignee_mobile_phone,
								consignee_address: this.consignee_address,
								country: 1,
								province: this.regionData.province.id,
								city: this.regionData.city.id,
								district: this.regionData.district.id,
								street: this.regionData.street.id,
								invoice_type:1
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								if (res.data.status == 'success') {
									uni.showToast({ title: '增值税发票添加成功！', icon: "success" });
									
									setTimeout(()=>{
										uni.navigateTo({ url:'../account/account' });
									},1000)
								} else {
									uni.showToast({ title: '增值税发票添加失败！', icon: "none" });
								}
							}
						});
					}
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			deleteInv(){
				uni.request({
					url:this.websiteUrl + '/api/v4/invoice/destroy',
					method:'DELETE',
					data:{
						invoice_type:1,
						id:this.id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({ title: '删除成功！', icon: "success" });
							setTimeout(()=>{
								uni.navigateTo({ url:'../account/account' });
							},1000)
						} else {
							uni.showToast({ title: '删除失败！', icon: "none" });
						}
					}
				});
			},
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
				}
				
				this.regionShow = false
			},
			handelClose(val){
				if(val == 'region'){
					this.regionShow = false
				}
			},
		},
		onLoad(){
			uni.request({
				url:this.websiteUrl + '/api/v4/invoice',
				method:'GET',
				data:{},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					let data = res.data.data.user_vat_invoice;
					if (data != '') {
					    this.id = data.id
					    this.audit_status = data.audit_status
					    this.company_name = data.company_name
					    this.tax_id = data.tax_id
					    this.company_address = data.company_address
					    this.company_telephone = data.company_telephone
					    this.bank_of_deposit = data.bank_of_deposit
					    this.bank_account = data.bank_account
					    this.consignee_name = data.consignee_name
					    this.consignee_mobile_phone = data.consignee_mobile_phone
					    this.consignee_address = data.consignee_address
						
						this.regionData.province.id = data.province ? data.province : ''
						this.regionData.province.name = data.province_name ? data.province_name : ''
						this.regionData.city.id = data.city ? data.city : ''
						this.regionData.city.name = data.city_name ? data.city_name : ''
						this.regionData.district.id = data.district ? data.district : ''
						this.regionData.district.name = data.district_name ? data.district_name : ''
						this.regionData.street.id = data.street ? data.street : ''
						this.regionData.street.name = data.street_name ? data.street_name : '请选择'
					} else {
					    this.isDisabled = false
					}
				},
			});
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
.header-title{ padding: 20upx 30upx; border-bottom: 1px solid #DDDDDD; font-size: 30upx;}
</style>
