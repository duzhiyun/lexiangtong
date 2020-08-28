<template>
	<view class="page-section-seckill" v-if="productList && productList.length>0">
		<view class="seckill-section">
			<view class="header uni-flex">
				<view class="right uni-flex">
					<text class="h3">限时秒杀</text>
					<view class="data">
						<uni-countdown fontColor="#FFFFFF" bgrColor="#000000" :timer="timer" v-if="timer"></uni-countdown>
					</view>
				</view>
				<view class="more-link">
					<view class="txt" @click="moreLink">更多</view>
					<uni-icon type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="content">
				<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0">
					<view class="scroll-view-item" v-for="(item,index) in productList" :key="index" @click="linkHref(item.id)">
						<image :src="item.goods_thumb" mode="widthFix"></image>
						<text class="name uni-ellipsis">{{ item.title }}</text>
						<view class="price uni-flex">
							<view class="price-original">{{ item.price_formated }}</view>
							<view class="price-favour">{{ item.market_price_formated }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcon from '@/components/uni-icon.vue'
import uniCountdown from "@/components/uni-countdown.vue"
export default{
	props: ['module', 'preview'],
	data(){
		return {
			timer: '',
			endTime:'',
			productList: [],
			type:0
		}
	},
	components:{
		uniIcon,
		uniCountdown
	},
	created() {
		uni.request({
			url: this.websiteUrl + '/api/v4/visual/seckill',
			method: 'POST',
			data: {
				num: this.nNumber
			},
			header: {
				'Content-Type': 'application/json',
				'X-Client-Hash':uni.getStorageSync('client_hash')
			},
			success: (res) => {
				let data = res.data.data
				
				if(data.type){
					data.type == 0 ? this.endTime = data.begin_time : this.endTime = data.end_time
					if (data.goods) this.productList = data.goods
					this.type = data.type
				}else{
					this.type = 0
				}
				
				this.timer = this.formatDateTime(this.endTime * 1000);
			},
			fail: (err) => {
				console.error(err)
			}
		})
    },
	computed:{
		nNumber() {
            return this.module.allValue.number
        }
	},
	methods:{
		formatDateTime(inputTime) { //时间戳 转 YY-mm-dd HH:ii:ss
			var date = new Date(inputTime);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		},
		moreLink(){
			uni.navigateTo({
				url:'/pagesA/seckill/seckill'
			})
		},
		linkHref(id){
			uni.navigateTo({
				url:'/pagesA/seckill/detail/detail?id='+id+'&tomorrow=0'
			})
		}
	}
}
</script>

<style>
.page-section-seckill{ margin: 0 0 15upx; padding: 0 20upx 0 30upx; background: #FFFFFF;}
.seckill-section{ overflow: hidden;}
.seckill-section .header{ justify-content: space-between; padding: 20upx 0;}
.seckill-section .header .right{ align-items: center; }
.seckill-section .header .h3{ font-size: 36upx; color: #000000; margin-right: 20upx;}
.seckill-section .header .data{  }
.uni-countdown{ display: flex; flex-wrap: nowrap;}
</style>
