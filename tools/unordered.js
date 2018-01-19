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
		return `
			${super.template}
			<paper-button disabled="[[disabled]]" id="button">
				<iron-icon icon="wysiwyg-tool-unordered:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Unordered List"></wysiwyg-localize>
				<span> (Shift + Alt + U)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+u" on-keys-pressed="execCommand"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();
		this._setCommand('insertUnorderedList');

		this.resources = {
			'br': {
				'Unordered List': 'Lista não ordenada'
			},
			'en': {
				'Unordered List': 'Unordered List'
			},
			'fr': {
				'Unordered List': 'Liste non-ordonnée'
			}
		};

		this.allowedTagNames = ['UL', 'LI'];
	}
}

customElements.define('wysiwyg-tool-unordered', WysiwygToolUnordered);