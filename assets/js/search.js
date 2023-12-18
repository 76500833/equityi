let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";
let activeTickers = {};

let tickerObjects = [];
//populates the activeTickers object with a timestamp, and an array of all active tickers
function populateActiveTickers() {
  let apiUrl =
    "https://api.polygon.io/v3/reference/tickers?active=true&limit=1000&sort=ticker&apiKey=" +
    apiKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.status !== 200) {
        UIkit.modal.alert("Bad request, try again")
        return new Promise();
      }
      return response.json();
    })
    .then(parseNextPage);
}
//populates the Saved Favorites from local storage
let savedFavorites = [];
(function () {
  if (localStorage.getItem("saved-favorites")) {
    savedFavorites = JSON.parse(localStorage.getItem("saved-favorites"));
  }
})();
/**
 * Parses the next page of data and updates the tickerObjects array.
 * If there is a next page, it fetches the data using the provided apiKey and recursively calls itself.
 * Once all pages have been parsed, it updates the activeTickers object and stores it in the local storage.
 * @param {Object} data - The data object containing the results and next_url.
 */
function parseNextPage(data) {
  if (data) {
    tickerObjects = tickerObjects.concat(data.results);

    let nextPage = data.next_url;
    if (nextPage) {
      fetch(nextPage + "&apiKey=" + apiKey)
        .then(function (response) {
          if (response.status !== 200) {
            UIkit.modal.alert("Bad request, try again")
            return new Promise();
          }
          return response.json();
        })
        .then(parseNextPage);
    } else {
      //.map looks at each object one by one, calls it i, and looks at its .ticker (the ticker)
      // and creates a new list inside of activeTickers object, assigning the tickers into the list.
      activeTickers.tickerList = tickerObjects.map((i) => i.ticker);
      //tracks when active tickers was last updated
      activeTickers.timeCreated = Math.floor(Date.now() / 1000);
      //puts object in local storage
      localStorage.setItem("active-tickers", JSON.stringify(activeTickers));
    }
  }
}

if (localStorage.getItem("active-tickers")) {
  activeTickers = JSON.parse(localStorage.getItem("active-tickers"));
  if (Math.floor(Date.now() / 1000) - activeTickers.timeCreated >= 86400) {
    //checks if the local data is older than 24 hours
    populateActiveTickers();
  }
} else {
  populateActiveTickers();
}

let displayedTickers = [];

//Displays the stock lookup functionality, and adds event listener to the submit to perform the utility.
(function () {
  let formEl = $(
    "<form id = 'stock-look-up-form' class = 'uk-margin'></form>"
  ).css({
    display: "flex",
    gap: "20px",
    "flex-direction": "row",
    "margin-top": "15px",
    "margin-left": "auto",
    "margin-right": "auto",
    "width": "50%",
    "padding": "20px",
    "border-radius": "10px",
    "background-image": "linear-gradient(135deg, #000000 0%, #001652 50%, #000000 100%)",
    "align-items": "center",
    color: "white",
    "justify-content": "space-evenly"
  });
  //styling the header for the form
  formEl.append($("<label for='ticker-input'>Search by Ticker</label>")).css({
    "font-size": "20px",
  });
  //styling the
  formEl.append(
    $(
      "<textarea id='ticker-input' name='ticker-input' rows='1' cols='10'></textarea>"
    ).css({
      outline: "none",
      border: "none",
      resize: "none",
      "border-radius": "5px",
      "text-align": "center",
      height: "20px", // Set a specific height
      "line-height": "20px", // Set line-height equal to the height
      "width": "14%"
    })
  );
  formEl.append(
    $("<input type='submit' id='ticker-input-submit' value='Search'>").css({
      "background-color": "#001652",
      "width": "20%",
      "margin-left": "15%"
    })
  );

  let sectionEl = $("<section>").attr("id", "sectionElForCard");
  sectionEl.css({
    display: "flex",
    "justify-content": "center",
  });

  $("main").before(sectionEl);

  sectionEl.append(formEl);

  $("#ticker-input").on("keydown", function (event) {
    if (event.originalEvent.key == "Enter") {
      event.preventDefault();
      $("#ticker-input-submit").trigger("click");
    }
  });

  $("#ticker-input-submit").on("click", function (event) {
    event.preventDefault();
    let searchedTicker = $("#ticker-input").val().toUpperCase();
    $("#ticker-input").val("");

    if (displayedTickers.includes(searchedTicker)) {
      UIkit.modal.alert("You already have this ticker displayed");
      return;
    }

    if (activeTickers.tickerList.includes(searchedTicker)) {
      displayedTickers.push(searchedTicker);
      stockPreviousClose(searchedTicker);
    } else {
      UIkit.modal.alert("This ticker doesn't exist/isn't currently active");
    }
  });
})();

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
        UIkit.modal.alert("Bad request, try again")
        return new Promise();
      }
      return response.json();
    })
    .then(function (data) {
      if (data) {
        let tickerSymbol = data.results[0].T;
        let divEl = $("<div>").attr("id", tickerSymbol);

        let sectionEl = $("<section>").attr("id", "card").css({
          display: "flex",
          "justify-content": "center",
          "background-image": "linear-gradient(135deg, #0044ff 0%, #001c68 25%, #000000 100%)",
          "border": "2px black"
        });

        let headerEl = $("<h3>" + tickerSymbol + "</h3>"); //creates a header element with text content of the ticker Title
        sectionEl.append(headerEl);

        //adding close btn
        let closeBtn = $(
          "<button " +
            "class = 'uk-position-absolute " +
            "uk-position-small " +
            "uk-position-top-right' " +
            "type='button' uk-close></button>"
        );

        sectionEl.append(closeBtn);
        let newsModalButton = $("<button>")
          .attr(
            "class",
            "uk-button uk-button-default uk-margin-small-right uk-border-rounded"
          )

          .attr("id", "newsModalButton")
          .attr("type", "button")
          .attr("uk-toggle", "target: #newsModal")
          .css({
            height: "fit-content",
            width: "100%",
            margin: "auto",
            color: "white",
          })

          .text("Learn More");

        //! appending news button
        sectionEl.append(newsModalButton);
        let modal = $("<div>")
          .css({
            width: "100%",
            background: "transperant",
          })
          .attr("id", "newsModal")
          .attr("uk-modal", "uk-modal-dialog uk-margin-auto-vertical")

          .append(
            $("<div>")
              .attr("class", "uk-modal-dialog uk-modal-body")
              .append(
                $("<h2>").attr("class", "uk-modal-title"),
                $("<p>").text("Modal content...").attr("class", "description"),
                $("<p>")
                  .attr("class", "uk-text-right")
                  .append(
                    $("<button>")
                      .attr(
                        "class",
                        "uk-button uk-button-default uk-modal-close"
                      )
                      .attr("type", "button")
                      .text("Cancel"),
                    $("<button>")
                      .attr("class", "uk-button uk-button-primary")
                      .attr("type", "button")
                      .text("Save")
                  )
              )
          );

        $("main").append(modal);

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
          display: "flex",
          color: "white",
          "background-color": "#080097",
          "flex-direction": "column",
          width: "fit-content",
          //text align left except ticker (in a span)
          "text-align": "center",
          position: "relative",
          "border-radius": "10px",
          padding: "15px",
          margin: "45px",
        });

        sectionEl.append(ulEl);
        divEl.append(sectionEl);
        $("main").append(divEl);

        //both Fav buttons are created
        let favTrueBtn = $("<i class='fas fa-star '></i>");
        favTrueBtn.attr = ("id", tickerSymbol + "-fav-btn");
        favTrueBtn.addClass([
          "uk-position-absolute",
          "uk-position-small",
          "uk-position-top-left",
        ]);

        let favFalseBtn = $("<i class='far fa-star'></i>");
        favFalseBtn.attr = ("id", tickerSymbol + "-fav-btn");
        favFalseBtn.addClass([
          "uk-position-absolute",
          "uk-position-small",
          "uk-position-top-left",
        ]);

        //this click handlers swaps the buttons, then created a new event
        //handler for the swapped element that runs the same handler
        function favoriteClickHandler(event) {
          if ($(event.target).hasClass("fas")) {
            $(event.target).replaceWith(favFalseBtn);
            favFalseBtn.on("click", favoriteClickHandler);
            let index = savedFavorites.indexOf(tickerSymbol);
            savedFavorites.splice(index, 1);
            localStorage.setItem(
              "saved-favorites",
              JSON.stringify(savedFavorites)
            );
          } else {
            $(event.target).replaceWith(favTrueBtn);
            favTrueBtn.on("click", favoriteClickHandler);
            savedFavorites.push(tickerSymbol);
            localStorage.setItem(
              "saved-favorites",
              JSON.stringify(savedFavorites)
            );
          }
        }
        //checks Saved favorites array to see if the ticker is saved a favorite
        if (savedFavorites.includes(tickerSymbol)) {
          sectionEl.append(favTrueBtn);
          favTrueBtn.on("click", favoriteClickHandler);
        } else {
          sectionEl.append(favFalseBtn);
          favFalseBtn.on("click", favoriteClickHandler);
        }

        //makes the close button erase the div that contains it, and removes it from the displayed tickers array
        closeBtn.attr("id", tickerSymbol + "-btn");
        $("#" + tickerSymbol + "-btn").on("click", function () {
          $("#" + tickerSymbol).remove();
          let index = displayedTickers.indexOf(tickerSymbol);
          displayedTickers.splice(index, 1);
        });
      }
    });
}

$(document).on("click", "#card #newsModalButton", function () {
  //grabs the ticker of the card so it can be plugged into the endpoint
  let ticker = $(this).siblings("h3").text();
  let alphaVantageKey = "PUZOI2F17H6KBPQC";
  let apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey= +${alphaVantageKey}`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error("Not 200 response");
      }
      return response.json();
    })
    .then(function (data) {
      $(".uk-modal-title").text(data.Name);
      $(".description").text(data.Description);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });
});
