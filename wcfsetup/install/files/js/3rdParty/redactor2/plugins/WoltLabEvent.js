$.Redactor.prototype.WoltLabEvent = function() {
	"use strict";
	
	return {
		init: function() {
			this._callbacks = [];
			this._elementId = this.$element[0].id;
			elData(this.$editor[0], 'element-id', this._elementId);
			
			require(['EventHandler'], (function(EventHandler) {
				this.WoltLabEvent._setEvents(EventHandler);
				
				EventHandler.add('com.woltlab.wcf.redactor2', 'destroy_' + this._elementId, (function () {
					EventHandler.removeAllBySuffix('com.woltlab.wcf.redactor2', this._elementId);
				}).bind(this))
			}).bind(this));
			
			this.events.iterateObserver = (function(mutation) {
				var stop = false;
				
				// target
				// WoltLab modification: do not suppress event if nodes have been added
				// WoltLab modification 2: suppress broken MutationRecords in Vivaldi 1.13 that yield attribute changes without the attribute name
				// WoltLab modification 3: do not suppres event if nodes have been removed
				// WoltLab modification 4: suppress mutations caused by `focus-visible.js`
				if (
					(
						(this.opts.type === 'textarea' || this.opts.type === 'div')
						&& (!this.detect.isFirefox() && mutation.target === this.core.editor()[0])
						&& (mutation.type === 'childList' && !mutation.addedNodes.length && !mutation.removedNodes.length)
					)
					|| mutation.attributeName === 'class' && mutation.target === this.core.editor()[0]
					|| mutation.attributeName === 'data-vivaldi-spatnav-clickable'
					|| mutation.type === 'attributes' && mutation.attributeName === null
					|| mutation.attributeName === "data-focus-visible-added"
				)
				{
					stop = true;
				}
				
				if (!stop)
				{
					this.observe.load();
					this.events.changeHandler();
				}
			}).bind(this);
			
			// re-attach the observer
			this.events.observer.disconnect();
			this.events.createObserver();
			this.events.setupObserver();
		},
		
		_setEvents: function(EventHandler) {
			var elementId = this.$element[0].id;
			
			var observeLoad = this.observe.load;
			this.observe.load = (function() {
				observeLoad.call(this);
				
				EventHandler.fire('com.woltlab.wcf.redactor2', 'observe_load_' + elementId, {
					editor: this.$editor[0]
				});
			}).bind(this);
			
			this.opts.callbacks.keyup = function(event) {
				var data = {
					cancel: false,
					event: event
				};
				
				EventHandler.fire('com.woltlab.wcf.redactor', 'keyup_' + elementId, data);
				
				return (data.cancel === false);
			};
			
			// provide editor message on callback
			EventHandler.add('com.woltlab.wcf.redactor2', 'getText_' + elementId, (function(data) {
				data.message = this.code.get();
			}).bind(this));
			
			// clear editor content on reset
			EventHandler.add('com.woltlab.wcf.redactor2', 'reset_' + elementId, (function() {
				this.code.set('');
			}).bind(this));
		},
		
		register: function(callbackName, callback) {
			require(['EventHandler'], (function(EventHandler) {
				var uuid = this.uuid;
				
				if (this._callbacks.indexOf(callbackName) === -1) {
					this.opts.callbacks[callbackName] = (function (event) {
						var data = {
							cancel: false,
							event: event,
							redactor: this
						};
						
						EventHandler.fire('com.woltlab.wcf.redactor2', callbackName + '_' + uuid + '_' + this.WoltLabEvent._elementId, data);
						
						return (data.cancel === false);
					}).bind(this);
					
					this._callbacks.push(callbackName);
				}
				
				require(['EventHandler'], (function(EventHandler) {
					EventHandler.add('com.woltlab.wcf.redactor2', callbackName + '_' + uuid + '_' + this.WoltLabEvent._elementId, callback);
				}).bind(this));
			}).bind(this));
		}
	};
};
