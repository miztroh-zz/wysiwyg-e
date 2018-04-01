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
	iconset.setAttribute('name', 'wysiwyg-tool-ordered');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolOrdered extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="insertOrderedList">
				<iron-icon icon="wysiwyg-tool-ordered:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Ordered List"></wysiwyg-localize>
				<span> (Shift + Alt + O)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+o" on-keys-pressed="insertOrderedList"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Ordered List': 'Lista ordenada'
			},
			'en': {
				'Ordered List': 'Ordered List'
			},
			'fr': {
				'Ordered List': 'Liste ordonnée'
			}
		};

		this.allowedTagNames = ['OL', 'LI'];
	}

	insertOrderedList() {
		if (this.disabled || !this.range0) return false;
		document.execCommand('insertOrderedList');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('insertOrderedList');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('insertOrderedList');
	}
}

customElements.define('wysiwyg-tool-ordered', WysiwygToolOrdered);