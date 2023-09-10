console.clear();

http.__okhttp__.setTimeout(10000);

var DB = storages.create("MAIN");
var UI = DB.get("UI");
var main = DB.get("main");
if (!main) {
    main = getScript("main");
    DB.put("MAIN", main);
    DB.put("IS_MAIN_RUN", true)
    engines.execScript("MAIN", main);
} else {
    if (!DB.get("IS_MAIN_RUN")) {
        DB.put("IS_MAIN_RUN", true)
        engines.execScript("MAIN", main);
    } else {
        runUI();
        DB.put("IS_MAIN_RUN", false);
    }
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
    let url_prefix = [
        'https://v.sec-an-cf.top/gh/raw/sunclx/XXQG/main/',
        'https://gh-proxy.com/https://raw.githubusercontent.com/sunclx/XXQG/main/',
        "https://ghproxy.com/https://raw.githubusercontent.com/sunclx/XXQG/main/",
        'https://cdn.jsdelivr.net/gh/sunclx/XXQG@main/',
        'https://raw.githubusercontent.com/sunclx/XXQG/main/',
    ];
    for (var i = 0; i < url_prefix.length; i++) {
        try {
            let res = http.get(url_prefix[i] + filename + ".js");
            console.log(i, ":" + res.statusCode);
            if (res.statusCode == 200) {
                var script = res.body.string();
                if (script.indexOf('console.clear();') == 0 || script.indexOf('auto.waitFor();') == 0 || script.indexOf('"ui";') == 0) break;
            } else {
                toastLog('学习脚本:地址' + i + '下载失败');
            }
        } catch (error) {
            console.log(error);
        }
    }
    return script;
}
