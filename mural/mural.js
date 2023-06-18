// Obter os textos salvos do servidor e adicioná-los ao mural
const loading = document.getElementById('loading');

loading.style.display = 'flex';

fetch('http://localhost:3000/texts')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(texts => {
    const mural = document.getElementById('mural');

    for (const text of texts) {
      const textCard = document.createElement('div');
      textCard.classList.add('textCard');
      textCard.textContent = text.content;
      mural.appendChild(textCard);
    }

    loading.style.display = 'none';
  })
  .catch(error => {
    console.error('Error:', error);
    loading.textContent = 'Ocorreu um erro ao carregar os textos.';
  });
