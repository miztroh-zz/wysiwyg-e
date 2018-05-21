import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolCode extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Code': 'Código'
			},
			'en': {
				'Code': 'Code'
			},
			'fr': {
				'Code': 'Code'
			},
			'de': {
				'Code': 'Code'
			}
		};

		this.allowedTagNames = ['CODE'];
	}

	code() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;

		if (!this._computeActive(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) {
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
	
	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (commonAncestorPath) {
			for (var i = 0; i < commonAncestorPath.length; i += 1) {
				if (commonAncestorPath[i].tagName === 'CODE') return true;
			}
		}

		return false;
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		return !this.range0;
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="functions" on-mousedown="${(e) => this.code()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Code'}"></wysiwyg-localize>
				<span> (Shift + Alt + K)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="shift+alt+k" on-keys-pressed="${(e) => this.code()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-code', WysiwygToolCode);	