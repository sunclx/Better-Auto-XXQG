console.clear();

http.__okhttp__.setTimeout(10000);

const DB = storages.create("MAIN");
let UI = DB.get("UI");
let main = DB.get("main");
start();
function start() {
  if (!main) {
    console.log("start1....");
    main = getScript("main");
    DB.put("main", main);
    DB.put("IS_MAIN_RUN", true);
    engines.execScript("main", main);
    return;
  }

  if (!DB.get("IS_MAIN_RUN")) {
    console.log("start2....");
    DB.put("IS_MAIN_RUN", true);
    console.log(DB.get("IS_MAIN_RUN"));
    engines.execScript("main", main);
    return;
  }

  console.log("start3....");
  try {
    runUI();
  } catch (_error) {
    const update = confirm("UI脚本运行失败，是否更新脚本？");
    if (update) {
      UI = getScript("UI");
      DB.put("UI", UI);
      runUI();
    } else {
      exit();
    }
  }

  DB.put("IS_MAIN_RUN", false);
}

function runUI() {
  if (UI) {
    engines.execScript("UI", UI);
    return;
  }
  UI = getScript("UI");
  DB.put("UI", UI);
  engines.execScript("UI", UI);
}

function getScript(filename) {
  const url_prefix = [
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
  let script = "";
  for (let i = 0; i < url_prefix.length; i++) {
    try {
      const res = http.get(url_prefix[i] + filename + ".js");
      console.log(i, ":" + res.statusCode);
      if (res.statusCode == 200) {
        script = res.body.string();
        if (
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
