let username = "sunclx"; // GitHub用户名
let repo = "XXQG"; // GitHub仓库名
let branch = "main"; // GitHub仓库分支
// 定义多个URL前缀，用于尝试不同的代理或直连获取脚本
export let url_prefix = [
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

/**
 * 通过遍历预定义的URL前缀尝试下载脚本。
 * 如果找到有效的脚本，则返回脚本内容。
 * 如果所有尝试都失败，则抛出错误。
 * @param {string} filename - 需要获取的文件名。
 * @returns {string} 返回获取到的脚本内容。
 * @throws {Error} 如果文件下载失败，抛出错误。
 */
export function getScriptA(filename: string): string {
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
 * 获取指定文件名的脚本内容。
 * @param {string} url - 需要下载的脚本文件名。
 * @returns {string|null} 返回下载到的脚本内容。
 * @throws {Error} 如果所有预定义的URL前缀都无法下载到脚本，则抛出错误。
 */
export function getScript(url: string): string | null {
  try {
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

/**
 * 使用Google ML Kit进行文字识别，并对识别结果进行排序。
 * @param {Image} img - 需要进行文字识别的图片对象。
 * @returns {object[]} 返回排序后的文字识别结果列表。
 */
export function google_ocr_api(img: Image) {
  console.log("GoogleMLKit文字识别中");
  // 调用Google ML Kit的OCR功能进行文字识别，限制结果数量为3
  let list = JSON.parse(
    JSON.stringify(
      (gmlkit.ocr(img, "zh") as { toArray(n: number): object }).toArray(3),
    ),
  ); // 识别文字，并得到results
  let eps = 30; // 定义坐标误差，用于后续排序时考虑坐标的近似值

  // 对识别结果进行上下位置的排序，采用选择排序算法
  for (let i = 0; i < list.length; i++) { // 遍历列表进行排序
    for (let j = i + 1; j < list.length; j++) { // 选择排序，比较并交换位置
      // 如果当前元素的底部坐标大于比较元素的底部坐标，则交换两者位置
      if (list[i]["bounds"]["bottom"] > list[j]["bounds"]["bottom"]) {
        let tmp = list[i]; // 临时存储当前元素
        list[i] = list[j]; // 交换位置
        list[j] = tmp; // 完成交换
      }
    }
  }

  for (let i = 0; i < list.length; i++) { // 在上下排序完成后，进行左右排序
    for (let j = i + 1; j < list.length; j++) {
      // 由于上下坐标并不绝对，采用误差eps
      if (
        Math.abs(list[i]["bounds"]["bottom"] - list[j]["bounds"]["bottom"]) <
          eps &&
        list[i]["bounds"]["left"] > list[j]["bounds"]["left"]
      ) {
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  let res = "";
  for (let i = 0; i < list.length; i++) {
    res += list[i]["text"];
  }
  list = null;
  return res;
}

/**
 * 对传入的图片进行文字识别，并返回排序后的文字结果。
 * @param {Image} img - 传入的图片对象。
 * @param {number} eps - 坐标误差，默认为 30。
 * @returns {string} 返回排序后的文字结果。
 */
export function paddle_ocr_api(img: Image, eps?: number) {
  eps ||= 30; // 坐标误差
  console.log("PaddleOCR文字识别中");
  let list = JSON.parse(JSON.stringify(paddle.ocr(img))); // 识别文字，并得到results
  for (let i = 0; i < list.length; i++) { // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
    for (let j = i + 1; j < list.length; j++) {
      if (list[i]["bounds"]["bottom"] > list[j]["bounds"]["bottom"]) {
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }

  for (let i = 0; i < list.length; i++) { // 在上下排序完成后，进行左右排序
    for (let j = i + 1; j < list.length; j++) {
      // 由于上下坐标并不绝对，采用误差eps
      if (
        Math.abs(list[i]["bounds"]["bottom"] - list[j]["bounds"]["bottom"]) <
          eps &&
        list[i]["bounds"]["left"] > list[j]["bounds"]["left"]
      ) {
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  let res = "";
  for (let i = 0; i < list.length; i++) {
    res += list[i]["text"];
  }
  list = null;
  return res;
}

export type Options<Result> = {
  isImmediate?: boolean;
  maxWait?: number;
  callback?: (data: Result) => void;
};

export interface DebouncedFunction<
  Args extends any[],
  F extends (...args: Args) => any,
> {
  (this: ThisParameterType<F>, ...args: Args & Parameters<F>): Promise<
    ReturnType<F>
  >;
  cancel: (reason?: any) => void;
}

interface DebouncedPromise<FunctionReturn> {
  resolve: (result: FunctionReturn) => void;
  reject: (reason?: any) => void;
}

export function debounce<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  waitMilliseconds = 50,
  options: Options<ReturnType<F>> = {},
): DebouncedFunction<Args, F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options.isImmediate ?? false;
  const callback = options.callback ?? false;
  const maxWait = options.maxWait;
  let lastInvokeTime = Date.now();

  let promises: DebouncedPromise<ReturnType<F>>[] = [];

  function nextInvokeTimeout() {
    if (maxWait !== undefined) {
      const timeSinceLastInvocation = Date.now() - lastInvokeTime;

      if (timeSinceLastInvocation + waitMilliseconds >= maxWait) {
        return maxWait - timeSinceLastInvocation;
      }
    }

    return waitMilliseconds;
  }

  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ) {
    const context = this;
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = function () {
        timeoutId = undefined;
        lastInvokeTime = Date.now();
        if (!isImmediate) {
          const result = func.apply(context, args);
          callback && callback(result);
          promises.forEach(({ resolve }) => resolve(result));
          promises = [];
        }
      };

      const shouldCallNow = isImmediate && timeoutId === undefined;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeTimeout());

      if (shouldCallNow) {
        const result = func.apply(context, args);
        callback && callback(result);
        return resolve(result);
      }
      promises.push({ resolve, reject });
    });
  };

  debouncedFunction.cancel = function (reason?: any) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    promises.forEach(({ reject }) => reject(reason));
    promises = [];
  };

  return debouncedFunction;
}
