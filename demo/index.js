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





	viewPort = $('.container').parallax({
		animation_time : 200,
		parallax_scale : false,
		capture_keypresses : true,
	});

	viewPort.on('leftArrow', function(){
		alert('left arrow was hit!');
	})


	setInterval( function(){
		viewPort.next().flipUp(function(){
		});
	}, 2000);

});