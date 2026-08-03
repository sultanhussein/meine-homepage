const form = document.getElementById("contact-form");
const statusBox = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");

let statusTimeout;

function showStatus(message, type) {
  clearTimeout(statusTimeout);

  statusBox.textContent = message;
  statusBox.className = `form-status show ${type}`;

  if (type === "success") {
    statusTimeout = setTimeout(() => {
      statusBox.className = "form-status";
      statusBox.textContent = "";
    }, 5000);
  }
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);

  const buttonText = submitButton.querySelector(".button-text");
  buttonText.textContent = isLoading ? "Wird gesendet..." : "Nachricht senden";
}

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    if (formData.get("_gotcha")) {
      showStatus("Spam-Verdacht erkannt. Bitte versuchen Sie es erneut.", "error");
      return;
    }

    setLoading(true);
    showStatus("Deine Nachricht wird gerade gesendet...", "sending");

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        form.reset();
        showStatus("Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.", "success");
      } else {
        showStatus("Leider konnte deine Nachricht nicht gesendet werden. Bitte versuche es noch einmal.", "error");
      }
    } catch (error) {
      showStatus("Es gab ein Verbindungsproblem. Bitte versuche es später noch einmal.", "error");
    } finally {
      setLoading(false);
    }
  });
}