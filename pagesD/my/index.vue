<template>
	<view class="page">

		<view class="uni-list my_padding">
			<!--<navigator url="/pages/my/details"-->
			<!--hover-class="navigator-hover">-->
			<view class="uni-media-list-logo phto" @tap="goPath('/pagesD/my/details')">
				<image :src="myPhoto" :lazy-load="true" style="border-radius: 50%;" />
			</view>
			<text class="iconfonts" @click="goPath('qrcode')" style="font-size:25px;color:#FFFFFF">&#xe600;
			</text>
		</view>
		<!--</navigator>-->

		<view class="header-msg">
			<view class="header-msg-bottom" style="font-weight: 400;font-size: 18px;color: black">{{my_data.nickname}}</view>
			<view class="header-msg-top" style="font-weight: 400;font-size: 12px;">{{my_data.phone}}</view>
		</view>

		<uni-list class="list" style="margin-top: 14px;">
			<uni-list-item title="乐友零钱" :showArrow="true" :show-arrow="true" :show-badge="true" badge-type="error" :badge-text="show_pay_tips"
			 thumb="../../static/theme/default/my/lingqian.png" @click="goPath('./wallet/index')" />
			<uni-list-item title="乐圈订单" :showArrow="true" :show-arrow="true" :show-badge="true" badge-type="error" :badge-text="show_pay_tips"
			 thumb="../../static/theme/default/my/order.png" @click="goPath('/pagesD/order/order')" />
			<uni-list-item title="我的动态" :show-badge="true" :showArrow="true" badge-type="error" :badge-text="show_tips" thumb="../../static/theme/default/my/dongtai.png"
			 @click="goPath('../push/circle')" />
			<uni-list-item title="扫码收款" :showArrow="true" thumb="../../static/theme/default/my/qrcode.png" @click="goPath('../my/pay/pay')" />

		</uni-list>


		<uni-list class="list" v-if="0">
			<uni-list-item title="小程序" :show-arrow="true" :showArrow="true" thumb="../../static/theme/default/push/program.png" />

			<uni-list-item title="相册" :show-arrow="true" :showArrow="true" thumb="../../static/theme/default/my/images.png"
			 @click="goPath()" />
			<uni-list-item title="实名" :show-arrow="true" :showArrow="true" thumb="../../static/theme/default/my/real.png" @click="goPath()" />
			<uni-list-item title="表情" :showArrow="true" :show-arrow="true" thumb="../../static/theme/default/my/emoji.png"
			 @click="goPath()" />
		</uni-list>

		<uni-list class="list" style="margin-bottom:50px;margin-top:5px;">

			<uni-list-item title="设置" :show-arrow="true" :showArrow="true" thumb="../../static/theme/default/my/set.png" @click="goPath('../set/index')" />
		</uni-list>
		<leyoutabbar :curpage="curpage"></leyoutabbar>
	</view>
</template>

<script>
	import leyoutabbar from '@/components/tabbar/leyoutabbar.vue';
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';

	export default {
		components: {
			uniList,
			uniListItem,
			leyoutabbar
		},
		data() {
			return {
				my_data: {
					id: 0
				},
				show_tips: '',
				show_pay_tips: ''
			}
		},
		onShow() {
			_hook.routeTabBarHook();
			let num = _data.data('no_reader_circle_chat_num'),
				_this = this;
			_this.my_data = _data.data('user_info');

			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
				console.log(_this.my_data)
			});
			/** 监听朋友圈动态提示 */
			uni.$on('data_circle_tips', function(data) {
				_this.show_tips = data;
			});
			uni.$on('data_pay_tips', function(data) {
				_this.show_pay_tips = data;
			})
			if (num) {
				this.show_tips = num;
			} else if (_data.data('no_reader_circle')) {
				this.show_tips = '好友动态';
			} else {
				this.show_tips = '';
			}
		},
		onLoad() {

		},
		onHide() {
			//uni.$off('data_user_info');
			uni.$off('data_circle_tips');
		},
		computed: {
			myPhoto() {
				return _data.staticPhoto() + this.my_data.photo;
			},
		},
		methods: {
			goPath(path) {
				console.log(1111)
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
		},
		watch: {},
	}
</script>

<style>
	.iconfonts {
		position: absolute;
		right: 30px;
		top: 30px;
	}

	.header-msg {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30px 0 10px;
		background-color: white;
	}

	.phto {
		width: 106upx;
		height: 106upx;
		margin-left: 30 upx;
		margin-right: 30 upx;
	}

	.list {
		margin-top: 10upx;
	}

	.qrcode {
		width: 50 upx;
		height: 50 upx;
		margin-right: -20 upx;
	}

	.my_padding {
		/*padding-bottom: 25px;*/
		background-image: url("/static/theme/default/bg.jpg");
		background-size: contain;
		height: 225px;
		/*background-color: #4591ff;*/
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.uni-media-list-logo {
		position: absolute;
		bottom: 5px;
		padding: 2px;
		border-radius: 50%;
		background-color: white;
		height: 90px !important;
		width: 90px !important;
		margin-right: 0upx !important;
		margin-left: 0upx !important;
	}

	.my_padding:before {
		background-color: white;
	}

	.uni-list {
		margin-bottom: 30 upx;
	}

	.uni-list-cell-navigate.uni-navigate-right:after {
		font-size: 20px !important;
	}
</style>
