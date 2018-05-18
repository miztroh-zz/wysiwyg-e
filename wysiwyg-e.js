import {LitElement, html} from '@polymer/lit-element';
import './wysiwyg-tool-button.js';
import {WysiwygFlexLayout} from './wysiwyg-flex-layout.js';

class WysiwygE extends LitElement {
    constructor() {
        super();
        this.activeState = 0;

        this.allowedStyleTypes = [
            'text-align',
            'color'
        ];

        this.allowedTagNames = [
            'BR',
            'P',
            'SPAN'
        ];

        this.canRedo = false;
        this.canToolbarScrollPrevious = false;
        this.canToolbarScrollNext = false;
        this.canUndo = false;
        this.debug = false;
        this.commonAncestorPath = null;
        this.forceNarrow = false;
        this.isCollapsed = false;
        this.language = 'en';
        this.minWidth768px = false;
        var isMac = navigator.platform.indexOf('Mac') >= 0;
    
        this.modifier = {
            key: isMac ? 'meta' : 'ctrl',
            tooltip: isMac ? '⌘' : 'Ctrl'
        };

        var sanitizeQueue = [], sanitizing = false;
        this.sanitizeQueue = sanitizeQueue;

        var sanitize = function () {
            sanitizing = true;
            var mutations = sanitizeQueue.shift();
            var sanitized = this.sanitize(mutations);

            if (sanitizeQueue.length) {
                sanitize();
            } else {
                sanitizing = false;

                if (sanitized) {
                    var html = this.target.innerHTML || '';
                    if (this.states.length > 1) this.states.splice(this.activeState + 1, this.states.length);

                    var state = {
                        html: html
                    };

                    if (state.html !== this.states[this.activeState].html) {
                        this.states.push(state);
                        this.activeState = this.states.length - 1;
                        this.value = html;
                        this.text = this.target ? this.target.textContent : '';
                    }
                }
            }

            return sanitized;
        }.bind(this);

        this.mutationObserver = new MutationObserver(
            function (mutations) {
                sanitizeQueue.push(mutations);
                if (!sanitizing) sanitize();
                setTimeout(this.updateSelection.bind(this), 10);
            }.bind(this)
        );

        this.noRedo = false;
        this.noUndo = false;
        this.placeholder = 'Edit your content here...';

        this.replacementTagNames = {
            'DIV': 'P'
        };

        this.resources = {
            'br': {
                'Undo': 'Desfazer',
                'Redo': 'Refazer'
            },
            'en': {
                'Undo': 'Undo',
                'Redo': 'Redo'
            },
            'fr': {
                'Undo': 'Annuler',
                'Redo': 'Rétablir'
            }
        };

        this.toolbarScrollDelay = 1;
        this.toolbarScrollStep = 10;
        this.toolbarScrollHeight = 0;
        this.toolbarScrollLeft = 0;
        this.toolbarScrollTop = 0;
        this.toolbarScrollWidth = 0;
        this.showPlaceholder = true;

        this.states = [
            {
                html: '<p><br></p>',
                selection: null
            }
        ];
    }

	connectedCallback() {
		super.connectedCallback();
		this.observe();

		if (!this._selectionChangeHandler) {
			this._selectionChangeHandler = function (event) {
				setTimeout(this.updateSelection.bind(this), 10);
			}.bind(this);
		}

		document.addEventListener('selectionchange', this._selectionChangeHandler);

		if (!this._resizeHandler) {
			this._resizeHandler = function () {
                this.minWidth768px = window.innerWidth >= 768;
				this.toolbarScrollHeight = Math.max(0, this.shadowRoot.querySelector('#toolbarLayout').scrollHeight - this.shadowRoot.querySelector('#toolbarLayout').offsetHeight);
				this.toolbarScrollWidth = Math.max(0, this.shadowRoot.querySelector('#toolbarLayout').scrollWidth - this.shadowRoot.querySelector('#toolbarLayout').offsetWidth);
			}.bind(this);
		}

		window.addEventListener('resize', this._resizeHandler);

		if (!this._keydownHandler) {
			this._keydownHandler = function (event) {
				//Prevent default tab behavior
				if (event.key === 'Tab') this._tab(event);
				//Prevent default delete behavior
				if (event.key === 'Delete') this._delete(event);
				//Prevent default backspace behavior
				if (event.key === 'Backspace') this._backspace(event);
				//Allow input without alt, ctrl, or meta
				if (!event.altKey && !event.ctrlKey && !event.metaKey) return;
				//Allow select all, refresh, print, paste, copy, cut
				if (!event.altKey && !event.shiftKey && ['a', 'r', 'p', 'v', 'c', 'x'].indexOf(event.key) >= 0 && (event.ctrlKey || event.metaKey)) return;
				event.preventDefault();
			}.bind(this);
		}

		this.shadowRoot.querySelector('#content').addEventListener('keydown', this._keydownHandler);

		if (!this._restoreSelectionHandler) {
			this._restoreSelectionHandler = function () {
				this.restoreSelection();
			}.bind(this);
		}
			
		this.shadowRoot.querySelector('#toolbar').addEventListener('restore-selection', this._restoreSelectionHandler);

		if (!this._selectElementHandler) {
			this._selectElementHandler = function (event) {
				this.selectElement(event.detail.element);
			}.bind(this);
		}

		this.addEventListener('select-element', this._selectElementHandler);

		if (!this._pasteHandler) {
			this._pasteHandler = function (event) {
				event.preventDefault();
				var data = event.clipboardData.getData('text/html');
				// If paste does not contain HTML, fall back to plain text
				if (!data.length) data = event.clipboardData.getData('text');
				document.execCommand('insertHTML', false, data);
			}.bind(this);
		}

		this.addEventListener('paste', this._pasteHandler);

		if (!this._slotchangeHandler) {
			this._slotchangeHandler = function () {
				this.updateTools();
			}.bind(this);
		}

		this.shadowRoot.querySelector('#tools').addEventListener('slotchange', this._slotchangeHandler);
    }

    //
	// Stop MutationObserver
	//
	disconnect() {
		if (typeof super.disconnect === 'function') super.disconnect();
		if (this.mutationObserver) this.mutationObserver.disconnect();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.disconnect();
		document.removeEventListener('selectionchange', this._selectionChangeHandler);
		window.removeEventListener('resize', this._resizeHandler);
		this.shadowRoot.querySelector('#content').removeEventListener('keydown', this._keydownHandler);
		this.removeEventListener('restore-selection', this._restoreSelectionHandler);
		this.removeEventListener('select-element', this._selectElementHandler);
		this.removeEventListener('paste', this._pasteHandler);
		this.shadowRoot.querySelector('#tools').removeEventListener('slotchange', this._slotchangeHandler);
	}

	//
	// Get the current selection
	//
	getSelection() {
		if (typeof super.getSelection === 'function') super.getSelection();
		var parent = this.target;

		while (parent) {
			if ([9, 11].indexOf(parent.nodeType) >= 0 && parent.getSelection) return parent.getSelection();
			parent = parent.parentNode || parent.host;
		}
	}

	//
	// Start MutationObserver
	//
	observe() {
		if (typeof super.observe === 'function') super.observe();

		if (this.mutationObserver && this.target) {
			this.mutationObserver.observe(
				this.target,
				{
					childList: true,
					attributes: true,
					characterData: true,
					subtree: true
				}
			);
		}
	}

	static get properties() {
		return {
			activeState: Number,
			allowedStyleTypes: Array,
			allowedTagNames: Array,
			anchorNode: Object,
			anchorOffset: Number,
			baseNode: Object,
			baseOffset: Number,
			canRedo: Boolean,
			canToolbarScrollPrevious: Boolean,
			canToolbarScrollNext: Boolean,
			canUndo: Boolean,
			debug: Boolean,
			commonAncestorPath: Array,
			extentNode: Object,
			extentOffset: Number,
			focusNode: Object,
			focusOffset: Number,
			forceNarrow: Boolean,
			isCollapsed: Boolean,
			language: String,
			minWidth768px: Boolean,
			modifier: Object,
			mutationObserver: Object,
			noRedo: Boolean,
			noUndo: Boolean,
			placeholder: String,
			range0: Object,
			rangeCount: Number,
			replacementTagNames: Object,
			resources: Object,
			toolbarScrollDelay: Number,
			toolbarScrollStep: Number,
			toolbarScrollHeight: Number,
			toolbarScrollLeft: Number,
			toolbarScrollTop: Number,
			toolbarScrollWidth: Number,
			showPlaceholder: Boolean,
			states: Array,
			target: Object,
			text: String,
			tooltipPosition: String,
			type: String,
			value: String
		};
    }

	ready() {
		super.ready();
		this.target = this.shadowRoot.querySelector('#editable');
		if (!this.value) this.value = '<p><br></p>';
		this.sanitize();

		setTimeout(
			function () {
				this.updateTools();
			}.bind(this),
			100
		);
    }

    //
	// Revert an undo operation
	//
	redo() {
		if (this.noRedo) return;
		if (typeof super.redo === 'function') super.redo();
		if (!this.states.length || this.activeState >= this.states.length - 1) return false;
		this.disconnect();
		this.activeState += 1;

		setTimeout(
			function () {
				this.observe();
			}.bind(this),
			10
		);
    }

	//
	// Restore selection state
	//
	restoreSelection() {
		if (this.debug) console.log('Restoring selection!');
		var charIndex = 0, range = this.target.ownerDocument.createRange(), target = this.target, savedSel = this.states[this.activeState].selection;
		if (!savedSel) return;
		var startNodeOffset, endNodeOffset;
		startNodeOffset = this._getNodeAndOffsetAt(target, savedSel.start);
		endNodeOffset = this._getNodeAndOffsetAt(target, savedSel.end);
		range.setStart(startNodeOffset.node, startNodeOffset.offset);
		range.setEnd(endNodeOffset.node, endNodeOffset.offset);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}

	//
	// Sanitize DOM changes
	//
	sanitize(mutations) {
		if (!mutations) return true;
		var sanitized = true, nodes = [], i, j, k, p, pre;

		for (i = 0; i < mutations.length; i += 1) {
			var mutation = mutations[i];

			if (nodes.indexOf(mutation.target) === -1) {
				nodes.push(mutation.target);

				if (mutation.target.querySelectorAll) {
					var subnodes = mutation.target.querySelectorAll('*');

					for (k = 0; k < subnodes.length; k += 1) {
						if (nodes.indexOf(subnodes[k]) === -1) nodes.push(subnodes[k]);
					}
				}
			}

			for (j = 0; j < mutation.addedNodes.length; j += 1) {
				var addedNode = mutation.addedNodes[j];

				if (nodes.indexOf(addedNode) === -1) {
					nodes.push(addedNode);

					if (addedNode.querySelectorAll) {
						var subnodes = addedNode.querySelectorAll('*');

						for (k = 0; k < subnodes.length; k += 1) {
							if (nodes.indexOf(subnodes[k]) === -1) nodes.push(subnodes[k]);
						}
					}
				}
			}
		}

		var tools = this.shadowRoot.querySelector('#tools').assignedNodes ? this.shadowRoot.querySelector('#tools').assignedNodes({flatten: true}) : [];

		tools = tools.filter(
			function (tool) {
				return tool.nodeType === Node.ELEMENT_NODE;
			}
		);

		var allowedStyleTypes = this.allowedStyleTypes;

		for (j = 0; j < tools.length; j += 1) {
			allowedStyleTypes = allowedStyleTypes.concat(tools[j].allowedStyleTypes);
		}

		var allowedTagNames = this.allowedTagNames;

		for (j = 0; j < tools.length; j += 1) {
			allowedTagNames = allowedTagNames.concat(tools[j].allowedTagNames);
		}

		var replacementTagNames = this.replacementTagNames;

		for (j = 0; j < tools.length; j += 1) {
			replacementTagNames = Object.assign(replacementTagNames, tools[j].replacementTagNames);
		}

		for (i = 0; i < nodes.length; i += 1) {
			var node = nodes[i];

			if (node !== this.target && this.target.contains(node)) {
				//Remove the id attribute
				if (node.hasAttribute && node.hasAttribute('id')) {
					node.removeAttribute('id');
					if (this.debug) console.log(node, 'id attribute');
					sanitized = false;
				}

				//Remove the style attribute
				if (node.hasAttribute && node.hasAttribute('style')) {
					var styles = node.getAttribute('style').split(';'), validStyles = [];

					for (j = 0; j < styles.length; j += 1) {
						if (styles[j]) {
							var style = styles[j].split(':')[0].trim();

							if (allowedStyleTypes.indexOf(style) === -1) {
								node.style[style] = '';
								if (this.debug) console.log(node, 'style: ' + style);
								sanitized = false;
							}
						}
					}
				}

				//Remove the class attribute
				if (node.hasAttribute && node.hasAttribute('class')) {
					node.removeAttribute('class');
					if (this.debug) console.log(node, 'class attribute');
					sanitized = false;
				}

				//If node is a text node immediate child of target, wrap inside a P
				if (node.parentNode === this.target && node.nodeType === Node.TEXT_NODE) {
					if (!node.textContent.trim().length) continue;
					p = document.createElement('p');
					this.target.insertBefore(p, node.nextSibling);
					p.appendChild(node);
					if (this.debug) console.log(node, 'wrap top level text nodes inside P node');
					sanitized = false;
				}

				//If node is a BR node immediate child of target, wrap inside a P
				if (node.parentNode === this.target && node.tagName === 'BR') {
					p = document.createElement('p');
					this.target.insertBefore(p, node.nextSibling);
					p.appendChild(node);
					if (this.debug) console.log(node, 'wrap top level BR nodes inside P node');
					sanitized = false;
				}

				for (j = 0; j < Object.keys(replacementTagNames).length; j += 1) {
					var oldTag = Object.keys(replacementTagNames)[j], newTag = replacementTagNames[Object.keys(replacementTagNames)[j]];

					if (node.tagName === oldTag) {
						node.outerHTML = '<' + newTag + '>' + node.innerHTML + '</' + newTag + '>';
						if (this.debug) console.log(node, 'tag replacement', newTag);
						sanitized = false;
					}
				}

				for (j = 0; j < tools.length; j += 1) {
					if (tools[j].allowedTagNames) {
						for (k = 0; k < tools[j].allowedTagNames.length; k += 1) {
							if (node.tagName === tools[j].allowedTagNames[k] && !tools[j].sanitize(node)) {
								if (this.debug) console.log(node, 'tool sanitize');
								sanitized = false;
							}
						}
					}
				}

				//Make sure tagName is allowed
				if (node.parentNode && node.tagName && allowedTagNames.indexOf(node.tagName) === -1) {
					node.outerHTML = node.innerHTML;
					if (this.debug) console.log(node, 'invalid tagName');
					sanitized = false;
				}
			}
		}

		//Guard against improper values
		if (!this.target.children.length) {
			p = document.createElement('p');
			var br = document.createElement('br');
			p.appendChild(br);
			this.target.appendChild(p);
			if (this.debug) console.log('improper value');
			sanitized = false;
		}

		return sanitized;
	}

	//
	// Select full contents of target
	//
	selectAll() {
		if (typeof super.selectAll === 'function') super.selectAll();
		var selection = this.getSelection();
		selection.removeAllRanges();
		var range = document.createRange();
		range.selectNodeContents(this.target);
		selection.addRange(range);
		setTimeout(this.updateSelection.bind(this), 10);
    }

	//
	// Select node or contents of a node within target
	//
	selectElement(element) {
		if (typeof super.selectElement === 'function') super.selectElement(element);
		if (!this.target.contains(element)) return;
		var selection = this.getSelection();
		selection.removeAllRanges();
		var range = document.createRange();

		if (element.tagName === 'IMG') {
			range.selectNode(element);
		} else {
			range.selectNodeContents(element);
		}

		selection.addRange(range);
		setTimeout(this.updateSelection.bind(this), 10);
    }

	//
	// Perform an undo operation
	//
	undo() {
		if (this.noUndo) return;
        if (typeof super.undo === 'function') super.undo();
		if (!this.states.length || this.activeState <= 0) return false;
		this.disconnect();
		this.activeState -= 1;

		setTimeout(
			function () {
				this.observe();
			}.bind(this),
			10
		);
    }

	//
	// Update properties based on the current selection
	//
	updateSelection() {
		if (typeof super.updateSelection === 'function') super.updateSelection();
		var selection = this.getSelection();

		if (selection && selection.focusNode === this.target && selection.getRangeAt(0).endOffset === 0) {
			var range = document.createRange();
            var node = this.target.children[0];
			range.setStart(node, 0);
			range.setEnd(node, 0);
			selection.removeAllRanges();
			selection.addRange(range);
			return;
		}

		if (selection && selection.anchorNode && this.target.contains(selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentNode)) {
			this.anchorNode = selection.anchorNode;
			this.anchorOffset = selection.anchorOffset;
			this.baseNode = selection.baseNode;
			this.baseOffset = selection.baseOffset;
			this.extentNode = selection.extentNode;
			this.extentOffset = selection.extentOffset;
			this.focusNode = selection.focusNode;
			this.focusOffset = selection.focusOffset;
			this.isCollapsed = selection.isCollapsed;
			this.rangeCount = selection.rangeCount;
			this.type = selection.type;
			this.range0 = selection.rangeCount ? selection.getRangeAt(0) : null;
			var path = null;

			if (this.range0) {
				var element = this.range0.commonAncestorContainer;
				path = [];

				while (this.target.contains(element)) {
					path.push(element);
					element = element.parentNode;
				}

				this.commonAncestorPath = path;
			}

			setTimeout(
				function () {
					if (this.shadowRoot.activeElement && this.target.contains(this.shadowRoot.activeElement)) {
						var target = this.target, range = this.range0;

						this.states[this.activeState].selection = {
							start: this._getNodeOffset(target, range.startContainer) + this._totalOffsets(range.startContainer, range.startOffset),
							end: this._getNodeOffset(target, range.endContainer) + this._totalOffsets(range.endContainer, range.endOffset)
						};
					}
				}.bind(this),
				50
			);
		}
    }

	//
	// Update tools properties
	//
	updateTools() {
		if (this._resizeHandler) this._resizeHandler();
		var now = new Date();

		if (this._toolUpdateTimeout) {
			delete this._toolUpdateTimeout;
			clearTimeout(this._toolUpdateTimeout);
		}

		if (this._lastToolUpdate && now - this._lastToolUpdate < 250) {
			this._toolUpdateTimeout = setTimeout(this.updateTools.bind(this), 250 - (now - this._lastToolUpdate));
			return;
		}

		this._lastToolUpdate = now;
		var tools = this.shadowRoot.querySelector('#tools').assignedNodes ? this.shadowRoot.querySelector('#tools').assignedNodes({flatten: true}) : [];

		for (var i = 0; i < tools.length; i += 1) {
			if (!(tools[i] instanceof WysiwygTool)) continue;
			tools[i]._setRange0(this.range0);
			tools[i]._setSelectionRoot(this.shadowRoot || document);
			tools[i]._setCanRedo(this.canRedo);
			tools[i]._setCanUndo(this.canUndo);
			tools[i]._setValue(this.value);
			tools[i]._setCommonAncestorPath(this.commonAncestorPath);
			tools[i]._setTarget(this.target);
			tools[i]._setMinWidth768px(this.minWidth768px);
			tools[i]._setForceNarrow(this.forceNarrow);
			tools[i]._setTooltipPosition(this.tooltipPosition);
			tools[i]._setLanguage(this.language);
			tools[i]._setDebug(this.debug);
			tools[i]._setModifier(this.modifier);
		}
    }

	_activeStateChanged(newValue, oldValue) {
		if (this.activeState !== +this.activeState.toFixed(0)) {
			this.activeState = +this.activeState.toFixed(0);
		} else if (this.activeState < 0) {
			this.activeState = 0;
		} else if (this.states.length && this.activeState > this.states.length - 1) {
			this.activeState = this.states.length - 1;
		} else if (typeof oldValue !== 'undefined' && this.target && this.target.innerHTML !== this.states[this.activeState].html) {
			this.target.innerHTML = this.states[this.activeState].html;
			this.restoreSelection();
		}
	}

	_backspace(event) {
		if (!this.target || !this.target.contains(event.composedPath()[0])) return;
		event.preventDefault();
		if (!this.range0) return;
		if (event.altKey || event.shiftKey) return;

		var singleBackspace = function () {
			if (this.target.children.length > 0) {
				document.execCommand('delete');
			} else {
				document.execCommand('formatBlock', null, 'P');
			}
		}.bind(this);

		var wholeWordBackspace = function (lastWord, lastWordPosition) {
			this.range0.collapse(true);
			this.range0.setStart(this.range0.commonAncestorContainer, lastWordPosition);
			this.range0.setEnd(this.range0.commonAncestorContainer, this.range0.commonAncestorContainer.textContent.length < lastWordPosition + lastWord.length + 1 ? this.range0.commonAncestorContainer : lastWordPosition + lastWord.length + 1);
			this.range0.deleteContents();
		}.bind(this);

		if (event.ctrlKey || event.metaKey) {
			var range = this.range0.cloneRange();
			range.collapse();
			range.setStart(this.range0.commonAncestorContainer, 0);
			var preceding = range.toString();

			if (preceding.length) {
				var match = preceding.match(/(?:\s|^)([\S]+)$/i);

				if (match) {
					wholeWordBackspace(match.slice(-1)[0], match.index);
				} else if (preceding.trim().split(' ').length === 1) {
					wholeWordBackspace(preceding.split(' ')[0], 0);
				} else {
					singleBackspace();
				}
			} else {
				singleBackspace();
			}
		} else {
			singleBackspace();
		}
	}

	_calculateNodeOffset(node) {
		var offset = 0;

		if (node.nodeType === 3) {
			offset += node.nodeValue.length + 1;
		} else {
			offset += 1;
		}

		if (node.childNodes) {
			for (var i = 0; i < node.childNodes.length; i += 1) {
				offset += this._calculateNodeOffset(node.childNodes[i]);
			}
		}

		return offset;
	}

	_delete(event) {
		if (!this.target || !this.target.contains(event.composedPath()[0])) return;
		event.preventDefault();
		document.execCommand('forwardDelete');
	}

    _didRender(props, changedProps, prevProps) {
        var wysiwygE = this;

        Object.keys(changedProps).forEach(
            (key) => {
                var callback = '_' + key + 'Changed';
                if (typeof wysiwygE[callback] === 'function') wysiwygE[callback](changedProps[key], prevProps[key]);
            }
        );
    }

	_getNodeOffset(start, dest) {
		var offset = 0;

		var node = start;
		var stack = [];

		while (true) {
			if (node === dest) {
				return offset;
			}

			if (node.firstChild) {
				if (node !== start) offset += 1;
				stack.push(node);
				node = node.firstChild;
			} else if (stack.length > 0 && node.nextSibling) {
				if (node.nodeType === 3) {
					offset += node.nodeValue.length + 1;
				} else {
					offset += 1;
				}

				node = node.nextSibling;
			} else {
				if (node.nodeType === 3) {
					offset += node.nodeValue.length + 1;
				} else {
					offset += 1;
				}

				while (true) {
					if (stack.length <= 1) return offset;
					var next = stack.pop();

					if (next.nextSibling) {
						node = next.nextSibling;
						break;
					}
				}
			}
		}
	}

	_getNodeAndOffsetAt(start, offset) {
		var node = start;
		var stack = [];

		while (true) {
			if (offset <= 0) {
				return {
					node: node,
					offset: 0
				};
			}

			if (node.nodeType == 3 && (offset <= node.nodeValue.length)) {
				return {
					node: node,
					offset: Math.min(offset, node.nodeValue.length)
				};
			}

			if (node.firstChild) {
				if (node !== start) offset -= 1;
				stack.push(node);
				node = node.firstChild;
			} else if (stack.length > 0 && node.nextSibling) {
				if (node.nodeType === 3) {
					offset -= node.nodeValue.length + 1;
				} else {
					offset -= 1;
				}

				node = node.nextSibling;
			} else {
				while (true) {
					if (stack.length <= 1) {
						if (node.nodeType == 3) {
							return {
								node: node,
								offset: Math.min(offset, node.nodeValue.length)
							};
						} else {
							return {
								node: node,
								offset: 0
							};
						}
					}

					var next = stack.pop();

					if (next.nextSibling) {
						if (node.nodeType === 3) {
							offset -= node.nodeValue.length + 1;
						} else {
							offset -= 1;
						}

						node = next.nextSibling;
						break;
					}
				}
			}
		}
    }

	_minWidth768pxChanged() {
		this.toolbarScrollTop = 0;
		this.toolbarScrollLeft = 0;
	}

	_mutationObserverChanged(newObserver, oldObserver) {
		if (typeof super._mutationObserverChanged === 'function') super._mutationObserverChanged(newObserver, oldObserver);
		if (oldObserver) oldObserver.disconnect();
		this.observe();
	}

    _onToolbarScrollButtonUp() {
		clearInterval(this._toolbarScrollJob);
		this._toolbarScrollJob = null;
	}

	_onToolbarScrollNext() {
		this._toolbarScrollNext();
		this._toolbarScrollJob = setInterval(this._toolbarScrollNext.bind(this), this.scrollDelay);
	}

	_onToolbarScrollPrevious() {
		this._toolbarScrollPrevious();
		this._toolbarScrollJob = setInterval(this._toolbarScrollPrevious.bind(this), this.scrollDelay);
	}

    _render({target, modifier, forceNarrow, canToolbarScrollPrevious, minWidth768px, toolbarScrollTop, toolbarScrollLeft, canUndo, noUndo, tooltipPosition, language, resources, canRedo, noRedo, canToolbarScrollNext}) {
        return html`
            ${WysiwygFlexLayout}
            <style>
                :host {
                    display: block;
                    position: relative;
                    overflow-y: hidden;
                    font-family: var(--wysiwyg-font, Roboto);
                }

                #toolbar {
                    background: var(--wysiwyg-toolbar-background, #2A9AF2);
                    user-select: none;
                    color: var(--wysiwyg-toolbar-color, white);
                }

                #toolbarLayout {
                    overflow: hidden;
                }

                #editable {
                    padding: 20px;
                    outline: none;
                }

                #editable[show-placeholder]:before {
                    content: attr(placeholder);
                    display: block;
                    position: absolute;
                    opacity: 0.5;
                }

                #editable > :first-child {
                    margin-top: 0;
                }

                #editable > :last-child {
                    margin-bottom: 0;
                }

                #editable ::selection {
                    color: white;
                    background: #2A9AF2;
                }

                #editable ol {
                    padding-left: 30px;
                }

                #editable ul {
                    padding-left: 30px;
                }

                #editable li {
                }

                #editable a {
                    color: #2A9AF2;
                }

                #editable img {}

                #editable blockquote[blockquote] {
                    padding: 15px;
                    margin: 0;
                    border-left: 5px solid #eee;
                }

                #editable blockquote:not([blockquote]) {
                    padding: 0;
                    margin: 0 0 0 20px;
                }

                #editable code {
                    display: block;
                    padding: 10px;
                    margin: 10px 0;
                    line-height: 1.5;
                    background-color: #f7f7f7;
                    border-radius: 3px;
                    white-space: pre-wrap;
                    font-family: monospace;
                }

                #editable p:first-child {
                    margin-top: 0;
                }

                #editable p {}

                #editable h1 {}

                #editable h2{}

                #editable h3 {}

                #editable h4 {}

                #editable h5 {}

                #editable h6 {}

                #editable b {}

                #editable u {}

                #editable i {}

                #editable strike {}

                #editable audio-wrapper,
                #editable video-wrapper {
                    display: block;
                }

                #editable audio,
                #editable video {
                    pointer-events: none;
                }

                #editable table {
                    border-spacing: 0;
                    border-collapse: collapse;
                }

                #editable table,
                #editable th,
                #editable td {
                    border: 1px solid black;
                }

                #editable th,
                #editable td {
                    padding: 5px 10px;
                }

                #editable thead,
                #editable tfoot {
                    font-weight: bold;
                    background: #ccc;
                    text-align: center;
                }

                #editable tbody tr:nth-child(even) {
                    background: #f5f5f5;
                }

                @media (min-width: 768px) {
                    #toolbarLayout {
                        height: 40px;
                        flex-wrap: nowrap;
                    }
                }

                @media (max-width: 767.9px) {
                    #toolbarLayout {
                        width: 40px;
                        max-height: calc(100% - 80px);
                    }
                }

                #content {
                    overflow-y: auto;
                    position: relative;
                }
            </style>
            <iron-a11y-keys target="${target}" keys="${modifier.key}+z" on-keys-pressed="undo"></iron-a11y-keys>
            <iron-a11y-keys target="${target}" keys="${modifier.key}+y" on-keys-pressed="redo"></iron-a11y-keys>
            <div class$="fit layout ${!minWidth768px ? 'horizontal' : 'vertical'}" id="layout"  view$="${(!minWidth768px | forceNarrow) ? 'narrow' : 'wide'}">
                <div id="toolbar" on-tap="updateTools" class$="layout ${minWidth768px ? 'horizontal' : 'vertical'}">
                    <wysiwyg-tool-button id="toolbarScrollPrevious" disabled="${!canToolbarScrollPrevious}" icon="${this._toolbarScrollPreviousIcon(minWidth768px, forceNarrow)}"></wysiwyg-tool-button>
                    <div id="toolbarLayout" class$="flex layout ${minWidth768px ? 'horizontal' : 'vertical'}">
                        <slot id="tools"></slot>
                        <wysiwyg-tool-button id="undo" icon="undo" on-mousedown="${(e) => this.undo()}"></wysiwyg-tool-button>
                        <paper-tooltip for="undo" position="${tooltipPosition}" offset="5" hidden>
                            <wysiwyg-localize language="${language}" resources="${resources}" string-key="Undo"></wysiwyg-localize>
                            <span> (${modifier.tooltip} + Z)</span>
                        </paper-tooltip>
                        <wysiwyg-tool-button id="redo" icon="redo"" on-mousedown="${(e) => this.redo()}"></wysiwyg-tool-button>
                        <paper-tooltip for="redo" position="${tooltipPosition}" offset="5" hidden>
                            <wysiwyg-localize language="${language}" resources="${resources}" string-key="Redo"></wysiwyg-localize>
                            <span> (${modifier.tooltip} + Y)</span>
                        </paper-tooltip>
                    </div>
                    <wysiwyg-tool-button id="toolbarScrollNext" icon="${this._toolbarScrollNextIcon(minWidth768px, forceNarrow)}"></wysiwyg-tool-button>
                </div>
                <div id="content" class="flex">
                    <div id="editable" class="fit" contenteditable placeholder$="[[placeholder]]" show-placeholder$="[[showPlaceholder]]"></div>
                </div>
            </div>
        `;
    }

	_tab(event) {
		event.preventDefault();
	}

	_targetChanged() {
		if (typeof super._targetChanged === 'function') super._targetChanged();
		this.disconnect();
		this.observe();
		if (!this.value) this.value = '';
		this.target.innerHTML = this.value;
    }

    _toolbarScroll(dx) {
		if (!this.forceNarrow && this.minWidth768px) {
			this.toolbarScrollLeft = this.scrollLeft + dx;
		} else {
			this.toolbarScrollTop = this.scrollTop + dx;
		}
	}

	_toolbarScrollNext() {
		if (!this.forceNarrow && this.minWidth768px) {
			if (this.scrollLeft + this.scrollStep > this.scrollWidth) {
				this._toolbarScroll(this.scrollWidth - this.scrollLeft);
				this._onScrollButtonUp();
			} else {
				this._toolbarScroll(this.scrollStep);
			}
		} else {
			if (this.scrollTop + this.scrollStep > this.scrollHeight) {
				this._toolbarScroll(this.scrollHeight - this.scrollTop);
				this._onScrollButtonUp();
			} else {
				this._toolbarScroll(this.scrollStep);
			}
		}
	}

    _toolbarScrollNextIcon(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'chevron_right';
		return 'expand_more';
	}

	_toolbarScrollPrevious() {
		if (!this.forceNarrow && this.minWidth768px) {
			if (this.scrollLeft - this.scrollStep < 0) {
				this._toolbarScroll(-this.scrollLeft);
				this._onScrollButtonUp();
			} else {
				this._toolbarScroll(-this.scrollStep);
			}
		} else {
			if (this.scrollTop - this.scrollStep < 0) {
				this._toolbarScroll(-this.scrollTop);
				this._onScrollButtonUp();
			} else {
				this._toolbarScroll(-this.scrollStep);
            }
        }
    }

    _toolbarScrollPreviousIcon(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'chevron_left';
		return 'expand_less';
    }

    _totalOffsets(parentNode, offset) {
		if (parentNode.nodeType == 3) return offset;

		if (parentNode.nodeType == 1) {
			var total = 0;

			for (var i = 0; i < offset; i += 1) {
				total += this._calculateNodeOffset(parentNode.childNodes[i]);
			}

			return total;
		}

		return 0;
	}

    _updateMinWidth768px(event) {
        this.minWidth768px = event.detail.value;
    }

	_valueChanged(newVal, oldVal) {
		if (typeof super._valueChanged === 'function') super._valueChanged();

		if (typeof this.value !== 'string') {
			this.value = '';
			return;
		}

		if (this.target && (this.target.innerHTML || '') !== this.value) {
			this.target.innerHTML = this.value;
		}
	}
}

customElements.define('wysiwyg-e', WysiwygE);