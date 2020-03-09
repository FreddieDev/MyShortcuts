// Loads field values from Chrome storage
function loadFieldsFromStorage() {
    chrome.storage.sync.get({
        hotelSearch_CodeName: null,
        hotelSearch_MaxPrice: null,
        hotelSearch_StartDay: null,
        hotelSearch_EndDay: null,
		
		darkmode: false,
    }, function(items) {
        document.getElementById("areaCodeField").value = items.hotelSearch_CodeName;
        document.getElementById("maximumPriceField").value = items.hotelSearch_MaxPrice;
        document.getElementById("startDayField").value = items.hotelSearch_StartDay;
        document.getElementById("endDayField").value = items.hotelSearch_EndDay;
		
		document.body.classList.toggle("darkmode", items.darkmode);
    });
}

// Instructs user how to get an Egencia search URL, then opens an Egencia hotel search
function fillFieldsHelp() {
    let start = confirm(`To fill these fields, you'll need to complete a manual search.\n
Steps:
1. An Egencia search will popup
2. Complete the fields and press "SEARCH HOTELS"
3. Once the page loads a list of hotels, copy the website address
4. Reopen this menu, select "Get Fields" and then "Load"
5. Paste the Egencia URL into the popup`);

    if (start) {
        openURL("https://www.egencia.co.uk/home/hotel-search/");
    }
}


// Requests a hotel search URL and uses it to fill out (and save) fields in extension
function fillFieldsLoad() {
    let searchURLStr = prompt("Please paste your Egencia hotel search URL:");

    let searchParams;
    try {
        if (!searchURLStr.includes("egencia.co.uk/hotels/search?")) throw "Not egencia URL";
        searchParams = new URL(searchURLStr).searchParams;
    } catch {
        alert("ERROR: Text is not a valid Egencia hotel search URL.");
        return;
    }

    const startDate = egenciaDateStrToDate(searchParams.get("start_date"));
    const endDate = egenciaDateStrToDate(searchParams.get("end_date"));
    
    chrome.storage.sync.set({
        hotelSearch_CodeName: searchParams.get("destination"),
        hotelSearch_MaxPrice: parseInt(searchParams.get("max_price")) || null,
        hotelSearch_StartDay: dayNumToStr(startDate.getDay()),
        hotelSearch_EndDay: dayNumToStr(endDate.getDay()),
    }, loadFieldsFromStorage);
}

// Shows the fields-finder UI
function toggleGetFieldsUI() {
    this.disabled = true;
    document.getElementById("getFieldsButtons").style.visibility = "visible";
}



// Register handlers
document.getElementById("getFieldsButton").addEventListener("click", toggleGetFieldsUI);
document.getElementById("getFieldsHelp").addEventListener("click", fillFieldsHelp);
document.getElementById("getFieldsLoad").addEventListener("click", fillFieldsLoad);

document.getElementById("searchButton").addEventListener("click", function(e) {
    const codeName = document.getElementById("areaCodeField").value;
    const maxPrice = document.getElementById("maximumPriceField").value;
    const startingDay = document.getElementById("startDayField").value;
    const endingDay = document.getElementById("endDayField").value;

    // Save any changes to chrome storage
    chrome.storage.sync.set({
        hotelSearch_CodeName: codeName,
        hotelSearch_MaxPrice: parseInt(maxPrice) || null,
        hotelSearch_StartDay: startingDay,
        hotelSearch_EndDay: endingDay,
    });

    const unformattedURL = "https://www.egencia.co.uk/hotels/search?" +
					"&destination={0}" + 
					"&start_date={1}" + 
					"&end_date={2}" + 
					"&max_price={3}" +
					
					"&radius_unit=km" + 
					"&adults=1" + 
					"&min_stars=0" + 
					"&sort_type=preferred";
					
					"&gaia_id=4597" +
					"&company_id=22776" + 
					"&search_type=CITY" + 
					"&verbosity=1" + 
					"&start=0" + 
					"&count=30" + 
					"&source=HOTEL_WEBAPP" + 
					"&source_version=1.0" + 
                    "&page=SEARCH_RESULTS";
    
    const startDate = getNextDayOfTheWeek(startingDay);
    const endDate = getNextDayOfTheWeek(endingDay, false, new Date(startDate.getTime()));

    const newURL = formatString(unformattedURL, codeName, dateToEgenciaDateStr(startDate), dateToEgenciaDateStr(endDate), maxPrice);
    openURL(newURL);
});

loadFieldsFromStorage();