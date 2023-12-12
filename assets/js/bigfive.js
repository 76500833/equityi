let apiKey = "okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";
// fetch request for Polygon API which will get top 5 stocks and bottom 5 stocks
// depending on user input as well as the event listeners
var ulList = document.querySelector("#ulList");
var fetchButton = document.getElementById("fetch-button");

//getApi function is called when the fetchButton is clicked

function getApi() {
  // Inserting Polygon API URL with key into a variable
  var requestUrl =
    "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=okPpp2JvzuT94Kf1DJKeopxgFtX6BKXH";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // looping over the data object and creating list elements
      for (var i = 0; i < 5; i++) {
        var top5 = data.tickers[i].ticker;
        var listItem = document.createElement("li");
        //   //Set the text of the list element to the JSON response's ticker property
        listItem.textContent = data.tickers[i].ticker;
      }
      //   //Append the li element to the id associated with the ul element.
      ulList.append(listItem);
      // }
    });
}

//fetchButton.addEventListener('click', getApi);
