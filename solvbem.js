const form = document.getElementById("formSolvBem");
const resultadoDiv = document.getElementById("resultadoBemestar");
const ctx = document.getElementById("graficoBemestar").getContext("2d");
const listaHistorico = document.getElementById("listaHistoricoBemestar");

let grafico = null;
let historico = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const temperatura = parseFloat(document.getElementById("temperatura").value);
  const alimentacao = document.getElementById("alimentacao").value;
  const descanso = document.getElementById("descanso").value;

  let score = 0;
  let interpretacao = "";

  // Temperatura ideal entre 18°C e 25°C
  if (temperatura >= 18 && temperatura <= 25) {
    score += 40;
  } else if ((temperatura >= 15 && temperatura < 18) || (temperatura > 25 && temperatura <= 28)) {
    score += 25;
  } else {
    score += 10;
  }

  // Alimentação
  if (alimentacao === "sim") {
    score += 30;
  }

  // Descanso
  if (descanso === "sim") {
    score += 30;
  }

  if (score >= 80) {
    interpretacao = "Excelente bem-estar. Alta chance de leite e queijo de qualidade.";
  } else if (score >= 60) {
    interpretacao = "Bom bem-estar. Produção estável, mas pode melhorar.";
  } else if (score >= 40) {
    interpretacao = "Bem-estar razoável. Atenção aos cuidados.";
  } else {
    interpretacao = "Alerta! Níveis críticos de estresse no rebanho.";
  }

  const resultadoTexto = `
    <h3>Resultado:</h3>
    <p><strong>Score de Bem-estar:</strong> ${score}/100</p>
    <p><strong>Interpretação:</strong> ${interpretacao}</p>
  `;
  resultadoDiv.innerHTML = resultadoTexto;

  atualizarGrafico(temperatura, alimentacao, descanso);
  salvarNoHistorico(temperatura, alimentacao, descanso, score, interpretacao);
});

// Gráfico de barras
function atualizarGrafico(temperatura, alimentacao, descanso) {
  const temperaturaScore =
    temperatura >= 18 && temperatura <= 25
      ? 40
      : (temperatura >= 15 && temperatura < 18) || (temperatura > 25 && temperatura <= 28)
      ? 25
      : 10;
  const alimentacaoScore = alimentacao === "sim" ? 30 : 0;
  const descansoScore = descanso === "sim" ? 30 : 0;

  const labels = ["Temperatura", "Alimentação", "Descanso"];
  const data = [temperaturaScore, alimentacaoScore, descansoScore];

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pontuação por Fator",
          data,
          backgroundColor: ["#4caf50", "#2196f3", "#ffc107"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
        },
      },
    },
  });
}

// Histórico
function salvarNoHistorico(temp, alim, desc, score, interpretacao) {
  const item = {
    temp,
    alim,
    desc,
    score,
    interpretacao,
    data: new Date().toLocaleString("pt-BR"),
  };

  historico.push(item);
  exibirHistorico();
}

function exibirHistorico() {
  listaHistorico.innerHTML = "";

  historico.slice().reverse().forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.data}</strong>: ${item.score}/100 - ${item.interpretacao}
      <br><em>Temp: ${item.temp}°C, Alimentação: ${item.alim}, Descanso: ${item.desc}</em>
    `;
    listaHistorico.appendChild(li);
  });
}

function resetarHistoricoBemestar() {
  historico = [];
  exibirHistorico();
}
