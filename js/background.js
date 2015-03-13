var value = 0.0;
var response = "";

function readTicker() {
	
	// Consultando API da Foxbit
	var xhr	= new XMLHttpRequest();
	xhr.open("GET", "https://api.blinktrade.com/api/v1/BRL/ticker?crypto_currency=BTC");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				
				// Obtendo a resposta e parseando o JSON.
				response = xhr.responseText;
				var resp = JSON.parse(response);

				// Preparando o texto a ser impresso
				var textToPrint = "Um Bitcoin hoje custa R$";
				var amount = resp["last"];
				textToPrint = ""+amount.toPrecision(3);
				
				// Determina cor de fundo do "badge"
				if (amount>value){
					chrome.browserAction.setBadgeBackgroundColor({color: "#00CC00"});
				} else {
					chrome.browserAction.setBadgeBackgroundColor({color: "#CC0000"});
				}
				value = amount;
				
				// Setando texto
				chrome.browserAction.setBadgeText({text: textToPrint});
			}
		}
	}

	xhr.send();
}

function onAlarm(alarm) {
	if (alarm && alarm.name == 'refresh') {
		readTicker();
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.request == "request")
			sendResponse({data: response});
	}
);

// Criando alarme para atualizar a cada 1 minuto.
chrome.alarms.create('refresh', {periodInMinutes: 1.0});
chrome.alarms.onAlarm.addListener(onAlarm);

// Lendo o ticker.
readTicker();