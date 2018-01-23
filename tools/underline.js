import { Element as PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import "../../node_modules/@polymer/paper-button/paper-button.js"
import "../../node_modules/@polymer/iron-icon/iron-icon.js"
import "../../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "../../node_modules/@polymer/neon-animation/web-animations.js"
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-underline');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolUnderline extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="underline">
				<iron-icon icon="wysiwyg-tool-underline:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Underline"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + U)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="[[modifier.key]]+u" on-keys-pressed="underline"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Underline': 'Sublinhado'
			},
			'en': {
				'Underline': 'Underline'
			},
			'fr': {
				'Underline': 'Souligner'
			}
		};

		this.allowedTagNames = ['U'];
	}

	underline() {
		if (this.disabled || !this.range0) return false;
		document.execCommand('underline');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('underline');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('underline');
	}
}

customElements.define('wysiwyg-tool-underline', WysiwygToolUnderline);