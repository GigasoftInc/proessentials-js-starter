# Third-Party Notices

ProEssentialsJS is a product of Gigasoft, Inc. The charting engine is Gigasoft's
own work and incorporates no third-party charting, rendering or graphics
library.

ProEssentialsJS is compiled to WebAssembly with the Emscripten toolchain
(version 6.0.5). Compiling C++ for a browser requires the toolchain to supply
the runtime services an operating system would normally provide, and it links
its own implementations of those into the WebAssembly module. Those components
are listed below with their licenses, as those licenses require.

Every component is under a permissive license. None is copyleft. None places any
restriction on your use of ProEssentialsJS, and none requires you to disclose
your own source code.

Build-time tooling that is not linked into the distributed files is not listed
here.

---

## Emscripten

<https://emscripten.org> - dual licensed, MIT and University of Illinois/NCSA
Open Source License.

    Copyright (c) 2010-2014 Emscripten authors, see AUTHORS file.

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

The full text of both licenses is distributed with Emscripten at
<https://github.com/emscripten-core/emscripten/blob/main/LICENSE>.

---

## musl libc

<https://musl.libc.org> - MIT License. Emscripten's C library is derived from
musl.

    musl as a whole is licensed under the following standard MIT license:

    Copyright © 2005-2020 Rich Felker, et al.

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

The complete musl copyright notice, including the attribution of individual
contributed files, is distributed with Emscripten at
`system/lib/libc/musl/COPYRIGHT`.

---

## LLVM libc++, libc++abi and compiler-rt

<https://llvm.org> - Apache License v2.0 with LLVM Exceptions.

The C++ standard library, the C++ ABI support library and the compiler builtin
runtime are taken from the LLVM Project.

    The LLVM Project is under the Apache License v2.0 with LLVM Exceptions.

    Licensed under the Apache License, Version 2.0 (the "License"); you may not
    use this file except in compliance with the License. You may obtain a copy
    of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
    License for the specific language governing permissions and limitations
    under the License.

    ---- LLVM Exceptions to the Apache 2.0 License ----

    As an exception, if, as a result of your compiling your source code, portions
    of this Software are embedded into an Object form of such source code, you
    may redistribute such embedded portions in such Object form without complying
    with the conditions of Sections 4(a), 4(b) and 4(d) of the License.

    In addition, if you combine or link compiled forms of this Software with
    software that is licensed under the GPLv2 ("Combined Software") and if a
    court of competent jurisdiction determines that the patent provision (Section
    3), the indemnity provision (Section 9) or other Section of the License
    conflicts with the conditions of the GPLv2, you may retroactively and
    prospectively choose to deem waived or otherwise exclude such Section(s) of
    the License, but only in their entirety and only with respect to the Combined
    Software.

The full license text, including the complete Apache 2.0 terms, is distributed
with Emscripten at `system/lib/libcxx/LICENSE.TXT`,
`system/lib/libcxxabi/LICENSE.TXT` and `system/lib/compiler-rt/LICENSE.TXT`.

---

## dlmalloc

Doug Lea's memory allocator, used by Emscripten as the default `malloc`
implementation. Released to the public domain by its author.

    This is a version (aka dlmalloc) of malloc/free/realloc written by
    Doug Lea and released to the public domain, as explained at
    http://creativecommons.org/publicdomain/zero/1.0/

---

## Questions

Licensing questions about ProEssentialsJS are answered by the people who set the
terms: <https://www.gigasoft.com/contact>

The ProEssentialsJS license itself is in `PEJS-LICENSE.md` and at
<https://www.gigasoft.com/license>.
