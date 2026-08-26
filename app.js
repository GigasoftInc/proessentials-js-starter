// ProEssentialsJS -- Copyright 1994-2026 Gigasoft, Inc. All rights reserved.
// Commercial product, free for commercial use under USD 250,000 annual
// revenue. See PEJS-LICENSE.md -- https://www.gigasoft.com
//
// app.js -- the ProEssentialsJS walkthrough, line for line against the C#
// WinForms walkthrough in the help
// (Chapter2_C_NET_EXE_Walkthrough2022_Nuget.htm).
//
// Every property below is the same name a WinForms customer already types. All
// 27 of them were checked against the shipped .d.ts before this file was
// written; none is invented.

import { attachApi, Enums as E } from './pe-api-graph.js';

const status = document.getElementById('status');
const host = document.getElementById('chart');

// COLOURS: PERGB, never a hand-packed hex literal.
//
// *** THE ENGINE WANTS COLORREF, WHICH IS 0xAABBGGRR -- RED IN THE LOW BYTE. ***
// A colour copied shift-for-shift from a C# ARGB literal arrives with red and
// blue SWAPPED, and it does so silently: greys and any colour where r == b look
// perfectly correct, so a palette can read two-thirds right while being wrong.
//
// The package does not ship this helper yet, so define it once per project and
// never pack a colour by hand. Arguments are in C#'s order, so
// Color.FromArgb(60, 0, 180, 0) transliterates to PERGB(60, 0, 180, 0).
const PERGB = (a, r, g, b) => ((r | (g << 8) | (b << 16) | (a << 24)) >>> 0);

try {
  // 1. THE ENGINE. WebAssembly, so it loads once, asynchronously.
  const m = await ProEssentials();

  // 2. THE CONTROL. This is the WinForms designer step: dropping a Pego on the
  //    form. `autoResize` is the web's Dock = Fill -- the control watches its
  //    host element and re-fits when the browser window changes. Width and
  //    height are only the first size; the CSS grid decides from then on.
  const ctl = new PeControl(host, {
    module: m,
    kind: 'graph',
    width: host.clientWidth || 800,
    height: host.clientHeight || 520,
    autoResize: true,
  });

  // 3. THE PROPERTY TREE. `Pego1` is what every ProEssentials example calls it,
  //    on every platform, so sample code pastes straight in.
  const Pego1 = ctl.attach(attachApi);

  Pego1.PeString.MainTitle = 'Hello World';
  Pego1.PeString.SubTitle = '';

  // *** ORDER MATTERS: Subsets and Points BEFORE the data. ***
  // Every data write is bounds checked against Subsets x Points. Write the data
  // first and the writes are rejected, the chart still draws using its default
  // data, and nothing reports an error. It is the most common mistake on every
  // platform, and it looks like a data bug rather than an ordering one.
  Pego1.PeData.Subsets = 2;   // Subsets = Rows
  Pego1.PeData.Points = 6;    // Points  = Columns

  Pego1.PeData.Y[0][0] = 10; Pego1.PeData.Y[0][1] = 30;
  Pego1.PeData.Y[0][2] = 20; Pego1.PeData.Y[0][3] = 40;
  Pego1.PeData.Y[0][4] = 30; Pego1.PeData.Y[0][5] = 50;
  Pego1.PeData.Y[1][0] = 15; Pego1.PeData.Y[1][1] = 63;
  Pego1.PeData.Y[1][2] = 74; Pego1.PeData.Y[1][3] = 54;
  Pego1.PeData.Y[1][4] = 25; Pego1.PeData.Y[1][5] = 34;

  Pego1.PeString.PointLabels[0] = 'Jan';
  Pego1.PeString.PointLabels[1] = 'Feb';
  Pego1.PeString.PointLabels[2] = 'Mar';
  Pego1.PeString.PointLabels[3] = 'Apr';
  Pego1.PeString.PointLabels[4] = 'May';
  Pego1.PeString.PointLabels[5] = 'June';

  Pego1.PeString.SubsetLabels[0] = 'Product line A';
  Pego1.PeString.SubsetLabels[1] = 'Product line B';
  Pego1.PeString.YAxisLabel = 'Units shipped';

  // C#: Color.FromArgb(60, 0, 180, 0) and Color.FromArgb(180, 0, 0, 130).
  Pego1.PeColor.SubsetColors[0] = PERGB(60, 0, 180, 0);
  Pego1.PeColor.SubsetColors[1] = PERGB(180, 0, 0, 130);
  Pego1.PeColor.BitmapGradientMode = false;
  Pego1.PeColor.QuickStyle = E.QuickStyle.LightShadow;

  // EXPERIMENT: a transparent desk, so the page shows through behind the
  // titles and labels instead of the default grey.
  //
  // 1 is a sentinel meaning "empty", not a colour. It has to come AFTER the
  // other colour settings -- QuickStyle writes a palette, so setting the desk
  // first would simply be overwritten.
  //
  // *** IT IS `PeColor.Desk`, NOT `PeColor.DeskColor`. *** The flat .NET name
  // is DeskColor; the grouped tree drops the prefix because the group is
  // already PeColor. Writing `PeColor.DeskColor = 1` does NOT fail -- it
  // creates an ordinary JavaScript property on the facade object, changes
  // nothing, and reports no error. An existing test page lost time to exactly
  // that. If a colour will not take, check the name against the tree first.
  const TRANSPARENT = 1;
  Pego1.PeColor.Desk = TRANSPARENT;

  Pego1.PeTable.Show = E.GraphPlusTable.Both;
  Pego1.PeData.Precision = E.DataPrecision.NoDecimals;
  Pego1.PeFont.Label.Bold = true;
  Pego1.PeFont.FontSize = E.FontSize.Large;

  // The bar chart itself.
  Pego1.PePlot.Method = E.GraphPlottingMethod.Bar;
  Pego1.PePlot.Option.GradientBars = 8;
  Pego1.PePlot.Option.BarGlassEffect = true;
  Pego1.PePlot.DataShadows = E.DataShadows.ThreeDimensional;
  Pego1.PePlot.SubsetLineTypes[0] = E.LineType.MediumSolid;
  Pego1.PePlot.SubsetLineTypes[1] = E.LineType.MediumDash;

  Pego1.PeLegend.Location = E.LegendLocation.Left;

  // 4. HOT SPOTS. This makes the bars clickable. On its own it does
  //    nothing visible: an event handler is what reads the click, and
  //    that is the next lesson rather than this one.
  Pego1.PeUserInterface.HotSpot.Data = true;

  // *** THE FOCUS RECTANGLE TAKES TWO FIXES. THIS IS HALF OF IT. ***
  //
  //     There are two rectangles from two different layers, and removing one
  //     leaves the other:
  //
  //       1. this line -- the FOCAL RECT, which the ENGINE paints into the
  //          chart exactly as the WinForms control does. No stylesheet can
  //          reach it.
  //       2. a CSS rule in index.html -- the outline the package puts on the
  //          canvas via pe-control.js. No chart property can reach that one.
  //
  //     `pegigaprime3dwasm` does both: `Allow.FocalRect = false` four times in
  //     app\main.js, one per chart, plus `canvas:focus { outline: none }` at
  //     index.html:80. `pegigaprime2dwasm` does the same at app.js:235.
  //
  //     Note the spelling. It is Foc-AL-Rect, not FocusRect -- searching a
  //     codebase for "focus" will not find it.
  Pego1.PeUserInterface.Allow.FocalRect = false;

  // Hide the Quick Style menu entry.
  //
  // *** MEASURED 2026-08-24: THIS HAS NO VISIBLE EFFECT ON THE WEB BUILD. ***
  // The property is real, it sets, and it reads back 0 -- but the web context
  // menu has no Quick Style item to hide. `pe-menu.js` contains zero references
  // to it, and the only QuickStyle strings that ship are `IDC_QUICKSTYLESTATIC`
  // and `IDS_QUICKSTYLE_*`, which are CUSTOMIZATION DIALOG resources, not menu
  // labels. On the web the Quick Style UI lives in that dialog.
  //
  // Kept because it is correct, harmless, and does the right thing on the
  // desktop. **If the intent is to stop an end user restyling the chart, the
  // line that actually does it here is:**
  //
  //     Pego1.PeUserInterface.Menu.CustomizeDialog = E.MenuControl.Hide;
  //
  // which was verified to remove "Customization Dialog..." from the menu.
  //
  // *** AND EVERY Menu.* FLAG NEEDS ReinitializeResetImage() TO TAKE EFFECT. ***
  // Setting one and re-opening the menu changes nothing; the repaint is what
  // applies it, exactly like every other property on this page.
  //
  // *** TWO DIFFERENT PROPERTIES ARE CALLED QuickStyle AND THEY TAKE DIFFERENT
  //     ENUMS. *** `PeColor.QuickStyle` is a `QuickStyle` (NoStyle, LightInset,
  //     LightShadow ...) and picks the palette -- it is set further up this
  //     file. This one is a `MenuControl` (Hide, Show, Grayed) and only decides
  //     whether the menu entry appears. `E.QuickStyle.Hide` does not exist and
  //     would be undefined; the enum you want here is `E.MenuControl`.
  //
  //     `Grayed` is the third option if you would rather show the item disabled
  //     than remove it.
  Pego1.PeUserInterface.Menu.QuickStyle = E.MenuControl.Hide;

  // 4b. CURSOR PROMPT TRACKING. Hover a bar and the chart reports the point
  //     under the mouse in a tooltip. No event and no code -- the engine draws
  //     it. This is the hover half of the interaction; the hot spot above is
  //     the click half.
  //
  //     *** THE GROUPED NAMES ARE NOT THE FLAT .NET ONES. ***
  //     The desktop documentation calls these `CursorPromptTracking` and
  //     `CursorPromptLocation`. In the grouped property tree -- which is what
  //     both .NET and the web actually expose -- the group name is already
  //     `Cursor`, so the members drop the prefix:
  //
  //         CursorPromptTracking  ->  PeUserInterface.Cursor.PromptTracking
  //         CursorPromptLocation  ->  PeUserInterface.Cursor.PromptLocation
  //
  //     Worth knowing generally: a name from the older flat API often loses a
  //     prefix in the grouped one. `python Ai-Data\pe_query.py search "<name>"`
  //     finds the real path rather than guessing at it.
  Pego1.PeUserInterface.Cursor.PromptTracking = true;
  Pego1.PeUserInterface.Cursor.PromptLocation = E.CursorPromptLocation.ToolTip;

  // 6. DRAW. Nothing repaints until this is called. Set every property, then
  //    call it once. The WinForms walkthrough follows it with pego1.Refresh();
  //    the web control paints itself, so there is no second call.
  Pego1.PeFunction.ReinitializeResetImage();

  status.textContent = 'ready';

  // Handy while learning: type `Pego1` in the browser console and explore the
  // whole property tree. The cast keeps the editor quiet -- `window` has no
  // declared `Pego1`, and adding one would mean another .d.ts for two lines.
  /** @type {any} */ (window).Pego1 = Pego1;
  /** @type {any} */ (window).peControl = ctl;
} catch (e) {
  status.className = 'bad';
  status.textContent = 'FAILED: ' + (e && e.message ? e.message : e);
  throw e;
}
