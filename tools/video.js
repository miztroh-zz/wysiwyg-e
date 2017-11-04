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
		return `
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Video"></wysiwyg-localize>
				<span> (Shift + Alt + V)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+v" on-keys-pressed="execCommand"></iron-a11y-keys>
			<paper-menu-button on-paper-dropdown-close="_paperDropdownClose" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-video:icon"></iron-icon>
				</paper-button>
				<div class="vertical layout" style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="URL" localized="{{_localizedUrl}}"></wysiwyg-localize>
					<paper-input label="[[_localizedUrl]]" always-float-label value="{{videoUrl}}" id="url"></paper-input>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedVideo]]" id="remove" icon="wysiwyg-tool:remove"></paper-icon-button>
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

	detached () {
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
			},
			active: {
				type: Boolean,
				value: false,
				computed: 'queryCommandState(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, selectedVideo)',
				reflectToAttribute: true,
				observer: '_activeChanged'
			},
			disabled: {
				type: Boolean,
				value: true,
				computed: '_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, selectedVideo)',
				reflectToAttribute: true,
				observer: '_disabledChanged'
			}
		};
	}

	execCommand (clickTarget) {
		if (this.disabled || !this.range0) return;
		var videoUrl = this.videoUrl.replace(new RegExp('"', 'g'), '&quote;');

		if (this.$.updateInsert === clickTarget || this.$.updateInsert.root.contains(clickTarget)) {
			this.$.dropdown.close();

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
		} else if (this.$.remove === clickTarget || this.$.remove.root.contains(clickTarget)) {
			if (this.selectedVideo) this.selectedVideo.parentNode.removeChild(this.selectedVideo);
			this.$.dropdown.close();
		} else if (this.$.close === clickTarget || this.$.close.root.contains(clickTarget)) {
			this.$.dropdown.close();
		} else if (this.$.button === clickTarget || this.$.button.root.contains(clickTarget)) {
			if (this.selectedVideo) {
				this.videoUrl = this.selectedVideo.src;
			} else {
				this.videoUrl = '';
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
		return this.range0;
	}

	queryCommandState () {
		return this.selectedVideo;
	}

	ready () {
		super.ready();
		this._setUsesDialog(true);

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

		this.allowedTagNames = ['p', 'br', 'video-wrapper', 'video'];
	}

	_paperDropdownClose (event) {
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

	_selectedVideoChanged () {}

	_stopPropagation (event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-video', WysiwygToolVideo);