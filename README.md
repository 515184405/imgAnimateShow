# imgAnimateShow
图片的动态显示效果
兼容ie9及以上版本

本插件基于jquery框架实现

     基本使用方法：
     
        $('.img_box img').imgShow({
	       
		    // 当前所有小图的公共父亲且不能为body,默认是当前图片的祖先元素body的儿子
		    nodeParent : $(".img_box"),
		    
		    //true 是点击图片src的地址，false是data-src的地址，默认为true;
		    isBigImg : true,//img上必须得有data-src属性
		    
		    //点击放大图片的动画时长 默认是500
		    duration : 500
		});
		
      此插件有三个参数：
      
	     1，nodeParent : jq对象（dom）
	       //调用的dom必须是你所需要动画的公共父级，并且不能是body；默认是当前所有图片的祖先元素且是body的儿子。
	       
	     2，isBigImg : boolean值（true/false）
	      //默认是true,也是当前点击的图片的地址
	      //如果值为false,那么img中必须有data-src属性，并且你需要把你要显示图片的地址放到该属性中

	     3，duration : （动画的时间值）例：500
	     //默认是500
