import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
injectTapEventPlugin();
import IScroll from 'iscroll';
import './assets/css/index.css';

import ZmitiLoadingApp from './loading/index.jsx';
import ZmitiIndexApp from './index/index.jsx';
import ZmitiContentApp from './content/index.jsx';
import ZmitiResultApp from './result/index.jsx';

import Obserable from './components/public/obserable';
var obserable = new Obserable();

export class App extends Component {
	constructor(props) {
		super(props);


		this.state = {
			progress:'0%',
			loadingImg:[],
			showLoading:true,
			name:'',
			tel:'',
			arr : ["A",'B','C',"D","E","F","G","H","I","J"],
			score:0,
			myAnswer:[]
			
		}
		this.viewW = document.documentElement.clientWidth;
		this.viewH = document.documentElement.clientHeight;
	}
	render() {
		
		var mainStyle={};
		if(this.state.indexBg){
			mainStyle.background = 'url('+this.state.indexBg+') no-repeat center / cover'
		}

		var data ={
			obserable,
			IScroll,
			theme:this.state.theme,
			title:this.state.title,
			duration:this.state.duration,
			totalDuration:this.state.totalDuration,
			question:this.state.question,
			myAnswer:this.state.myAnswer,
			arr:this.state.arr
		}

		return (
			<div className='zmiti-main-ui' style={mainStyle}>
				{this.state.showLoading && <ZmitiLoadingApp progress={this.state.progress}></ZmitiLoadingApp>}
				{!this.state.showLoading && <ZmitiIndexApp {...data}></ZmitiIndexApp>}
				{!this.state.showLoading && <ZmitiContentApp {...data}></ZmitiContentApp>}
				{!this.state.showLoading && <ZmitiResultApp {...data}></ZmitiResultApp>}
			</div>
		);
	}

	submit(){
		this.setState({
			submit:true
		});

		setTimeout(()=>{
			this.setState({
				submit:false
			});			
		},100);
	}

	beginTest(){

		this.setState({
			tap:true
		});

		setTimeout(()=>{
			this.setState({
				tap:false,
				showForm:true,
			});

		},100);

	}


	getPos(nickname,headimgurl){
	    	var s = this;
	    	 $.ajax({
	        	url:`http://restapi.amap.com/v3/geocode/regeo?key=10df4af5d9266f83b404c007534f0001&location=${wx.posData.longitude},${wx.posData.latitude}&poitype=&radius=100&extensions=base&batch=false&roadlevel=1`+'',
				type:'get',
				error(){

				},
				success(data){
					if(data.status === '1' && data.infocode === '10000'){
						
						var addressComponent = data.regeocode.addressComponent;
						var opt = {
					   		type:'map',
					   		address:(addressComponent.city[0]||addressComponent.province)+addressComponent.district,
					   		pos:[wx.posData.longitude,wx.posData.latitude],
					   		nickname:nickname,
					   		headimgurl:headimgurl
					   	}

					   	s.setState({
					   		nickname,
					   		headimgurl,
					   		showUI:true,
					   		latitude:wx.posData.latitude,
					   		longitude:wx.posData.longitude,
					   		usercity:(addressComponent.city[0]||addressComponent.province)+addressComponent.district
					   	});
					   	$.ajax({
							url:'http://api.zmiti.com/v2/weixin/save_userview/',
							type:'post',
							data:{
								worksid:s.worksid,
								wxopenid:s.openid,
								wxname:nickname,
								usercity:opt.address,
								longitude:wx.posData.longitude,
								latitude:wx.posData.latitude
							}
						}).done((data)=>{
							if(data.getret === 0 ){
								
							}else{
								alert('save_userview getret : '+ data.getret +' msg : '+ data.getmsg)
							}
						},()=>{
							//alert('save_userview error');
						})

					   	$.ajax({
					   		url:'http://api.zmiti.com/v2/weixin/add_wxuser/',
					   		type:'post',
					   		data:{
					   			wxopenid:s.openid,
					   			worksid:s.worksid,
					   			nickname:nickname,
					   			headimgurl:headimgurl,
					   			longitude:wx.posData.longitude,
					   			latitude:wx.posData.latitude,
					   			accuracy:wx.posData.accuracy,
					   			wxappid:s.wxappid,
					   			integral:localStorage.getItem('nickname')?0:10
					   		},
					   		error(){
					   			alert('add_wxuser: 服务器返回错误');
					   		},
					   		success(data){
					   			if(data.getret === 0){
					   				
					   				$.ajax({
										url:'http://api.zmiti.com/v2/weixin/get_wxuserdetaile',
										data:{
											wxopenid:s.openid
										},
										success(data){
											if(data.getret === 0){
												
												s.score = data.wxuserinfo.totalintegral;
												s.setState({
													score:s.score
												});
											}else{
												alert('get_wxuserdetaile : getret  : '+ data.getret + ' msg : ' + data.getmsg);	
											}
										}
									})

					   			}else{
					   				alert('getret  : '+ data.getret + ' msg : ' + data.getmsg+ ' .....');
					   			}
					   		}
					   	});

					   	//获取用户积分
						//
				   		$.ajax({
							url:'http://api.zmiti.com/v2/msg/send_msg/',
							data:{
								type:s.worksid,
								content:JSON.stringify(opt),
								to:opt.to||''
							},
							success(data){
								s.state.showUI = true;
								s.forceUpdate();
								//console.log(data);
							}
						})
					}
					else{
						alert('地址信息获取失败')
					}
				}						        	
	        })
    }

	wxConfig(title,desc,img,appId='wxfacf4a639d9e3bcc',worksid){
		   var durl = location.href.split('#')[0]; //window.location;
		        var code_durl = encodeURIComponent(durl);


		        var s = this;

			$.ajax({
				type:'get',
				url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl="+code_durl,
				dataType:'jsonp',
				jsonp: "callback",
			    jsonpCallback: "jsonFlickrFeed",
			    error(){
			    },
			    success(data){
			    	wx.config({
							    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							    appId:appId, // 必填，公众号的唯一标识
							    timestamp:'1488558145' , // 必填，生成签名的时间戳
							    nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
							    signature: data.signature,// 必填，签名，见附录1
							    jsApiList: [ 'checkJsApi',
											  'onMenuShareTimeline',
											  'onMenuShareAppMessage',
											  'onMenuShareQQ',
											  'onMenuShareWeibo',
											  'hideMenuItems',
											  'showMenuItems',
											  'hideAllNonBaseMenuItem',
											  'showAllNonBaseMenuItem'
									] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
							});

			    	wx.ready(()=>{

			    		wx.getLocation({
						    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						    fail(){
						    },
						    success: function (res) {
						        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						        var speed = res.speed; // 速度，以米/每秒计
						        var accuracy = res.accuracy; // 位置精度

						        wx.posData = {
						        	longitude,
						        	latitude,
						        	accuracy
						        };

						        if((s.nickname || s.headimgurl) && s.openid){
						        	//s.getPos(s.nickname,s.headimgurl);
						        }
						       
						    }
						});

			    			 		//朋友圈
	                    wx.onMenuShareTimeline({
	                        title: title, // 分享标题
	                        link: durl, // 分享链接
	                        imgUrl: img, // 分享图标
	                        desc: desc,
	                        success: function () { },
	                        cancel: function () { }
	                    });
	                    //朋友
	                    wx.onMenuShareAppMessage({
	                        title: title, // 分享标题
	                        link: durl, // 分享链接
	                        imgUrl: img, // 分享图标
	                        type: "link",
	                        dataUrl: "",
	                        desc: desc,
	                        success: function () {
	                        },
	                        cancel: function () { 
	                        }
	                    });
	                    //qq
	                    wx.onMenuShareQQ({
	                        title: title, // 分享标题
	                        link: durl, // 分享链接
	                        imgUrl: img, // 分享图标
	                        desc: desc,
	                        success: function () { },
	                        cancel: function () { }
	                    });
			    	});
			    }
			});
		
	}
 
	 

	componentDidMount() {

		 
		
		var s = this;
		$.getJSON('./assets/js/data.json',(data)=>{
			s.loading(data.loadingImg,(scale)=>{
				s.setState({
					progress:(scale*100|0)+'%'
				})
			},()=>{
				s.setState({
					showLoading:false
				});

			});


			this.state.indexBg = data.indexBg;
			this.state.title = data.title;
			this.state.theme = data.theme;
			this.state.duration = data.duration;
			this.state.totalDuration = data.duration;
			this.state.question = data.question;
			this.wxConfig(data.shareTitle,data.shareDesc,data.shareImg);
			this.forceUpdate(()=>{
				obserable.trigger({
					type:'setQuestionScroll'
				});
				
			});

			obserable.on('fillAnswer',(data)=>{
				this.state.myAnswer.push(data);
				this.forceUpdate();
			});

			window.s = this;

			obserable.on('countdown',()=>{

				this.timer = setInterval(()=>{
					if(this.state.duration <=0){
						clearInterval(this.timer);
						obserable.trigger({type:'submitPaper'})
					}
					this.setState({
						duration:this.state.duration - 1
					});

				},1000);
			});

			obserable.on('clearCountdown',()=>{
				clearInterval(this.timer);
			});



			obserable.on('clearMyAnswer',(data)=>{
				this.state.myAnswer.length = 0;
				this.forceUpdate();
			});
			
			/*$.ajax({
				url:'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
				data:{
					code:s.getQueryString('code'),
					wxappid:data.wxappid,
					wxappsecret:data.wxappsecret
				},
				error(e){
				},
				success(dt){
					 
					if(dt.getret === 0){
						s.setState({
							showLoading:true
						});
						s.loading(data.loadingImg,(scale)=>{
							s.setState({
								progress:(scale*100|0)+'%'
							})
						},()=>{
							s.setState({
								showLoading:false
							});
							
							s.defaultName = dt.userinfo.nickname || data.username || '智媒体';

							localStorage.setItem('nickname',dt.userinfo.nickname );
							localStorage.setItem('headimgurl',dt.userinfo.headimgurl);
							s.openid = dt.userinfo.openid;
							s.nickname = dt.userinfo.nickname;
							s.headimgurl = dt.userinfo.headimgurl;
						

							if (wx.posData && wx.posData.longitude) {
								s.getPos(dt.userinfo.nickname, dt.userinfo.headimgurl);
							}

						
							s.state.myHeadImg = dt.userinfo.headimgurl
							s.forceUpdate();

						});
						
					}
					else{

						
						s.setState({
							showLoading:true
						});

						if(s.isWeiXin() ){

							if(localStorage.getItem('oauthurl'+s.worksid)){
								window.location.href = localStorage.getItem('oauthurl'+s.worksid);
								return;
							}

							$.ajax({
								url:'http://api.zmiti.com/v2/weixin/getoauthurl/',
								type:'post',
								data:{
									redirect_uri:window.location.href.replace(/code/ig,'zmiti'),
									scope:'snsapi_userinfo',
									worksid:s.worksid,
									state:new Date().getTime()+''
								},
								error(){
								},
								success(dt){
									if(dt.getret === 0){
										localStorage.setItem('oauthurl'+s.worksid,dt.url);
										window.location.href =  dt.url;
									}
								}
							})
						}
						else{

							s.loading(data.loadingImg,(scale)=>{
								s.setState({
									progress:(scale*100|0)+'%'
								})
							},()=>{
								s.setState({
									showLoading:false
								});

								$.ajax({
									url:'http://api.zmiti.com/v2/works/update_pvnum/',
									data:{
										worksid:s.worksid
									},
									success(data){
										if(data.getret === 0){
											console.log(data);
										}
									}
								});


								s.defaultName =  data.username || '智媒体';
							
								
								s.forceUpdate();

						});


						 
						}

					}


				}
			});


			this.defaultName = data.username;
		

			s.defaultName = localStorage.getItem('nickname') || data.username || '智媒体';
		

			s.headimgurl = localStorage.getItem('headimgurl');
		
			s.forceUpdate();*/
			

			
		});



		$(document).one('touchstart',()=>{
			/*this.refs['talkAudio'].pause();
			this.refs['talkAudio'].muted = true;
			this.refs['talkAudio'].play();
			setTimeout(()=>{
				this.refs['talkAudio'].muted = false;
			},500);
			if(this.refs['audio'] && this.refs['audio'].paused){
				this.refs['audio'].play();
			};*/
		})
		
	}

	loading(arr, fn, fnEnd){
        var len = arr.length;
        var count = 0;
        var i = 0;
        
        function loadimg() {
            if (i === len) {
                return;
            }
            var img = new Image();
            img.onload = img.onerror = function(){
                count++;
                if (i < len - 1) {
                    i++;
                    loadimg();
                    fn && fn(i / (len - 1), img.src);
                } else {
                    fnEnd && fnEnd(img.src);
                }
            };
            img.src = arr[i];
        }
       loadimg();
    }

	isWeiXin(){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        return true;
	    }else{
	        return false;
	    }
    }

    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

	componentWillMount() {
		var s = this;

	}

	clearRender(){
		clearInterval(this.talkTimer);
	}

	 
}

	ReactDOM.render(<App></App>,document.getElementById('fly-main-ui'));
	

