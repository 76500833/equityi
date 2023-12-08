
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
