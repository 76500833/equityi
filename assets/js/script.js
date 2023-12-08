let activeTickers = {};
let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";
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



//$().on("click",StockPreviousClose($().val))


function stockPreviousClose(ticker){
    let apiUrl= "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev?adjusted=true&" + "apiKey=" + apiKey; //concatonates the endpoint

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
