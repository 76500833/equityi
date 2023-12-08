
//$().on("click",StockPreviousClose($().val))
let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";

// called when a specific ticker is searched (in search.html)
function search() {
    let ticker = $("#searchInput").val().toUpperCase()
    stockPreviousClose(ticker)
}

function stockPreviousClose(ticker){
    apiUrl= "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev?adjusted=true&" + "apiKey=" + apiKey; //concatonates the endpoint
    
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


function performSearch() {
    $("main").empty();

    search()
    getNews()
}

// document.getElementById('searchForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the form from being submitted normally
//     performSearch();
// });