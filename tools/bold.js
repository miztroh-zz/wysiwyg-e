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
	iconset.setAttribute('name', 'wysiwyg-tool-bold');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolBold extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<paper-button disabled="[[disabled]]" id="button">
				<iron-icon icon="wysiwyg-tool-bold:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Bold"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + B)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="[[modifier.key]]+b" on-keys-pressed="execCommand"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();
		this._setCommand('bold');

		this.resources = {
			'br': {
				'Bold': 'Negrito'
			},
			'en': {
				'Bold': 'Bold'
			},
			'fr': {
				'Bold': 'Gras'
			}
		};

		this.allowedTagNames = ['B'];

		this.replacementTagNames = {
			'STRONG': 'B'
		};
	}
}

customElements.define('wysiwyg-tool-bold', WysiwygToolBold);