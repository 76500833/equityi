//TODO fetch news article and append them to the page.
// function getNews() {
//   let ticker = $("#searchInput").val().toUpperCase();
//   let url =
//     "https://api.polygon.io/v2/reference/news?ticker=" +
//     ticker +
//     "&apiKey=WQO8bPpVFXoHXcm7Uj3d7OeGCtLIMclh";
//   console.log(ticker);
//   fetch(url)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       if (data) {
//         //clear main so fresh data will replace it

//         //start appending data
//         //data is ten news articles, but we're just dealing with the first one: [0]
//         let sectionEl = $("<section>");
//         let headerEl = $("<h1>").text(data.results[0].title);
//         let descriptionEl = $("<h2>").text(data.results[0].description);
//         sectionEl.append(headerEl);
//         sectionEl.append(descriptionEl);
//         $("main").append(sectionEl);
//       }
//     });
// }

