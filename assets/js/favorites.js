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
          let sectionEl = $("<section>").attr("id", "card")
            .css({
              "display": "flex",
              "justify-content": "center",
              "background-image": "linear-gradient(135deg, #0044ff 0%, #001c68 25%, #000000 100%)",
            })

            //creates a header element with text content of the ticker Title
            let headerEl = $("<h3>" + tickerSymbol + "</h3>"); 
          sectionEl.append(headerEl);
  
          //adding close btn
          let closeBtn = $("<button " + "class = 'uk-position-absolute " +
            "uk-position-small " +
            "uk-position-top-right' " +
            "type='button' uk-close></button>"); 
          sectionEl.append(closeBtn)
  
          let newsModalButton = $("<button>")
            .attr("class", "uk-button uk-button-default uk-margin-small-right")
            .attr("id", "newsModalButton")
            .attr("type", "button")
            .attr("uk-toggle", "target: #newsModal")
            .css({
              "height": "fit-content",
              "width": "100%",
              "margin": "auto",
              "color": "white"
            })
            .text("LEARN MORE");
            $("#newsModalButton").on('click', function () {
              let ticker = $(this).siblings("h3").text();
              let alphaVantageKey = "PUZOI2F17H6KBPQC";
              let apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=+${alphaVantageKey}`;
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
            })

          //! appending news button
          sectionEl.append(newsModalButton);
          let modal = $("<div>")
            .css({
              "width": "100%",
              "background": "transperant"
            })
            .attr("id", "newsModal")
            .attr("uk-modal", "uk-modal-dialog uk-margin-auto-vertical")
             .append(
              $("<div>")
                .attr("class", "uk-modal-dialog uk-modal-body")
                .append(
                  $("<h2>").attr("class", "uk-modal-title"),
                  $("<p>").text("Modal content...").attr("class", "description"),
                  $("<p>").attr("class", "uk-text-right").append(
                    $("<button>")
                      .attr("class", "uk-button uk-button-default uk-modal-close")
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

          //both Fav buttons are created
          let favTrueBtn = $("<i class='fas fa-star '></i>");
          favTrueBtn.attr = ("id", tickerSymbol + "-fav-btn");
          favTrueBtn.addClass(["uk-position-absolute", "uk-position-small", "uk-position-top-left"])
  
          let favFalseBtn = $("<i class='far fa-star'></i>");
          favFalseBtn.attr = ("id", tickerSymbol + "-fav-btn");
          favFalseBtn.addClass(["uk-position-absolute", "uk-position-small", "uk-position-top-left"])
  
          //this click handlers swaps the buttons, then created a new event
          //handler for the swapped element that runs the same handler
          function favoriteClickHandler(event) {
            if ($(event.target).hasClass("fas")) {
              $(event.target).replaceWith(favFalseBtn)
              favFalseBtn.on("click", favoriteClickHandler)
              let index = savedFavorites.indexOf(tickerSymbol)
              savedFavorites.splice(index, 1)
              localStorage.setItem("saved-favorites", JSON.stringify(savedFavorites))
            } else {
              $(event.target).replaceWith(favTrueBtn)
              favTrueBtn.on("click", favoriteClickHandler)
              savedFavorites.push(tickerSymbol)
              localStorage.setItem("saved-favorites", JSON.stringify(savedFavorites))
            }
          }
          
          //checks Saved favorites array to see if the ticker is saved a favorite
          if (savedFavorites.includes(tickerSymbol)) {
            sectionEl.append(favTrueBtn)
            favTrueBtn.on("click", favoriteClickHandler)
          } else {
            sectionEl.append(favFalseBtn);
            favFalseBtn.on("click", favoriteClickHandler)
          }
          
          //makes the close button erase the div that contains it
          closeBtn.attr("id", tickerSymbol + "-btn")
          $("#" + tickerSymbol + "-btn").on("click", function () {
            $("#" + tickerSymbol).remove()
          })
        }
      });
  }