import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolClear extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Clear Formatting': 'Limpar a formatação'
			},
			'en': {
				'Clear Formatting': 'Clear Formatting'
			},
			'fr': {
				'Clear Formatting': 'Supprimer la mise en forme'
			},
			'de': {
				'Clear Formatting': 'Format entfernen'
			}
		};
	}

	clear() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('removeFormat');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return false;
		return document.queryCommandState('removeFormat');
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('removeFormat');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_clear" on-mousedown="${(e) => this.clear()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Clear Formatting'}"></wysiwyg-localize>
				<span> (${modifier ? modifier.tooltip : ''} + Space)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="${modifier ? modifier.key : ''}+space" on-keys-pressed="${(e) => this.clear()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-clear', WysiwygToolClear);	