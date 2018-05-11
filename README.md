# wysiwyg-e [![Build Status](https://travis-ci.org/miztroh/wysiwyg-e.svg?branch=master)](https://travis-ci.org/miztroh/wysiwyg-e) [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/miztroh/wysiwyg-e)

> /wɪziwɪɡi/

> A what-you-see-is-what-you-get editor created with Polymer.	Under the hood, it provides undo / redo history management, selection management, and a toolbar that accepts child elements to provide editing capabilities.	All the included tools (see below for list) are accessible via both the toolbar buttons and keyboard shortcuts.

## Included Tools (opt-in)

* Bold
* Italic
* Underline
* Strikethrough
* Color
* Clear Formatting
* Code
* Table
* Link
* Image
* Audio
* Video
* Ordered List
* Unordered List
* Indent
* Outdent
* Justify
* Headings
* Blockquote

## Usage

<!--
```
<custom-element-demo>
  <template>
    <script src="../../@webcomponents/webcomponentsjs/webcomponents-loader.js" async></script>
    <script src="../../web-animations-js/web-animations-next-lite.min.js" async></script>
    <script type="module" src="../wysiwyg-e.js"async></script>
    <script type="module" src="../tools/bold.js" async></script>
    <script type="module" src="../tools/italic.js" async></script>
    <script type="module" src="../tools/underline.js" async></script>
    <script type="module" src="../tools/strike.js" async></script>
    <script type="module" src="../tools/color.js" async></script>
    <script type="module" src="../tools/clear.js" async></script>
    <script type="module" src="../tools/code.js" async></script>
    <script type="module" src="../tools/table.js" async></script>
    <script type="module" src="../tools/link.js" async></script>
    <script type="module" src="../tools/image.js" async></script>
    <script type="module" src="../tools/audio.js" async></script>
    <script type="module" src="../tools/video.js" async></script>
    <script type="module" src="../tools/ordered.js" async></script>
    <script type="module" src="../tools/unordered.js" async></script>
    <script type="module" src="../tools/indent.js" async></script>
    <script type="module" src="../tools/outdent.js" async></script>
    <script type="module" src="../tools/justify.js" async></script>
    <script type="module" src="../tools/heading.js" async></script>
    <script type="module" src="../tools/blockquote.js" async></script>
    <wysiwyg-e style="width: 100vw; height: 100vh;" id="wysiwygE">
        <wysiwyg-tool-bold></wysiwyg-tool-bold>
        <wysiwyg-tool-italic></wysiwyg-tool-italic>
        <wysiwyg-tool-underline></wysiwyg-tool-underline>
        <wysiwyg-tool-strike></wysiwyg-tool-strike>
        <wysiwyg-tool-color></wysiwyg-tool-color>
        <wysiwyg-tool-clear></wysiwyg-tool-clear>
        <wysiwyg-tool-code></wysiwyg-tool-code>
        <wysiwyg-tool-table></wysiwyg-tool-table>
        <wysiwyg-tool-link></wysiwyg-tool-link>
        <wysiwyg-tool-image></wysiwyg-tool-image>
        <wysiwyg-tool-audio></wysiwyg-tool-audio>
        <wysiwyg-tool-video></wysiwyg-tool-video>
        <wysiwyg-tool-ordered></wysiwyg-tool-ordered>
        <wysiwyg-tool-unordered></wysiwyg-tool-unordered>
        <wysiwyg-tool-indent></wysiwyg-tool-indent>
        <wysiwyg-tool-outdent></wysiwyg-tool-outdent>
        <wysiwyg-tool-justify allow-right allow-center allow-full></wysiwyg-tool-justify>
        <wysiwyg-tool-heading allow-h1 allow-h2 allow-h3 allow-h4 allow-h5 allow-h6></wysiwyg-tool-heading>
        <wysiwyg-tool-blockquote></wysiwyg-tool-blockquote>
    </wysiwyg-e>
  </template>
</custom-element-demo>
```
-->
```html
<wysiwyg-e>
    <wysiwyg-tool-bold></wysiwyg-tool-bold>
    <wysiwyg-tool-italic></wysiwyg-tool-italic>
    <wysiwyg-tool-underline></wysiwyg-tool-underline>
    <wysiwyg-tool-strike></wysiwyg-tool-strike>
    <wysiwyg-tool-color></wysiwyg-tool-color>
    <wysiwyg-tool-clear></wysiwyg-tool-clear>
    <wysiwyg-tool-code></wysiwyg-tool-code>
    <wysiwyg-tool-table></wysiwyg-tool-table>
    <wysiwyg-tool-link></wysiwyg-tool-link>
    <wysiwyg-tool-image></wysiwyg-tool-image>
    <wysiwyg-tool-audio></wysiwyg-tool-audio>
    <wysiwyg-tool-video></wysiwyg-tool-video>
    <wysiwyg-tool-ordered></wysiwyg-tool-ordered>
    <wysiwyg-tool-unordered></wysiwyg-tool-unordered>
    <wysiwyg-tool-indent></wysiwyg-tool-indent>
    <wysiwyg-tool-outdent></wysiwyg-tool-outdent>
    <wysiwyg-tool-justify allow-right allow-center allow-full></wysiwyg-tool-justify>
    <wysiwyg-tool-heading allow-h1 allow-h2 allow-h3 allow-h4 allow-h5 allow-h6></wysiwyg-tool-heading>
    <wysiwyg-tool-blockquote></wysiwyg-tool-blockquote>
</wysiwyg-e>
```

## Installation

``npm install wysiwyg-e``

## License

### The MIT License (MIT)
Copyright (c) 2018 Jonathan Cox

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

![open source initiative](https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Opensource.svg/100px-Opensource.svg.png)