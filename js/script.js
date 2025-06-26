// Lista de livros armazenada em memória
let livros = [];

// ID global usado para gerar novos IDs únicos
let idGlobal = 1;

// Variáveis de controle do modo de edição e do livro selecionado
let modoEdicaoAtivo = false;
let livroSelecionadoId = null;

// Referências para elementos do DOM (formulário, tabela, botões, etc.)
const form = document.getElementById('createForm');
const tabela = document.querySelector('#tabelaLivros tbody');
const toggleEditarBtn = document.getElementById('toggleEditarLista');
const acoesEditar = document.getElementById('acoesEditar');
const btnEditarSelecionado = document.getElementById('btnEditarSelecionado');
const btnExcluirSelecionado = document.getElementById('btnExcluirSelecionado');
const cancelarEdicaoBtn = document.getElementById('cancelarEdicao');
const hiddenId = document.getElementById('hiddenId');
const mensagemSucesso = document.getElementById('mensagemSucesso');

// Função que renderiza a lista de livros na tabela
function renderizarLivros() {
  tabela.innerHTML = ''; // Limpa a tabela antes de redesenhar

  livros.forEach((livro) => {
    // Cria uma linha da tabela para cada livro
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${livro.id}</td>
      <td>${livro.name}</td>
      <td>${livro.tipo}</td>
      <td>${livro.ano}</td>
    `;

    // Adiciona comportamento de seleção ao clicar em uma linha
    tr.addEventListener('click', () => {
      if (!modoEdicaoAtivo) return; // Só permite selecionar se estiver no modo edição

      // Alterna entre selecionar e desmarcar o livro
      if (livroSelecionadoId === livro.id) {
        livroSelecionadoId = null;
      } else {
        livroSelecionadoId = livro.id;
      }

      renderizarLivros(); // Re-renderiza para aplicar estilos visuais (se necessário)
    });

    tabela.appendChild(tr); // Adiciona a linha à tabela
  });

  atualizarBotoesAcao(); // Atualiza o estado dos botões de ação
}

// Habilita ou desabilita os botões de editar/excluir dependendo do estado
function atualizarBotoesAcao() {
  const habilitar = modoEdicaoAtivo && livroSelecionadoId !== null;
  btnEditarSelecionado.disabled = !habilitar;
  btnExcluirSelecionado.disabled = !habilitar;
}

// Alterna entre o modo normal e o modo edição
toggleEditarBtn.addEventListener('click', () => {
  modoEdicaoAtivo = !modoEdicaoAtivo;
  acoesEditar.style.display = modoEdicaoAtivo ? 'block' : 'none';

  // Se sair do modo edição, limpa a seleção
  if (!modoEdicaoAtivo) {
    livroSelecionadoId = null;
  }

  // Atualiza o texto do botão
  toggleEditarBtn.textContent = modoEdicaoAtivo
    ? 'Sair do modo edição'
    : 'Editar Lista';

  renderizarLivros(); // Re-renderiza a tabela
});

// Preenche o formulário com os dados do livro selecionado para edição
btnEditarSelecionado.addEventListener('click', () => {
  if (livroSelecionadoId === null) return;

  const livro = livros.find((l) => l.id === livroSelecionadoId);
  if (!livro) return;

  // Preenche o formulário com os dados do livro
  hiddenId.value = livro.id;
  form.name.value = livro.name;
  form.tipo.value = livro.tipo;
  form.ano.value = livro.ano;

  cancelarEdicaoBtn.style.display = 'inline-block'; // Mostra o botão "cancelar edição"
});

// Remove o livro selecionado da lista
btnExcluirSelecionado.addEventListener('click', () => {
  if (livroSelecionadoId === null) return;

  // Remove o livro pelo ID
  livros = livros.filter((l) => l.id !== livroSelecionadoId);
  livroSelecionadoId = null;

  mostrarMensagem('Livro excluído com sucesso!');
  renderizarLivros(); // Atualiza a tabela
});

// Lida com o envio do formulário (tanto para adicionar quanto editar)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Previne recarregamento da página

  const id = parseInt(hiddenId.value); // ID oculto para edição
  const name = form.name.value.trim();
  const tipo = form.tipo.value.trim();
  const ano = parseInt(form.ano.value);

  // Validação simples
  if (!name || !tipo || !ano) return;

  if (id) {
    // Editando livro existente
    const index = livros.findIndex((l) => l.id === id);
    if (index !== -1) {
      livros[index] = { id, name, tipo, ano };
      mostrarMensagem('Livro editado com sucesso!');
    }
  } else {
    // Adicionando novo livro
    livros.push({ id: idGlobal++, name, tipo, ano });
    mostrarMensagem('Livro adicionado com sucesso!');
  }

  // Limpa o formulário
  form.reset();
  hiddenId.value = '';
  cancelarEdicaoBtn.style.display = 'none';
  renderizarLivros(); // Atualiza a tabela
});

// Cancela a edição e limpa o formulário
cancelarEdicaoBtn.addEventListener('click', () => {
  form.reset();
  hiddenId.value = '';
  cancelarEdicaoBtn.style.display = 'none';
});

// Exibe uma mensagem temporária de sucesso
function mostrarMensagem(texto) {
  mensagemSucesso.textContent = texto;
  mensagemSucesso.style.display = 'block';
  setTimeout(() => {
    mensagemSucesso.style.display = 'none';
  }, 3000); // Esconde após 3 segundos
}

// Inicializa a lista de livros com alguns dados
livros = [
  { id: idGlobal++, name: 'Dom Casmurro', tipo: 'Romance', ano: 1899 },
  { id: idGlobal++, name: 'O Cortiço', tipo: 'Naturalismo', ano: 1890 },
];

// Renderiza a tabela pela primeira vez
renderizarLivros();
