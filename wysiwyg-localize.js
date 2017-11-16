import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js';

export class WysiwygLocalize extends PolymerElement {
  static get template() {
		return `
			<slot></slot>
		`;
	}
	
	static get properties() {
		return {
			stringKey: {
				type: String,
				notify: true
			},
			resources: {
				type: Object,
				notify: true
			},
			language: {
				type: String,
				notify: true
			},
			localized: {
				type: String,
				value: '',
				computed: '_computeLocalized(stringKey, resources, language)',
				observer: '_localizedChanged',
				notify: true
			}
		};
	}

	ready() {
		super.ready();

		setTimeout(
			function () {
				this._localizedChanged();
			}.bind(this),
			100
		);
	}

	_computeLocalized (stringKey, resources, language) {
		if (resources && resources[language] && resources[language][stringKey]) return resources[language][stringKey];
		return '';
	}

	_localizedChanged() {
		this.textContent = this.localized;
	}
}

customElements.define('wysiwyg-localize', WysiwygLocalize);