
//$().on("click",StockPreviousClose($().val))
let apiKey = "";

function stockPreviousClose(ticker){
    apiUrl= "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev?adjusted=true&" + "apiKey=" + apiKey; //concatonates the endpoint

    fetch(apiUrl)
        .then(function(response){
            if (response.status !== 200){
                //To do: display modal clarifying the error
                return new Promise();
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
                let numOfTransactionsLiEl = $("<li>Number of Transactions: " + data.results[0].n + "</li>");
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

fetchButton.addEventListener('click', getApi);