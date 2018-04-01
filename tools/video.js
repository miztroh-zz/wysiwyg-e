import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { WysiwygTool } from '../wysiwyg-tool.js';
import { WysiwygLocalize } from '../wysiwyg-localize.js';

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-video');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolVideo extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Video"></wysiwyg-localize>
				<span> (Shift + Alt + V)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+v" on-keys-pressed="open"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-video:icon"></iron-icon>
				</paper-button>
				<div class="vertical layout" style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="URL" localized="{{_localizedUrl}}" hidden></wysiwyg-localize>
					<paper-input label="[[_localizedUrl]]" always-float-label value="{{videoUrl}}" id="url"></paper-input>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close" on-tap="close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedVideo]]" id="remove" icon="wysiwyg-tool:remove" on-tap="remove"></paper-icon-button>
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
				var selectedVideo = null, target = event.composedPath()[0];
				if (!this.target.contains(target)) return;

				if (target.tagName === 'VIDEO-WRAPPER') {
					var video = target.querySelector('video');
					if (video) selectedVideo = video;
				}

				this._setSelectedVideo(selectedVideo);
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
			videoUrl: {
				type: String,
				value: ''
			},
			selectedVideo: {
				type: Object,
				value: null,
				readOnly: true,
				observer: '_selectedVideoChanged'
			}
		};
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Video': 'Vídeo',
				'URL': 'URL'
			},
			'en': {
				'Video': 'Video',
				'URL': 'URL'
			},
			'fr': {
				'Video': 'Vidéo',
				'URL': 'URL'
			}
		};

		this.allowedTagNames = ['VIDEO-WRAPPER', 'VIDEO'];
	}

	close() {
		this.$.dropdown.close();
	}

	open() {
		this._selectedVideoChanged();
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

		if (this.selectedVideo) {
			this.selectedVideo.parentNode.removeChild(this.selectedVideo);
			this._setselectedVideo(null);
		}

		this.close();
	}

	updateInsert(event) {
		if (this.disabled || !this.range0) return;
		var videoUrl = this.videoUrl.replace(new RegExp('"', 'g'), '&quote;');
		this.close();

		setTimeout(
			function () {
				if (this.selectedVideo) {
					this.selectedVideo.src = videoUrl;
				} else {
					var html = '<p><br><video-wrapper><video src="' + videoUrl + '" controls></video></video-wrapper><br></p>';
					document.execCommand('insertHTML', false, html);
				}
			}.bind(this),
			10
		);
	}
	
	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		return !!this.selectedVideo;
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this.selectedVideo || this.range0) return false;
		return true;
	}

	_paperDropdownClose(event) {
		var target = event.composedPath()[0];
		if (target !== this.$.dropdown) return;
		this.videoUrl = '';

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
	
	_selectedVideoChanged(event) {
		if (this.selectedVideo) {
			this.videoUrl = this.selectedVideo.src;
		} else {
			this.videoUrl = '';
		}
	}

	_stopPropagation(event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-video', WysiwygToolVideo);