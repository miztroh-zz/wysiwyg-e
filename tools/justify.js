import { Element as PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import "../../node_modules/@polymer/paper-button/paper-button.js"
import "../../node_modules/@polymer/iron-icon/iron-icon.js"
import "../../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "../../node_modules/@polymer/neon-animation/web-animations.js"
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
import "../../node_modules/@polymer/font-roboto/roboto.js"
import "../../node_modules/@polymer/paper-item/paper-item.js"
import "../../node_modules/@polymer/paper-menu-button/paper-menu-button.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-justify');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolJustify extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<style>
				:host {
					font-family: Roboto;
				}

				paper-button {
					font-weight: bold;
					font-size: 18px;
				}

				paper-item {
					color: black;
				}

				paper-item:hover {
					cursor: pointer;
				}

				paper-item[active] {
					font-weight: bold;
					background: #e4e4e4;
				}
			</style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Justify"></wysiwyg-localize>
			</paper-tooltip>
			<paper-tooltip for="left" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Left"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + Left)</span>
			</paper-tooltip>
			<paper-tooltip for="right" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Right"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + Right)</span>
			</paper-tooltip>
			<paper-tooltip for="center" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Center"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + Up)</span>
			</paper-tooltip>
			<paper-tooltip for="full" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Full"></wysiwyg-localize>
				<span> ([[modifier.tooltip]] + Down)</span>
			</paper-tooltip>
			<iron-a11y-keys target="[[target]]" keys="[[modifier.key]]+left" on-keys-pressed="justifyLeft"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="[[modifier.key]]+right" on-keys-pressed="justifyRight"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="[[modifier.key]]+up" on-keys-pressed="justifyCenter"></iron-a11y-keys>
			<iron-a11y-keys target="[[target]]" keys="[[modifier.key]]+down" on-keys-pressed="justifyFull"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon id="icon" icon="wysiwyg-tool-justify:icon"></iron-icon>
				</paper-button>
				<div slot="dropdown-content">
					<paper-item id="left" on-tap="justifyLeft">
						<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Left"></wysiwyg-localize>
					</paper-item>
					<paper-item id="right" hidden$="{{!right}}" on-tap="justifyRight">
						<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Right"></wysiwyg-localize>
					</paper-item>
					<paper-item id="center" hidden$="{{!center}}" on-tap="justifyCenter">
						<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Center"></wysiwyg-localize>
					</paper-item>
					<paper-item id="full" hidden$="{{!full}}" on-tap="justifyFull">
						<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Full"></wysiwyg-localize>
					</paper-item>
				</div>
			</paper-menu-button>
		`;
	}

	static get properties() {
		return {
			right: {
				type: Boolean,
				value: false
			},
			center: {
				type: Boolean,
				value: false
			},
			full: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Justify': 'Justificar',
				'Left': 'Esquerda',
				'Right': 'Direita',
				'Center': 'Centro',
				'Full': 'Inteiro'
			},
			'en': {
				'Justify': 'Justify',
				'Left': 'Left',
				'Right': 'Right',
				'Center': 'Center',
				'Full': 'Full'
			},
			'fr': {
				'Justify': 'Justifier',
				'Left': 'Gauche',
				'Right': 'Droite',
				'Center': 'Centrer',
				'Full': 'Entier'
			}
		};
	}

	justify(justification) {
		if (this.disabled || !this.range0 || ['left', 'right', 'center', 'full'].indexOf(justification) === -1) return false;

		this.$.dropdown.close();

		setTimeout(
			function () {
				var command = 'justify' + justification.charAt(0).toUpperCase() + justification.slice(1);

				if (document.queryCommandState(command)) {
					document.execCommand('justifyLeft');
				} else {
					document.execCommand(command);
				}
			}.bind(this),
			10
		);
	}

	justifyCenter() {
		this.justify('center');
	}

	justifyFull() {
		this.justify('full');
	}

	justifyLeft() {
		this.justify('left');
	}

	justifyRight() {
		this.justify('right');
	}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this.range0) {
			var left = document.queryCommandState('justifyLeft');

			if (left) {
				this.$.left.setAttribute('active', '');
				this.$.icon.icon = 'editor:format-align-left';
			} else {
				this.$.left.removeAttribute('active');
			}

			var right = document.queryCommandState('justifyRight');

			if (right) {
				this.$.right.setAttribute('active', '');
				this.$.icon.icon = 'editor:format-align-right';
			} else {
				this.$.right.removeAttribute('active');
			}

			var center = document.queryCommandState('justifyCenter');

			if (center) {
				this.$.center.setAttribute('active', '');
				this.$.icon.icon = 'editor:format-align-center';
			} else {
				this.$.center.removeAttribute('active');
			}

			var full = document.queryCommandState('justifyFull');

			if (full) {
				this.$.full.setAttribute('active', '');
				this.$.icon.icon = 'editor:format-align-justify';
			} else {
				this.$.full.removeAttribute('active');
			}

			if (right || center || full) return true;
		}

		return false;
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {
		if (!range0) return true;
		return !(document.queryCommandEnabled('justifyLeft') || document.queryCommandEnabled('justifyRight') || document.queryCommandEnabled('justifyCenter') || document.queryCommandEnabled('justifyFull'));
	}

	_paperDropdownClose(event) {
		var target = event.composedPath()[0];
		if (target !== this.$.dropdown) return;

		this.dispatchEvent(
			new Event(
				'restore-selection',
				{
					bubbles: true,
					composed: true
				}
			)
		);
	}
}

customElements.define('wysiwyg-tool-justify', WysiwygToolJustify);