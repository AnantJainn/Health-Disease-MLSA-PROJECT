document.addEventListener("DOMContentLoaded", function () {
    const chatbot = document.querySelector(".chatbot");
    const chatbotContainer = chatbot.querySelector(".chatbot-container");
    const chatbotOpenButton = chatbot.querySelector(".chatbot-open");
    const chatbotCloseButton = chatbot.querySelector(".chatbot-close");
    const userInput = chatbot.querySelector("#user-input");
    const chatbotBody = chatbot.querySelector(".chatbot-body");

    chatbotOpenButton.addEventListener("click", () => {
        chatbotOpenButton.style.display = "none";
        chatbotContainer.style.display = "block";
    });

    chatbotCloseButton.addEventListener("click", () => {
        chatbotOpenButton.style.display = "block";
        chatbotContainer.style.display = "none";
    });

    userInput.addEventListener("keydown", async (event) => {
        if (event.key === "Enter" && userInput.value.trim() !== "") {
            const userMessage = userInput.value;
            const aiMessage = await getAIResponse(userMessage);

            // Display user message
            const userMessageElement = createMessageElement("user", userMessage);
            chatbotBody.appendChild(userMessageElement);

            // Display AI response
            const aiMessageElement = createMessageElement("ai", aiMessage, "static/images/Beauty.png");
            chatbotBody.appendChild(aiMessageElement);

            userInput.value = "";
        }
    });

    function createMessageElement(sender, message, pictureSrc = "") {
        const messageElement = document.createElement("div");
        messageElement.className = `chatbot-message ${sender}`;
        const pictureElement = pictureSrc ? `<img src="${pictureSrc}" alt="User Picture" class="ai-picture">` : '';
        messageElement.innerHTML = `
          ${pictureElement}
          <div class="chatbot-message-text">${message}</div>
        `;
        return messageElement;
    }

    async function getAIResponse(userMessage) {
        try {
            const response = await fetch("/get_ai_response", {
                method: "POST",  // Set the HTTP method to POST
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_message: userMessage }),
            });

            const aiResponse = await response.text();
            console.log(aiResponse);
            return aiResponse;
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "An error occurred while fetching the AI response.";
        }
    }

});
