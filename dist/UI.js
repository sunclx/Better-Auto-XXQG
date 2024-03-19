"ui";(()=>{importClass(java.net.HttpURLConnection);importClass(java.net.URL);importClass(java.io.File);importClass(java.io.FileOutputStream);importClass(android.graphics.Color);var n=storages.create("MAIN"),s=n.get("script");ui.statusBarColor("#FF4FB3FF");ui.layout(<drawer id="drawer"><vertical><appbar><toolbar id="toolbar"bg="#ff4fb3ff"title="学习助手"/><tabs id="tabs"bg="#ff4fb3ff"/></appbar><viewpager id="viewpager"><frame><vertical><vertical gravity="center"layout_weight="1"><card visibility="gone"w="*"h="70"margin="10 5"cardCornerRadius="2dp"cardElevation="1dp"foreground="?selectableItemBackground"><horizontal gravity="center_vertical"><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text text="脚本选择"textColor="#222222"textSize="16sp"maxLines="1"/><text text="切换脚本后需在配置页设置"textColor="#999999"textSize="14sp"maxLines="1"/></vertical><spinner id="script_chosen"marginLeft="4"marginRight="6"entries="天天向上Pro"/></horizontal></card><card w="*"h="70"margin="10 5"cardCornerRadius="2dp"cardElevation="1dp"foreground="?selectableItemBackground"><horizontal gravity="center_vertical"><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text text="无障碍服务"textColor="#222222"textSize="16sp"maxLines="1"/><text text="请确保开启"textColor="#999999"textSize="14sp"maxLines="1"/></vertical><checkbox id="autoService"marginLeft="4"marginRight="6"checked="{{auto.service != null}}"/></horizontal></card><card w="*"h="70"margin="10 5"cardCornerRadius="2dp"cardElevation="1dp"foreground="?selectableItemBackground"><horizontal gravity="center_vertical"><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text text="悬浮窗权限"textColor="#222222"textSize="16sp"maxLines="1"/><text text="请确保开启"textColor="#999999"textSize="14sp"maxLines="1"/></vertical><checkbox id="consoleshow"marginLeft="4"marginRight="6"checked="{{floaty.checkPermission()}}"/></horizontal></card><card w="*"h="70"margin="10 5"cardCornerRadius="2dp"cardElevation="1dp"foreground="?selectableItemBackground"><horizontal gravity="center_vertical"><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text text="音量上键可以停止所有脚本运行"textColor="#222222"textSize="16sp"maxLines="1"/></vertical></horizontal></card></vertical><button h="60"layout_gravity="center"id="log"textSize="18sp"text="查看日志"/><button h="60"layout_gravity="center"id="startH"textSize="18sp"text="手动操作"/><button h="60"layout_gravity="center"id="update"textSize="18sp"text="更新"/><button id="start"text="开 始 学 习"textSize="25sp"color="#ffffff"bg="#FF4FB3FF"foreground="?selectableItemBackground"/></vertical></frame><ScrollView><frame><vertical id="ttxs_pro"gravity="center"><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="测试"/></vertical><checkbox id="ttxs_pro_test"marginLeft="4"marginRight="6"checked="false"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="看门狗(秒)"/><text w="auto"textColor="#999999"textSize="12sp"text="填1800就是超过30分钟重试"/><text w="auto"textColor="#999999"textSize="12sp"text="空着或0默认5400秒，超过即重新执行"/></vertical><input id="ttxs_pro_watchdog"marginLeft="4"marginRight="6"text="1800"hint="秒"textSize="13sp"inputType="number"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="发现滑动验证后的震动提醒时间(ms)"/><text w="auto"textColor="#999999"textSize="12sp"text="空着或0不开启震动"/></vertical><input id="ttxs_pro_slide_verify"marginLeft="4"marginRight="6"text="300"textSize="13sp"inputType="number"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="无障碍模式2"/><text w="auto"textColor="#999999"textSize="12sp"text="无障碍服务没问题就不勾选"/></vertical><checkbox id="ttxs_pro_fast_mode"marginLeft="4"marginRight="6"checked="false"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="点点通功能"/></vertical><checkbox id="ttxs_pro_ddtong"marginLeft="4"marginRight="6"checked="false"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="开始前强制结束强国"/><text w="auto"textColor="#999999"textSize="12sp"text="如果关闭，请确保强国已退出或在首页"/></vertical><checkbox id="ttxs_pro_is_exit"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="评论"/></vertical><checkbox id="ttxs_pro_pinglun"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="评论内容"/><text w="auto"textColor="#999999"textSize="12sp"text="随机选择一项作为评论内容，以竖线“|”分隔"/><text w="auto"textColor="#999999"textSize="12sp"text="如果只有一项则每次评论都一样"/><input id="ttxs_pro_comment"marginLeft="4"marginRight="6"text="全心全意为人民服务|不忘初心，牢记使命|不忘初心，方得始终|永远坚持党的领导|富强、民主、文明、和谐|自由，平等，公正，法治"textSize="13sp"inputType="textMultiLine"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="视听学习次数"/></vertical><checkbox id="ttxs_pro_shipin"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="文章次数与时长"/></vertical><checkbox id="ttxs_pro_wenzhang"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="每日答题"/></vertical><checkbox id="ttxs_pro_meiri"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="每周答题"/><spinner id="ttxs_pro_meizhou"marginLeft="4"marginRight="6"entries="最近一次已作答开始倒序|正序答题|不做"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="专项答题"/><spinner id="ttxs_pro_zhuanxiang"marginLeft="4"marginRight="6"entries="最近一次已作答开始倒序|正序答题|不做"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="挑战答题"/></vertical><checkbox id="ttxs_pro_tiaozhan"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="OCR选择"/><spinner id="ttxs_pro_ocr_choice"marginLeft="4"marginRight="6"entries="GoogleMLKit|PaddleOCR|第三方插件"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="ocr识别跳过阈值(ms)"/><text w="auto"textColor="#999999"textSize="12sp"text="空着或0默认5000，超过此时间会跳过多人对战"/><text w="auto"textColor="#999999"textSize="12sp"text="建议按照平时正常的ocr识别时间设置"/></vertical><input id="ttxs_pro_ocr_maxtime"marginLeft="4"marginRight="6"text="5000"textSize="13sp"inputType="number"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="对战选项模式"/><spinner id="ttxs_pro_duizhan_mode"marginLeft="4"marginRight="6"entries="随机顺序(等选项显示后识别答案)|固定顺序(历史遗留选项)|手动答题(识别答案后等待用户手动点击)"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="对战极速模式延迟(历史遗留选项)"/><text w="auto"textColor="#999999"textSize="12sp"text="只在选项固定顺序时生效"/></vertical><input id="ttxs_pro_jisu"marginLeft="4"marginRight="6"text="0"textSize="13sp"inputType="number"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="是否挂机跳过四人赛首局"/><text w="auto"textColor="#999999"textSize="12sp"text="首局匹配对手较强，挂机不会扣积分局数"/></vertical><checkbox id="ttxs_pro_guaji"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="四人赛"/></vertical><checkbox id="ttxs_pro_siren"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="平衡胜率(答错)次数"/></vertical><input id="ttxs_pro_dacuo_num"marginLeft="4"marginRight="6"text="2"textSize="13sp"inputType="number"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="双人对战"/></vertical><checkbox id="ttxs_pro_shuangren"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="本地"/></vertical><checkbox id="ttxs_pro_bendi"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="订阅"/><spinner id="ttxs_pro_dingyue"marginLeft="4"marginRight="6"entries="不做|正序订阅|只订阅年度上新"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="pushplus_token(微信推送)"/><text w="auto"textColor="#999999"textSize="12sp"text="微信关注pushplus推送加，复制token填入"/><text w="auto"textColor="#999999"textSize="12sp"text="注意！搜索结果有两个，一定要关注正确"/><input id="ttxs_pro_pushplus"text=""textSize="13sp"/></vertical></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="是否启用音量调节"/><text w="auto"textColor="#999999"textSize="12sp"text="每次运行脚本后调节音量百分比"/></vertical><checkbox id="ttxs_pro_yl_on"marginLeft="4"marginRight="6"checked="true"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="音量"/><text w="auto"textColor="#999999"textSize="12sp"text="调节音量百分比(只填数字)"/></vertical><input id="ttxs_pro_yinliang"marginLeft="4"marginRight="6"text="0"textSize="13sp"inputType="number"/></horizontal><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="15sp"text="多账号(选填，不限个数)"/><text w="auto"textColor="#999999"textSize="12sp"text="使用前确保所有账号都已完成短信验证"/><text w="auto"textColor="#999999"textSize="12sp"text="账号1:密码1:token1(换行/回车)账号2:密码2:token2(换行/回车)账号3:密码3:token3"/><text w="auto"textColor="#999999"textSize="12sp"text="结束后会自动登录回账号1"/><text w="auto"textColor="#999999"textSize="12sp"text="新增多账号1对1微信推送，按格式配置即可"/><text w="auto"textColor="#999999"textSize="12sp"text="没有则根据上面配置的pushplus_token为主"/><input id="ttxs_pro_zhanghao"text=""textSize="13sp"/></vertical></horizontal><horizontal><button style="Widget.AppCompat.Button.Colored"id="ttxs_pro_save"text="保存配置"padding="12dp"w="*"/></horizontal><horizontal><button style="Widget.AppCompat.Button.Colored"id="ttxs_pro_reset"text="恢复默认"padding="12dp"w="*"/></horizontal></vertical></frame></ScrollView><ScrollView><frame><vertical gravity="center"><horizontal gravity="center_vertical"padding="5 5"><View bg="#00BFFF"h="*"w="10"/><vertical padding="10 8"h="auto"w="0"layout_weight="1"><text w="auto"textColor="#222222"textSize="16sp"text="文章地区设置"/><text w="auto"textColor="#999999"textSize="12sp"text="默认为江苏"/><text w="auto"textColor="#999999"textSize="12sp"text="不清楚请勿改动，填写错误将无法运行"/><text w="auto"textColor="#222222"textSize="15sp"text="选择地区"/><spinner id="ttxs_pro_district_select"marginLeft="4"marginRight="6"entries="江苏|北京|自定义"/><vertical id="ttxs_pro_district_edit"visibility="gone"><text w="auto"textColor="#222222"textSize="15sp"text="自定义地区"/><horizontal><text w="auto"textColor="#222222"textSize="15sp"text="地区"/><input id="ttxs_pro_district"marginLeft="4"marginRight="6"text=""w="*"textSize="15sp"inputType="text"/></horizontal><horizontal><text w="auto"textColor="#222222"textSize="15sp"text="广播频道"/><input id="ttxs_pro_broadcast"marginLeft="4"marginRight="6"text=""w="*"textSize="15sp"inputType="text"/></horizontal><horizontal><text w="auto"textColor="#222222"textSize="15sp"text="学习平台"/><input id="ttxs_pro_platform"marginLeft="4"marginRight="6"text=""w="*"textSize="15sp"inputType="text"/></horizontal><horizontal><text w="auto"textColor="#222222"textSize="15sp"text="子栏目"/><input id="ttxs_pro_subcolumn"marginLeft="4"marginRight="6"text=""w="*"textSize="15sp"inputType="text"/></horizontal></vertical></vertical></horizontal><horizontal><button style="Widget.AppCompat.Button.Colored"id="ttxs_pro_save2"text="保存配置"padding="12dp"w="*"/></horizontal><horizontal><button style="Widget.AppCompat.Button.Colored"id="ttxs_pro_reset2"text="恢复默认"padding="12dp"w="*"/></horizontal></vertical></frame></ScrollView></viewpager></vertical></drawer>);http.__okhttp__.setTimeout(1e4);var g=storages.create("GLOBAL_CONFIG"),t=storages.create("TTXS_PRO_CONFIG"),d,u=null;z();var w="2.2.0",p=["https://mirror.ghproxy.com/https://raw.githubusercontent.com/sunclx/XXQG/main/","https://raw.kkgithub.com/sunclx/XXQG/main/","https://ghproxy.net/https://raw.githubusercontent.com/sunclx/XXQG/main/","https://fastly.jsdelivr.net/gh/sunclx/XXQG@main/","https://fastraw.ixnic.net/sunclx/XXQG/main/","https://cdn.jsdelivr.us/gh/sunclx/XXQG@main/","https://jsdelivr.b-cdn.net/gh/sunclx/XXQG@main/","https://github.moeyy.xyz/https://raw.githubusercontent.com/sunclx/XXQG/main/","https://raw.cachefly.998111.xyz/sunclx/XXQG/main/","https://raw.githubusercontent.com/sunclx/XXQG/main/"];ui.emitter.on("create_options_menu",e=>{e.add("\u65E5\u5FD7"),e.add("\u5173\u4E8E"),e.add("Github")});ui.emitter.on("options_item_selected",(e,o)=>{switch(o.getTitle()){case"\u65E5\u5FD7":app.startActivity("console");break;case"\u5173\u4E8E":alert("\u5173\u4E8E","\u5F3A\u56FD\u52A9\u624B v"+w);break;case"Github":app.openUrl("https://github.com/sec-an/Better-Auto-XXQG");break}e.consumed=!0});activity.setSupportActionBar(ui.toolbar);ui.viewpager.setTitles(["\u9996\u9875","\u811A\u672C\u914D\u7F6E","\u8BE6\u7EC6\u8BBE\u7F6E"]);ui.tabs.setupWithViewPager(ui.viewpager);var m=new android.widget.AdapterView.OnItemSelectedListener({onItemSelected:function(e,o,a,r){toastLog("\u9009\u62E9\u811A\u672C\uFF1A"+ui.script_chosen.getSelectedItem()),ui.ttxs_pro.visibility=0,g.put("script_chosen",ui.script_chosen.getSelectedItemPosition())}});ui.script_chosen.setOnItemSelectedListener(m);ui.autoService.on("check",function(e){e&&auto.service==null&&app.startActivity({action:"android.settings.ACCESSIBILITY_SETTINGS"}),!e&&auto.service!=null&&auto.service.disableSelf()});ui.consoleshow.on("check",function(e){e&&!floaty.checkPermission()&&app.startActivity({packageName:"com.android.settings",className:"com.android.settings.Settings$AppDrawOverlaySettingsActivity",data:"package:"+context.getPackageName()})});ui.emitter.on("resume",function(){ui.autoService.checked=auto.service!=null,ui.consoleshow.checked=floaty.checkPermission()});ui.log.click(function(){app.startActivity("console")});ui.start.click(function(){if(threads.shutDownAll(),u!=null&&u.isAlive()){alert("\u6CE8\u610F","\u811A\u672C\u6B63\u5728\u8FD0\u884C\uFF0C\u8BF7\u7ED3\u675F\u4E4B\u524D\u8FDB\u7A0B");return}u=threads.start(function(){console.log("\u70B9\u51FB\u5F00\u59CB\u6309\u94AE"),s&&(d=engines.execScript("\u5F3A\u56FD\u52A9\u624B",s))})});ui.update.click(function(){threads.start(function(){s=l("dist/"+ui.script_chosen.getSelectedItemPosition()),n.put("script",s);let e=l("dist/main");n.put("main",e);let o=l("dist/UI");n.put("UI",o),console.log("\u66F4\u65B0\u6210\u529F")})});ui.update.on("long_click",()=>{threads.start(function(){let e=dialogs.singleChoice("\u8BF7\u9009\u62E9\u4E0B\u8F7D\u4EE3\u7406",p,0),o=function(i){try{let c=p[e]+i+".js";console.log(c);let x=http.get(c);if(console.log("statusCode:"+x.statusCode),x.statusCode==200)return x.body.string();toastLog("\u5B66\u4E60\u811A\u672C:\u5730\u5740"+c+"\u4E0B\u8F7D\u5931\u8D25")}catch(c){console.log(c)}};s=o("0"),n.put("script",s);let a=o("main");n.put("main",a);let r=o("UI");n.put("UI",r),console.log("\u66F4\u65B0\u6210\u529F")})});ui.startH.click(function(){if(threads.shutDownAll(),u!=null&&u.isAlive()){alert("\u6CE8\u610F","\u811A\u672C\u6B63\u5728\u8FD0\u884C\uFF0C\u8BF7\u7ED3\u675F\u4E4B\u524D\u8FDB\u7A0B");return}u=threads.start(function(){d=engines.execScript("\u5F3A\u56FD\u52A9\u624B",l("a"))})});function _(){t.put("test",ui.ttxs_pro_test.isChecked()),t.put("watchdog",ui.ttxs_pro_watchdog.getText()+""),t.put("slide_verify",ui.ttxs_pro_slide_verify.getText()+""),t.put("fast_mode",ui.ttxs_pro_fast_mode.isChecked()),t.put("ddtong",ui.ttxs_pro_ddtong.isChecked()),t.put("is_exit",ui.ttxs_pro_is_exit.isChecked()),t.put("pinglun",ui.ttxs_pro_pinglun.isChecked()),t.put("comment",ui.ttxs_pro_comment.getText()+""),t.put("shipin",ui.ttxs_pro_shipin.isChecked()),t.put("wenzhang",ui.ttxs_pro_wenzhang.isChecked()),t.put("meiri",ui.ttxs_pro_meiri.isChecked()),t.put("meizhou",ui.ttxs_pro_meizhou.getSelectedItemPosition()),t.put("zhuanxiang",ui.ttxs_pro_zhuanxiang.getSelectedItemPosition()),t.put("tiaozhan",ui.ttxs_pro_tiaozhan.isChecked()),t.put("ocr_choice",ui.ttxs_pro_ocr_choice.getSelectedItemPosition()),t.put("ocr_maxtime",ui.ttxs_pro_ocr_maxtime.getText()+""),t.put("duizhan_mode",ui.ttxs_pro_duizhan_mode.getSelectedItemPosition()),t.put("jisu",ui.ttxs_pro_jisu.getText()+""),t.put("guaji",ui.ttxs_pro_guaji.isChecked()),t.put("siren",ui.ttxs_pro_siren.isChecked()),t.put("dacuo_num",ui.ttxs_pro_dacuo_num.getText()+""),t.put("shuangren",ui.ttxs_pro_shuangren.isChecked()),t.put("bendi",ui.ttxs_pro_bendi.isChecked()),t.put("dingyue",ui.ttxs_pro_dingyue.getSelectedItemPosition()),t.put("pushplus",ui.ttxs_pro_pushplus.getText()+""),t.put("yl_on",ui.ttxs_pro_yl_on.isChecked()),t.put("yinliang",ui.ttxs_pro_yinliang.getText()+""),t.put("zhanghao",ui.ttxs_pro_zhanghao.getText()+""),t.put("district_select",ui.ttxs_pro_district_select.getSelectedItemPosition()),t.put("district",ui.ttxs_pro_district.getText()+""),t.put("broadcast",ui.ttxs_pro_broadcast.getText()+""),t.put("platform",ui.ttxs_pro_platform.getText()+""),t.put("subcolumn",ui.ttxs_pro_subcolumn.getText()+""),toastLog("\u5929\u5929\u5411\u4E0Apro\u914D\u7F6E\u4FDD\u5B58\u6210\u529F\uFF01")}ui.ttxs_pro_save.click(_);ui.ttxs_pro_save2.click(_);function h(){t.put("test",!1),ui.ttxs_pro_ddtong.setChecked(t.get("test")),t.put("watchdog","1800"),ui.ttxs_pro_watchdog.setText(t.get("watchdog")),t.put("slide_verify","300"),ui.ttxs_pro_slide_verify.setText(t.get("slide_verify")),t.put("fast_mode",!1),ui.ttxs_pro_fast_mode.setChecked(t.get("fast_mode")),t.put("ddtong",!1),ui.ttxs_pro_ddtong.setChecked(t.get("ddtong")),t.put("is_exit",!0),ui.ttxs_pro_is_exit.setChecked(t.get("is_exit")),t.put("pinglun",!0),ui.ttxs_pro_pinglun.setChecked(t.get("pinglun")),t.put("comment","\u5168\u5FC3\u5168\u610F\u4E3A\u4EBA\u6C11\u670D\u52A1|\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u7262\u8BB0\u4F7F\u547D|\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u65B9\u5F97\u59CB\u7EC8|\u6C38\u8FDC\u575A\u6301\u515A\u7684\u9886\u5BFC|\u5BCC\u5F3A\u3001\u6C11\u4E3B\u3001\u6587\u660E\u3001\u548C\u8C10|\u81EA\u7531\uFF0C\u5E73\u7B49\uFF0C\u516C\u6B63\uFF0C\u6CD5\u6CBB"),ui.ttxs_pro_comment.setText(t.get("comment")),t.put("shipin",!0),ui.ttxs_pro_shipin.setChecked(t.get("shipin")),t.put("wenzhang",!0),ui.ttxs_pro_wenzhang.setChecked(t.get("wenzhang")),t.put("meiri",!0),ui.ttxs_pro_meiri.setChecked(t.get("meiri")),t.put("meizhou",0),ui.ttxs_pro_meizhou.setSelection(t.get("meizhou")),t.put("zhuanxiang",0),ui.ttxs_pro_zhuanxiang.setSelection(t.get("zhuanxiang")),t.put("tiaozhan",!0),ui.ttxs_pro_tiaozhan.setChecked(t.get("tiaozhan")),t.put("ocr_choice",0),ui.ttxs_pro_ocr_choice.setSelection(t.get("ocr_choice")),t.put("ocr_maxtime","5000"),ui.ttxs_pro_ocr_maxtime.setText(t.get("ocr_maxtime")),t.put("duizhan_mode",0),ui.ttxs_pro_duizhan_mode.setSelection(t.get("duizhan_mode")),t.put("jisu","0"),ui.ttxs_pro_jisu.setText(t.get("jisu")),t.put("guaji",!0),ui.ttxs_pro_guaji.setChecked(t.get("guaji")),t.put("siren",!0),ui.ttxs_pro_siren.setChecked(t.get("siren")),t.put("dacuo_num","2"),ui.ttxs_pro_dacuo_num.setText(t.get("dacuo_num")),t.put("shuangren",!0),ui.ttxs_pro_shuangren.setChecked(t.get("shuangren")),t.put("bendi",!0),ui.ttxs_pro_bendi.setChecked(t.get("bendi")),t.put("dingyue",0),ui.ttxs_pro_dingyue.setSelection(t.get("dingyue")),t.put("pushplus",""),ui.ttxs_pro_pushplus.setText(t.get("pushplus")),t.put("yl_on",!0),ui.ttxs_pro_yl_on.setChecked(t.get("yl_on")),t.put("yinliang","0"),ui.ttxs_pro_yinliang.setText(t.get("yinliang")),t.put("zhanghao",""),ui.ttxs_pro_zhanghao.setText(t.get("zhanghao")),t.put("district_select",0),ui.ttxs_pro_district_select.setSelection(t.get("district_select")),t.put("district","\u6C5F\u82CF"),ui.ttxs_pro_district.setText(t.get("district")),t.put("broadcast","\u6C5F\u82CF\u65B0\u95FB\u5E7F\u64AD"),ui.ttxs_pro_broadcast.setText(t.get("broadcast")),t.put("platform","\u6C5F\u82CF\u5B66\u4E60\u5E73\u53F0"),ui.ttxs_pro_platform.setText(t.get("platform")),t.put("subcolumn","\u603B\u4E66\u8BB0\u5728\u6C5F\u82CF"),ui.ttxs_pro_subcolumn.setText(t.get("subcolumn")),toastLog("\u5929\u5929\u5411\u4E0Apro\u914D\u7F6E\u6062\u590D\u9ED8\u8BA4\uFF01")}ui.ttxs_pro_reset.click(h);ui.ttxs_pro_reset2.click(h);function z(){ui.script_chosen.setSelection(g.get("script_chosen",0)),ui.ttxs_pro_test.setChecked(t.get("test",!1)),ui.ttxs_pro_watchdog.setText(t.get("watchdog","1800")),ui.ttxs_pro_slide_verify.setText(t.get("slide_verify","300")),ui.ttxs_pro_fast_mode.setChecked(t.get("fast_mode",!1)),ui.ttxs_pro_ddtong.setChecked(t.get("ddtong",!1)),ui.ttxs_pro_is_exit.setChecked(t.get("is_exit",!0)),ui.ttxs_pro_pinglun.setChecked(t.get("pinglun",!0)),ui.ttxs_pro_comment.setText(t.get("comment","\u5168\u5FC3\u5168\u610F\u4E3A\u4EBA\u6C11\u670D\u52A1|\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u7262\u8BB0\u4F7F\u547D|\u4E0D\u5FD8\u521D\u5FC3\uFF0C\u65B9\u5F97\u59CB\u7EC8|\u6C38\u8FDC\u575A\u6301\u515A\u7684\u9886\u5BFC|\u5BCC\u5F3A\u3001\u6C11\u4E3B\u3001\u6587\u660E\u3001\u548C\u8C10|\u81EA\u7531\uFF0C\u5E73\u7B49\uFF0C\u516C\u6B63\uFF0C\u6CD5\u6CBB")),ui.ttxs_pro_shipin.setChecked(t.get("shipin",!0)),ui.ttxs_pro_wenzhang.setChecked(t.get("wenzhang",!0)),ui.ttxs_pro_meiri.setChecked(t.get("meiri",!0)),ui.ttxs_pro_meizhou.setSelection(t.get("meizhou",0)),ui.ttxs_pro_zhuanxiang.setSelection(t.get("zhuanxiang",0)),ui.ttxs_pro_tiaozhan.setChecked(t.get("tiaozhan",!0)),ui.ttxs_pro_ocr_choice.setSelection(t.get("ocr_choice",0)),ui.ttxs_pro_ocr_maxtime.setText(t.get("ocr_maxtime","5000")),ui.ttxs_pro_duizhan_mode.setSelection(t.get("duizhan_mode",0)),ui.ttxs_pro_jisu.setText(t.get("jisu","0")),ui.ttxs_pro_guaji.setChecked(t.get("guaji",!0)),ui.ttxs_pro_siren.setChecked(t.get("siren",!0)),ui.ttxs_pro_dacuo_num.setText(t.get("dacuo_num","2")),ui.ttxs_pro_shuangren.setChecked(t.get("shuangren",!0)),ui.ttxs_pro_bendi.setChecked(t.get("bendi",!0)),ui.ttxs_pro_dingyue.setSelection(t.get("dingyue",0)),ui.ttxs_pro_pushplus.setText(t.get("pushplus","")),ui.ttxs_pro_yl_on.setChecked(t.get("yl_on",!0)),ui.ttxs_pro_yinliang.setText(t.get("yinliang","0")),ui.ttxs_pro_zhanghao.setText(t.get("zhanghao","")),ui.ttxs_pro_district_select.setSelection(t.get("district_select",0)),ui.ttxs_pro_district.setText(t.get("district","\u6C5F\u82CF")),ui.ttxs_pro_broadcast.setText(t.get("broadcast","\u6C5F\u82CF\u65B0\u95FB\u5E7F\u64AD")),ui.ttxs_pro_platform.setText(t.get("platform","\u6C5F\u82CF\u5B66\u4E60\u5E73\u53F0")),ui.ttxs_pro_subcolumn.setText(t.get("subcolumn","\u603B\u4E66\u8BB0\u5728\u6C5F\u82CF"))}ui.ttxs_pro_district_select.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener({onItemSelected:function(e,o,a,r){let i={\u6C5F\u82CF:{district:"\u6C5F\u82CF",broadcast:"\u6C5F\u82CF\u65B0\u95FB\u5E7F\u64AD",platform:"\u6C5F\u82CF\u5B66\u4E60\u5E73\u53F0",subcolumn:"\u603B\u4E66\u8BB0\u5728\u6C5F\u82CF"},\u5317\u4EAC:{district:"\u5317\u4EAC",broadcast:"\u5317\u4EAC\u65B0\u95FB\u5E7F\u64AD",platform:"\u5317\u4EAC\u5B66\u4E60\u5E73\u53F0",subcolumn:"\u65B0\u601D\u60F3\u624E\u6839\u4EAC\u534E"}};switch(r){case 0:ui.ttxs_pro_district.setText(i.\u6C5F\u82CF.district),ui.ttxs_pro_broadcast.setText(i.\u6C5F\u82CF.broadcast),ui.ttxs_pro_platform.setText(i.\u6C5F\u82CF.platform),ui.ttxs_pro_subcolumn.setText(i.\u6C5F\u82CF.subcolumn),ui.ttxs_pro_district_edit.visibility=8;break;case 1:ui.ttxs_pro_district.setText(i.\u5317\u4EAC.district),ui.ttxs_pro_broadcast.setText(i.\u5317\u4EAC.broadcast),ui.ttxs_pro_platform.setText(i.\u5317\u4EAC.platform),ui.ttxs_pro_subcolumn.setText(i.\u5317\u4EAC.subcolumn),ui.ttxs_pro_district_edit.visibility=8;break;case 2:ui.ttxs_pro_district_edit.visibility=0;break;default:ui.ttxs_pro_district.setText(i.\u6C5F\u82CF.district),ui.ttxs_pro_broadcast.setText(i.\u6C5F\u82CF.broadcast),ui.ttxs_pro_platform.setText(i.\u6C5F\u82CF.platform),ui.ttxs_pro_subcolumn.setText(i.\u6C5F\u82CF.subcolumn)}}}));function l(e){let o="";for(let a=0;a<p.length;a++)try{let r=http.get(p[a]+e+".js");if(console.log(a,":"+r.statusCode),r.statusCode==200){o=r.body.string();break}else toastLog("\u5B66\u4E60\u811A\u672C:\u5730\u5740"+a+"\u4E0B\u8F7D\u5931\u8D25")}catch(r){console.log(r)}return o}u=threads.start(function(){s||(s=l("dist/"+ui.script_chosen.getSelectedItemPosition()),n.put("script",s))});})();
