// ProEssentialsJS -- Copyright 1994-2026 Gigasoft, Inc. All rights reserved.
// Commercial product, free for commercial use under USD 250,000 annual
// revenue. See PEJS-LICENSE.md -- https://www.gigasoft.com
//
// The hover tooltip. `PeTooltip` arrives with the runtime -- pe-tooltip.js is
// inside proessentials.iife.js, so a page that loads the one script tag already
// has it and there is nothing extra to include.
//
// Hand-authored, like pe-control.d.ts. Every member below is read out of
// pe-tooltip.js rather than inferred: the runtime object is exactly
// `{ attach, PEHS, NAME }`, and attach returns `{ enable, disable, destroy }`.

/** What the pointer is over. Passed to `opts.text` so a page can format its
 *  own tip; `subset` and `point` are zero-based. */
interface PeTooltipHit {
  /** One of `PeTooltip.PEHS`. */
  type: number;
  /** The name of `type`, e.g. `'DATAPOINT'`. */
  typeName: string;
  point: number;
  subset: number;
  x: number;
  y: number;
}

interface PeTooltipOptions {
  /** Return the text to show, or `null` / `''` to show nothing. Omit it and
   *  the tip reports the row and column, or the hot-spot name. */
  text?: (hit: PeTooltipHit) => string | null;
  /** The CSS cursor over a hot spot, default `'pointer'`. `false` leaves the
   *  cursor alone. */
  cursor?: string | false;
}

/** What `PeTooltip.attach` hands back. Keep it if the chart outlives the page
 *  region -- `destroy()` removes the listeners and the tip element. */
interface PeTooltipHandle {
  enable(): void;
  disable(): void;
  destroy(): void;
}

declare const PeTooltip: {
  /** Attach hover tooltips to a control. The control supplies its own canvas
   *  and module, so this is the whole of the setup. */
  attach(control: PeControl, opts?: PeTooltipOptions): PeTooltipHandle;

  /** Hot-spot kinds, matching the engine's PEHS_* values. */
  readonly PEHS: {
    readonly NONE: 0;
    readonly SUBSET: 1;
    readonly POINT: 2;
    readonly GRAPH: 3;
    readonly TABLE: 4;
    readonly DATAPOINT: 5;
    readonly ANNOTATION: 6;
    readonly XAXISANNOTATION: 7;
    readonly YAXISANNOTATION: 8;
    readonly HORZLINEANNOTATION: 9;
    readonly VERTLINEANNOTATION: 10;
    readonly MAINTITLE: 11;
    readonly SUBTITLE: 12;
    readonly MULTISUBTITLE: 13;
    readonly MULTIBOTTOMTITLE: 14;
    readonly YAXISLABEL: 15;
    readonly XAXISLABEL: 16;
    readonly YAXIS: 17;
    readonly XAXIS: 18;
    readonly YAXISGRIDNUMBER: 19;
    readonly RYAXISGRIDNUMBER: 20;
    readonly XAXISGRIDNUMBER: 21;
  };

  /** The reverse of `PEHS`: a value gives its name. */
  readonly NAME: { readonly [value: number]: string };

  /**
   * How far the tip sits from the cursor, in CSS pixels. Applies on both
   * axes, and on the flipped side when the tip would leave the chart.
   *
   * `offset()` reads it; `offset(px)` sets it and returns the value actually
   * stored, so a rejected value is visible rather than assumed. Default 7.
   *
   * Web only. On Win32 this gap comes from the OS tooltip, which
   * ProEssentials does not set, so there is no matching desktop property.
   *
   * Read when a tip is positioned, not when it is attached, so changing it
   * moves tips on controls that are already attached.
   */
  offset(px?: number): number;
};
