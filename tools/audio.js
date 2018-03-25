import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import "@polymer/paper-button/paper-button.js"
import "@polymer/iron-icon/iron-icon.js"
import "@polymer/paper-icon-button/paper-icon-button.js"
import "@polymer/paper-input/paper-input.js"
import "@polymer/paper-button/paper-button.js"
import "@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "@polymer/neon-animation/web-animations.js"
import "@polymer/paper-tooltip/paper-tooltip.js"
import "@polymer/paper-item/paper-item.js"
import "@polymer/paper-menu-button/paper-menu-button.js"
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js"
import "@polymer/iron-iconset-svg/iron-iconset-svg.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-audio');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolAudio extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Audio"></wysiwyg-localize>
				<span> (Shift + Alt + S)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+s" on-keys-pressed="open"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-audio:icon"></iron-icon>
				</paper-button>
				<div class="vertical layout" style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="URL" localized="{{_localizedUrl}}" hidden></wysiwyg-localize>
				<paper-input label="[[_localizedUrl]]" always-float-label value="{{audioUrl}}" id="url"></paper-input>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close" on-tap="close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedAudio]]" id="remove" icon="wysiwyg-tool:remove" on-tap="remove"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button id="updateInsert" icon="wysiwyg-tool:updateInsert" on-tap="updateInsert"></paper-icon-button>
					</div>
				</div>
			</paper-menu-button>
		`;
	}

	connectedCallback() {
		super.connectedCallback();

		if (!this._handler) {
			this._handler = function (event) {
				var selectedAudio = null, target = event.composedPath()[0];
				if (!this.target.contains(target)) return;

				if (target.tagName === 'AUDIO-WRAPPER') {
					var audio = target.querySelector('audio');
					if (audio) selectedAudio = audio;
				}

				this._setSelectedAudio(selectedAudio);
			}.bind(this);
		}

		document.addEventListener('click', this._handler);
		document.addEventListener('keydown', this._handler);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('click', this._handler);
		document.removeEventListener('keydown', this._handler);
	}

	static get properties() {
		return {
			audioUrl: {
				type: String,
				value: ''
			},
			selectedAudio: {
				type: Object,
				value: null,
				readOnly: true,
				observer: '_selectedAudioChanged'
			}
		};
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Audio': 'Áudio',
				'URL': 'URL'
			},
			'en': {
				'Audio': 'Audio',
				'URL': 'URL'
			},
			'fr': {
				'Audio': 'Audio',
				'URL': 'URL'
			}
		};

		this.allowedTagNames = ['AUDIO-WRAPPER', 'AUDIO'];
	}

	close() {
		this.$.dropdown.close();
	}

	open() {
		this._selectedAudioChanged();
		this.$.dropdown.open();

		setTimeout(
			function () {
				this.$.url.focus();
			}.bind(this),
			100
		);
	}

	remove() {
		if (this.disabled || !this.range0) return;

		if (this.selectedAudio) {
			this.selectedAudio.parentNode.removeChild(this.selectedAudio);
			this._setSelectedAudio(null);
		}

		this.close();
	}

	updateInsert(event) {
		if (this.disabled || !this.range0) return;
		var audioUrl = this.audioUrl.replace(new RegExp('"', 'g'), '&quote;');
		this.close();

		setTimeout(
			function () {
				if (this.selectedAudio) {
					this.selectedAudio.src = audioUrl;
				} else {
					var html = '<p><br><audio-wrapper><audio src="' + audioUrl + '" controls></audio></audio-wrapper><br></p>';
					document.execCommand('insertHTML', false, html);
				}
			}.bind(this),
			10
		);
	}
	
	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		return !!this.selectedAudio;
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this.selectedAudio || this.range0) return false;
		return true;
	}

	_paperDropdownClose(event) {
		var target = event.composedPath()[0];
		if (target !== this.$.dropdown) return;
		this.audioUrl = '';

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
	
	_selectedAudioChanged(event) {
		if (this.selectedAudio) {
			this.audioUrl = this.selectedAudio.src;
		} else {
			this.audioUrl = '';
		}
	}

	_stopPropagation(event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-audio', WysiwygToolAudio);