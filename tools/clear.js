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
	iconset.setAttribute('name', 'wysiwyg-tool-clear');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolClear extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="removeFormat">
				<iron-icon icon="wysiwyg-tool-clear:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Clear Formatting"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + Space)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="[[modifier.key]]+space" on-keys-pressed="removeFormat"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Clear Formatting': 'Limpar a formatação'
			},
			'en': {
				'Clear Formatting': 'Clear Formatting'
			},
			'fr': {
				'Clear Formatting': 'Supprimer la mise en forme'
			}
		};
	}

	removeFormat() {
		if (this.disabled || !this.range0) return false;
		document.execCommand('removeFormat');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('removeFormat');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('removeFormat');
	}
}

customElements.define('wysiwyg-tool-clear', WysiwygToolClear);