const handleResponse = async (response) => {
  const contentType = response.headers.get('Content-Type');

  const text = await response.text();
  console.log('Raw Response: ', text);

  let parsedData;

  if (contentType.includes('application/json')) {
    parsedData = JSON.parse(text);
  } else if (contentType.includes('text/xml')) {
    const parser = new DOMParser();
    parsedData = parser.parseFromString(text, 'text/xml');
  } else {
    console.error('Unsupported');
    return;
  }

  displayResponse(parsedData, contentType);
};

const displayResponse = (data, contentType) => {
  const contentDiv = document.querySelector('#content');

  contentDiv.innerHTML = '';
  let html = '';

  html += `<h2>${document.getElementById('page').value}</h2>`;
  html += `<h3>${data.message}</h3>`;

  contentDiv.innerHTML = html;
};

const sendRequest = async () => {
  const page = document.getElementById('page').value;
  const type = document.getElementById('type').value;

  console.log('test');
  try {
    const response = await fetch(page, {
      headers: {
        Accept: type,
      },
    });
    handleResponse(response);
  } catch (error) {
    console.error('Fetch error: ', error);
  }
};

document.getElementById('send').addEventListener('click', sendRequest);
