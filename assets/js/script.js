let activeTickers = {};
let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";
// To do: privitize this tis whole block
let tickerObjects = [];
//populates the activeTickers object with a timestamp, and an array of all active tickers
function populateActiveTickers (){
    let apiUrl = "https://api.polygon.io/v3/reference/tickers?active=true&limit=1000&sort=ticker&apiKey=" + apiKey;
    fetch(apiUrl)
    .then(function(response){
        if (response.status !== 200){
            //To do: display modal clarifying the error
            return new Promise();
        }
        return response.json();
    })
    .then(parseNextPage)
}
function parseNextPage(data){
    if (data){
        tickerObjects = tickerObjects.concat(data.results)
        let nextPage = data.next_url;
        if(nextPage) {
            fetch(nextPage + "&apiKey=" + apiKey)
            .then(function(response){
                if (response.status !== 200){
                    //To do: display modal clarifying the error
                    return new Promise();
                }
                return response.json();
            })
            .then(parseNextPage)
        } else {
            activeTickers.tickerList = tickerObjects.map((i) => i.ticker)
            activeTickers.timeCreated = Math.floor(Date.now() / 1000);
            localStorage.setItem("active-tickers", JSON.stringify(activeTickers)) 
        }
    }    
}
   
if (localStorage.getItem("active-tickers")){
    activeTickers = JSON.parse(localStorage.getItem("active-tickers"))
    if (Math.floor(Date.now() / 1000) - activeTickers.timeCreated >= 86400){ //checks if the local data is older than 24 hours
        populateActiveTickers () 
    }
} else {
    populateActiveTickers()
}

//Displays the stock lookup functionality, and adds event listener to the submit to perform the utility.
$("#stock-look-up-tool").on("click", function (){
    $("main").empty();
    //styling the (entire) form:
    let formEl = $("<form id = 'stock-look-up-form class = 'uk-margin'></form>").css({
        "display": "flex",
        "gap": "20px",
        "flex-direction": "row",
        "margin-top": "15px",
        "margin-left": "20%",
        "margin-right": "20%",


        
        "padding": "20px",
        "border-radius": "10px",
        "color": "black",
        
    })
    //styling the header for the form
    formEl.append($("<label for='ticker-input'>Search by Ticker</label>")).css({
        "font-size": "20px"
        //TODO choose font

        //TODO SEARCH WILL BE TURNED INTO A FUNCTION.
    })
    //styling the
    formEl.append($("<textarea id='ticker-input' name='ticker-input' rows='1' cols='10'></textarea>")).css({
        "outline": "none",
        "border": "none",
        "resize": "none",
        "border-radius": "20px",
    });
    formEl.append($("<input type='submit' id='ticker-input-submit' value='Search'>")).css({
        "outline": "none",
        "border": "none",

    })
    let sectionEl = $("<section>").attr("id", "sectionElForCard")
    $("main").before(sectionEl)
    sectionEl.append(formEl)
   
    return $("#ticker-input-submit").on("click", function (event){
        event.preventDefault()
        let searchedTicker = $("#ticker-input").val().toUpperCase();
        $("#ticker-input").val("")
        if (activeTickers.tickerList.includes(searchedTicker)){
            stockPreviousClose(searchedTicker)
        } else {
            //To do: CHange to modal
            alert("This ticker doesn't exist/isn't currently active")
        }

    });
})

//pressing equity I now clears the data from the page (the stock results)
$("#equityI").on('click', function(){

    $("main").html('')
})



function stockPreviousClose(ticker){
    let apiUrl= "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev?adjusted=true&" + "apiKey=" + apiKey; //concatonates the endpoint

    fetch(apiUrl)
        .then(function(response){
            if (response.status !== 200){
                //To do: display modal clarifying the error
                throw new Error("response status is not 200")
            }
            return response.json();
        })
        .then(function(data){
            

            if (data){
            // To do: add Style to this section element and their children 
                let sectionEl = $("<section>")
                let headerEl = $("<h3>" + data.results[0].T + "</h3>"); //creates a header element with text content of the ticker Title
                sectionEl.append(headerEl);
                let ulEl = $("<ul>");
                let openPriceLiEl = $("<li>Open Price: " + data.results[0].o + "</li>");
                ulEl.append(openPriceLiEl)
                let closePriceLiEl = $("<li>Close Price: " + data.results[0].c + "</li>");
                ulEl.append(closePriceLiEl)
                let highestPriceLiEl = $("<li>Highest Price: " + data.results[0].h + "</li>");
                ulEl.append(highestPriceLiEl)
                let lowestPriceLiEl = $("<li>Lowest Price: " + data.results[0].l + "</li>");
                ulEl.append(lowestPriceLiEl)
                let numOfTransactionsLiEl = $("<li>Number of transactions: " + data.results[0].n + "</li>");
                ulEl.append(numOfTransactionsLiEl)
                let tradingVolumeLiEl = $("<li>Trading Volume: " + data.results[0].v + "</li>");
                ulEl.append(tradingVolumeLiEl)
                let volumeWeightedAvgPrice = $("<li>Volume Weighted Average Price: " + data.results[0].vw + "</li>");
                ulEl.append(volumeWeightedAvgPrice);
                sectionEl.append(ulEl);
                $("main").append(sectionEl);
            }    
        })
    }


//TODO fetch news article and append them to the page.
function getNews() {
    let ticker = $("#searchInput").val().toUpperCase()
    let url = "https://api.polygon.io/v2/reference/news?ticker=" + ticker + "&apiKey=WQO8bPpVFXoHXcm7Uj3d7OeGCtLIMclh"
    console.log(ticker)
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data) {
                //clear main so fresh data will replace it
                
                //start appending data
                //data is ten news articles, but we're just dealing with the first one: [0]
                let sectionEl = $("<section>")
                let headerEl = $("<h1>").text(data.results[0].title);
                let descriptionEl = $("<h2>").text(data.results[0].description)
                sectionEl.append(headerEl)
                sectionEl.append(descriptionEl)
                $("main").append(sectionEl)
            }
        });
}

// fetch request for Polygon API which will get top 5 stocks and bottom 5 stocks
// depending on user input as well as the event listeners
var ulList = document.querySelector("#ulList")
var fetchButton = document.getElementById("fetch-button");

//getApi function is called when the fetchButton is clicked

function getApi() {
  // Inserting Polygon API URL with key into a variable
  var requestUrl = 'https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH'

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // looping over the data object and creating list elements
      for (var i=0; i<5; i++){
        var top5 = data.tickers[i].ticker;
        var listItem = document.createElement("li")
      //   //Set the text of the list element to the JSON response's ticker property
        listItem.textContent = data.tickers[i].ticker;
      }
      //   //Append the li element to the id associated with the ul element.
        ulList.append(listItem);
      // }
    });
}

//fetchButton.addEventListener('click', getApi);
