var menuContainer = document.getElementById("mainMenu");
var templateButton = document.getElementById("templateButton");
var pageHolderpageHolder; // Make iframe pages global so darkmode can be toggled

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
	newButton.addEventListener("mouseup", buttonHandler);
	
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
	
	chrome.storage.sync.get(function(items) {
		document.body.classList.toggle("darkmode", items.darkmode);
	});
}


// Loads a webpage into the menu
function loadPage(pageURL) {
	clearMenu();
	loadSubmenuUI();

	pageHolder = document.createElement("iframe");
	pageHolder.src = pageURL;
	
	menuContainer.appendChild(pageHolder);
}


// Toggles dark appearance and saves preference to Chrome storage
function toggleDarkMode() {
	document.body.classList.add("darkmodeAnimations");
	document.body.classList.toggle("darkmode");
	chrome.storage.sync.set({
		darkmode: document.body.classList.contains("darkmode")
	});
	
	// Refresh iFrames to let them load darkmode
	if (pageHolder) pageHolder.contentWindow.location.reload();
}


// Load main menu on page start
loadMenu("mainMenu");


// Load handlers
document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);