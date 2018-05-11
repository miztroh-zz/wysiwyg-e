import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

export class WysiwygLocalize extends PolymerElement {
  static get template() {
		return html`
			<slot></slot>
		`;
	}
	
	static get properties() {
		return {
			//
			// A string of the key to look up from resources object
			//
			stringKey: {
				type: String,
				notify: true
			},
			//
			// An object with key-value pairs per language, per word
			//
			resources: {
				type: Object,
				notify: true
			},
			//
			// Used to localize the stringKey
			//
			language: {
				type: String,
				notify: true
			},
			//
			// A computed string localized based on stringKey, resources, and language
			//
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