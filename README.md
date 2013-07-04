

	//Queueing test
	var queue = $(example).parallax({
	  enable_arrow_events : true
	});
	queue.on('leftArrow', function(){
	  console.log('test');
	});
	queue.on('downArrow', function(){
	  console.log('test2');
	});







# Basic Use

Parallax at it's core is a library for manipulating **Pages** within a **ViewPort**. This can be as simple as an image carousel, or you can use it for an entire website's navigation. Parallax is built to be incredibly flexible and easy to use. Let's dive in.

### Image Carousel

Let's build a simple image carousel. Every 2 seconds wee want a new image to slide in from the right and loop around back to the beginning. All of our images are already stored within a container div called `example`.

	//Create a parallax instance from our container div
	var imageCarousel = $(example).parallax();

	//Eveyr two seconds, grab the next page, and bring it in from the right
	setInterval(function(){
		imageCarousel.next().right();
		console.log('runninng');
	},2000);

### Keyboard Navigation

Time for something a bit trickier. When the view port is selected, the right and left arrow keys will move between the images. The up arrow will flip to the first image, and the down arrow will flip to the last page shown.

The viewport comes built in with keyboard events, so it's easy to listen to them.

	var trickyExample = $(example).parallax({
		animation_time : 400,
		enable_arrow_events : true
	});

	trickyExample
		.on('leftArrow', function(){
			trickyExample.previous().left();
		})
		.on('rightArrow', function(){
			trickyExample.next().right();
		})
		.on('upArrow', function(){
			//Parallax uses the HTML id to identify pages
			//To reference them directly, use VIEWPORT.pages.HTMLID
			trickyExample.pages.Page1.flipUp();
		})
		.on('downArrow', function(){
			trickyExample.last().flipDown();
		});

# Options

**animation_time** (*default* 800) - The time it takes to complete the animation

**parallax_scale**         (*default* 0.3) - The scale at which the backbround will move relative to the content. Defaults to the background moving 30% of the content. Set it to `false` to disable parallaxing.

**auto_add_children**      (*default* true) - On initialization, Parallax will add each of the child elements as pages. Set this to false to completely control which elements are pages.

**resize_viewport_width**  (*default* false) - Set to `true` to have the ViewPort's width resize to match the current page's width

**resize_viewport_height** (*default* false) - Set to `true` to have the ViewPort's height resize to match the current page's height

**use_css3**               (*default* false) - If true Parallax will use CSS3 transitions instead of jQuery animations. **Note:** Not all browsers support CSS3 transition, make sure you test!

**enable_arrow_events**     (*default* false) - If true, the ViewPort will emit events whenever the user presses arrow keys


	//Play around with the options!
	var optionSandbox = $(example).parallax({
		animation_time         : 800,
		parallax_scale         : 0.3,
		auto_add_children      : true,
		resize_viewport_width  : false,
		resize_viewport_height : false,
		use_css3               : false,
		enable_arrow_events    : false
	});
	optionSandbox.next().right();

# ViewPort and Page API

The following is a list of all the functions available for the `ViewPort` and each `Page`

## ViewPort

**.pages** - Key/Value pair list of each page object and it's id. Parallax will use the page's HTML id as it's id if available. If not, it will generate an id for it. Useful for accessing specific pages.

**.add(JQUERY_OBJECT)** - Consumes a jQuery object and adds it as a page to this ViewPort. Returns the created page object.

**.last()** - Returns the last page object that was shown.

**.current()** - Returns the current page object

**.next()** - Returns the next logical page using the page's `order` property. If it's the last page, it will loop around and return the first page.

**.previous()** - Returns the previous logical page using the page's `order` property. If it's the first page, it will loop around and return the last page.


## Page

**transitions** - Each page will adopt each method in the `Parallax.transitions` object. Calling these on a page will use that function and transition it as the currently viewed page. Currently supported transitions are `.right()`, `.left()`, `.up()`, `.down()`, `.flipRight()`, `.flipLeft()`, `.flipUp()`, and `.flipDown()`

**.order** - Every page is given a numerical value as it's `order` when it's created. ViewPort commands such as `next` and `previous` use this to determine the ordering of your pages. Parallax will simply maintain the ordering at which you added pages, however feel free to change these values to fine tune the order you want.

**.show()** - Technically a `transition` function, this will simply show the page instantly and make it current.

**.hide()** - Hides the page from view.

**.isCurrent()** - Returns a boolean on whether the page is being currently shown or not.



# Adding Pages

Using the `auto_add_children` option, all child elements of the viewport are added as pages on the creation of the Parallax object.

Any HTML element can be added as a page to a ViewPort. Parallax will try and use the element's HTML id as the pages id if possible.

# Events and Callbacks

PUT SOMETHING HERE

### Events


### Arrow Key Events

By setting the `enable_arrow_events` option to true, the ViewPort will now emit events whenever the user presses the arrow keys.

	var arrowNav = $(example).parallax({
		enable_arrow_events : true
	});
	arrowNav
		.on('leftArrow', function(){
			arrowNav.next().left();
		})
		.on('rightArrow', function(){
			arrowNav.next().right();
		})
		.on('upArrow', function(){
			arrowNav.next().up();
		})
		.on('downArrow', function(){
			arrowNav.next().down();
		});


### Callbacks

Whenever you call a transition on a page you can always add a callback to it for when it's completed

	var callbackExample = $(example).parallax();
	callbackExample.next().right(function(){
		alert('Completed!');
	});



# Advanced Usage

## Changing Ordering

## Custom Transitions

## CSS3 Transitions