<template>
	<view class="nav" :class="aClass">
		<view class="list" v-for="(item,index) in module.list" :key="index" @click="$outerHref(
		item.appPage ? item.appPage : item.url,
		item.appPage ? 'app' : 'undefined'
		)" :style="{width:liStyle}">
			<view class="icon" v-if="bIcon && item.img"><image :src="item.img" mode="widthFix" class="image"></image></view>
			<view class="icon" v-if="bIcon && !item.img"><image src="../../../static/default-img.jpg" mode="widthFix" class="image"></image></view>
			<view class="con uni-ellipsis" v-if="bDesc">
				<block v-if="item.desc">{{ item.desc }}</block>
				<block v-else>[描述]</block>
			</view>
			<uni-icon type="arrowright" size="20" v-if="showStyle == '0'"></uni-icon>
		</view>
	</view>
</template>

<script>
import uniIcon from '@/components/uni-icon.vue'
export default{
	props: ['module', 'preview'],
	data(){
		return {}
	},
	components:{
		uniIcon
	},
	computed: {
        liStyle() {
            if (this.showStyle == 0) return false
            let nWidth = 100 / this.showNumber
			
            return nWidth + "%"
        },
        bIcon() {
            return this.module.isIconSel == "0" ? true : false
        },
        bDesc() {
            if (this.showStyle == "1") {
                return this.module.isDescSel == "0" ? true : false
            } else {
                return true
            }
        },
        listStyle() {
            return this.showStyle == "0" ? "list-style1" : "list-style2"
        },
        showStyle() {
            return this.module.isStyleSel
        },
        showNumber() {
            return this.module.isNumberSel
        },
        aClass() {
            let arr = []
            arr.push(this.listStyle)
            if (this.listStyle == "list-style2") {
                this.module.styleSelList.map((v, i) => {
                    switch (v) {
                        case "0":
                            arr.push("whole-margin")
                            break;
                        case "1":
                            arr.push("all-padding")
                            break;
                        case "2":
                            arr.push("all-border")
                            break;
                        default:
                            break;
                    }
                })
            }
            return arr
        }
    }
}
</script>


<style>
.nav{ overflow: hidden; background-color:#ffffff}
.nav .list{ overflow: hidden; box-sizing: content-box; position: relative; }
.nav .list .icon{ width: 100%; }
.nav .list .icon image{ width: 65%; height: auto; margin: 0 auto; display: block;border-radius:50upx }
.nav .list .con{ font-size: 25upx; margin-top: 10upx;color:#000000;}

.list-style1{ padding: 0 20upx; }
.list-style1 .list{ border-bottom: 1px solid #e3e8ee; height: 120upx; display: flex; flex-direction: row; justify-content: center; align-items: center;}
.list-style1 .list .icon{ width: 100upx; height: 100upx; margin-right: 10upx;}
.list-style1 .list .con{ flex: 1 1 0%; margin-top: 0; font-size: 30upx;}
.list-style1 .list .uni-icon{ width: 40upx;}

.list-style2 .list{ width: 20%; float: left; text-align: center; overflow: hidden;}
.list-style2 .list .uni-icon{ display: none;}
.list-style2 .list .uni-icon image{ border-radius: 60upx;}
.list-style2.whole-margin{ padding: 20upx 0;}
.list-style2.all-padding .list{ box-sizing: border-box; padding: 10upx; }
.list-style2.all-border .list{ box-sizing: border-box; margin-bottom: -1px; border: 1px solid #e7ecec; border-right: 0;}
</style>
