import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolOutdent extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Outdent': 'Diminuir a indentação'
			},
			'en': {
				'Outdent': 'Outdent'
			},
			'fr': {
				'Outdent': 'Diminuer le retrait'
			},
			'de': {
				'Outdent': 'Ausrücken'
			}
		};
	}

	outdent(event) {
		if ((event && event.detail && event.detail.keyboardEvent && !event.detail.keyboardEvent.shiftKey) || this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return false;
		document.execCommand('outdent');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return false;
		return document.queryCommandState('outdent');
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('outdent');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_indent_decrease" on-mousedown="${(e) => this.outdent(e)}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Outdent'}"></wysiwyg-localize>
				<span> (Shift + Tab)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="tab" on-keys-pressed="${(e) => this.outdent(e)}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-outdent', WysiwygToolOutdent);	