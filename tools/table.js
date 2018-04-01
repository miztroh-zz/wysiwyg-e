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
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { WysiwygTool } from '../wysiwyg-tool.js';
import { WysiwygLocalize } from '../wysiwyg-localize.js';

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-table');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolTable extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Table"></wysiwyg-localize>
				<span> (Shift + Alt + T)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+t" on-keys-pressed="open"></iron-a11y-keys>
			<paper-menu-button on-opened-changed="_paperDropdownOpenedChanged" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-table:icon"></iron-icon>
				</paper-button>
				<div style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Rows" localized="{{_localizedRows}}" hidden></wysiwyg-localize>
					<paper-input label="[[_localizedRows]]" always-float-label value="{{rowCount}}" id="rowCount"></paper-input>
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Columns" localized="{{_localizedColumns}}" hidden></wysiwyg-localize>
					<paper-input label="[[_localizedColumns]]" always-float-label value="{{columnCount}}" id="columnCount"></paper-input>
					<div class="horizontal layout" style="padding: 10px 0;">
						<paper-toggle-button checked="{{showHeader}}">
							<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Show Header"></wysiwyg-localize>
						</paper-toggle-button>
						<div class="flex"></div>
						<paper-toggle-button checked="{{showFooter}}">
							<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Show Footer"></wysiwyg-localize>
						</paper-toggle-button>
					</div>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close" on-tap="close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedTable]]" id="remove" icon="wysiwyg-tool:remove" on-tap="remove"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button id="updateInsert" icon="wysiwyg-tool:updateInsert" on-tap="updateInsert"></paper-icon-button>
					</div>
					<div hidden$="[[!selectedTable]]">
						<div class="layout horizontal">
							<paper-menu-button dynamic-align vertical-offset="42" horizontal-offset="5" id="insertDropdown">
								<paper-button slot="dropdown-trigger">
									<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Insert"></wysiwyg-localize>
									...
								</paper-button>
								<div slot="dropdown-content">
									<paper-item on-tap="insertCellBefore">
										<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Cell Before"></wysiwyg-localize>
									</paper-item>
									<paper-item on-tap="insertCellAfter">
										<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Cell After"></wysiwyg-localize>
									</paper-item>
									<paper-item on-tap="insertRowBefore">
										<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Row Before"></wysiwyg-localize>
									</paper-item>
									<paper-item on-tap="insertRowAfter">
									<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Row After"></wysiwyg-localize>
									</paper-item>
									<paper-item on-tap="insertColumnBefore">
										<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Column Before"></wysiwyg-localize>
									</paper-item>
									<paper-item on-tap="insertColumnAfter">
										<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Column After"></wysiwyg-localize>
									</paper-item>
								</div>
							</paper-menu-button>
							<div class="flex"></div>
							<paper-menu-button dynamic-align vertical-offset="42" horizontal-offset="5" id="deleteDropdown">
								<paper-button slot="dropdown-trigger">
									<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Delete"></wysiwyg-localize>
									...
								</paper-button>
								<div slot="dropdown-content">
									<paper-item on-tap="deleteCell">Cell</paper-item>
									<paper-item on-tap="deleteRow">Row</paper-item>
									<paper-item on-tap="deleteColumn">Column</paper-item>
								</div>
							</paper-menu-button>
						</div>
					</div>
				</div>
			</paper-menu-button>
		`;
	}

	static get properties() {
		return {
			columnCount: {
				type: Number,
				value: 1,
				observer: '_columnCountChanged'
			},
			rowCount: {
				type: Number,
				value: 1,
				observer: '_rowCountChanged'
			},
			selectedTable: {
				type: HTMLAnchorElement,
				computed: '_computeSelectedTable(commonAncestorPath)',
				observer: '_selectedTableChanged'
			},
			showFooter: {
				type: Boolean,
				value: false,
				observer: '_showFooterChanged'
			},
			showHeader: {
				type: Boolean,
				value: false,
				observer: '_showHeaderChanged'
			}
		};
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Cell After': 'Célula Após',
				'Cell Before': 'Célula Antes',
				'Column': 'Coluna',
				'Column After': 'Coluna Após',
				'Column Before': 'Coluna Antes',
				'Columns': 'Colunas',
				'Delete': 'Excluir',
				'Insert': 'Inserir',
				'Row': 'Linha',
				'Row After': 'Linha Após',
				'Row Before': 'Linha Antes',
				'Rows': 'Linhas',
				'Show Footer': 'Mostrar Rodapé',
				'Show Header': 'Mostrar Cabeçalho',
				'Table': 'Tabela'
			},
			'en': {
				'Cell After': 'Cell After',
				'Cell Before': 'Cell Before',
				'Column': 'Column',
				'Column After': 'Column After',
				'Column Before': 'Column Before',
				'Columns': 'Columns',
				'Delete': 'Delete',
				'Insert': 'Insert',
				'Row': 'Row',
				'Row After': 'Row After',
				'Row Before': 'Row Before',
				'Rows': 'Rows',
				'Show Footer': 'Show Footer',
				'Show Header': 'Show Header',
				'Table': 'Table'
			},
			'fr': {
				'Cell After': 'Cell After',
				'Cell Before': 'Cell Before',
				'Column': 'Column',
				'Column After': 'Column After',
				'Column Before': 'Column Before',
				'Columns': 'Columns',
				'Delete': 'Delete',
				'Insert': 'Insert',
				'Row': 'Row',
				'Row After': 'Row After',
				'Row Before': 'Row Before',
				'Rows': 'Rows',
				'Show Footer': 'Show Footer',
				'Show Header': 'Show Header',
				'Table': 'Table'
			}
		};

		this.allowedTagNames = ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'CAPTION', 'COL', 'COLGROUP', 'TR', 'TH', 'TD'];
	}

	close() {
		this.$.dropdown.close();
	}

	deleteCell() {
		this._deleteCommon();

		if (this.selectedTable && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				if (['TD', 'TH'].includes(this.commonAncestorPath[i].tagName)) {
					this.commonAncestorPath[i].parentNode.removeChild(this.commonAncestorPath[i]);
					break;
				}
			}
		}
	}

	deleteColumn() {
		this._deleteCommon();

		if (this.selectedTable && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				if (['TD', 'TH'].includes(this.commonAncestorPath[i].tagName)) {
					var nthChild = Array.prototype.indexOf.call(this.commonAncestorPath[i].parentNode.children, this.commonAncestorPath[i]) + 1;
					var cellsToDelete = this.selectedTable.querySelectorAll('td:nth-child(' + nthChild + '), th:nth-child(' + nthChild + ')');

					for (var j = 0; j < cellsToDelete.length; j += 1) {
						cellsToDelete[j].parentNode.removeChild(cellsToDelete[j]);
					}

					break;
				}
			}
		}
	}

	deleteRow() {
		this._deleteCommon();

		if (this.selectedTable && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				if (this.commonAncestorPath[i].tagName === 'TR') {
					this.commonAncestorPath[i].parentNode.removeChild(this.commonAncestorPath[i]);
					break;
				}
			}
		}
	}

	insertCellAfter() {
		this._insertCell(true);
	}

	insertCellBefore() {
		this._insertCell(false);
	}

	insertColumnAfter() {
		this._insertColumn(true);
	}

	insertColumnBefore() {
		this._insertColumn(false);
	}

	insertRowAfter() {
		this._insertRow(true);
	}

	insertRowBefore() {
		this._insertRow(false);
	}

	open() {
		this._selectedTableChanged();
		this.$.dropdown.open();

		setTimeout(
			function () {
				this.$.rowCount.focus();
			}.bind(this),
			100
		);
	}

	remove() {
		if (this.disabled || !this.range0) return;

		if (this.selectedTable) {
			this.selectedTable.parentNode.removeChild(this.selectedTable);
			this._setSelectedTable(null);
		}

		this.close();
	}

	updateInsert(event) {
		if (this.disabled || !this.range0) return;
		var rowCount = +this.rowCount, columnCount = +this.columnCount, showHeader  = this.showHeader, showFooter = this.showFooter;
		this.close();

		setTimeout(
			function () {
				if (!Number.isInteger(rowCount) || !Math.sign(rowCount) || !Number.isInteger(columnCount) || !Math.sign(columnCount)) return;
				var table, row, column, existingColumns, existingRows, existingColumn, existingRow, columnCountDiff, rowCountDiff, i, j, thead, tfoot, tbody;

				if (this.selectedTable) {
					table = this.selectedTable;
				} else {
					table = document.createElement('table');
				}

				// BEGIN HEADER SECTION
				thead = table.querySelector('thead');

				if (!showHeader) {
					if (thead) thead.parentNode.removeChild(thead);
				} else {
					if (!thead) {
						thead = document.createElement('thead');
						table.appendChild(thead);
					}

					existingRow = thead.querySelector('tr');

					if (!existingRow) {
						existingRow = document.createElement('tr');
						thead.appendChild(existingRow);
					}

					existingColumns = existingRow.querySelectorAll('th'), columnCountDiff = columnCount - existingColumns.length, column;

					for (j = columnCountDiff; Math.abs(j) !== 0; j -= Math.sign(columnCountDiff)) {
						if (columnCountDiff < 0) {
							column = existingColumns[existingColumns.length - 1];
							column.parentNode.removeChild(column);
						} else if (columnCountDiff > 0) {
							column = document.createElement('th');
							existingRow.appendChild(column);
						}

						existingColumns = existingRow.querySelectorAll('th');
					}
				}
				//END HEADER SECTION

				//BEGIN BODY SECTION
				tbody = table.querySelector('tbody');

				if (!tbody) {
					tbody = document.createElement('tbody');
					table.appendChild(tbody);
				}

				existingRows = tbody.querySelectorAll('tr'), rowCountDiff = rowCount - existingRows.length;

				for (i = rowCountDiff; Math.abs(i) !== 0; i -= Math.sign(rowCountDiff)) {
					if (rowCountDiff < 0) {
						row = existingRows[existingRows.length - 1];
						row.parentNode.removeChild(row);
					} else if (rowCountDiff > 0) {
						row = document.createElement('tr');
						tbody.appendChild(row);
					}

					existingRows = tbody.querySelectorAll('tr');
				}

				for (i = 0; i < existingRows.length; i += 1) {
					row = existingRows[i];
					existingColumns = row.querySelectorAll('td'), columnCountDiff = columnCount - existingColumns.length, column;

					for (j = columnCountDiff; Math.abs(j) !== 0; j -= Math.sign(columnCountDiff)) {
						if (columnCountDiff < 0) {
							column = existingColumns[existingColumns.length - 1];
							column.parentNode.removeChild(column);
						} else if (columnCountDiff > 0) {
							column = document.createElement('td');
							row.appendChild(column);
						}

						existingColumns = row.querySelectorAll('td');
					}
				}
				//END BODY SECTION

				// BEGIN FOOTER SECTION
				tfoot = table.querySelector('tfoot');

				if (!showFooter) {
					if (tfoot) tfoot.parentNode.removeChild(tfoot);
				} else {
					if (!tfoot) {
						tfoot = document.createElement('tfoot');
						table.appendChild(tfoot);
					}

					existingRow = tfoot.querySelector('tr');

					if (!existingRow) {
						existingRow = document.createElement('tr');
						tfoot.appendChild(existingRow);
					}

					existingColumns = existingRow.querySelectorAll('td'), columnCountDiff = columnCount - existingColumns.length, column;

					for (j = columnCountDiff; Math.abs(j) !== 0; j -= Math.sign(columnCountDiff)) {
						if (columnCountDiff < 0) {
							column = existingColumns[existingColumns.length - 1];
							column.parentNode.removeChild(column);
						} else if (columnCountDiff > 0) {
							column = document.createElement('td');
							existingRow.appendChild(column);
						}

						existingColumns = existingRow.querySelectorAll('td');
					}
				}
				//END FOOTER SECTION

				if (!this.selectedTable) {
					tbody.querySelector('td').appendChild(this.range0.extractContents());
					this.range0.deleteContents();
					this.range0.insertNode(table);
				}
			}.bind(this),
			10
		);
	}

	sanitize(node) {
		var sanitized = super.sanitize(node);

		if (node && node.tagName) {
			var childNodes = Array.prototype.slice.call(node.childNodes);

			switch (node.tagName) {
				//Remove empty TABLE and invalid TABLE children
				case 'TABLE':
					var childNodes = Array.prototype.slice.call(node.childNodes);

					if (!childNodes.length) {
						node.parentNode.removeChild(node);
					} else {
						for (j = 0; j < childNodes.length; j += 1) {
							if (!['THEAD', 'TBODY', 'TFOOT', 'CAPTION', 'COL', 'COLGROUP'].includes(childNodes[j].tagName)) {
								node.outerHTML = node.innerHTML;
								sanitized = false;
							}
						}
					}

					break;
				//Remove empty THEAD, TBODY, TFOOT and invalid THEAD, TBODY, TFOOT children
				case 'THEAD':
				case 'TBODY':
				case 'TFOOT':
					var childNodes = Array.prototype.slice.call(node.childNodes);

					if (!childNodes.length) {
						node.parentNode.removeChild(node);
					} else {
						for (var j = 0; j < childNodes.length; j += 1) {
							if (childNodes[j].tagName !== 'TR') {
								node.outerHTML = node.innerHTML;
								sanitized = false;
							}
						}
					}

					break;
				// Remove empty TR
				case 'TR':
					var childNodes = Array.prototype.slice.call(node.childNodes);

					if (!childNodes.length) {
						node.parentNode.removeChild(node);
					}

					break;
			}
		}

		return sanitized;
	}

	_columnCountChanged() {}
	
	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		return !!this._computeSelectedTable(commonAncestorPath);
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this._computeSelectedTable(commonAncestorPath)) return false;
		return !this.range0;
	}

	_computeSelectedTable(commonAncestorPath) {
		if (commonAncestorPath) {
			for (var i = 0; i < commonAncestorPath.length; i += 1) {
				if (commonAncestorPath[i].tagName === 'TABLE') return commonAncestorPath[i];
			}
		}

		return false;
	}

	_deleteCommon() {
		this.$.deleteDropdown.close();
		this.$.dropdown.close();
	}

	_insertCell(after) {
		this._insertCommon();

		if (this.selectedTable && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				if (['TD', 'TH'].includes(this.commonAncestorPath[i].tagName)) {
					var cell = document.createElement(this.commonAncestorPath[i].tagName);
					this.commonAncestorPath[i].parentNode.insertBefore(cell, after ? this.commonAncestorPath[i].nextSibling : this.commonAncestorPath[i]);
					break;
				}
			}
		}
	}

	_insertCommon() {
		this.$.insertDropdown.close();
		this.$.dropdown.close();
	}

	_insertColumn(after) {
		this._insertCommon();

		if (this.selectedTable && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				if (['TD', 'TH'].includes(this.commonAncestorPath[i].tagName)) {
					var columnIndex = Array.prototype.indexOf.call(this.commonAncestorPath[i].parentNode.children, this.commonAncestorPath[i]);
					if (after) columnIndex += 1;
					var rows = this.selectedTable.querySelectorAll('tr');

					for (var j = 0; j < rows.length; j += 1) {
						var columns = rows[j].querySelectorAll('td, th'), column = document.createElement(rows[j].parentNode.tagName === 'THEAD' ?  'TH' : 'TD');

						if (columns.length === 0 || columns.length <= columnIndex) {
							rows[j].appendChild(column);
						} else {
							rows[j].insertBefore(column, columns[columnIndex]);
						}
					}

					break;
				}
			}
		}
	}

	_insertRow(after) {
		this._insertCommon();

		if (this.selectedTable && this.commonAncestorPath) {
			for (var i = 0; i < this.commonAncestorPath.length; i += 1) {
				if (this.commonAncestorPath[i].tagName === 'TR') {
					var row = document.createElement('tr');

					for (var j = 0; j < this.commonAncestorPath[i].querySelectorAll(this.commonAncestorPath[i].parentNode.tagName === 'THEAD' ?  'TH' : 'TD').length; j += 1) {
						var cell = document.createElement(this.commonAncestorPath[i].parentNode.tagName === 'THEAD' ?  'TH' : 'TD');
						row.appendChild(cell);
					}

					this.commonAncestorPath[i].parentNode.insertBefore(row, after ? this.commonAncestorPath[i].nextSibling : this.commonAncestorPath[i]);
					break;
				}
			}
		}
	}

	_paperDropdownOpenedChanged(event) {
		if (this.$.dropdown.opened) return;
		this.columnCount = 1;
		this.rowCount = 1;
		this.showFooter = false;
		this.showHeader = false;

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

	_rowCountChanged() {}

	_selectedTableChanged(event) {
		if (this.selectedTable) {
			this.showHeader = !!this.selectedTable.querySelector('thead');
			this.showFooter = !!this.selectedTable.querySelector('tfoot');
			var rows = this.selectedTable.querySelectorAll('tbody > tr');
			this.rowCount = rows.length;
			var maxColumns = 1;

			for (var i = 0; i < rows.length; i += 1) {
				var columns = rows[i].querySelectorAll('td');
				if (columns.length > maxColumns) maxColumns = columns.length;
			}

			this.columnCount = maxColumns;
		} else {
			this.columnCount = 1;
			this.rowCount = 1;
			this.showFooter = false;
			this.showHeader = false;
		}
	}

	_showFooterChanged() {}

	_showHeaderChanged() {}

	_stopPropagation(event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-table', WysiwygToolTable);
