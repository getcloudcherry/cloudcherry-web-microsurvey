import { DomUtilities } from './DomUtilities';

class Theme {
	util: DomUtilities;
	brandColorDark: string;
	brandColorWhite: string;
	constructor( brandColor, time ) {
		this.util = new DomUtilities();
		this.brandColorDark = this.util.shadeBlendConvert( -0.3, brandColor, undefined );
		this.brandColorWhite = this.util.shadeBlendConvert( 0.1, brandColor, undefined );

		let css: string = '\
		.cc-sdk #progressBar{ \
			background : '+ this.brandColorDark + ';\
		}\
		.cc-sdk #progress-line{ \
			background: '+ brandColor + ' \
		}\
		.cc-sdk .cc-checkbox input[type="checkbox"]:checked + label:before {\
			background:'+ brandColor + ';\
		}\
		.overlay.glass{\
			background-color:'+ this.util.hexToRGB( brandColor, .5 ) + ';\
		}\
		.cc-sdk .cc-checkbox input[type="checkbox"]:checked + label:after {\
			border-color: #fff;\
		}\
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:before {\
			border-color: '+ brandColor + ';\
		}\
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:before {\
			border-color: '+ brandColor + ';\
		}\
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:after {\
			background: '+ brandColor + ';\
		}\
		.cc-sdk .form-control:focus {\
			border-color: '+ brandColor + ';\
		}\
		.cc-sdk .cc-message-box__btn{\
			background: '+ brandColor + ';\
			color:#fff;\
		}\
		html[dir="rtl"] .cc-sdk .submit-icon{\
		}\
		.cc-sdk .cc-question-container__required-label{\
			color: '+ brandColor + ';\
		}\
		.cc-sdk input[type="range"]::-webkit-slider-runnable-track{\
			background: '+ brandColor + ' !important;\
			   background: -moz-linear-gradient(-45deg, '+ brandColor + ' 0%, ' + this.brandColorDark + ' 100%)!important;\
			   background: -webkit-linear-gradient(-45deg, '+ brandColor + ' 0%,' + this.brandColorDark + ' 100%)!important;\
			   background: linear-gradient(135deg, '+ brandColor + ' 0%,' + this.brandColorDark + ' 100%)!important;\
			   filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='+ brandColor + ', endColorstr=' + this.brandColorDark + ',GradientType=1 );\
		   }\
		.cc-sdk input[type="range"]::-moz-range-track {\
			background: '+ brandColor + ' !important;\
			background: -moz-linear-gradient(-45deg, '+ brandColor + ' 0%, ' + this.brandColorDark + ' 100%)!important;\
			background: -webkit-linear-gradient(-45deg, '+ brandColor + ' 0%,' + this.brandColorDark + ' 100%)!important;\
			background: linear-gradient(135deg, '+ brandColor + ' 0%,' + this.brandColorDark + ' 100%)!important;\
			filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='+ brandColor + ', endColorstr=' + this.brandColorDark + ',GradientType=1 );\
		}\
		   .cc-sdk input[type="range"]::-webkit-slider-thumb{\
			border: 1px solid '+ brandColor + ' ;\
			background-color: #fff;\
		   }\
		   .cc-sdk input[type="range"]::-moz-range-thumb {\
			border: 1px solid '+ brandColor + ' ;\
			background-color: #fff;\
		   }\
		   .cc-sdk svg.timer circle {\
			animation: countdown '+ time + 's linear 1 forwards;\
			stroke: '+ brandColor + ';\
		   }\
		   .cc-sdk input[type=range].selected::-webkit-slider-thumb {\
				background-color: '+ brandColor + ';\
			}\
			.cc-sdk input[type = range].selected::-moz - range - thumb {\
				background-color: '+ brandColor + ';\
			}\
			.cc-sdk .cc-checkbox label:hover:before{\
				border: solid 1px '+ brandColor + ';\
			}\
		 @media (max-width: 767px){\
	 			.overlay.glass{\
	 			background-color:rgba(255,255,255,.85);\
	 			background-image:none;\
				}\
				.cc-sdk.cc-popup-container{\
					background-color : transparent;\
				}\
				.cc-sdk.cc-popup-container .overlay.glass{\
					background-color : ' + this.util.hexToRGB( brandColor, .9 ) + ';\
				}\
				.cc-sdk.cc-popup-container .cc-message-box .cc-message-box__text{\
					color:#fff;\
				}\
		';
		this.util.appendStyle( css );

	}
}
export { Theme }
