console.clear();
http.__okhttp__.setTimeout(10000);

let DB = storages.create("MAIN");
let UI: string = DB.get("UI");
// let main = DB.get("main");
let url_prefix = [
  "https://mirror.ghproxy.com/https://raw.githubusercontent.com/sunclx/XXQG/main/",
  "https://raw.kkgithub.com/sunclx/XXQG/main/",
  "https://ghproxy.net/https://raw.githubusercontent.com/sunclx/XXQG/main/",
  "https://fastly.jsdelivr.net/gh/sunclx/XXQG@main/",
  "https://fastraw.ixnic.net/sunclx/XXQG/main/",
  "https://cdn.jsdelivr.us/gh/sunclx/XXQG@main/",
  "https://jsdelivr.b-cdn.net/gh/sunclx/XXQG@main/",
  "https://github.moeyy.xyz/https://raw.githubusercontent.com/sunclx/XXQG/main/",
  "https://raw.cachefly.998111.xyz/sunclx/XXQG/main/",
  "https://raw.githubusercontent.com/sunclx/XXQG/main/",
];

start();

function start(): void {
  // runMain();
  runUI();
}

// function runMain() {
//   try {
//     if (main) {
//       engines.execScript("main", main);
//     }
//   } catch (error) {
//     console.error(error);
//     let update = confirm("main脚本运行失败，是否更新脚本？");
//     if (update) {
//       main = getScript("main");
//       DB.put("main", main);
//       runMain();
//     } else {
//       exit();
//     }
//   }
// }

function runUI(): void {
  try {
    if (UI) {
      engines.execScript("UI", UI);
    }
  } catch (error) {
    console.error(error);
    let update = confirm("UI脚本运行失败，是否更新脚本？");
    if (update) {
      let select = confirm("是否选择下载代理");
      if (select) {
        let url_index = dialogs.singleChoice("请选择下载代理", url_prefix, 0);
        try {
          let url = url_prefix[url_index] + "dist/UI.js";
          console.log(url);
          let res = http.get(url);
          console.log("statusCode:" + res.statusCode);
          if (res.statusCode == 200) {
            UI = res.body.string();
            DB.put("UI", UI);
            console.log("学习脚本:地址" + url + "下载成功,开始运行");
            runUI();
          } else {
            console.log("学习脚本:地址" + url + "下载失败");
            console.log("重新运行UI脚本");
            runUI();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        UI = getScript("dist/UI");
        DB.put("UI", UI);
        runUI();
      }
    } else {
      exit();
    }
  }
}

function getScript(filename: string): string {
  let script = "";
  for (let i = 0; i < url_prefix.length; i++) {
    try {
      let res = http.get(url_prefix[i] + filename + ".js");
      console.log(i, ":" + res.statusCode);
      if (res.statusCode == 200) {
        script = res.body.string();
        if (
          1 ||
          script.indexOf("console.clear();") == 0 ||
          script.indexOf("auto.waitFor();") == 0 || script.indexOf('"ui";') == 0
        ) break;
      } else {
        toastLog("学习脚本:地址" + i + "下载失败");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return script;
}
