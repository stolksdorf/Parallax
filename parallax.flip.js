/**
 * A css3 version of jQuery's animate()
 * takes a set of css rules, a delay, easing, and a callback.
 */
jQuery.fn.css3animate = function(rules, p2, p3, p4){
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

	setTimeout(function(){
		obj.css3('transition', 'all ' + delay + 'ms '+ easing +' 0s');
		$.each(rules, function(ruleName, rule){
			obj.css3(ruleName, rule);
		});
	},0);
	setTimeout(function(){
		obj.css3('transition', 'all 0s '+ easing +' 0s');
		if(typeof callback === 'function') callback();
	},delay);

	return obj;
};

/**
 * Vendor prefixed version of jQuery's .css function
 * can get and set vendor-prefixed css rules, like 'transition'
 */
jQuery.fn.css3 = function(ruleName, rule){
	var vendors = ['', '-moz-', '-ms-', '-webkit-'], obj = $(this);
	var set = function(ruleName, rule){
		$.each(vendors, function(index, vendor){
			obj.css(vendor + ruleName, rule);
		});
	};
	if(typeof ruleName === 'object'){
		$.each(ruleName, function(ruleName, rule){
			set(ruleName, rule);
		});
		return obj;
	}else if(typeof rule === 'undefined'){
		for(var i = 0; i < vendors.length; i++) {
			if(typeof obj.css(vendors[i] + ruleName) === 'string'){
				return obj.css(vendors[i] + ruleName);
			}
		}
		return;
	}
	set(ruleName, rule);
	return obj;
};



Parallax.transitions.flipRight = function(newPage, currentPage, viewPort, options, finished){
	Parallax.parallaxMethods.right(viewPort, options);
	newPage
		.css3({
			'transform':'rotateY(-180deg)',
			'backface-visibility' :'hidden'
		})
		.css({
			left : 0,
			top : 0,
		}).show();

	currentPage
		.css3animate({'backface-visibility' :'hidden'},0, function(){
			currentPage.css3animate({'transform':'rotateY(-180deg)'},options.animation_time);
			newPage.css3animate({'transform':'rotateY(0deg)'},options.animation_time, function(){
				currentPage.hide().css3('transform','rotateY(0deg)');
				finished();
			});
		});
};
Parallax.transitions.flipLeft = function(newPage, currentPage, viewPort, options, finished){
	Parallax.parallaxMethods.left(viewPort, options);
	newPage
		.css3({
			'transform':'rotateY(180deg)',
			'backface-visibility' :'hidden'
		})
		.css({
			left : 0,
			top : 0,
		}).show();

	currentPage
		.css3animate({'backface-visibility' :'hidden'},0, function(){
			currentPage.css3animate({'transform':'rotateY(180deg)'},options.animation_time);
			newPage.css3animate({'transform':'rotateY(0deg)'},options.animation_time, function(){
				currentPage.hide().css3('transform','rotateY(0deg)');
				finished();
			});
		});
};
Parallax.transitions.flipUp = function(newPage, currentPage, viewPort, options, finished){
	Parallax.parallaxMethods.up(viewPort, options);
	newPage
		.css3({
			'transform':'rotateX(180deg)',
			'backface-visibility' :'hidden'
		})
		.css({
			left : 0,
			top : 0,
		}).show();

	currentPage
		.css3animate({'backface-visibility' :'hidden'},0, function(){
			currentPage.css3animate({'transform':'rotateX(180deg)'},options.animation_time);
			newPage.css3animate({'transform':'rotateX(0deg)'},options.animation_time, function(){
				currentPage.hide().css3('transform','rotateX(0deg)');
				finished();
			});
		});
};
Parallax.transitions.flipDown = function(newPage, currentPage, viewPort, options, finished){
	Parallax.parallaxMethods.down(viewPort, options);
	newPage
		.css3({
			'transform':'rotateX(-180deg)',
			'backface-visibility' :'hidden'
		})
		.css({
			left : 0,
			top : 0,
		}).show();

	currentPage
		.css3animate({'backface-visibility' :'hidden'},0, function(){
			currentPage.css3animate({'transform':'rotateX(-180deg)'},options.animation_time);
			newPage.css3animate({'transform':'rotateX(0deg)'},options.animation_time, function(){
				currentPage.hide().css3('transform','rotateX(0deg)');
				finished();
			});
		});
}
