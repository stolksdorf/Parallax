$(document).ready(function(){

	Parallax.transitions.stageRight = function(newPage, currentPage, viewPort, options, finished){
		currentPage.animate({
			left : viewPort.width()
		}, options.animation_time, function(){
			Parallax.parallaxMethods.right(viewPort, options);
			currentPage.hide();
			newPage.show();
			newPage.css({
				left : viewPort.width(),
				top : 0
			});
			newPage.animate({
				left : 0
			}, options.animation_time, finished);
		});
	};


	Parallax.transitions.flipRight = function(newPage, currentPage, viewPort, options, finished){
		Parallax.parallaxMethods.right(viewPort, options);
		newPage
			.cssAnimate({
				'transform':'rotateY(-180deg)',
				'backface-visibility' :'hidden'
			},0)
			.css({
				left : 0,
				top : 0,
			}).show();

		currentPage
			.cssAnimate({'backface-visibility' :'hidden'},0, function(){
				currentPage.cssAnimate({'transform':'rotateY(-180deg)'},options.animation_time);
				newPage.cssAnimate({'transform':'rotateY(0deg)'},options.animation_time, function(){
					currentPage.hide().cssAnimate({'transform':'rotateY(0deg)'},0);
					finished();
				});
			});
	};

	Parallax.transitions.cssRight = function(newPage, currentPage, viewPort, options, finished){
		Parallax.parallaxMethods.right(viewPort, options);
		currentPage.cssAnimate({
			left : -viewPort.width()
		}, options.animation_time, function(){
			currentPage.hide();
		});
		newPage.show().css({
			left : viewPort.width(),
			top : 0
		}).cssAnimate({
			left : 0
		}, options.animation_time, finished);
	};




	jQuery.fn.cssAnimate = function(rules, p2, p3, p4){
		var obj = $(this), delay = 400, easing = 'cubic-bezier(.02, .01, .47, 1)', callback;
		if(typeof rules !== 'object') return this;
		if(typeof p2 === 'number')   delay    = p2;
		if(typeof p2 === 'function') callback = p2;
		if(typeof p2 === 'string')   easing   = p2;

		if(typeof p3 === 'number')   delay    = p3;
		if(typeof p3 === 'function') callback = p3;
		if(typeof p3 === 'string')   easing   = p3;

		if(typeof p4 === 'number')   delay    = p4;
		if(typeof p4 === 'function') callback = p4;
		if(typeof p4 === 'string')   easing   = p4;

		var vendors = ['', '-moz-', '-ms-', '-webkit-'];

		var addRule = function(ruleName, rule){
			$.each(vendors, function(index, vendor){
				obj.css(vendor + ruleName, rule);
			});
		};
		setTimeout(function(){
			addRule('transition', 'all ' + delay + 'ms '+ easing +' 0s');
			$.each(rules, function(ruleName, rule){
				addRule(ruleName, rule);
			});
		},0);
		setTimeout(function(){
			addRule('transition', 'all 0s '+ easing +' 0s');
			if(typeof callback === 'function') callback();
		},delay);

		return obj;
	}











	viewPort = $('.container').parallax({
		animation_time : 800,
		parallax_scale : 0.3
	});




	setInterval( function(){
		viewPort.next().cssRight();
	}, 2000);



$('.container2').mouseover(function(){
	console.log('asdsad');
	//viewPort.next().right();
});

//viewPort.next().flipRight();

});




/*


		flipRight : function(newPage, currentPage, viewPort, options, finished){
			Parallax.parallax.right(viewPort, options);
			newPage.show().css({
				top : 0,
				left : 0,
				'backface-visibility' : 'hidden',
				'transform' : 'rotateY(180deg)'
			});
			currentPage.css({
				'backface-visibility' : 'hidden'
			});

			incrementalLoop(0, -180, options.animation_time, function(x){
				currentPage.css({
					'transform' : 'rotateY(' + x + 'deg)'
				});
			});
			incrementalLoop(180, 0, options.animation_time, function(x){
				newPage.css({
					'transform' : 'rotateY(' + x + 'deg)'
				});
			}, function(){
				currentPage.hide();
				finished();
			});

		}
	}
};

var incrementalLoop = function(start, end, time, fn, finished){
	var inte = (end - start)/(time/10);
	var temp = setInterval(function(){
		start += inte;
		fn(start);
		if(start === end){
			clearInterval(temp);
			if(typeof finished === 'function'){ finished(); }
		}
	}, 10);
};




 */