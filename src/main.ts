console.clear(); // 清除控制台信息
http.__okhttp__.setTimeout(10000); // 设置http请求的超时时间为10秒

let GLOBAL_CONFIG = storages.create("GLOBAL_CONFIG"); // 创建或获取全局配置存储
let UI: string = GLOBAL_CONFIG.get("UI"); // 从全局配置中获取UI脚本
// let main: string = DB.get("main"); // 从数据库中获取main脚本，当前行已注释
let username = "sunclx"; // GitHub用户名
let repo = "XXQG"; // GitHub仓库名
let branch = "main"; // GitHub仓库分支
// 定义多个URL前缀，用于尝试不同的代理或直连获取脚本
let url_prefix = [
  `https://mirror.ghproxy.com/https://raw.githubusercontent.com/${username}/${repo}/${branch}/`,
  `https://raw.kkgithub.com/${username}/${repo}/${branch}/`,
  `https://ghproxy.net/https://raw.githubusercontent.com/${username}/${repo}/${branch}/`,
  `https://fastly.jsdelivr.net/gh/${username}/${repo}@${branch}/`,
  `https://fastraw.ixnic.net/${username}/${repo}/${branch}/`,
  `https://cdn.jsdelivr.us/gh/${username}/${repo}@${branch}/`,
  `https://jsdelivr.b-cdn.net/gh/${username}/${repo}@${branch}/`,
  `https://github.moeyy.xyz/https://raw.githubusercontent.com/${username}/${repo}/${branch}/`,
  `https://raw.cachefly.998111.xyz/${username}/${repo}/${branch}/`,
  `https://raw.githubusercontent.com/${username}/${repo}/${branch}/`,
];

start(); // 启动脚本

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

/**
 * 获取指定文件名的脚本内容。
 * @param {string} filename - 需要获取的文件名。
 * @returns {string} 返回获取到的脚本内容。
 * @throws {Error} 如果文件下载失败，抛出错误。
 */
function getScriptA(filename: string): string {
  let url;
  // 遍历URL前缀，尝试下载脚本
  url_prefix.find((prefix) => {
    const script = getScript(prefix + filename);
    if (script) {
      url = script;
      return true;
    }
    return false;
  });

  if (!url) {
    throw new Error(`getScriptA: 文件下载失败,script为空,filename:${filename}`);
  }

  return url;
}

/**
 * 通过遍历预定义的URL前缀尝试下载脚本。
 * 如果找到有效的脚本，则返回脚本内容。
 * 如果所有尝试都失败，则抛出错误。
 * @param {string} url - 需要下载的脚本文件名。
 * @returns {string|null} 返回下载到的脚本内容。
 * @throws {Error} 如果所有预定义的URL前缀都无法下载到脚本，则抛出错误。
 */
function getScript(url: string): string | null {
  try {
    console.log(`getScript: url: ${url}`);
    const res = http.get(url);
    console.log(`getScript: statusCode: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log(`getScript: 学习脚本 ${url} 下载成功`);
      return res.body.string();
    } else {
      console.log(`getScript: 学习脚本 ${url} 下载失败`);
    }
  } catch (error) {
    console.error(`getScript: `, error);
  }
  return null;
}
