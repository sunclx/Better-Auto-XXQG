interface View {
  w: number | string;
  h: number | string;
  id: string;
  gravity:
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "center"
    | "center_vertical"
    | "center_horizontal"
    | string;
  layout_gravity:
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "center"
    | "center_vertical"
    | "center_horizontal"
    | string;
  margin: number | string;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  padding: number | string;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  bg: any;
  alpha: number;
  foreground: any;
  minHeight: number;
  minWidth: number;
  visbility: string;
  rotation: number;
  transformPivotX: number;
  transformPivotY: number;
  style: any;
  on(event: string, callback: (...args: any[]) => any): void;
  setText(text: string): void;
  attr(key: string, value: string): void;
}

interface UI {
  layout(xml: any): void;
  inflate(xml: any, parent?: View): View;
  findView(id: string): View;
  finish(): void;
  setContentView(view: View): void;
  run(callback: (...args: any[]) => any): void;
  post(callback: (...args: any[]) => any, delay?: number): void;
  statusBarColor(color: string): void;
  showPopupMenu(view: View, menu: any): void;
  [id: string]: View | any;
}

declare const ui: UI;

// type View = any;
//chenlixin
// declare let ui: {
//   /** 界面 */
//   layout: (jsx: any) => void;
//   /** 在 ui 线程上执行代码 */
//   run: (fn: () => void) => void;
//   [x: string]: any;
// };

interface UILike {
  toString(): string;
}

// declare namespace ui {
//   function layout(xml: UILike | any): void;
//   function inflate(xml: UILike | any, parent?: View): void;
//   function findView(id: string): View;
//   function finish();
//   function setContentView(view: View);
//   function run(callback);
//   function post(callback, delay?: number): void;
//   function statusBarColor(color);
//   function showPopupMenu(view, menu);
// }
