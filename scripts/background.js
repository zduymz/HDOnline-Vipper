// var client_id=undefined, access_token=undefined;

// chrome.cookies.getAll({"domain": "www.udemy.com"}, function(cookies){
// 	for (var i in cookies){
// 		if(cookies[i].name === 'access_token') access_token=cookies[i].value;
// 		if(cookies[i].name === 'client_id') client_id=cookies[i].value;
// 	}
// 	if (client_id && access_token){
// 		listen();
// 	}
// })


// function listen(){
// 	chrome.runtime.onMessage.addListener(
// 		function(message, sender, sendResponse){
// 			if (message.type ==='open') {
// 				chrome.pageAction.show(sender.tab.id);
// 				sendResponse({client_id:client_id, access_token:access_token});
// 			}
// 			if (message.type === 'show') {
// 				var data = message.data;
// 				var coursename = message.name;
// 				chrome.tabs.create({
// 					url : chrome.runtime.getURL('/download.html'),
// 					active : false },
// 					function(tab) {
// 						var selfTabId = tab.id;
// 						chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
// 							if (changeInfo.status == "complete" && tabId == selfTabId){
// 								var tabs = chrome.extension.getViews({type: "tab"});
// 								console.log(tabs);
// 								for (var i in tabs){
// 									if (!tabs[i].alreadyrun){
// 										tabs[i].showup({'data':data, 'coursename': coursename});
// 									}
// 								}

// 							}
// 						});

// 					});
// 			}
// 		}
// 	);
// }


// chrome.pageAction.onClicked.addListener(function () {
// 	chrome.tabs.executeScript({
// 		code : "main()"
// 	});
// });

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    var token = '000000-' + Math.floor((new Date()).getTime() / 1000) + '-0000';
    var sig = vdecode.encode(token);
    sendResponse({'vtoken':token,'vsig':sig});
});

chrome.pageAction.onClicked.addListener(function() {
    chrome.tabs.executeScript({
        code: "m3u()"
    });
});