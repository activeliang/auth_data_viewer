// 发送POST请求的函数
function sendPostRequest(url, data) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'auth': 'abcdefghijklmn'
      // 如果需要在请求中包含其他头部信息，可以在这里添加
      // 'Header-Name': 'Header-Value'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icons/icon48.png', // 您的图标 URL
        title: '操作完成',
        message: '数据已上传'
      });
      console.log('Success:', data);
      // 处理成功的情况
      return data
    })
    .catch(error => {
      console.error('Error:', error);
      // 处理错误的情况
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icons/icon48.png', // 您的图标 URL
        title: '操作失败',
        message: '上传失败，请联系管理员'
      });
    });
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type === "fetchCookies") {
    chrome.cookies.getAll({ url: sender.tab.url }, function (cookies) {
      chrome.tabs.sendMessage(sender.tab.id, { type: "fetchCookiesResponse", rawType: request.rawType, cookies: cookies });
    });
  } else if (request.type === 'uploadAuthData') {
    chrome.cookies.getAll({ url: sender.tab.url }, async function (cookies) {
      const res = await sendPostRequest('http://rtr-raw.hongliang.fun/api/v1/auth_cache', { data: { ...request.data, cookies }, scope: request.scope });
      sendResponse({ res });
      return true;
    });
  } else if (request.type === 'importAuthData') {
    const currentAuthData = JSON.parse(request.data)
    console.info(sender.url, sender)
    currentAuthData.cookies.forEach(cookie => {
      chrome.cookies.set({
        url: sender.url,
        domain: cookie.domain,
        expirationDate: cookie.expirationDate,
        httpOnly: cookie.httpOnly,
        name: cookie.name,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        storeId: cookie.storeId,
        value: cookie.value,
      }, function (setCookie) {
        console.log('Cookie set:', setCookie);
      });
    });
  }
});

