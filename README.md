# wysiwyg-e [![Build Status](https://travis-ci.org/miztroh/wysiwyg-e.svg?branch=master)](https://travis-ci.org/miztroh/wysiwyg-e)

> /wɪziwɪɡi/

> A what-you-see-is-what-you-get editor created with Polymer.  Under the hood, it provides undo / redo history management, selection management, and a toolbar that accepts child elements to provide editing capabilities.  All the included tools (see below for list) are accessible via both the toolbar buttons and keyboard shortcuts.

## Included Tools (opt-in)

* Bold
* Italic
* Underline
* Strikethrough
* Remove Format
* Link
* Image
* List (numbered / bulleted)
* Indent / Outdent
* Heading (H1 - H6)
* Blockquote
* Undo / Redo

## Usage

```
<wysiwyg-e>
  <wysiwyg-tool-bold class="wysiwyg-tool"></wysiwyg-tool-bold>
  <wysiwyg-tool-italic class="wysiwyg-tool"></wysiwyg-tool-italic>
  <wysiwyg-tool-underline class="wysiwyg-tool"></wysiwyg-tool-underline>
  <wysiwyg-tool-strike-through class="wysiwyg-tool"></wysiwyg-tool-strike-through>
  <wysiwyg-tool-remove-format class="wysiwyg-tool"></wysiwyg-tool-remove-format>
  <wysiwyg-tool-create-link-and-unlink class="wysiwyg-tool"></wysiwyg-tool-create-link-and-unlink>
  <wysiwyg-tool-insert-image class="wysiwyg-tool"></wysiwyg-tool-insert-image>
  <wysiwyg-tool-insert-list class="wysiwyg-tool"></wysiwyg-tool-insert-list>
  <wysiwyg-tool-indent class="wysiwyg-tool"></wysiwyg-tool-indent>
  <wysiwyg-tool-outdent class="wysiwyg-tool"></wysiwyg-tool-outdent>
  <wysiwyg-tool-heading class="wysiwyg-tool" h1 h2 h3 h4 h5 h6></wysiwyg-tool-heading>
  <wysiwyg-tool-blockquote class="wysiwyg-tool"></wysiwyg-tool-blockquote>
  <wysiwyg-tool-undo class="wysiwyg-tool"></wysiwyg-tool-undo>
  <wysiwyg-tool-redo class="wysiwyg-tool"></wysiwyg-tool-redo>
</wysiwyg-e>
```

## Usage and API

[Usage and API](https://miztroh.github.io/bower_components/wysiwyg-e/)<br>
[Demo](https://miztroh.github.io/bower_components/wysiwyg-e/demo/)

## Installation

``bower install wysiwyg-e``

## License

### The MIT License (MIT)
Copyright (c) 2016 Jonathan Cox

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

![open source initiative](images/open-source-initiative.png)
