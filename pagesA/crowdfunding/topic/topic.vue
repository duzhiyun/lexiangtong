<template>
    <viwe class="con crowd-topic">
        <viwe class="van-cell-group van-hairline-top-bottom">
			<viwe class="van-cell van-field">
				<viwe class="van-cell-value van-cell-value-alone">
					<viwe class="van-field-body">
						<textarea placeholder="填写话题内容 (0-140字)" name="message" v-model="message" rows="1" maxlength="140" @click="messageText" class="van-field-control" style="height: 48px;">
						</textarea>
					</viwe>
				</viwe>
			</viwe>
		</viwe>
        <viwe class="text-right f-04  bg-color-write num">
			 <viwe calss="span">{{remnant}}/140</viwe>
		</viwe> 
		<viwe class="padding-all dis-box footer-btn">
			<viwe class="box-flex li first-child">
				<viwe class="f-05 van-button van-button-default van-button-large button">
					<text class="van-button-text" @click="onClose">取消</text>
				</viwe>
			</viwe>
			<viwe class="box-flex li last-child">
				<viwe class="button br-5 f-05 van-button van-button-primary van-button-normal van-button-bottom-action">
					<text class="van-button-text" @click="onTopic">提交</text>
				</viwe>
			</viwe>
		</viwe>
    </viwe>
</template>
<script>
  
    export default {
        name: "drp-category",
        components: {
        },
        data() {
            return {
                routerName:'crowd_funding',
                message:'',
                remnant:140,
				id:0,
				topic_id:0,
            };
        },
        //初始化加载数据
        onLoad(e){
			this.id = e.id			
			this.topic_id = e.topic_id
        },
        methods: {
             messageText(){
                this.remnant = 140 - this.message.length;
            },
            onTopic(){
                if(this.message == ''){
					uni.showToast({
						title:'发布话题不能为空',
						icon:'none'
					})
                }else{
                    this.$store.dispatch('setCrowdfundingMyTopic',{
                        id:this.id,
                        topic_id:this.topic_id,
                        content:this.message
                    }).then(res=>{
						uni.showToast({
							title:'话题发布成功',
							icon:'none'
						})
                        uni.navigateTo({
							url:'/pagesA/crowdfunding/detail/detail?id='+this.id
						})
                    })
                }
            },
            onClose(){
                this.message = ''
            }
        }
    };
</script>

<style>
	.con {max-width: 640px;min-width: 320px;min-height: 100vh; margin-right: auto; margin-left: auto; overflow: hidden;}
	.van-cell-group {background-color: #fff;}
	.van-cell {padding: 13px 15px;}
	.van-cell {width: 100%;display: flex;line-height: 24px;position: relative;background-color: #fff; color: #333;font-size: 14px;overflow: hidden;}
	.van-field-body {display: flex;-webkit-box-align: center;align-items: center;}
	.crowd-topic .van-hairline-top-bottom .van-cell textarea {min-height: 80upx;}
	.van-field-control {border: 0; margin: 0;padding: 0; width: 100%; resize: none; display: block; box-sizing: border-box; background-color: transparent;}
	.crowd-topic .num {padding: 0 20upx 20upx; color: #ddd;}
	.f-04 {font-size: 28upx;}
	.text-right {text-align: right;}
	.bg-color-write {background: #fff;}
	.crowd-topic .num .span {margin-bottom: 4upx;display: block; padding: 0 0 10upx; border-bottom: 1px solid #eee;}
	.van-cell, .van-cell:not(:last-child):after {box-sizing: border-box;}
	.van-cell-value-alone {text-align: left;}
	.van-cell-value {overflow: hidden; position: relative; vertical-align: middle;}
	.van-cell-title, .van-cell-value {-webkit-box-flex: 1;flex: 1;}
	.padding-all {padding: 22upx;}
	.dis-box {display: -webkit-box;}	
	.crowd-topic .footer-btn .li.first-child {margin-right: 10upx;}
	.box-flex {-webkit-box-flex: 1;display: block!important;width: 100%;}
	.crowd-topic .footer-btn .li .button {height: 72upx;line-height: 74upx;}
	.f-05 {font-size: 30upx;}	
	.van-button-large {width: 100%;}
	.van-button-default {color: #333;background-color: #fff;border: 1px solid #eee;}	
	.van-button {position: relative;padding: 0;display: inline-block;border-radius: 2px;box-sizing: border-box;text-align: center;-webkit-appearance: none;}
	.f-05 {font-size: 30upx;}
	.crowd-topic .footer-btn .li.last-child {margin-right: 10upx;}
	.br-5 {border-radius: 5px!important;}
	.van-button-bottom-action.van-button-primary {background-color: #f92028;}
	.van-button-primary { background-color: #f92028; border-color: #f92028;}
	.van-button-bottom-action {width: 100%;border: 0; color: #fff;}
	
</style>
