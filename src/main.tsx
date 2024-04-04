"ui";
import { getScript, getScriptA, url_prefix } from "./utils.ts";

console.clear(); // 清除控制台信息
// 以下为旧版本代码
http.__okhttp__.setTimeout(10000); // 设置http请求的超时时间为10秒

let GLOBAL_CONFIG = storages.create("GLOBAL_CONFIG"); // 创建或获取全局配置存储
let UI: string = GLOBAL_CONFIG.get("UI"); // 从全局配置中获取UI脚本
// let main: string = DB.get("main"); // 从数据库中获取main脚本，当前行已注释
let isNewVersion = true; // 是否为新版本

function start(): void {
  // runMain(); // 运行主脚本，当前行已注释
  runUI(); // 运行UI脚本
}

/**
 * 运行UI脚本的函数。
 * 如果UI脚本已存在，则直接执行。
 * 否则，尝试获取UI脚本并执行。
 */
function runUI(): void {
  try {
    // 如果UI脚本已存在，则直接执行
    if (UI) {
      engines.execScript("UI", UI);
    } else {
      // 否则，尝试获取UI脚本并执行
      UI = getScriptA("dist/UI.js");
      GLOBAL_CONFIG.put("UI", UI);
      runUI();
    }
  } catch (error) {
    console.error("runUI: ", error);
    // 如果运行失败，询问用户是否更新脚本
    let update = confirm("UI脚本运行失败，是否更新脚本？");
    if (update) {
      // 用户选择是否通过下载代理获取脚本
      let select = confirm("是否选择下载代理");
      if (select) {
        // 用户选择下载代理后，选择具体的代理服务器
        let url_index = dialogs.singleChoice("请选择下载代理", url_prefix, 0);
        let url = url_prefix[url_index] + "dist/UI.js";
        let script = getScript(url);
        if (script) {
          // 成功获取脚本后，保存并重新尝试运行
          UI = script;
          GLOBAL_CONFIG.put("UI", UI);
          runUI();
        } else {
          // 获取脚本失败，重新尝试运行
          console.log("重新运行UI脚本");
          runUI();
        }
      } else {
        // 用户选择不通过代理下载，直接尝试获取脚本
        let script = getScriptA("dist/UI.js");
        if (script) {
          // 成功获取脚本后，保存并重新尝试运行
          UI = script;
          GLOBAL_CONFIG.put("UI", UI);
          runUI();
        } else {
          // 获取脚本失败，重新尝试运行
          console.log("重新运行UI脚本");
          runUI();
        }
      }
    } else {
      // 用户选择不更新脚本，退出程序
      exit();
    }
  }
}

// 检查是否为新版本
if (isNewVersion) {
  console.log("This is a new version!");
  import("./UI.tsx");
} else {
  console.log("This is a old version!");
  start(); // 启动旧版本脚本
}
