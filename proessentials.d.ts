// ProEssentialsJS -- Copyright 1994-2026 Gigasoft, Inc. All rights reserved.
// Commercial product, free for commercial use under USD 250,000 annual
// revenue. See PEJS-LICENSE.md -- https://www.gigasoft.com

// Types for the package entry point, `dist/proessentials.iife.js`.
//
// It lives here in Wasm\hello beside every other .d.ts, and stages into dist\
// as an ordinary FILES entry -- so one sync carries it and the copyright guard
// covers it. (It arrived via an EXTRAS list and a `dist/proessentials.js` entry
// point; both are gone, and this comment named them for a day after they were.)
//
// This file describes ONLY what `require('proessentials')` and
// `<script src="proessentials.iife.js">` actually hand back: the emscripten module
// factory. It deliberately does NOT re-export the chart API. The chart API
// lives in the four generated facades and is imported by its own path:
//
//     import { attachApi } from 'proessentials/dist/pe-api-graph.js';
//
// Pointing this file at the facade types instead would type-check an import
// that crashes at run time. arethetypeswrong flags it, and it is worse than
// having no types at all.
//
// The declarations sit in a namespace merged with the function because
// `export =` cannot coexist with other exported elements (TS2309).
//
// Every option below was verified against the generated glue on 2026-08-22.
// Options emscripten normally offers but THIS build rejects with an abort
// (wasmBinary, mainScriptUrlOrBlob, preloadPlugins and about twenty more) are
// left out on purpose.

/** Instantiates the ProEssentials WebAssembly engine.
 *
 *      const m = await ProEssentials();
 *      const ctl = new PeControl(el, { module: m, kind: 'graph',
 *                                      width: 800, height: 520 });
 *
 *  One module can back several controls. */
declare function ProEssentials(
  options?: ProEssentials.PeModuleOptions
): Promise<ProEssentials.PeModule>;

declare namespace ProEssentials {
  /** The instantiated engine. Passed to `new PeControl(el, { module })`.
   *  Members are the exported C++ entry points plus the emscripten runtime;
   *  the facades are what give them names, so this stays an index signature. */
  interface PeModule {
    [key: string]: any;
  }

  interface PeModuleOptions {
    /** Where to fetch `proessentials.wasm` from.
     *
     *  Needed by any bundler build. The default resolves the binary relative
     *  to `document.currentScript.src`, which is null inside an ES module, so
     *  the fetch falls back to the page URL and 404s. Supply this and the
     *  engine can live anywhere:
     *
     *      import wasmUrl from 'proessentials/dist/proessentials.wasm?url';
     *      const m = await ProEssentials({ locateFile: () => wasmUrl });
     */
    locateFile?(path: string, scriptDirectory: string): string;

    /** Replaces the whole WebAssembly instantiation. Use for a cached or
     *  streamed module. Call `successCallback(instance)` when done. */
    instantiateWasm?(
      imports: WebAssembly.Imports,
      successCallback: (instance: WebAssembly.Instance) => void
    ): WebAssembly.Exports | void;

    /** Fired once the runtime is up, before the factory's promise settles. */
    onRuntimeInitialized?(): void;

    /** stdout. Defaults to console.log. */
    print?(text: string): void;
    /** stderr. Defaults to console.error. */
    printErr?(text: string): void;

    preInit?: (() => void) | Array<() => void>;
    noExitRuntime?: boolean;
    thisProgram?: string;
    arguments?: string[];
  }
}

// *** THE SCRIPT-TAG GLOBAL. ***
//
// Ten classic <script> tags is the documented no-toolchain path, and it leaves
// `ProEssentials` on the window. This file is a MODULE -- it uses `export =` --
// so without the block below that name exists only for someone who IMPORTS the
// package. A script-tag user, who is the documented majority case, gets
// "Cannot find name 'ProEssentials'" on the first line they write, and the
// module argument to `new PeControl(el, {module: m})` degrades to `any`.
//
// `pe-control.d.ts` gets this for free by being an ambient script rather than a
// module, which is why `PeControl` resolved and this did not. Measured in a
// real project 2026-08-24: before, one error and `m: any`; after, no
// diagnostics and `m: PeModule`.
declare global {
  const ProEssentials: typeof import('./proessentials.js');
}

export = ProEssentials;
