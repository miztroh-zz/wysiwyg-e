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
	iconset.setAttribute('name', 'wysiwyg-tool-code');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolCode extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<paper-button disabled="[[disabled]]" id="button" on-tap="code">
				<iron-icon icon="wysiwyg-tool-code:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Code"></wysiwyg-localize>
				<span> (Shift + Alt + K)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+k" on-keys-pressed="code"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Code': 'Código'
			},
			'en': {
				'Code': 'Code'
			},
			'fr': {
				'Code': 'Code'
			}
		};

		this.allowedTagNames = ['CODE'];
	}

	code() {
		if (this.disabled || !this.range0) return;

		if (!this.active) {
			var rangeText = this.range0.toString();
			var code = document.createElement('code');
			this.range0.surroundContents(code);
			if (!rangeText) code.innerHTML = '<br>';
		} else  {
			var path = this.commonAncestorPath;

			if (path) {
				for (var i = 0; i < path.length - 1; i += 1) {
					if (path[i].tagName === 'CODE') {
						path[i].outerHTML = path[i].innerHTML;
					}
				}
			}
		}
	}

	sanitize(node) {
		var sanitized = super.sanitize(node);

		if (node && node.tagName) {
			var childNodes = Array.prototype.slice.call(node.childNodes);

			switch (node.tagName) {
				//Remove invalid CODE children
				case 'CODE':
					for (var j = 0; j < childNodes.length; j += 1) {
						if (childNodes[j].tagName === 'P') {
							node.outerHTML = node.innerHTML;
							sanitized = false;
						}
					}

					break;
			}
		}

		return sanitized;
	}
	
	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		var path = this.commonAncestorPath;

		if (path) {
			for (var i = 0; i < path.length; i += 1) {
				if (path[i].tagName === 'CODE') return true;
			}
		}

		return false;
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		return !this.range0
	}
}

customElements.define('wysiwyg-tool-code', WysiwygToolCode);