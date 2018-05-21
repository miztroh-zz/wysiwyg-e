import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolBlockquote extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Blockquote': 'Citação'
			},
			'en': {
				'Blockquote': 'Blockquote'
			},
			'fr': {
				'Blockquote': 'Citation'
			},
			'de': {
				'Blockquote': 'Blockquote'
			}
		};

		this.allowedTagNames = ['BLOCKQUOTE'];
	}

	blockquote() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;

		if (!this._computeActive(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) {
			var rangeText = this.range0.toString();
			var blockquote = document.createElement('blockquote');
			blockquote.setAttribute('blockquote', '');
			this.range0.surroundContents(blockquote);
			if (!rangeText) blockquote.innerHTML = '<br>';
		} else  {
			var path = this.commonAncestorPath;

			if (path) {
				for (var i = 0; i < path.length - 1; i += 1) {
					if (path[i].tagName === 'BLOCKQUOTE' && path[i].hasAttribute('blockquote')) {
						path[i].outerHTML = path[i].innerHTML;
					}
				}
			}
		}
	}
	
	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (commonAncestorPath) {
			for (var i = 0; i < commonAncestorPath.length; i += 1) {
				if (commonAncestorPath[i].tagName === 'BLOCKQUOTE' && commonAncestorPath[i].hasAttribute('blockquote')) return true;
			}
		}

		return false;
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		return !this.range0
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_quote" on-mousedown="${(e) => this.blockquote()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Blockquote'}"></wysiwyg-localize>
				<span> (Shift + Alt + Q)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="shift+alt+q" on-keys-pressed="${(e) => this.blockquote()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-blockquote', WysiwygToolBlockquote);	