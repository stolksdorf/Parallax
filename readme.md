
Effortlessly add transitions with parallaxing backgrounds to your webpage


# Basic Use

Parallax at it's core is a library for manipulating **pages** within a **viewport**. This can be as simple as an image carousel, or you can use it for an entire website's navigation. Parallax is built to be incredibly flexible and easy to use. Let's dive in.

### Image Carousel

Let's build a simple image carousel. Every 2 seconds wee want a new image to slide in from the right and loop around back to the beginning. All of our images are already stored within a container div called `example`.

	//Create a parallax instance from our container div
	var imageCarousel = $(example).parallax();

	//Eveyr two seconds, grab the next page, and bring it in from the right
	setTimeout(function(){
		imageCarousel.next().right();
	},2000);

### Keyboard Navigation

Time for something a bit trickier. When the view port is selected, the right and left arrow keys will move between the images. The up arrow will flip to the first image, and the down arrow will flip to the last page shown.

The viewport comes built in with keyboard events, so it's easy to listen to them.

	var adventureTime = $(example).parallax({
		enable_arrow_events : true
	});

	adventureTime.on('keyLeft', function(){
		adventureTime.last().left();
	});
	adventureTime.on('keyRight', function(){
		adventureTime.next().right();
	});
	adventureTime.on('keyUp', function(){
		//Parallax uses the HTML id to identify pages.
		//To reference them directly, use VIEWPORT.pages.HTMLID
		adventureTime.pages.Page1.flipUp();
	});
	adventureTime.on('keyDown', function(){
		adventureTime.last().flipDown();
	});

# Options

# ViewPort and Page API

The following is a list of all the functions available for each



# Adding Pages

Using the `auto_add_children` option, all child elements of the viewport are added as pages on the creation of the Parallax object. You can disable this and add arbitary elements as pages

# Events and Callbacks

Parallax supports the use of simple events. It's incredibly easy to add listeners to any parallax page.

### Events


### Keyboard Events


### Callbacks






# Advanced Usage

## Changing Ordering

## Custom transitions

## CSS3 Transitions