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
	iconset.setAttribute('name', 'wysiwyg-tool-link');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolLink extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Link"></wysiwyg-localize>
				<span> (Shift + Alt + A)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+a" on-keys-pressed="execCommand"></iron-a11y-keys>
			<paper-menu-button on-opened-changed="_paperDropdownOpenedChanged" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-link:icon"></iron-icon>
				</paper-button>
				<div style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="URL" localized="{{_localizedUrl}}" hidden></wysiwyg-localize>
					<paper-input label="[[_localizedUrl]]" always-float-label value="{{linkUrl}}" id="url"></paper-input>
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Target" localized="{{_localizedTarget}}" hidden></wysiwyg-localize>
					<paper-dropdown-menu label="[[_localizedTarget]]" always-float-label noink on-iron-select="_stopPropagation" on-click="_stopPropagation">
						<paper-listbox class="dropdown-content" selected="{{linkTarget}}" attr-for-selected="target" slot="dropdown-content">
							<paper-item target="_blank">_blank</paper-item>
							<paper-item target="_self">_self</paper-item>
							<paper-item target="_parent">_parent</paper-item>
							<paper-item target="_top">_top</paper-item>
						</paper-listbox>
					</paper-dropdown-menu>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedLink]]" id="remove" icon="wysiwyg-tool:remove"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button id="updateInsert" icon="wysiwyg-tool:updateInsert"></paper-icon-button>
					</div>
				</div>
			</paper-menu-button>
		`;
	}

	attached () {
		if (!this._handler) {
			this._handler = function (event) {
				var target = event.composedPath()[0];
				if (!this.target.contains(target)) return;
				event.preventDefault();

				setTimeout(
					function () {
						var path = this.commonAncestorPath, selectedLink = null;

						for (var i = 0; i < path.length; i += 1) {
							if (path[i].tagName === 'A') {
								selectedLink = path[i];
								break;
							}
						}

						this._setSelectedLink(selectedLink);

						if (selectedLink) {
							if (this.mode !== 'read') return;
							window.open(selectedLink.href);
						}
					}.bind(this),
					100
				);
			}.bind(this);
		}

		document.addEventListener('click', this._handler);
	}

	detached () {
		document.removeEventListener('click', this._handler);
	}

	static get properties () {
		return {
			linkTarget: {
				type: String,
				value: '_self',
				observer: '_linkTargetChanged'
			},
			linkUrl: {
				type: String,
				value: ''
			},
			selectedLink: {
				type: Object,
				value: null,
				readOnly: true,
				observer: '_selectedLinkChanged'
			},
			active: {
				type: Boolean,
				value: false,
				computed: 'queryCommandState(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, selectedLink)',
				reflectToAttribute: true,
				observer: '_activeChanged'
			},
			disabled: {
				type: Boolean,
				value: true,
				computed: '_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, selectedLink)',
				reflectToAttribute: true,
				observer: '_disabledChanged'
			}
		};
	}

	execCommand (clickTarget) {
		if (this.disabled || !this.range0) return;
		var linkUrl = this.linkUrl, linkTarget = this.linkTarget;

		if (this.$.updateInsert === clickTarget || this.$.updateInsert.root.contains(clickTarget)) {
			this.$.dropdown.close();

			setTimeout(
				function () {
					if (this.selectedLink) {
						this.selectedLink.href = linkUrl;
						this.selectedLink.target = linkTarget;
					} else {
						document.execCommand('createLink', false, linkUrl);

						setTimeout(
							function () {
								if (this.selectedLink) this.selectedLink.target = linkTarget;
							}.bind(this),
							10
						);
					}
				}.bind(this),
				10
			);
		} else if (this.$.remove === clickTarget || this.$.remove.root.contains(clickTarget)) {
			if (this.selectedLink) {
				this.selectedLink.outerHTML = this.selectedLink.innerHTML;
				this._setSelectedLink(null);
			}

			this.$.dropdown.close();
		} else if (this.$.close === clickTarget || this.$.close.root.contains(clickTarget)) {
			this.$.dropdown.close();
		} else if (this.$.button === clickTarget || this.$.button.root.contains(clickTarget)) {
			if (this.selectedLink) {
				this.linkUrl = this.selectedLink.href;
				this.linkTarget = this.selectedLink.target || '_self';
			} else {
				this.linkUrl = '';
				this.linkTarget = '_self';
			}

			this.$.dropdown.open();

			setTimeout(
				function () {
					this.$.url.focus();
				}.bind(this),
				100
			);
		}
	}

	queryCommandEnabled () {
		if (this.selectedLink) return true;
		if (!this.range0) return false;
		return this.range0.startContainer !== this.range0.endContainer || this.range0.endOffset > this.range0.startOffset;
	}

	queryCommandState () {
		return this.selectedLink;
	}

	ready () {
		super.ready();
		this._setUsesDialog(true);

		this.resources = {
			'br': {
				'Link': 'Link',
				'URL': 'URL',
				'Target': 'Alvo'
			},
			'en': {
				'Link': 'Link',
				'URL': 'URL',
				'Target': 'Target'
			},
			'fr': {
				'Link': 'Lien',
				'URL': 'URL',
				'Target': 'Cible'
			}
		};

		this.allowedTagNames = ['a'];
	}

	_linkTargetChanged () {
		if (['_blank', '_self', '_parent', '_top'].indexOf(this.linkTarget) === -1) {
			this.linkTarget = '_self';
			return;
		}
	}

	_paperDropdownOpenedChanged (event) {
		if (this.$.dropdown.opened) return;
		this.linkUrl = '';
		this.linkTarget = '_self';

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

	_selectedLinkChanged (event) {}

	_stopPropagation (event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-link', WysiwygToolLink);