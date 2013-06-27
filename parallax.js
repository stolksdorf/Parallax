(function($){
	window.Parallax = {
		defaultOptions : {
			animation_time : 800,
			parallax_scale : 0.0,
			auto_add_children : true,
			resize_viewport_width : false,
			resize_viewport_height : false
		},
		parallaxMethods : {
			right : function(viewPort, options){
				viewPort.animate({
					'background-position-x': '+=' + -viewPort.width() * options.parallax_scale + 'px'
				}, options.animation_time);
			},
			left : function(viewPort, options){
				viewPort.animate({
					'background-position-x': '+=' + viewPort.width() * options.parallax_scale + 'px'
				}, options.animation_time);
			},
			top : function(viewPort, options){
				viewPort.animate({
					'background-position-y': '+=' + -viewPort.width() * options.parallax_scale + 'px'
				}, options.animation_time);
			},
			bottom : function(viewPort, options){
				viewPort.animate({
					'background-position-y': '+=' + viewPort.width() * options.parallax_scale + 'px'
				}, options.animation_time);
			}
		},
		transitions : {
			show :function(newPage, currentPage, viewPort, options, finished){
				currentPage.hide();
				newPage.show();
				newPage.css({
					left : 0,
					top : 0
				});
				finished();
			},
			shoveRight : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.right(viewPort, options);
				currentPage.animate({
					left : -viewPort.width()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					left : viewPort.width(),
					top : 0
				}).animate({
					left : 0
				}, options.animation_time, finished);
			},
			shoveLeft : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.left(viewPort, options);
				currentPage.animate({
					left : viewPort.width()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					left : -viewPort.width(),
					top : 0
				}).animate({
					left : 0
				}, options.animation_time, finished);
			},
			shoveUp : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.top(viewPort, options);
				currentPage.animate({
					top : -viewPort.height()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					top : viewPort.height(),
					left : 0
				}).animate({
					top : 0
				}, options.animation_time, finished);
			},
			shoveDown : function(newPage, currentPage, viewPort, options, finished){
				Parallax.parallaxMethods.bottom(viewPort, options);
				currentPage.animate({
					top : viewPort.height()
				}, options.animation_time, function(){
					currentPage.hide();
				});
				newPage.show().css({
					top : -viewPort.height(),
					left : 0
				}).animate({
					top : 0
				}, options.animation_time, finished);
			}
		}
	};


	//TODO : !!!
	//Object.create Shim


	//underscore Shim
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

	//Basic events and prototypical inheritance
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
		},
		trigger : function(eventName){
			this.__events__ = this.__events__ || {};
			if(this.__events__[eventName]){
				for(var i = 0; i < this.__events__[eventName].length; i++) {
					this.__events__[eventName][i].apply(this, Array.prototype.slice.apply(arguments).slice(1));
				}
			}
		}
	};

	var ViewPort = Object.create(Archetype).methods({
		initialize : function(container, options)
		{
			this.pages = {};
			this.options = _.extend(Parallax.defaultOptions, options);

			this.element = container.css({
				'position' : 'relative',
				'overflow' : 'hidden'
			});

			this.pageCount = 0;

			if(this.options.auto_add_children){
				this.addChildren();
			}
			this.next().show();
			return this;
		},
		add : function(pageElement)
		{
			var self = this;
			var newPage = Object.create(Page).initialize($(pageElement), this.element, this.pageCount);
			this.pageCount++;

			this.pages[newPage.id] = newPage;

			newPage.on('transition', function(transitionType, page){
				if(page.id=== self.current().id || self._inTransition){
					return;
				}
				page.trigger('before_transition');
				self.trigger('before_transition', page);
				self._inTransition = true;
				if(self.options.resize_viewport_width){
					self.element.animate({
						width : page.element.width()
					}, self.options.animation_time);
				}
				if(self.options.resize_viewport_height){
					self.element.animate({
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
					}
				);
			});
			return newPage;
		},
		addChildren : function()
		{
			var self = this;
			this.element.children().each(function(index, page){
				self.add(page);
			});
			return this;
		},

		last : function()
		{
			if(typeof this._lastPage === 'undefined'){
				return Object.create(Page).initialize($(), this, -1);
			}
			return this._lastPage;
		},

		current : function()
		{
			if(typeof this._currentPage === 'undefined'){
				return Object.create(Page).initialize($(), this, -1);
			}
			return this._currentPage;
		},
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
	});

	var Page = Object.create(Archetype).methods({
		initialize : function(element, viewPort, order)
		{
			var self      = this;
			this.viewPort = viewPort;
			this.element  = element.css('position', 'absolute').hide();
			this.id       = this.element.attr('id') || 'page' + order;
			this.order    = order;

			//add the abilities
			_.each(Parallax.transitions, function(fn, funcName){
				self[funcName] = function(){
					self.trigger('transition', funcName, self);
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
	});



	$.fn.parallax = function(options) {
		return Object.create(ViewPort).initialize($(this), options);
	};
})(jQuery);
