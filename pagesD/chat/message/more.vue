<template>
	<view class="page">
		
		<view class="title">
			<view class="title-msg">
				<view class="title_val">会话成员</view>
				<view class="title_num">共{{data.member.length}}人</view>
			</view>
			<view class="title-img">
				<uni-icons :size="22" class="uni-icon-wrapper" color="#c9c9cb" type="arrowright" />
			</view>
		</view>
		
		<view class="photos" >
			<view class="photo_main"
			v-for="(val,index) of data.member"
			:key="index"
			@tap="goDetails(val.user_id)"
			>
				<image class="photo" :src="photo(val.photo+'')" :lazy-load="true" style="border-radius: 50%;" :data-index="index" @erro="imageError"/>
				<view class="name_class">{{val.show_name}}</view>
			</view>
			<view class="photo_main" @tap="add">
				<image class="photo" :src="'../../../static/theme/default/chat/add.png'" :lazy-load="true" />
				<view class="name_class  msg-size">邀 请</view>
			</view>
			<view class="photo_main" @tap="reduce" v-if="data.is_action">
				<image class="photo" :src="'../../../static/theme/default/chat/reduce.png'" :lazy-load="true" />
				<view class="name_class  msg-size">移 除</view>
			</view>
		</view>		
		
		<view class="uni-card" v-if="data.type == 1">
			<view class="uni-list">
				
				<view class="uni-list-cell" @tap="goSetGroupPhoto">
					<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
						<text class="msg-size">群头像</text>
						<view class="uni-media-list-logo photo">
							<image :src="photo(data.group.is_photo+'')" :lazy-load="true" style="border-radius: 50%;" />
						</view>
					</view>
				</view>
					
				<view class="uni-list-cell" @tap="goSet('name')">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view>
							<text class="msg-size">群聊名称</text>
							<view class="show_text msg-size">{{data.group.name}}</view>
						</view>
					</view>
				</view>
				
				<view class="uni-list-cell" @tap="goSet('notice')">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view class="qun-gonggao">
							<text  class="msg-size">群公告</text>
							<view class="show_text_ msg-size">{{data.group.notice}}</view>
						</view>
					</view>
				</view>
				
				<view class="uni-list-cell" @tap="goGroupQrcode">
					<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
						<text  class="msg-size">群二维码</text>
						<view class="uni-media-list-logo photo_qrcode">
							<image src="/static/theme/default/my/qrcode.png" :lazy-load="true"/>
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="switch_class" v-if="data.is_action">
				<view class="uni-list">
					<view class="uni-list-cell" @tap="goSetAdmin(1)" v-if="isAction">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view>
								<text  class="msg-size">管理员设置</text>
								<view class="show_text_"></view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell" @tap="goSetAdmin(2)">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view>
								<text  class="msg-size">禁言设置</text>
								<view class="show_text_"></view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<view style="width: 100%;display: flex;flex-direction: row">
								<text  class="msg-size" style="width: 50%">群内禁止好友</text>
								<switch :checked="!data.group.can_add_friend" @change="switch1Change" style="width: 50%;text-align: right"/>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db msg-size">全体禁言(除群主和管理员)</view>
						<switch  :checked="!!data.group.is_msg" @change="msgChange" />
					</view>
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db msg-size">匿名聊天</view>
						<switch  :checked="data.group.can_niming == 1" @change="nimingChange" />
					</view>
				</view>
				<view class="uni-list-cell" @tap="removeGroup" v-if="isAction">
					<view class="uni-list-cell-navigate">
						<view>
							<text style="color:red" class="msg-size">解散该群</text>
							<view class="show_text_"></view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="switch_class">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db msg-size">置顶聊天</view>
					<switch  :checked="!!data.top" @change="msgTop" />
				</view>
				<view class="uni-list-cell uni-list-cell-pd" v-if="0">
					<view class="uni-list-cell-db  msg-size">消息免打扰</view>
					<switch />
				</view>
				<view class="uni-list-cell uni-list-cell-pd" v-if="0">
					<view class="uni-list-cell-db  msg-size">强提醒</view>
					<switch />
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _action from '../../../common/_action';
	
	export default {
		data() {
			return {
				data: {
					member: [],
					group: {
						is_photo: 'default_group_photo/90.jpg',
					},
					is_action: 0,
					type: 1,
				},
				list_id: 0,
			};
		},
		computed: {
			staticPhoto(){
				return _data.staticPhoto();
			},
			isAction(){
				if(this.data.group.main_id == _data.data('user_info').id){
					return true;
				}
				return false;
			}
		},
		onShow(){
			_hook.routeSonHook();
			let _this = this;
			_this.$httpSend({
				path: '/im/message/getChatDetails',
				data: { list_id: _this.list_id, },
				success(data) {
					_this.data = data;
					if(data.type == 1){
						uni.setNavigationBarTitle({
							title: data.group.name,
						});
					}
					let cache_data = _data.data('cache');						
					if(data.type == 1 && !('group_photo_' + _this.list_id in cache_data)){
						uni.downloadFile({
							url: _data.staticPhoto() + data.group.is_photo,
							success: (res) => {
								if (res.statusCode === 200) {
									cache_data['group_photo_' + _this.list_id] = res.tempFilePath;
									_data.data('cache',cache_data);
								}
							}
						});
					}
					
				}
			});
		},
		methods: {
			imageError(e){
				console.log("图片加载失败!",e.detail);
				let index = e.currentTarget.dataset.index
				console.log(e.currentTarget.dataset.index)
				//替换index对应的图片
				console.log(this.data.member[index].photo)
				this.data.member[index].photo = '/default_photo_path.png';
			},
			removeGroup(){
				let _this = this;
				uni.showModal({
					title: '重要提示',
					content: '此操作数据不可恢复,确定要解散该群吗?',
					confirmText: '不解散',
					cancelText: '解散',
					confirmColor: '#353535',
					cancelColor: 'red',
					success: function (res) {
						if (!res.confirm) {
							_this.$httpSend({
								path: '/im/message/removeGroup',
								data: { list_id: _this.list_id, },
								success(data) {
									uni.switchTab({
									    url: '../index'
									});
								}
							});
						}
					}
				});
			},
			photo(path){
				return this.staticPhoto + path + '?_=' + Math.random();
			},
			msgChange(e){
				let value = e.detail.value ? 1 : 0;
				if(!this.data.is_action && !this.isAction){
					uni.showModal({
						content: '没有权限设置',
						showCancel: false,
					});
					return;
				}
				this.$httpSend({
					path: '/im/message/groupIsMsg',
					data: { list_id: this.list_id,value, },
					success(data) {
						return;
						uni.showToast({
							title: '设置成功',
							duration: 1500
						});
					}
				});
			},
			nimingChange(e){
				let value = e.detail.value ? 1 : 0;
				if(!this.data.is_action && !this.isAction){
					uni.showModal({
						content: '没有权限设置',
						showCancel: false,
					});
					return;
				}
				this.$httpSend({
					path: '/im/message/nimingChange',
					data: { list_id: this.list_id,value, },
					success(data) {
						return;
						uni.showToast({
							title: '设置成功',
							duration: 1500
						});
					}
				});
			},
			msgTop(e){
				let _this = this,
				value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/message/chatTop',
					data: { list_id: this.list_id,value, },
					success(data) {
						/** 更新对话列表数据 */
						for(let i = 0,local_chat_list = _data.localData('chat_list'),j = local_chat_list.length;i < j;i ++){
							if(local_chat_list[i].list_id == _this.list_id){
								let action_list_data = local_chat_list[i];
								local_chat_list.splice(i,1);
								local_chat_list.unshift(action_list_data);
								_data.localData('chat_list',local_chat_list);
								uni.$emit('data_chat_list',local_chat_list);
								break;
							}
						}
						
						return;
						uni.showToast({
							title: '设置成功',
							duration: 1500
						});
					}
				});
			},
			switch1Change(e){
				let _this = this, value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/message/speekChecked',
					data: { list_id: this.list_id,value:value,},
					success(data) {
						/** 更新对话列表数据 */
						for(let i = 0,local_chat_list = _data.localData('chat_list'),j = local_chat_list.length;i < j;i ++){
							if(local_chat_list[i].list_id == _this.list_id){
								let action_list_data = local_chat_list[i];
								local_chat_list.splice(i,1);
								local_chat_list.unshift(action_list_data);
								_data.localData('chat_list',local_chat_list);
								uni.$emit('data_chat_list',local_chat_list);
								break;
							}
						}
					}
				});
			},
			goGroupQrcode(){
				uni.navigateTo({
					url: ('./group_qrcode?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			goSetGroupPhoto(){				
				if(!this.data.is_action && !this.isAction){
					uni.showToast({
						title: '没有权限设置',
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../set/group_photo?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			goSetAdmin(type){
				switch (type){
					case 1:
						if(!this.isAction){
							uni.showToast({
								title: '群主才能设置',
								icon: 'none',
								duration: 1000
							});
							return;
						}
						break;
					case 2:
						if(!this.data.is_action && !this.isAction){
							uni.showModal({
								content: '没有权限设置',
								showCancel: false,
							});
							return;
						}
						break;
					default:
						return;
						break;
				}
				uni.navigateTo({
					url: ('../../set/group_admin?list_id=' + this.list_id + '&type=' + type),
					animationType: 'slide-in-bottom',
				});
			},
			goSet(type){				
				if(!this.data.is_action && !this.isAction){
					uni.showToast({
						title: '没有权限设置',
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../set/message_more?list_id=' + this.list_id + '&type=' + type),
					animationType: 'slide-in-bottom',
				});
			},
			goDetails(user_id){
				if(this.data.type && !this.data.is_action && !this.isAction && user_id != _data.data('user_info').id){
					uni.showToast({
						title: '没有权限查看',
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../details/index?user_id=' + user_id),
				});
			},
			add(){
				uni.navigateTo({
					url: ('../../friend/index_list?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			reduce(){
				uni.navigateTo({
					url: ('./reduce?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
		},
		onLoad(option) {
			this.list_id = option.list_id;
			this.data.type = option.type;
		},
	}
	
</script>

<style>
	.photos{
		background-color: #FFFFFF;

	}
	.photo_main {
		margin: 7upx 0 0 40upx;
		display: inline-block;
		text-align: center;
	}
	.qun-gonggao{
		display: flex;
		justify-content: space-between;
		width:95%;
	}
	.photo {
		width: 106upx;
		height: 106upx;
		border-radius: 7upx;
	}
	
	.name_class{
		font-size: 12px;
		color: black;
		max-width: 106upx;
		overflow: hidden;
		white-space: nowrap;
	}
	.msg-size{
		font-size: 16px !important;
	}
	.title {
		background: #FFFFFF;
		padding: 10px 20px 10px 23px;
		border-top:1px solid #e5e5e5;
		display: flex;
		justify-content: space-between;
	}
	.title-msg{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		color: black !important;
		font-size: 16px !important;
	}
	.title-img{
		display: flex;
		align-items: center;
	}
	.title_val {
		display: inline-block;
	}

	.switch_class{
		margin-top: 20upx;
	}
	

	.show_text {
		position: absolute;
		right: 30px;
		color: #8f8f94;
		display: inline-block;
	}
	.photo_qrcode{
		width: 52upx;
		height: 52upx;
		margin-right: 0upx;
	}
	.uni-list-cell-navigate.uni-navigate-right:after{
		font-size: 20px !important;
	}
	.uni-list-cell{
		height: 60px !important
	}
	.uni-list-cell-pd{
		padding: 0px 10px 0 12px !important;
	}
	.uni-media-list-logo{
		margin-right: 0px!important;
	}
</style>
