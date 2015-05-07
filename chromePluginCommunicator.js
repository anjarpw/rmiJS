var ChromeReceiver=function(chrome){
	var receiver = new MessageBasedReceiver();
	receiver.messageExtractor=function(evt){
		var methodName=evt.request.methodName;
		var args=evt.request.args;
		return {
			methodName:methodName,
			args:args
		};
	};
	receiver.replyMessage=function(evt,returnValue){
		evt.sendResponse(returnValue);
	};
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {		
		receiver.onMessageReceived({
			request:request,
			sender:sender,
			sendResponse:sendResponse
		});
	});
	return receiver;
};

var ChromeBackgroundSender=function(chrome){
	var sender=new MessageBasedSender();
	sender.chrome=chrome;
	sender.sendMessage = function(message, callback){
		var t=this;
		this.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			t.chrome.tabs.sendMessage(tabs[0].id, message, callback);
		});	
	};
	return sender;	
};
var ChromeContentSender=function(chrome){
	var sender=new MessageBasedSender();
	sender.chrome=chrome;
	sender.sendMessage = function(message, callback){
		this.chrome.runtime.sendMessage(message, callback);
	};
	return sender;	
};


