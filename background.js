chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type === "fetchCookies") {
    chrome.cookies.getAll({ url: sender.tab.url }, function (cookies) {
      chrome.tabs.sendMessage(sender.tab.id, { type: "fetchCookiesResponse", rawType: request.rawType, cookies: cookies });
    });
  } else if (request.type === 'uploadAuthData') {
    chrome.cookies.getAll({ url: sender.tab.url }, async function (cookies) {
      // todo 上传操作。。。
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

