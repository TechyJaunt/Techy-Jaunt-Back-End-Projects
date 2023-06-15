document.getElementById("urlForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const longUrlInput = document.getElementById("longUrlInput");
  const longUrl = longUrlInput.value;

  const response = await fetch("/api/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longUrl }),
  });

  if (response.ok) {
    const { shortUrl } = await response.json();

    const shortUrlContainer = document.getElementById("shortUrlContainer");
    shortUrlContainer.innerHTML = `
      <p>Short URL: <a href="${
        window.location.href + shortUrl
      }" target="_blank">${shortUrl}</a></p>
    `;

    longUrlInput.value = "";
  }

  if(response.status !== 200){
    const { message } = await response.json();

    const shortUrlContainer = document.getElementById("shortUrlContainer");
    shortUrlContainer.innerHTML = `
      <p>${message}</p>
    `;
  }
});
