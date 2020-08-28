<template>
	<view class="drp-warp drp-set">
		<view class="title">基础设置</view>
		<form @submit="formSubmit">
			<view class="avatar" @click="chooseImage('touxian')">
				<view class="user-img">
					<image :src="drpSetData.user_picture" v-if="drpSetData.user_picture"></image>
					<image src="../../../static/user_default.png" v-else></image>
				</view>
				<view class="tit">店铺头像</view>
				<uni-icon type="forward" size="16" color="#999999"></uni-icon>
			</view>
			<view class="input-list">
				<view class="uni-form-item uni-inline-item">
					<view class="title">店铺名称</view>
					<input type="text" name="shopName" v-model="drpSetData.shop_name" placeholder="店铺名称(必填)" />
				</view>
				<view class="uni-form-item uni-inline-item">
					<view class="title">真实姓名</view>
					<input type="text" name="realName" v-model="drpSetData.real_name" placeholder="真实姓名(必填)" />
				</view>
				<view class="uni-form-item uni-inline-item">
					<view class="title">手机号</view>
					<input type="number" name="mobile" v-model="drpSetData.mobile" placeholder="手机号(必填)" />
				</view>
				<view class="uni-form-item uni-inline-item">
					<view class="title">QQ号</view>
					<input type="number" name="qq" v-model="drpSetData.qq" placeholder="QQ号(选填)" />
				</view>
				<view class="uni-list">
					<view class="title">分销选择</view>
					<view class="value">
						<radio-group @change="valueRadioHandle">
							<label class="uni-list-cell uni-list-cell-not" v-for="(item,index) in list" :key="index">
								<view>
									<radio :value="item.value" :checked="item.value == radio" color="#f92028" />
								</view>
								<view>{{item.name}}</view>
							</label>
						</radio-group>
					</view>
				</view>
			</view>
			<view class="title">上传背景图</view>
			<view class="imgbg" @click="chooseImage('bg')">
				<image :src="pic" mode="widthFix" v-if="pic"></image>
				<image :src="drpSetData.shop_img" mode="aspectFill" v-else></image>
			</view>
			<view class="btn-bar btn-bar-radius">
				<button class="btn btn-red" formType="submit">提交</button>
			</view>
		</form>
		
		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>我的微店</text>
			</navigator>
		</dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				pic:'',
				list:[{
					value:0,
					name:'全部'
				},{
					value:1,
					name:'分类'
				},{
					value:2,
					name:'商品'
				}],
			}
		},
		components:{
			uniIcon,
			dscNotContent,
			dscCommonNav,
		},
		onLoad() {
			this.load()
		},
		computed: {
			...mapState({
				drpSetData: state => state.drp.drpSetData,
			}),
			radio:{
				get(){
					return this.drpSetData.type
				},
				set(val){
					this.drpSetData.type = val
				}
			}
		},
		methods: {
			load(){
				this.$store.dispatch('setDrpSet')
			},
			formSubmit(e){
				var rule = [
					{name:"shopName", checkType : "notnull", checkRule:"",  errorMsg:"店铺名称不能为空"},					
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg:"手机号码不正确"},
					{name:"realName", checkType : "notnull", checkRule:"",  errorMsg:"真实姓名不能为空"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if (checkRes) {
					this.$store.dispatch('setDrpUpdate',{
						id: this.drpSetData.id,
						shop_name: e.detail.value.shopName,
						real_name: e.detail.value.realName,
						mobile: e.detail.value.mobile,
						qq: e.detail.value.qq,
						pic:this.pic,
						type:this.radio
					}).then(res=>{
						uni.showToast({
							title: res.data.msg,
							icon: "none",
							complete: (data) => {
								uni.navigateTo({
									url:'../drp'
								})
							}
						});
					})
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			chooseImage(type){
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success:(res)=>{
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial',{
								file:{
									content:base64
								},
								type:'danzhang'
							}).then(data=>{
								if(type == 'touxian'){
									this.$store.dispatch('setDrpUpdateAvatar',{
										pic:data.data[0],
										id:this.$store.state.drp.drpSetData.id
									})
								}else{
									this.pic = data.data[0]
								}
							})
						}).catch(error => {
							console.error(error,5);
						});
					}
				})
			},
			valueRadioHandle(res){
				this.radio = res.detail.value.toString()
			}
		}
	}
</script>

<style>
.drp-warp .input-list{ background: #FFFFFF; border-radius: 10upx; margin: 0; }
.drp-warp .input-list .uni-form-item .title{ min-width: 120upx;}
.drp-warp .btn-bar{ margin-top: 40upx; padding: 0 20upx;}
.drp-set { padding-bottom: 100upx;}
.drp-set .title{ padding: 20upx; color: #444444; font-size: 32upx;}
.drp-set .avatar{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; background: #FFFFFF; padding:20upx; border-bottom: 1px solid #f4f4f4;}
.drp-set .avatar .user-img{ width: 120upx; height: 120upx; border-radius: 100%; overflow: hidden;}
.drp-set .avatar .user-img image{ width: 100%; height: 100%; }
.drp-set .avatar .tit{ flex: 1 1 0%; padding-left: 30upx; font-size: 32upx; color: #666666; }
.drp-set .imgbg{ padding: 20upx; background: #FFFFFF; box-sizing: border-box;}
.drp-set .imgbg,.drp-set .imgbg image{ width: 100%;}

.uni-list{ display: flex; flex-direction: row;}
.uni-list .title{  }
.uni-list .value{ flex: 1; display: flex; justify-content: flex-start; align-items: center; }
.uni-list radio-group{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center;}
.uni-list:after,
.uni-list:before{ height: 0; }

radio {
  transform:scale(0.8);
}
</style>
