<template>
	<view class="container">
		<view class="drp-new" v-if="drpNewsData!=''">
			<uni-collapse :accordion="true">
				<uni-collapse-item :title="item.title" :content="item.content" v-for="(item,index) in drpNewsData" :key="index" :name="index"></uni-collapse-item>
			</uni-collapse>
		</view>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>我的微店</text>
			</navigator>
		</dsc-common-nav>
		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	export default {
		data() {
			return {
			}
		},
		components:{
			uniIcon,
			uniCollapse,
			uniCollapseItem,
			dscCommonNav,
			dscNotContent
		},
		onLoad() {
			this.load();
		},
		computed: {
			...mapState({
				drpNewsData: state => state.drp.drpNewsData,
			})
		},
		methods: {
			load(){
				this.$store.dispatch('setDrpNews');
			}
		}
	}
</script>

<style scoped>
</style>
