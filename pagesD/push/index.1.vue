<template>
	<view class="page">
		
		<uni-list>
			<uni-list-item title="朋友圈" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="showTips"
						   thumb="../../static/theme/default/push/circle.png"
						   @click="goPath('circle')"
						   />
						   
		</uni-list>
		
		<uni-list>
			<uni-list-item title="扫一扫" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/scan.png"
						   />						   
		
			<uni-list-item title="摇一摇" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="showTips"
						   thumb="../../static/theme/default/push/icon_shake.png"
						   @click="goPath('circle')"
						   />			   
		</uni-list>
		
		
		
		<uni-list>
			<uni-list-item title="看一看" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/see.png"
						   />
			<uni-list-item title="搜一搜" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/search.png"
						   />		
		</uni-list>
		<uni-list>
			<uni-list-item title="附近的人" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="showTips"
						   thumb="../../static/theme/default/push/icon_nearby.png"
						   @click="goPath('game_site')"
						   />
		</uni-list>
		<uni-list>
			<uni-list-item title="游戏" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/game.png"
						   @click="goPath('game_list')"
						   />
						   
		</uni-list>
		
		<uni-list>
			<uni-list-item title="小程序" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/program.png"
						   
						   />
		</uni-list>
		
	</view>
</template>

<script>
	
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	
	export default {
		components: {
			uniList,
			uniListItem,
		},
		data() {
			return {
			}
		},
		onShow(){
			_hook.routeTabBarHook();
		},
		onLoad() {
			
		},
		computed: {
			showTips(){
				if(this.$store.state.no_reader_circle_chat_num){
					return this.$store.state.no_reader_circle_chat_num;
				}
				if(this.$store.state.no_reader_circle){
					return ' ';
				}
				return '';
			},
		},
		methods: {
			goPath(path){
				if(path){
					uni.navigateTo({
						url: path
					});
				}
			},
		},
	}
</script>

<style>
	
	.uni-list {
		margin-bottom: 30upx;
	}
	
</style>
