const API_KEY = "NB1AMtT9wQSHT4hcW7SqDs5IffE";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function getStatus(e) {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();

  if (response.ok) {
    displayStatus(data.expiry);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

function displayStatus(data) {
  let heading = "API Key Status";
  let results = `Your key is valid until \n ${data}`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerText = results;
  resultsModal.show();
}

function processOptions(form) {
  let optArray = [];
  for (let entry of form.entries()) {
    if (entry[0] === "options") {
      optArray.push(entry[1]);
    }
  }

  form.delete("options");
  form.append("options", optArray.join());
  return form;
}

async function postForm(e) {
  const form = processOptions(new FormData(document.getElementById("checksform")));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": API_KEY,
    },
    body: form,
  });

  const data = await response.json();
  if (response.ok) {
    displayErrors(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

function displayErrors(data) {
  let heading = `JSHint results for ${data.file}`;

  if (data.total_errors === 0) {
    results = `<div class="no_errors">No Errors!</div>`;
  } else {
    results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class="line_number">${error.line}</span>,`;
      results += `column <span class="column">${error.col}</span></div>`;
      results += `<div class="error">${error.error}</div>`;
    }
  }
  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModal.show();
}

function displayException(data) {
  let heading = `An Exception Error has Occured`;
  
  results = `The API returned status code <strong>${data.status_code}</strong> <br>
  Error Number: <strong>${data.error_no}</strong> <br>
  Error: <strong>${data.error}</strong>`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModal.show();
}