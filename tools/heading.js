import { Element as PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import "../../node_modules/@polymer/paper-button/paper-button.js"
import "../../node_modules/@polymer/iron-icon/iron-icon.js"
import "../../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "../../node_modules/@polymer/neon-animation/web-animations.js"
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
import "../../node_modules/@polymer/font-roboto/roboto.js"
import "../../node_modules/@polymer/paper-item/paper-item.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-heading');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolHeading extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<style>
				:host {
					font-family: Roboto;
				}

				paper-button {
					font-weight: bold;
					font-size: 18px;
				}

				paper-item {
					color: black;
				}

				paper-item:hover {
					cursor: pointer;
				}

				paper-item[active] {
					font-weight: bold;
					background: #e4e4e4;
				}
			</style>
			<paper-tooltip for="p" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Paragraph"></wysiwyg-localize>
				<span> (Control + 0)</span>
			</paper-tooltip>
			<paper-tooltip for="h1" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Heading" param1-name="number" param1-value="1"></wysiwyg-localize>
				<span> (Control + 1)</span>
			</paper-tooltip>
			<paper-tooltip for="h2" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Heading" param1-name="number" param1-value="2"></wysiwyg-localize>
				<span> (Control + 2)</span>
			</paper-tooltip>
			<paper-tooltip for="h3" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Heading" param1-name="number" param1-value="3"></wysiwyg-localize>
				<span> (Control + 3)</span>
			</paper-tooltip>
			<paper-tooltip for="h4" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Heading" param1-name="number" param1-value="4"></wysiwyg-localize>
				<span> (Control + 4)</span>
			</paper-tooltip>
			<paper-tooltip for="h5" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Heading" param1-name="number" param1-value="5"></wysiwyg-localize>
				<span> (Control + 5)</span>
			</paper-tooltip>
			<paper-tooltip for="h6" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Heading" param1-name="number" param1-value="6"></wysiwyg-localize>
				<span> (Control + 6)</span>
			</paper-tooltip>
			<paper-tooltip for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Headings"></wysiwyg-localize>
			</paper-tooltip>
			<iron-a11y-keys target="[[target]]" keys="ctrl+0" on-keys-pressed="_p"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+1" on-keys-pressed="_h1"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+2" on-keys-pressed="_h2"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+3" on-keys-pressed="_h3"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+4" on-keys-pressed="_h4"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+5" on-keys-pressed="_h5"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+6" on-keys-pressed="_h6"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-heading:icon"></iron-icon>
				</paper-button>
				<div slot="dropdown-content">
					<paper-item id="p">P</paper-item>
					<paper-item id="h1" hidden$="{{!h1}}">H1</paper-item>
					<paper-item id="h2" hidden$="{{!h2}}">H2</paper-item>
					<paper-item id="h3" hidden$="{{!h3}}">H3</paper-item>
					<paper-item id="h4" hidden$="{{!h4}}">H4</paper-item>
					<paper-item id="h5" hidden$="{{!h5}}">H5</paper-item>
					<paper-item id="h6" hidden$="{{!h6}}">H6</paper-item>
				</div>
			</paper-menu-button>
		`;
	}

	static get properties() {
		return {
			allowedTagNames: {
				type: Array,
				computed: '_computeAllowedTagNames(h1, h2, h3, h4, h5, h6)'
			},
			h1: {
				type: Boolean,
				value: false
			},
			h2: {
				type: Boolean,
				value: false
			},
			h3: {
				type: Boolean,
				value: false
			},
			h4: {
				type: Boolean,
				value: false
			},
			h5: {
				type: Boolean,
				value: false
			},
			h6: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();
		this._setUsesDialog(true);
		this._setCommand('formatBlock');

		this.resources = {
			'br': {
				'Headings': 'Títulos',
				'Paragraph': 'Parágrafo',
				'Heading': 'Titulo {number}'
			},
			'en': {
				'Headings': 'Headings',
				'Paragraph': 'Paragraph',
				'Heading': 'Heading {number}'
			},
			'fr': {
				'Headings': 'Titres',
				'Paragraph': 'Paragraphe',
				'Heading': 'Titre {number}'
			}
		};
	}

	execCommand(clickTarget) {
		if (this.disabled || !this.range0) return false
		var action;

		if (this.$.p === clickTarget || this.$.p.root.contains(clickTarget)) {
			action = function () {
				this._heading(0);
			}.bind(this);
		} else if (this.$.h1 === clickTarget || this.$.h1.root.contains(clickTarget)) {
			action = function () {
				this._heading(1);
			}.bind(this);
		} else if (this.$.h2 === clickTarget || this.$.h2.root.contains(clickTarget)) {
			action = function () {
				this._heading(2);
			}.bind(this);
		} else if (this.$.h3 === clickTarget || this.$.h3.root.contains(clickTarget)) {
			action = function () {
				this._heading(3);
			}.bind(this);
		} else if (this.$.h4 === clickTarget || this.$.h4.root.contains(clickTarget)) {
			action = function () {
				this._heading(4);
			}.bind(this);
		} else if (this.$.h5 === clickTarget || this.$.h5.root.contains(clickTarget)) {
			action = function () {
				this._heading(5);
			}.bind(this);
		} else if (this.$.h6 === clickTarget || this.$.h6.root.contains(clickTarget)) {
			action = function () {
				this._heading(6);
			}.bind(this);
		}

		if (action) {
			this.dispatchEvent(
				new Event(
					'restore-selection',
					{
						bubbles: true,
						composed: true
					}
				)
			);

			setTimeout(
				action,
				100
			);
		}
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this.range0 && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				var h1 = this.commonAncestorPath[i].tagName === 'H1';

				if (h1) {
					this.$.h1.setAttribute('active', '');
				} else {
					this.$.h1.removeAttribute('active');
				}

				var h2 = this.commonAncestorPath[i].tagName === 'H2';

				if (h2) {
					this.$.h2.setAttribute('active', '');
				} else {
					this.$.h2.removeAttribute('active');
				}

				var h3 = this.commonAncestorPath[i].tagName === 'H3';

				if (h3) {
					this.$.h3.setAttribute('active', '');
				} else {
					this.$.h3.removeAttribute('active');
				}

				var h4 = this.commonAncestorPath[i].tagName === 'H4';

				if (h4) {
					this.$.h4.setAttribute('active', '');
				} else {
					this.$.h4.removeAttribute('active');
				}

				var h5 = this.commonAncestorPath[i].tagName === 'H5';

				if (h5) {
					this.$.h5.setAttribute('active', '');
				} else {
					this.$.h5.removeAttribute('active');
				}

				var h6 = this.commonAncestorPath[i].tagName === 'H6';

				if (h6) {
					this.$.h6.setAttribute('active', '');
				} else {
					this.$.h6.removeAttribute('active');
				}

				if (h1 || h2 || h3 || h4 || h5 || h6) {
					this.$.p.removeAttribute('active');
					return true;
				} else {
					this.$.p.setAttribute('active', '');
				}
			}
		}

		return false;
	}

	_computeAllowedTagNames() {
		var tagNames = [];
		if (this.h1) tagNames.push('H1');
		if (this.h2) tagNames.push('H2');
		if (this.h3) tagNames.push('H3');
		if (this.h4) tagNames.push('H4');
		if (this.h5) tagNames.push('H5');
		if (this.h6) tagNames.push('H6');
		return tagNames;
	}

	_h1() {
		console.log('h1');
		this._heading(1);
	}

	_h2() {
		this._heading(2);
	}

	_h3() {
		this._heading(3);
	}

	_h4() {
		this._heading(4);
	}

	_h5() {
		this._heading(5);
	}

	_h6() {
		this._heading(6);
	}

	_heading(level) {
		if (this.disabled || !this.range0 || level !== parseInt(level) || level < 0 || level > 6) return false;

		var heading;

		for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
			if (['H' + level].indexOf(this.commonAncestorPath[i].tagName) >= 0) {
				heading = true;
				break;
			}
		}

		this.$.dropdown.close();

		setTimeout(
			function () {
				if (heading || level === 0) {
					document.execCommand('formatBlock', null, 'P');
				} else {
					document.execCommand('formatBlock', null, 'H' + level);
				}
			}.bind(this),
			10
		);
	}

	_p() {
		this._heading(0);
	}

	_paperDropdownClose(event) {
		var target = event.composedPath()[0];
		if (target !== this.$.dropdown) return;

		this.dispatchEvent(
			new Event(
				'restore-selection',
				{
					bubbles: true,
					composed: true
				}
			)
		);
	}
}

customElements.define('wysiwyg-tool-heading', WysiwygToolHeading);