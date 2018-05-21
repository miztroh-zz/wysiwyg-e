import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolItalic extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Italic': 'Itálico'
			},
			'en': {
				'Italic': 'Italic'
			},
			'fr': {
				'Italic': 'Italique'
			},
			'de': {
				'Italic': 'Kursiv'
			}
		};

		this.allowedTagNames = ['I'];

		this.replacementTagNames = {
			'EM': 'I'
		};
	}

	italic() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('italic');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return false;
		
		try {
			return document.queryCommandState('italic');
		} catch (ignore) {
			return false;
		}
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('italic');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_italic" on-mousedown="${(e) => this.italic()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Italic'}"></wysiwyg-localize>
				<span> (${modifier ? modifier.tooltip : ''} + I)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="${modifier ? modifier.key : ''}+i" on-keys-pressed="${(e) => this.italic()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-italic', WysiwygToolItalic);	