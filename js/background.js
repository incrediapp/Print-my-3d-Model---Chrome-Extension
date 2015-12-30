var objs = [];

var checkRequest = function (details) {
	if (details.url.indexOf('.obj') !== -1 || details.url.indexOf('.stl') !== -1) {
		console.log("FOUND OBJ or STL! " + details.url);
		objs.push(details.url);
		//chrome.storage.local.set({'objs': objs});
		chrome.browserAction.setBadgeText({text: '' + objs.length});
	}
};

var filter = {urls: ["<all_urls>"]};

chrome.webRequest.onBeforeRequest.addListener(checkRequest, filter);

chrome.browserAction.onClicked.addListener(function(activeTab)
{
	chrome.tabs.create({ url: 'popup.html' });
});

chrome.runtime.onMessage.addListener (
	function(request, sender, sendResponse) {
		if (request.gimme) {
			sendResponse({takeit: objs});
		}
	}
);



