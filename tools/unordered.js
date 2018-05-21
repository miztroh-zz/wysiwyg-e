import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolUnordered extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Unordered List': 'Lista não ordenada'
			},
			'en': {
				'Unordered List': 'Unordered List'
			},
			'fr': {
				'Unordered List': 'Liste non-ordonnée'
			},
			'de': {
				'Unordered List': 'Ungeordnete Liste'
			}
		};

		this.allowedTagNames = ['UL', 'LI'];
	}

	unordered() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('insertUnorderedList');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return false;
		return document.queryCommandState('insertUnorderedList');
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('insertUnorderedList');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_list_bulleted" on-mousedown="${(e) => this.unordered()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Unordered List'}"></wysiwyg-localize>
				<span> (Shift + Alt + U)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="shift+alt+u" on-keys-pressed="${(e) => this.unordered()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-unordered', WysiwygToolUnordered);	