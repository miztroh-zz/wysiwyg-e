import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import { WysiwygTool } from '../wysiwyg-tool.js';
import { WysiwygLocalize } from '../wysiwyg-localize.js';

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-italic');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolItalic extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="italic">
				<iron-icon icon="wysiwyg-tool-italic:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Italic"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + I)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="[[modifier.key]]+i" on-keys-pressed="italic"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Italic': 'Itálico'
			},
			'en': {
				'Italic': 'Italic'
			},
			'fr': {
				'Italic': 'Italique'
			},
			'de': {
				'Italic': 'Kursiv'
			}
		};

		this.allowedTagNames = ['I'];

		this.replacementTagNames = {
			'EM': 'I'
		};
	}

	italic() {
		if (this.disabled || !this.range0) return false;
		document.execCommand('italic');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('italic');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('italic');
	}
}

customElements.define('wysiwyg-tool-italic', WysiwygToolItalic);