import {LitElement, html} from '@polymer/lit-element/lit-element.js'

export class WysiwygLocalize extends LitElement {
	constructor() {
		super();
	}
	
	static get properties() {
		return {
			stringKey: String,
			resources: Object,
			language: String,
			localized: String
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
		if (resources && resources[language] && resources[language][stringKey]) {
			this.localized = resources[language][stringKey];
		} else {
			this.localized = '';
		}
	}

	_didRender(props, changedProps, prevProps) {
		var changedPropNames = Object.keys(changedProps);

		setTimeout(
			function () {
				var observeProps = [
					'stringKey',
					'resources',
					'language'
				];

				if (changedPropNames.some(r => observeProps.includes(r))) this._computeLocalized(props.stringKey, props.resources, props.language);

				observeProps = ['localized'];
				if (changedPropNames.some(r => observeProps.includes(r))) this._localizedChanged(props.localized);
			}.bind(this),
			100
		);
	}

	_localizedChanged(localized) {
		this.textContent = localized;
	}

	_render({}) {
		return html`
			<slot></slot>
		`;
	}
}

customElements.define('wysiwyg-localize', WysiwygLocalize);