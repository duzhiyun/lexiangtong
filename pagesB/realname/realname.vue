<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view class="uni-list">
<!-- 					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" hover-class="uni-list-cell-hover" @click="uploadCard">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view class="title">上传证件</view>
							<view class="value">
								<view v-if="!isCardImg">未上传</view>
								<view v-else>已上传</view>
							</view>
						</view>
					</view> -->
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">真实姓名</text>
							<view class="value"><input placeholder="请填写真实姓名" name="real_name" v-model="real_name" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">身份证号</text>
							<view class="value"><input placeholder="请填写身份证号" name="self_num" v-model="self_num" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">银行名称</text>
							<view class="value"><input placeholder="如:工商银行上海XXX路支行" name="bank_name" v-model="bank_name" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">银行卡号</text>
							<view class="value"><input placeholder="请填写银行卡号" name="bank_card" v-model="bank_card" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">支付宝账号</text>
							<view class="value"><input placeholder="请填写支付宝账号" name="alipay" v-model="alipay" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="real_type">
						<view class="uni-list-cell-navigate">
							<view class="title">认证时间</view>
							<view class="value">{{add_time}}</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="review_status !== ''">
						<view class="uni-list-cell-navigate">
							<text class="title">审核状态</text>
							<view class="value">
								<text class="uni-red" v-if="review_status == 0">未审核</text>
								<text class="uni-red" v-else-if="review_status == 1">审核通过</text>
								<text class="uni-red" v-else-if="review_status == 2">审核未通过</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="review_status == 2">
						<view class="uni-list-cell-navigate" style="align-items: flex-start;">
							<text class="title">未通过原因</text>
							<view class="value">
								<text class="uni-red">{{ review_content }}</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">手机号码</text>
							<view class="value"><input placeholder="请输入手机号码" name="bank_mobile" v-model="bank_mobile" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">提现方式</text>
							<view class="value">
								<radio-group @change="radioChange" style="width:100%;justify-content:space-between;display: flex;">
									<label style="width:50%">
										<view>银行卡<radio value="1" :checked="ptype == 1" /></view>				
									</label>
									<label style="width:50%">
										<view>支付宝<radio value="2" :checked="ptype == 2" /></view>				
									</label>			
								</radio-group>
							</view>
						</view>
					</view>
					<block v-if="button_edit_type == false">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">图片验证码</text>
							<view class="value value-items">
								<input placeholder="请输入图片验证码" name="imgverifyValue" v-model="imgverifyValue">
								<view class="code-box" @click="clickCaptcha"><image :src="captcha" class="img"></image></view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">短信验证码</text>
							<view class="value value-items">
								<input placeholder="请输入短信验证码" name="sms" v-model="sms">
								<button size="mini" type="warn" @click="sendVerifyCode" v-if="button_type">获取验证码</button>
								<button size="mini" type="default" v-else>{{ button_text }}</button>
							</view>
						</view>
					</view>
					</block>
				</view>
			</view>
			<view class="btn-bar">
				<block v-if="real_id > 0">
					<button class="btn btn-red" type="primary" @click="editRealname" v-if="button_edit_type">修改认证信息</button>
					<button class="btn btn-red" formType="submit" type="primary" v-else>{{ button_edit }}</button>
				</block>
				<block v-else>
					<button class="btn btn-red" formType="submit" type="primary">同意添加实名帐号协议并确定</button>
				</block>
			</view>
		</form>
		<uni-popup :show="cardShow" type="right" v-on:hidePopup="handelClose('card')">
			<view class="card-main-warp">
				<view class="containTop">
					<view class="title">请上传本人身份证照片</view>
					<view class="photoBox">
						<view class="photo">
							<view class="card cardA" @tap="chooseImage('front_of_id_card')">
								<view class="preShow" v-if="front_of_id_card && newChooseImage.front" :style="{'background-image':'url('+ front_of_id_card +');','background-color':'#FFFFFF','background-size':'contain','background-position':'center center','background-repeat':'no-repeat'}"></view>
								<image src="../../static/card-a.png" class="img" v-else></image>
							</view>
							<view class="text">上传人像页照片</view>
						</view>
						<view class="photo">
							<view class="card cardB" @tap="chooseImage('reverse_of_id_card')">
								<view class="preShow" v-if="reverse_of_id_card && newChooseImage.reverse" :style="{'background-image':'url('+ reverse_of_id_card +');','background-color':'#FFFFFF','background-size':'contain','background-position':'center center','background-repeat':'no-repeat'}"></view>
								<image src="../../static/card-b.png" class="img" v-else></image>
							</view>
							<view class="text">上传国徽页照片</view>
						</view>
					</view>
				</view>
				<view class="containBottom">
					<view class="title" @click="prompt">
						<view class="tit">请拍摄身份证原件：</view>
						<view class="more"><text class="iconfont icon-sigh"></text>上传证件照片要求</view>
					</view>
					<view class="tip-image"><image src="../../static/false-1.png" class="img"></image></view>
					<view class="btn-bar btn-bar-radius">
						<block v-if="newChooseImage.front && newChooseImage.front">
							<view class="btn btn-red" @click="handelClose('card')">确认上传</view>
						</block>
						<block v-else>
							<view class="btn btn-disabled">确认上传</view>
						</block>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup :show="promptShow" type="bottom" v-on:hidePopup="handelClose('prompt')">
			<view class="title">
				<view class="txt">上传证件照片要求</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('prompt')"></uni-icon>
			</view>
			<view class="rule-layer">
				<view class="p">1. 请上传本人清晰、完整的彩色身份证照片，确保证件在有效期内；</view>
				<view class="p">2. 身份证各项信息及头像清晰可见，易于识别；</view>
				<view class="p">3. 身份证必须真实拍摄，不得使用复印件和扫描件；</view>
				<view class="p">4. 照片格式必须为JPG或PNG；</view>
				<view class="p">5. 手持照需免冠，五官可见，露出完整的手臂与耳朵；</view>
				<view class="p">6. 建议横屏拍摄，以满足照片上传要求。</view>
			</view>
		</uni-popup>
		
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniPopup from '@/components/uni-popup.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	
	var graceChecker = require("@/common/graceChecker.js");
	
	export default {
		components: {
			uniPopup,
			uniIcon,
			dscCommonNav
		},
		data() {
			return {
				cardShow:false,
				promptShow:false,
				real_type: false,
                real_id: 0,
                real_name: '',
                self_num: '',
                bank_name: '',
                bank_card: '',
				alipay:'',
				ptype:1,
				review_content:'',
                front_of_id_card: 0,
                reverse_of_id_card: 0,
                add_time: '',
                review_status: '',
                bank_mobile: '',
                imgverifyValue: '',
                sms: '',
                button_text: '重新发送(60s)',
                button_type: true,
                button_edit_type : false,
                button_edit: '提交',
                isDisabled:true,
				newChooseImage:{
					front:false,
					reverse:false
				}
			};
		},
		computed: {
			...mapState({
				captcha: state => state.common.imgVerify.captcha,
				client: state => state.common.imgVerify.client,
			}),
            isCardImg() {
                return this.front_of_id_card != 0 && this.reverse_of_id_card != 0 ? true : false
            },
        },
		methods: {
		    radioChange: function(e) {
				this.ptype = e.target.value
			},
			realnameLoad(val){
				this.newChooseImage.front = false;
				this.newChooseImage.reverse = false;
				uni.request({
					url:this.websiteUrl + '/api/v4/realname',
					method:'GET',
					data:{},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						if (data != '') {
						    this.real_type = true
						    this.real_id = data.real_id
						    this.real_name = data.real_name
						    this.self_num = data.self_num
						    this.bank_name = data.bank_name
						    this.bank_card = data.bank_card
							this.alipay = data.alipay
						    this.bank_mobile = data.bank_mobile
						    this.front_of_id_card = data.front_of_id_card
						    this.reverse_of_id_card = data.reverse_of_id_card
						    this.review_status = data.review_status
						    this.add_time = data.add_time
							this.review_content = data.review_content
							this.ptype = data.ptype
						}
						
						if(data == '' && val != 'add'){
						    this.isDisabled = false
						    this.button_edit_type = false
						}else{
						    this.isDisabled = false
						    this.button_edit_type = false
						}
					}
				})

                this.$store.dispatch('setImgVerify')
            },
			formSubmit(e){
				var rule = [
					{name:"real_name", checkType : "notnull", checkRule:"",  errorMsg:"真实姓名不能为空"},					
					{name:"self_num", checkType : "notnull", checkRule:"",  errorMsg:"身份证号不能为空"},
					{name:"bank_name", checkType : "notnull", checkRule:"",  errorMsg:"银行名称不能为空"},
					{name:"bank_card", checkType : "notnull", checkRule:"",  errorMsg:"银行卡号不能为空"},
					{name:"alipay", checkType : "notnull", checkRule:"",  errorMsg:"支付宝账号不能为空"},
					{name:"imgverifyValue", checkType : "notnull", checkRule:"",  errorMsg:"图形验证码不能为空"},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:"短信验证码不能为空"},
					{name:"bank_mobile", checkType : "phoneno", checkRule:"",  errorMsg:"手机号码不正确"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if(checkRes){
					let o = {
						real_id: this.real_id,
						real_name: this.real_name,
						self_num: this.self_num,
						bank_name: this.bank_name,
						bank_card: this.bank_card,
						alipay: this.alipay,
						bank_mobile: this.bank_mobile,
						ptype:this.ptype,
						front_of_id_card: this.front_of_id_card,
						reverse_of_id_card: this.reverse_of_id_card
					}
					this.$store.dispatch('setSmsVerify', {
                        client: this.client,
                        code: this.sms,
                        mobile:this.bank_mobile
                    }).then(res => {
                        if (res.status == 'success') {
							if(this.real_id > 0){
								uni.request({
									url:this.websiteUrl + '/api/v4/realname/update',
									method:'PUT',
									data:o,
									header: {
										'Content-Type': 'application/json',
										'token': uni.getStorageSync('token'),
										'X-Client-Hash':uni.getStorageSync('client_hash')
									},
									success: (res) => {
										if (res.data.data == true) {
											uni.showToast({ title: '修改成功！', icon: "none" });
											this.button_edit_type = true
											
											uni.redirectTo({
												url:'../profile/profile'
											})
										} else {
											uni.showToast({ title: '修改错误，重新填写！', icon: "none" });
										}
									}
								})
							}else{
								uni.request({
									url:this.websiteUrl + '/api/v4/realname/store',
									method:'POST',
									data:o,
									header: {
										'Content-Type': 'application/json',
										'token': uni.getStorageSync('token'),
										'X-Client-Hash':uni.getStorageSync('client_hash')
									},
									success: (res) => {
										if (res.data.data == true) {
											uni.showToast({ title: '认证提交，等待审核！', icon: "none" });
											this.button_edit_type = true
											uni.redirectTo({
												url:'../profile/profile'
											})
										} else {
											uni.showToast({ title: '添加失败！', icon: "none" });
										}
									}
								})
							}
						}else{
							uni.showToast({ title: res.errors.message, icon: "none" });
						}
					})	
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			// 改变可修改
			editRealname() {
                this.isDisabled = false
                this.button_edit_type = false
            },
			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},
			sendVerifyCode() {
                let o = {
                    captcha: this.imgverifyValue,
                    client: this.client,
                    mobile: this.bank_mobile
                }

                this.$store.dispatch('setSendVerify', o).then(res => {
                    if (res == 'success') {
                        this.button_type = false
                        let second = 60
                        const timer = setInterval(() => {
                            second--
                            if (second) {
                                this.button_text = '重新发送(' + second + 's)'
                            } else {
                                this.button_type = true
                                clearInterval(timer);
                            }
                        }, 1000)
                    }
                })
            },
			uploadCard() {
                if(this.button_edit_type == false) {
                   this.cardShow = true
                }else{
					uni.showToast({ title: '修改状态下才可编辑证件', icon: "none" });
				}
            },
			handelClose(val){
				if(val == 'card'){
					this.cardShow = false
				}else if(val == 'prompt'){
					this.promptShow = false
				}
			},
			chooseImage(val){
				uni.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success:(res)=>{
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial',{
								file:{
									content:base64
								},
								type:val
							}).then(data=>{
								if(val == 'front_of_id_card'){
									this.front_of_id_card = data.data[0];
									this.newChooseImage.front = true;
								}else{
									this.reverse_of_id_card = data.data[0];
									this.newChooseImage.reverse = data.data[0];
								}
							})
						}).catch(error => {
							console.error(error,5);
						});
					}
				})
			},
			prompt(){
				this.promptShow = this.promptShow == false ? true : false
			},
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/realname/realname'
			}
		},
		onLoad(){
			this.realnameLoad()
		}
	}
</script>

<style>
.btn-bar{ margin:30upx;}

.value-items{ display: flex; align-items: center; justify-content: space-between;}
.value-items button[size=mini]{ margin: 0; padding: 0 14px;}

.card-main-warp .containTop{ background-color: #ebebed; padding-bottom: 100upx;}
.card-main-warp .containTop .title{ padding: 20upx 0; display: flex; justify-content: center;}
.card-main-warp .containTop .photoBox .photo{ position: relative; border: 2px solid #359df5; background: #FFFFFF; border-radius: 10upx; width: 65%; margin: 0 auto 20upx; padding: 60upx 0 30upx; box-sizing: border-box;}
.card-main-warp .containTop .photoBox .photo:last-child{ margin-bottom: 0;}
.card-main-warp .containTop .photoBox .photo .card{ width: 270upx; height: 162upx; position: relative; margin: 0 auto;}
.card-main-warp .containTop .photoBox .photo .card .preShow{ width: 100%; height: 100%;}
.card-main-warp .containTop .photoBox .photo .text{ text-align: center; margin-top: 10upx; color: #359df5;}
.card-main-warp .containBottom{ background: #FFFFFF;}
.card-main-warp .containBottom .title{ padding: 20upx 0 10upx; margin: 0 45upx; border-bottom: 1px solid #e0e0e0;}
.card-main-warp .containBottom .title .more{ color: #359df5;}
.card-main-warp .containBottom .tip-image{ width: 100%; height: 130upx; margin-top: 20upx;}
.card-main-warp .containBottom .btn-bar{ margin: 50upx 40upx;}

.rule-layer{ border-top: 1px solid #e0e0e0; padding: 20upx; display: flex; flex-direction: column; justify-content: flex-start; text-align: left;}
.rule-layer .p{ line-height: 2.5;}
</style>
