import React, { Component } from 'react';
import {PubCom} from '../components/public/pub.jsx';
import './assets/css/index.css';
import $ from 'jquery';

class ZmitiIndexApp extends Component {
	constructor(props) {
		super(props);
		this.state={
			beginTest:false
		};
		this.viewW = document.documentElement.clientWidth;
		this.viewH = document.documentElement.clientHeight;
	}

	render() {

		var conponent = null;
			switch(this.props.theme){
				case "PAPER":
				conponent = <div>
						<section className='zmiti-main-title'>{this.state.title}</section>
						<div className={'zmiti-main-btn ' + (this.state.tap?'active':'')} onTouchTap={this.beginTest.bind(this)}>开始考试</div>
						<div className={'zmiti-main-form '+(this.state.showForm?'active':'')}>
							<div className='zmiti-form-title'>{window.formTitle||'请输入你的姓名和电话'}</div>
							<div className='zmiti-form-input'>
								<label>姓名 ：</label><input value={this.state.name} onChange={e=>{this.setState({name:e.target.value})}} type='text'/>
							</div>
							<div className='zmiti-form-input'>
								<label>电话 ：</label><input  onChange={e=>{this.setState({tel:e.target.value})}} type='text'/>
							</div>
							<div onTouchTap={this.submit.bind(this)} className={'zmiti-main-submit '+(this.state.submit?'active':'')}>提交</div>
						</div>
					</div>
				break;
				case "DANGJIAN":
					var mainStyle = {
						background:"#fff url(./assets/images/bg.png) no-repeat center center / cover "
					}
					conponent = <div style={mainStyle} className='zmiti-index-dangjian-theme'>
						<section className='zmiti-dangjian-C'>
							<div className='zmiti-dangjian-cover'>
								<svg width="100%" height="300px" version="1.1"
									xmlns="http://www.w3.org/2000/svg">
									<path stroke='#fff' fill='none' d="M0 100 L225 180 L450 100 " strokeWidth={3} />
									<g>
										<path strokeDasharray="10,6" d="M210 130 L210 210" stroke='#fff' strokeWidth={3} >
											 {this.state.beginTest&& <animateTransform attributeName="transform" begin="0s" dur=".5s" type="scale" from="1 1" to="1 .5" repeatCount="1" fill='freeze'/>}
										</path>
										<path strokeDasharray="10,6" d="M240 130 L240 210" stroke='#fff' strokeWidth={3} >
											{this.state.beginTest&& <animateTransform attributeName="transform" begin="0s" dur=".5s" type="scale" from="1 1" to="1 1.6" repeatCount="1" fill='freeze'/>}
										</path>
										<circle cx='225' cy='100' r = '50' stroke='#fff' strokeWidth='2' fill='#f66'></circle>
										<circle cx='225' cy='100' r = '20' stroke='#fff' strokeWidth='2' fill='#f66'></circle>
									</g>
									</svg>
								<div className='zmiti-index-logo'>
									
								</div>
								<div className='zmiti-index-title'>
									<div>{this.props.title}</div>
								</div>
							</div>
							<div onTouchTap={this.beginTest.bind(this)} className={'zmiti-btn zmiti-begin-btn ' + (this.state.btnClick?'active':'')}>
								参加测试
							</div>
						</section>
					</div>
				break;
			}


		return (
			<div className={'zmiti-index-main-ui '+(this.state.hideIndex?'hide':'')}>
				{conponent}
			</div>
		);
	}

	beginTest(){

		let {obserable} = this.props;
		this.setState({
			btnClick:true
		})
		setTimeout(()=>{
			this.setState({
				beginTest:true,
				btnClick:false,
			});

			setTimeout(()=>{
				this.setState({
					hideIndex:true
				})
				obserable.trigger({
					type:'toggleContent',
					data:true
				})
			},500)
		},200)
	}


	componentDidMount() {

	}
}
export default PubCom(ZmitiIndexApp);