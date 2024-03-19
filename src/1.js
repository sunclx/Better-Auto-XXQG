// deno-lint-ignore-file no-var no-unused-vars no-inner-declarations no-empty
console.log("start");
auto.waitFor();
console.log("\u5F00\u59CB\u6267\u884C\u811A\u672C0.js");
var delay_time = 3e3;
var test = true;
device.wakeUpIfNeeded();
var TTXS_PRO_CONFIG = storages.create("TTXS_PRO_CONFIG");
var watchdog = TTXS_PRO_CONFIG.get("watchdog", "1800");
var slide_verify = TTXS_PRO_CONFIG.get("slide_verify", "300");
var fast_mode = TTXS_PRO_CONFIG.get("fast_mode", false);
var ddtong = TTXS_PRO_CONFIG.get("ddtong", false);
var is_exit = TTXS_PRO_CONFIG.get("is_exit", true);
var pinglun = TTXS_PRO_CONFIG.get("pinglun", true);
var shipin = TTXS_PRO_CONFIG.get("shipin", true);
var wenzhang = TTXS_PRO_CONFIG.get("wenzhang", true);
var meiri = TTXS_PRO_CONFIG.get("meiri", true);
var meizhou = TTXS_PRO_CONFIG.get("meizhou", 0);
var zhuanxiang = TTXS_PRO_CONFIG.get("zhuanxiang", 0);
var tiaozhan = TTXS_PRO_CONFIG.get("tiaozhan", true);
var ocr_choice = TTXS_PRO_CONFIG.get("ocr_choice", 0);
var duizhan_mode = TTXS_PRO_CONFIG.get("duizhan_mode", 0);
var jisu = TTXS_PRO_CONFIG.get("jisu", "0");
var guaji = TTXS_PRO_CONFIG.get("guaji", true);
var shuangren = TTXS_PRO_CONFIG.get("shuangren", true);
var bendi = TTXS_PRO_CONFIG.get("bendi", true);
var dingyue = TTXS_PRO_CONFIG.get("dingyue", 0);
var pushplus = TTXS_PRO_CONFIG.get("pushplus", "");
var yl_on = TTXS_PRO_CONFIG.get("yl_on", true);
var yinliang = TTXS_PRO_CONFIG.get("yinliang", 0);
var zhanghao = TTXS_PRO_CONFIG.get("zhanghao", "");
var comment = TTXS_PRO_CONFIG.get(
  "comment",
  "\u5168\u5FC3\u5168\u610F\u4E3A\u4EBA\u6C11\u670D\u52A1|\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u7262\u8BB0\u4F7F\u547D|\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u65B9\u5F97\u59CB\u7EC8|\u6C38\u8FDC\u575A\u6301\u515A\u7684\u9886\u5BFC|\u5BCC\u5F3A\u3001\u6C11\u4E3B\u3001\u6587\u660E\u3001\u548C\u8C10|\u81EA\u7531\uFF0C\u5E73\u7B49\uFF0C\u516C\u6B63\uFF0C\u6CD5\u6CBB",
);
var district = TTXS_PRO_CONFIG.get("district", "\u6C5F\u82CF");
var broadcast = TTXS_PRO_CONFIG.get(
  "broadcast",
  "\u6C5F\u82CF\u65B0\u95FB\u5E7F\u64AD",
);
var platform = TTXS_PRO_CONFIG.get(
  "platform",
  "\u6C5F\u82CF\u5B66\u4E60\u5E73\u53F0",
);
var subcolumn = TTXS_PRO_CONFIG.get(
  "subcolumn",
  "\u603B\u4E66\u8BB0\u5728\u6C5F\u82CF",
);
var jifen_list;
var meizhou_dao;
var zhuanxiang_dao;
var dingyue_dao;
var storage_user;
var name;
var jinri;
var zongfen;
var jifen_map = {
  "\u8BC4\u8BBA": 6,
  "\u89C6\u9891": 2,
  "\u6587\u7AE0": 1,
  "\u6BCF\u65E5": 3,
  "\u8DA3\u5473\u7B54\u9898": 4,
  "\u8BA2\u9605": 5,
  "\u672C\u5730": 7,
};
var jifen_flag = "old";
function google_ocr_api(img) {
  console.log("GoogleMLKit\u6587\u5B57\u8BC6\u522B\u4E2D");
  let list = JSON.parse(JSON.stringify(gmlkit.ocr(img, "zh").toArray(3)));
  let eps = 30;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i]["bounds"]["bottom"] > list[j]["bounds"]["bottom"]) {
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (
        Math.abs(list[i]["bounds"]["bottom"] - list[j]["bounds"]["bottom"]) <
          eps && list[i]["bounds"]["left"] > list[j]["bounds"]["left"]
      ) {
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  let res3 = "";
  for (let i = 0; i < list.length; i++) {
    res3 += list[i]["text"];
  }
  list = null;
  return res3;
}
function paddle_ocr_api(img, eps) {
  if (!eps) {
    eps = 30;
  }
  console.log("PaddleOCR\u6587\u5B57\u8BC6\u522B\u4E2D");
  const list = JSON.parse(JSON.stringify(paddle.ocr(img)));
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = 0; j < list.length - 1 - i; j++) {
      if (list[j]["bounds"]["bottom"] > list[j + 1]["bounds"]["bottom"]) {
        [list[j], list[j + 1]] = [list[j + 1], list[j]];
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (
        Math.abs(list[i]["bounds"]["bottom"] - list[j]["bounds"]["bottom"]) <
          eps && list[i]["bounds"]["left"] > list[j]["bounds"]["left"]
      ) {
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
  }
  let res3 = "";
  for (let i = 0; i < list.length; i++) {
    res3 += list[i]["text"];
  }
  list.length = 0;
  return res3;
}
if (fast_mode) {
  auto.setMode("fast");
}
events.observeToast();
sleep(delay_time);
var storage = storages.create("songgedodo");
var newest_version = "V12.4";
var w = fInit();
fInfo(
  "\u5929\u5929\u5411\u4E0APro" + newest_version +
    "\u811A\u672C\u521D\u59CB\u5316",
);
var [device_w, device_h] = init_wh();
var ocr;
if (ocr_choice == 2) {
  fInfo("\u521D\u59CB\u5316\u7B2C\u4E09\u65B9ocr\u63D2\u4EF6");
  try {
    ocr = plugins.load("com.hraps.ocr");
    ocr.recognizeText = function (img) {
      let results = this.detect(img.getBitmap(), 1);
      let all_txt = "";
      for (let i = 0; i < results.size(); i++) {
        let re = results.get(i);
        all_txt += re.text;
      }
      return all_txt;
    };
  } catch (e) {
    fError(
      "\u672A\u5B89\u88C5\u7B2C\u4E09\u65B9OCR\u63D2\u4EF6\uFF0C\u8BF7\u5B89\u88C5\u540E\u91CD\u65B0\u8FD0\u884C",
    );
    alert(
      "\u672A\u5B89\u88C5\u7B2C\u4E09\u65B9OCR\u63D2\u4EF6\uFF0C\u70B9\u51FB\u786E\u8BA4\u8DF3\u8F6C\u6D4F\u89C8\u5668\u4E0B\u8F7D\uFF0C\u5BC6\u7801\u4E3Attxs",
    );
    app.openUrl("https://wwc.lanzouo.com/ikILs001d0wh");
    exit();
  }
}
threads.start(function () {
  toastLog("\u5F00\u59CB\u81EA\u52A8\u83B7\u53D6\u622A\u56FE\u6743\u9650");
  var btn = className("android.widget.Button").textMatches(
    /允许|立即开始|START NOW/,
  ).findOne(5e3);
  if (btn) {
    sleep(1e3);
    btn.click();
  }
  toastLog("\u7ED3\u675F\u83B7\u53D6\u622A\u56FE\u6743\u9650");
});
fInfo("\u8BF7\u6C42\u622A\u56FE\u6743\u9650");
if (!requestScreenCapture(false)) {
  fError("\u8BF7\u6C42\u622A\u56FE\u5931\u8D25");
  exit();
}
fInfo("\u8BBE\u7F6E\u5C4F\u5E55\u5E38\u4EAE");
device.keepScreenOn(3600 * 1e3);
fInfo("\u68C0\u6D4B\u9898\u5E93\u66F4\u65B0");
var update_info = get_tiku_by_http(
  "https://gitcode.net/m0_64980826/songge_tiku/-/raw/master/info.json",
);
fInfo(
  "\u6B63\u5728\u52A0\u8F7D\u5BF9\u6218\u9898\u5E93......\u8BF7\u7A0D\u7B49\n\u9898\u5E93\u7248\u672C:" +
    update_info["tiku_version"],
);
fInfo(
  "\u5982\u679C\u4E0D\u52A8\u5C31\u662F\u6B63\u5728\u4E0B\u8F7D\uFF0C\u591A\u7B49\u4F1A",
);
var tiku = [];
try {
  tiku = get_tiku_by_http(update_info["tiku_link"]);
} catch (e) {
  tiku = get_tiku_by_http(update_info["tiku_link2"]);
}
fInfo(
  "\u6B63\u5728\u52A0\u8F7D\u4E13\u9879\u9898\u5E93......\u8BF7\u7A0D\u7B49\n\u9898\u5E93\u7248\u672C:" +
    update_info["dati_tiku_version"],
);
var dati_tiku = [];
try {
  dati_tiku = update_dati_tiku();
} catch (e) {
  fError(
    "\u7F51\u7EDC\u539F\u56E0\u672A\u83B7\u53D6\u5230\u5728\u7EBF\u9898\u5E93\uFF0C\u8BF7\u5C1D\u8BD5\u5207\u6362\u6D41\u91CF\u6216\u8005\u66F4\u6362114DNS",
  );
  dati_tiku = get_tiku_by_ct(
    "https://webapi.ctfile.com/get_file_url.php?uid=35157972&fid=555754562&file_chk=94c3c662ba28f583d2128a1eb9d78af4&app=0&acheck=2&rd=0.14725283060014105",
  );
}
files.createWithDirs("/sdcard/\u5929\u5929\u5411\u4E0A/");
var yuan_yl = 10;
if (yl_on) {
  fInfo("\u8BBE\u7F6E\u5A92\u4F53\u97F3\u91CF");
  yuan_yl = device.getMusicVolume();
  max_yl = device.getMusicMaxVolume();
  let yl = Math.ceil(yinliang * max_yl / 100);
  device.setMusicVolume(yl);
  fInfo("\u5F53\u524D\u97F3\u91CF\uFF1A" + device.getMusicVolume());
}
var max_yl;
if (is_exit) {
  fInfo("\u8FD0\u884C\u524D\u91CD\u7F6E\u5B66\u4E60APP");
  exit_app("\u5B66\u4E60\u5F3A\u56FD");
  sleep(1500);
}
fInfo("\u5F00\u59CB\u4F4D\u7F6E\u6743\u9650\u5F39\u7A97\u68C0\u6D4B");
var nolocate_thread = threads.start(function () {
  id("title_text").textContains("\u5730\u7406\u4F4D\u7F6E").waitFor();
  fInfo("\u68C0\u6D4B\u5230\u4F4D\u7F6E\u6743\u9650\u5F39\u7A97");
  sleep(1e3);
  text("\u6682\u4E0D\u5F00\u542F").findOne().click();
  fInfo("\u5DF2\u5173\u95ED\u5B9A\u4F4D");
});
fInfo("\u8DF3\u8F6C\u5B66\u4E60APP");
app.launchApp("\u5B66\u4E60\u5F3A\u56FD");
sleep(2e3);
function do_pinglun() {
  entry_jifen_project("\u53D1\u8868\u89C2\u70B9");
  fSet("title", "\u8BC4\u8BBA\u2026");
  fClear();
  sleep(1e3);
  swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.4, 1e3);
  id("general_card_title_id").findOne().parent().parent();
  fInfo(
    "\u5C1D\u8BD5\u70B9\u51FBtitle:" +
      id("general_card_title_id").findOne().text(),
  );
  real_click(id("general_card_title_id").findOne().parent().parent());
  log("\u7B49\u5F85\u52A0\u8F7D");
  idContains("image-text-content").waitFor();
  let text_edit = text("\u6B22\u8FCE\u53D1\u8868\u4F60\u7684\u89C2\u70B9");
  log("\u67E5\u627E\u8BC4\u8BBA\u6846");
  text_edit.waitFor();
  sleep(1500);
  while (text_edit.exists()) {
    let pinglun_edit = text_edit.findOne(500);
    fInfo("\u5C1D\u8BD5\u70B9\u51FB\u8BC4\u8BBA\u6846\u4E2D");
    log(pinglun_edit.click());
    sleep(1500);
    fRefocus();
  }
  fInfo("\u8BC4\u8BBA\u6846click: true");
  let content_list = comment.split("|");
  log("\u8BC4\u8BBA\u5217\u8868\uFF1A", content_list);
  let comment_content = content_list[random(0, content_list.length - 1)];
  comment_content ||
    (fTips(
      '\u8BC4\u8BBA\u5185\u5BB9\u4E0D\u53EF\u8BBE\u7F6E\u4E3A\u7A7A\uFF0C\u5DF2\u91CD\u7F6E\u4E3A"\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u7262\u8BB0\u4F7F\u547D"',
    ),
      comment_content =
        "\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u7262\u8BB0\u4F7F\u547D");
  classNameEndsWith("EditText").findOne().setText(comment_content);
  sleep(1e3);
  text("\u53D1\u5E03").findOne().click();
  sleep(1e3);
  text("\u5220\u9664").findOne().click();
  sleep(1e3);
  text("\u786E\u8BA4").findOne().click();
  sleep(1e3);
  back();
  jifen_init();
  ran_sleep();
  return true;
}
function do_shipin() {
  entry_jifen_project("\u89C6\u542C\u5B66\u4E60");
  jifen_list.child(jifen_map["\u89C6\u9891"]).child(3).click();
  if (ddtong) {
    fSet("title", "\u89C6\u542C(dd\u901A)\u2026");
  } else {
    fSet("title", "\u89C6\u542C\u5B66\u4E60\u2026");
  }
  fClear();
  desc("\u767E\u7075").findOne().click();
  sleep(1e3);
  fInfo("\u68C0\u6D4B\u6E29\u99A8\u63D0\u793A\u5F39\u7A97");
  if (text("\u6E29\u99A8\u63D0\u793A").findOne(1500)) {
    text("\u5173\u95ED").findOne().click();
    fInfo("\u68C0\u6D4B\u5230\u6E29\u99A8\u63D0\u793A\u5E76\u5DF2\u5173\u95ED");
  }
  desc("\u767E\u7075").findOne().click();
  let shu = text("\u7AD6").findOne();
  sleep(1500);
  let frame_box = shu.parent().parent().parent().parent();
  textMatches(/\d{2}:\d{2}/).waitFor();
  let video_list = frame_box.findOne(className("android.widget.ListView"));
  video_list.child(1).child(1).child(0).click() || fInfo(
    "\u5C1D\u8BD5\u518D\u6B21\u70B9\u51FB" +
      video_list.child(1).child(1).child(0).child(0).click(),
  );
  text("\u5206\u4EAB").waitFor();
  if (idContains("guide_view").findOne(1500)) {
    fInfo("\u68C0\u6D4B\u5230\u5F15\u5BFC\u906E\u7F69");
    sleep(1e3);
    click(device_w / 2, device_h / 2);
    sleep(1e3);
    click(device_w / 2, device_h / 4);
  }
  sleep(800);
  textMatches(/刷新重试|继续播放/).exists() &&
    (fInfo("\u68C0\u6D4B\u5230\u6D41\u91CF\u63D0\u9192"),
      textMatches(/刷新重试|继续播放/).findOne().click());
  sleep(random(8e3, 9500));
  let re_times = 6;
  if (ddtong) {
    re_times += 6;
  }
  for (let i = 0; i < re_times; i++) {
    click(device_w / 2, device_h / 2);
    sleep(500);
    swipe(device_w / 2, device_h * 0.8, device_w / 2, device_h * 0.1, 1e3);
    sleep(random(8e3, 9500));
  }
  back();
  fInfo("\u89C6\u9891\u4E2A\u6570\u5DF2\u5237\u5B8C");
  jifen_init();
  ran_sleep();
  return true;
}
function do_wenzhang() {
  let old_wen = storage_user.get("old_wen_list", []);
  entry_jifen_project("\u672C\u5730\u9891\u9053");
  if (ddtong) {
    fSet("title", "\u6587\u7AE0(dd\u901A)\u2026");
  } else {
    fSet("title", "\u9009\u8BFB\u6587\u7AE0\u2026");
  }
  fClear();
  fInfo(`\u5207\u6362\u5730\u533A\u4E3A${district}`);
  text("\u5207\u6362\u5730\u533A").findOne(3e3);
  if (text("\u7ACB\u5373\u5207\u6362").exists()) {
    text("\u53D6\u6D88").findOne(3e3).click();
  }
  log("\u5207\u6362\u5730\u533A");
  text("\u5207\u6362\u5730\u533A").findOne().click();
  log(`\u67E5\u627E\u5730\u533A${district}`);
  text(`${district}`).waitFor();
  sleep(500);
  log(`\u5207\u6362\u5730\u533A${district}`);
  text(`${district}`).findOne().parent().parent().click();
  log("\u67E5\u627Ebanner");
  let banner = classNameContains("RecyclerView").findOne();
  fInfo(`\u67E5\u627E\u65B0\u95FB\u5E7F\u64AD${broadcast}`);
  while (
    banner.findOne(
      text(`${broadcast}`).boundsInside(0, 0, device_w, device_h),
    ) == null
  ) {
    banner.scrollForward();
    sleep(500);
  }
  let last_obj = banner.findOne(text(`${broadcast}`));
  fInfo(
    `\u70B9\u51FB\u65B0\u95FB\u5E7F\u64AD${broadcast}\uFF1A` +
      last_obj.parent().click(),
  );
  fInfo("\u89C6\u542C\u5E7F\u64AD\u65F6\u957F");
  sleep(11500);
  back();
  fClear();
  fInfo("\u5F00\u59CB\u6587\u7AE0");
  sleep(1500);
  banner = classNameContains("RecyclerView").findOne();
  while (
    banner.findOne(
      text(`${platform}`).boundsInside(0, 0, device_w, device_h),
    ) == null
  ) {
    banner.scrollBackward();
    sleep(500);
  }
  sleep(1e3);
  fInfo(
    `\u67E5\u627E\u5B66\u4E60\u5E73\u53F0${platform}\uFF0C\u5C1D\u8BD5\u70B9\u51FB`,
  );
  let first_obj = banner.findOne(text(`${platform}`));
  real_click(first_obj.parent());
  log("\u7B49\u5F85\u52A0\u8F7D");
  sleep(1e3);
  text(`${subcolumn}`).waitFor();
  sleep(1e3);
  let swipe_y =
    text(`${subcolumn}`).findOne().parent().parent().bounds().bottom;
  log("\u8BC6\u522B\u51FA\u9876\u90E8\uFF1A", swipe_y);
  fRefocus();
  let listview = className("android.widget.ListView").depth(17).findOne();
  for (let i = 0; i < 2; i++) {
    listview.scrollForward();
    sleep(500);
  }
  let wen_box_slt = className("android.view.ViewGroup").depth(20).filter(
    function (l) {
      let title = l.findOne(idContains("general_card_title_id"));
      let image = l.findOne(idContains("general_card_image_id"));
      let pic_num = l.findOne(idContains("st_feeds_card_mask_pic_num"));
      if (title && image && !pic_num) {
        return old_wen.indexOf(title.text()) == -1 &&
          title.text().indexOf("\u3010\u4E13\u9898\u3011") == -1;
      }
      return false;
    },
  );
  log("\u67E5\u627E\u6587\u7AE0");
  while (!wen_box_slt.findOne(500)) {
    listview.scrollForward();
  }
  log("\u627E\u5230\u6587\u7AE0");
  let wen_box = wen_box_slt.findOne();
  let wen_num = 0;
  let re_times = 6;
  if (ddtong) {
    re_times += 6;
  }
  while (true) {
    let title = wen_box.findOne(idContains("general_card_title_id")).text();
    old_wen.push(title);
    if (old_wen.length > 100) {
      old_wen.shift();
    }
    fClear();
    fInfo("\u70B9\u51FB\u6587\u7AE0\uFF1A" + title);
    let title_click = wen_box.parent().parent().click();
    fInfo("\u70B9\u51FB\uFF1A" + title_click);
    classNameContains("com.uc.webview.export").waitFor();
    fInfo("\u67E5\u627Ewebview");
    let father_view = className("android.webkit.WebView").findOne(9e3);
    sleep(1e3);
    if (father_view && father_view.find(idContains("__next")).empty()) {
      fInfo("\u67E5\u627E\u6587\u7AE0\u5185\u5BB9");
      let content = idContains("image-text-content").findOne(9e3);
      if (content) {
        idContains("xxqg-article-header").findOne().child(0).click();
      }
      swipe(device_w / 2, device_h * 0.7, device_w / 2, device_h * 0.3, 1e3);
      if (wen_num < re_times - 1) {
        sleep(random(9e3, 10500));
      } else {
        toastLog(
          "\u6B63\u5728\u5237\u65F6\u957F\u7A0B\u5E8F\u672A\u505C\u6B62",
        );
        let shichang = random(330, 360);
        fClear();
        fInfo(
          "\u5F00\u59CB\u5237\u65F6\u957F\uFF0C\u603B\u5171" + shichang +
            "\u79D2",
        );
        let wait_time = 1;
        for (let i = 0; i < shichang; i++) {
          if (i % 15 == 0) {
            swipe(
              device_w / 2,
              device_h * 0.6,
              device_w / 2,
              device_h * 0.6 - 100,
              500,
            );
            sleep(500);
          } else {
            sleep(1e3);
          }
          fSet(
            "info",
            "\u5DF2\u89C2\u770B\u6587\u7AE0" + wait_time +
              "\u79D2\uFF0C\u603B\u5171" + shichang + "\u79D2",
          );
          wait_time++;
        }
        fSet("info", "\u5DF2\u7ED3\u675F\u6587\u7AE0\u65F6\u957F");
        console.hide();
        back();
        break;
      }
    } else {
      wen_num -= 1;
    }
    back();
    className("android.widget.ListView").scrollable().depth(17).waitFor();
    sleep(1e3);
    while (!wen_box_slt.exists()) {
      listview.scrollForward();
      sleep(200);
    }
    wen_box = wen_box_slt.findOne();
    wen_num += 1;
  }
  storage_user.put("old_wen_list", old_wen);
  sleep(3e3);
  close_video();
  back();
  sleep(3e3);
  jifen_init();
  ran_sleep();
  return true;
}
function do_meiri() {
  entry_jifen_project("\u6BCF\u65E5\u7B54\u9898");
  fSet("title", "\u6BCF\u65E5\u7B54\u9898\u2026");
  fClear();
  text("\u67E5\u770B\u63D0\u793A").waitFor();
  var tihao = className("android.view.View").depth(24).findOnce(1).text();
  var num = Number(tihao[0]);
  var sum = Number(tihao[tihao.length - 1]);
  var substr = tihao.slice(1);
  while (num <= sum) {
    fClear();
    fInfo("\u7B2C" + num + "\u9898");
    text(num + substr).waitFor();
    num++;
    if (className("android.widget.Image").exists()) {
      num = 1;
      restart(0);
      continue;
    }
    do_exec();
    depth(20).text("\u786E\u5B9A").findOne().click();
    ran_sleep();
    if (text("\u4E0B\u4E00\u9898").exists() || text("\u5B8C\u6210").exists()) {
      fInfo("\u7B54\u9519\u91CD\u8BD5");
      num = 1;
      restart(0);
      continue;
    }
  }
  text("\u8FD4\u56DE").findOne().click();
  text("\u767B\u5F55").waitFor();
  ran_sleep();
  return true;
}
function do_meizhou() {
  text("\u6BCF\u5468\u7B54\u9898").findOne().parent().click();
  fSet("title", "\u6BCF\u5468\u7B54\u9898\u2026");
  fClear();
  textMatches(/.*月|发现新版本/).waitFor();
  if (text("\u53D1\u73B0\u65B0\u7248\u672C").exists()) {
    return fError(
      "\u6709\u5F39\u7A97\u65E0\u6CD5\u6BCF\u5468\u7B54\u9898\uFF0C\u53EF\u4F7F\u7528\u65E7\u7248\u4FEE\u6539\u7248\u672C\u53F7\u7248\u53D6\u6D88\u5F39\u7A97",
    ),
      sleep(1e3),
      text("\u53D6\u6D88").findOne().click(),
      sleep(1e3),
      back(),
      text("\u6211\u8981\u7B54\u9898").waitFor(),
      sleep(1e3),
      back(),
      ran_sleep(),
      true;
  }
  let scoll = depth(21).scrollable().findOne();
  if (meizhou_dao) {
    fInfo("\u5012\u5E8F\u67E5\u627E\u672A\u505A\u9898\u76EE");
    while (!text("\u5DF2\u4F5C\u7B54").exists()) {
      scoll.scrollForward();
      sleep(300);
    }
    var clt = text("\u672A\u4F5C\u7B54").find();
    if (clt.empty()) {
      return fInfo(
        "\u6BCF\u5468\u7B54\u9898\u5168\u90E8\u5DF2\u4F5C\u7B54\u3002",
      ),
        ran_sleep(),
        back(),
        text("\u6BCF\u5468\u7B54\u9898").waitFor(),
        sleep(1e3),
        back(),
        text("\u6211\u8981\u7B54\u9898").waitFor(),
        sleep(1e3),
        back(),
        text("\u6211\u7684").waitFor(),
        ran_sleep(),
        true;
    }
    var title = clt[clt.length - 1].parent().child(0).text();
    fInfo(title + "\u5F00\u59CB\u4F5C\u7B54");
    clt[clt.length - 1].parent().click();
  } else {
    fInfo("\u6B63\u5E8F\u67E5\u627E\u672A\u505A\u9898\u76EE");
    let dixian_slt = text(
      "\u60A8\u5DF2\u7ECF\u770B\u5230\u4E86\u6211\u7684\u5E95\u7EBF",
    ).filter(function (w2) {
      log("\u5E95\u7EBF\uFF1A", w2.bounds().top, device_h);
      return w2.bounds().top <= device_h - 30;
    });
    while (!text("\u672A\u4F5C\u7B54").exists()) {
      if (dixian_slt.exists()) {
        return fInfo(
          "\u6BCF\u5468\u7B54\u9898\u5168\u90E8\u5DF2\u4F5C\u7B54\u3002",
        ),
          back(),
          text("\u6BCF\u5468\u7B54\u9898").waitFor(),
          sleep(1e3),
          back(),
          text("\u6211\u8981\u7B54\u9898").waitFor(),
          sleep(1e3),
          back(),
          text("\u6211\u7684").waitFor(),
          ran_sleep(),
          true;
      }
      scoll.scrollForward();
      sleep(200);
    }
    title = text("\u672A\u4F5C\u7B54").findOne().parent().child(0).text();
    fInfo(title + "\u5F00\u59CB\u4F5C\u7B54");
    text("\u672A\u4F5C\u7B54").findOne().parent().click();
  }
  text("\u67E5\u770B\u63D0\u793A").waitFor();
  let tihao = className("android.view.View").depth(24).findOnce(1).text();
  let num = Number(tihao[0]);
  let sum = Number(tihao[tihao.length - 1]);
  let substr = tihao.slice(1);
  while (num <= sum) {
    fClear();
    fInfo("\u7B2C" + num + "\u9898");
    text(num + substr).waitFor();
    num++;
    do_exec("\uFF08\u6BCF\u5468\uFF09");
    depth(20).text("\u786E\u5B9A").findOne().click();
    ran_sleep();
    if (text("\u4E0B\u4E00\u9898").exists() || text("\u5B8C\u6210").exists()) {
      fInfo("\u505A\u9519\u5C1D\u8BD5\u91CD\u7B54");
      text("\u7B54\u6848\u89E3\u6790").waitFor();
      upload_wrong_exec("\uFF08\u6BCF\u5468\uFF09");
      storage.put("dati_tiku", dati_tiku);
      back();
      text("\u9000\u51FA").findOne().click();
      ran_sleep();
      back();
      text("\u6BCF\u5468\u7B54\u9898").waitFor();
      ran_sleep();
      return false;
    }
  }
  text("\u8FD4\u56DE").findOne().click();
  sleep(1e3);
  back();
  text("\u6BCF\u5468\u7B54\u9898").waitFor();
  sleep(1e3);
  back();
  text("\u6211\u8981\u7B54\u9898").waitFor();
  sleep(1e3);
  back();
  text("\u6211\u7684").waitFor();
  ran_sleep();
  return true;
}
function do_zhuanxiang() {
  entry_jifen_project("\u4E13\u9879\u7B54\u9898");
  fSet("title", "\u4E13\u9879\u7B54\u9898\u2026");
  fClear();
  depth(23).waitFor();
  ran_sleep();
  let scoll = depth(21).indexInParent(1).scrollable().findOne();
  if (zhuanxiang_dao) {
    while (!text("\u5DF2\u6EE1\u5206").exists()) {
      scoll.scrollForward();
      sleep(200);
    }
    var clt = text("\u5F00\u59CB\u7B54\u9898").find();
    if (clt.empty()) {
      fInfo("\u4E13\u9879\u7B54\u9898\u5168\u90E8\u5DF2\u4F5C\u7B54\u3002");
      back();
      text("\u767B\u5F55").waitFor();
      ran_sleep();
      return true;
    }
    clt[clt.length - 1].click();
  } else {
    let dixian_slt = text(
      "\u60A8\u5DF2\u7ECF\u770B\u5230\u4E86\u6211\u7684\u5E95\u7EBF",
    ).filter(function (w2) {
      return w2.bounds().top <= device_h - 30;
    });
    while (!text("\u5F00\u59CB\u7B54\u9898").exists()) {
      if (dixian_slt.exists()) {
        fInfo("\u4E13\u9879\u7B54\u9898\u5168\u90E8\u5DF2\u4F5C\u7B54\u3002");
        back();
        text("\u767B\u5F55").waitFor();
        ran_sleep();
        return true;
      }
      for (let i = 0; i < 15; i++) {
        scoll.scrollForward();
        sleep(300);
      }
    }
    text("\u5F00\u59CB\u7B54\u9898").findOne().click();
  }
  ran_sleep();
  text("\u67E5\u770B\u63D0\u793A").waitFor();
  sleep(2e3);
  var tihao = className("android.view.View").depth(24).findOnce(1).text();
  let reg3 = /(\d+) \/(\d+)/;
  let match_result = tihao.match(reg3);
  if (match_result == null) {
    fInfo(
      "\u9898\u53F7\u5339\u914D\u5931\u8D25\uFF0C\u9000\u51FA\u4E13\u9879\u7B54\u9898\u3002",
    );
    return;
  }
  let num = Number(match_result[1]);
  let sum = Number(match_result[2]);
  let substr = " /" + sum;
  while (num <= sum) {
    fClear();
    fInfo("\u7B2C" + num + "\u9898");
    text(num + substr).waitFor();
    num++;
    do_exec();
    let next = className("android.view.View").filter(function (l) {
      return l.text() == "\u4E0B\u4E00\u9898" || l.text() == "\u5B8C\u6210";
    });
    next.findOne().click();
    ran_sleep();
  }
  text("\u67E5\u770B\u89E3\u6790").waitFor();
  sleep(1e3);
  if (textMatches(/\d+分/).findOne().text() != "100\u5206") {
    fInfo("\u6709\u9519\u9898\uFF0C\u5C1D\u8BD5\u4E0A\u4F20\u9519\u9898");
    text("\u67E5\u770B\u89E3\u6790").findOne().click();
    tihao = textMatches(reg3).findOne().text();
    let match_result2 = tihao.match(reg3);
    if (match_result2 == null) {
      fInfo(
        "\u9898\u53F7\u5339\u914D\u5931\u8D25\uFF0C\u9000\u51FA\u4E13\u9879\u7B54\u9898\u3002",
      );
      return;
    }
    num = Number(match_result2[1]);
    sum = Number(match_result2[2]);
    substr = " /" + sum;
    sleep(1500);
    while (num <= sum) {
      text(num + substr).waitFor();
      num++;
      if (textEndsWith("\u56DE\u7B54\u9519\u8BEF").exists()) {
        upload_wrong_exec();
      }
      let next = className("android.view.View").filter(function (l) {
        return l.text() == "\u4E0B\u4E00\u9898" || l.text() == "\u5B8C\u6210";
      });
      next.findOne().click();
      sleep(random(1e3, 1500));
    }
    storage.put("dati_tiku", dati_tiku);
  } else {
    back();
    ran_sleep();
  }
  back();
  text("\u767B\u5F55").waitFor();
  ran_sleep();
  return true;
}
function do_tiaozhan() {
  if (ddtong) {
    fSet("title", "\u6311\u6218(dd\u901A)\u2026");
  } else {
    fSet("title", "\u6311\u6218\u7B54\u9898\u2026");
  }
  fClear();
  className("android.widget.Image").textMatches(/total.*|chanllenge.*/)
    .waitFor();
  let a = true;
  if (textStartsWith("total").exists()) {
    let b = className("android.widget.Image").textStartsWith("total").findOne()
      .parent();
    ran_sleep();
    b.click();
    className("android.widget.Image").textStartsWith("chanllenge").waitFor();
  }
  let total = 0, max_total = 5;
  let xuan_list;
  let que_txt2;
  for (ddtong && (max_total += 10);;) {
    fClear();
    fInfo("\u7B2C" + (total + 1) + "\u9898");
    className("android.widget.ListView").waitFor();
    ran_sleep();
    try {
      xuan_list = className("android.widget.ListView").findOne().children();
      que_txt2 = className("android.widget.ListView").findOne().parent().child(
        0,
      ).text();
    } catch (p) {
      log("error1:", p);
      sleep(500);
      continue;
    }
    let ans_list = get_ans_by_tiku(
      que_txt2.replace(/[^\u4e00-\u9fa5\d]|来源：.+|出题单位：.+/g, ""),
    );
    if (total >= max_total) {
      fInfo("\u5DF2\u7B54\u5BF9" + max_total + "\u9898\uFF0C\u5168\u9009A");
      xuan_list[0].child(0).click();
    } else if (ans_list.length != 0) {
      let max_simi = 0;
      let xuanxiang = null;
      for (let xuan_box of xuan_list) {
        let xuan_txt = xuan_box.child(0).child(1).text();
        for (let ans2 of ans_list) {
          let similar = str_similar(ans2.slice(2), xuan_txt);
          if (similar > max_simi) {
            max_simi = similar;
            xuanxiang = xuan_box.child(0);
          }
        }
      }
      if (xuanxiang != null) {
        fInfo("\u6700\u7EC8\uFF1A" + xuanxiang.child(1).text());
        xuanxiang.click();
      } else {
        fInfo("\u65E0\u5339\u914D\u7B54\u6848");
        xuan_list[0].child(0).click();
      }
    } else {
      fInfo("\u672A\u627E\u5230\u7B54\u6848");
      xuan_list[0].child(0).click();
    }
    sleep(2500);
    if (text("\u7ED3\u675F\u672C\u5C40").exists()) {
      sleep(5e3);
      click("\u7ED3\u675F\u672C\u5C40");
      text("\u518D\u6765\u4E00\u5C40").waitFor();
      if (total < 5) {
        fInfo("\u7B54\u9519\u91CD\u8BD5");
        console.warn("warn:", que_txt2);
        text("\u518D\u6765\u4E00\u5C40").findOne().click();
      } else {
        a && (back(), textStartsWith("total").waitFor(), sleep(2e3)),
          back(),
          text("\u767B\u5F55").waitFor();
        ran_sleep();
        return true;
      }
      total = 0;
      sleep(2e3);
      continue;
    }
    total += 1;
  }
}
function do_duizhan(renshu) {
  fClear();
  if (renshu == 2) {
    fSet("title", "\u53CC\u4EBA\u5BF9\u6218");
    fInfo("\u7B49\u5F85\u968F\u673A\u5339\u914D");
    text("\u968F\u673A\u5339\u914D").waitFor();
    sleep(1e3);
    let match = text("\u968F\u673A\u5339\u914D").findOne().parent().child(0);
    do {
      fInfo("\u70B9\u51FB\uFF1A" + match.click());
      sleep(500);
    } while (text("\u968F\u673A\u5339\u914D").exists());
  } else if (4 == renshu || 0 == renshu) {
    fSet("title", "\u56DB\u4EBA\u8D5B");
    fInfo("\u7B49\u5F85\u5F00\u59CB\u6BD4\u8D5B");
    text("\u5F00\u59CB\u6BD4\u8D5B").waitFor();
    sleep(1e3);
    let start_click = text("\u5F00\u59CB\u6BD4\u8D5B").findOne().click();
    fInfo("\u70B9\u51FB\uFF1A" + start_click);
  }
  let delay = Number(jisu);
  if (delay > 0 && duizhan_mode == 1) {
    ui.run(function () {
      let title = w.title.getText();
      w.title.setText(title + "(\u56FA\u5B9A)");
      toastLog(
        "\u8FD9\u662F\u5E9F\u5F03\u6A21\u5F0F\uFF0C\u6CA1\u6709\u6B63\u786E\u7387",
      );
    });
  } else if (duizhan_mode == 2) {
    ui.run(function () {
      let title = w.title.getText();
      w.title.setText(title + "(\u624B\u52A8)");
      toastLog("\u8BF7\u624B\u52A8\u70B9\u51FB\u7B54\u6848");
    });
  }
  className("android.widget.ListView").waitFor();
  fClear();
  let num = 1;
  let err_flag = true;
  while (true) {
    if (num != 1 && err_flag) {
      while (true) {
        if (text("\u7EE7\u7EED\u6311\u6218").exists()) {
          sleep(1e3);
          let tz_click = text("\u7EE7\u7EED\u6311\u6218").findOne().click();
          fInfo("\u70B9\u51FB\u7EE7\u7EED\u6311\u6218:" + tz_click);
          sleep(1500);
          back();
          if (renshu == 2) {
            sleep(1e3);
            fInfo("\u67E5\u627E\u9000\u51FA\u6309\u94AE");
            if (fast_mode) {
              winReshow();
            }
            let exit_click = text("\u9000\u51FA").findOne().click();
            fInfo("\u70B9\u51FB\u9000\u51FA:" + exit_click);
          }
          sleep(1e3);
          text("\u767B\u5F55").waitFor();
          ran_sleep();
          return true;
        } else if (text("\u7B2C" + num + "\u9898").exists()) {
          fClear();
          fInfo("\u7B2C" + num + "\u9898");
          break;
        }
      }
      while (text("\u7B2C" + num + "\u9898").exists()) {
      }
    } else if (!err_flag) {
      err_flag = true;
      if (text("\u7EE7\u7EED\u6311\u6218").exists()) {
        sleep(1e3);
        let tz_click = text("\u7EE7\u7EED\u6311\u6218").findOne().click();
        fInfo("\u70B9\u51FB\u7EE7\u7EED\u6311\u6218:" + tz_click);
        sleep(1500);
        back();
        if (renshu == 2) {
          sleep(1e3);
          fInfo("\u67E5\u627E\u9000\u51FA\u6309\u94AE");
          if (fast_mode) {
            winReshow();
          }
          let exit_click = text("\u9000\u51FA").findOne().click();
          fInfo("\u70B9\u51FB\u9000\u51FA:" + exit_click);
        }
        sleep(1e3);
        text("\u767B\u5F55").waitFor();
        ran_sleep();
        return true;
      }
    }
    let listview = className("android.widget.ListView").findOne(1e3);
    if (!listview) {
      log("\u627E\u4E0D\u5230listview");
      err_flag = false;
      sleep(200);
      continue;
    }
    sleep(100);
    let view_d28 = className("android.view.View").depth(28).indexInParent(0)
      .findOne(1e3);
    if (!view_d28) {
      toastLog("\u627E\u4E0D\u5230view_d28");
      err_flag = false;
      sleep(200);
      continue;
    }
    let que_x, que_y, que_w, que_h;
    if (view_d28.childCount() > 0) {
      que_x = view_d28.bounds().left;
      que_y = view_d28.bounds().top;
      que_w = view_d28.bounds().width();
      if (view_d28.child(0).text().length <= 4) {
        que_h = view_d28.child(2).bounds().top - view_d28.bounds().top;
      } else {
        que_h = view_d28.child(0).bounds().bottom - view_d28.bounds().top;
      }
    } else {
      toastLog("\u627E\u4E0D\u5230\u6846\u4F53");
      log(view_d28.childCount(), view_d28.bounds());
      err_flag = false;
      sleep(200);
      continue;
    }
    let radio_num = className("android.widget.RadioButton").find().length;
    if (!radio_num) {
      log("\u627E\u4E0D\u5230\u9009\u9879");
      err_flag = false;
      sleep(200);
      continue;
    }
    let que_txt2 = "";
    for (let i = 0; i < 1; i++) {
      let img2 = captureScreen();
      let que_img = images.clip(img2, que_x, que_y, que_w, que_h);
      console.time("\u9898\u76EE\u8BC6\u522B");
      if (ocr_choice == 0) {
        que_txt2 = google_ocr_api(que_img).replace(
          /[^\u4e00-\u9fa5\d]|\d{1,2}\./g,
          "",
        );
      } else if (ocr_choice == 1) {
        que_txt2 = paddle_ocr_api(que_img).replace(
          /[^\u4e00-\u9fa5\d]|\d{1,2}\./g,
          "",
        );
      } else {
        que_txt2 = ocr.recognizeText(que_img).replace(
          /[^\u4e00-\u9fa5\d]|\d{1,2}\./g,
          "",
        );
      }
      console.timeEnd("\u9898\u76EE\u8BC6\u522B");
      if (que_txt2) {
        fInfo("\u9898\u76EE\u8BC6\u522B\uFF1A" + que_txt2);
        img2.recycle();
        que_img.recycle();
        break;
      } else {
        fError(
          "\u672A\u8BC6\u522B\u51FA\u9898\u76EE\uFF0C\u53EF\u80FD\u88AB\u7981\u6B62\u622A\u56FE\u6216\u65E0\u969C\u788D\u5931\u6548",
        );
        img2.recycle();
        que_img.recycle();
        sleep(3e3);
      }
    }
    if (que_txt2 == "") {
      fInfo(
        "\u672A\u8BC6\u522B\u51FA\u9898\u76EE\uFF0C\u968F\u673A\u70B9\u51FB\u4E00\u4E2A",
      );
      className("android.widget.RadioButton").findOnce(random(0, 1)).parent()
        .click();
      num++;
      sleep(200);
      fClear();
      continue;
    }
    if (renshu == 0) {
      fInfo(
        "\u7531\u4E8E\u7B2C\u4E00\u5C40\u5339\u914D\u5BF9\u624B\u8F83\u5F3A\uFF0C\u6B63\u5728\u6302\u673A\u4E2D\u3002",
      );
      fInfo(
        "\u7ECF\u6D4B\u8BD5\u6302\u673A\u4E0D\u4F1A\u6263\u79EF\u5206\u5C40\u6570\uFF0C\u6B64\u529F\u80FD\u53EF\u5728\u914D\u7F6E\u4E2D\u5173\u95ED",
      );
      fTips(
        "\u8BF7\u4E0D\u8981\u70B9\u51FB\u4EFB\u4F55\u9009\u9879\uFF0C\u4E0D\u8981\u4F5C\u7B54\uFF01\uFF01\uFF01",
      );
      num++;
      text("\u7EE7\u7EED\u6311\u6218").waitFor();
      continue;
    }
    let replace_sign = "default_ocr_replace";
    let question_reg = new RegExp(update_info["question_reg"], "gi");
    let include_reg = new RegExp(update_info["include_reg"], "gi");
    let que_key = null;
    if (que_key = question_reg.exec(que_txt2)) {
      replace_sign = "other_ocr_replace";
    } else if (que_key = /读音|词形/g.exec(que_txt2)) {
      replace_sign = "accent_ocr_replace";
    } else if (que_key = include_reg.exec(que_txt2)) {
      replace_sign = "include_ocr_replace";
    }
    let ans_list = get_ans_by_tiku(que_txt2);
    let idx_dict = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3,
    };
    try {
      let idx = 0;
      if (ans_list.length <= 1) {
        if (ans_list.length == 1 && idx_dict[ans_list[0][0]] != void 0) {
          idx = idx_dict[ans_list[0][0]];
          fTips("\u7B54\u6848:" + ans_list[0].slice(2));
        } else if (ans_list.length == 0) {
          fInfo("\u672A\u627E\u5230\u7B54\u6848");
        }
        if (duizhan_mode == 1) {
          if (delay > 0 && num != 1) {
            sleep(random(delay, delay + 50));
          } else {
            while (
              className("android.widget.ListView").findOne(1e3)
                .indexInParent() == 0
            ) {
            }
          }
          let is_click = className("android.widget.RadioButton").findOnce(idx)
            .parent().click();
          log(is_click);
          if (!is_click) {
            sleep(200);
            log(
              className("android.widget.RadioButton").findOnce(idx).parent()
                .click(),
            );
          }
          num++;
          continue;
        } else if (duizhan_mode == 2) {
          num++;
          textMatches(/第.+题|继续挑战/).waitFor();
          continue;
        }
      }
    } catch (e) {
      log("error1:", e);
    }
    try {
      while (
        className("android.widget.ListView").findOne(1e3).indexInParent() == 0
      ) {
      }
    } catch (e) {
      log("error2:", e);
      err_flag = false;
      sleep(200);
      continue;
    }
    let xuanxiang_list = className("android.widget.ListView").findOne(1e3);
    let xuanxiang_list_x = xuanxiang_list.bounds().left;
    let xuanxiang_list_y = xuanxiang_list.bounds().top;
    let xuanxiang_list_w = xuanxiang_list.bounds().width();
    let xuanxiang_list_h = xuanxiang_list.bounds().height();
    if (
      !xuanxiang_list || !xuanxiang_list.parent().childCount() ||
      !xuanxiang_list.parent().child(0)
    ) {
      log("xuan_box is null");
      err_flag = false;
      sleep(200);
      continue;
    }
    log("\u5F00\u59CB\u622A\u9009\u9879");
    console.time("\u9009\u9879\u8BC6\u522B");
    let img = captureScreen();
    img = images.clip(
      img,
      xuanxiang_list_x,
      xuanxiang_list_y,
      xuanxiang_list_w,
      xuanxiang_list_h,
    );
    let xuan_txt_list = [];
    let allx_txt = "";
    if (ocr_choice == 0) {
      let x_results = JSON.parse(
        JSON.stringify(gmlkit.ocr(img, "zh").toArray(3)),
      );
      allx_txt = ocr_rslt_to_txt(x_results).replace(/\s+/g, "");
    } else if (ocr_choice == 1) {
      let x_results = JSON.parse(JSON.stringify(paddle.ocr(img)));
      allx_txt = ocr_rslt_to_txt(x_results).replace(/\s+/g, "");
    } else {
      allx_txt = ocr.recognizeText(img);
    }
    console.timeEnd("\u9009\u9879\u8BC6\u522B");
    if (!allx_txt) {
      log(
        "\u8BC6\u522B\u4E0D\u51FA\u9009\u9879\u6587\u672C\uFF0C\u53EF\u80FD\u88AB\u7981\u6B62\u622A\u56FE",
      );
      className("android.widget.RadioButton").findOnce(random(0, radio_num - 1))
        .parent().click();
      err_flag = false;
      sleep(200);
      continue;
    }
    img.recycle();
    log("replace_sign:" + replace_sign);
    log("\u6E05\u6D17\u524D\uFF1A" + allx_txt);
    let replace_d = update_info[replace_sign];
    if (replace_sign == "include_ocr_replace") {
      let result = true;
      log("que_key:" + que_key);
      let [words, r, repl] = replace_d[que_key];
      for (let word of words) {
        let reg3 = new RegExp(word, "gi");
        if (!reg3.test(allx_txt)) {
          result = false;
          break;
        }
      }
      if (result) {
        let reg3 = new RegExp(r, "gi");
        allx_txt = allx_txt.replace(reg3, repl);
      }
    } else {
      for (let r of Object.keys(replace_d)) {
        let reg3 = new RegExp(r, "gi");
        allx_txt = allx_txt.replace(reg3, replace_d[r]);
      }
    }
    xuan_txt_list = allx_txt.match(
      /[a-d][^a-z\u4e00-\u9fa5\d]?\s*.*?(?=[a-d][^a-z\u4e00-\u9fa5\d]?|$)/gi,
    );
    if (!xuan_txt_list) {
      log("\u8BC6\u522B\u4E0D\u51FA\u9009\u9879");
      err_flag = false;
      sleep(200);
      continue;
    }
    if (xuan_txt_list && xuan_txt_list.length != radio_num) {
      xuan_txt_list = allx_txt.match(
        /[a-d][^a-z\u4e00-\u9fa5\d]\s*.*?(?=[a-d][^a-z\u4e00-\u9fa5\d]|$)/gi,
      );
    }
    log(xuan_txt_list.toString());
    if (xuan_txt_list.length != 0) {
      let max_simi = 0;
      let right_xuan = "";
      let right_xuan2 = "";
      let ans_txt = "";
      for (let xuan_txt of xuan_txt_list) {
        let txt = xuan_txt.replace(/^[A-Z]\.?/gi, "");
        for (let ans2 of ans_list) {
          let similar = str_similar(ans2.slice(2), txt);
          if (similar > max_simi) {
            max_simi = similar;
            ans_txt = ans2;
            if (duizhan_mode == 1) {
              right_xuan = ans2[0];
              right_xuan2 = xuan_txt[0].toUpperCase();
            } else {
              right_xuan2 = ans2[0];
              right_xuan = xuan_txt[0].toUpperCase();
            }
          }
        }
      }
      if (ans_list.length > 1) {
        fTips("\u5339\u914D\u7B54\u6848:" + ans_txt);
      }
      if (right_xuan != "" && duizhan_mode != 2) {
        let idx = idx_dict[right_xuan];
        fInfo("\u6700\u7EC8:" + right_xuan);
        try {
          className("android.widget.RadioButton").findOnce(idx).parent()
            .click();
        } catch (e) {
          idx = idx_dict[right_xuan2];
          fInfo("\u5907\u9009:" + right_xuan2);
          try {
            className("android.widget.RadioButton").findOnce(idx).parent()
              .click();
          } catch (e1) {
            log("error3:", e1);
            err_flag = false;
            sleep(200);
            continue;
          }
        }
      } else if (duizhan_mode == 2) {
        textMatches(/第.+题|继续挑战/).waitFor();
      } else {
        try {
          className("android.widget.RadioButton").findOnce().parent().click();
        } catch (e1) {
          log("error4:", e1);
          err_flag = false;
          sleep(200);
          continue;
        }
      }
    } else {
      fError(
        "\u672A\u8BC6\u522B\u51FA\u9009\u9879\uFF0C\u968F\u673A\u9009\u62E9",
      );
      className("android.widget.RadioButton").findOnce(random(0, radio_num - 1))
        .parent().click();
      err_flag = false;
      continue;
    }
    num++;
  }
}
function do_dingyue() {
  entry_jifen_project("\u8BA2\u9605");
  fSet("title", "\u8BA2\u9605\u2026");
  fClear();
  let tab1 = descContains("Tab").findOne(9e3);
  if (!tab1) {
    back();
    text("\u767B\u5F55").waitFor();
    return false;
  }
  let zuo1 = descContains("\u4E0A\u65B0").findOne(9e3);
  if (!zuo1) {
    back();
    text("\u767B\u5F55").waitFor();
    return false;
  }
  let tab_clt = descContains("Tab").untilFind();
  let total_click = 0;
  for (let tab of tab_clt) {
    tab.click();
    sleep(500);
    let zuo_clt = className("android.view.View").depth(14).findOne().children();
    for (let zuo of zuo_clt) {
      if (dingyue_dao) {
        zuo = zuo_clt[zuo_clt.length - 1];
      }
      zuo.click();
      sleep(500);
      className("android.view.View").depth(14).waitFor();
      let you_clt = className("android.view.View").depth(14).findOnce(1);
      let last_desc = "";
      while (you_clt) {
        let dingyue_clt = className("android.widget.ImageView").indexInParent(2)
          .untilFind();
        try {
          if (
            dingyue_clt[dingyue_clt.length - 1].parent().child(1).desc() ==
              last_desc
          ) {
            fClear();
            fInfo("\u5230\u5E95\u4E86");
            break;
          }
          last_desc = dingyue_clt[dingyue_clt.length - 1].parent().child(1)
            .desc();
        } catch (e) {
          log(e);
          continue;
        }
        let img = captureScreen();
        for (let dingyue2 of dingyue_clt) {
          if (dingyue2.bounds().bottom >= device_h) {
            continue;
          }
          try {
            var pot = findColorInRegion(
              img,
              "#E42417",
              dingyue2.bounds().left,
              dingyue2.bounds().top,
              dingyue2.bounds().width(),
              dingyue2.bounds().height(),
              30,
            );
          } catch (e) {
            console.error(dingyue2.bounds());
            console.error(dingyue2.parent().child(1).desc());
          }
          if (pot) {
            fInfo("\u627E\u5230\u4E00\u4E2A\u8BA2\u9605");
            sleep(1e3);
            let is_click = dingyue2.click();
            fInfo("\u70B9\u51FB\uFF1A" + is_click);
            sleep(1e3);
            total_click += 1;
          }
          if (total_click >= 2) {
            fInfo("\u8BA2\u9605\u5DF2\u5B8C\u6210");
            back();
            text("\u767B\u5F55").waitFor();
            ran_sleep();
            return true;
          }
        }
        let scr_result = you_clt.scrollForward();
        sleep(500);
      }
      if (dingyue_dao) {
        fInfo("\u53EA\u68C0\u67E5\u5E74\u5EA6\u4E0A\u65B0");
        break;
      }
    }
  }
  fInfo("\u65E0\u53EF\u8BA2\u9605\u9879\u76EE");
  back();
  text("\u767B\u5F55").waitFor();
  ran_sleep();
  return true;
}
function do_bendi() {
  entry_jifen_project("\u672C\u5730\u9891\u9053");
  fSet("title", "\u672C\u5730\u2026");
  fClear();
  text("\u5207\u6362\u5730\u533A").findOne(5e3);
  if (text("\u7ACB\u5373\u5207\u6362").exists()) {
    text("\u53D6\u6D88").findOne(3e3).click();
  }
  let banner = classNameContains("RecyclerView").findOne();
  let txt = banner.child(0).child(1).text();
  banner.child(0).click();
  className("android.widget.TextView").depth(11).text(txt).waitFor();
  sleep(1500);
  back();
  ran_sleep();
  jifen_init();
  ran_sleep();
  return true;
}
function do_exec(type) {
  let tishi = text("\u67E5\u770B\u63D0\u793A").findOne();
  tishi.click();
  ran_sleep();
  text("\u63D0\u793A").waitFor();
  if (textStartsWith("\u5355\u9009\u9898").exists()) {
    let que_txt2 = className("android.view.View").depth(24).findOnce(1).parent()
      .parent().child(1).text();
    var ans2 = get_ans_by_re(que_txt2);
    if (ans2 && depth(26).text(ans2).exists()) {
      depth(26).text(ans2).findOnce().parent().click();
    } else {
      if (type) {
        ans2 = get_ans_by_dati_tiku(que_txt2, type);
      } else {
        ans2 = get_ans_by_dati_tiku(que_txt2);
      }
      let reg3 = /[A-F]/;
      if (ans2 && reg3.test(ans2) && ans2.length == 1) {
        ans2 = ans2.match(reg3)[0];
        let idx_dict = {
          "A": 0,
          "B": 1,
          "C": 2,
          "D": 3,
          "E": 4,
          "F": 5,
        };
        className("android.widget.RadioButton").findOnce(idx_dict[ans2[0]])
          .parent().click();
      } else {
        if (!ans2) {
          ans2 = get_ans_by_ocr1().replace(/\s/g, "");
        }
        if (depth(26).text(ans2).exists()) {
          depth(26).text(ans2).findOne().parent().click();
        } else {
          let xuan_clt = className("android.widget.RadioButton").find();
          let max_simi = 0;
          let xuanxiang = null;
          for (let n of xuan_clt) {
            let similar = str_similar(ans2, n.parent().child(2).text());
            if (similar > max_simi) {
              max_simi = similar;
              xuanxiang = n.parent();
            }
          }
          if (xuanxiang) {
            xuanxiang.click();
          } else {
            className("android.widget.RadioButton").findOne().parent().click();
          }
        }
      }
    }
  } else if (textStartsWith("\u586B\u7A7A\u9898").exists()) {
    let que = className("android.view.View").depth(24).findOnce(1).parent()
      .parent().child(1).children();
    let text_edit = className("android.widget.EditText").findOne().parent()
      .children();
    let word_num = text_edit.find(className("android.view.View")).length;
    let kong_num = 0;
    let que_txt2 = "";
    for (let i of que) {
      if (i.text()) {
        que_txt2 = que_txt2 + i.text();
      } else {
        kong_num += 1;
        que_txt2 = que_txt2 + "    ";
      }
    }
    if (kong_num <= 1) {
      if (type) {
        ans2 = get_ans_by_dati_tiku(que_txt2, type);
      } else {
        ans2 = get_ans_by_dati_tiku(que_txt2);
      }
      if (!ans2) {
        ans2 = get_ans_by_re(que_txt2);
      }
      if (ans2 && word_num == ans2.length) {
        depth(25).className("android.widget.EditText").findOne().setText(ans2);
      } else {
        ans2 = get_ans_by_ocr1().replace(/\s/g, "");
        if (!ans2) {
          ans2 = "\u672A\u8BC6\u522B\u51FA\u6587\u5B57";
        }
        depth(25).className("android.widget.EditText").findOne().setText(ans2);
      }
    } else {
      if (type) {
        ans2 = get_ans_by_dati_tiku(que_txt2, type);
      } else {
        ans2 = get_ans_by_dati_tiku(que_txt2);
      }
      if (!ans2) {
        ans2 = get_ans_by_ocr1().replace(/\s/g, "");
      }
      if (!ans2) {
        ans2 = "\u672A\u8BC6\u522B\u51FA\u6587\u5B57";
      }
      edit_clt = className("android.widget.EditText").find();
      let ans_txt = ans2;
      for (let edit of edit_clt) {
        let n =
          edit.parent().children().find(className("android.view.View")).length;
        edit.setText(ans_txt.slice(0, n));
        ans_txt = ans_txt.slice(n);
      }
    }
  } else if (textStartsWith("\u591A\u9009\u9898").exists()) {
    let que_txt2 = className("android.view.View").depth(24).findOnce(1).parent()
      .parent().child(1).text();
    let reg12 = /\s{3,}/g;
    let res3 = que_txt2.match(reg12);
    let collect = className("android.widget.CheckBox").find();
    if (res3.length == collect.length) {
      ans2 = "\u5168\u9009";
      for (let n of collect) {
        n.parent().click();
      }
    } else {
      if (type) {
        ans2 = get_ans_by_dati_tiku(que_txt2, type);
      } else {
        ans2 = get_ans_by_dati_tiku(que_txt2);
      }
      let reg3 = /[A-F]{1,6}/;
      if (ans2 && reg3.test(ans2)) {
        ans2 = ans2.match(reg3)[0];
        let idx_dict = {
          "A": 0,
          "B": 1,
          "C": 2,
          "D": 3,
          "E": 4,
          "F": 5,
        };
        for (let n of ans2) {
          className("android.widget.CheckBox").findOnce(idx_dict[n]).parent()
            .click();
        }
      } else {
        ans2 = get_ans_by_ocr1();
        ans2 = ans2.replace(/[^\u4e00-\u9fa5\w]/g, "");
        log(ans2);
        for (let n of collect) {
          let xuan_txt = n.parent().child(2).text().replace(
            /[^\u4e00-\u9fa5\w]/g,
            "",
          );
          if (ans2.indexOf(xuan_txt) >= 0) {
            n.parent().click();
          }
        }
      }
    }
  }
  fInfo("\u7B54\u6848\uFF1A" + ans2);
  back();
  sleep(1e3);
  return true;
}
function get_ans_by_re(que_txt) {
  let reg1 = /([^，。？、；：” ]*?)\s{3,}([^，。？、；：” ]*)/;
  let res = que_txt.match(reg1);
  if (res == null) {
    console.error("get_ans_by_re: \u5339\u914D\u5931\u8D25");
    return "";
  }
  if (res[1] == "" && res[2] == "") {
    reg1 =
      /([^，。？、；：” ]*?[，。？、；：” ]*?)\s{3,}([，。？、；：” ]*?[^，。？、；：” ]*)/;
    res = que_txt.match(reg1);
  }
  if (res == null) {
    console.error("get_ans_by_re: \u5339\u914D\u5931\u8D25");
    return "";
  }
  let reg2_str = "/" + res[1] +
    "([^\uFF0C\u3002\uFF1F\u3001\uFF1B\uFF1A\u201D ]*)" + res[2] + "/";
  let reg2 = eval(reg2_str);
  let tishi_txt = text("\u63D0\u793A").findOne().parent().parent().child(1)
    .child(0).text();
  let res2 = tishi_txt.match(reg2);
  if (res2) {
    let ans2 = res2[1];
    log(ans2);
    return ans2;
  } else {
    return "";
  }
}
function get_ans_by_ocr1() {
  fRefocus();
  let tishi_box = text("\u63D0\u793A").findOne().parent().parent().child(1)
    .child(0).bounds();
  fInfo("\u5F00\u59CB\u622A\u5C4F");
  let img = captureScreen();
  img = images.clip(
    img,
    tishi_box.left - 10,
    tishi_box.top - 10,
    tishi_box.width() + 20,
    tishi_box.height(),
  );
  img = images.interval(img, "#FD1111", 120);
  let ans2 = "";
  if (ocr_choice == 0) {
    ans2 = google_ocr_api(img);
  } else if (ocr_choice == 1) {
    ans2 = paddle_ocr_api(img);
  } else {
    ans2 = ocr.recognizeText(img);
  }
  if (!ans2) {
    fInfo("\u672A\u8BC6\u522B\u51FA\u6587\u5B57");
  } else {
    log(ans2);
  }
  img.recycle();
  return ans2;
}
function get_ans_by_http(que_txt2) {
  let reg3 = /[\u4e00-\u9fa5\d]+/g;
  let res3 = que_txt2.match(reg3);
  if (res3 == null) {
    return [];
  }
  let longest = "";
  for (let r of res3) {
    if (
      r.length > longest.length &&
      r.indexOf("\u4E2D\u534E\u4EBA\u6C11\u5171\u548C") < 0 &&
      r.indexOf("\u4E60\u8FD1\u5E73\u603B\u4E66\u8BB0") < 0
    ) {
      longest = r;
    }
  }
  let keyword = longest.slice(0, 6);
  log(keyword);
  let req = http.get(
    "http://www.syiban.com/search/index/init.html?modelid=1&q=" +
      encodeURI(keyword),
  );
  let resp_str = req.body.string();
  let resp_list = resp_str.match(/答案：(.*?)<\/span><\/p>/g);
  let ans_list = [];
  if (resp_list != null) {
    for (let a of resp_list) {
      ans = a.match(/答案：(.*?)<\/span><\/p>/)[1].replace(
        /[\u200B-\u200D\uFEFF]/g,
        "",
      );
      ans_list.push(ans);
    }
  }
  return ans_list;
}
function get_ans_by_dati_tiku(que_txt2, type) {
  let keyword = que_txt2.replace(/\s/g, "");
  let ans_list = [];
  let ans2 = null;
  if (dati_tiku.length == 0) {
    return false;
  }
  for (let i = dati_tiku.length - 1; i >= 0; i--) {
    let ti = dati_tiku[i];
    if (ti[0].indexOf(keyword) > -1) {
      ans2 = ti[1];
      if (ans2 != "None") {
        ans_list.push(ans2);
      }
    }
  }
  if (!ans_list) {
    return false;
  }
  if (type) {
    for (let a of ans_list) {
      if (a.indexOf(type) > -1) {
        ans2 = a.replace(type, "");
        break;
      }
    }
  }
  log("\u5339\u914D\u9898\u5E93\uFF1A", ans2);
  return ans2;
}
function update_dati_tiku() {
  let total = 1;
  let last_dati_tiku_link = storage.get("dati_tiku_link", "");
  let dati_tiku2 = storage.get("dati_tiku", []);
  try {
    if (update_info["dati_tiku_link"] != last_dati_tiku_link) {
      try {
        dati_tiku2 = get_tiku_by_http(update_info["dati_tiku_link"]);
      } catch (e) {
        dati_tiku2 = get_tiku_by_http(update_info["dati_tiku_link2"]);
      }
      storage.put("dati_tiku_link", update_info["dati_tiku_link"]);
      storage.put("dati_tiku", dati_tiku2);
      fInfo("\u5DF2\u66F4\u65B0\u79BB\u7EBF\u9898\u5E93");
    } else {
      fInfo(
        "\u672A\u68C0\u6D4B\u5230\u9898\u5E93\u66F4\u65B0\uFF0C\u5DF2\u7528\u5386\u53F2\u9898\u5E93",
      );
    }
    return dati_tiku2;
  } catch (e) {
    console.warn(e);
    if (dati_tiku2) {
      fInfo(
        "\u672A\u8BC6\u522B\u51FA\u79BB\u7EBF\u9898\u5E93\uFF0C\u5DF2\u7528\u5386\u53F2\u9898\u5E93",
      );
      return dati_tiku2;
    }
  }
  if (!dati_tiku2 || dati_tiku2.length != total) {
    let req = http.get("https://tiku.3141314.xyz/getAnswer");
    if (req.statusCode == 200) {
      dati_tiku2 = req.body.json();
      storage.put("dati_tiku", dati_tiku2);
      fInfo("\u9898\u5E93\u5DF2\u66F4\u65B0");
    } else {
      fInfo(
        "\u7F51\u7EDC\u95EE\u9898\u8BC6\u522B\u4E0D\u51FA\u5728\u7EBF\u9898\u5E93",
      );
    }
  }
  return dati_tiku2;
}
function upload_wrong_exec(endstr) {
  text("\u7B54\u6848\u89E3\u6790").waitFor();
  let que_txt2 = "";
  if (textStartsWith("\u586B\u7A7A\u9898").exists()) {
    let que = className("android.view.View").depth(24).findOnce(1).parent()
      .parent().child(1).children();
    for (let i of que) {
      if (i.text()) {
        que_txt2 = que_txt2 + i.text();
      } else {
        que_txt2 = que_txt2 + "    ";
      }
    }
  } else {
    que_txt2 = className("android.view.View").depth(24).findOnce(1).parent()
      .parent().child(1).text();
  }
  let ans_txt = textStartsWith("\u6B63\u786E\u7B54\u6848\uFF1A").findOne()
    .text().replace(
      /正确答案：|\s+/g,
      "",
    );
  let question = que_txt2.replace(/\s/g, "");
  if (endstr) {
    ans_txt += endstr;
  }
  fError("\u9519\u9898:" + question + ans_txt);
  dati_tiku.push([question, ans_txt, null, null, null]);
}
function get_ans_by_tiku(que_txt2) {
  let ans_list = [];
  let max_simi = 0;
  for (let ti of Object.keys(tiku)) {
    let ti_txt = ti.replace(/\[.+\]|^\d+\./g, "").replace(
      /[^\u4e00-\u9fa5\d]/g,
      "",
    );
    let len = que_txt2.length;
    let simi = str_similar(ti_txt.slice(0, len), que_txt2);
    if (simi >= 0.25) {
      if (simi > max_simi) {
        ans_list.length = 0;
        ans_list.push(tiku[Number(ti)][1]);
        max_simi = simi;
      } else if (simi == max_simi) {
        ans_list.push(tiku[Number(ti)][1]);
      }
    }
  }
  return ans_list;
}
function get_tiku_by_http(link) {
  if (!link) {
    link =
      "https://mart-17684809426.coding.net/p/tiku/d/tiku/git/raw/master/tiku_json.txt";
  }
  let req = http.get(link, {
    headers: {
      "Accept-Language": "zh-cn,zh;q=0.5",
      "User-Agent": random(0, 17),
    },
  });
  log(req.statusCode);
  if (req.statusCode != 200) {
    throw "\u7F51\u7EDC\u539F\u56E0\u672A\u83B7\u53D6\u5230\u9898\u5E93\uFF0C\u8BF7\u5C1D\u8BD5\u5207\u6362\u6D41\u91CF\u6216\u8005\u66F4\u6362114DNS\uFF0C\u9000\u51FA\u811A\u672C";
  }
  return req.body.json();
}
function get_tiku_by_ct(link) {
  if (!link) {
    link =
      "https://webapi.ctfile.com/get_file_url.php?uid=35157972&fid=546999609&file_chk=e83f4b72a2f142cca6ee87c64baba15c&app=0&acheck=2&rd=0.9023931062078081";
  }
  let req = http.get(link);
  let result = req.body.json();
  let file = http.get(result["downurl"]);
  return file.body.json();
}
function ocr_rslt_to_txt(result) {
  let top = 0;
  let previous_left = 0;
  let txt = "";
  let txt_list = [];
  for (let idx in result) {
    if (top == 0) {
      top = result[idx].bounds.top;
    }
    if (previous_left == 0) {
      previous_left = result[idx].bounds.left;
    }
    if (
      result[idx].bounds.top >= top - 10 && result[idx].bounds.top <= top + 10
    ) {
      if (result[idx].bounds.left > previous_left) {
        txt = txt + "   " + result[idx].text;
      } else {
        txt = result[idx].text + "   " + txt;
      }
    } else {
      top = result[idx].bounds.top;
      txt_list.push(txt);
      txt = result[idx].text;
    }
    if (idx == result.length - 1) {
      txt_list.push(txt);
    }
    previous_left = result[idx].bounds.left;
  }
  let ans2 = txt_list.join("\n");
  return ans2;
}
function restart(restart_flag) {
  ran_sleep();
  back();
  text("\u9000\u51FA").findOne().click();
  ran_sleep();
  switch (restart_flag) {
    case 0:
      text("\u767B\u5F55").waitFor();
      entry_jifen_project("\u6BCF\u65E5\u7B54\u9898");
      break;
    case 1:
      text("\u672C\u6708").waitFor();
      while (!text("\u5DF2\u4F5C\u7B54").exists()) {
        depth(21).scrollable().findOne().scrollForward();
        sleep(200);
      }
      var clt = text("\u672A\u4F5C\u7B54").find();
      clt[clt.length - 1].parent().click();
      break;
  }
}
function jifen_init() {
  for (
    id("comm_head_xuexi_score").findOne().click();
    !className("android.view.View").text("\u767B\u5F55").findOne(9e3);
  ) {
    back(), sleep(1e3), id("comm_head_xuexi_score").findOne().click();
  }
  fRefocus();
  text("\u767B\u5F55").waitFor();
  className("android.webkit.WebView").scrollable().findOne().scrollForward();
}
function ran_sleep() {
  return sleep(random(1e3, delay_time));
}
function str_similar(str1, str2) {
  str1 = str1.replace(
    /[^\u4e00-\u9fa5\u2460-\u2469\wāáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜ]/g,
    "",
  );
  str2 = str2.replace(
    /[^\u4e00-\u9fa5\u2460-\u2469\wāáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜ]/g,
    "",
  );
  if (str1 == str2) {
    return 99;
  }
  if (str1.length > str2.length) {
    var muzi = str2;
    var instr = str1;
  } else {
    muzi = str1;
    instr = str2;
  }
  let reg = "/[" + muzi + "]{1}/g";
  let resu = instr.match(eval(reg));
  if (resu) {
    return resu.length / instr.length;
  } else {
    return 0;
  }
}
function close_video() {
  let imv = className("android.widget.ImageView").find();
  let swtch = imv[imv.length - 1];
  swtch.click();
  sleep(1e3);
  swtch.click();
  return true;
}
function init_wh() {
  fInfo("\u5C4F\u5E55\u65B9\u5411\u68C0\u6D4B");
  log(device.width + "*" + device.height);
  var device_w2 = depth(0).findOne().bounds().width();
  var device_h2 = depth(0).findOne().bounds().height();
  log(device_w2 + "*" + device_h2);
  if (device.width == device_h2 && device.height == device_w2) {
    fError(
      "\u8BBE\u5907\u5C4F\u5E55\u65B9\u5411\u68C0\u6D4B\u4E3A\u6A2A\u5411\uFF0C\u540E\u7EED\u8FD0\u884C\u5F88\u53EF\u80FD\u4F1A\u62A5\u9519\uFF0C\u5EFA\u8BAE\u8C03\u6574\u540E\u91CD\u65B0\u8FD0\u884C\u811A\u672C",
    );
    sleep(1e4);
  } else if (device.width == 0 || device.height == 0) {
    fError(
      "\u8BC6\u522B\u4E0D\u51FA\u8BBE\u5907\u5BBD\u9AD8\uFF0C\u5EFA\u8BAE\u91CD\u542F\u5F3A\u56FD\u52A9\u624B\u540E\u91CD\u65B0\u8FD0\u884C\u811A\u672C",
    );
    sleep(1e4);
  }
  return [device_w2, device_h2];
}
function real_click(obj) {
  for (let i = 1; i <= 3; i++) {
    if (obj.click()) {
      log("real click: true");
      return true;
    }
    sleep(300);
  }
  console.warn("\u63A7\u4EF6\u65E0\u6CD5\u6B63\u5E38\u70B9\u51FB\uFF1A", obj);
  log("\u5C1D\u8BD5\u518D\u6B21\u70B9\u51FB");
  click(obj.bounds().centerX(), obj.bounds().centerY());
  return false;
}
function send_pushplus(token, sign_list) {
  zongfen = "old" == jifen_flag
    ? text("\u6210\u957F\u603B\u79EF\u5206").findOne().parent().child(3).text()
    : text("\u6210\u957F\u603B\u79EF\u5206").findOne().parent().child(1).text();
  jinri = jifen_list.parent().child(1).text().replace(" ", "").replace(
    "\u7D2F\u79EF",
    "\u7D2F\u79EF:",
  );
  let style_str =
    "<style>.item{height:1.5em;line-height:1.5em;}.item span{display:inline-block;padding-left:0.4em;}.item .bar{width:100px;height:10px;background-color:#ddd;border-radius:5px;display:inline-block;}.item .bar div{height:10px;background-color:#ed4e45;border-radius:5px;}</style>";
  let content_str = "<h6>" + jinri + " \u603B\u79EF\u5206:" + zongfen +
    "</h6><div>";
  jinri.match(/\d+/g) ||
    (content_str +=
      "\u7531\u4E8E\u7F51\u7EDC\u539F\u56E0\uFF0C\u672A\u8BC6\u522B\u51FA\u603B\u5206\uFF0C\u8BF7\u81EA\u884C\u67E5\u770B");
  for (let sign of sign_list) {
    if (sign == "ocr_false") {
      content_str =
        "\u7531\u4E8Eocr\u8FC7\u6162\uFF0C\u5DF2\u8DF3\u8FC7\u591A\u4EBA\u5BF9\u6218" +
        content_str;
    }
  }
  for (let option of jifen_list.children()) {
    if ("old" == jifen_flag) {
      var title = option.child(0).child(0).text(),
        score = option.child(2).text().match(/\d+/g)[0],
        total = option.child(2).text().match(/\d+/g)[1];
    } else {
      "new1" == jifen_flag
        ? (title = option.child(0).text(),
          score = option.child(3).child(0).text(),
          total = option.child(3).child(2).text().match(/\d+/g)[0])
        : "new2" == jifen_flag &&
          (title = option.child(0).text(),
            score = option.child(3).text().match(/\d+/g)[0],
            total = option.child(3).text().match(/\d+/g)[1]);
    }
    "\u4E13\u9879\u7B54\u9898" == title && (total = 10);
    let percent = (Number(score) / Number(total) * 100).toFixed() + "%";
    let detail = title + ": " + score + "/" + total;
    content_str += '<div class="item"><div class="bar"><div style="width: ' +
      percent + ';"></div></div><span>' + detail + "</span></div>";
  }
  content_str += "</div>" + style_str;
  let r = http.postJson("http://www.pushplus.plus/send", {
    token,
    title: "\u5929\u5929\u5411\u4E0A\uFF1A" + name,
    content: content_str +
      "</div><style>.item{height:1.5em;line-height:1.5em;}.item span{display:inline-block;padding-left:0.4em;}.item .bar{width:100px;height:10px;background-color:#ddd;border-radius:5px;display:inline-block;}.item .bar div{height:10px;background-color:#ed4e45;border-radius:5px;}</style>",
    template: "markdown",
  });
  if (r.body.json()["code"] == 200) {
    fInfo("\u63A8\u9001\u6210\u529F");
  } else {
    log(r.body.json());
  }
}
function exit_app(name2) {
  fInfo("\u5C1D\u8BD5\u7ED3\u675F" + name2 + "APP");
  var packageName = getPackageName(name2);
  if (!packageName) {
    if (getAppName(name2)) {
      packageName = name2;
    } else {
      return false;
    }
  }
  log("\u6253\u5F00\u5E94\u7528\u8BBE\u7F6E\u754C\u9762");
  app.openAppSetting(packageName);
  var appName = app.getAppName(packageName);
  log("\u7B49\u5F85\u52A0\u8F7D\u754C\u9762");
  text(appName).findOne(5e3);
  sleep(1500);
  log("\u67E5\u627E\u7ED3\u675F\u6309\u94AE");
  let stop = textMatches(
    /(强.停止$|.*停止$|结束运行|停止运行|[Ff][Oo][Rr][Cc][Ee] [Ss][Tt][Oo][Pp])/,
  ).findOne();
  log("stop:", stop.enabled());
  if (stop.enabled()) {
    real_click(stop);
    sleep(1e3);
    log("\u7B49\u5F85\u786E\u8BA4\u5F39\u6846");
    let sure = textMatches(
      /(确定|.*停止.*|[Ff][Oo][Rr][Cc][Ee] [Ss][Tt][Oo][Pp]|O[Kk])/,
    ).clickable().findOne(1500);
    if (!sure) {
      fInfo(appName + "\u5E94\u7528\u5DF2\u5173\u95ED");
      back();
      return false;
    }
    log("sure click:", sure.click());
    fInfo(appName + "\u5E94\u7528\u5DF2\u88AB\u5173\u95ED");
    sleep(1e3);
    back();
  } else {
    fInfo(
      appName +
        "\u5E94\u7528\u4E0D\u80FD\u88AB\u6B63\u5E38\u5173\u95ED\u6216\u4E0D\u5728\u540E\u53F0\u8FD0\u884C",
    );
    sleep(1e3);
    back();
  }
  return true;
}
function login(username, pwd) {
  var begin_obj = idMatches(/.*comm_head_xuexi_mine|.*btn_next/).findOne();
  if (begin_obj.text() == "\u767B\u5F55") {
    log("\u67E5\u627Eab");
    let a = className("EditText").id("et_phone_input").findOne();
    let b = className("EditText").id("et_pwd_login").findOne();
    a.setText(username);
    sleep(1e3);
    b.setText(pwd);
    sleep(1e3);
    begin_obj.click();
    sleep(3e3);
    let packageName = getPackageName("\u5B66\u4E60\u5F3A\u56FD");
    if (currentPackage() != packageName) {
      log("\u68C0\u6D4B\u5230\u5F39\u7A97\uFF0C\u5C1D\u8BD5\u8FD4\u56DE");
      if (textMatches(/取消/).exists()) {
        textMatches(/取消/).findOne().click();
      } else {
        back();
      }
    }
  }
}
function refind_jifen() {
  className("android.webkit.WebView").scrollable().findOne().scrollForward();
  var a = className("android.widget.ListView").filter(function (b) {
    return 8 < b.rowCount();
  }).findOne();
  21 == a.depth()
    ? (jifen_flag = "old", fInfo("\u68C0\u6D4B\u4E3A\u65E7\u7248\u754C\u9762"))
    : 23 == a.depth() &&
      (jifen_flag = 0 < a.child(0).child(3).childCount() ? "new1" : "new2",
        fInfo("\u68C0\u6D4B\u4E3A\u65B0\u7248\u754C\u9762"));
  return a;
}
function entry_jifen_project(a) {
  var b = "old" == jifen_flag ? 3 : 4;
  jifen_list.findOne(textEndsWith(a)).parent().child(b).click();
}
function winReshow() {
  for (let i = 0; i < 4; i++) {
    recents();
    sleep(1e3);
  }
}
function noverify() {
  return threads.start(function () {
    for (;;) {
      fClear();
      if (Number(slide_verify)) {
        var a = Number(slide_verify);
      } else {
        fInfo("\u672A\u5F00\u542F\u9707\u52A8\u63D0\u9192");
        break;
      }
      textContains("\u8BBF\u95EE\u5F02\u5E38").waitFor();
      fInfo(
        "\u68C0\u6D4B\u5230\u6ED1\u52A8\u9A8C\u8BC1\uFF0C\u8BF7\u5C3D\u5FEB\u6ED1\u52A8",
      );
      device.vibrate(a);
      textContains("\u5237\u65B0").exists()
        ? click("\u5237\u65B0")
        : textContains("\u7F51\u7EDC\u5F00\u5C0F\u5DEE").exists()
        ? click("\u786E\u5B9A")
        : sleep(1e3);
    }
  });
}
function fInit() {
  var w2 = floaty.rawWindow(
    ` <card cardCornerRadius="8dp" alpha="0.8"><vertical><horizontal bg="#FF000000" padding="10 5"><text id="version" textColor="#FFFFFF" textSize="18dip">
            天天向上+
          </text><text
            id="title"
            h="*"
            textColor="#FFFFFF"
            textSize="13dip"
            layout_weight="1"
            gravity="top|right"
          /></horizontal><ScrollView><vertical
            bg="#AA000000"
            id="container"
            minHeight="20"
            gravity="center"
          /></ScrollView></vertical><relative gravity="right|bottom"><text id="username" textColor="#FFFFFF" textSize="12dip" padding="5 0" /></relative></card>
        `,
  );
  ui.run(function () {
    w2.version.setText("\u5929\u5929\u5411\u4E0A+" + newest_version);
  });
  w2.setSize(720, -2);
  w2.setPosition(10, 10);
  w2.setTouchable(false);
  return w2;
}
function fSet(id2, txt) {
  ui.run(function () {
    w.findView(id2).setText(txt);
  });
}
function fInfo(str) {
  ui.run(function () {
    let textView = ui.inflate(
      `<text
        id="info"
        maxLines="2"
        textColor="#7CFC00"
        textSize="15dip"
        padding="5 0"
      />`,
      w.container,
    );
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.info(str);
}
function fError(str) {
  ui.run(function () {
    let textView = ui.inflate(
      `<text
        id="error"
        maxLines="2"
        textColor="#FF0000"
        textSize="15dip"
        padding="5 0"
      />`,
      w.container,
    );
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.error(str);
}
function fTips(str) {
  ui.run(function () {
    let textView = ui.inflate(
      `<text
        id="tips"
        maxLines="2"
        textColor="#FFFF00"
        textSize="15dip"
        padding="5 0"
      />`,
      w.container,
    );
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.info(str);
}
function fClear() {
  ui.run(function () {
    w.container.removeAllViews();
  });
}
function fRefocus() {
  threads.start(function () {
    ui.run(function () {
      w.requestFocus();
      w.title.requestFocus();
      ui.post(function () {
        w.title.clearFocus();
        w.disableFocus();
      }, 200);
    });
  });
  sleep(500);
}
function xxqg(userinfo) {
  let sign_list = [];
  fInfo("\u5F00\u59CB\u66F4\u65B0\u5F39\u7A97\u68C0\u6D4B");
  let noupdate_thread = threads.start(function () {
    className("android.widget.Button").text("\u7ACB\u5373\u5347\u7EA7")
      .waitFor();
    fInfo("\u68C0\u6D4B\u5230\u5347\u7EA7\u5F39\u7A97");
    sleep(1e3);
    var btn = className("android.widget.Button").text("\u53D6\u6D88").findOne();
    btn.click();
    fInfo("\u5DF2\u53D6\u6D88\u5347\u7EA7");
  });
  fInfo("\u5F00\u59CB\u6D88\u606F\u901A\u77E5\u5F39\u7A97\u68C0\u6D4B");
  let nonotice_thread = threads.start(function () {
    className("android.widget.Button").text("\u53BB\u5F00\u542F").waitFor();
    fInfo("\u68C0\u6D4B\u5230\u6D88\u606F\u901A\u77E5\u5F39\u7A97");
    sleep(1e3);
    var btn = className("android.widget.Button").text("\u53D6\u6D88").findOne();
    btn.click();
    fInfo("\u5DF2\u53D6\u6D88\u6D88\u606F\u901A\u77E5");
  });
  let username, pwd, token;
  if (userinfo) {
    [username, pwd, token] = userinfo;
    login(username, pwd);
    storage_user = storages.create("songgedodo:" + username);
    name = username.substr(0, 3) + "****" + username.substr(-4);
  } else {
    name = "";
    storage_user = storage;
  }
  fSet("username", name);
  ran_sleep();
  if (meizhou == 1) {
    meizhou_dao = false;
  } else if (meizhou == 0) {
    meizhou_dao = true;
  }
  if (zhuanxiang == 1) {
    zhuanxiang_dao = false;
  } else if (zhuanxiang == 0) {
    zhuanxiang_dao = true;
  }
  if (dingyue == 1) {
    dingyue_dao = false;
  } else if (dingyue == 2) {
    dingyue_dao = true;
  }
  id("comm_head_xuexi_score").findOne().click();
  text("\u767B\u5F55").waitFor();
  jifen_list = refind_jifen();
  nolocate_thread.isAlive() &&
    (nolocate_thread.interrupt(),
      fInfo("\u7EC8\u6B62\u4F4D\u7F6E\u6743\u9650\u5F39\u7A97\u68C0\u6D4B"));
  noupdate_thread.isAlive() &&
    (noupdate_thread.interrupt(),
      fInfo("\u7EC8\u6B62\u66F4\u65B0\u5F39\u7A97\u68C0\u6D4B"));
  nonotice_thread.isAlive() &&
    (nonotice_thread.interrupt(),
      fInfo("\u7EC8\u6B62\u6D88\u606F\u901A\u77E5\u68C0\u6D4B"));
  if (
    true == pinglun &&
      ("old" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8BC4\u8BBA"]).child(2).text().match(
            /\d+/,
          )[0]) ||
    "new1" == jifen_flag &&
      "0" ==
        jifen_list.child(jifen_map["\u8BC4\u8BBA"]).child(3).child(0).text() ||
    "new2" == jifen_flag &&
      "0" ==
        jifen_list.child(jifen_map["\u8BC4\u8BBA"]).child(3).text().match(
          /\d+/,
        )[0]
  ) {
    toastLog("\u5F00\u59CB\u8BC4\u8BBA");
    do_pinglun();
    jifen_list = refind_jifen();
  }
  if (
    true == shipin && test ||
    "old" == jifen_flag &&
      "\u5DF2\u5B8C\u6210" !=
        jifen_list.child(jifen_map["\u89C6\u9891"]).child(3).text() ||
    "old" != jifen_flag &&
      "\u5DF2\u5B8C\u6210" !=
        jifen_list.child(jifen_map["\u89C6\u9891"]).child(4).text()
  ) {
    console.verbose("\u65E0\u969C\u788D\u670D\u52A1\uFF1A" + auto.service);
    toastLog("\u5F00\u59CB\u89C6\u542C\u6B21\u6570");
    do_shipin();
    jifen_list = refind_jifen();
  }
  true == meiri &&
    ("old" == jifen_flag && test ||
      "\u5DF2\u5B8C\u6210" !=
        jifen_list.child(jifen_map["\u6BCF\u65E5"]).child(3).text() ||
      "old" != jifen_flag &&
        "\u5DF2\u5B8C\u6210" !=
          jifen_list.child(jifen_map["\u6BCF\u65E5"]).child(4).text()) &&
    (toastLog("\u6BCF\u65E5\u7B54\u9898\u5F00\u59CB"),
      do_meiri(),
      jifen_list = refind_jifen());
  function qwdt() {
    if (
      test ||
      "old" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8DA3\u5473\u7B54\u9898"]).child(2)
            .text().match(
              /\d+/,
            )[0] ||
      "new1" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8DA3\u5473\u7B54\u9898"]).child(3)
            .child(0).text() ||
      "new2" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8DA3\u5473\u7B54\u9898"]).child(3)
            .text().match(
              /\d+/,
            )[0]
    ) {
    } else {
      return;
    }
    entry_jifen_project("\u8DA3\u5473\u7B54\u9898");
    sleep(1e3);
    toastLog("\u5F00\u59CB\u8DA3\u5473\u7B54\u9898");
    for (let index = 0; index < 10; index++) {
      if (
        text("\u968F\u673A\u5339\u914D").exists() &&
        text("\u5F00\u59CB\u5BF9\u6218").exists()
      ) {
        if (true == shuangren) {
          toastLog("\u53CC\u4EBA\u5BF9\u6218\u5F00\u59CB");
          do_duizhan(2);
          jifen_list = refind_jifen();
          return;
        }
      }
      if (text("\u5F00\u59CB\u6BD4\u8D5B").exists()) {
        if (true == shuangren) {
          toastLog("\u56DB\u4EBA\u8D5B\u5F00\u59CB");
          guaji && do_duizhan(0);
          do_duizhan(4);
          jifen_list = refind_jifen();
          return;
        }
      }
      if (true == tiaozhan && text("\u6311\u6218\u7B54\u9898").exists()) {
        toastLog("\u6311\u6218\u7B54\u9898\u5F00\u59CB");
        do_tiaozhan();
        jifen_list = refind_jifen();
        return;
      }
      toastLog("\u8DA3\u5473\u7B54\u9898\u5931\u8D25");
    }
  }
  qwdt();
  if (true == wenzhang) {
    if (
      test ||
      "old" == jifen_flag &&
        "\u5DF2\u5B8C\u6210" !=
          jifen_list.child(jifen_map["\u6587\u7AE0"]).child(3).text() ||
      "old" != jifen_flag &&
        "\u5DF2\u5B8C\u6210" !=
          jifen_list.child(jifen_map["\u6587\u7AE0"]).child(4).text()
    ) {
      console.verbose("\u65E0\u969C\u788D\u670D\u52A1\uFF1A" + auto.service);
      toastLog("\u5F00\u59CB\u6587\u7AE0\u6B21\u6570\u4E0E\u65F6\u957F");
      do_wenzhang();
      jifen_list = refind_jifen();
    }
  }
  if (test || true == bendi) {
    if (
      "old" == jifen_flag &&
        "\u5DF2\u5B8C\u6210" !=
          jifen_list.child(jifen_map["\u672C\u5730"]).child(3).text() ||
      "old" != jifen_flag &&
        "\u5DF2\u5B8C\u6210" !=
          jifen_list.child(jifen_map["\u672C\u5730"]).child(4).text()
    ) {
      toastLog("\u672C\u5730\u5F00\u59CB");
      do_bendi();
      jifen_list = refind_jifen();
    }
  }
  let d;
  if (test || 0 != dingyue) {
    if (
      "old" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8BA2\u9605"]).child(2).text().match(
            /\d+/,
          )[0] ||
      "old" != jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8BA2\u9605"]).child(3).child(0)
            .text() ||
      "new1" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8BA2\u9605"]).child(3).child(0)
            .text() ||
      "new2" == jifen_flag &&
        "0" ==
          jifen_list.child(jifen_map["\u8BA2\u9605"]).child(3).text().match(
            /\d+/,
          )[0]
    ) {
      toastLog("\u8BA2\u9605\u5F00\u59CB");
      d = do_dingyue();
      jifen_list = refind_jifen();
    }
  }
  if (pushplus || token) {
    fInfo("\u63A8\u9001\u524D\u7B49\u5F85\u79EF\u5206\u5237\u65B05\u79D2");
    sleep(5e3);
    token || (token = pushplus);
    try {
      send_pushplus(token, sign_list);
    } catch (h) {
      fError(
        h +
          ":push+\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u5C1D\u8BD5\u5207\u6362\u6D41\u91CF\u8FD0\u884C\u6216\u8005\u8BBE\u7F6E114DNS",
      );
    }
  }
  back();
  let b0 = true;
  if (2 != meizhou) {
    if (
      toastLog("\u6BCF\u5468\u7B54\u9898\u5F00\u59CB"),
        text("\u6211\u7684").findOne().click(),
        sleep(1e3),
        text("\u6211\u8981\u7B54\u9898").findOne(3e3)
    ) {
      text("\u6211\u8981\u7B54\u9898").findOne().parent().click();
      sleep(1e3);
      for (b0 = do_meizhou(); !b0;) {
        b0 = do_meizhou();
      }
      text("\u6211\u7684").waitFor();
      b0 ||
        fError(
          "\u6BCF\u5468\u7B54\u9898\u53EF\u80FD\u7531\u4E8E\u8BC6\u522B\u9519\u8BEF\u3001\u5305\u542B\u89C6\u9891\u9898\u800C\u4E0D\u80FD\u6EE1\u5206\uFF0C\u8BF7\u624B\u52A8\u4F5C\u7B54",
        );
    } else {
      fError(
        "V2.42\u53CA\u4EE5\u4E0A\u4E0D\u652F\u6301\u6BCF\u5468\u7B54\u9898",
      ),
        back(),
        ran_sleep();
    }
  }
  0 == dingyue || d ||
    fError(
      "\u672A\u80FD\u8BC6\u522B\u51FA\u8BA2\u9605\u754C\u9762\uFF0C\u8BA2\u9605\u4E0D\u652F\u6301\u5B66\u4E60\u5F3A\u56FDV2.33.0\u4EE5\u4E0A\u7248\u672C",
    );
  if (!zhanghao) {
    return true;
  }
  let b = text("\u6211\u7684").findOne();
  log("mine:", b);
  b.click();
  log("\u7B49\u5F85\u8BBE\u7F6E\u6309\u94AE");
  let e;
  if (e = id("my_setting").findOne(3e3)) {
    sleep(1e3), log("\u70B9\u51FB\u8BBE\u7F6E\u6309\u94AE"), real_click(e);
  } else {
    swipe(device_w / 2, 0.8 * device_h, device_w / 2, 0.1 * device_h, 1e3);
    fInfo("minebounds: " + b.bounds());
    sleep(6e3);
    let c;
    do e = random(b.bounds().centerX(), b.bounds().right),
      c = b.bounds().centerY(),
      fInfo("\u70B9\u51FB\u8BBE\u7F6E\u6309\u94AE: " + e + "," + c),
      click(e, c); while (!id("setting_sign_out").findOne(1500));
  }
  log("\u7B49\u5F85\u9000\u51FA\u767B\u5F55");
  b = id("setting_sign_out").findOne();
  sleep(1e3);
  log("\u70B9\u51FB\u9000\u51FA\u767B\u5F55");
  real_click(b);
  text("\u786E\u8BA4").findOne().click();
  return true;
}
function main(userinfo) {
  let retry_time;
  let main_thread;
  if (!Number(watchdog)) {
    retry_time = 5400;
  } else if (Number(watchdog) < 900) {
    fTips(
      "\u5EFA\u8BAE\u91CD\u8BD5\u5EF6\u8FDF\u4E0D\u8981\u4F4E\u4E8E900s\u537315\u5206\u949F\uFF0C\u5DF2\u8BBE\u4E3A1800s",
    );
    retry_time = 1800;
  } else {
    retry_time = Number(watchdog);
  }
  for (let i = 0; i < 3; i++) {
    fClear();
    fInfo(
      "\u5F00\u59CB\u7B2C" + (i + 1) +
        "\u8F6E\uFF0C\u6700\u957F\u8FD0\u884C\u65F6\u95F4\u4E3A" + retry_time +
        "s",
    );
    let xxqg_begin = /* @__PURE__ */ new Date();
    main_thread = threads.start(function () {
      xxqg(userinfo);
    });
    main_thread.join(retry_time * 1e3);
    if (main_thread.isAlive()) {
      main_thread.interrupt();
      fError("\u8FD0\u884C\u8D85\u65F6\uFF0C\u91CD\u8BD5");
      exit_app("\u5B66\u4E60\u5F3A\u56FD");
      sleep(1500);
      app.launchApp("\u5B66\u4E60\u5F3A\u56FD");
      sleep(2e3);
    } else {
      let xxqg_end = /* @__PURE__ */ new Date();
      let spent_time = Number(((xxqg_end - xxqg_begin) / 1e3).toFixed());
      fInfo(
        "\u672C\u8F6E\u5DF2\u7ED3\u675F\uFF0C\u82B1\u8D39\u65F6\u95F4" +
          spent_time + "s",
      );
      600 > spent_time &&
        fError(
          "\u65F6\u95F4\u8FC7\u77ED\uFF0C\u8BF7\u68C0\u67E5\u65E5\u5FD7\u662F\u62A5\u9519\u5BFC\u81F4\u811A\u672C\u7ED3\u675F\uFF0C\u6B63\u5E38\u7ED3\u675F\u8BF7\u65E0\u89C6",
        );
      return true;
    }
  }
  fError(
    "\u5DF2\u91CD\u8BD53\u6B21\uFF0C\u53EF\u80FD\u65E0\u969C\u788D\u670D\u52A1\u51FA\u73B0\u6545\u969C\uFF0C\u9000\u51FA\u811A\u672C",
  );
  exit();
}
var noverify_thread = noverify();
var zhanghao_list = [];
if (zhanghao) {
  for (let zh of zhanghao.split("\n")) {
    let userinfo = zh.split(/:|：/);
    zhanghao_list.push(userinfo);
  }
  for (let userinfo of zhanghao_list) {
    console.verbose(userinfo);
    main(userinfo);
  }
  fClear();
  fInfo("\u767B\u5F55\u56DE\u8D26\u53F71");
  console.verbose(zhanghao_list[0][0], zhanghao_list[0][1]);
  login(zhanghao_list[0][0], zhanghao_list[0][1]);
} else {
  main();
}
if (noverify_thread.isAlive()) {
  noverify_thread.interrupt();
}
fInfo("\u5DF2\u5168\u90E8\u7ED3\u675F");
if (yl_on) {
  fInfo("\u8C03\u56DE\u521D\u59CB\u97F3\u91CF:" + yuan_yl);
  device.setMusicVolume(yuan_yl);
}
fInfo("\u53D6\u6D88\u5C4F\u5E55\u5E38\u4EAE");
device.cancelKeepingAwake();
device.vibrate(500);
fInfo("\u4E00\u79D2\u540E\u5173\u95ED\u60AC\u6D6E\u7A97");
device.cancelVibration();
sleep(1e3);
console.hide();
home();
exit_app("\u5B66\u4E60\u5F3A\u56FD");
exit_app("\u5B66\u4E60");
exit();
