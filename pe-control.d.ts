// ProEssentialsJS -- Copyright 1994-2026 Gigasoft, Inc. All rights reserved.
// Commercial product, free for commercial use under USD 250,000 annual
// revenue. See PEJS-LICENSE.md -- https://www.gigasoft.com

// pe-control.d.ts -- declarations for the CONTROL, the thing a customer
// constructs.  08/12/26.  Technology\js-intellisense-todo.md section 4a.
//
// WHY THIS FILE EXISTS. The four generated facades type the whole property
// tree, so `pego.PePlot.DataShadows = ...` completes and checks -- and the
// FIRST line anyone writes had nothing at all:
//
//     const pego = new PeControl(host, { module: m, kind: 'graph', ... });
//
// no completion on the options, the kind strings, the methods or the events.
//
// *** HAND-WRITTEN, AND THEREFORE GATED. ***  pe-control.js is hand-written, so
// unlike the facades this file cannot be generated from the same run -- which
// means it is free to drift, and drift is not hypothetical here: the facade's
// generated .d.ts and .js disagreed about 170 exports for months and nothing
// noticed, because nothing had ever compared them (section 3). So this file is
// checked against the RUNTIME by:
//
//     node tools\check-control-types.mjs
//
// which loads pe-control.js in node, enumerates the real prototype and statics,
// and fails if this file declares a member that does not exist OR omits a
// public one that does. Add a method to pe-control.js and the gate tells you to
// come back here. A declaration file is an assertion about the runtime; only
// the runtime can falsify it.
//
// GLOBAL, NOT A MODULE, because that is how the file is actually consumed:
// `<script src="pe-control.js">` then a bare `PeControl`. The file also assigns
// `module.exports` as a fallback, so WHEN THIS BECOMES AN NPM PACKAGE this has
// to grow an `export =` form -- see section 5. Deliberately not written that
// way now: a module-shaped .d.ts would stop the global from resolving in every
// page in hello\ and PeDemoWasm\, which is all of them.
//
// UNDERSCORED MEMBERS ARE DELIBERATELY ABSENT. There are 29 of them and they
// are internals; the gate knows to ignore them rather than demand them.
//
// *** PLAIN JAVASCRIPT UNDER `// @ts-check`: ANNOTATE THE VARIABLE, ONCE. ***
//
//     /** @type {PeControl} */
//     const chart = new PeControl(host, { module: m, kind: 'graph' });
//
// Without that line the event handlers lose their parameter types --
// `chart.onRender = (n) => ...` reports "Parameter 'n' implicitly has an 'any'
// type", and assigning the same handler twice reports "Duplicate identifier".
// That is TypeScript's JS mode treating a property assignment on an instance
// as an EXPANDO DECLARATION, not a flaw in this file: the identical code in a
// `.ts` file is clean either way, measured both ways. With the annotation the
// JS path is fully checked -- `n.toUpperCase()` on a number is caught. Both
// arms are asserted in tools\check-control-types.mjs so this note stays true.

/** The emscripten Module object -- `await ProEssentials()`. */
type PeModule = unknown;

/**
 * Which control to create. Each kind is a different C++ class with its own
 * property numbering and its own enum tables, so this is not cosmetic:
 * `Wasm\WEB-API-ENUMS.md` and the per-control facade go with the choice.
 *
 * `sgraph3d` is the 3D scientific graph (Pe3do); `sgraph` is the 2D one.
 */
type PeControlKind = 'graph' | 'sgraph' | 'sgraph3d' | 'pie' | 'pgraph';

interface PeControlOptions {
  /** The loaded wasm module. Required. */
  module: PeModule;
  /** Required. An unknown kind throws from the constructor. */
  kind: PeControlKind;
  /** CSS pixels. Default 640. */
  width?: number;
  /** CSS pixels. Default 480. */
  height?: number;
  /** Built-in bitmaps, from `PeControl.loadBuiltins()`. */
  images?: unknown;
  /**
   * Set `false` to stop the control fetching the built-in QuickStyle bitmaps
   * by itself. Default `true`, which is what makes `QuickStyle` work with no
   * page code. Turn it off only for a page that must issue no image requests;
   * the desk and graph bitmaps then do not paint.
   */
  builtins?: boolean;
  /** 3D only -- the polygon mode passed to the create export. */
  polyMode?: number;
  /**
   * Scrollbar arrow width handed to the engine BEFORE the first
   * InitializeVars. Every control reads the metric in its own, so setting it
   * after the first render is too late. 0 restores pre-08/10/26 behaviour.
   */
  scrollArrowWidth?: number;
  /** Re-fit the control when the host element resizes. */
  autoResize?: boolean;
  /**
   * BCP-47 tag for this chart's number separators, e.g. 'de-DE'. Applied in
   * the constructor for the same reason scrollArrowWidth is: InitializeVars
   * re-applies the international defaults on every rebuild, so a write after
   * the first render is too late for that render. Omit to follow
   * `PeControl.culture()`, which auto-detects from navigator.languages.
   */
  culture?: string;
}

/** A rectangle in GRAPH coordinates, with a hit test. */
interface PeGraphRect {
  left: number; top: number; right: number; bottom: number;
  /** False when the engine has no rect to report; the numbers are then stale. */
  ok: boolean;
  contains(p: { x: number; y: number } | null | undefined): boolean;
}

/** The zoom band's current rectangle, or null when nothing is being dragged. */
interface PeZoomRect {
  left: number; top: number; right: number; bottom: number;
  [k: string]: number;
}

/** One table annotation's live state. */
interface PeTableState {
  index: number; rows: number; cols: number; location: number;
  rect: unknown;
}

/** A pixel resolved to graph space. Null when the point is outside the plot. */
interface PeGraphPoint {
  axis: number; x: number; y: number; gx: number; gy: number;
}

/**
 * What a post-scroll handler receives. `bar` is PeControl.SB_HORZ or SB_VERT;
 * `previous` is the position before this scroll, so a handler can tell
 * direction without keeping its own copy.
 */
interface PeScrollEvent {
  bar: number; position: number; previous: number; horizontal: boolean;
}

/**
 * The group and decimal marks for a culture, as CHARACTER CODES. 0 means "use
 * the engine's own default" -- en-US resolves to 0/0 on purpose, so a US page
 * never writes the properties at all.
 */
interface PeSeparators {
  group: number; decimal: number;
}

/** What `PeControl.loadStrings` resolves to. Null when no bundle answered. */
interface PeStringsLoaded {
  /** The bundle actually installed, which may be a fallback ('zh-Hans', 'en'). */
  culture: string;
  /** Ids installed into the engine, 566-599 depending on the culture. */
  strings: number;
  /** Dialogs switched to the same culture. 5 on a page shipping all of them. */
  dialogs: number;
  /** Ids this culture lacked and inherited from English. Absent for 'en'. */
  filledFromEn?: number;
}

/** A localizable dialog present on the page. */
interface PeDialogRef {
  name: string; api: unknown;
}

declare class PeControl {
  /**
   * Builds the canvas, the scrollbars and the overlay, creates the engine
   * handle, and wires input, menus and notifications. Throws if `host` is
   * missing, if `kind` is unknown, or if the engine returns handle 0.
   */
  constructor(host: HTMLElement, opts: PeControlOptions);

  // -- identity and DOM ----------------------------------------------------
  /** The engine handle. Pass to `attachApi(core, handle)` for the facade. */
  readonly handle: number;
  readonly kind: PeControlKind;
  readonly width: number;
  readonly height: number;
  /** The outer element: canvas plus scrollbars. This is what to size. */
  readonly el: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  /** The transparent layer the table and cursor draw on, above the chart. */
  readonly overlay: HTMLCanvasElement;
  readonly player: unknown;

  // -- events. Assign a function; there is no addEventListener here. --------
  /** After every present. `n` is the record-stream size in bytes. */
  onRender?: (n: number) => void;
  /** Engine notification. `name` is resolved via `PeControl.notifyName`. */
  onNotify?: (code: number, name: string) => void;
  /** Return a string to replace the tracking tooltip's text. */
  onCustomTrackingDataText?: (ev: unknown) => string | void;
  /**
   * `PeParamUpdate` -- the engine re-initialised its working parameters, so an
   * app mirroring chart state into its own UI should re-read. Fires TWICE per
   * reinitialize, which is the engine's own cadence, not a bug.
   */
  onParamUpdate?: (ev: Record<string, never>) => void;
  /** `PePopupMenu` -- the engine's right-click menu ran a command. */
  onPopupMenu?: (ev: Record<string, never>) => void;
  /**
   * `PeCustomGridNumber` -- replace or extend one axis label. Assign to
   * `ev.text` to change it; leave it alone and the engine keeps its own.
   *
   * **Fires MANY times per render** -- the engine warns about this itself,
   * because grid-number spacing is decided inside the layout and this event
   * modifies it.
   *
   * **On a Pe3do this is DIRECT2D ONLY.** The four 3D send sites draw the axis
   * text on the Direct2D arm; at `RenderEngine = Direct3D` the labels come from
   * the DX3D text builders and this does not fire. Measured: 10 at Direct2D, 0
   * at Direct3D, same chart.
   *
   * A replacement of 46 characters or more is DISCARDED by the engine, not
   * truncated; `gridNumberRefused` is set to true when that happens.
   */
  onCustomGridNumber?: (ev: { axisType: number; axisIndex: number;
                              value: number; text: string }) => void;
  /** True when the last `onCustomGridNumber` replacement was too long and dropped. */
  gridNumberRefused?: boolean;
  /** Message from the last named event handler that threw, if any. */
  eventHookError?: string;

  // -- properties ----------------------------------------------------------
  /**
   * Write a scalar. `prop` is a PEP_ id -- NEVER hand-typed; a name absent
   * from a `*-ids.json` becomes `undefined`, then 0, and writes PROPERTY 0
   * with nothing reported. Use `gen-page-ids.py`, or the typed facade.
   */
  set(prop: number, v: number): number;
  get(prop: number): number;
  /**
   * The DOUBLE twin of `set`, for the float/double property family
   * (ManualMinX/MaxX, ManualMinZ/MaxZ ...). Added 08/17/26 with the surface
   * mesh cache: `_core().vset` used to go straight at the module and skip the
   * GPU dirty route, which is the exact family a ZOOM writes.
   */
  setValue(prop: number, v: number): number;
  setString(prop: number, s: string): number;
  setCell(prop: number, i: number, v: number): number;
  setStringCell(prop: number, i: number, s: string): number;
  /** Two-dimensional write: subset `s`, point `p`. */
  setCellEx(prop: number, s: number, p: number, v: number): number;

  /**
   * "I changed the data behind your back." Every other dirty route is a
   * PROPERTY WRITE, and the fastest way to feed the engine is not one -- a
   * zero-copy block is a raw write into the wasm heap that nothing at this
   * boundary can see. Call this after one, or a cached GPU mesh goes stale.
   */
  dataChanged(): this;

  /**
   * .NET's `PeHorzScroll` -- raised AFTER a horizontal scroll is applied, from
   * whichever path moved it: the thumb, the wheel, or a 3D drag rotation.
   * NOT a `PEWN_` notification; the pre-scroll pair are separate messages that
   * exist to cancel a scroll.
   *
   * `position` is a real integer. Do NOT copy .NET's
   * `Position > 32767 ? Position - 65536 : Position` -- that undoes a 16-bit
   * WM_ field which does not exist here.
   */
  /**
   * `PeZoomIn`, on a Pe3do only. Fired ONCE when a mouse-wheel zoom finishes,
   * not per step, and for BOTH wheel directions -- there is deliberately no
   * `onZoomOut`, matching WPF and WinUI (PeChartBase.cs:2549).
   *
   * Requires `PeUserInterface.Scrollbar.MouseWheelZoomSmoothness > 1`,
   * `PeConfigure.RenderEngine = Direct3D` and
   * `PePlot.Option.MouseWheelZoomEvents = true`; below those it does not fire,
   * which is also what the .NET control does. A 2D chart's PeZoomIn is
   * engine-driven and is NOT delivered on the web yet -- see
   * REPORT-EVENT-GAPS-20260818.md.
   *
   * A throwing handler is caught and its message left in `zoomHookError`.
   */
  /**
   * Read a DOUBLE-valued property. The twin of `setValue`, and the one to use
   * for any `f*` property -- `get` is `pe_nget` and truncates a float
   * SILENTLY, which for the zoom family lands on 0, a legitimate value.
   */
  getValue(prop: number): number;
  onZoomIn?: (e: { zoom: number }) => void;
  /**
   * `PeZoomOut` -- **2D only, deliberately.** WPF and WinUI never raise it for a
   * 3D chart even when zooming out, and the engine has no 3D send site: all 11
   * are 2D. Fires on Undo Zoom and on a zoom-out step.
   */
  onZoomOut?: (e: Record<string, never>) => void;
  /**
   * `PeCustomTrackingOtherText` -- the twin of `onCustomTrackingDataText`, for
   * the tooltip text when the cursor is NOT over a data point. Assign to
   * `ev.trackingText` to replace it; leave it and the engine keeps its own.
   */
  onCustomTrackingOtherText?: (ev: { trackingText: string }) => void;
  /**
   * `PeCursorMoved` -- the data cursor moved to a DIFFERENT subset or point.
   * Re-writing the position it already holds raises nothing.
   *
   * The cursor is moved by writing `PeUserInterface.Cursor.Subset` /
   * `.Point` on a chart that has already been laid out; **clicking does not
   * move it**. Requires `Cursor.Mode = DataCross`.
   */
  onCursorMoved?: (ev: { subset: number; point: number }) => void;
  /** `PePreCursorMove` -- fires before the move is committed, so `ev` still
   *  carries the position the cursor is leaving. */
  onPreCursorMove?: (ev: { subset: number; point: number }) => void;
  /**
   * `PeTAMoved` -- a table annotation was DRAGGED to a new position. Raised
   * only when the position actually changed, so a drag that misses is silent.
   * Needs `Table.Moveable` and a laid-out chart (the hot spots are built by the
   * layout).
   */
  onTAMoved?: (ev: { table: number; x: number; y: number }) => void;
  /**
   * `PeGraphAnnotationMoved` -- a graph annotation was dragged.
   *
   * **Only a POINTER-type annotation is draggable** (`PEGAT_POINTER` and the
   * POINTER_VECTOR / POINTER_ARROW families). A plain text annotation cannot be
   * moved and this never fires for one. Its hot spot must also be enabled.
   */
  onGraphAnnotationMoved?: (ev: Record<string, never>) => void;
  /** Message from the last `onZoomIn` handler that threw, if any. */
  zoomHookError?: string;
  onHorzScroll?: (e: PeScrollEvent) => void;
  /** .NET's `PeVertScroll`. See `onHorzScroll`. */
  onVertScroll?: (e: PeScrollEvent) => void;
  /** Set when an onHorzScroll/onVertScroll handler threw. */
  scrollHookError?: string;

  /**
   * Bind a generated facade to this control's handle. Returns whatever the
   * facade's `attachApi` returns, which is `PeChart` in all five of them.
   *
   * *** GENERIC, AND THAT IS NOT A REFINEMENT. *** Declared to return
   * `unknown`, this one line cost the product its entire intellisense
   * surface: `const Pego1 = ctl.attach(attachApi)` made `Pego1` `unknown`,
   * so NOTHING on it resolved -- not one property group, on any chart kind.
   * Measured with the TypeScript service that fills the completion popup:
   * 0 members offered before, 24 after.
   *
   * It presented as "intellisense is incomplete" rather than absent, because
   * the editor falls back to scraping words out of the open file, so the
   * popup showed exactly the groups that page happened to already mention.
   *
   * `check-control-types` cannot see this: it tests MEMBERSHIP, and `attach`
   * is present and declared. A return type is invisible to it.
   */
  attach<T>(attachApi: (core: unknown, h: number) => T, core?: unknown): T;

  // -- drawing -------------------------------------------------------------
  /** Full render: engine re-layout, then paint. Returns the stream size. */
  render(): number;
  /** Repaint the LAST stream with no engine call -- for player settings. */
  replay(): number;
  /**
   * .NET's `Invalidate()`. The real-time pattern: append data, set
   * `ReuseDataZ` and `Force3dxVerticeRebuild`, then call this.
   *
   * NOT `redraw()` and NOT `render()` -- it plays the stream that is already
   * built and composites the surface layer, never calling CreateMeta.
   *
   * Returns `replay()`'s stream size rather than void, which is what the
   * runtime actually does. .NET returns void here; declaring void to match
   * .NET would be describing a function that does not exist.
   */
  invalidate(): number;
  /** Alias of {@link invalidate}, for callers who reach for `refresh`. */
  refresh(): number;
  /** Re-render without resetting the image. */
  redraw(): void;
  paintBackground(): void;
  /**
   * The chart's WORKING desk colour as a 32-bit COLORREF -- R in the low byte,
   * alpha in the high byte (Pegrpapi.h:1183). This is what paintBackground
   * clears to, mirroring the desktop's own window layer (RBaseWin.cpp:944).
   * A value of 1 means TRANSPARENT rather than a colour.
   */
  deskColor(): number;
  /** Re-fit and re-render at a new size. Returns the stream size. */
  setSize(width: number, height: number): number;
  /**
   * Size to fit a box, subtracting the control's own chrome. Pass the
   * CURRENT pane width -- fitting against a stale one clips the scrollbar.
   */
  fitInto(boxW: number, boxH: number): number;
  /** Pixel snapping for the player. */
  setSnap(mode: number): number;
  /** Discard engine state and start over. Does not repaint. */
  reset(): void;
  /** Release the handle, the DOM and every listener. */
  destroy(): void;

  // -- the overlay layers --------------------------------------------------
  drawTable(nTable: number): void;
  drawTables(list?: number[]): void;
  /** Live state of every table annotation. */
  tables(): PeTableState[];
  clearTableLayer(): void;
  /** Open the quick-annotation layer. Pair with `endQuick()`. */
  drawQuick(): void;
  endQuick(): void;
  drawCursor(): void;

  // -- geometry and input --------------------------------------------------
  /** The plot rectangle in graph coordinates. */
  rectGraph(): PeGraphRect;
  /** Resolve a pixel to graph space, or null if outside the plot. */
  convPixelToGraph(opts?: unknown): PeGraphPoint | null;
  /** The zoom band, or null when no drag is in progress. */
  zoomRect(): PeZoomRect | null;
  /** The engine's last mouse position. */
  lastMouseMove(): unknown;
  setBandStyle(s: unknown): void;
  /**
   * Re-apply the cursor the engine asks for. Does NOT poke the engine: it
   * reads the ops row, because a question should not be an event.
   */
  refreshCursor(): void;
  /** 3D only -- rebuild after a change that needs new geometry. */
  reconstruct3d(): void;

  // -- statics -------------------------------------------------------------
  /** Register a new kind. `def` supplies `create` and `scrollLabel`. */
  static register(name: string, def: unknown): void;
  /** The registered kind names. */
  static kinds(): string[];
  /**
   * The most recently constructed control, so a shipped page can be re-judged
   * from the console. LAST, not a registry -- two charts and the second wins.
   */
  static last: PeControl | undefined;
  static readonly SB_HORZ: number;
  static readonly SB_VERT: number;
  /**
   * The id of the single shared WebGPU canvas. There is ONE per module
   * (pegpu-wgpu.cpp), not one per chart, so a page that needs to find it must
   * be told the name rather than invent one.
   */
  static readonly GPU_CANVAS_ID: string;
  /** Which optional behaviours this BUILD carries. Pages use it as a
   *  freshness probe -- port 8099 sends no cache headers, so a stale
   *  pe-control.js is otherwise indistinguishable from a missing feature.
   *  Declared 08/17/26: it has existed on the class since the GPU-layer work
   *  and check-control-types.mjs had been reporting `undeclared: FEATURES`
   *  the whole time. A gate that is known-red trains people to skip it. */
  static readonly FEATURES: Record<string, number>;
  /**
   * The compute builder's own failure notes that mean "not yet" rather than
   * "wrong", so a chart that comes up before its device or its data is not
   * sentenced to the CPU builder for ever. Anything NOT matching means compute
   * ran and produced nothing usable -- a real wrong mesh, which latches.
   *
   * Public because a page that wants to know why it got the CPU mesh has to
   * test the note against something, and hand-copying this pattern into a page
   * is how it goes stale.
   */
  static readonly RETRY_CS: RegExp;
  /**
   * Load the built-in QuickStyle bitmaps.
   *
   * YOU DO NOT NORMALLY NEED THIS. Since 08/25/26 a control loads them by
   * itself, resolving the folder from the library's own script URL, so the
   * bitmaps are found wherever the bundle is -- flat beside it, in `lib/`, or
   * under `node_modules`. Call this only to override that: `dir` points at a
   * folder holding `1700.png` .. `1710.png`, for a page hosting them
   * elsewhere, such as a CDN.
   *
   * `dir` is OPTIONAL and omitting it is the same resolution the control does
   * automatically. It used to be required, and defaulted to `bmps` relative to
   * the DOCUMENT -- which was right only when the page sat in the library's
   * own folder.
   *
   * Awaiting before constructing is no longer necessary; a control that is
   * built first repaints itself when the images arrive.
   */
  static loadBuiltins(dir?: string): Promise<unknown>;

  /**
   * How much of the engine's tracking-tooltip offset to keep.
   *
   * The engine places the tip at `(x + 40, y - 2 * fontHeight)` from the
   * cursor. `1` keeps that, `0.5` (the default) halves it so the tip sits
   * tighter to the pointer, `0` puts it at the cursor. Values are clamped to
   * `0..1`.
   *
   * `trackingTipOffset()` reads it; `trackingTipOffset(n)` sets it and returns
   * the value actually stored. Takes effect on the next tip, with no reattach.
   *
   * This is the tooltip the control shows on its own, with no page code. It
   * is NOT `PeTooltip`, which is a separate opt-in module with its own
   * `PeTooltip.offset()`.
   *
   * Web only: on Win32 the tip is a real tooltip window positioned by the
   * shared engine code, so there is no matching desktop property.
   */
  static trackingTipOffset(scale?: number): number;
  static loadNotifyNames(url: string): Promise<unknown>;
  /** PEWN_ code -> name, for `onNotify` and for logging. */
  static notifyName(code: number): string;
  static notifyNames: Record<string, string> | undefined;
  /** Measured once from a real scrollbar in this browser. */
  static measureScrollbarThickness(): number;
  static defaultScrollArrowWidth(): number;
  /** Must be called before the first InitializeVars; the constructor does. */
  static setScrollArrowWidth(m: PeModule, n: number): void;

  // -- localization ---------------------------------------------------------
  // Declared 08/24/26. Every one of these shipped that morning and none was
  // declared, so check-control-types.mjs went from 9/0 to 8/1 the moment the
  // feature landed. A gate that is known-red trains people to skip it, and
  // this is a file customers read for intellisense.
  //
  /**
   * Override the culture for the whole page. Pass null to go back to
   * auto-detect. Returns what `culture()` now answers.
   */
  static setCulture(tag: string | null): string;
  /**
   * The culture in force: the override if set, else the browser's first
   * preference. Never throws -- an unparseable override falls back to 'en'.
   */
  static culture(): string;
  /** CLDR's actual marks for a tag. Works for ANY tag, not only the 20 we
   *  ship bundles for -- separators and string bundles are different
   *  questions. */
  static separatorsFor(tag?: string): PeSeparators;
  /** Push a culture's separators at one chart. The constructor calls this. */
  static applyCulture(m: PeModule, h: number, tag?: string | null): PeSeparators | null;
  /**
   * Bundle names to try, best first, ending in 'en'. Carries no list of the
   * shipped cultures on purpose -- it asks, and takes the first that answers.
   */
  static bundleCandidates(tag?: string): string[];
  /**
   * Where the string bundles are being fetched from. Resolved from this
   * script's own URL at load, so a page at any depth gets it right without
   * being told. An explicit `base` argument still wins.
   */
  static stringsBase(): string;
  /**
   * Install the engine's string table for a culture AND switch every dialog
   * on the page to match. ONE call on purpose: a German right-click menu over
   * an English dialog reads as half-finished, so there is no second entry
   * point to forget.
   *
   * Call it before constructing controls, like `loadBuiltins` -- the menu is
   * built in InitializeVars, so an existing chart keeps its old menu until it
   * renders again.
   */
  static loadStrings(m: PeModule, tag?: string | null, base?: string): Promise<PeStringsLoaded | null>;
  static loadStrings(tag: string | null, base?: string): Promise<PeStringsLoaded | null>;
  /** The bundle installed in the engine, or null for the built-in English. */
  static stringCulture(): string | null;
  /** The localizable dialogs actually present on this page. */
  static dialogs(): PeDialogRef[];
  /**
   * Point every dialog at one culture. Driven from `loadStrings`; a page
   * should not normally need this. Resolves to the number of dialogs told, or
   * 0 if the bundle could not be fetched -- in which case NOTHING switched.
   */
  static applyDialogCulture(c: string, base?: string): Promise<number>;
  /** Which bundle the dialogs are on. Should always equal stringCulture(). */
  static dialogCulture(): string | null;
}
