const RASA_API = "https://probatic.onrender.com/webhooks/rest/webhook";
const API_KEY = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiY2RiZjFkZi1mZmNkLTRjOTAtOGNhZC01YzcxOGViZjcwNjEiLCJpYXQiOjE3NDIyNDgzMzMsIm5iZiI6MTc0MjI0ODMzMywic2NvcGUiOiJyYXNhOnBybyByYXNhOnBybzpjaGFtcGlvbiByYXNhOnZvaWNlIiwiZXhwIjoxODM2OTQyNzMzLCJlbWFpbCI6Im1yLmtvdG92LnBsYXlAZ21haWwuY29tIiwiY29tcGFueSI6IlJhc2EgQ2hhbXBpb25zIn0.SXPbR-h36qespYRH910aQOYh9jvpfY4O10f8t6sz7uKT3VJCYvxUxuY8yyLMaH5iK53eppwkLoufqc13-xbDEjJQT5dAoR5l21R6pPpYlMY29EOyEHhBMB5o30VSci83l84-m0BsiFWfKXlV_akz8ZgJUgFsexCpKZ6yyX3t-Anm7suu7E-vGm3-q_nCblbN5zteCNFH_IwZUOHTCBZMgLUENyJn2NGm-G9dD7thV_acHTJhs9sQakQb6c4Kp9RX1MtfIg8ZYRnBGr4iX0QyyH3At6wFagWlzaLyNcokStQG-r29l1YyU6RnjzGYzS2PNedMb6QMOE_hH7mf1QPB_g";

function sendMessage() {
    let userInput = document.getElementById("user-input");
    let message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");

    fetch(RASA_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ sender: "user", message: message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) addMessage(data[0].text, "bot");
    });

    userInput.value = "";
}
