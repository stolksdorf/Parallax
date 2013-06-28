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

		newPage.addClass('flippant-back');
		currentPage.addClass('flippant');

		viewPort.addClass('flipper');

		currentPage.addClass('flipped');


		console.log('flippeing');

		finished();


	};




	viewPort = $('.container').parallax({
		animation_time : 800,
		parallax_scale : 0.3
	});


	setInterval( function(){
		viewPort.next().right();
	}, 2000);



$('.container').mouseover(function(){
	console.log('asdsad');
	viewPort.next().flipRight();
});


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