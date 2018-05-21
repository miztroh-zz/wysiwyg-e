import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolStrike extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Strikethrough': 'Tachado'
			},
			'en': {
				'Strikethrough': 'Strikethrough'
			},
			'fr': {
				'Strikethrough': 'Barrer'
			},
			'de': {
				'Strikethrough': 'Durchgestrichen'
			}
		};

		this.allowedTagNames = ['S'];

		this.replacementTagNames = {
			'STRIKE': 'S'
		};
	}

	strike() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('strikeThrough');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return false;
		return document.queryCommandState('strikeThrough');
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('strikeThrough');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_strikethrough" on-mousedown="${(e) => this.strike()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Strikethrough'}"></wysiwyg-localize>
				<span> (Shift + Alt + D)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="shift+alt+d" on-keys-pressed="${(e) => this.strike()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-strike', WysiwygToolStrike);	