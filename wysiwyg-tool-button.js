import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import '@material/mwc-button/mwc-button.js';

export class WysiwygToolButton extends LitElement {
	constructor() {
		super();
		this.icon = '';
		this.label = '';
		this.disabled = false;
		this.active = false;
	}

	static get properties() {
		return {
			icon: String,
			label: String,
			active: Boolean,
			disabled: Boolean
		}
	};

	_didRender(props, changedProps, prevProps) {
		super._didRender(props, changedProps, prevProps);
		var button = this.shadowRoot.querySelector('mwc-button').shadowRoot.querySelector('button');
		if (!button) return;
		button.style.minWidth = 'auto';
		button.style.minHeight = 'auto';
		button.style.maxWidth = 'auto';
		button.style.maxHeight = 'auto';
		button.style.width = '40px';
		button.style.height = '40px';
		var span = button.querySelector('.material-icons.mdc-button__icon');
		if (!span) return;
		span.style.marginRight = '0';
		var changedPropNames = Object.keys(changedProps);

		if (changedPropNames.includes('disabled')) {
			if (changedProps.disabled) {
				this.setAttribute('disabled', '');
			} else {
				this.removeAttribute('disabled');
			}
		}

		setTimeout(
			function () {
				if (changedPropNames.includes('disabled') && changedProps.disabled && props.active) this.active = false;
				if (changedPropNames.includes('active') && changedProps.active && props.disabled) this.disabled = false;
			}.bind(this),
			10
		);
	}

	_render({icon, label, active, disabled}) {
		return html`
			<style>
				mwc-button {
					--mdc-theme-on-primary: white;
					--mdc-theme-primary: ${active ? 'black' : 'white'};
					opacity: ${(disabled | active) ? '0.5' : '1'};
				}

				:host([disabled]) mwc-button {
					pointer-events: none;
					cursor: default;
				}
			</style>
			<mwc-button icon="${icon}" label="${label}"></mwc-button>
		`;
	}
}

customElements.define('wysiwyg-tool-button', WysiwygToolButton);