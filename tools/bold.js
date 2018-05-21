import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolBold extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Bold': 'Negrito'
			},
			'en': {
				'Bold': 'Bold'
			},
			'fr': {
				'Bold': 'Gras'
			},
			'de': {
				'Bold': 'Fett'
			}
		};

		this.allowedTagNames = ['B'];

		this.replacementTagNames = {
			'STRONG': 'B'
		};
	}

	bold() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('bold');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		return range0 ? document.queryCommandState('bold') : false;
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		return range0 ? !document.queryCommandEnabled('bold') : true;
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_bold" on-mousedown="${(e) => this.bold()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Bold'}"></wysiwyg-localize>
				<span> (${modifier ? modifier.tooltip : ''} + B)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="${modifier ? modifier.key : ''}+b" on-keys-pressed="${(e) => this.bold()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-bold', WysiwygToolBold);	