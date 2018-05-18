import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {Button} from '@material/mwc-button/mwc-button.js';

export class WysiwygToolButton extends LitElement {
    static get properties() {
        return {
            icon: String,
            label: String
        }
    };

    constructor() {
      super();
      this.icon = '';
      this.label = '';
    }

    _render({icon, label}) {
        return html`
            <style>
                mwc-button {
                    --mdc-theme-on-primary: white;
                    --mdc-theme-primary: white;
                }
            </style>
            <mwc-button icon="${icon}" label="${label}"></mwc-button>
        `
    }

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
        button.style.color = 'white';
        var span = button.querySelector('.material-icons.mdc-button__icon');
        if (!span) return;
        span.style.marginRight = '0';
    }
}

customElements.define('wysiwyg-tool-button', WysiwygToolButton);