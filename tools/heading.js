import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import "@polymer/paper-button/paper-button.js"
import "@polymer/iron-icon/iron-icon.js"
import "@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "@polymer/neon-animation/web-animations.js"
import "@polymer/paper-tooltip/paper-tooltip.js"
import "@polymer/font-roboto/roboto.js"
import "@polymer/paper-item/paper-item.js"
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
                    <path d="M5 4v3h5.5v12h3V7H19V4z"/>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolHeading extends WysiwygTool {
	static get template() {
		return html`
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
			<iron-a11y-keys target="[[target]]" keys="ctrl+0" on-keys-pressed="p"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+1" on-keys-pressed="h1"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+2" on-keys-pressed="h2"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+3" on-keys-pressed="h3"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+4" on-keys-pressed="h4"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+5" on-keys-pressed="h5"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="ctrl+6" on-keys-pressed="h6"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-heading:icon"></iron-icon>
				</paper-button>
				<div slot="dropdown-content">
					<paper-item id="p" on-tap="p">P</paper-item>
					<paper-item id="h1" hidden$="{{!allowH1}}" on-tap="h1">H1</paper-item>
					<paper-item id="h2" hidden$="{{!allowH2}}" on-tap="h2">H2</paper-item>
					<paper-item id="h3" hidden$="{{!allowH3}}" on-tap="h3">H3</paper-item>
					<paper-item id="h4" hidden$="{{!allowH4}}" on-tap="h4">H4</paper-item>
					<paper-item id="h5" hidden$="{{!allowH5}}" on-tap="h5">H5</paper-item>
					<paper-item id="h6" hidden$="{{!allowH6}}" on-tap="h6">H6</paper-item>
				</div>
			</paper-menu-button>
		`;
	}

	static get properties() {
		return {
			allowedTagNames: {
				type: Array,
				computed: '_computeAllowedTagNames(allowH1, allowH2, allowH3, allowH4, allowH5, allowH6)'
			},
			allowH1: {
				type: Boolean,
				value: false
			},
			allowH2: {
				type: Boolean,
				value: false
			},
			allowH3: {
				type: Boolean,
				value: false
			},
			allowH4: {
				type: Boolean,
				value: false
			},
			allowH5: {
				type: Boolean,
				value: false
			},
			allowH6: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();

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

	close() {
		this.$.dropdown.close();
	}

	h1() {
		this.heading(1);
	}

	h2() {
		this.heading(2);
	}

	h3() {
		this.heading(3);
	}

	h4() {
		this.heading(4);
	}

	h5() {
		this.heading(5);
	}

	h6() {
		this.heading(6);
	}

	heading(level) {
		if (this.disabled || !this.range0 || !Number.isInteger(level) || level < 0 || level > 6) return false;

		var heading;

		for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
			if (['H' + level].indexOf(this.commonAncestorPath[i].tagName) >= 0) {
				heading = true;
				break;
			}
		}

		this.close();

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

	open() {
		this._selectedAudioChanged();
		this.$.dropdown.open();

		setTimeout(
			function () {
				this.$.url.focus();
			}.bind(this),
			100
		);
	}

	p() {
		this.heading(0);
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
		if (this.allowH1) tagNames.push('H1');
		if (this.allowH2) tagNames.push('H2');
		if (this.allowH3) tagNames.push('H3');
		if (this.allowH4) tagNames.push('H4');
		if (this.allowH5) tagNames.push('H5');
		if (this.allowH6) tagNames.push('H6');
		return tagNames;
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