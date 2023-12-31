//creates the modal thats dinamically displayed
var modalDiv = document.createElement("div");
modalDiv.setAttribute("id", "modal")
modalDiv.setAttribute("uk-modal", "")
modalDiv.setAttribute("class", "uk-width-1-1")

var modalBodyDiv = document.createElement("div");
modalBodyDiv.setAttribute("class","uk-modal-dialog uk-modal-body");
modalBodyDiv.setAttribute("uk-overflow-auto","")

var modalCloseBtn = document.createElement("button");
modalCloseBtn.setAttribute("class", "uk-modal-close-default");
modalCloseBtn.setAttribute("type", "button");
modalCloseBtn.setAttribute("uk-close", "");

var stockName = document.createElement("h3");
stockName.setAttribute("class","uk-modal-title");

var stockDescription = document.createElement("p");
var stock50DayMovingAverage = document.createElement("p");
var stock52WeekHigh = document.createElement("p");
var stock52WeekLow = document.createElement("p");

modalDiv.append(modalBodyDiv);
modalBodyDiv.append(modalCloseBtn)
modalBodyDiv.append(stockName)
modalBodyDiv.append(stockDescription)
modalBodyDiv.append(stock50DayMovingAverage)
modalBodyDiv.append(stock52WeekHigh)
modalBodyDiv.append(stock52WeekLow)
document.querySelector("body").append(modalDiv)


let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";

// fetch request for Polygon API which will get top 5 stocks and bottom 5 stocks
function getApiTop() {
  var sectionContainer = document.querySelector("#top-container");

  // Inserting Polygon API URL with key into a variable
  var requestUrl =
    "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";

  fetch(requestUrl)
    .then(function (response) {
      if (response.status === 404) {
        console.log("Error 404") // could also display error message to the web
      }
      return response.json();
    })
    .then(function (data) {
      
      var olList = document.createElement("ol");
      var header = document.createElement("h2");
      header.textContent = "Top 5 Movers";
      sectionContainer.append(header);
      // looping over the data object and creating list elements
      for (var i = 0; i < 5; i++) {
        var listItem = document.createElement("li");
        //Set the text of the list element to the JSON response's ticker property
        listItem.textContent = data.tickers[i].ticker;
        listItem.dataset.tickerName = data.tickers[i].ticker;
        olList.append(listItem);
        sectionContainer.append(olList);

        //creating ul elements that will be nested inside each ordered list element
        var ulList = document.createElement("ul");
        listItem.append(ulList);

        //creating nested li elements
        var changePercentageEl = document.createElement("li");
        var openingPriceEl = document.createElement("li");
        var highPriceEl = document.createElement("li");
        var closingPriceEl = document.createElement("li")

        //Adding text content to nexted li's
        changePercentageEl.textContent = "Todays change percentage: " + Math.floor(data.tickers[i].todaysChangePerc) + "%";
        openingPriceEl.textContent = "Opening price: $" + data.tickers[i].day.o;
        highPriceEl.textContent = "Highest Price: $" + data.tickers[i].day.h;
        closingPriceEl.textContent = "Closing price: $" + data.tickers[i].day.c;
        ulList.append(changePercentageEl);
        ulList.append(openingPriceEl);
        ulList.append(highPriceEl);
        ulList.append(closingPriceEl);
      }
      getApiBottom()
    });
}

//fetch request for polygon to pull the bottom 5
function getApiBottom() {
  var sectionContainer = document.querySelector("#bottom-container");
  var header = document.createElement("h2");
  header.textContent = "Bottom 5 Movers";
  sectionContainer.append(header);

  // Inserting Polygon API URL with key into a variable
  var requestUrl = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH"

  fetch(requestUrl)
    .then(function (response) {
      if (response.status === 404) {
        console.log("Error 404") // could also display error message to the web
      }
      return response.json();
    })
    .then(function (data) {
      var olList = document.createElement("ol");

      // looping over the data object and creating list elements
      for (var i = 0; i < 5; i++) {

        var listItem = document.createElement("li")

        //Set the text of the list element to the JSON response's ticker property
        listItem.textContent = data.tickers[i].ticker;
        listItem.dataset.tickerName = data.tickers[i].ticker;
        olList.append(listItem);
        sectionContainer.append(olList);
        //creating ul elements that will be nested inside each ordered list element
        var ulList = document.createElement("ul");
        listItem.append(ulList);

        //creating nested li elements
        var changePercentageEl = document.createElement("li");
        var openingPriceEl = document.createElement("li");
        var highPriceEl = document.createElement("li");
        var closingPriceEl = document.createElement("li")

        //Adding text content to nested li's
        changePercentageEl.textContent = "Todays change percentage: " + Math.floor(data.tickers[i].todaysChangePerc) + "%";
        openingPriceEl.textContent = "Opening price: $" + data.tickers[i].day.o;
        highPriceEl.textContent = "Highest Price: $" + data.tickers[i].day.h;
        closingPriceEl.textContent = "Closing price: $" + data.tickers[i].day.c;
        ulList.append(changePercentageEl);
        ulList.append(openingPriceEl);
        ulList.append(highPriceEl);
        ulList.append(closingPriceEl);
      }

      //selects all nodes with "data-ticker-name" attribute, then applied an event listener to each
      let allTickers = document.querySelectorAll("[data-ticker-name]")
     allTickers.forEach(function (node){
      node.addEventListener("click", function (event) {
        var tickerName;
        if (event.target.dataset.tickerName){
         tickerName = event.target.dataset.tickerName;
        } else {
         tickerName = event.target.parentElement.parentElement.dataset.tickerName;
        }
        
        var alphaVantageKey = "MVOISL9RC4Y4A2DR";
        var apiUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + tickerName + "&apikey=" + alphaVantageKey;
        fetch(apiUrl)
          .then(function (response) {
            if (response.status !== 200) {
              throw new Error("Not 200 response");
            }
            return response.json();
          })
          .then(function (data) {

            stockName.textContent = "Stock Name: " + data.Name;
            stockDescription.textContent = "Description: " + data.Description;
            stock50DayMovingAverage.textContent = "50 day moving average: " + data["50DayMovingAverage"]
            stock52WeekHigh.textContent = "52 week high: " + data["52WeekHigh"]
            stock52WeekLow.textContent = "52 week low: " + data['52WeekLow']
            
            UIkit.modal(modalDiv).show()

          })
          .catch(function (error) {
            console.log("Error:", error);
          });
      })
     })
     
    }
    )
}

getApiTop()
