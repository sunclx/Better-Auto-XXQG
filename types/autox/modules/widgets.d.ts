declare function auto(mode?: "fast" | "normal"): void;
declare namespace auto {
  function waitFor(): void;
  function setMode(mode: "fast" | "normal"): void;
  interface Service {
    disableSelf(): void;
  }
  let service: Service;
}
declare function selector(): UiSelector;
declare function click(text: string, index?: number): boolean;
declare function click(
  left: number,
  top: number,
  bottom: number,
  right: number,
): boolean;
declare function longClick(text: string, index?: number): boolean;
declare function scrollUp(index?: number): boolean;
declare function scrollDown(index?: number): boolean;
declare function setText(text: string): boolean;
declare function setText(index: number, text: string): boolean;
declare function input(text: string): boolean;
declare function input(index: number, text: string): boolean;

declare function text(str: string): UiSelector;
declare function textContains(str: string): UiSelector;
declare function textStartsWith(prefix: string): UiSelector;
declare function textEndsWith(suffix: string): UiSelector;
declare function textMatches(reg: string | RegExp): UiSelector;
declare function desc(str: string): UiSelector;
declare function descContains(str: string): UiSelector;
declare function descStartsWith(prefix: string): UiSelector;
declare function descEndsWith(suffix: string): UiSelector;
declare function descMatches(reg: string | RegExp): UiSelector;
declare function id(resId: string): UiSelector;
declare function idContains(str: string): UiSelector;
declare function idStartsWith(prefix: string): UiSelector;
declare function idEndsWith(suffix: string): UiSelector;
declare function idMatches(reg: string | RegExp): UiSelector;
declare function className(str: string): UiSelector;
declare function classNameContains(str: string): UiSelector;
declare function classNameStartsWith(prefix: string): UiSelector;
declare function classNameEndsWith(suffix: string): UiSelector;
declare function classNameMatches(reg: string | RegExp): UiSelector;
declare function packageName(str: string): UiSelector;
declare function packageNameContains(str: string): UiSelector;
declare function packageNameStartsWith(prefix: string): UiSelector;
declare function packageNameEndsWith(suffix: string): UiSelector;
declare function packageNameMatches(reg: string | RegExp): UiSelector;
declare function bounds(
  left: number,
  top: number,
  right: number,
  buttom: number,
): UiSelector;
declare function boundsInside(
  left: number,
  top: number,
  right: number,
  buttom: number,
): UiSelector;
declare function boundsContains(
  left: number,
  top: number,
  right: number,
  buttom: number,
): UiSelector;
declare function drawingOrder(order: number): UiSelector;
declare function clickable(b: boolean): UiSelector;
declare function longClickable(b: boolean): UiSelector;
declare function checkable(b: boolean): UiSelector;
declare function selected(b: boolean): UiSelector;
declare function enabled(b: boolean): UiSelector;
declare function scrollable(b: boolean): UiSelector;
declare function editable(b: boolean): UiSelector;
declare function multiLine(b: boolean): UiSelector;
declare function depth(n: number): UiSelector;

declare interface UiSelector {
  text(str: string): UiSelector;
  textContains(str: string): UiSelector;
  textStartsWith(prefix: string): UiSelector;
  textEndsWith(suffix: string): UiSelector;
  textMatches(reg: string | RegExp): UiSelector;
  desc(str: string): UiSelector;
  descContains(str: string): UiSelector;
  descStartsWith(prefix: string): UiSelector;
  descEndsWith(suffix: string): UiSelector;
  descMatches(reg: string | RegExp): UiSelector;
  id(resId: string): UiSelector;
  idContains(str: string): UiSelector;
  idStartsWith(prefix: string): UiSelector;
  idEndsWith(suffix: string): UiSelector;
  idMatches(reg: string | RegExp): UiSelector;
  className(str: string): UiSelector;
  classNameContains(str: string): UiSelector;
  classNameStartsWith(prefix: string): UiSelector;
  classNameEndsWith(suffix: string): UiSelector;
  classNameMatches(reg: string | RegExp): UiSelector;
  packageName(str: string): UiSelector;
  packageNameContains(str: string): UiSelector;
  packageNameStartsWith(prefix: string): UiSelector;
  packageNameEndsWith(suffix: string): UiSelector;
  packageNameMatches(reg: string | RegExp): UiSelector;
  bounds(left: number, top: number, right: number, buttom: number): UiSelector;
  boundsInside(
    left: number,
    top: number,
    right: number,
    buttom: number,
  ): UiSelector;
  boundsContains(
    left: number,
    top: number,
    right: number,
    buttom: number,
  ): UiSelector;
  drawingOrder(order: number): UiSelector;
  clickable(b?: boolean): UiSelector;
  longClickable(b: boolean): UiSelector;
  checkable(b: boolean): UiSelector;
  selected(b: boolean): UiSelector;
  enabled(b: boolean): UiSelector;
  scrollable(b?: boolean): UiSelector;
  editable(b: boolean): UiSelector;
  multiLine(b: boolean): UiSelector;

  depth(n: number): UiSelector;
  indexInParent(n: number): UiSelector;

  findOne(): UiObject;
  findOne(timeout: number): UiObject;
  findOnce(): UiObject;
  findOnce(i: number): UiObject;
  find(): UiCollection;
  untilFind(): UiCollection;
  exists(): boolean;
  waitFor(): void;
  filter(filter: (obj: UiObject) => boolean): UiSelector;
}

declare interface UiObject {
  click(): boolean;
  longClick(): boolean;
  setText(text: string): boolean;
  copy(): boolean;
  cut(): boolean;
  paste(): boolean;
  setSelection(start: number, end: number): boolean;
  scrollForward(): boolean;
  scrollBackward(): boolean;
  select(): boolean;
  collapse(): boolean;
  expand(): boolean;
  show(): boolean;
  scrollUp(): boolean;
  scrollDown(): boolean;
  scrollLeft(): boolean;
  scrollRight(): boolean;
  children(): UiCollection;
  childCount(): number;
  child(i: number): UiObject;
  parent(): UiObject;
  bounds(): Rect;
  boundsInParent(): Rect;
  drawingOrder(): number;
  id(): string;
  text(): string;

  indexInParent(): number;
  desc(): string;
  enabled(): boolean;
  rowCount(): number;
  depth(): number;

  findByText(str: string): UiCollection;
  findOne(selector: UiSelector): UiObject;
  find(selector: UiSelector): UiCollection;
}

declare interface UiCollection extends Array<UiObject> {
  size(): number;
  get(i: number): UiObject;
  each(func: (obj: UiObject) => void): void;
  empty(): boolean;
  // exists(): boolean;
  nonEmpty(): boolean;
  find(selector: UiSelector): UiCollection;
  find(callbackFn: (element: any, index: number, array: any[]) => boolean): any;
  find(
    callbackFn: (element: any, index: number, array: any[]) => boolean,
    thisArg: any,
  ): any;
  findOne(): UiObject;
  findOne(selector: UiSelector): UiObject;
  findOne(timeout: number): UiObject;
}

declare interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX(): number;
  centerY(): number;
  width(): number;
  height(): number;
  contains(r: Rect): Rect;
  intersect(r: Rect): Rect;
}
