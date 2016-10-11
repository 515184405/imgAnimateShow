
// $(function(){
// 	$('.img_box img').imgShow({
// 		// 当前所有小图的公共parent 必填
// 		nodeParent : $(".img_box"),
// 		//true 是点击图片的地址，false是点击图片的data-src的地址，默认为true;
// 		isBigImg : false,//img上必须得有data-src属性
// 		//点击放大图片的动画时长 默认是500
// 		duration : 500,
// 	});
// })
(function($){
	// 被调用的次数
	var funSpeed = 0;
	// 创建img时计算出img距离页面顶部的距离
	var scrollTop = 0;
	// 判断是否创建当前位置
	var iscreate_current_position;
	var addCssStyle = function(){
		var cssStyle = '<link rel="stylesheet" href="static/css/previewImg.css">';
		$('head:eq(0)').append(cssStyle);
	}
	// 添加样式
	addCssStyle();
	// 兼容ie代码8
	isIE8 = function(callback){
		var DEFAULT_VERSION = "8.0";
		var ua = navigator.userAgent.toLowerCase();
		var isIE = ua.indexOf("msie")>-1;
		var safariVersion;
		// 判断是否是ie8及一下
		if(isIE){

		    safariVersion =  ua.match(/msie ([\d.]+)/)[1];
		}
		if(!(safariVersion <= DEFAULT_VERSION) ){

			callback();
		    
		}
	}
	$.fn.imgShow = function(options){
		funSpeed++;
		// 留住this指向
		var _this = this;
		// 创建默认数据
		var opts = {
			nodeParent : $($(_this).parents().splice(-3,1)[0]),//默认img的祖先元素body的孩子
			isBigImg : true,//默认是img的当前的src
			duration : 500//默认时间是500毫秒
		};
		// 合并数据
		var param = $.extend(opts,options)
		// ie8中原始图片的大小
		var IEoldSizeW,IEoldSizeH;
		// 判断是否创建遮罩层
		var img_bg ;
		// 判断按钮是否加载
		var isLoadBtn;
		 //判断是否创建这个img
		var iscreateImgAnimate;
		// 判断是否创建imgBox
		var isCreateImgBox;
		if(param.nodeParent.selector == "body" ){
			 throw new Error("nodeParent不能为body,必须是body的后代元素");
		} 
		// 图片地址的处理
		var imgUrl;
		if( param.isBigImg ){
			imgUrl = "src";
		}else{
			imgUrl = "data-src"
		};
		//监听图片距离顶部的距离方法
		scrollTopFun = function(){

			$(window).scroll(function(){

				scrollTop = $(window).scrollTop(); 

			})
		};
		// 给每个img添加data-num属性方法
		addAttr = function(){

			$(_this).each(function(index,dom){

				$(dom).attr("data-num",index).attr("data-speed",funSpeed);

			})
		};
		// 创建当前img显示的位置方法
		create_current_position = function(){

			if( !iscreate_current_position ){

				var imgLengthDom = "<div class='imgLengthNum_js clearfix'><div class='nowIndex_js left'></div><div class='left' style='font-size:90px'>/</div><div class='left imgLength_js'></div></div>";
				$("body").append(imgLengthDom);
				iscreate_current_position = 1;

			}
		};
		// 创建imgbox方法
		createImgBox = function(){
			var imgBox = '<div class="big_img_box_js'+funSpeed+'"></div>';
			$("body").append(imgBox);
		}
		createImg = function(){
			// 创建新的img逻辑
			param.nodeParent.delegate("img",'click',function(){
				createMask()
				// 让页面禁止滚动
				$('body').css({
					"overflow":"scroll",
					"overflow-y":"hidden"
				})
				// 把img的个数放到页面上
				$(".imgLength_js").html(_this.length)
				// 当前的img的祖先在那个盒子里
				var _selfParent = $(this).attr('data-speed');
				// 计算当前img的位置
				// 距离页面顶部的距离-滚动条的距离顶部的距离 = dom距离浏览器窗口的距离
				var offT = $(this).offset().top - scrollTop;
				var offL = $(this).offset().left;
				var oldW = $(this).css("width");
				var oldH = $(this).css("height");
				//找到当前img的角标
				var index = parseInt($(this).attr("data-num"));
				// 如何图片加载,不需创建直接显示
				if( iscreateImgAnimate ){
					//ie8状态下原始图片的大小
					IEoldSizeW = this.width;
					IEoldSizeH = this.height;
					// 设置新img的位置
					$('.big_img_box_js'+_selfParent+' .big_photo:eq('+index+')').css({
							"position" : "fixed",
							"left" : offL,
							"top" : offT,
							"width" : oldW,
							"height" : oldH,
							"z-index" : 100000,
							"opacity" : 1
						}).show();
					// 调用动画
					imgAnimate($('.big_img_box_js'+_selfParent+' .big_photo:eq('+index+')')[0]);
					// 把this这个盒子中所有的img找到并显示
					$('.big_img_box_js'+_selfParent+' .big_photo').fadeIn();
				}else{
					// 如果图片未加载直接创建图片
					var newImg = new Image();
					newImg.className = "big_photo";
					newImg.onload = function(){

						//ie8状态下原始图片的大小
						IEoldSizeW = this.width;
						IEoldSizeH = this.height;
						//设置新img的位置
						$(newImg).css({
							"position" : "fixed",
							"left" : offL,
							"top" : offT,
							"width" : oldW,
							"height" : oldH,
							"z-index" : 100000,
							"opacity" : 1,
						})
						// 调用动画
						imgAnimate(newImg);
						// 找到所有的img
						var imgArr = [];
						var len = _this.length;
						for(var i = 0; i < len; i++){

							// 确认图片的地址
							var nowImg = $( _this[i] ).attr(imgUrl)
							// i=等于当前img的角标，当前img的前面的img不添加到大图中
							if( $(newImg).attr("src") != nowImg ){

								imgArr[i] = new Image();
								imgArr[i].className = "big_photo";
								imgArr[i].onload = function(){

									// 找到img的大图宽和高
									var bigW = $(this).context.naturalWidth;
									var bigH = $(this).context.naturalHeight;

									if( bigW > parseInt($(window).width())){

										bigW = parseInt($(window).width());
										bigH = $(this).context.naturalHeight/$(this).context.naturalWidth*bigW;

									}

									if( bigH > parseInt($(window).height())){

										bigH = parseInt($(window).height());
										bigW = $(this).context.naturalWidth/$(this).context.naturalHeight*bigH;

									}

									var bigL = (parseInt($(window).width()) - bigW)/2;
									var bigT = (parseInt($(window).height()) - bigH)/2;
									// 给img的位置做处理
									$(this).css({
										"position" : "fixed",
										"width" : bigW,
										"height" : bigH,
										"left" : bigL,
										"top" : bigT
									}).fadeIn();
									if($(this).css("z-index") == 0){
										$(this).css({
											"z-index" : 0,
											"opacity" :0
										})
									}
								}
								// // 找到img的src,默认是当前img的src
									imgArr[i].src = $(_this[i]).attr(imgUrl)
								
								// 把img添加到当前动画img的前面或后面

								if( i >= index ){
									$(".big_img_box_js"+_selfParent).append(imgArr[i]);

								}else{
									$(newImg).before(imgArr[i]);
								}
							}
						}
					}
					
					// 带动画的图片的地址处理
					newImg.src = $(this).attr(imgUrl);
		
					$(".big_img_box_js"+_selfParent).append(newImg);

					iscreateImgAnimate = 1;

				}

				TabImg( newImg,_selfParent,index );
				$(".nowIndex_js").html(index+1);
				$('.imgLengthNum_js').fadeIn(param.duration);
			})
		};
		// 给img添加放大动画
		imgAnimate = function( newImg ){
			//兼容ie8
			var bigW = $(newImg).context.naturalWidth;
			bigW = bigW == undefined ? IEoldSizeW : $(newImg).context.naturalWidth;
			var bigH = $(newImg).context.naturalHeight;
			 bigH = bigH == undefined ? IEoldSizeH : $(newImg).context.naturalHeight; 

			if( bigW > parseInt($(window).width())){

				var oldbigW = bigW;
				bigW = parseInt($(window).width());
				bigH = bigH/bigW*bigW;

			}

			if( bigH > parseInt($(window).height())){

				var oldbigH = bigH;
				bigH = parseInt($(window).height());
				bigW = bigW/oldbigH*bigH;

			}

			var bigL = (parseInt($(window).width()) - bigW)/2;
			var bigT = (parseInt($(window).height()) - bigH)/2;

			$(newImg).animate({
				"width" : bigW,
				"height" : bigH,
				"left" : bigL,
				"top" : bigT
			},param.duration);
		};
		// 创建遮罩层
		createMask = function(){
			// 判断是否创建，如果创建，就直接show,否则创建
			if( img_bg ){

				$(".img_bg_js,.btn_close_js").fadeIn(param.duration,function(){
					$(".img_bg_js").css({
						"background": "#000 url('/static/img/ajax-loader.gif') no-repeat center center"
					})
				});
				
			}else{
				var imgMask = "<div class='img_bg_js'></div>";
				$('body').append(imgMask);
				$(".img_bg_js").animate({
					"opacity" : 0.8,
					"filter" : "alpha(opacity=80)"
				},param.duration,function(){
					$(".img_bg_js").css({
						"background": "#000 url('/static/img/ajax-loader.gif') no-repeat center center"
					})
				})
				img_bg = 1;
			}
			//点击关闭遮罩层，隐藏大图
			$("body").delegate(".img_bg_js,.big_photo,.btn_close_js","click",function(){
				$('body').css({
					"overflow":"scroll",
					"overflow-y":"auto"
				})
				$('.img_bg_js,.btn_close_js').fadeOut(300);
				$(".img_bg_js").css({
					"background": "#000"
				})
				$('.big_photo').css({
					"z-index" : 0,
					"opacity" : 0
				}).fadeOut(100);
				$(".btnLeft_js,.btnRight_js").fadeOut(300);
				$('.imgLengthNum_js').fadeIn(300);	
			})
		};

		// 定义左右点击切换事件
		TabImg = function( first_img,parentNum,index ){
			if( isLoadBtn ){

				isIE8(function(){
					$(".btnLeft_js,.btnRight_js").fadeIn(param.duration);
				})

			}else{
				// 创建左右按钮和关闭按钮
				var btnDom = "<a href='javascript:;' class='btnLeft_js'>&lt;</a><a href='javascript:;' class='btnRight_js'>&gt;</a><a href='javascript:;' class='btn_close_js'>×</a>" ;
				$('body').append(btnDom);
				$(".btn_close_js").fadeIn(param.duration);
				// 如何是不是ie8或已下版本左右按钮显示
				isIE8(function(){
					$(".btnLeft_js,.btnRight_js").fadeIn(param.duration);
				});

				isLoadBtn = 1;
			}
			// 当前的大图
			// 点击右侧按钮
			$('.btnRight_js').click(function(){
				// 把所有img隐藏掉
				$($('.big_img_box_js'+parentNum+' img')).css({'z-index':0,"opacity" : 0});

				if( $('.big_img_box_js'+parentNum+' img').length > index + 1 ){
					// 找到上一个
					index++;
					// 把上一个显示
					$($('.big_img_box_js'+parentNum+' img')[index]).css({

						"z-index" : 100000,
						"opacity" : 1

					}) 

				}else{
					// 如果img.next为undefined！那么第一个就显示，实现递归
					index = 0;
					$($('.big_img_box_js'+parentNum+' img')[index]).css({'z-index':100000,"opacity" : 1});

				}
				$(".nowIndex_js").html(index+1)
			})
			// 点击左侧按钮
			$('.btnLeft_js').click(function(){
				// 把所有img隐藏掉
				$($('.big_img_box_js'+parentNum+' img')).css({'z-index':0,"opacity" : 0});

				if( index > 0 ){
					// 找到下一个
					index--;
					// 把下一个显示
					$($('.big_img_box_js'+parentNum+' img')[index]).css({

						"z-index" : 100000,
						"opacity" : 1

					}) 

				}else{
					// 如果imgimg.prev为undefined！那么最后一个就显示，实现递归
					index = $('.big_img_box_js'+parentNum+' img').length - 1;
					$($('.big_img_box_js'+parentNum+' img')[index]).css({'z-index':100000,"opacity" : 1});
				}
				$(".nowIndex_js").html(index+1)
			})
		}
		// 创建img盒子
		createImgBox();
		// 跟踪img的位置
		create_current_position();
		// 给所有的img添加data-num
		addAttr();
		// 找到当前img距离顶部的距离
		scrollTopFun();
		// 点击创建img并执行一系列方法
		createImg();
	}
})(jQuery)
