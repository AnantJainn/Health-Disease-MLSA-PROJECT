function showNotification() {
  var notification = document.getElementById("notification");
  var overlay = document.getElementById("overlay");

  // Show the notification and overlay
  notification.style.display = "block";
  overlay.style.display = "block";
}

function closeNotification() {
  var notification = document.getElementById("notification");
  var overlay = document.getElementById("overlay");

  // Hide the notification and overlay
  notification.style.display = "none";
  overlay.style.display = "none";
}

document
  .getElementById("predictionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    var inputArray = [];
    for (var pair of formData.entries()) {
      inputArray.push(parseFloat(pair[1]));
    }
    var jsonData = {
      input_data: inputArray,
    };
    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the JSON response here
        var predictionResult = data.result;
        var notification = document.getElementById("notification");
        var closeBtn = document.getElementById("closeNotification");
        var predictionResultElement =
          document.getElementById("predictionResult");

        // Set the prediction result in the notification
        predictionResultElement.textContent = predictionResult;

        // Show the notification
        showNotification();

        // Add event listener to close button
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error gracefully, e.g., by displaying an error message
      });
  });

document
  .getElementById("closeNotification")
  .addEventListener("click", function () {
    closeNotification();
  });
