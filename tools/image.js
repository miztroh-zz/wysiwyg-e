import { Element as PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import "../../node_modules/@polymer/paper-button/paper-button.js"
import "../../node_modules/@polymer/iron-icon/iron-icon.js"
import "../../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js"
import "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js"
import "../../node_modules/@polymer/paper-input/paper-input.js"
import "../../node_modules/@polymer/paper-button/paper-button.js"
import "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "../../node_modules/@polymer/neon-animation/web-animations.js"
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
import "../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js"
import "../../node_modules/@polymer/paper-listbox/paper-listbox.js"
import "../../node_modules/@polymer/paper-item/paper-item.js"
import "../../node_modules/@polymer/paper-menu-button/paper-menu-button.js"
import "../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-image');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolImage extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Image"></wysiwyg-localize>
				<span> (Shift + Alt + M)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+m" on-keys-pressed="execCommand"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-image:icon"></iron-icon>
				</paper-button>
				<div style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="URL" localized="{{_localizedUrl}}" hidden></wysiwyg-localize>
					<paper-input label="[[_localizedUrl]]" always-float-label value="{{imageUrl}}" id="url"></paper-input>
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Float" localized="{{_localizedFloat}}" hidden></wysiwyg-localize>
					<paper-dropdown-menu label="[[_localizedFloat]]" always-float-label noink on-iron-select="_stopPropagation" on-click="_stopPropagation">
						<paper-listbox selected="{{imageFloat}}" attr-for-selected="float" slot="dropdown-content">
							<paper-item float="none">
								<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="none"></wysiwyg-localize>
							</paper-item>
							<paper-item float="left">
								<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="left"></wysiwyg-localize>
							</paper-item>
							<paper-item float="right">
								<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="right"></wysiwyg-localize>
							</paper-item>
						</paper-listbox>
					</paper-dropdown-menu>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedImage]]" id="remove" icon="wysiwyg-tool:remove"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button id="updateInsert" icon="wysiwyg-tool:updateInsert"></paper-icon-button>
					</div>
				</div>
			</paper-menu-button>
		`;
	}

	connectedCallback() {
		super.connectedCallback();

		if (!this._handler) {
			this._handler = function (event) {
				var target = event.composedPath()[0];
				if (!this.target.contains(target)) return;
				event.preventDefault();

				if (target.tagName === 'IMG') {
					this._setSelectedImage(target);
					var selection = this.selectionRoot.getSelection();
					selection.removeAllRanges();
					var range = document.createRange();
					range.selectNode(target);
					selection.addRange(range);
					this._setRange0(range);
				} else {
					this._setSelectedImage(null);
				}
			}.bind(this);
		}

		document.addEventListener('click', this._handler);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('click', this._handler);
	}

	static get properties() {
		return {
			imageFloat: {
				type: String,
				value: 'none',
				observer: '_imageFloatChanged'
			},
			imageUrl: {
				type: String,
				value: ''
			},
			selectedImage: {
				type: HTMLImageElement,
				value: null,
				readOnly: true,
				observer: '_selectedImageChanged'
			}
		};
	}

	execCommand(clickTarget) {
		if (!(clickTarget instanceof HTMLElement)) clickTarget = null;
		if (this.disabled || !this.range0) return;
		var imageUrl = this.imageUrl, imageFloat = this.imageFloat;

		if (clickTarget && this.$.updateInsert === clickTarget || this.$.updateInsert.root.contains(clickTarget)) {
			this.$.dropdown.close();

			setTimeout(
				function () {
					if (this.selectedImage) {
						this.selectedImage.src = imageUrl;
						this.selectedImage.style.float = imageFloat;
					} else {
						document.execCommand('insertImage', false, imageUrl);

						setTimeout(
							function () {
								if (this.selectedImage) this.selectedImage.style.float = imageFloat;
							}.bind(this),
							10
						);
					}
				}.bind(this),
				10
			);
		} else if (clickTarget && this.$.remove === clickTarget || this.$.remove.root.contains(clickTarget)) {
			if (this.selectedImage) {
				this.selectedImage.parentNode.removeChild(this.selectedImage);
				this._setSelectedImage(null);
			}

			this.$.dropdown.close();
		} else if (clickTarget && this.$.close === clickTarget || this.$.close.root.contains(clickTarget)) {
			this.$.dropdown.close();
		} else if (!clickTarget || this.$.button === clickTarget || this.$.button.root.contains(clickTarget)) {
			this._selectedImageChanged();
			this.$.dropdown.open();

			setTimeout(
				function () {
					this.$.url.focus();
				}.bind(this),
				100
			);
		}
	}

	ready() {
		super.ready();
		this._setUsesDialog(true);

		this.resources = {
			'br': {
				'Image': 'Imagem',
				'URL': 'URL',
				'Float': 'Flutuador',
				'none': 'nenhum',
				'left': 'esquerda',
				'right': 'direita'
			},
			'en': {
				'Image': 'Image',
				'URL': 'URL',
				'Float': 'Float',
				'none': 'none',
				'left': 'left',
				'right': 'right'
			},
			'fr': {
				'Image': 'Image',
				'URL': 'URL',
				'Float': 'Flottant',
				'none': 'aucun',
				'left': 'gauche',
				'right': 'droite'
			}
		};

		this.allowedTagNames = ['IMG'];
	}
	
	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		return !!this.selectedImage;
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this.selectedImage || this.range0) return false;
		return true;
	}

	_imageFloatChanged() {
		if (['none', 'left', 'right'].indexOf(this.imageFloat) === -1) {
			this.imageFloat = 'none';
			return;
		}
	}

	_paperDropdownClose(event) {
		var target = event.composedPath()[0];
		if (target !== this.$.dropdown) return;
		this.imageUrl = '';
		this.imageFloat = 'none';

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
	
	_selectedImageChanged(event) {
		if (this.selectedImage) {
			this.imageUrl = this.selectedImage.src;
			this.imageFloat = this.selectedImage.style.float || 'none';
		} else {
			this.imageUrl = '';
			this.imageFloat = 'none';
		}
	}

	_stopPropagation(event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-image', WysiwygToolImage);