import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import "@webcomponents/shadycss/apply-shim.min.js"
import "@polymer/font-roboto/roboto.js"
import "@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "@polymer/iron-flex-layout/iron-flex-layout.js"
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js"
import "@polymer/iron-icon/iron-icon.js"
import "@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "@polymer/iron-media-query/iron-media-query.js"
import "@polymer/paper-button/paper-button.js"
import "@polymer/paper-tooltip/paper-tooltip.js"
import { WysiwygTool } from "./wysiwyg-tool.js"
import { WysiwygLocalize } from "./wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="scroll-down">
					<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path>
				</g>
				<g id="scroll-left">
					<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"></path>
				</g>
				<g id="scroll-right">
					<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>
				</g>
				<g id="scroll-up">
					<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
				</g>
				<g id="undo">
					<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"></path>
				</g>
				<g id="redo">
					<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

export class WysiwygE extends PolymerElement {
	static get _targetTemplate() {
		return `<div id="editable" contenteditable placeholder$="[[placeholder]]" show-placeholder$="[[showPlaceholder]]"></div>`;
	}

  static get template() {
    return html`
			<style include="iron-flex iron-flex-alignment iron-flex-factors iron-positioning"></style>
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
					@apply --wysiwyg-toolbar;
				}
	
				#editable {
					padding: 20px;
					outline: none;
					@apply --wysiwyg-editable;
					@apply --layout-flex;
				}
	
				#editable[show-placeholder]:before {
					content: attr(placeholder);
					display: block;
					position: absolute;
					opacity: 0.5;
					@apply --wysiwyg-editable-placeholder;
				}
	
				#editable > :first-child {
					margin-top: 0;
					@apply --wysiwyg-editable-first-child;
				}
	
				#editable > :last-child {
					margin-bottom: 0;
					@apply --wysiwyg-editable-last-child;
				}
	
				#editable ::selection {
					color: white;
					background: #2A9AF2;
					@apply --wysiwyg-editable-selection;
				}
	
				#editable ol {
					padding-left: 30px;
					@apply --wysiwyg-editable-ol;
				}
	
				#editable ul {
					padding-left: 30px;
					@apply --wysiwyg-editable-ul;
				}
	
				#editable li {
					@apply --wysiwyg-editable-li;
				}
	
				#editable a {
					color: #2A9AF2;
					@apply --wysiwyg-editable-a;
				}
	
				#editable img {
					@apply --wysiwyg-editable-img;
				}
	
				#editable blockquote[blockquote] {
					padding: 15px;
					margin: 0;
					border-left: 5px solid #eee;
					@apply --wysiwyg-editable-blockquote;
				}
	
				#editable blockquote:not([blockquote]) {
					padding: 0;
					margin: 0 0 0 20px;
					@apply --wysiwyg-editable-indent;
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
					@apply --wysiwyg-editable-code;
				}
	
				#editable p:first-child {
					margin-top: 0;
				}
	
				#editable p {
					@apply --wysiwyg-editable-p;
				}
	
				#editable h1 {
					@apply --wysiwyg-editable-h1;
				}
	
				#editable h2{
					@apply --wysiwyg-editable-h2;
				}
	
				#editable h3 {
					@apply --wysiwyg-editable-h3;
				}
	
				#editable h4 {
					@apply --wysiwyg-editable-h4;
				}
	
				#editable h5 {
					@apply --wysiwyg-editable-h5;
				}
	
				#editable h6 {
					@apply --wysiwyg-editable-h6;
				}
	
				#editable b {
					@apply --wysiwyg-editable-b;
				}
	
				#editable u {
					@apply --wysiwyg-editable-u;
				}
	
				#editable i {
					@apply --wysiwyg-editable-i;
				}
	
				#editable strike {
					@apply --wysiwyg-editable-strike;
				}
	
				#editable audio-wrapper,
				#editable video-wrapper {
					display: block;
				}
	
				:host #editable audio,
				:host #editable video {
					pointer-events: none;
				}

				:host #editable table {
					border-spacing: 0;
					border-collapse: collapse;
				}

				:host #editable table,
				:host #editable th,
				:host #editable td {
					border: 1px solid black;
				}

				:host #editable th,
				:host #editable td {
					padding: 5px 10px;
				}

				:host #editable thead,
				:host #editable tfoot {
					font-weight: bold;
					background: #ccc;
					text-align: center;
				}

				:host #editable tbody tr:nth-child(even) {
					background: #f5f5f5;
				}

				paper-button {
					padding: 0;
					margin: 0;
					height: 40px;
					line-height: 40px;
					border-radius: 0px;
					min-width: 40px;
					min-height: 40px;
					background: transparent;
					text-transform: none;
				}
	
				paper-button[disabled] {
					color: rgba(255, 255, 255, 0.5);
				}
	
				@media (min-width: 768px) {
					#layout {
						@apply --layout-vertical;
					}
	
					#toolbar {
						@apply --layout-horizontal;
					}
	
					#toolbarLayout {
						height: 40px;
						@apply --layout-horizontal;
						@apply --layout-flex;
						flex-wrap: nowrap;
						overflow-x: hidden;
					}
	
					#layout[force-narrow] {
						@apply --layout-horizontal;
					}
	
					#layout[force-narrow] #toolbar {
						@apply --layout-vertical;
					}
	
					#layout[force-narrow] #toolbarLayout {
						height: auto;
						@apply --layout-vertical;
						width: 40px;
						max-height: calc(100% - 80px);
						overflow-y: hidden;
					}
				}
	
				@media (max-width: 767.9px) {
					#layout {
						@apply --layout-horizontal;
					}
	
					#toolbar {
						@apply --layout-vertical;
					}
	
					#toolbarLayout {
						@apply --layout-vertical;
						width: 40px;
						max-height: calc(100% - 80px);
						overflow-y: hidden;
					}
				}
	
				#content {
					overflow-y: auto;
					@apply --layout-flex;
					@apply --layout-vertical;
				}
			</style>
			<iron-a11y-keys target="[[target]]" keys="[[modifier.key]]+z" on-keys-pressed="undo"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="[[modifier.key]]+y" on-keys-pressed="redo"></iron-a11y-keys>
			<iron-media-query query="(min-width: 768px)" query-matches="{{minWidth768px}}"></iron-media-query>
			<div class="fit" id="layout" force-narrow$="[[forceNarrow]]">
				<div id="toolbar" on-tap="updateTools">
					<paper-button id="scrollPrevious" on-up="_onScrollButtonUp" on-down="_onScrollPrevious"	disabled="[[!canScrollPrevious]]">
						<iron-icon icon="[[_scrollPreviousIcon(minWidth768px, forceNarrow)]]"></iron-icon>
					</paper-button>
					<div id="toolbarLayout" scroll-top="[[scrollTop]]" scroll-left="[[scrollLeft]]">
						<slot id="tools"></slot>
						<paper-button id="undo" on-tap="undo" disabled="[[!canUndo]]" hidden="[[noUndo]]">
							<iron-icon icon="wysiwyg:undo"></iron-icon>
						</paper-button>
						<paper-tooltip for="undo" position="[[tooltipPosition]]" offset="5">
							<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Undo"></wysiwyg-localize>
							<span> ([[modifier.tooltip]] + Z)</span>
						</paper-tooltip>
						<paper-button id="redo" on-tap="redo" disabled="[[!canRedo]]" hidden="[[noRedo]]">
							<iron-icon icon="wysiwyg:redo"></iron-icon>
						</paper-button>
						<paper-tooltip for="redo" position="[[tooltipPosition]]" offset="5">
							<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Redo"></wysiwyg-localize>
							<span> ([[modifier.tooltip]] + Y)</span>
						</paper-tooltip>
					</div>
					<paper-button id="scrollNext" on-up="_onScrollButtonUp" on-down="_onScrollNext" disabled="[[!canScrollNext]]">
						<iron-icon icon="[[_scrollNextIcon(minWidth768px, forceNarrow)]]"></iron-icon>
					</paper-button>
				</div>
				<div id="content">
					${this._targetTemplate}
				</div>
			</div>
    `;
	}

	static get observers() {
		return [
			'updateTools(range0, canRedo, canUndo, value, commonAncestorPath, minWidth768px, tooltipPosition, forceNarrow, language, debug, modifier)'
		];
	}

	static get properties() {
		return {
			//
			// Current position within the states stack
			//
			activeState: {
				type: Number,
				value: 0,
				notify: true,
				observer: '_activeStateChanged'
			},
			//
			// Array of style types allowed by the sanitize method
			//
			allowedStyleTypes: {
				type: Array,
				value: function () {
					return [
						'text-align',
						'color'
					];
				}
			},
			//
			// Array of tagNames allowed by editor for its sanitize method
			//
			allowedTagNames: {
				type: Array,
				value: function () {
					return [
						'BR',
						'P',
						'SPAN'
					];
				}
			},
			//
			// The anchorNode of the current selection
			//
			anchorNode: {
				type: Object,
				readOnly: true,
				notify: true
			},
			//
			// The anchorOffset of the current selection
			//
			anchorOffset: {
				type: Number,
				readOnly: true,
				notify: true
			},
			//
			// The baseNode of the current selection
			//
			baseNode: {
				type: Object,
				readOnly: true,
				notify: true
			},
			//
			// The baseOffset of the current selection
			//
			baseOffset: {
				type: Number,
				readOnly: true,
				notify: true
			},
			//
			// Whether a redo action is available
			//
			canRedo: {
				type: Boolean,
				value: false,
				computed: '_computeCanRedo(activeState, states)',
				notify: true
			},
			//
			// If true, tools can scroll up.	Computed.
			//
			canScrollPrevious: {
				type: Boolean,
				computed: '_computeCanScrollPrevious(minWidth768px, forceNarrow, scrollHeight, scrollTop, scrollWidth, scrollLeft)'
			},
			//
			// If true, tools can scroll down.	Computed.
			//
			canScrollNext: {
				type: Boolean,
				computed: '_computeCanScrollNext(minWidth768px, forceNarrow, scrollHeight, scrollTop, scrollWidth, scrollLeft)'
			},
			//
			// Whether an undo action is available
			//
			canUndo: {
				type: Boolean,
				value: false,
				computed: '_computeCanUndo(activeState, states)',
				notify: true
			},
			//
			// If true, console.log debug messages.
			//
			debug: {
				type: Boolean,
				value: false
			},
			//
			// Built from range0.commonAncestorContainer
			//
			commonAncestorPath: {
				type: Array,
				value: null,
				readOnly: true,
				notify: true
			},
			//
			// The extentNode of the current selection
			//
			extentNode: {
				type: Object,
				readOnly: true,
				notify: true
			},
			//
			// The extentOffset of the current selection
			//
			extentOffset: {
				type: Number,
				readOnly: true,
				notify: true
			},
			//
			// The focusNode of the current selection
			//
			focusNode: {
				type: Object,
				readOnly: true,
				notify: true
			},
			//
			// The focusOffset of the current selection
			//
			focusOffset: {
				type: Number,
				readOnly: true,
				notify: true
			},
			//
			// If true, force narrow view with vertical toolbar.	Defaults to false.
			//
			forceNarrow: {
				type: Boolean,
				value: false
			},
			//
			// The isCollapsed of the current selection
			//
			isCollapsed: {
				type: Boolean,
				readOnly: true,
				notify: true
			},
			//
			// Two-letter language code for use with Polymer.AppLocalizeBehavior.	Defaults to 'en'.
			//
			language: {
				type: String,
				value: 'en'
			},
			//
			// Tracks viewport with.	Managed by iron-media-query
			//
			minWidth768px: {
				type: Boolean,
				observer: '_minWidth768pxChanged'
			},
			//
			// Modifier for keyboard shortcuts: Cmd key for Macs, Ctrl key for all others
			//
			modifier: {
				type: Object,
				value: function () {
					var isMac = navigator.platform.indexOf('Mac') >= 0;

					return {
						key: isMac ? 'meta' : 'ctrl',
						tooltip: isMac ? '⌘' : 'Ctrl'
					};
				}
			},
			//
			// A MutationObserver to update the selection as well as sanitize changes and add them to the states array
			//
			mutationObserver: {
				type: Object,
				value: function () {
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
									this._setText(this.target ? this.target.textContent : '');
								}
							}
						}

						return sanitized;
					}.bind(this);

					return new MutationObserver(
						function (mutations) {
							sanitizeQueue.push(mutations);
							if (!sanitizing) sanitize();
							setTimeout(this.updateSelection.bind(this), 10);
						}.bind(this)
					);
				},
				readOnly: true,
				observer: '_mutationObserverChanged'
			},
			//
			// Hide the redo button and prevent redo operations
			//
			noRedo: {
				type: Boolean,
				value: false
			},
			//
			// Hide the undo button and prevent undo operations
			//
			noUndo: {
				type: Boolean,
				value: false
			},
			//
			// Text to show when target's trimmed textContent is blank
			//
			placeholder: {
				type: String,
				value: 'Edit your content here...'
			},
			//
			// The getRangeAt(0) of the current selection
			//
			range0: {
				type: Object,
				readOnly: true,
				notify: true
			},
			//
			// The rangeCount of the current selection
			//
			rangeCount: {
				type: Number,
				readOnly: true,
				notify: true
			},
			//
			// Key-value pairs of tags that should be replaced by other tags
			//
			replacementTagNames: {
				type: Object,
				value: function () {
					return {
						'DIV': 'P'
					};
				}
			},
			//
			// Contains localized versions of text for use with Polymer.AppLocalizeBehavior.
			//
			resources: {
				type: Object,
				value: function () {
					return {
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
				}
			},
			//
			// Delay for scheduling of scroll jobs for the tool container.	Defaults to 1.
			//
			scrollDelay: {
				type: Number,
				value: 1
			},
			//
			// Amount in pixels by which to scroll the tool container up or down.	Defaults to 10.
			//
			scrollStep: {
				type: Number,
				value: 10
			},
			//
			// Height of tool scroll container.	Read-only.
			//
			scrollHeight: {
				type: Number,
				value: 0,
				readOnly: true
			},
			//
			// Left offset of tool scroll container.	Read-only.
			//
			scrollLeft: {
				type: Number,
				value: 0,
				readOnly: true
			},
			//
			// Top offset of tool scroll container.	Read-only.
			//
			scrollTop: {
				type: Number,
				value: 0,
				readOnly: true
			},
			//
			// Width of tool scroll container.	Read-only.
			//
			scrollWidth: {
				type: Number,
				value: 0,
				readOnly: true
			},
			//
			// Whether placeholder should be shown.	Computed.
			//
			showPlaceholder: {
				type: Boolean,
				computed: '_computeShowPlaceholder(value)',
				value: true
			},
			//
			// An array containing the undo / redo history of the value property
			//
			states: {
				type: Array,
				value: function () {
					return [
						{
							html: '<p><br></p>',
							selection: null
						}
					];
				},
				notify: true
			},
			//
			// The target to manage
			//
			target: {
				type: Object,
				observer: '_targetChanged',
				notify: true
			},
			//
			// The textContent of the target node
			//
			text: {
				type: String,
				readOnly: true,
				notify: true
			},
			//
			// Computed based on ``minWidth768px``
			//
			tooltipPosition: {
				type: String,
				computed: '_computeTooltipPosition(minWidth768px, forceNarrow)'
			},
			//
			// The type of the current selection
			//
			type: {
				type: String,
				readOnly: true,
				notify: true
			},
			//
			// The current innerHTML of the target node
			//
			value: {
				type: String,
				observer: '_valueChanged',
				notify: true
			}
		};
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
				this._setScrollHeight(Math.max(0, this.$.toolbarLayout.scrollHeight - this.$.toolbarLayout.offsetHeight));
				this._setScrollWidth(Math.max(0, this.$.toolbarLayout.scrollWidth - this.$.toolbarLayout.offsetWidth));
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

		this.$.content.addEventListener('keydown', this._keydownHandler);

		if (!this._restoreSelectionHandler) {
			this._restoreSelectionHandler = function () {
				this.restoreSelection();
			}.bind(this);
		}
			
		this.$.toolbar.addEventListener('restore-selection', this._restoreSelectionHandler);

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

		this.$.tools.addEventListener('slotchange', this._slotchangeHandler);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.disconnect();
		document.removeEventListener('selectionchange', this._selectionChangeHandler);
		window.removeEventListener('resize', this._resizeHandler);
		this.$.content.removeEventListener('keydown', this._keydownHandler);
		this.removeEventListener('restore-selection', this._restoreSelectionHandler);
		this.removeEventListener('select-element', this._selectElementHandler);
		this.removeEventListener('paste', this._pasteHandler);
		this.$.tools.removeEventListener('slotchange', this._slotchangeHandler);
	}

	ready() {
		super.ready();
		this.target = this.$.editable;
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
	// Stop MutationObserver
	//
	disconnect() {
		if (typeof super.disconnect === 'function') super.disconnect();
		if (this.mutationObserver) this.mutationObserver.disconnect();
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

		var tools = this.$.tools.assignedNodes ? this.$.tools.assignedNodes({flatten: true}) : [];
	
		tools = tools.filter(
			function (tool) {
				return tool.nodeType === HTMLElement.ELEMENT_NODE;
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
					if (this.debug) console.log(node, 'wrap top level text nodes inside p node');
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

		if (selection && selection.anchorNode && this.target.contains(selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentNode)) {
			this._setAnchorNode(selection.anchorNode);
			this._setAnchorOffset(selection.anchorOffset);
			this._setBaseNode(selection.baseNode);
			this._setBaseOffset(selection.baseOffset);
			this._setExtentNode(selection.extentNode);
			this._setExtentOffset(selection.extentOffset);
			this._setFocusNode(selection.focusNode);
			this._setFocusOffset(selection.focusOffset);
			this._setIsCollapsed(selection.isCollapsed);
			this._setRangeCount(selection.rangeCount);
			this._setType(selection.type);
			this._setRange0(selection.rangeCount ? selection.getRangeAt(0) : null);

			var path = null;

			if (this.range0) {
				var element = this.range0.commonAncestorContainer;
				path = [];

				while (this.target.contains(element)) {
					path.push(element);
					element = element.parentNode;
				}

				this._setCommonAncestorPath(path);
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
		if (!this.$) return;
		var tools = this.$.tools.assignedNodes ? this.$.tools.assignedNodes({flatten: true}) : [];

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
	// Calculate the total offsets of a node
	_calculateNodeOffset(node) {
		var offset = 0;

		// If text, count length
		if (node.nodeType === 3)
			offset += node.nodeValue.length + 1;
		else
			offset += 1;

		if (node.childNodes) {
			for (var i=0;i<node.childNodes.length;i++) {
				offset += this._calculateNodeOffset(node.childNodes[i]);
			}
		}

		return offset;
	}

	_computeCanRedo() {
		return this.states && this.activeState < this.states.length - 1;
	}

	_computeCanScrollNext(minWidth768px, forceNarrow, scrollHeight, scrollTop, scrollWidth, scrollLeft) {
		if (minWidth768px && !forceNarrow) return scrollLeft < scrollWidth;
		return scrollTop < scrollHeight;
	}

	_computeCanScrollPrevious(minWidth768px, forceNarrow, scrollHeight, scrollTop, scrollWidth, scrollLeft) {
		if (minWidth768px && !forceNarrow) return scrollLeft > 0;
		return scrollTop > 0;
	}

	_computeCanUndo() {
		return this.states && this.activeState > 0;
	}

	_computeShowPlaceholder(value) {
		var showPlaceholder = false;

		if (this.target) {
			var div = document.createElement('div');
			div.innerHTML = value;

			if (!div.textContent.trim()) {
				showPlaceholder = true;
				var nodes = div.querySelectorAll('*');

				for (var i = 0; i < nodes.length; i += 1) {
					if (nodes[i].nodeType === HTMLElement.ELEMENT_NODE) {
						if (!this.allowedTagNames.includes(nodes[i].tagName)) {
							showPlaceholder = false;
							break;
						}
					}
				}
			}
		}

		return showPlaceholder;
	}

	_computeTooltipPosition(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'bottom';
		return 'right';
	}

	_delete(event) {
		if (!this.target || !this.target.contains(event.composedPath()[0])) return;
		event.preventDefault();
		document.execCommand('forwardDelete');
	}


	/*
	Gets the offset of a node within another node. Text nodes are
	counted a n where n is the length. Entering (or passing) an
	element is one offset. Exiting is 0.
	*/
	_getNodeOffset(start, dest) {
		var offset = 0;

		var node = start;
		var stack = [];

		while (true) {
			if (node === dest) {
				return offset;
			}

			// Go into children
			if (node.firstChild) {
				// Going into first one doesn't count
				if (node !== start)
					offset += 1;
				stack.push(node);
				node = node.firstChild;
			}
			// If can go to next sibling
			else if (stack.length > 0 && node.nextSibling) {
				// If text, count length (plus 1)
				if (node.nodeType === 3)
					offset += node.nodeValue.length + 1;
				else
					offset += 1;

				node = node.nextSibling;
			}
			else {
				// If text, count length
				if (node.nodeType === 3)
					offset += node.nodeValue.length + 1;
				else
					offset += 1;

				// No children or siblings, move up stack
				while (true) {
					if (stack.length <= 1)
						return offset;

					var next = stack.pop();

					// Go to sibling
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
			// If arrived
			if (offset <= 0)
				return { node: node, offset: 0 };

			// If will be within current text node
			if (node.nodeType == 3 && (offset <= node.nodeValue.length))
				return { node: node, offset: Math.min(offset, node.nodeValue.length) };

			// Go into children (first one doesn't count)
			if (node.firstChild) {
				if (node !== start)
					offset -= 1;
				stack.push(node);
				node = node.firstChild;
			}
			// If can go to next sibling
			else if (stack.length > 0 && node.nextSibling) {
				// If text, count length
				if (node.nodeType === 3)
					offset -= node.nodeValue.length + 1;
				else
					offset -= 1;

				node = node.nextSibling;
			}
			else {
				// No children or siblings, move up stack
				while (true) {
					if (stack.length <= 1) {
						// No more options, use current node
						if (node.nodeType == 3)
							return { node: node, offset: Math.min(offset, node.nodeValue.length) };
						else
							return { node: node, offset: 0 };
					}

					var next = stack.pop();

					// Go to sibling
					if (next.nextSibling) {
						// If text, count length
						if (node.nodeType === 3)
							offset -= node.nodeValue.length + 1;
						else
							offset -= 1;

						node = next.nextSibling;
						break;
					}
				}
			}
		}
	}

	_minWidth768pxChanged() {
		this._setScrollTop(0);
		this._setScrollLeft(0);
	}

	_mutationObserverChanged(newObserver, oldObserver) {
		if (typeof super._mutationObserverChanged === 'function') super._mutationObserverChanged(newObserver, oldObserver);
		if (oldObserver) oldObserver.disconnect();
		this.observe();
	}

	_onScrollButtonUp() {
		clearInterval(this._scrollJob);
		this._scrollJob = null;
	}

	_onScrollNext() {
		this._scrollNext();
		this._scrollJob = setInterval(this._scrollNext.bind(this), this.scrollDelay);
	}

	_onScrollPrevious() {
		this._scrollPrevious();
		this._scrollJob = setInterval(this._scrollPrevious.bind(this), this.scrollDelay);
	}

	_scroll(dx) {
		if (!this.forceNarrow && this.minWidth768px) {
			this._setScrollLeft(this.scrollLeft + dx);
		} else {
			this._setScrollTop(this.scrollTop + dx);
		}
	}

	_scrollNext() {
		if (!this.forceNarrow && this.minWidth768px) {
			if (this.scrollLeft + this.scrollStep > this.scrollWidth) {
				this._scroll(this.scrollWidth - this.scrollLeft);
				this._onScrollButtonUp();
			} else {
				this._scroll(this.scrollStep);
			}
		} else {
			if (this.scrollTop + this.scrollStep > this.scrollHeight) {
				this._scroll(this.scrollHeight - this.scrollTop);
				this._onScrollButtonUp();
			} else {
				this._scroll(this.scrollStep);
			}
		}
	}

	_scrollNextIcon(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'wysiwyg:scroll-right';
		return 'wysiwyg:scroll-down';
	}

	_scrollPrevious() {
		if (!this.forceNarrow && this.minWidth768px) {
			if (this.scrollLeft - this.scrollStep < 0) {
				this._scroll(-this.scrollLeft);
				this._onScrollButtonUp();
			} else {
				this._scroll(-this.scrollStep);
			}
		} else {
			if (this.scrollTop - this.scrollStep < 0) {
				this._scroll(-this.scrollTop);
				this._onScrollButtonUp();
			} else {
				this._scroll(-this.scrollStep);
			}
		}
	}

	_scrollPreviousIcon(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'wysiwyg:scroll-left';
		return 'wysiwyg:scroll-up';
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
	// Determine total offset length from returned offset from ranges
	_totalOffsets(parentNode, offset) {
		if (parentNode.nodeType == 3)
			return offset;

		if (parentNode.nodeType == 1) {
			var total = 0;
			// Get child nodes
			for (var i=0;i<offset;i++) {
				total += this._calculateNodeOffset(parentNode.childNodes[i]);
			}
			return total;
		}

		return 0;
	}

	_valueChanged() {
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