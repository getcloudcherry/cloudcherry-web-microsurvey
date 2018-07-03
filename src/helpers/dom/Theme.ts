import { DomUtilities } from './DomUtilities';

class Theme {
	util: DomUtilities;
	brandColorDark: string;
	brandColorWhite: string;
	constructor( brandColor, time ) {
		this.util = new DomUtilities();
		this.brandColorDark = this.util.shadeBlendConvert( -0.3, brandColor, undefined );
		this.brandColorWhite = this.util.shadeBlendConvert( 0.1, brandColor, undefined );
		let css: string = `
		.cc-sdk #progressBar{
			background : ${this.brandColorDark };
		}
		.cc-sdk #progress-line{ 
			background: ${brandColor };
		}
		.cc-sdk .cc-checkbox input[type="checkbox"]:checked + label:before {
			background:${brandColor };
		}
		.ccsdk-overlay.glass{
			background-color:${this.util.hexToRGB( brandColor, .5 ) };
		}
		.cc-sdk .cc-checkbox input[type="checkbox"]:checked + label:after {
			border-color: #fff;
		}
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:before {
			border-color: ${brandColor };
		}
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:before {
			border-color: ${brandColor };
		}
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:after {
			background: ${brandColor };
		}
		.cc-sdk .form-control:focus {
			border-color: ${brandColor };
		}
		.cc-sdk .cc-message-box__btn{
			background: ${brandColor };
			color:#fff;
		}
			.cc-sdk .submit-icon{
				background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20width%3D%2747px%27%20height%3D%2747px%27%20viewBox%3D%270%200%2047%2047%27%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%3E%3Ctitle%3EGroup%2016%3C%2Ftitle%3E%3Cdesc%3ECreated%20with%20Sketch.%3C%2Fdesc%3E%3Cdefs%3E%3Ccircle%20id%3D%27path-1%27%20cx%3D%2719.3130459%27%20cy%3D%2719.3130459%27%20r%3D%2719.3130459%27%3E%3C%2Fcircle%3E%3Cfilter%20x%3D%27-18.1%25%27%20y%3D%27-12.9%25%27%20width%3D%27136.2%25%27%20height%3D%27136.2%25%27%20filterUnits%3D%27objectBoundingBox%27%20id%3D%27filter-2%27%3E%3CfeOffset%20dx%3D%270%27%20dy%3D%272%27%20in%3D%27SourceAlpha%27%20result%3D%27shadowOffsetOuter1%27%3E%3C%2FfeOffset%3E%3CfeGaussianBlur%20stdDeviation%3D%272%27%20in%3D%27shadowOffsetOuter1%27%20result%3D%27shadowBlurOuter1%27%3E%3C%2FfeGaussianBlur%3E%3CfeColorMatrix%20values%3D%270%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.116423234%200%27%20type%3D%27matrix%27%20in%3D%27shadowBlurOuter1%27%3E%3C%2FfeColorMatrix%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cg%20id%3D%27Page-1%27%20stroke%3D%27none%27%20stroke-width%3D%271%27%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20id%3D%271-copy-20%27%20transform%3D%27translate(-1246.000000%2C%20-664.000000)%27%3E%3Cg%20id%3D%27Group-16%27%20transform%3D%27translate(1250.000000%2C%20666.000000)%27%3E%3Cg%20id%3D%27Oval-4%27%3E%3Cuse%20fill%3D%27white%27%20fill-opacity%3D%271%27%20filter%3D%27url(%23filter-2)%27%20xlink%3Ahref%3D%27%23path-1%27%3E%3C%2Fuse%3E%3Cuse%20fill%3D%27${encodeURIComponent( brandColor ) }%27%20fill-rule%3D%27evenodd%27%20xlink%3Ahref%3D%27%23path-1%27%3E%3C%2Fuse%3E%3C%2Fg%3E%3Cg%20id%3D%27Group-5%27%20transform%3D%27translate(12.000000%2C%2011.000000)%27%20fill-rule%3D%27nonzero%27%20fill%3D%27%23FFFFFF%27%3E%3Cg%20id%3D%27fast-forward-arrows%27%20transform%3D%27translate(6.173934%2C%200.000000)%27%3E%3Cpolygon%20id%3D%27Shape%27%20points%3D%270.993357559%200%200%200.993357559%207.30823082%208.3015552%200%2015.6097197%200.993357559%2016.6030772%209.29491276%208.3015552%27%3E%3C%2Fpolygon%3E%3C%2Fg%3E%3Cg%20id%3D%27fast-forward-arrows-copy%27%3E%3Cpolygon%20id%3D%27Shape%27%20points%3D%270.993357559%200%200%200.993357559%207.30823082%208.3015552%200%2015.6097197%200.993357559%2016.6030772%209.29491276%208.3015552%27%3E%3C%2Fpolygon%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
			}
			html[dir="rtl"] .cc-sdk .submit-icon{
				background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20width%3D%2747px%27%20height%3D%2747px%27%20viewBox%3D%270%200%2047%2047%27%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%3E%0A%20%20%20%20%3Cdesc%3ECreated%20with%20Sketch.%3C%2Fdesc%3E%0A%20%20%20%20%3Cdefs%3E%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20id%3D%27Page-1%27%20stroke%3D%27none%27%20stroke-width%3D%271%27%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%0A%20%20%20%20%20%20%20%20%3Cg%20id%3D%27Submit_Icon%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%27Oval-4%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%27path-1-link%27%20fill-rule%3D%27nonzero%27%20fill%3D%27%23white%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20id%3D%27path-1%27%20cx%3D%2719.3130459%27%20cy%3D%2719.3130459%27%20r%3D%2719.3130459%27%3E%3C%2Fcircle%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%27path-1-link%27%20fill%3D%27${encodeURIComponent( brandColor ) }%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20id%3D%27path-1%27%20cx%3D%2719.3130459%27%20cy%3D%2719.3130459%27%20r%3D%2719.3130459%27%3E%3C%2Fcircle%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%27Group-5%27%20transform%3D%27translate(12.000000%2C%2011.000000)%27%20fill-rule%3D%27nonzero%27%20fill%3D%27%23ffffff%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%27fast-forward-arrows%27%20transform%3D%27translate(11.173934%2C%208.500000)%20scale(-1%2C%201)%20translate(-11.173934%2C%20-8.500000)%20translate(6.173934%2C%200.000000)%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpolygon%20id%3D%27Shape%27%20points%3D%270.993357559%200%200%200.993357559%207.30823082%208.3015552%200%2015.6097197%200.993357559%2016.6030772%209.29491276%208.3015552%27%3E%3C%2Fpolygon%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%27fast-forward-arrows-copy%27%20transform%3D%27translate(5.000000%2C%208.500000)%20scale(-1%2C%201)%20translate(-5.000000%2C%20-8.500000)%20%27%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpolygon%20id%3D%27Shape%27%20points%3D%270.993357559%200%200%200.993357559%207.30823082%208.3015552%200%2015.6097197%200.993357559%2016.6030772%209.29491276%208.3015552%27%3E%3C%2Fpolygon%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E");
			}
			.cc-sdk .cc-question-container__required-label{
			color: ${brandColor };
		}
		.cc-sdk input[type="range"]::-webkit-slider-runnable-track{
			background: ${brandColor } !important;
			   background: -moz-linear-gradient(-45deg, ${brandColor } 0%, ${ this.brandColorDark } 100%)!important;
			   background: -webkit-linear-gradient(-45deg, ${brandColor }' 0%,${ this.brandColorDark } 100%)!important;
			   background: linear-gradient(135deg, ${brandColor } 0%,${ this.brandColorDark } 100%)!important;
			   filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=${brandColor }, endColorstr=${ this.brandColorDark },GradientType=1 );
		   }
		.cc-sdk input[type="range"]::-moz-range-track {
			background: ${brandColor } !important;
			background: -moz-linear-gradient(-45deg, ${brandColor } 0%, ${ this.brandColorDark } 100%)!important;
			background: -webkit-linear-gradient(-45deg, ${brandColor } 0%, ${ this.brandColorDark } 100%)!important;
			background: linear-gradient(135deg, ${brandColor } 0%,${ this.brandColorDark } 100%)!important;
			filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=${brandColor }, endColorstr=${ this.brandColorDark },GradientType=1 );
		}
		   .cc-sdk input[type="range"]::-webkit-slider-thumb{
			border: 1px solid ${brandColor } ;
			background-color: #fff;
		   }
		   .cc-sdk input[type="range"]::-moz-range-thumb {
			border: 1px solid ${brandColor } ;
			background-color: #fff;
		   }
		   .cc-sdk svg.timer circle {
			animation: countdown ${time }s linear 1 forwards;
			stroke: ${brandColor };
		   }
		   .cc-sdk input[type=range].selected::-webkit-slider-thumb {
				background-color: ${brandColor };
			}
			.cc-sdk input[type = range].selected::-moz - range - thumb {
				background-color: ${brandColor };
			}
			.cc-sdk .cc-checkbox label:hover:before{
				border: solid 1px ${brandColor };
			}
		 @media (max-width: 767px){
	 			.ccsdk-overlay.glass{
	 			background-color:rgba(255,255,255,.85);
	 			background-image:none;
				}
				.cc-sdk.cc-popup-container{
					background-color : transparent;
				}
				.cc-sdk.cc-popup-container .ccsdk-overlay.glass{
					background-color : ${this.util.hexToRGB( brandColor, .9 ) };
				}
				.cc-sdk.cc-popup-container .cc-message-box .cc-message-box__text{
					color:#fff;
				}
		`;
		this.util.appendStyle( css );

	}
}
export { Theme }
