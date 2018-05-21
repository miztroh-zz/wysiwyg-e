import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolUnderline extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Underline': 'Sublinhado'
			},
			'en': {
				'Underline': 'Underline'
			},
			'fr': {
				'Underline': 'Souligner'
			},
			'de': {
				'Underline': 'Unterstreichen'
			}
		};

		this.allowedTagNames = ['U'];
	}

	underline() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('underline');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
        if (!range0) return false;
        return document.queryCommandState('underline');
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('underline');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_underline" on-mousedown="${(e) => this.underline()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Underline'}"></wysiwyg-localize>
				<span> (${modifier ? modifier.tooltip : ''} + U)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="${modifier ? modifier.key : ''}+u" on-keys-pressed="${(e) => this.underline()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-underline', WysiwygToolUnderline);	