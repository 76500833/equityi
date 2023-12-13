let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";
// fetch request for Polygon API which will get top 5 stocks and bottom 5 stocks
// depending on user input as well as the event listeners

//ulList is the parent element of the cards
var ulList = $("#ulList").css({
  "display": "grid",
  "grid-template-columns": "repeat(auto-fill, minmax(250px, 1fr))", // Adjust as needed
  "grid-gap": "10px", // Adjust as needed
  "padding": "10px", // Adjust as needed
  "border-radius": "10",
  "color": "white",
  "justify-items": "center",
  "align-items": "center",
  
});

var fetchButton = document.getElementById("fetch-button");
$(fetchButton).text("See Five Bigest Movers")

//getApi function is called when the fetchButton is clicked

function getApi() {
  console.log("hi")
  // Inserting Polygon API URL with key into a variable
  var requestUrl =
    "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
      .then(function (data) {
        for (var i = 0; i < 5; i++) {
          // Create a new div for the card
          var card = $("<div>").css({
            "display": "flex",
            "color": "white",
            "background-color": "#080097",
            //row or column review w team
            "flex-direction": "column",
            "width": "fit-content",
            "text-align": "center",
            "position": "relative",
            "border-radius": "10px",
            "padding": "15px",
          
            "gap": "2px",
            "margin-bottom": "50px"
          });
    
          // Create the list item and paragraph
          var h2 = $("<h2>").text(data.tickers[i].ticker).css({
            "color": "white"
          })
          var todaysChangeEl = $("<p>").text("Todays Change percentage: " + data.tickers[i].todaysChangePerc.toFixed(1)).css({
            "margin": "5px"
          })
    
          // Append the list item and paragraph to the card
          card.append(h2, todaysChangeEl);
    
          // Append the card to the list
      
          ulList.append(card);
        }
      });
    }


fetchButton.addEventListener('click', getApi);
