// 一个公共方法，用于截取字符串的前n个字符并添加省略号
const truncateString = function (str, maxLength) {
    if (!str || str === "" || str === null || str === undefined) return "";
    maxLength = maxLength ? maxLength : 300;//默认截取300字符
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...'; // 截取前maxLength个字符并添加省略号
    } else {
        return str;
    }
}

const checkToken = function (req, res, next) {
    // 检查本地存储中的令牌和过期时间
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    let result = true;
    if (!token || new Date(tokenExpiration) < new Date()) {
        result = false;
    }

    return result;
}

//检查看板令牌
const checkBoardToken = async function (req, res, next) {
    const boardToken = localStorage.getItem('boardToken');
    let result = false;
    if (boardToken) {
        try {
            const response = await axios.post("/api/validateToken", { token: boardToken });
            const data = response.data;
            if (data.type === "success") {
                // token有效
                result = true;
            } else {
                // token无效，需要重新登录
                localStorage.removeItem('boardToken');
                localStorage.removeItem('userInfo');
                console.log(data.message);
                result = false;
            }
        } catch (error) {
            console.error('Error validating token:', error);
            result = false;
        }
    }
    return result;
}

//判断当前看板用户,检查权限
const checkBoardUser = function (req, res, next) {
    // 检查本地存储中的令牌
    const boardToken = localStorage.getItem('boardToken');
    const userInfo = localStorage.getItem('userInfo');
}

//获取带路由的URL的参数
const getHashVariable = function(variable) {
    var hash = window.location.hash.substring(1);
    // 如果 URL 没有哈希，则直接返回 false
    if (!hash) {
      return false;
    }
  
    // 在哈希中查找查询字符串部分
    var queryIndex = hash.indexOf("?");
    if (queryIndex !== -1) {
      hash = hash.slice(queryIndex + 1);
    }
  
    // 从哈希中提取查询参数
    var vars = hash.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
  
    return false;
  }

  //正则获取URL参数
const getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

// 导出公共方法，以便在其他地方使用
window.PublicUtils = {
    truncateString,
    checkToken,
    checkBoardToken,
    checkBoardUser,
    getHashVariable,
    getQueryString
};