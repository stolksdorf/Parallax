;(function($){
	//Shim for Object.create, in case the browser doesn't support it
	Object.create = Object.create || function(proto) {
		function Obj(){};
		Obj.prototype = proto;
		return new Obj();
	};

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
		},
		max : function(obj, fn){
			var val, result, compareval;
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){
					compareval = fn(obj[propName], propName);
					if(typeof val === 'undefined' || compareval > val){
						val = compareval;
						result = obj[propName];
					}
				}
			}
			return result;
		},
		min : function(obj, fn){
			var val, result, compareval;
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){
					compareval = fn(obj[propName], propName);
					if(typeof val === 'undefined' || compareval < val){
						val = compareval;
						result = obj[propName];
					}
				}
			}
			return result;
		}
	};

	/**
	 * Base object for events and inheritance
	 */
	var BaseObject = {
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
			animation_fn           : $.fn.animate,
			enable_arrow_events    : false
		},
		//These methods are used within the transitions functions to parallax the background
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
				if(viewPort.height() < newPage.height()){
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
			}
		}
	};

	var ViewPort = Object.create(BaseObject).methods({
		initialize : function(container, options){
			var self = this;
			this.pages = {};
			this.pageCount = 0;
			this.options = _.extend(Parallax.defaultOptions, options);

			//Dummy page is used to avoid 'undefined' when using next(), current(), etc.
			this.dummyPage = Object.create(Page).initialize($(), this, -1);

			this.element = container.css({
				'position' : 'relative',
				'overflow' : 'hidden'
			});

			$.fn.p_animate = this.options.animation_fn;

			//Setup keyboard events
			if(this.options.enable_arrow_events){
				this.element
					.attr('tabindex', '1')
					.css('outline', 'none')
					.keydown(function(event){
						if(event.keyCode === 37){
							self.trigger('leftArrow');
							return false;
						} else if(event.keyCode === 38){
							self.trigger('upArrow');
							return false;
						} else if(event.keyCode === 39){
							self.trigger('rightArrow');
							return false;
						} else if(event.keyCode === 40){
							self.trigger('downArrow');
							return false;
						}
					});
			}

			if(this.options.auto_add_children){
				this.addChildren();
			}
			this.firstPage().show();
			return this;
		},
		/**
		 * Takes a jQuery element, and adds it as a page to the viewport
		 */
		add : function(pageElement, arg2){
			var self = this, id;
			if(arg2 instanceof $){
				id = pageElement;
				pageElement = arg2;
			}

			var newPage = Object.create(Page).initialize(pageElement, this, this.pageCount, id);
			this.pageCount++;
			this.pages[newPage.id] = newPage;
			newPage.on('transition', function(transitionType, page, callback){
				self.transitionPage(transitionType, page, callback);
			});
			this.trigger('add', newPage);
			return newPage;
		},
		remove : function(pageId){
			this.trigger('remove', this.pages[pageId]);
			if(this.current().id === pageId){
				this.next().show();
			}
			delete this.pages[pageId];
			return this;
		},
		//Iterates over the view port and adds all child elements as pages
		addChildren : function(){
			var self = this;
			this.element.children().each(function(index, page){
				self.add($(page));
			});
			return this;
		},
		transitionPage : function(transitionType, page, callback){
			var self = this;
			if(page.id === this.current().id){return;}
			if(this._inTransition){ return };

			if(this.element.height() === 0){
				this.element.height(page.element.height());
			}

			this._lastPage = this._currentPage;
			this._currentPage = page;

			page.trigger('before_transition:' + transitionType);
			page.trigger('before_transition');
			this.trigger('before_transition:' + transitionType, page);
			this.trigger('before_transition', page);
			this._inTransition = true;
			if(this.options.resize_viewport_width){
				this.element.p_animate({
					width : page.element.width()
				}, {
					duration : this.options.animation_time,
					queue : false
				});
			}
			if(this.options.resize_viewport_height){
				this.element.p_animate({
					height : page.element.height()
				}, {
					duration : this.options.animation_time,
					queue : false
				});
			}
			Parallax.transitions[transitionType](
				page.element,
				this.last().element,
				this.element,
				this.options,
				function(){
					self._inTransition = false;
					if(typeof callback === 'function'){callback();}
					page.trigger('after_transition:' + transitionType);
					page.trigger('after_transition');
					self.trigger('after_transition:' + transitionType, page);
					self.trigger('after_transition', page);
				}
			);
		},
		//Return the last page object
		last : function(){
			return this._lastPage || this.dummyPage;
		},
		//Retuns the current page object
		current : function(){
			return this._currentPage || this.dummyPage;
		},
		//Returns the next logical page in the order. Will loop around.
		next : function(){
			var currentOrderNum = this.current().order;
			var filterBigger = _.reduce(this.pages, function(result, page, pageId){
				if(page.order > currentOrderNum){result[pageId] = page;}
				return result;
			},{});
			var findMin = _.min(filterBigger, function(page){return page.order;});
			if(typeof findMin === 'undefined'){ return this.firstPage();}
			return findMin;
		},
		previous : function(){
			var currentOrderNum = this.current().order;
			var filterSmaller = _.reduce(this.pages, function(result, page, pageId){
				if(page.order < currentOrderNum){result[pageId] = page;}
				return result;
			},{});
			var findMax = _.max(filterSmaller, function(page){return page.order;});
			if(typeof findMax === 'undefined'){ return this.lastPage();}
			return findMax;
		},
		firstPage : function(){
			return _.min(this.pages, function(page){return page.order;}) || this.dummyPage;
		},
		lastPage : function(){
			return _.max(this.pages, function(page){return page.order;}) || this.dummyPage;
		},
	});

	var Page = Object.create(BaseObject).methods({
		initialize : function(element, viewPort, order, id){
			var self	  = this;
			this.viewPort = viewPort;
			this.element  = element.css('position', 'absolute').hide();
			this.id       = id || this.element.attr('id') || 'page' + order;
			this.order    = order;

			//Add the transitions
			_.map(Parallax.transitions, function(fn, funcName){
				self[funcName] = function(callback){
					self.trigger('transition', funcName, self, callback);
					return self;
				};
			});
			return this;
		},
		hide : function(){
			this.element.hide();
			return this;
		},
		isCurrent : function(){
			return this.viewPort.current().id === this.id;
		},
		isFirstPage : function(){
			return this.viewPort.firstPage().id === this.id;
		},
		isLastPage : function(){
			return this.viewPort.lastPage().id === this.id;
		},
	});

	$.fn.parallax = function(options) {
		return Object.create(ViewPort).initialize($(this), options);
	};
})(jQuery);
