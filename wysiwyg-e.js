import {LitElement, html} from '@polymer/lit-element';
import {Button} from '@material/mwc-button';

class WysiwygE extends LitElement {
    constructor() {
        super();
        this.activeState = 0;

        this.allowedStyleTypes = [
            'text-align',
            'color'
        ];

        this.allowedTagNames = [
            'BR',
            'P',
            'SPAN'
        ];

        this.canRedo = false;
        this.canToolbarScrollPrevious = false;
        this.canToolbarScrollNext = false;
        this.canUndo = false;
        this.debug = false;
        this.commonAncestorPath = null;
        this.forceNarrow = false;
        this.isCollapsed = false;
        this.language = 'en';
        this.minWidth768px = false;
        var isMac = navigator.platform.indexOf('Mac') >= 0;
    
        this.modifier = {
            key: isMac ? 'meta' : 'ctrl',
            tooltip: isMac ? '⌘' : 'Ctrl'
        };

        var sanitizeQueue = [], sanitizing = false;
        this.sanitizeQueue = sanitizeQueue;

        var sanitize = function () {
            sanitizing = true;
            var mutations = sanitizeQueue.shift();
            var sanitized = this.sanitize(mutations);

            if (sanitizeQueue.length) {
                sanitize();
            } else {
                sanitizing = false;

                if (sanitized) {
                    var html = this.target.innerHTML || '';
                    if (this.states.length > 1) this.states.splice(this.activeState + 1, this.states.length);

                    var state = {
                        html: html
                    };

                    if (state.html !== this.states[this.activeState].html) {
                        this.states.push(state);
                        this.activeState = this.states.length - 1;
                        this.value = html;
                        this._setText(this.target ? this.target.textContent : '');
                    }
                }
            }

            return sanitized;
        }.bind(this);

        this.mutationObserver = new MutationObserver(
            function (mutations) {
                sanitizeQueue.push(mutations);
                if (!sanitizing) sanitize();
                setTimeout(this.updateSelection.bind(this), 10);
            }.bind(this)
        );

        this.noRedo = false;
        this.noUndo = false;
        this.placeholder = 'Edit your content here...';

        this.replacementTagNames = {
            'DIV': 'P'
        };

        this.resources = {
            'br': {
                'Undo': 'Desfazer',
                'Redo': 'Refazer'
            },
            'en': {
                'Undo': 'Undo',
                'Redo': 'Redo'
            },
            'fr': {
                'Undo': 'Annuler',
                'Redo': 'Rétablir'
            }
        };

        this.toolbarScrollDelay = 1;
        this.toolbarScrollStep = 10;
        this.toolbarScrollHeight = 0;
        this.toolbarScrollLeft = 0;
        this.toolbarScrollTop = 0;
        this.toolbarScrollWidth = 0;
        this.showPlaceholder = true;

        this.states = [
            {
                html: '<p><br></p>',
                selection: null
            }
        ];
    }

	static get properties() {
		return {
			activeState: Number,
			allowedStyleTypes: Array,
			allowedTagNames: Array,
			anchorNode: Object,
			anchorOffset: Number,
			baseNode: Object,
			baseOffset: Number,
			canRedo: Boolean,
			canToolbarScrollPrevious: Boolean,
			canToolbarScrollNext: Boolean,
			canUndo: Boolean,
			debug: Boolean,
			commonAncestorPath: Array,
			extentNode: Object,
			extentOffset: Number,
			focusNode: Object,
			focusOffset: Number,
			forceNarrow: Boolean,
			isCollapsed: Boolean,
			language: String,
			minWidth768px: Boolean,
			modifier: Object,
			mutationObserver: Object,
			noRedo: Boolean,
			noUndo: Boolean,
			placeholder: String,
			range0: Object,
			rangeCount: Number,
			replacementTagNames: Object,
			resources: Object,
			toolbarScrollDelay: Number,
			toolbarScrollStep: Number,
			toolbarScrollHeight: Number,
			toolbarScrollLeft: Number,
			toolbarScrollTop: Number,
			toolbarScrollWidth: Number,
			showPlaceholder: Boolean,
			states: Array,
			target: Object,
			text: String,
			tooltipPosition: String,
			type: String,
			value: String
		};
	}

    _render({target, modifier, forceNarrow, canToolbarScrollPrevious, minWidth768px, toolbarScrollTop, toolbarScrollLeft, canUndo, noUndo, tooltipPosition, language, resources, canRedo, noRedo, canToolbarScrollNext}) {
        return html`
            <style include="iron-flex iron-flex-alignment iron-flex-factors iron-positioning"></style>
            <style>
                :host {
                    display: block;
                    position: relative;
                    overflow-y: hidden;
                    font-family: var(--wysiwyg-font, Roboto);
                }

                #toolbar {
                    background: var(--wysiwyg-toolbar-background, #2A9AF2);
                    user-select: none;
                    color: var(--wysiwyg-toolbar-color, white);
                    @apply --wysiwyg-toolbar;
                }

                #toolbarLayout {
                    overflow: hidden;
                }

                #editable {
                    padding: 20px;
                    outline: none;
                    @apply --wysiwyg-editable;
                    @apply --layout-flex;
                }

                #editable[show-placeholder]:before {
                    content: attr(placeholder);
                    display: block;
                    position: absolute;
                    opacity: 0.5;
                    @apply --wysiwyg-editable-placeholder;
                }

                #editable > :first-child {
                    margin-top: 0;
                    @apply --wysiwyg-editable-first-child;
                }

                #editable > :last-child {
                    margin-bottom: 0;
                    @apply --wysiwyg-editable-last-child;
                }

                #editable ::selection {
                    color: white;
                    background: #2A9AF2;
                    @apply --wysiwyg-editable-selection;
                }

                #editable ol {
                    padding-left: 30px;
                    @apply --wysiwyg-editable-ol;
                }

                #editable ul {
                    padding-left: 30px;
                    @apply --wysiwyg-editable-ul;
                }

                #editable li {
                    @apply --wysiwyg-editable-li;
                }

                #editable a {
                    color: #2A9AF2;
                    @apply --wysiwyg-editable-a;
                }

                #editable img {
                    @apply --wysiwyg-editable-img;
                }

                #editable blockquote[blockquote] {
                    padding: 15px;
                    margin: 0;
                    border-left: 5px solid #eee;
                    @apply --wysiwyg-editable-blockquote;
                }

                #editable blockquote:not([blockquote]) {
                    padding: 0;
                    margin: 0 0 0 20px;
                    @apply --wysiwyg-editable-indent;
                }

                #editable code {
                    display: block;
                    padding: 10px;
                    margin: 10px 0;
                    line-height: 1.5;
                    background-color: #f7f7f7;
                    border-radius: 3px;
                    white-space: pre-wrap;
                    font-family: monospace;
                    @apply --wysiwyg-editable-code;
                }

                #editable p:first-child {
                    margin-top: 0;
                }

                #editable p {
                    @apply --wysiwyg-editable-p;
                }

                #editable h1 {
                    @apply --wysiwyg-editable-h1;
                }

                #editable h2{
                    @apply --wysiwyg-editable-h2;
                }

                #editable h3 {
                    @apply --wysiwyg-editable-h3;
                }

                #editable h4 {
                    @apply --wysiwyg-editable-h4;
                }

                #editable h5 {
                    @apply --wysiwyg-editable-h5;
                }

                #editable h6 {
                    @apply --wysiwyg-editable-h6;
                }

                #editable b {
                    @apply --wysiwyg-editable-b;
                }

                #editable u {
                    @apply --wysiwyg-editable-u;
                }

                #editable i {
                    @apply --wysiwyg-editable-i;
                }

                #editable strike {
                    @apply --wysiwyg-editable-strike;
                }

                #editable audio-wrapper,
                #editable video-wrapper {
                    display: block;
                }

                #editable audio,
                #editable video {
                    pointer-events: none;
                }

                #editable table {
                    border-spacing: 0;
                    border-collapse: collapse;
                }

                #editable table,
                #editable th,
                #editable td {
                    border: 1px solid black;
                }

                #editable th,
                #editable td {
                    padding: 5px 10px;
                }

                #editable thead,
                #editable tfoot {
                    font-weight: bold;
                    background: #ccc;
                    text-align: center;
                }

                #editable tbody tr:nth-child(even) {
                    background: #f5f5f5;
                }

                paper-button {
                    padding: 0;
                    margin: 0;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 0px;
                    min-width: 40px;
                    min-height: 40px;
                    background: transparent;
                    text-transform: none;
                }

                paper-button[disabled] {
                    color: rgba(255, 255, 255, 0.5);
                }

                @media (min-width: 768px) {
                    #layout {
                        @apply --layout-vertical;
                    }

                    #toolbar {
                        @apply --layout-horizontal;
                    }

                    #toolbarLayout {
                        height: 40px;
                        @apply --layout-horizontal;
                        @apply --layout-flex;
                        flex-wrap: nowrap;
                    }

                    #layout[force-narrow] {
                        @apply --layout-horizontal;
                    }

                    #layout[force-narrow] #toolbar {
                        @apply --layout-vertical;
                    }

                    #layout[force-narrow] #toolbarLayout {
                        height: auto;
                        @apply --layout-vertical;
                        width: 40px;
                        max-height: calc(100% - 80px);
                    }
                }

                @media (max-width: 767.9px) {
                    #layout {
                        @apply --layout-horizontal;
                    }

                    #toolbar {
                        @apply --layout-vertical;
                    }

                    #toolbarLayout {
                        @apply --layout-vertical;
                        width: 40px;
                        max-height: calc(100% - 80px);
                    }
                }

                #content {
                    overflow-y: auto;
                    @apply --layout-flex;
                    @apply --layout-vertical;
                }
            </style>
            <iron-a11y-keys target="${target}" keys="${modifier.key}+z" on-keys-pressed="undo"></iron-a11y-keys>
            <iron-a11y-keys target="${target}" keys="${modifier.key}+y" on-keys-pressed="redo"></iron-a11y-keys>
            <iron-media-query query="(min-width: 768px)" query-matches="{{minWidth768px}}"></iron-media-query>
            <div class="fit" id="layout" force-narrow$="${forceNarrow}">
                <div id="toolbar" on-tap="updateTools">
                    <mwc-button>Test</mwc-button>
                    <paper-button id="toolbarScrollPrevious" disabled="${!canToolbarScrollPrevious}">
                        <iron-icon icon="${this._toolbarScrollPreviousIcon(minWidth768px, forceNarrow)}"></iron-icon>
                    </paper-button>
                    <div id="toolbarLayout">
                        <slot id="tools"></slot>
                        <paper-button id="undo" disabled="${!canUndo}" hidden="${noUndo}">
                            <iron-icon icon="wysiwyg:undo"></iron-icon>
                        </paper-button>
                        <paper-tooltip for="undo" position="${tooltipPosition}" offset="5">
                            <wysiwyg-localize language="${language}" resources="${resources}" string-key="Undo"></wysiwyg-localize>
                            <span> (${modifier.tooltip} + Z)</span>
                        </paper-tooltip>
                        <paper-button id="redo" disabled="${!canRedo}" hidden="${noRedo}">
                            <iron-icon icon="wysiwyg:redo"></iron-icon>
                        </paper-button>
                        <paper-tooltip for="redo" position="${tooltipPosition}" offset="5">
                            <wysiwyg-localize language="${language}" resources="${resources}" string-key="Redo"></wysiwyg-localize>
                            <span> (${modifier.tooltip} + Y)</span>
                        </paper-tooltip>
                    </div>
                    <paper-button id="toolbarScrollNext" disabled="${!canToolbarScrollNext}">
                        <iron-icon icon="${this._toolbarScrollNextIcon(minWidth768px, forceNarrow)}"></iron-icon>
                    </paper-button>
                </div>
                <div id="content">
                    ${this._targetTemplate}
                </div>
            </div>
        `;
    }

    _toolbarScrollNextIcon(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'wysiwyg:scroll-right';
		return 'wysiwyg:scroll-down';
	}

    _toolbarScrollPreviousIcon(minWidth768px, forceNarrow) {
		if (minWidth768px && !forceNarrow) return 'wysiwyg:scroll-left';
		return 'wysiwyg:scroll-up';
	}
}

customElements.define('wysiwyg-e', WysiwygE);