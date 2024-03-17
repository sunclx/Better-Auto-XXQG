/// <reference path="./autox/adbkit.d.ts" />
/// <reference path="./autox/auto.d.ts" />
/// <reference path="./autox/autojs.d.ts" />
/// <reference path="./project/global.d.ts" />
/// <reference path="./project/module.d.ts" />

declare function require<T = any>(name: string): T;

declare namespace JSX {
  interface IntrinsicElements {
    text: Partial<
      {
        [x: string]: any;
      }
    >;
    button: Partial<
      {
        id: string;
        /** 按钮文字 */
        text: string;
        [x: string]: any;
      }
    >;
    input: Partial<
      {
        [x: string]: any;
      }
    >;
    img: Partial<
      {
        [x: string]: any;
      }
    >;
    vertical: Partial<
      {
        [x: string]: any;
      }
    >;
    horizontal: Partial<
      {
        [x: string]: any;
      }
    >;

    linear: Partial<
      {
        [x: string]: any;
      }
    >;
    frame: Partial<
      {
        [x: string]: any;
      }
    >;
    relative: Partial<
      {
        [x: string]: any;
      }
    >;
    checkbox: Partial<
      {
        [x: string]: any;
      }
    >;
    radio: Partial<
      {
        [x: string]: any;
      }
    >;
    radiogroup: Partial<
      {
        [x: string]: any;
      }
    >;
    switch: Partial<
      {
        [x: string]: any;
      }
    >;
    progressbar: Partial<
      {
        [x: string]: any;
      }
    >;
    seekbar: Partial<
      {
        [x: string]: any;
      }
    >;
    spinner: Partial<
      {
        [x: string]: any;
      }
    >;
    timepicker: Partial<
      {
        [x: string]: any;
      }
    >;
    datepicker: Partial<
      {
        [x: string]: any;
      }
    >;
    fab: Partial<
      {
        [x: string]: any;
      }
    >;
    toolbar: Partial<
      {
        [x: string]: any;
      }
    >;
    card: Partial<
      {
        [x: string]: any;
      }
    >;
    drawer: Partial<
      {
        [x: string]: any;
      }
    >;
    list: Partial<
      {
        [x: string]: any;
      }
    >;
    tab: Partial<
      {
        [x: string]: any;
      }
    >;

    // any jsx
    [x: string]: any;
  }
}
declare let View: (props: any) => JSX.IntrinsicElements;
declare let TextView: (props: any) => JSX.IntrinsicElements;
declare let ScrollView: (props: any) => JSX.IntrinsicElements;
declare let TableLayout: (props: any) => JSX.IntrinsicElements;
declare let TableRow: (props: any) => JSX.IntrinsicElements;

declare let importClass: any;
declare let importPackage: any;
declare let Packages: any;

// declare let app: any;
declare let plugins: any;

declare let web: any;

declare let android: any;

// declare let log: any;

declare let java: any;

// declare let Date: any;

// declare let open: any;

// declare let rawInput: any;
// App
// declare let app: any;

// 设备 - Device
// declare let device: any;

// 全局变量与函数
// declare let sleep: any;
// declare let currentPackage: any;
// declare let currentActivity: any;
// declare let setClip: any;
// declare let getClip: any;
// declare let toast: any;
// declare let toastLog: any;
// declare let waitForActivity: any;
// declare let waitForPackage: any;
// declare let exit: any;
// declare let random: any;
declare let requiresApi: any;
declare let requiresAutojsVersion: any;
declare let runtime: any;
declare let context: any;
declare let activity: any;

// 基于控件的操作
// declare let auto: any;

// declare let click: any;
// declare let longClick: any;
// declare let scrollUp: any;
// declare let scrollDown: any;
// declare let setText: any;
// declare let input: any;

// declare let text: any;
// declare let textContains: any;
// declare let textStartsWith: any;
// declare let textEndsWith: any;
// declare let textMatches: any;

// declare let desc: any;
// declare let descContains: any;
// declare let descStartsWith: any;
// declare let descEndsWith: any;
// declare let descMatches: any;

// declare let id: any;
// declare let idContains: any;
// declare let idStartsWith: any;
// declare let idEndsWith: any;
// declare let idMatches: any;

// declare let className: any;
// declare let classNameContains: any;
// declare let classNameStartsWith: any;
// declare let classNameEndsWith: any;
// declare let classNameMatches: any;

// declare let packageName: any;
// declare let packageNameContains: any;
// declare let packageNameStartsWith: any;
// declare let packageNameEndsWith: any;
// declare let packageNameMatches: any;
// declare let bounds: any;
// declare let boundsInside: any;
// declare let boundsContains: any;

//基于坐标的操作
// declare let setScreenMetrics: any;
// declare let press: any;
// declare let swipe: any;
// declare let gesture: any;

declare class JavaAdapter {
  constructor(...p: any[]);
  tap: any;
  swipe: any;
  press: any;
  longPress: any;
  touchDown: any;
  touchMove: any;
  touchUp: any;
  [x: string]: any;
}

// declare let Tap: any;
// declare let Swipe: any;

// 按键模拟
// declare let back: any;
// declare let home: any;
// declare let powerDialog: any;
// declare let notifications: any;
// declare let quickSettings: any;
// declare let recents: any;
// declare let splitScreen: any;
declare let takeScreenshot: any;
declare let lockScreen: any;
declare let dismissNotificationShade: any;
declare let keyCodeHeadsetHook: any;
declare let accessibilityShortcut: any;
declare let accessibilityButtonChooser: any;
declare let accessibilityButton: any;
declare let accessibilityAllApps: any;
// declare let Home: any;
// declare let Back: any;
// declare let Power: any;
// declare let Menu: any;
// declare let VolumeUp: any;
// declare let VolumeDown: any;
// declare let Camera: any;
// declare let Up: any;
// declare let Down: any;
// declare let Left: any;
// declare let Right: any;
// declare let OK: any;
// declare let Text: any;
// declare let KeyCode: any;

// 文件系统 Files
// declare let files: any;

// HTTP

// declare let http: any;

// webSocket

declare class OkHttpClient {
  constructor(...p: any[]);
  static Builder: any;
  [x: string]: any;
}
// declare class Request {
//   constructor(...p) {}
//   static Builder;
//   [x: string]: any;
// }

declare class WebSocketListener {
  constructor(...p: any[]);
  [x: string]: any;
}

// 本地存储 Storages
// declare let storages: any;
// declare let Storage: any;

// 控制台 Console
// declare namespace console {
//   function hide(): void;
// }
// declare let print: any;

// 定时器 Timers
// declare let setInterval: any;
// declare let setTimeout: any;
declare let setImmediate: any;
// declare let clearInterval: any;
// declare let clearTimeout: any;
declare let clearImmediate: any;

// 多线程 Threads
// declare let threads: any;
declare let Thread: any;
// declare let sync: any;
// declare let events: any;

// 对话框 Dialogs
// declare let dialogs: any;
declare function alert(title: string, message: string): void;

// 悬浮窗 Floaty
// declare let floaty: any;

// 脚本引擎 Engines
// declare let engines: any;

// 画布 Canvas
declare let canvas: any;

declare class Paint {
  constructor(...p: any[]);
  [x: string]: any;
}

// 模块 Modules (使用 rollup + babel + es module)

// OCR 文字识别
// declare let paddle: any;
// declare let gmlkit: any;

declare class TessBaseAPI {
  constructor(...p: any[]);
  [x: string]: any;
}
declare let com: any;
declare let requestScreenCapture: any;
declare let captureScreen: any;

// 图片与颜色 Images
// declare let colors: any;
// declare let images: any;

// 事件与监听 Events
// declare let events: any;

declare let emitter: any;

// Base64
declare let $base64: any;

// 消息处理(加密,摘要) Crypto
declare class $crypto {
  constructor(...p: any[]);
  static Key: any;
  static encrypt: any;
  static decrypt: any;
  static generateKeyPair: any;
  static digest: any;

  [x: string]: any;
}

// 压缩与解压 Zip

declare let zips: any;

// 多媒体 Media

// declare let media: any;

// 传感器 Sensors
// declare let sensors: any;

// 协程 (TODO)

// WebView 与 HTML (TODO)

//执行命令 Shell
declare let shell: any;
declare class Shell {
  constructor(...p: any[]);
  [x: string]: any;
}

// 调用 Java

declare class StringBuilder {
  constructor(...p: any[]);
  [x: string]: any;
}

// declare class JavaAdapter {
//   constructor(...p) {}
//   [x: string]: any;
// }

// axios (TODO)

// npm模块 (TODO)
