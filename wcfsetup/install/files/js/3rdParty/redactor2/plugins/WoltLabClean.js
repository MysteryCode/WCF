$.Redactor.prototype.WoltLabClean = function() {
	"use strict";
	
	return {
		init: function () {
			var mpOnSet = this.clean.onSet;
			this.clean.onSet = (function (html) {
				html = html.replace(/\u200B/g, '');
				
				// fix ampersands being replaced
				html = html.replace(/&amp;/g, '@@@WCF_AMPERSAND@@@');
				
				html = mpOnSet.call(this, html);
				
				// restore ampersands
				html = html.replace(/@@@WCF_AMPERSAND@@@/g, '&amp;');
				
				// remove iframes smuggled into the HTML by the user
				// they're removed on the server anyway, but keeping
				// them in the wysiwyg may lead to false impressions
				var div = elCreate('div');
				div.innerHTML = html;
				elBySelAll('iframe', div, elRemove);
				html = div.innerHTML;
				
				return html;
			}).bind(this);
			
			var mpOnSync = this.clean.onSync;
			this.clean.onSync = (function (html) {
				var div = elCreate('div');
				div.innerHTML = html;
				var replacements = {};
				
				elBySelAll('pre', div, function (pre) {
					var uuid = WCF.getUUID();
					
					replacements[uuid] = pre.textContent;
					pre.textContent = uuid;
				});
				
				// handle <p> with trailing `<br>\u200B`
				elBySelAll('p', div, function (p) {
					var br = p.lastElementChild;
					if (br && br.nodeName === 'BR') {
						// check if there is only whitespace afterwards
						if (br.nextSibling && br.nextSibling.textContent.match(/^[\s\u200B]+$/)) {
							var newP = elCreate('p');
							newP.innerHTML = '<br>';
							p.parentNode.insertBefore(newP, p.nextSibling);
							
							p.removeChild(br.nextSibling);
							p.removeChild(br);
						}
					}
				});
				
				html = div.innerHTML;
				
				html = html.replace(/<p>\u200B<\/p>/g, '<p><br></p>');
				
				// fix ampersands being replaced
				html = html.replace(/&amp;/g, '@@@WCF_AMPERSAND@@@');
				
				html = mpOnSync.call(this, html);
				
				// restore ampersands
				html = html.replace(/@@@WCF_AMPERSAND@@@/g, '&amp;');
				
				div.innerHTML = html;
				
				elBySelAll('pre', div, function (pre) {
					if (replacements.hasOwnProperty(pre.textContent)) {
						pre.textContent = replacements[pre.textContent];
					}
				});
				
				html = div.innerHTML;
				
				return html;
			}).bind(this);
			
			var mpSavePreFormatting = this.clean.savePreFormatting;
			this.clean.savePreFormatting = (function (html) {
				var mpCleanEncodeEntities = this.clean.encodeEntities;
				this.clean.encodeEntities = function(str) {
					return WCF.String.escapeHTML(str);
				};
				
				html = mpSavePreFormatting.call(this, html);
				
				// revert to original method
				this.clean.encodeEntities = mpCleanEncodeEntities;
				
				return html;
			}).bind(this);
			
			var mpOnPaste = this.clean.onPaste;
			this.clean.onPaste = (function (html, data, insert) {
				if (data.pre) {
					return mpOnPaste.call(this, html, data, insert);
				}
				
				var div = elCreate('div');
				div.innerHTML = html;
				
				var element, elements = elBySelAll('[style]', div), property, removeStyles;
				for (var i = 0, length = elements.length; i < length; i++) {
					element = elements[i];
					
					removeStyles = [];
					for (var j = 0, innerLength = element.style.length; j < innerLength; j++) {
						property = element.style[j];
						
						//noinspection JSUnresolvedVariable
						if (this.opts.woltlab.allowedInlineStyles.indexOf(property) === -1) {
							removeStyles.push(property);
						}
					}
					
					removeStyles.forEach(function (property) {
						element.style.removeProperty(property);
					});
				}
				
				elBySelAll('span', div, function (span) {
					if (!span.style.length || !span.hasAttribute('style')) {
						while (span.childNodes.length) {
							span.parentNode.insertBefore(span.childNodes[0], span);
						}
						
						elRemove(span);
					}
				});
				
				elBySelAll('br', div, function (br) {
					br.parentNode.insertBefore(document.createTextNode('@@@WOLTLAB-BR-MARKER@@@'), br);
				});
				
				html = mpOnPaste.call(this, div.innerHTML, data, insert);
				
				html = html.replace(/@@@WOLTLAB-BR-MARKER@@@/g, '<woltlab-br-marker></woltlab-br-marker>');
				
				div.innerHTML = html;
				
				elBySelAll('woltlab-br-marker', div, function (marker) {
					var parent = marker.parentNode;
					
					if (parent.nodeName === 'P') {
						var p = elCreate('p');
						while (marker.nextSibling) {
							p.appendChild(marker.nextSibling);
						}
						p.appendChild(elCreate('br'));
						
						parent.parentNode.insertBefore(p, parent.nextSibling);
						
						var previous = marker.previousElementSibling;
						if (previous && previous.nodeName === 'BR') {
							elRemove(previous);
						}
					}
					else {
						parent.insertBefore(elCreate('br'), marker);
					}
					
					elRemove(marker);
				});
				
				return div.innerHTML;
			}).bind(this);
			
			var storage = [];
			var addToStorage = function (element, attributes) {
				var attr, attrs = {}, value;
				for (var i = 0, length = attributes.length; i < length; i++) {
					attr = attributes[i];
					value = elAttr(element, attr);
					
					// Chrome likes to break the font-family tag by encoding quotes
					// that are then no longer accepted by `style.setPropertyValue()`
					if (attr === 'style' && element.style.length === 0 && value.indexOf('font-family') === 0) {
						value = value.replace(/&quot;/g, '');
					}
					
					attrs[attr] = value;
				}
				
				storage.push({
					element: element,
					attributes: attrs
				});
			};
			
			var mpConvertTags = this.clean.convertTags;
			this.clean.convertTags = (function(html, data) {
				var div = elCreate('div');
				div.innerHTML = html;
				
				// reset tag storage
				storage = [];
				
				WCF.System.Event.fireEvent('com.woltlab.wcf.redactor2', 'convertTags_' + this.$element[0].id, {
					addToStorage: addToStorage,
					div: div
				});
				
				elBySelAll('span', div, function (span) {
					addToStorage(span, ['style']);
				});
				
				storage.forEach(function (item, i) {
					item.element.outerHTML = '###custom' + i + '###' + item.element.innerHTML + '###/custom' + i + '###';
				});
				
				return mpConvertTags.call(this, div.innerHTML, data);
			}).bind(this);
			
			var mpReconvertTags = this.clean.reconvertTags;
			this.clean.reconvertTags = (function(html, data) {
				if (storage.length) {
					html = html.replace(/###(\/?)custom(\d+)###/g, '<$1woltlab-custom-tag data-index="$2">');
					
					var div = elCreate('div');
					div.innerHTML = html;
					
					elBySelAll('woltlab-custom-tag', div, function (element) {
						var index = ~~elData(element, 'index');
						
						if (storage[index]) {
							var itemData = storage[index];
							var newElement = elCreate(itemData.element.nodeName);
							for (var property in itemData.attributes) {
								if (itemData.attributes.hasOwnProperty(property)) {
									elAttr(newElement, property, itemData.attributes[property]);
								}
							}
							
							element.parentNode.insertBefore(newElement, element);
							while (element.childNodes.length) {
								newElement.appendChild(element.childNodes[0]);
							}
						}
						
						elRemove(element);
					});
					
					html = div.innerHTML;
				}
				
				// reconvert links as the regex can be overly greedy sometimes
				if (data.links) {
					// prevent the original regex from being executed again
					data.links = false;
					
					// We try to avoid the regex to consume too many parts
					// by having it work from the back to the front. Please
					// keep in mind that the parts are reversed, so they
					// actually appear in inverted order
					var tmp = html.split(/(###\/a###)/gi).reverse();
					var part, nextPart;
					for (var i = 1, length = tmp.length; i < length; i++) {
						if (i + 1 === length) {
							break;
						}
						
						part = tmp[i];
						nextPart = tmp[i + 1];
						
						// split by '###a' to find all possible start positions
						var anchors = nextPart.split(/(###a)/gi).reverse();
						var composite;
						for (var j = 1, innerLength = anchors.length; j < innerLength; j++) {
							if (j + 1 === innerLength) {
								break;
							}
							
							composite = anchors[j] + anchors[j - 1];
							if (composite.match(/###a(.*?)href="(.*?)"(.*?)###(.*?)/i)) {
								anchors[j] = '';
								anchors[j - 1] = composite.replace(/###a(.*?)href="(.*?)"(.*?)###(.*?)/i, '<a$1href="$2"$3>$4');
								
								tmp[i] = '</a>';
								tmp[i + 1] = anchors.reverse().join('');
								
								break;
							}
						}
					}
					
					html = tmp.reverse().join('');
				}
				
				return mpReconvertTags.call(this, html, data);
			}).bind(this);
			
			this.clean.removeSpans = function(html) {
				return html;
			};
		}
	}
};
