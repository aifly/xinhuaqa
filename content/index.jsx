import React, { Component } from 'react';
import {PubCom} from '../components/public/pub.jsx';
import './assets/css/index.css';
import $ from 'jquery';

import ZmitiClockApp from '../components/clock/index.jsx';
import ZmitiToastApp from '../components/toast/index.jsx';
import ZmitiKeyboardApp from '../components/keyboard/index.jsx';

class ZmitiContentApp extends Component {
	constructor(props) {
		super(props);
		this.state={
			toast:'',
			username:'',
			tel:'',
			currentQid:0,
			score:0,
			currentAnswer:[]
		};
		this.viewW = document.documentElement.clientWidth;
		this.viewH = document.documentElement.clientHeight;


		this.zmitiMap =[
				{"name":"北京市", "log":"116.46", "lat":"39.92"},
				{"name":"上海市", "log":"121.48", "lat":"31.22"},
				{"name":"天津市", "log":"117.2", "lat":"39.13"},
				{"name":"重庆市", "log":"106.54", "lat":"29.59"},
				{"name":"石家庄", "log":"114.48", "lat":"38.03"},
				{"name":"太原市", "log":"112.53", "lat":"37.87"},
				{"name":"沈阳市", "log":"123.38", "lat":"41.8"},
				{"name":"长春市", "log":"125.35", "lat":"43.88"},
				{"name":"哈尔滨市", "log":"126.63", "lat":"45.75"},
				{"name":"杭州市", "log":"120.19", "lat":"30.26"},
				{"name":"福州市", "log":"119.3", "lat":"26.08"},
				{"name":"济南市", "log":"106.54", "lat":"29.59"},
				{"name":"郑州市", "log":"113.65", "lat":"34.76"},
				{"name":"武汉市", "log":"114.31", "lat":"30.52"},
				{"name":"长沙市", "log":"113", "lat":"28.21"},
				{"name":"广州市", "log":"113.23", "lat":"23.16"},
				{"name":"海口市", "log":"110.35", "lat":"20.02"},
				{"name":"成都市", "log":"104.06", "lat":"30.67"},
				{"name":"贵阳市", "log":"106.71", "lat":"26.57"},
				{"name":"昆明市", "log":"102.73", "lat":"25.04"},
				{"name":"南昌市", "log":"115.89", "lat":"28.68"},
				{"name":"西安市", "log":"108.95", "lat":"34.27"},
				{"name":"西宁市", "log":"101.74", "lat":"36.56"},
				{"name":"兰州市", "log":"103.73", "lat":"36.03"},
				{"name":"南宁市", "log":"106.54", "lat":"29.59"},
				{"name":"乌鲁木齐市", "log":"87.68", "lat":"43.77"},
				{"name":"呼和浩特市", "log":"111.65", "lat":"40.82"},
				{"name":"拉萨市", "log":"91.11", "lat":"29.97"},
				{"name":"银川市", "log":"106.27", "lat":"38.47"},
				{"name":"台北市", "log":"121.5", "lat":"25.14"},
				{"name":"香港", "log":"114.17", "lat":"22.27"},
				{"name":"澳门", "log":"113.33", "lat":"22.13"},
				{"name":"合肥市", "log":"117.27", "lat":"31.86"},
				{"name":"南京市", "log":"118.78", "lat":"32.04"}
		]
	}

	render() {

		var component = null;
		switch(this.props.theme){
			case "PAPER":
			break;
			case "DANGJIAN":
			var mainStyle = {
					background:"#fff url(./assets/images/bg.png) no-repeat center center / cover "
				}
			component = <div className='zmiti-dangjian-content-C lt-full' style={mainStyle} onTouchStart={this.contentTap.bind(this)}>
				<section className={'zmiti-dangjian-content-user lt-full '+(this.state.hideUser?'hide':'')} >
					<div className='zmiti-dangjian-content-cover'>
						<section className='zmiti-dangjian-content-form'>
							<div className='zmiti-dangjian-content-input'><label>姓名：</label><input ref='input' value={this.state.username} onChange={(e)=>{this.setState({username:e.target.value})}} placeholder='请输入姓名' type='text'/></div>
							<div className='zmiti-dangjian-content-input'><label>手机号：</label><div className='zmiti-dangjian-tel-input' value={this.state.tel} style={{paddingLeft: 110}}  onTouchStart={()=>{this.refs['input'].blur();this.setState({showKeyboard:true})}}>{this.state.tel||'请输入手机号'}</div></div>
							<div className='zmiti-dangjian-clock'><ZmitiClockApp></ZmitiClockApp></div>
							<div className='zmiti-dangjian-all-duration'>请在{(this.props.duration/60|0)+'分钟'+(this.props.duration%60>0 ? (this.props.duration%60|0)+'秒':'')}内完成测试</div>
							
							
						</section>
					</div>
					<div onTouchTap={this.beginAnswer.bind(this)} className={'zmiti-btn zmiti-begin-answer-btn '+(this.state.username.length>0 && this.state.tel.length>0?'active':'') +  (this.state.beginTap?' tap':'')  }>
						开始答题
					</div>
				</section>

				<section className={'zmiti-dangjian-question-C  lt-full' +(this.state.showQList?' active':'')+(this.state.hideList?' hide':'')} style={mainStyle}>
					<header>
						<aside>
							<span>姓名：{this.state.username}</span>
						</aside>
						<aside>
							<div className='zmiti-dangjian-clock-sm'><ZmitiClockApp animate={true} size={30}></ZmitiClockApp></div>
							<div>剩余时间：<span>{this.props.duration/60<10?'0'+(this.props.duration/60|0):this.props.duration/60|0}:{this.props.duration % 60<10?'0'+this.props.duration % 60:this.props.duration % 60}</span></div>
						</aside>
					</header>
					<svg  width="100%" height="23px" version="1.1"
							xmlns="http://www.w3.org/2000/svg">
						<path strokeDasharray="10,6" d="M0 2 L640 2" stroke='#ccc' strokeWidth={3} >
						</path>
					</svg>
					{this.props.question.map((question,q)=>{
						var className = '';
						if(this.state.currentQid > q ){
							className = 'left';
						}else if(this.state.currentQid === q){
							className = 'active';
						}else{
							className = 'right';
						}
						var scrollStyle ={
							height:this.viewH - 78,
							background:"#fff url(./assets/images/bg.png) no-repeat center center / cover "

						}

						return	<section className={'zmiti-dangjian-q-scroll '+ className} ref={'zmiti-dangjian-q-scroll'+q} key={q} style={scrollStyle}>
									<section style={{paddingBottom:60}}>
										<div className='zmiti-dangjian-q-title'>
											{question.isMultiselect && <span> * 此题为多选题 </span>}
											<article>
												{question.img && <img src={question.img}/>}	
												<div>{question.title}</div>
											</article>
											<div className='zmiti-dangjian-pager'>
												<span>{this.state.currentQid+1}</span>
												<span>{this.props.question.length}</span>
											</div>
										</div>
										<div className='zmiti-dangjian-q-answer-list'>
											{question.answer.map((item,i)=>{
												return <div 
														onTouchTap={this.chooseMyAnswer.bind(this,i)} key={i} 
														className={'zmiti-dangjian-q-item '+(this.state.currentAnswer[question.isMultiselect?i:0] === i ? 'active':'')}>
														{this.props.arr[i]+"、"+item.content}
													</div>
											})}

											{this.props.myAnswer.length>=this.props.question.length-1 && <div onTouchTap={this.submitPaper.bind(this)} className={'zmiti-dangjian-submit-btn ' + (this.state.submit?'active':'')}>提交答卷</div>}
											{this.props.myAnswer.length<this.props.question.length-1 && <div onTouchTap={this.doNext.bind(this)} className={'zmiti-dangjian-submit-btn ' + (this.state.submit?'active':'')}>下一题</div>}
										</div>
									</section>	
								</section>
					})}
				</section>

				<section className={'zmiti-dangjian-result-page lt-full ' + (this.state.showScore?'active':'') }style={mainStyle}>
						<div className='zmiti-dangjian-score-C'>
							<div className='zmiti-dangjian-score'>
								{this.state.score}
								<svg width="100%" height="200px" version="1.1"
							xmlns="http://www.w3.org/2000/svg">
									<circle cx={110} cy='110' r='90' fill='none' strokeDasharray="14,6" stroke='#000'></circle>
								</svg>
							</div>
							<div>{this.state.username}同志</div>
							<div>学思践物，知行合一</div>
							<div>在本次测试中获得<span>{this.state.score}</span>分</div>
						</div>
						<div onTouchTap={this.watchAnswer.bind(this)} className='zmiti-dangjian-result-btn'>
							<span><img src='./assets/images/watch.png'/></span>
							<span>查看答案</span>
						</div>

						<div onTouchTap={this.doAgin.bind(this)} className='zmiti-dangjian-result-btn'>
							<span><img src='./assets/images/refresh.png'/></span>
							<span>再做一次</span>
						</div>

						<div onTouchTap={this.showMask.bind(this)} className='zmiti-dangjian-result-btn'>
							<span><img src='./assets/images/share-ico.png'/></span>
							<span>分享好友</span>
						</div>

					</section>
			</div>;
			break;
		}

		var maskStyle = {
			background:'url(./assets/images/arron1.png) no-repeat center center / cover'
		}

		return (
			<div className={'zmiti-content-main-ui  '+(this.state.showContent ? 'show':'') +(this.state.hideContent?' hide':'')}>
				{component}
				{this.state.showMask&& <div onTouchStart={()=>{this.setState({showMask:false})}} className='zmiti-mask lt-full' style={maskStyle}></div>}
				<ZmitiKeyboardApp show={this.state.showKeyboard} obserable={this.props.obserable}></ZmitiKeyboardApp>
				<div className='zmiti-dangjian-toast'>
					{this.state.toast && <ZmitiToastApp toast={this.state.toast}></ZmitiToastApp>}
				</div>
			</div>
		);
	}

	contentTap(e){
		if(!e.target.classList.contains('zmiti-dangjian-tel-input')){
			this.setState({
				showKeyboard:false
			})
		}
	}


	showMask(){
		this.setState({
			showMask:true
		})
	}

	watchAnswer(){

		let {obserable} = this.props;
		obserable.trigger({
			type:'toggleResult',
			data:true
		});

		this.setState({
			hideContent:true
		})

	}

	doAgin(){
		this.setState({
			hideList:false,
			currentQid:0,
			showScore:false
		},()=>{
			//this.scroll.refresh();
		});
		let {obserable} =  this.props;
		obserable.trigger({
			type:'clearMyAnswer'
		})
	}


	submitPaper(){//提交答卷
		this.setState({
			submit:true
		});
		var score = 0;
		let {obserable} = this.props;
		obserable.trigger({
			type:'fillAnswer',
			data:this.state.currentAnswer.concat([])
		});

		this.props.myAnswer.map((item,i)=>{
			this.props.question[i].rightAnswer = [];

			this.props.question[i].answer.map((a,k)=>{
				if(a.isRight){
					this.props.question[i].rightAnswer.push(k);
				}else{
					this.props.question[i].rightAnswer.push(undefined);
				}
			})

		});




		this.props.question.map((item,i)=>{
			if(item.isMultiselect){
				var isRight = true;
				this.props.question[i].rightAnswer.map((right,k)=>{
					isRight = this.props.myAnswer[i][k] === right;
				})
				if(isRight){
					score += this.props.question[i].score;
				}

			}else{
				this.props.question[i].rightAnswer.map((right,k)=>{
					if(right === this.props.myAnswer[i][0]){
						score += this.props.question[i].score;
					}
				})
			}
		})
		
		obserable.trigger({
			type:'clearCountdown'
		})

		setTimeout(()=>{
			this.setState({
				submit:false,
				hideList:true,
				score,
				showScore:true
			});			
		},200);

		var s = this;

		var idx = Math.random()*this.zmitiMap.length|0;
		$.ajax({
	   		url:'http://api.zmiti.com/v2/weixin/postqascore/',
	   		type:'get',
	   		data:{
	   			wxopenid:'zmiti-qa-'+new Date().getTime(),
	   			worksid:'1495610848973',
	   			nickname:s.state.username,
	   			realname:s.state.username,
	   			phone:s.state.tel,
	   			headimgurl:'./assets/imaegs/zmiti.png',
	   			longitude:s.zmitiMap[idx].log,
	   			latitude:s.zmitiMap[idx].lat,
	   			accuracy:100,
	   			usetime:s.props.totalDuration-s.props.duration,
	   			totaltime:s.props.totalDuration,
	   			wxappid:'wxfacf4a639d9e3bcc',
	   			integral:score
	   		},
	   		error(){
	   			alert('add_wxuser: 服务器返回错误');
	   		},
	   		success(data){
	   			if(data.getret === 0){
	   				
	   				s.showToast('提交成功');

	   			}else{
	   				alert('getret  : '+ data.getret + ' msg : ' + data.getmsg+ ' .....');
	   			}
	   		}
	   	});


	}


	doNext(){//下一题目；

		let {obserable} = this.props;
		obserable.trigger({
			type:'fillAnswer',
			data:this.state.currentAnswer.concat([])
		});
		this.setState({
			currentQid:this.state.currentQid+1,
			currentAnswer:[]
		},()=>{

			//this.scroll.refresh();
		})
	}


	chooseMyAnswer(i){


	 
		if(!this.props.myAnswer[this.state.currentQid] && this.props.myAnswer[this.state.currentQid] !== 0){
			
			this.props.question[this.state.currentQid].answer.map((itne,i)=>{
				this.state.currentAnswer.push(undefined);
			});

			this.state.currentAnswer.length = this.props.question[this.state.currentQid].answer.length;

			if(this.props.question[this.state.currentQid].isMultiselect){//多选题

				
				var has = false;
				this.state.currentAnswer.forEach((item,k)=>{
					if(item  === i){
						has = true;
						return;
					}
				});
				if(has){
					this.state.currentAnswer.splice(i,1,undefined);	
				}else{
					this.state.currentAnswer[i] = i;
				}	
			}else{//单选题目
				this.state.currentAnswer[0] = i;
			}
			

			this.forceUpdate();
			
		}
	}

	showToast(msg){
		this.setState({
        	toast:msg
        });

        setTimeout(()=>{
			this.setState({
	        	toast:''
	        });	        	
        },2000)
	}

	beginAnswer(){//

		if(this.state.username.length<=0 || this.state.tel.length<=0){
			if(this.state.username.length<=0){
				this.showToast('姓名不能为空')
			}
			if(this.state.tel.length<=0){
				this.showToast('手机号不能为空')
			}
			return;
		}

		if(!(/^1[34578]\d{9}$/.test(this.state.tel))){ 
	        this.showToast('请填写正确的手机号');
	        return false; 
	    } 


		let {obserable} = this.props;
		this.setState({
			beginTap:true
		});

		obserable.trigger({
			type:'countdown'
		})

		setTimeout(()=>{
			this.setState({
				beginTap:false,
				hideUser:true

			});	

			obserable.trigger({
				type:'toggleQList',
				data:true
			});

			obserable.trigger({
				type:'setQuestionScroll'
			})

		},200);
	}


	componentDidMount() {



		let {IScroll,obserable } = this.props;

		obserable.on('submitPaper',()=>{
			this.submitPaper();
		})
		obserable.on('setQuestionScroll',()=>{
			
			this.props.question.map((item,i)=>{
				if(this.refs['zmiti-dangjian-q-scroll'+i]){
					this['scroll'+i] = new IScroll(this.refs['zmiti-dangjian-q-scroll'+i],{
						scrollbars:true
					})
					 
				}
			});
			setTimeout(()=>{
				this.props.question.map((item,i)=>{
					this['scroll'+i].refresh();
				});
			},1000)
			
			
		});

		obserable.on('modifyTel',(data)=>{
			if(typeof data === 'string'){
				if(data === 'del'){
					this.state.tel = this.state.tel.substring(0,this.state.tel.length-1);	
				}else if(data === 'back'){
					this.state.showKeyboard = false;
				}
			}else{
				this.state.tel += data;
			}

			
			this.forceUpdate()
		});

		obserable.on('backToShare',()=>{
			obserable.trigger({
				type:'toggleResult',
				data:false
			});

			this.setState({
				hideContent:false
			})
		});
		
		obserable.on('toggleContent',(data)=>{
			this.setState({
				showContent:data
			});
		});
		obserable.on('toggleQList',(data)=>{
			this.setState({
				showQList:data
			});
		});

	}
}
export default PubCom(ZmitiContentApp);