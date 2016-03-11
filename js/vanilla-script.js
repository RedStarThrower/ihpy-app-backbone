console.log('hello') 
console.log($) //test to verify that JSON library is loaded

//http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC   

// ----------- Global Variables -------------- //
var apiKey = "dc6zaTOxFJmzC"

var baseUrl = "http://api.giphy.com/v1/gifs/search"   

var containerEl = document.querySelector("#container"), 
	scrollButton = document.querySelector('#buttons button[value="scroll"]'), 
	infoGridButton = document.querySelector('#buttons button[value="infoGrid"]')
//container attachment to HTML sheet 

// ----------- Functions -------------- //


var arrayToHtml = function(arrayData) {  //We want to iterate over the array data, using it to build an htmlString that we will output.

	// Initializes the empty string of HTML that we will build. 
	var htmlString = ''

	for(var i=0; i < 5; i++){ //We'll only use the first five images.
		console.log(arrayData[i]) //Trying to access each of the items in the array
		var imgObj = arrayData[i] //Each item in the array is an object representing an image.

		htmlString += '<img class="gifScroll" src="' + imgObj.images.original.url + '"/>' //the url attribute somewhere deeply nested in the imgobj gives us a link to a gif, which can become the src attribute in our image tag. We concatenate each new img string onto our "running" htmlString.

	}

	return htmlString
}

var changeView = function(event) { // this function should change the hash depending on what button was clicked. we'll let the controller take it from there. 

	var buttonEl = event.target, // target = the node wherein the event occured
		currentQuery = location.hash.split('/')[1] // before we rewrite the hash, we want to make sure we preserve the query value from the pre-existing hash
		// Location.hash stores the text that comes after the # in the url. The split will separate the view type from the search term, storing the two of them in a short array. We want to locate the actual query word, which will be at index 1 in the array. Then this will be assigned to the variable currentQuery.

	location.hash = buttonEl.value + '/' + currentQuery // What we're changing is the view type, which was stored in the button's value attribute (check the html to verify this). After that, we tack on the old currentQuery that we read from the hash. 
}

var hashController = function(){ // Will read the hash and invoke the proper function
	
	var route = window.location.hash.substring(1) //route stores whatever comes after the # (but does not include the '#', because we substringed it out)
	var routeParts = route.split('/'), // We want to split "<view type>/<search word>" into an array, so that we can separate the view type from the search term and store them in separate variables. 
		viewType = routeParts[0], // Once we split into an array, viewType will be assigned to inde wx 0, which is the button value/view type.
		currentQuery = routeParts[1] //Also from the array, currentQuery will now be assigned to index 1 which is the search word

	if (viewType === "scroll") { 
		renderScrollView(currentQuery)
		// this is the only one that actually does anything atm
	} 
	else if (viewType === "infoGrid") {
		renderGridView(currentQuery)
	}

	else if (viewType === "detail") {
		renderDetailView(currentQuery)
	} // These if statements will determine which function is run based on which button (and therefore, button value) is called. We pass in the search word (currentQuery), since each view function will need to perform a new getJSON request, and it will need to know which query to use. 
} 	

var renderGridView = function(query) {
 // Need to figure this one out later!
}

var renderScrollView = function(query) { //This function will run when the condition in our hashController function is met (so, when viewType === "scroll")
	
	var paramObj = { //This is what's' being passed through our url, and the url is being passed through our promise. The json library will do its thang. I.e. this object will be parsed into a parameter string of the form "?key=value&key2=value2..." and concatenated onto our baseUrl.
	    q: query,
	    api_key: apiKey
	}

	var gifPromise = $.getJSON(baseUrl, paramObj) // Defining the promise. The baseUrl and paramObj will be passed through and json will make a request to the giphy api and return a promise that waits for that request to be fulfilled.
	
	var handleData = function(JSONData) { // This function will read the jsonData and use parts of it to write html into our container.
	    console.log(JSONData)
		containerEl.innerHTML = arrayToHtml(JSONData.data) //we add the .data because the array of gifs is stored on a .data property on the response object.
	}

	gifPromise.then(handleData) //Once the data has been retrieved, our promise will run our handleData function
}


// ----------- Event Listeners -------------- //

window.addEventListener("hashchange", hashController)
// The hashchange is a special event. The hashchange means that as soon as the words ater the # changes, the window will invoke a certain function, in this case the hashController.

scrollButton.addEventListener("click",changeView) 
// Click is our event. When the scroll button is clicked the changeView function will be invoked. 

infoGridButton.addEventListener("click",changeView)
// Click again is our event. When the infoGrid button is clicked, the changeView function will yet again be invoked.


// ----------- Kick things off! -------------- //

hashController() // If the page is being loaded for the first time, there is no hash*change* event! so, 
// in this example, we manually invoke the hashController on the first page load. this is not always
// the way things will happen. 

