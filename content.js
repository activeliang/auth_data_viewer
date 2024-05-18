chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.info('request.type: ', request)
  if (request.type === "uploadAuthData") {
    const authData = {
      sessionStorage: { ...sessionStorage },
      localStorage: { ...localStorage }
    };
    console.info('authData: ', authData)
    chrome.runtime.sendMessage({ type: "uploadAuthData", data: authData }, function (response) { });
  } else if (request.type === 'fetchCookiesResponse') {
    if (request.rawType === "exportAuthData") {
      const authData = {
        cookies: request.cookies,
        sessionStorage: { ...sessionStorage },
        localStorage: { ...localStorage }
      };
      chrome.runtime.sendMessage({ type: "exportAuthDataResult", data: authData }, function (response) { });
    }
  } else if (request.type == 'exportAuthData') {
    chrome.runtime.sendMessage({ type: "fetchCookies", rawType: request.type }, function (response) { });
  } else if (request.type == 'importAuthData') {
    const targetAuthData = JSON.parse(request.data)
    // 写入 sessionStorage
    for (const [key, value] of Object.entries(targetAuthData.sessionStorage)) {
      sessionStorage.setItem(key, value);
    }
    // 写入 localStorage
    for (const [key, value] of Object.entries(targetAuthData.localStorage)) {
      localStorage.setItem(key, value);
    }
    // 写入cookies
    chrome.runtime.sendMessage({ type: "importAuthData", rawType: request.type, data: request.data }, function (response) { });
  }
});