<template>
    <view class="page">
        <view class="content">
            <view class="capital-list" v-if="list.length">
                <view class="capital-item" v-for="(item,index) in list">
                    <view class="item-left">
                        <text class="time-msg">{{item.explain}}</text>
                        <text class="time">{{timestampFormat(item.create_time + '')}}</text>
                    </view>
                    <view class="item-right">
                        <text class="add-money" :style="{color:item.record_type == 0 ? '#e6b141' : 'black'}">{{item.record_type == 0 ? -item.money : '+'+item.money}}</text>
                        <text class="yue">
                            <text style="margin-right: 8rpx;">余额</text>
                            {{item.user_money}}
                        </text>
                    </view>
                </view>
                <uni-load-more :status="status"></uni-load-more>
            </view>
        </view>
    </view>
</template>

<script>
    import uniLoadMore from "../../../components/uni-ui/uni-load-more/uni-load-more.vue";
    import _get from '../../../common/_get';
    import _action from '../../../common/_action';
    import _hook from '../../../common/_hook';

    export default {
        computed: {
            status() {
                return this.pullUp == 0 ? 'more' : (this.pullUp == 1 ? 'loading' : '')
            },
        },
        data() {
            return {
                pullUp: 0, //0加载更多 1 加载中 -1 加载完成
                page: 1,
                totallPage: 1,
                list: [
                ]
            }
        },
        onShow(){
            _hook.routeSonHook();
          this.getCapital('down');
        },
        components: {
            uniLoadMore
        },
        onReachBottom() {
            let _this = this;
            if (_this.pullUp == 0) {
                _this.page++;
                _this.pullUp = 1;
                this.getCapital('up');
            }
        },
        onPullDownRefresh() {
            this.pullUp = 0; //重置下拉
            this.page = 1;
            uni.startPullDownRefresh();
            this.getCapital('down',function () {
                uni.stopPullDownRefresh();
            });
        },
        methods: {
            getCapital(type,cb) {
                let _this = this;
                _get.getUserCapitalList({page: this.page}, function (res) {
                    _this.totallPage = res.last_page;
                    if(type == 'down'){
                        _this.list = res.data;
                        if(cb != undefined)cb();
                    }else {
                        if(_this.page > _this.totallPage){
                            _this.pullUp = -1;
                        }else {
                            _this.list = _this.list.concat(res.data)
                            _this.pullUp = 0;
                        }
                    }
                })
            },
            timestampFormat(time) {
                return _action.timestampFormat(time);
            },

        }
    }
</script>

<style>
    /*757575*/
    page {
        background-color: white;
    }

    .item-left, .item-right {
        padding-bottom: 25upx;
        padding-top: 30upx;
    }

    .time, .yue {
        color: #757575;
    }

    .content .capital-list {
        display: flex;
        flex-direction: column;
        padding: 0upx 0upx 120upx 40upx;
    }

    .capital-list .capital-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
    }

    .item-right .add-money {
        margin-bottom: 15upx;
        font-size: 14px;
        font-weight: 500;
    }
    .sub-mone{
        margin-bottom: 15upx;
        font-size: 14px;
        font-weight: 500;
        color: #e6b141;
    }
    .item-left .time-msg {
        margin-bottom: 15upx;
        font-size: 14px;
        font-weight: 400;
    }

    .capital-list .capital-item .item-left {
        display: flex;
        flex-direction: column;
    }

    .capital-list .capital-item .item-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-right: 40upx;
    }
</style>
