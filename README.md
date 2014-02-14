Check out a demo [here](http://stolksdorf.github.io/Parallax)


# Basics

Parallax is a Javascript library that uses jQuery to beautifully transition content on the page, while parallaxing it's background. At it's core it is a library for manipulating **Pages** within a **ViewPort**.

This can be as simple as an image carousel, or as complex as an entire website's navigation using arrows keys and various events. Parallax is built to be incredibly flexible and easy to use.

## Carousel Example

Here's our HTML for setting up a simple Carseoul. Our pages can be images, div's text, or even iframes.

	<div id='viewport' style='height:300px;
	background-image:url("http://www.webtexture.net/wp-content/uploads/2011/08/5-Abstract-Simple-Patterns-with-PSD-Pat-File-thumb04.jpg")'>
		<div>Just some boring text</div>
		<img src="http://i.imgur.com/ng2CT.gif"></img>
		<div style='background-color:green'>more boring text</div>
	</div>

Let's build a simple carousel. Every 2 seconds we want a new page to slide in from the right and loop around back to the beginning. All of our pages are already stored within a container div called `example`.

	//Create a parallax instance from our container div
	var imageCarousel = $(example).find('#viewport').parallax();

	//Every two seconds, grab the next page, and bring it in from the right
	setInterval(function(){
		imageCarousel.next().right();
	},2000);


# Options
`animation_time` (800)           - The time it takes to complete the animation

`parallax_scale` (0.3)           - The scale at which the backbround will move relative to the content. Defaults to the background moving 30% of the content. Set it to `false` to disable parallaxing.

`auto_add_children` (true)       - On initialization, Parallax will add each of the child elements as pages. Set this to false to completely control which elements are pages.

`resize_viewport_width` (false)  - Set to `true` to have the ViewPort's width resize to match the current page's width

`resize_viewport_height` (false) - Set to `true` to have the ViewPort's height resize to match the current page's height

`enable_arrow_events` (false)    - If true, the ViewPort will emit events whenever the user presses arrow keys


	//Play around with the options!
	var optionSandbox = $(example).find('#viewport').parallax({
		animation_time         : 400,
		parallax_scale         : 0.9,
		auto_add_children      : true,
		resize_viewport_width  : true,
		resize_viewport_height : true,
		enable_arrow_events    : false
	});

	//Click to go to the next page
	$(example).click(function(){
		optionSandbox.next().up();
	})


# Methods

## ViewPort

`.pages` - Key/Value pair list of each page object and it's id. Parallax will use the page's HTML id as it's id if available. If not, it will generate an id for it. Useful for accessing specific pages. eg. `viewport.pages.coolPageId.next()`

`.add(jQueryObject), .add(id, jQueryObject)` - Consumes a jQuery object and adds it as a page to this ViewPort. Returns the created page object.

`.last()` - Returns the last page object that was shown.

`.current()` - Returns the current page object

`.next()` - Returns the next logical page using the page's `order` property. If it's the last page, it will loop around and return the first page.

`.previous()` - Returns the previous logical page using the page's `order` property. If it's the first page, it will loop around and return the last page.

`.firstPage()` - Returns the page with the lowest page order
`.lastPage()`  - Returns the page with the highest page order
`.remove(id)`  - Removes a page with the given id


## Page

`transitions` - Each page will adopt each method in the `Parallax.transitions` object. Calling these on a page will use that function and transition it as the currently viewed page. Currently supported transitions are `.right()`, `.left()`, `.up()`, and `.down()`

`.order` - Every page is given a numerical value as it's `order` when it's created. ViewPort commands such as `next` and `previous` use this to determine the ordering of your pages. Parallax will simply maintain the ordering at which you added pages, however feel free to change these values to fine tune the order you want.

`.show()` - Technically a `transition` function, this will simply show the page instantly and make it current.

`.hide()` - Hides the page from view.

`.isCurrent()` - Returns a boolean on whether the page is being currently shown or not.

`.isFirstPage()` - Returns true if this page has the lowest ordering
`.isLastPage()` - Returns true if this page has the highest ordering



# Events and Callbacks

## Callbacks

Whenever you call a transition on a page you can always add a callback to it for when it's completed

	var callbackExample = $(example).find('#viewport').parallax();

	callbackExample.next().down(function(){
		alert('Completed!');
	});


## Events

Both the **Viewport** and **Pages** emit events that can be listened. You can listen to events by using `.on(eventName, action)`. Here is the list of emitted events.

	var eventExample = $(example).find('#viewport').parallax();

	eventExample.on('after_transition:up', function(){
		alert('Completed!');
	})

	eventExample.next().up();

### Viewport
* `remove`
* `add`
* `before_transition`
* `before_transition:[type]`
* `after_transition`
* `after_transition:[type]`
* `leftArrow`
* `upArrow`
* `rightArrow`
* `downArrow`

### Page
* `before_transition`
* `before_transition:[type]`
* `after_transition`
* `after_transition:[type]`


# Advanced Examples

## Keyboard Navigation

For this example we'll play around with ordering, keyboard events, and callbacks. When the view port is selected, the right, left arrow keys will move between the pages. The up arrow key will always go to the first page, and the down arrow key will always go to the last page.

	var keyboardNav = $(example).find('#viewport').parallax({
		animation_time : 400,

		//The viewport comes built in with keyboard events
		enable_arrow_events : true
	});

	keyboardNav
		.on('leftArrow', function(){
			keyboardNav.previous().left();
		})
		.on('rightArrow', function(){
			keyboardNav.next().right();
		})
		.on('upArrow', function(){
			keyboardNav.firstPage().up();
		})
		.on('downArrow', function(){
			keyboardNav.lastPage().down();
		});


## Custom Transitions

You can create your own transitions and add them to Parallax. We're going to make a fade in transition.

	Parallax.transitions.fadeIn = function(newPage, currentPage, viewPort, options, finished){
		currentPage.fadeOut(options.animation_time);
		newPage.css({
			left : 0,
			top : 0
		}).fadeIn(options.animation_time, finished);
	};

	var customTransition = $(example).find('#viewport').parallax();

	$(example).click(function(){
		customTransition.next().fadeIn();
	})




# Other

## Improvements over the old library
* Use a target div, instead of the window
* Added css3 animation support
* Page ordering allows for intutive commands like getting the next page or the first page
* Keyboard arrow support
* Easier page adding
* Full use of events
* Custom animation support

## TODO
* Separate id creation from page ordering
* Make archetype a mixin
* Make css3 internal and not extend jQuery
* add additonal events to both page and view port
* Getter and setter on page order
* add the ability to remove events
* current and last page should be stored as ids