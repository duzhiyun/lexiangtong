import share from "@/common/share.js";

export default {
	computed:{
		host(){
			return this.$websiteUrl
		}
	},
    methods: {
		/**
         * 修改list或allValuevalue值
         * @param {*} o
         */
        updateText(o) {
            this.$store.dispatch('updateText', o)
        },
		 /**
         * 修改list或allValuevalue值
         * @param {*} o
         */
        updateConText(sName, sValue) {
            let o = {
                attrName: sName,
                newValue: sValue
            }
			this.updateText(o)
        },
		/**
         * 前台组件获取属性值，如果为空返回返回defaultValue
         * @param {*} o 
         */
        getText(o) {
            let inputValue = "";
            if(o.listIndex == undefined){
                inputValue = this.module[o.dataNext][o.attrName]
            }else{
                inputValue = this.module.list[o.listIndex][o.attrName]
            }
            return inputValue == "" || inputValue == "undefined" ? o.defaultValue : inputValue
        },
        //客服
        onChat(goods_id,shop_id){
			if(this.$isLogin()){
				this.$store.dispatch('setChat',{
					goods_id:goods_id,
					shop_id:shop_id ? shop_id : 0,
					//type:'app'
				}).then((res)=>{
					if(res.status == 'success'){
						// uni.navigateTo({							
						// 	url:"/pages/kefu/kefu?shop_id=" + res.data.ru_id + '&goods_id=' + res.data.goods_id + '&token='+ res.data.token
						// })
						let url = res.data.url;
						let reg = RegExp(/wpa.qq.com/);
						let isUrl = reg.test(url); //判断是否是qq客服
						let platform = uni.getSystemInfoSync().platform;
						
						if(isUrl && platform == 'ios'){
							let index1 = url.indexOf("&uin="); //截取字符串位置1
							let index2 = url.indexOf("&site="); //截取字符串位置2
							let qq = url.substring((index1+5),index2); //客服qq号
							
							plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin='+ qq +'&version=1&src_type=web');
						}else{
							this.$outerHref(url);
						}
					}else{
						uni.showToast({
							title:res.errors.message,
							icon:'none'
						})
					}
				})
			}else{
				uni.showModal({
					content:'请登录会员！',
					success:(res)=>{
						if(res.confirm){
							uni.navigateTo({
								url:'/pages/login/login?delta=1'
							})
						}
					}
				})
			}
        },
		shareInfo(info){
			console.log(JSON.stringify(info))
			let shareInfo = info
			
			let shareList=[
				{
					icon:"/static/sharemenu/wx.png",
					text:"微信好友",
				},
				{
					icon:"/static/sharemenu/pyq.png",
					text:"朋友圈"
				},
				// {
				// 	icon:"/static/sharemenu/qq.png",
				// 	text:"QQ"
				// },
				{
					icon:"/static/sharemenu/copy.png",
					text:"复制"
				},
				{
					icon:"/static/sharemenu/more.png",
					text:"更多"
				},
			];
			
			uni.getProvider({
				service:'share',
				success: (res) => {
					this.shareObj = share(shareInfo,shareList,function(index){
						let shareObj={
							href:shareInfo.href||"",
							title:shareInfo.title||"",
							summary:shareInfo.summary||"",
							imageUrl:shareInfo.imageUrl||"",
							success:(res)=>{
								console.log("success:" + JSON.stringify(res));
							},
							fail:(err)=>{
								console.log("fail:" + JSON.stringify(err));
								// uni.showToast({
								// 	icon:'none',
								// 	title: JSON.stringify(err.errMsg)
								// })
							}
						};
						switch (index) {
							case 0:
								shareObj.provider="weixin";
								shareObj.scene="WXSceneSession";
								shareObj.type=0;
								shareObj.imageUrl=shareInfo.imageUrl||"";
								uni.share(shareObj);
								break;
							case 1:
								shareObj.provider="weixin";
								shareObj.scene="WXSenceTimeline";
								shareObj.type=0;
								shareObj.imageUrl=shareInfo.imageUrl||"";
								uni.share(shareObj);
								break;
							// case 2:
							// 	shareObj.provider="qq";
							// 	shareObj.type=1;
							// 	shareObj.imageUrl=shareInfo.imageUrl||"";
							// 	uni.share(shareObj);
							// 	break;
							case 2:
								uni.setClipboardData({
									data:shareInfo.href,
									complete() {
										uni.showToast({
											title: "已复制到剪贴板"
										})
									}
								})
								break;
							case 3:
								plus.share.sendWithSystem({
									type:"web",
									title:shareInfo.title||"",
									thumbs:[shareInfo.imageUrl||""],
									href:shareInfo.href||"",
									content: shareInfo.summary||"",
								})
								break;
						};
					})
					
					this.$nextTick(()=>{
						this.shareObj.alphaBg.show();
						this.shareObj.shareMenu.show();
					})
				}
			})
		},
    },
}