import {LitElement, html} from '@polymer/lit-element/lit-element.js';

export class WysiwygTool extends LitElement {
	constructor() {
		super();
		this.allowedStyleTypes = [];
		this.allowedTagNames = [];
		this.replacementTagNames = {};
	}

	static get properties() {
		return {
			allowedStyleTypes: Array,
			allowedTagNames: Array,
			commonAncestorPath: Array,
			debug: Boolean,
			forceNarrow: Boolean,
			language: String,
			minWidth768px: Boolean,
			modifier: Object,
			range0: Object,
			replacementTagNames: Object,
			resources: Object,
			selectionRoot: Object,
			target: HTMLElement,
			value: String
		};
	}

	restoreSelection(delay) {
		if (!Number.isInteger(delay) || delay < 0) delay = 0;

		setTimeout(
			function () {
				this.dispatchEvent(
					new Event(
						'restore-selection',
						{
							bubbles: true,
							composed: true
						}
					)
				);
			}.bind(this),
			delay
		);
	}

	sanitize(node) {
		return true;
	}
}

customElements.define('wysiwyg-tool', WysiwygTool);