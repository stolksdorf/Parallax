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




/*
	viewPort = $('.container').parallax({
		animation_time : 200,
		parallax_scale : false,
		enable_arrow_events : true,
	});

/*

	setInterval( function(){
		viewPort.next().flipUp(function(){
		});
	}, 2000);
*/




var adventureTime = $('.container').parallax({
	enable_arrow_events : true
});

adventureTime.on('leftArrow', function(){
	adventureTime.last().left();
});
adventureTime.on('rightArrow', function(){
	adventureTime.next().right();
});
adventureTime.on('upArrow', function(){
	//Parallax uses the HTML id to identify pages.
	//To reference them directly, use VIEWPORT.pages.HTMLID
	adventureTime.pages.Page1.flipUp();
});
adventureTime.on('downArrow', function(){
	adventureTime.last().flipDown();
});






});