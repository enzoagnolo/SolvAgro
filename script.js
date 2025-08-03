let grafico = null;


const historico = [];

function simularProdutividade() {

  const cultura = document.getElementById('cultura').value;
  const solo = document.getElementById('solo').value;
  const clima = document.getElementById('clima').value;
  const hectares = parseFloat(document.getElementById('hectares').value);
  const usaQuimico = document.getElementById('quimico').value;
  const tipoGrao = document.getElementById('tipoGrao').value;

  if (isNaN(hectares) || hectares <= 0) {
    alert('Por favor, insira uma quantidade válida de hectares.');
    return;
  }

  let estimativaBase = 50;

  if (cultura === 'soja') {
    if (solo === 'argiloso') estimativaBase += 5;
    if (clima === 'ideal') estimativaBase += 10;
    if (usaQuimico === 'sim') estimativaBase += 10;
    if (tipoGrao === 'transgenico') estimativaBase += 7;
    else if (tipoGrao === 'organico') estimativaBase -= 5;
  } else if (cultura === 'milho') {
    if (solo === 'misto') estimativaBase += 7;
    if (clima === 'chuvoso') estimativaBase += 10;
    if (usaQuimico === 'sim') estimativaBase += 8;
    if (tipoGrao === 'transgenico') estimativaBase += 5;
    else if (tipoGrao === 'organico') estimativaBase -= 6;
  } else if (cultura === 'trigo') {
    if (solo === 'arenoso') estimativaBase += 3;
    if (clima === 'ideal') estimativaBase += 8;
    if (usaQuimico === 'sim') estimativaBase += 6;
    if (tipoGrao === 'transgenico') estimativaBase += 4;
    else if (tipoGrao === 'organico') estimativaBase -= 4;
  }

  const estimativa = Math.min(Math.max(estimativaBase, 30), 100);

  const resultado = `Estimativa: ${estimativa.toFixed(0)} sacas/ha com base nas condições informadas.`;
  document.getElementById('resultado').innerText = resultado;

  const precoPorSaca = 150;
  const totalSacas = estimativa * hectares;
  const valorTotal = totalSacas * precoPorSaca;
  const textoGanhoPerda = `Ganho estimado: ${totalSacas.toFixed(2)} sacas, equivalente a R$ ${valorTotal.toFixed(2)}.`;
  document.getElementById('ganhoPerda').innerText = textoGanhoPerda;

  const registro = `${cultura.toUpperCase()} - Solo: ${solo}, Clima: ${clima}, Hectares: ${hectares}, Químico: ${usaQuimico}, Tipo Grão: ${tipoGrao} => ${resultado}`;

  // Salva simulação no histórico
  const simulacao = { cultura, solo, clima, hectares, usaQuimico, tipoGrao, estimativa, totalSacas, valorTotal, texto: registro };
  historico.push(simulacao);

  atualizarHistorico();
  sugerirPraticas(cultura);
  atualizarGraficoComSimulacao(simulacao);
}

function atualizarHistorico() {
  const lista = document.getElementById('listaHistorico');
  lista.innerHTML = '';

  // Mostrar do mais recente para o mais antigo, numerando
  historico.slice().reverse().forEach((item, index) => {
    const li = document.createElement('li');
    // Número da simulação (index 0 = última simulação, então enumeração invertida)
    const numeroSimulacao = historico.length - index;
    li.textContent = `${numeroSimulacao}. ${item.texto}`;
    li.style.cursor = 'pointer';
    li.title = 'Clique para visualizar essa simulação no gráfico';

    li.onclick = () => {
      atualizarGraficoComSimulacao(item);
      document.getElementById('resultado').innerText = item.texto.match(/Estimativa:.*\./)[0];
      document.getElementById('ganhoPerda').innerText = `Ganho estimado: ${item.totalSacas.toFixed(2)} sacas, equivalente a R$ ${item.valorTotal.toFixed(2)}.`;
      sugerirPraticas(item.cultura);
    };

    lista.appendChild(li);
  });
}

function atualizarGraficoComSimulacao(simulacao) {
  const ctx = document.getElementById('graficoProducao').getContext('2d');

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Produtividade (sacas/ha)'],
      datasets: [{
        label: `${simulacao.cultura.toUpperCase()} (${simulacao.tipoGrao})`,
        data: [simulacao.estimativa],
        backgroundColor: '#66bb6a'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 120
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        }
      }
    }
  });
}


function sugerirPraticas(cultura) {
  const sugestoes = {
    soja: 'Sugestão: Utilize cultivares resistentes à ferrugem e plante com espaçamento de 45 cm.',
    milho: 'Sugestão: Faça o plantio direto e use híbridos com maior tolerância à seca.',
    trigo: 'Sugestão: Faça a semeadura no início da janela ideal e mantenha boa cobertura do solo.'
  };
  document.getElementById('sugestoes').innerText = sugestoes[cultura] || '';
}

function resetarSimulacoes() {
  historico.length = 0;
  document.getElementById('resultado').innerText = '';
  document.getElementById('ganhoPerda').innerText = '';
  document.getElementById('sugestoes').innerText = '';
  document.getElementById('listaHistorico').innerHTML = '';
  if (grafico) {
    grafico.destroy();
    grafico = null;
  }
}


