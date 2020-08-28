<template>
    <view>
        <web-view :src="url" @message="handleMessage"></web-view>
    </view>
</template>

<script>
	import {Base64} from '@/common/base64'
	
    export default {
		data(){
			return{
				url:'',
				type:''
			}
		},
		onLoad(e){
			if(e.type){
				this.type = e.type;
			}

			if(this.$isLogin()){
				uni.request({
					url:this.websiteUrl + '/api/v4/user/ecjia-hash',
					method: 'POST',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data;
						let url = decodeURIComponent(e.url);
						if(data.status == 'success'){
							if(url.indexOf('?') > 0){
								this.url = url + '&ecjiahash=' + data.data;
							}else{
								this.url = url + '?ecjiahash=' + data.data;
							}
						}else{
							uni.showModal({
								content: "您的会员已失效，请重新登录！",
								confirmText:'去登陆',
								cancelText:'继续跳转',
								success:(res)=>{
									if(res.confirm){
										uni.reLaunch({
											url:'/pages/login/login?delta=index'
										})
									}else if(res.cancel){
										this.url = url;
									}
								},
								complete:()=>{
									this.$store.commit('toggleHrefType',false)
								}
							})
						}
					}
				})
			}else{
				this.url = decodeURIComponent(e.url);
			}
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'close'){
				var page = getCurrentPages().shift().route;
				uni.reLaunch({
					url:'/' + page
				});
			}
		},
		onBackPress(e){
			if(this.type == 'onback'){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			}
		},
		methods: {  
            handleMessage(evt) {
                console.log('接收到的消息：' + JSON.stringify(evt.detail.data));  
            }  
        },
		watch:{
			url(){
				this.$store.commit('toggleHrefType',false)
			}
		}
	}
</script>

<style>

</style>
