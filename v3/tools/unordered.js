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
	iconset.setAttribute('name', 'wysiwyg-tool-unordered');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12.17c-.74 0-1.33.6-1.33 1.33s.6 1.33 1.33 1.33 1.33-.6 1.33-1.33-.59-1.33-1.33-1.33zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolUnordered extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="insertUnorderedList">
				<iron-icon icon="wysiwyg-tool-unordered:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Unordered List"></wysiwyg-localize>
				<span> (Shift + Alt + U)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+u" on-keys-pressed="insertUnorderedList"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Unordered List': 'Lista não ordenada'
			},
			'en': {
				'Unordered List': 'Unordered List'
			},
			'fr': {
				'Unordered List': 'Liste non-ordonnée'
			},
			'de': {
				'Unordered List': 'Ungeordnete Liste'
			}
		};

		this.allowedTagNames = ['UL', 'LI'];
	}

	insertUnorderedList() {
		if (this.disabled || !this.range0) return false;
		document.execCommand('insertUnorderedList');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('insertUnorderedList');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('insertUnorderedList');
	}
}

customElements.define('wysiwyg-tool-unordered', WysiwygToolUnordered);