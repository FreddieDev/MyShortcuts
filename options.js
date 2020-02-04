var menuContainer = document.getElementById("mainMenu");
var templateButton = document.getElementById("templateButton");

// Opens a URL with support for Chrome extensions
function openURL(urlToOpen) {
	if (chrome.tabs) {
		chrome.tabs.create({ url: urlToOpen });
	} else {
		window.open(urlToOpen, "_blank");
	}
}

// Click handler for menu buttons
function buttonHandler() {
	var type = this.getAttribute("type");
	var target = this.getAttribute("target");
	
	switch(type) {
		case "url":
			openURL(target);
			break;
		case "menu":
			loadMenu(target);
			break;
		case "page":
			loadPage(target);
			break;
	}
}

// Returns a menu button as a dom element
function buildMenuButton(buttonObj) {
	var newButton = templateButton.cloneNode(true);
	newButton.id = null;
	
	newButton.setAttribute("type", buttonObj.type);
	newButton.setAttribute("target", buttonObj.target);
	newButton.style.background = buttonObj.background;
	newButton.querySelector("i").classList.add(buttonObj.icon);
	newButton.querySelector("span").innerText = buttonObj.text;
	newButton.addEventListener("click", buttonHandler);
	
	return newButton;
}

// Clears buttons from currently loaded menu
function clearMenu() {
	var range = document.createRange();
	range.selectNodeContents(menuContainer);
	range.deleteContents();
}

// Adds a "Back" button and a splitter
function loadSubmenuUI() {
	var backButton = buildMenuButton(subMenuBackButton);
	menuContainer.appendChild(backButton);
	
	var splitter = document.createElement("div");
	splitter.classList.add("cap-menu-splitter");
	menuContainer.appendChild(splitter);
}

// Loads a menu from JSON by its key/name
function loadMenu(menuName) {
	clearMenu();
	if (menuName != "mainMenu") loadSubmenuUI();
	
	menus[menuName].forEach(function(buttonObj) {
		var newButton = buildMenuButton(buttonObj);
		
		menuContainer.appendChild(newButton);
	});
}


// Loads a webpage into the menu
function loadPage(pageURL) {
	clearMenu();
	loadSubmenuUI();

	var pageHolder = document.createElement("iframe");
	pageHolder.src = pageURL;
	
	menuContainer.appendChild(pageHolder);
}



// Load main menu on page start
loadMenu("mainMenu");