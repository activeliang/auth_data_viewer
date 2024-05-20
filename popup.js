document.getElementById('exportAuth').addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "exportAuthData" });
  });
});

document.getElementById('copyData').addEventListener('click', function () {
  const authData = document.getElementById('authDataContainer');
  authData.select();
  document.execCommand('copy');
});

// 监听响应
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "exportAuthDataResult") {
    document.getElementById('authDataContainer').value = JSON.stringify(request.data, null, 2);
  } else if (request.type === 'uploadAuthData') {
    // alert(JSON.stringify(request.data))
  }
});

document.getElementById('uploadData').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "uploadAuthData" });
  });
});

document.getElementById('importAuth').addEventListener('click', e => {
  if (document.getElementById('authDataContainer').value.replace(/\s/g, '').length == 0) {
    alert('请先在输入框内填入要导入的数据')
    return
  }
  if (!confirm("这会将输入框内的数据，写入当前网页，是否继续？")) return
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "importAuthData", data: document.getElementById('authDataContainer').value });
  });
})

window.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['authDataUploadScope'], function(result) {
    let oldScope = result['authDataUploadScope']
    // 如果本地没有记录随机生成一个
    if (!oldScope || oldScope.replace(/\s/g, '').length == 0) {
      oldScope = Math.random().toString(36).slice(2, 14);
      chrome.storage.local.set({ authDataUploadScope: oldScope }, function () {
        console.log('Data2 is stored locally.');
      });
    }
    document.querySelector('#scopeInput').value = oldScope
    document.querySelector('#scopeInput').addEventListener('change', e => {
      chrome.storage.local.set({ authDataUploadScope: document.querySelector('#scopeInput').value }, function () {
        console.log('Data is stored locally.');
      });
    })
  });
})
