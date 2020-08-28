<template>	
	<view>
		<view class="tank">
			<view class="get-more" @click="moreMessage">点击查看更多</view>
			<view class="tank-con">
				<view class="padding-lr user-consult">
					<view class="cons-list dis-box" v-for='(item,index) in kefuChatListData' :key="index">
						<view v-if="item.user_type == 2">
							<view class="box-flex1 m-top02">
								<view class="cons-admin text-right"><text class="b">{{item.name}}</text><text>{{item.time}}</text></view>
								<view class="fr m-top04">
									<view class="cons-cont-1 text">{{item.message}}</view>
								</view>
							</view>
							<view class="cons-head-img-box cons-head-img-boxr"><img class="title-img" :src="item.avatar" /></view>
						</view>
						<view v-else>
							<view class="cons-head-img-box text-center"><img class="title-img" :src="item.avatar" /></view>
							<view class="box-flex1 m-top02">
								<view class="cons-admin"><text class="b">{{item.name}}</text><text>{{item.time}}</text></view>
								<view class="fl">
									<view class="cons-cont m-top04 text">{{item.message}}</view>
								</view>
							</view>
						</view>						
					</view>
				</view>
			</view>
		</view>
		<view class="filter-btn dis-box comment" id="jw-editor">
		    <view class="speak-contcom_form">
		        <text class="span fa fa-smile-o btn emotion">表情</text>
		        <text class="span fa fa-image jw-send-image" @click="chooseImage">图片</text>
		    </view>
		
		    <view class="text-input">
		        <input class="write-input" type="text" name="comment" v-model="comment" autocomplete="off" value="">
		
		    </view>
		    <view class="send-btn">
		        <view class="button send jw-send-msg" @click="btnSubmit">发送</view>
				
		    </view>
		</view>
	</view>	
	
</template>
  
<script>
	import { mapState } from 'vuex'
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	
	export default {
		components: {			
		},
		data() {
		    return {
				user_type:2,
				goods_id:0,
				store_id:0,
				token:'',
				type:'default',
				default:1,
		        size:10,
		        page:1,
				comment:''
		    }			
		},
		//初始化加载数据
		onLoad(e){
			this.store_id = e.shop_id
			this.goods_id = e.goods_id	
			this.token = e.token
			
			this.$store.dispatch('setKefuLogin',{
			    ru_id: this.store_id,
			    goods_id: this.goods_id,
			    token:this.token,
				type:'app'
			})
			
		    this.ChatList()
		},
		computed: {
			...mapState({
			    KefuLoginData: state => state.kefu.KefuLoginData,
			}),
		    kefuChatListData:{
		        get(){
		            return this.$store.state.kefu.kefuChatListData
		        },
		        set(val){
		            this.$store.state.kefu.kefuChatListData = val
		        }
		    }			
		},
		methods: {
		    ChatList() { // 聊天历史记录
		        this.$store.dispatch('setKefuSingleChatList',{
		            user_type:this.user_type,
					type:this.type,
		            store_id:this.store_id,
		        });
				this.page = this.page + 1
		    },
			moreMessage() { // 查看更多
				this.$store.dispatch('setKefuSingleChatList',{
					page:this.page,
				    user_type:this.user_type,
				    store_id:this.store_id,
					default:this.default,
				});
				this.page = this.page + 1
			},
			btnSubmit() { // 发送消息
				this.sendMsg(this.comment);				
			},
			sendMsg(msg){
				if(msg == ''|| msg == null){
					uni.showToast({
						title:'发送消息不能为空',
						icon:'none'
					})
					return false
				}				
				this.$store.dispatch('setTransMessage',{
					message:msg,
				}).then(res=>{		
					this.comment = ''
				})	
			},
			chooseImage(){ // 发送图片
				uni.showToast({
					title:'请选择2MB以下的图片',
					icon:'none'
				})
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success:(res)=>{
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setSendImage',{
								myfile:base64
							}).then(data=>{
								if(data.code == 0){		
									this.sendMsg(data.data.src);			
								}
							})
						}).catch(error => {
							console.error(error,5);
						});
					}
				})
			},
		}
	}
</script>
	
<style>
	.tank {position: absolute; width: 100%; top: 0; left: 0; right: 0; padding-bottom: 112upx; overflow-y: scroll;}
	.tank .get-more { width: 100%; display: block; margin: 0 auto; text-align: center; padding: 20upx 0; font-size: 24upx; color: #00a2d4;}
	.tank .user-consult {overflow: hidden;}
	.padding-lr {padding: 0 20upx;}
	.dis-box { display: flex;/*duzy*/}
	.cons-list {margin-top: 40upx; list-style: none;}
	.box-flex1 {display: block; width: 100%;}
	.cons-admin {color: #666; font-size: 24upx;}
	.text-right { text-align: right;}
	.cons-admin .b {margin-right: 10upx;}
	.m-top04 {margin-top: 8upx;}
	.fr {float: right;}
	.cons-cont {background: #f1cdcea3; color: #000;}
	.cons-cont-1 {background: #e7e8ef; color: #333;}
	.cons-cont, .cons-cont-1 {border-radius: 10upx; padding: 10upx; word-break: break-all; font-size: 28upx; float: right;}
	.cons-head-img-boxr {margin-right: 0;margin-left: 20upx;}
	.cons-head-img-box {width: 80upx; height: 80upx; overflow: hidden;margin-right: 20upx; border-radius: 100%;}
	.cons-head-img-box img {width: 100%; height: 100%;display: inline-block;  border: none;}
	.fl {float: left;}
	
	
	#jw-editor {display: -webkit-box;bottom: 0px; height: 53px;}
	.filter-btn {padding: 10upx 0; margin: 0 auto; position: fixed; width: 100%; left: 0; right: 0; box-sizing: border-box;z-index: 6; background: #e8e8e8; border-top: 1px solid #efefef;}
	#jw-editor .speak-contcom_form {-webkit-box-flex: 1; width: 22%; padding-right: 20upx;}
	.fa.fa-smile-o {margin-left: 20upx;margin-top: 0.4rem;}
	.filter-btn .span {font-size: 30upx; color: #696969;}
	.fa {display: inline-block;font: normal normal normal 14px/1 FontAwesome; text-rendering: auto;-webkit-font-smoothing: antialiased;}
	#jw-editor .jw-send-image {float: right;}
	.fa.fa-image {display: block; float: right; margin-top: 8upx;}
	.filter-btn span {font-size: 50upx; color: #696969;}
	#jw-editor .text-input {-webkit-box-flex: 1; width: 60%;}
	.text-input {width: 100%; box-sizing: border-box;}
	#jw-editor .send-btn {-webkit-box-flex: 1;  width: 18%;padding-left:20upx;}
	.send {right: 1rem; display: block; background: #00a2d4; text-align: center; line-height: 20upx; font-size: 26upx; color: #fff; border: none; bottom: 6upx; padding: 1rem; border-radius: 10upx;}
	.button {font-family: inherit; font-style: inherit; font-weight: inherit; outline: 0;}
	.write-input {font-size: 30upx;line-height: 80upx;padding: 10upx; max-height: 200upx;border-radius: 3px;background: #fff;overflow-y: auto; overflow-x: hidden;}

</style>
