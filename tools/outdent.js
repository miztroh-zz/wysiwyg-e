import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import "@polymer/paper-button/paper-button.js"
import "@polymer/iron-icon/iron-icon.js"
import "@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "@polymer/neon-animation/web-animations.js"
import "@polymer/paper-tooltip/paper-tooltip.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-outdent');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolOutdent extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="outdent">
				<iron-icon icon="wysiwyg-tool-outdent:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Outdent"></wysiwyg-localize>
				<span> (Shift + Tab)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="tab" on-keys-pressed="outdent"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Outdent': 'Diminuir a indentação'
			},
			'en': {
				'Outdent': 'Outdent'
			},
			'fr': {
				'Outdent': 'Diminuer le retrait'
			}
		};
	}

	outdent(event, detail) {
		if ((detail && !detail.keyboardEvent.shiftKey) || this.disabled || !this.range0) return false;
		document.execCommand('outdent');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('outdent');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('outdent');
	}
}

customElements.define('wysiwyg-tool-outdent', WysiwygToolOutdent);