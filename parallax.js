;(function($){
	/**
	 * Shim for Object.create, in case the browser doesn't support it
	 */
	if (typeof Object.create === 'undefined') {
		Object.create = function (o) {
			function F() {};
			F.prototype = o;
			return new F();
		};
	}

	/**
	 * Just a shim for the used parts of Underscore
	 */
	var _ = _ || {
		extend : function(obj1, obj2){
			for(var propName in obj2){
				if(obj2.hasOwnProperty(propName)){ obj1[propName] = obj2[propName]; }
			}
			return obj1;
		},
		each : function(obj, fn){
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ fn(obj[propName], propName); }
			}
		},
		map : function(obj, fn){
			var result = [];
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ result.push(fn(obj[propName], propName)); }
			}
			return result;
		},
		reduce : function(obj, fn, memo){
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ memo = fn(memo, obj[propName], propName); }
			}
			return memo;
		}
	};

	/**
	 * Base object for events and inheritance
	 */
	var Archetype = {
		initialize : function(){
			return this;
		},
		methods : function(methods){
			for(var methodName in methods){
				this[methodName] = methods[methodName];
			}
			return this;
		},
		on : function(eventName, event){
			this.__events__ = this.__events__ || {};
			this.__events__[eventName] = this.__events__[eventName] || [];
			this.__events__[eventName].push(event);
			return this;
		},
		trigger : function(eventName){
			this.__events__ = this.__events__ || {};
			if(this.__events__[eventName]){
				for(var i = 0; i < this.__events__[eventName].length; i++) {
					this.__events__[eventName][i].apply(this, Array.prototype.slice.apply(arguments).slice(1));
				}
			}
			return this;
		}
	};

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

	/**
	 * Global accessable methods of Parallax
	 * Users can add/edit these
	 */
	window.Parallax = {
		defaultOptions : {
			animation_time         : 800,
			parallax_scale         : 0.3,
			auto_add_children      : true,
			resize_viewport_width  : false,
			resize_viewport_height : false,
			use_css3               : false,
			enable_arrow_events     : false
		},
		parallaxMethods : {
			right : function(viewPort, options){
				if(options.parallax_scale){
					viewPort.p_animate({
						'background-position-x': '+=' + -viewPort.width() * options.parallax_scale + 'px'
					}, options.animation_time);
				}
			},
			left : function(viewPort, options){
				if(options.parallax_scale){
					viewPort.p_animate({
						'background-position-x': '+=' + viewPort.width() * options.parallax_scale + 'px'
					}, options.animation_time);
				}
			},
			up : function(viewPort, options){
				if(options.parallax_scale){
					viewPort.p_animate({
						'background-position-y': '+=' + -viewPort.width() * options.parallax_scale + 'px'
					}, options.animation_time);
				}
			},
			down : function(viewPort, options){
				if(options.parallax_scale){
					viewPort.p_animate({
						'background-position-y': '+=' + viewPort.width() * options.parallax_scale + 'px'
					}, options.animation_time);
				}
			}
		},
		transitions : {
			show :function(newPage, currentPage, viewPort, options, finished){
				currentPage.hide();
				newPage.show().css({
					left : 0,
					top : 0
				});
				if(viewPort.height() === 0){
					viewPort.height(newPage.height());
				}
				finished();
			},
			right : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.right(viewPort, options);
				currentPage.p_animate({
					left : -viewPort.width()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					left : viewPort.width(),
					top : 0
				}).p_animate({
					left : 0
				}, options.animation_time, finished);
			},
			left : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.left(viewPort, options);
				currentPage.p_animate({
					left : viewPort.width()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					left : -viewPort.width(),
					top : 0
				}).p_animate({
					left : 0
				}, options.animation_time, finished);
			},
			up : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.up(viewPort, options);
				currentPage.p_animate({
					top : -viewPort.height()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					top : viewPort.height(),
					left : 0
				}).p_animate({
					top : 0
				}, options.animation_time, finished);
			},
			down : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.down(viewPort, options);
				currentPage.p_animate({
					top : viewPort.height()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					top : -viewPort.height(),
					left : 0
				}).p_animate({
					top : 0
				}, options.animation_time, finished);
			},
			flipRight : function(newPage, currentPage, viewPort, options, finished){
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
			},
			flipLeft : function(newPage, currentPage, viewPort, options, finished){
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
			},
			flipUp : function(newPage, currentPage, viewPort, options, finished){
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
			},
			flipDown : function(newPage, currentPage, viewPort, options, finished){
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
		}
	};


	var ViewPort = Object.create(Archetype).methods({
		initialize : function(container, options)
		{
			var self = this;
			this.pages = {};
			this.pageCount = 0;
			this.options = _.extend(Parallax.defaultOptions, options);

			this.element = container.css({
				'position' : 'relative',
				'overflow' : 'hidden'
			});

			//Enable regular jQuery animation, or use css3 animations
			$.fn.p_animate = $.fn.animate;
			if(this.options.use_css3){
				$.fn.p_animate = $.fn.css3animate;
			}

			//Setup keyboard events
			if(this.options.enable_arrow_events){
				this.element.keyup(function(event){
					if(event.keyCode === 37){
						self.trigger('leftArrow');
					} else if(event.keyCode === 38){
						self.trigger('upArrow');
					} else if(event.keyCode === 39){
						self.trigger('rightArrow');
					} else if(event.keyCode === 40){
						self.trigger('downArrow');
					}
				});
			}

			if(this.options.auto_add_children){
				this.addChildren();
			}

			this.next().show();
			return this;
		},
		/**
		 * Takes a jQuery element, and adds it as a page to the viewport
		 */
		add : function(pageElement)
		{
			var self = this;
			var newPage = Object.create(Page).initialize($(pageElement), this.element, this.pageCount);
			this.pageCount++;

			this.pages[newPage.id] = newPage;

			newPage.on('transition', function(transitionType, page, callback){
				if(page.id === self.current().id){ return;}
				if(self._inTransition){
					//add queueing in here
					return;
				}
				page.trigger('before_transition');
				self.trigger('before_transition', page);
				self._inTransition = true;
				if(self.options.resize_viewport_width){
					self.element.p_animate({
						width : page.element.width()
					}, self.options.animation_time);
				}
				if(self.options.resize_viewport_height){
					self.element.p_animate({
						height : page.element.height()
					}, self.options.animation_time);
				}
				Parallax.transitions[transitionType](
					page.element,
					self.current().element,
					self.element,
					self.options,
					function(){
						self._inTransition = false;
						self._lastPage = self._currentPage;
						self._currentPage = page;
						page.trigger('after_transition');
						self.trigger('after_transition', page);
						if(typeof callback === 'function'){ callback();}
					}
				);
			});
			return newPage;
		},
		//Iterates over the view port and adds all child elements as pages
		addChildren : function()
		{
			var self = this;
			this.element.children().each(function(index, page){
				self.add(page);
			});
			return this;
		},
		//Return the last page object
		last : function()
		{
			if(typeof this._lastPage === 'undefined'){
				return Object.create(Page).initialize($(), this, -1);
			}
			return this._lastPage;
		},
		//Retuns the current page object
		current : function()
		{
			if(typeof this._currentPage === 'undefined'){
				return Object.create(Page).initialize($(), this, -1);
			}
			return this._currentPage;
		},
		//Returns the next logical page in the order. Will loop around
		next : function(){
			if(this.pageCount === 0) return;
			var pagesByOrder = _.reduce(this.pages, function(result, page, pageId){
				result[pageId] = page.order;
				return result;
			},{});

			var currentOrder = this.current().order,
				max,
				nextPageId = _.reduce(pagesByOrder, function(result, order, pageId){
				if(order > currentOrder && (order < max || typeof max === 'undefined')){
					max = order;
					return pageId;
				}
				return result;
			}, undefined);

			//If we hit the last page, loop around to the beginning
			if(typeof nextPageId === 'undefined'){
				var min;
				var nextPageId = _.reduce(pagesByOrder, function(result, order, pageId){
					if(order < min || typeof min === 'undefined'){
						min = order;
						return pageId;
					}
					return result;
				}, undefined);
			}

			return this.pages[nextPageId];
		},

		//TODO: Add a PRevious command
	});

	var Page = Object.create(Archetype).methods({
		initialize : function(element, viewPort, order)
		{
			var self	  = this;
			this.viewPort = viewPort;
			this.element  = element.css('position', 'absolute').hide();
			this.id       = this.element.attr('id') || 'page' + order;
			this.order    = order;

			//Add the transitions
			_.each(Parallax.transitions, function(fn, funcName){
				self[funcName] = function(callback){
					self.trigger('transition', funcName, self, callback);
				};
			});

			return this;
		},
		hide : function()
		{
			this.element.hide();
			return this;
		},
		isCurrent  : function()
		{
			return this.viewPort.current().id === this.id;
		},
		//TODO: Add isFirst(), and isLast()
	});

	$.fn.parallax = function(options) {
		return Object.create(ViewPort).initialize($(this), options);
	};
})(jQuery);
