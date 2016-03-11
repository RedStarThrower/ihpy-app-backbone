//console.log(Backbone)

var accessKey = "dc6zaTOxFJmzC"

// ---------- Model ---------- //

var ScrollModel = Backbone.Model.extend( { // endpoint: search URL: "http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC
	_apiKey: accessKey,
	url: "http://api.giphy.com/v1/gifs/search",
})

var DetailModel = Backbone.Model.extend ({ //<= make new model for new endpoint: http://api.giphy.com/v1/gifs/feqkVgjJpYtjy?api_key=dc6zaTOxFJmzC
	_apiKey: accessKey,
	url: "http://api.giphy.com/v1/gifs/"
})

// ---------- Views ---------- // Look over View Events in Backbone documentation

var ScrollView = Backbone.View.extend({
	el: "#container",

	initialize: function(someModel) { //<= model and view meet each other
		this.model = someModel 
		var boundRenderFunction = this._render.bind(this)
		//this.model.on("sync", this._render) //<= "this" loses context if not bound
		this.model.on("sync", boundRenderFunction) //<= as soon as the info loads, render it right away (replace .then)
	},

	events: { // <= Creates an event to switch views 
		"click img": "_triggerDetailView"
	},

	_triggerDetailView: function(clickEvent) {
		//console.log(clickEvent.target) //<= testing; logs where the click happened
		var imgNode = clickEvent.target
		window.location.hash = "detail/" + imgNode.getAttribute("gifid") //<= adding each id to the URL after the hash in order to inform the Router to change the view
	},

	_render: function() { // <= promise handler
		console.log(this.model) //<= testing that the view and model are connected thorugh a promise in the View; "this" is out of context as a callback (not on the View anymore, must be bound); when bound in Router, will console.log the model object
		var dataArray = this.model.get("data") //<= "get" gets into the attributes
		var gifUrlString = ""
		for (var i = 0; i < dataArray.length; i++) {
			var gifObj = dataArray[i]
			//console.log(gifObj)
			var imageURL = gifObj.images.original.url
			//console.log(imageURL) //<= checking that you're grabbing the right object
			var gifId = gifObj.id
			//console.log(gifId)			
			gifUrlString += '<img gifid="' + gifId + '" class="gifScroll" src="' + imageURL + '">' //<= can add any attribute to the img tag (ex: friend="wensie")
		}
		this.el.innerHTML = gifUrlString
	}
})

var DetailView = Backbone.View.extend ({
	el: "#container",

	initialize: function(someModel) { //<= model and view meet each other
		this.model = someModel 
		var boundRenderFunc = this._render.bind(this)
		//this.model.on("sync", this._render) //<= "this" loses context if not bound
		this.model.on("sync", boundRenderFunc) //<= as soon as the info loads, render it right away (replace .then)
	},

	_render: function() {
		//console.log(this.model)
		var gifUrl = this.model.attributes.data.images.original.url
		//console.log(gifUrl)
		this.el.innerHTML = '<img src="' + gifUrl + '"></img>'
	}
})
// ---------- Router ---------- //
//routes:
//scroll view
//detail view
var IphyRouter = Backbone.Router.extend ({

	routes: {
		"scroll/:query": "handleScrollView",
		"detail/:id": "handleDetailView"
	},

	handleScrollView: function(query) {
		var sm = new ScrollModel()
		var nv = new ScrollView(sm)
		var promise = sm.fetch({
			// dataType: "jsonp", //<= may need for Etsy or &callback=?
				data: {
					q: query,
					api_key: sm._apiKey,
					//callback: "?"
				}
		})
		//promise.then(function(jsonData) {
			//console.log(jsonData) //<= just to test the model and see the object. Must add #search/Cats into the URL
		//})
		//promise.then(nv._render.bind(nv)) //<= checking that the model and view are connected and the render method works; binding the callback's "this" to the View	
	},

	handleDetailView: function(gifId) {
		// create a request for the gif with a particular id; need new model and view
		console.log("...ROUTER-handleDataView")
		//console.log(gifId)
		var singleModel = new DetailModel() // <= create instance of Model
		var detailView = new DetailView(singleModel) // <= create instance of View
		singleModel.url += gifId
		//console.log(singleModel.url)
		singleModel.fetch({
			data: {
				api_key: singleModel._apiKey
			}
		})
		//promise.then(function(jsonData){
			//console.log(jsonData)
			//promise.then(detailView._render.bind(detailView))
		//})
	},

	
	initialize: function() { //<= start listening for hash change events
		Backbone.history.start()
	}
})

var iphyRouter = new IphyRouter() //<= launches router; everything goes into motion
