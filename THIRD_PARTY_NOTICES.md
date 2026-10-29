# Third-party notices

The JoyApplyFlow project license covers its original code. The bundled libraries,
fonts, and public research metadata below retain their respective terms. Keep this
file and the license files in `dist/vendor/` in source archives and application
distributions.

## Bundled software

| Component | Bundled files | License and upstream source |
| --- | --- | --- |
| Tabler 1.7.1 | `dist/vendor/tabler/tabler.min.css`, `tabler.min.js` | MIT; [Tabler](https://github.com/tabler/tabler), [local license](dist/vendor/tabler/LICENSE), [asset provenance and hashes](dist/vendor/tabler/sources.json) |
| Bootstrap 5.3.8, included in Tabler | `dist/vendor/tabler/tabler.min.js` and Tabler styles | MIT; [upstream license](https://github.com/twbs/bootstrap/blob/v5.3.8/LICENSE) |
| Popper 2.x, included in Tabler | `dist/vendor/tabler/tabler.min.js` | MIT; [upstream license](https://github.com/popperjs/popper-core/blob/v2.11.8/LICENSE.md) |
| PDF.js 5.6.205 | `dist/vendor/pdf.min.mjs`, `pdf.worker.min.mjs` | Apache-2.0; [PDF.js release source](https://github.com/mozilla/pdf.js/tree/v5.6.205), [local license](dist/vendor/LICENSE-pdfjs). Copyright 2024 Mozilla Foundation; original file headers retained. |
| core-js 3.48.0, included in PDF.js | `dist/vendor/pdf.min.mjs`, `pdf.worker.min.mjs` | MIT; [upstream license](https://github.com/zloirock/core-js/blob/v3.48.0/LICENSE) |
| JSZip 3.10.1 | `dist/vendor/jszip.min.js` | MIT option of MIT OR GPL-3.0-or-later; [JSZip](https://github.com/Stuk/jszip/tree/v3.10.1), [local upstream license](dist/vendor/LICENSE-jszip.md) |
| pako 1.x, included in JSZip | `dist/vendor/jszip.min.js` | MIT and zlib for the zlib port; [MIT license](https://github.com/nodeca/pako/blob/1.0.11/LICENSE), [zlib-port notice](https://github.com/nodeca/pako/blob/1.0.11/lib/zlib/deflate.js) |
| lie, included in JSZip | `dist/vendor/jszip.min.js` | MIT; [upstream license](https://github.com/calvinmetcalf/lie/blob/v3.3.0/license.md) |
| immediate, included in JSZip | `dist/vendor/jszip.min.js` | MIT; [upstream license](https://github.com/calvinmetcalf/immediate/blob/v3.0.6/LICENSE.txt) |
| setImmediate, included in JSZip | `dist/vendor/jszip.min.js` | MIT; [upstream license](https://github.com/YuzuJS/setImmediate/blob/1.0.5/LICENSE.txt) |

The transitive components are identified from the distributed bundles and their
upstream sources. Versions are stated only where identifiable in the bundled
asset; the versioned license links document the applicable upstream notices.

## MIT notices

The following copyright notices apply to the components named above. The MIT
permission and warranty text that follows applies separately to each component.

- Tabler: Copyright (c) 2018-2026 The Tabler Authors; Copyright 2018-2026 codecalm.net Paweł Kuna.
- Bootstrap: Copyright (c) 2011-2025 The Bootstrap Authors.
- Popper: Copyright (c) 2019 Federico Zivolo.
- core-js: Copyright (c) 2013–2025 Denis Pushkarev (zloirock.ru); Copyright (c) 2025–2026 CoreJS Company (core-js.io).
- JSZip: Copyright (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso.
- pako: Copyright (C) 2014-2017 by Vitaly Puzrin and Andrei Tuputcyn.
- lie: Copyright (c) 2014-2018 Calvin Metcalf, Jordan Harband.
- immediate: Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, Domenic Denicola, Brian Cavalier.
- setImmediate: Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola.

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## zlib port in pako / JSZip

The zlib implementation bundled through pako is credited to its original authors.
The following notice is retained from the upstream zlib-port source:

```text
(C) 1995-2013 Jean-loup Gailly and Mark Adler
(C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
   claim that you wrote the original software. If you use this software
   in a product, an acknowledgment in the product documentation would be
   appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
```

## PDF character maps and fonts

- Adobe CMaps in `dist/vendor/cmaps/`: Copyright 1990-2009 Adobe Systems
  Incorporated; BSD-3-Clause terms retained in [cmaps/LICENSE](dist/vendor/cmaps/LICENSE).
- Foxit standard fonts in `dist/vendor/standard_fonts/`: Copyright 2014 PDFium
  Authors; BSD-3-Clause terms retained in [LICENSE_FOXIT](dist/vendor/standard_fonts/LICENSE_FOXIT).
- Liberation Sans font files: digitized data copyright (c) 2010 Google
  Corporation, with Reserved Font Names Arimo, Tinos and Cousine; copyright (c)
  2012 Red Hat, Inc., with Reserved Font Name Liberation. SIL Open Font License
  1.1 retained in [LICENSE_LIBERATION](dist/vendor/standard_fonts/LICENSE_LIBERATION).

## Research metadata and external content

Mentor and literature samples contain public academic metadata, short factual
notes, and source links. Source URLs document the provenance of individual
claims. A paper's authorship or correspondence address does not imply current
employment, recruiting availability, or endorsement of this application.

`dist/literature-seed.json` intentionally leaves `abstract`, `summaryZh`, and
`abstractSource` empty. Publisher abstracts, translated abstracts, article PDFs,
and full page copies are not included in the public seed. Runtime RSS responses,
imported documents, browser storage, and exports remain user data and must not be
added to the repository or release archive. Follow the terms of the linked
publisher or institution when fetching or reusing their material; links and
citations do not grant redistribution rights.
