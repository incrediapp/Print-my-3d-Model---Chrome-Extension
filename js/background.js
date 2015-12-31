var objs = [];

var blacklist = ['google-analytics.com/', 'marketplace.autodesk.com', 'AKIAJKBLD5HRBQ557RSA'];

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(needle) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === needle) {
				return i;
			}
		}
		return -1;
	};
}

var checkRequest = function (details) {
	if (details.url.indexOf('.obj') !== -1 || details.url.indexOf('.stl') !== -1) {
		console.log("FOUND OBJ or STL! " + details.url);
		var blacklisted = false;
		if (objs.indexOf(details.url) === -1) {
			for (var i=0; i < blacklist.length; i++) {
				// Make sure it's not blacklisted
				if (details.url.indexOf(blacklist[i]) !== -1) {
					blacklisted = true;
					break;
				}
			}

			if (!blacklisted) {
				objs.push(details.url);
				//chrome.storage.local.set({'objs': objs});
				chrome.browserAction.setBadgeText({text: '' + objs.length});
			}
		}
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



