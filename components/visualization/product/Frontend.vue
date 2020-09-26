<template>
	<view>
	<view class="product-list" :class="aClass" v-if="module.isStyleSel == '0'">
		<view class="uni-product-list">
			<navigator :url="'/pages/goodsDetail/goodsDetail?id='+item.goods_id" class="uni-product" v-for="(item,index) in oProlist" :key="index">
				<view class="image-view">
					<image class="uni-product-image" :src="module.isSizeSel == '0' ? item.goods_img : item.goods_thumb" mode="widthFix"></image>
				</view>
				<view class="uni-product-info">
					<view class="uni-product-title">
						{{item.title || item.goods_name}}
						<text v-if="item.give_price" style="color:red;">【赠送{{item.give_price}}乐享值】</text>
					</view>
					<view class="uni-product-price">
						<text class="uni-product-price-original">{{item.shop_price_formated}} </text>
					</view>
					<view class="outer" v-if="bSale || bStock">
						<view class="left uni-ellipsis" v-show="bStock">
							<text class="sales-volume">库存:{{ item.stock || item.goods_number }}</text>
						</view>
						<view class="right" v-show="bSale" v-if="shopId == 0">
							<text class="sales-volume" v-if="item.sale != undefined">销量:{{ item.sale }}</text>
							<text class="sales-volume" v-else>销量:{{ item.sales_volume || 0 }}</text>
						</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
	<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0" v-else>
		<view class="scroll-view-item" v-for="(item,index) in oProlist" :key="index" @click="linkHref(item.goods_id)">
			<image :src="item.goods_thumb" mode="widthFix"></image>
			<text class="name uni-ellipsis" v-if="bTitle">{{item.title || item.goods_name}}</text>
			<view class="price uni-flex">
				<view class="price-original">{{ item.shop_price_formated }}</view>
				<view class="price-favour">{{ item.market_price_formated }}</view>
			</view>
		</view>
	</scroll-view>
	</view>
</template>

<script>
export default{
	props: ['module', 'preview','shopId'],
	data(){
		return {
			previewProlist: [
                {
                    title: '第一张图片',
                    sale: '0',
                    stock: '0',
                    price: '¥238.00',
                    marketPrice: '¥413.00'
                },
                {
                    title: '第二张图片',
                    sale: '0',
                    stock: '0',
                    price: '¥38.00',
                    marketPrice: '¥43.00'
                }
            ],
			prolist: [],
		}
	},
	mounted(){
		if (this.selectGoodsId.length > 0) {
			uni.request({
				url: this.websiteUrl + '/api/v4/visual/checked',
				method: 'POST',
				data: {
					number:this.selectGoodsId.length,
					goods_id:this.selectGoodsId.toString()
				},
				header: {
					'Content-Type': 'application/json',
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					this.prolist = res.data.data
				},
				fail: (err) => {
					console.error(err)
				}
			})
		}else{
			uni.request({
				url: this.websiteUrl + '/api/v4/visual/product',
				method: 'POST',
				data: {
					number: this.nNumber < 1 ? 1 : this.nNumber,
					type: this.moduleSel,
					ru_id: this.shopId,
					cat_id: this.catId,
					brand_id: this.brandSelect
				},
				header: {
					'Content-Type': 'application/json',
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					let data = res.data.data
					data && data.length > 0 ? (this.prolist = data) : (this.prolist = [])
				},
				fail: (err) => {
					console.error(err)
				}
			})
		}
	},
	methods: {
		linkHref(goods_id){
			uni.navigateTo({
				url:'/pages/goodsDetail/goodsDetail?id='+goods_id
			})
		}
	},
	computed: {
		selectGoodsId() {
            return this.module.allValue.selectGoodsId || []
        },
        brandSelect() {
            return this.module.allValue.brandSelect
        },
        catId() {
            let arr = [],
                len = 0
            this.module.allValue.categorySOption
                ? (arr = this.module.allValue.categorySOption.split(','))
                : (arr = [])
            len = arr.length
            return arr[len - 1]
        },
        oProlist() {
            if (this.preview && this.module.isStyleSel == '0') {
                return this.previewProlist
            } else {
                return this.prolist
            }
        },
        bPreview() {
            return this.preview
        },
        bStock() {
            return this.module.tagSelList.indexOf('0') != -1 ? true : false
        },
        bSale() {
            return this.module.tagSelList.indexOf('1') != -1 ? true : false
        },
        bTitle() {
            return this.module.tagSelList.indexOf('2') != -1 ? true : false
        },
        nNumber() {
            return this.module.allValue.number
        },
        moduleSel() {
            let sModulesSel = this.module.isModuleSel
            let sReturn = ''
            switch (sModulesSel) {
                case '0':
                    sReturn = 'best'
                    break
                case '1':
                    sReturn = 'new'
                    break
                case '2':
                    sReturn = 'hot'
                    break
                case '3':
                    sReturn = ''
                    break
                default:
                    sReturn = ''
                    break
            }
            return sReturn
        },
        aClass() {
            let sSizeSel = this.module.isSizeSel,
                arr = []
            if (this.preview) arr.push('preview')
            switch (sSizeSel) {
                case '0':
                    arr.push('product-list-big')
                    break
                case '2':
                    arr.push('product-list-medium')
                    break
                default:
                    break
            }
            return arr
        },
	}
}
</script>

<style scoped>
.product-list{ padding: 0 18upx 18upx 18upx !important;}
.product-list .outer{ display: flex; flex-direction: row; justify-content: space-between;}
.product-list .outer .left{ width: auto; }
.product-list .outer .sales-volume{ font-size: 25upx; color: #999;}

.product-list-big .uni-product-list{ flex-direction: column;}
.product-list-big .uni-product-list .image-view,
.product-list-big .uni-product-list .uni-product-info{ width:100%; height: auto; }
</style>
