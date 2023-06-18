let currentTextId = null;  // Guarda o id do texto sendo editado
let isSaving = false; // Variável de controle para rastrear se o salvamento já foi acionado

document.getElementById('saveButton').addEventListener('click', () => {
  // Verificar se o salvamento já está ocorrendo
  if (isSaving) {
    return;
  }

  // Definir a variável de controle como verdadeira para indicar que o salvamento está ocorrendo
  isSaving = true;

  const content = document.getElementById('content').value;

  if (content.trim() === '') {
    // Deletar o texto se o conteúdo estiver vazio
    if (currentTextId !== null) {
      fetch(`http://localhost:3000/texts/${currentTextId}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          currentTextId = null;  // Resetar o id após a exclusão
          isSaving = false; // Definir a variável de controle como falsa para indicar que o salvamento foi concluído
        })
        .catch((error) => {
          console.error('Error:', error);
          isSaving = false; // Definir a variável de controle como falsa mesmo em caso de erro
        });
    }
    return;
  }

  const url = currentTextId !== null ? `http://localhost:3000/texts/${currentTextId}` : 'http://localhost:3000/texts';
  const method = currentTextId !== null ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      currentTextId = null;  // Resetar o id após a edição
      isSaving = false; // Definir a variável de controle como falsa para indicar que o salvamento foi concluído
    })
    .catch((error) => {
      console.error('Error:', error);
      isSaving = false; // Definir a variável de controle como falsa mesmo em caso de erro
    });
});

document.body.addEventListener('mousemove', (event) => {
  const sidebar = document.getElementById('sidebar');
  const textCards = document.querySelectorAll('#textsContainer .textCard');

  // Se o mouse está a 50 pixels ou menos da borda esquerda do viewport
  if (event.clientX <= 50) {
    sidebar.classList.add('show');

    // Mostra os cards
    textCards.forEach(card => {
      card.style.display = 'block';
    });
  } else {
    sidebar.classList.remove('show');

    // Esconde os cards
    textCards.forEach(card => {
      card.style.display = 'none';
    });
  }
});

// Obter os textos salvos do servidor e adicioná-los ao sidebar
fetch('http://localhost:3000/texts')
  .then(response => response.json())
  .then(texts => {
    const textsContainer = document.getElementById('textsContainer');

    for (const text of texts) {
      const textCard = document.createElement('div');
      textCard.classList.add('textCard');
      textCard.textContent = text.content; // Supondo que 'content' é a propriedade que contém o texto
      textCard.addEventListener('click', () => {
        // Ao clicar no card, carregue o texto no textarea
        document.getElementById('content').value = text.content;
        currentTextId = text.id;  // Atualiza o id do texto sendo editado
      });

      textsContainer.appendChild(textCard);
    }
  });

document.getElementById('generatePDF').addEventListener('click', function () {
  var content = document.getElementById('content').value;
  var pdf = new jsPDF();

  pdf.setFillColor(0, 0, 0);  // Define a cor do fundo como preto
  pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F'); // Desenha um retângulo preenchido que cobre toda a página

  pdf.setTextColor(255, 215, 0);  // Define a cor do texto como dourado
  pdf.setFont('courier');  // Define a fonte como Courier
  pdf.setFontSize(12);  // Define o tamanho da fonte

  var splitContent = pdf.splitTextToSize(content, 180);  // Divide o texto para caber na página
  pdf.text(splitContent, 10, 10);  // Adiciona o texto ao PDF

  pdf.save("download.pdf");
});

document.getElementById('deleteAllButton').addEventListener('click', () => {
  fetch('http://localhost:3000/texts', {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Atualize o conteúdo da sidebar ou qualquer outra ação necessária após a exclusão de todos os textos
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
