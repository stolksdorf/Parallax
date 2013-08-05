** Note: This library is still under construction **

# Tell me about it

Parallax is a Javascript library that uses jQuery to beautifully transition content on the page, while parallaxing it's background. At it's core it is a library for manipulating **Pages** within a **ViewPort**.

This can be as simple as an image carousel, or as complex as an entire website's navigation using arrows keys and various events. Parallax is built to be incredibly flexible and easy to use. Let's dive in.

### Image Carousel

Let's build a simple carousel. Every 2 seconds we want a new page to slide in from the right and loop around back to the beginning. All of our pages are already stored within a container div called `example`.

	//Create a parallax instance from our container div
	var imageCarousel = $(example).parallax();
	//Every two seconds, grab the next page, and bring it in from the right
	setInterval(function(){
		imageCarousel.next().right();
	},2000);

### Keyboard Navigation

Time for something a bit trickier. For this example we'll play around with ordering, keyboard events, and callbacks. When the view port is selected, the right and left arrow keys will move between the pages. The up arrow will flip to the first page, the down arrow will flip to the last page shown, and if we click on the ViewPort, we'll flip to Admiral Ackbar with an alert when it's done.

	var trickyExample = $(example).parallax({
		animation_time : 400,
		//The viewport comes built in with keyboard events,
		// so it's easy to listen to them.
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

			trickyExample.firstPage().flipUp();
		})
		.on('downArrow', function(){
			trickyExample.last().flipDown();
		});

	$(example).click(function(){
		//Parallax uses the HTML id to identify pages
		//To reference them directly, use VIEWPORT.pages.HTMLID
		trickyExample.pages.AdmiralAckbar.flipLeft(function(){
			alert("it's a trap!");
		});
	})

# Options

`animation_time : 800`           - The time it takes to complete the animation

`parallax_scale : 0.3`           - The scale at which the backbround will move relative to the content. Defaults to the background moving 30% of the content. Set it to `false` to disable parallaxing.

`auto_add_children : true`       - On initialization, Parallax will add each of the child elements as pages. Set this to false to completely control which elements are pages.

`resize_viewport_width : false`  - Set to `true` to have the ViewPort's width resize to match the current page's width

`resize_viewport_height : false` - Set to `true` to have the ViewPort's height resize to match the current page's height

`use_css3 : false`               - If true Parallax will use CSS3 transitions instead of jQuery animations. **Note:** Not all browsers support CSS3 transition, make sure you test!

`enable_arrow_events : false`    - If true, the ViewPort will emit events whenever the user presses arrow keys


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

`.pages` - Key/Value pair list of each page object and it's id. Parallax will use the page's HTML id as it's id if available. If not, it will generate an id for it. Useful for accessing specific pages.

`.add(jQueryObject), .add(id, jQueryObject)` - Consumes a jQuery object and adds it as a page to this ViewPort. Returns the created page object.

`.last()` - Returns the last page object that was shown.

`.current()` - Returns the current page object

`.next()` - Returns the next logical page using the page's `order` property. If it's the last page, it will loop around and return the first page.

`.previous()` - Returns the previous logical page using the page's `order` property. If it's the first page, it will loop around and return the last page.

`.firstPage()` - Returns the page with the lowest page order
`.lastPage()`  - Returns the page with the highest page order
`.remove(id)`  - Removes a page with the given id


## Page

`transitions` - Each page will adopt each method in the `Parallax.transitions` object. Calling these on a page will use that function and transition it as the currently viewed page. Currently supported transitions are `.right()`, `.left()`, `.up()`, `.down()`, `.flipRight()`, `.flipLeft()`, `.flipUp()`, and `.flipDown()`

`.order` - Every page is given a numerical value as it's `order` when it's created. ViewPort commands such as `next` and `previous` use this to determine the ordering of your pages. Parallax will simply maintain the ordering at which you added pages, however feel free to change these values to fine tune the order you want.

`.show()` - Technically a `transition` function, this will simply show the page instantly and make it current.

`.hide()` - Hides the page from view.

`.isCurrent()` - Returns a boolean on whether the page is being currently shown or not.

`.isFirstPage()` - Returns true if this page has the lowest ordering
`isLastPage()` - Retusn true if this page has the highest ordering

# Adding Pages

Using the `auto_add_children` option, all child elements of the viewport are added as pages on the creation of the Parallax object.

Any HTML element can be added as a page to a ViewPort. Parallax will try and use the element's HTML id as the pages id if possible.

# Events and Callbacks


### Events

#### Viewport
`looped`, `remove`, `add`, `beforeTransition`, `beforeTransition:[type]`, `transition`, `transition:[type]`, `leftArrow`, `upArrow`, `rightArrow`, `downArrow`

#### Page
`remove`, `beforeTransition`, `afterTransition`, `resize`, `orderChange`,



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

# TODO
* Separate id creation from page ordering
* Make archetype a mixin
* Make css3 internal and not extend jQuery
* add additonal events to both page and view port
* Getter and setter on page order
* add the ability to remove events