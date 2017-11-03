import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '/node_modules/@polymer/polymer/lib/legacy/class.js'
import { AppLocalizeBehavior } from '../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js';

export class WysiwygLocalize extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
  static get template() {
		return `<slot></slot>`;
	}
	
	static get properties() {
		return {
			stringKey: {
				type: String,
				notify: true
			},
			param1Name: {
				type: String,
				value: '',
				notify: true
			},
			param1Value: {
				type: String,
				value: '',
				notify: true
			},
			localized: {
				type: String,
				value: '',
				computed: '_computeLocalized(localize, stringKey, param1Name, param1Value)',
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

	_computeLocalized () {
		if (!this.localize) return '';
		return this.localize(this.stringKey, this.param1Name, this.param1Value);
	}

	_localizedChanged() {
		this.textContent = this.localized;
	}
}

customElements.define('wysiwyg-localize', WysiwygLocalize);