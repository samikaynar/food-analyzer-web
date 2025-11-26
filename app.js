const inputName = document.getElementById("product-name");
const resultsSection = document.getElementById("results-section");
const resultsContainer = document.getElementById("results-container");
const nameBtn = document.getElementById("name-btn");

nameBtn.addEventListener("click", function() {
  const text = inputName.value.trim();
  if (text.length < 3) {
    alert("Please enter at least 3 characters");
    return;
  }
  analyzeProduct(text);
});


async function analyzeProduct(productName) {
  resultsSection.style.display = "block";
  resultsContainer.innerHTML = "<div class='loading'>Loading...</div>";

  try {
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: productName
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      showResult(productName, data.analysis);
    } else {
      showError(data.error || "Analysis failed");
    }
    
  } catch (err) {
    showError("Cannot connect to server. Make sure Flask is running.");
  }
}

function showResult(productName, aiResult) {

  const lines = aiResult.split('\n');
  let htmlContent = '';
  

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length > 0) {
      htmlContent += '<p>' + line + '</p>';
    }
  }

  resultsContainer.innerHTML = `
    <div class="result-box">
      <h3>Health Analysis: ${productName}</h3>
      <div class="ai-response">
        ${htmlContent}
      </div>
      <div class="note">
        <small>Note: AI generated information</small>
      </div>
    </div>
  `;
}

function showError(msg) {
  resultsContainer.innerHTML = `
    <div class="error">
      <p>${msg}</p>
    </div>
  `;
}