
// Opens a URL with support for Chrome extensions
function openURL(urlToOpen) {
	if (chrome.tabs) {
		chrome.tabs.create({ url: urlToOpen });
	} else {
		window.open(urlToOpen, "_blank");
	}
}


/*
	Replaces tokens in a string with variables
		stringToFormat - String to process with tokens for args
		represented using {<arg index>}
		args - The arguements to be put into the string
		
	Example:
		formatString("hello {1}, {2}", "Joey", "how are you?");
			returns
		"hello Joey, how are you?"
*/
function formatString(stringToFormat, ...args) {
	for (var i = 0; i < args.length; i++) {
		stringToFormat = stringToFormat.replace("{" + i + "}", args[i] || "")
	}
	return stringToFormat
}