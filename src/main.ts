console.clear();
http.__okhttp__.setTimeout(10000);

let GLOBAL_CONFIG = storages.create("GLOBAL_CONFIG");
let UI: string = GLOBAL_CONFIG.get("UI");
// let main: string = DB.get("main");
let username = "sunclx";
let repo = "XXQG";
let branch = "main";
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

start();

function start(): void {
  // runMain();
  runUI();
}

// function runMain(): void {
//   try {
//     if (main) {
//       engines.execScript("main", main);
//     } else {
//       main = getScriptA("dist/main.js");
//       DB.put("main", main);
//       runMain();
//     }
//   } catch (error) {
//     console.error("runmain: ", error);
//     let update = confirm("main脚本运行失败，是否更新脚本？");
//     if (update) {
//       let select = confirm("是否选择下载代理");
//       if (select) {
//         let url_index = dialogs.singleChoice("请选择下载代理", url_prefix, 0);
//         let url = url_prefix[url_index] + "dist/main.js";
//         let script = getScript(url);
//         if (script) {
//           main = script;
//           DB.put("main", main);
//           runMain();
//         } else {
//           console.log("重新运行main脚本");
//           runMain();
//         }
//       } else {
//         let script = getScriptA("dist/main.js");
//         if (script) {
//           main = script;
//           DB.put("main", main);
//           runMain();
//         } else {
//           console.log("重新运行main脚本");
//           runMain();
//         }
//       }
//     } else {
//       exit();
//     }
//   }
// }

function runUI(): void {
  try {
    if (UI) {
      engines.execScript("UI", UI);
    } else {
      UI = getScriptA("dist/UI.js");
      GLOBAL_CONFIG.put("UI", UI);
      runUI();
    }
  } catch (error) {
    console.error("runUI: ", error);
    let update = confirm("UI脚本运行失败，是否更新脚本？");
    if (update) {
      let select = confirm("是否选择下载代理");
      if (select) {
        let url_index = dialogs.singleChoice("请选择下载代理", url_prefix, 0);
        let url = url_prefix[url_index] + "dist/UI.js";
        let script = getScript(url);
        if (script) {
          UI = script;
          GLOBAL_CONFIG.put("UI", UI);
          runUI();
        } else {
          console.log("重新运行UI脚本");
          runUI();
        }
      } else {
        let script = getScriptA("dist/UI.js");
        if (script) {
          UI = script;
          GLOBAL_CONFIG.put("UI", UI);
          runUI();
        } else {
          console.log("重新运行UI脚本");
          runUI();
        }
      }
    } else {
      exit();
    }
  }
}

function getScriptA(filename: string): string {
  let script;
  for (let i = 0; i < url_prefix.length; i++) {
    let url = url_prefix[i] + filename;
    script = getScript(url);
    if (script) {
      return script;
    }
  }
  // console.log("getScriptA: 文件下载失败,script为空", `filename:${filename}`);
  throw new Error(`getScriptA: 文件下载失败,script为空,filename:${filename}`);
}

function getScript(url: string): string {
  try {
    console.log("getScript: url:" + url);
    let res = http.get(url);
    console.log("getScript: statusCode:" + res.statusCode);
    if (res.statusCode == 200) {
      console.log("getScript:学习脚本" + url + "下载成功");
      return res.body.string();
    } else {
      console.log("getScript:学习脚本" + url + "下载失败");
    }
  } catch (error) {
    console.error("getScript: ", error);
  }
  return "";
}
