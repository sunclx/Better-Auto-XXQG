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
