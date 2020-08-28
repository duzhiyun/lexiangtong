<template>
	<view>
		<uni-popup :show="isShow" type="right" v-on:hidePopup="handelClose('region')">
			<view class="popup-right-show region-info-show">
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">地址</text>
								<view class="value"></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">所在地区</text>
								<view class="value"><text class="uni-blue" @click="selectRegion('province')">{{ regionData.province.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="regionData.province.id">
							<view class="uni-list-cell-navigate">
								<text class="title">市</text>
								<view class="value"><text class="uni-blue" @click="selectRegion('city')">{{ regionData.city.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="regionData.city.id">
							<view class="uni-list-cell-navigate">
								<text class="title">区/县</text>
								<view class="value"><text class="uni-blue" @click="selectRegion('district')">{{ regionData.district.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="regionData.street.id">
							<view class="uni-list-cell-navigate">
								<text class="title">乡镇/街道</text>
								<view class="value"><text class="uni-blue" @click="selectRegion('street')">{{ regionData.street.name }}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<mpvue-picker themeColor="#007AFF" ref="mpvuePicker" mode="selector" deepLength="1" pickerValueDefault="[0]"
		 @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import uniPopup from './uni-popup.vue';
	import mpvuePicker from './mpvue-picker/mpvuePicker.vue';
	export default {
		props: {
			isShow:{
				type:Boolean,
				default:false
			},
			regionData:{
				type:Object,
				default:Object
			},
			provinceData:{
				type:Object,
				default:Object
			},
			cityData:{
				type:Object,
				default:Object
			},
			districtData:{
				type:Object,
				default:Object
			},
			streetData:{
				type:Object,
				default:Object
			}
		},
		data() {
			return {
				pickerValueArray:[],
				curRegion:'province'
			};
		},
		components:{
			uniPopup,
			mpvuePicker
		},
		methods:{
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
.region-info-show .uni-card{ margin: 0;}
.region-info-show .uni-card .uni-list-cell-navigate{ padding: 0;}
.region-info-show .uni-card .uni-list-cell-navigate .title{ padding: 20upx 30upx; min-width: 100upx;}
.region-info-show .btn-bar{ margin: 30upx 40upx;}
</style>
