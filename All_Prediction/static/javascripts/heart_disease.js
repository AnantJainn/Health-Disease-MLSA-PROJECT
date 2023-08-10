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


document.getElementById("predictionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    var jsonData = {};
    for (var pair of formData.entries()) {
        jsonData[pair[0]] = pair[1];
    }
    fetch("/heart_disease_predict", {
        method: "POST",
        body: new URLSearchParams(formData), // Use URLSearchParams to encode the form data
    })
        .then((response) => response.json())
        .then((data) => {
            var predictionResult = data.result;
            var modal = document.getElementById("myModal");
            var closeBtn = document.getElementById("closeModal");
            var predictionResultElement = document.getElementById("predictionResult");

            // Display the prediction result in the modal
            predictionResultElement.textContent = predictionResult;

            // Show or hide the close button based on the content of the h2 element
            showNotification();
        })
        .catch((error) => {
            console.log("Error:", error);
        });
});
document.getElementById("closeNotification").addEventListener("click", function () {
    closeNotification();
  });
  
