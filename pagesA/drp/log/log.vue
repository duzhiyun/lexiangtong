<template>
	<view >		
		<view class="secul">			 
				<view  class="secli"   v-for="(tab,index) in tabBars" :key="index" :class="['tab-item',active == index ? 'active' : '']" @click="commonTabs(index)">
					<text>{{ tab }}</text>
				</view>		 	
		</view> 
		<view style="width:100%;height:80rpx"></view>	
		
		 
		
		
		<view class="section-list">
			<block v-if="drpLogData !='' ">
				<view class="list" v-for="(item,index) in drpLogData" :key="index"  @click="toParticulars(item.log_id)">
					<view class="hd" v-if="check(item.change_desc)">
						<view class="red">{{item.change_desc}}</view>
					</view>
					<view class="hd" v-else>
						<view class="right">{{item.change_desc}}</view>
					</view>
					<view class="fd" v-if="check(item.change_desc)">
						<view class="red" v-if="item.point!=0 && (type == 1 || type == 0)"><text>乐券：{{item.point}}点</text></view>
                        <view class="red" v-if="item.price!=0 && (type == 2 || type == 0)"><text>乐享值：{{item.price}}点</text></view>
						<view class="red" v-if="item.bean!=0 && (type == 3 || type == 0)"><text>乐豆：{{item.bean}}个</text></view>
						<view class="red" v-if="item.bean_income!=0 && (type == 4 || type == 0)"><text>交易钱包：{{item.bean_income}}个</text></view>
						<view class="red">创建时间：{{item.change_date}}</view>
					</view>
					<view class="fd" v-else>
						<view class="price" v-if="item.point!=0 && (type == 1 || type == 0)"><text>乐券：{{item.point}}点</text></view>
                        <view class="price" v-if="item.price!=0 && (type == 2 || type == 0)"><text>乐享值：{{item.price}}点</text></view>
						<view class="price" v-if="item.bean!=0 && (type == 3 || type == 0)"><text>乐豆：{{item.bean}}个</text></view>
						<view class="price" v-if="item.bean_income!=0 && (type == 4 || type == 0)"><text>交易钱包：{{item.bean_income}}个</text></view>
						<view>创建时间：{{item.change_date}}</view>
					</view>
				</view>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
		</view>
		<tabbar :curpage="curpage"></tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
    import tabbar from "@/components/tabbar/taskfooter.vue";
	export default {
		data() {
			return {
				tabBars:['全部','收益详情','扣款详情'],
				status:0,
				active:0,
				size:10,
				page:1,
				type:0,
				tab:0
			}
		},
		components:{
			uniIcon,
			dscCommonNav,
			dscNotContent,
			tabbar
		},
		onLoad(e) {
			if(e.type != undefined){
				this.type = e.type
			}
			this.logList()
		},
		computed: {
			drpLogData:{
				get(){
					return this.$store.state.drp.drpLogData
				},
				set(val){
					this.$store.state.drp.drpLogData = val
				}
			}
		},
		methods: {
			toParticulars(id){
				
					uni.navigateTo({
						url:"./particulars?id="+id
					})
			},
			check(desc){
				if(desc.indexOf("乐享值不足") != -1){
					return true
				}else{
					return false
				}
			},
			changetab:function(i){
				this.tab = i
			},
			logList() {
				this.$store.dispatch('setDrpLog',{
					page: this.page,
					size: this.size,
					status: this.status,
					type: this.status,
					is_task:true,
					stype:this.type
				})
			},
			commonTabs(index) {
				this.active = index

				if(index == 0){
					this.status = 0
				}else if(index == 1){
					this.status = 1
				}else{
					this.status = 2
				}
				this.page = 1
				this.logList();
			}
		},
		onReachBottom(){
			this.page = this.page + 1
			if(this.page != 1){
				this.logList();
			}
		}
	}
</script>

<style scoped>
.section-list .list{ padding: 30upx 36upx; background-color: #FFFFFF; border-bottom: 2upx solid #e3e8ee; display: flex; flex-direction: column;}
.section-list .list .hd{ display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
.section-list .list .hd .left{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; }
.section-list .list .hd .left .price{ color: #F2031F; margin-right: 20upx; font-size: 40upx;}
.section-list .list .hd .left .price icon{ font-size: 25upx; }
.section-list .list .hd .left .log-tag{ display: flex; justify-content: center; align-items: center; border-radius: 50upx; padding: 0 20upx; border: 2upx solid #B78D5A; color: #B78D5A; font-size: 25upx;}
.section-list .list .hd .left .log-tag.active{ background: linear-gradient(118deg, #ecd8be, #dbb280); }
.section-list .list .hd .right{ font-size: 28upx; color: #666;}
.section-list .list .hd .red{ font-size: 28upx; color: #ff0000;}
.section-list .list .fd view{ font-size: 25upx; color: #999999;}
.section-list .list .fd .red{ font-size: 25upx; color: #ff0000;}


.secul{whdth:690upx;height:80upx;display: flex;justify-content: space-between;
	       text-align: center;margin-bottom:10rpx;
		   border:1px solid #f7f7f7;
		   position: fixed;
		   left: 0;
		   width: 100%;
		   overflow: hidden; 
		   box-sizing: border-box;
		   z-index: 998;
		   transition-property: all;
		   background:#f8f8f8;
 
		   }   
	.secli{width:50%;height:80rpx;line-height:80rpx;
		   color:#000000;border-right:1px solid #dadada;
		   
		   }		   
	.active{background-color:#ffffff;color:#aa0000}	
</style>
