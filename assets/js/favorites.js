
let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";

let savedFavorites = [];
(function () {
    if (localStorage.getItem("saved-favorites")) {
        savedFavorites = JSON.parse(localStorage.getItem("saved-favorites"))
        for (let i = 0; i < savedFavorites.length; i++) {
            stockPreviousClose(savedFavorites[i])
        }
    } else {
        //display modal saying you currently dont have any favorites saved
    }
})()

//run stockPreviousClose(favorites array) to display onto favorites page
function stockPreviousClose(ticker) {
    let apiUrl =
        "https://api.polygon.io/v2/aggs/ticker/" +
        ticker +
        "/prev?adjusted=true&" +
        "apiKey=" +
        apiKey; //concatonates the endpoint

    fetch(apiUrl)
        .then(function (response) {
            if (response.status !== 200) {
                //To do: display modal clarifying the error
                return new Promise();
            }
            return response.json();
        })
        .then(function (data) {
            if (data) {
                let tickerSymbol = data.results[0].T;
                let divEl = $("<div>").attr("id", tickerSymbol);
                let sectionEl = $("<section>").attr("id", "card");
                let headerEl = $("<h3>" + tickerSymbol + "</h3>"); //creates a header element with text content of the ticker Title
                sectionEl.append(headerEl);

                //adding close btn
                let closeBtn = $("<button " + "class = 'uk-position-absolute " +
                    "uk-position-small " +
                    "uk-position-top-right' " +
                    "type='button' uk-close></button>");


                sectionEl.append(closeBtn)
                //! adding favorite button
                let favoriteButton = $("<button>")
                    .attr("class", "favorite-button")
                    .css({
                        "height": "fit-content",
                        "width": "fit-content",
                        "margin": "auto",
                    })
                    .text("Favorite");
                //! appending favorite button
                sectionEl.append(favoriteButton);

                let ulEl = $("<ul>").css({
                    "list-style": "none",
                    padding: "10px",
                    margin: "0",
                });
                let openPriceLiEl = $("<li>Open Price: " + data.results[0].o + "</li>");
                ulEl.append(openPriceLiEl);
                let closePriceLiEl = $(
                    "<li>Close Price: " + data.results[0].c + "</li>"
                );
                ulEl.append(closePriceLiEl);
                let highestPriceLiEl = $(
                    "<li>Highest Price: " + data.results[0].h + "</li>"
                );
                ulEl.append(highestPriceLiEl);
                let lowestPriceLiEl = $(
                    "<li>Lowest Price: " + data.results[0].l + "</li>"
                );
                ulEl.append(lowestPriceLiEl);
                let numOfTransactionsLiEl = $(
                    "<li>Number of transactions: " + data.results[0].n + "</li>"
                );
                ulEl.append(numOfTransactionsLiEl);
                let tradingVolumeLiEl = $(
                    "<li>Trading Volume: " + data.results[0].v + "</li>"
                );
                ulEl.append(tradingVolumeLiEl);
                let volumeWeightedAvgPrice = $(
                    "<li>Volume Weighted Average Price: " + data.results[0].vw + "</li>"
                );

                ulEl.append(volumeWeightedAvgPrice);

                headerEl.css({
                    color: "white",
                });
                sectionEl.css({
                    "display": "flex",
                    "color": "white",
                    "background-color": "#080097",
                    "flex-direction": "column",
                    "width": "fit-content",
                    "text-align": "center",
                    "position": "relative",
                    "border-radius": "10px",
                    "padding": "15px",
                    "margin": "45px",
                });
                sectionEl.append(ulEl);
                divEl.append(sectionEl);
                $("main").append(divEl);
                //makes the close button erase the div that contains it, and removes it from the displayed tickers array
                closeBtn.attr("id", tickerSymbol + "-btn")
                $("#" + tickerSymbol + "-btn").on("click", function () {
                    $("#" + tickerSymbol).remove()
                    let index = displayedTickers.indexOf(tickerSymbol)
                    displayedTickers.splice(index, 1)
                })
            }
        });
}