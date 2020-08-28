<template>
	<view class="con" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">		
		<discover-list :discoverList="discoverList" v-on:getLikeNum="handleLikeNum" v-on:getDelete="handleDelete"></discover-list>
		<view class="footer-cont" v-if="footerCont">没有更多了</view>
		<template v-if="loading">
			<van-loading type="spinner" color="black" />
		</template>
		<discover-nav :mode="mode" :type="type"></discover-nav>
	</view>
</template>

<script>
import { mapState } from 'vuex'	
import discoverList from '@/components/dsc-discover/list';
import discoverNav from '@/components/dsc-discover/nav'; 

export default{
	data(){
		return{
			mode:true,
			dis_type:1,
			page:1,
			size:10,
			type:'ListType',
			communityType:true,
			loading:false,
			footerCont:false
		}
	},
	components:{ 
		discoverList,
		discoverNav
	},
	onLoad(e){		
		this.dis_type = e.type
		this.onlist()
	},
	computed:{
		discoverList:{
        	get(){
        		return this.$store.state.discover.discoverList
        	},
        	set(val){
        		this.$store.state.discover.discoverList = val
        	}
        }
	},
	methods:{
		onlist(page){
			if(page){
				this.page = page
				this.size = Number(page) * 10
			}			
			this.$store.dispatch('setDiscoverList',{
				dis_type:this.dis_type,
				page:this.page,
				size:this.size
			})
		},
		handleLikeNum(obj){
			this.discoverList.forEach(v=>{
				if(v.dis_id == obj.dis_id){
					v.like_num = obj.likeNum
				}
			})
		},
		handleDelete(obj){
			this.discoverList.forEach((v,i)=>{
				if(v.dis_id == obj.dis_id){
					 this.discoverList.splice(i, 1)
				}
			})
		}		
	},
	onReachBottom(){ //翻页检测
		if(this.page * this.size == this.discoverList.length){
			this.page ++
			this.onlist()
		}
	},
	watch:{
		discoverList(){
			if(this.page * this.size == this.discoverList.length){
				this.disabled = false
				this.loading = true
			}else{
				this.loading = false
				this.footerCont = this.page > 1 ? true : false
			}

			// this.discoverList = arrRemove.trimSpace(this.discoverList)
		},
	}
}
</script>

<style>
.con {
    max-width: 640px;
    min-width: 320px;
    min-height: 100vh;
    margin-right: auto;
    margin-left: auto;
    overflow: hidden;
}
</style>