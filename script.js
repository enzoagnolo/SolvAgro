// --- CADASTRO DE USUÁRIO ---
document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("cadastroForm");
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Cadastro realizado com sucesso!");
      window.location.href = "index.html"; // redireciona
    });
  }
});

// --- SIMULADOR AGRÍCOLA ---
let graficoProducao = null;
const historico = [];

function simularProdutividade() {
  const cultura = document.getElementById("cultura").value;
  const solo = document.getElementById("solo").value;
  const semente = document.getElementById("semente")?.value || "N/A";
  const manejo = document.getElementById("manejo")?.value || "N/A";
  const clima = document.getElementById("clima").value;
  const quimico = document.getElementById("quimico")?.value || "N/A";
  const tipoGrao = document.getElementById("tipoGrao")?.value || "N/A";
  const hectares = parseFloat(document.getElementById("hectares")?.value || 1);

  if (!cultura || !solo || !clima) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  let produtividadeBase = 100;

  switch (solo) {
    case "arenoso": produtividadeBase -= 25; break;
    case "misturado": produtividadeBase -= 10; break;
    case "latossolo": produtividadeBase += 5; break;
  }

  switch (clima) {
    case "seca_severa": produtividadeBase -= 35; break;
    case "seca_moderada": produtividadeBase -= 20; break;
    case "chuvas_irregulares": produtividadeBase -= 10; break;
    case "ideal": produtividadeBase += 5; break;
  }

  switch (semente) {
    case "transgenica": produtividadeBase += 20; break;
    case "tratada": produtividadeBase += 10; break;
  }

  switch (tipoGrao) {
    case "grão_duro": produtividadeBase += 5; break;
    case "grão_macio": produtividadeBase += 3; break;
  }

  switch (manejo) {
    case "orgânico": produtividadeBase -= 10; break;
    case "regenerativo": produtividadeBase += 10; break;
  }

  if (quimico === "sim") {
    produtividadeBase += 8;
  } else if (quimico === "nao") {
    produtividadeBase -= 5;
  }

  const produtividadeFinal = Math.max(0, produtividadeBase);
  const producaoTotal = produtividadeFinal * hectares;
  const perda = Math.max(0, 100 * hectares - producaoTotal);

  document.getElementById("resultado").innerHTML =
    `<strong>Produtividade:</strong> ${produtividadeFinal.toFixed(2)} sacas/hectare`;

  document.getElementById("ganhoPerda").innerHTML =
    `<strong>Produção Total:</strong> ${producaoTotal.toFixed(2)} sacas<br/>
     <strong>Perda Estimada:</strong> ${perda.toFixed(2)} sacas`;

  gerarGrafico(produtividadeFinal, perda);

  adicionarAoHistorico({
    cultura,
    solo,
    semente,
    manejo,
    clima,
    tipoGrao,
    quimico,
    hectares,
    produtividadeFinal
  });
}

function gerarGrafico(produtividade, perda) {
  const ctx = document.getElementById("graficoProducao").getContext("2d");
  if (graficoProducao) graficoProducao.destroy();
  graficoProducao = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Produtividade", "Perda"],
      datasets: [{
        label: "Resultado da Simulação",
        backgroundColor: ["#4caf50", "#f44336"],
        data: [produtividade, perda],
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Sacas"
          }
        }
      }
    },
  });
}

function adicionarAoHistorico(simulacao) {
  historico.push(simulacao);
  salvarHistoricoLocal();
  atualizarHistorico();
}

function atualizarHistorico() {
  const lista = document.getElementById("listaHistorico");
  lista.innerHTML = "";

  historico.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} - Cultura: ${item.cultura}, Solo: ${item.solo}, Clima: ${item.clima}, Produtividade: ${item.produtividadeFinal.toFixed(2)} sacas/hectare`;
    li.addEventListener("click", () => carregarSimulacao(item));
    lista.appendChild(li);
  });
}

function carregarSimulacao(simulacao) {
  const setValue = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.value = valor;
  };

  setValue("cultura", simulacao.cultura);
  setValue("solo", simulacao.solo);
  setValue("semente", simulacao.semente || "");
  setValue("manejo", simulacao.manejo || "");
  setValue("clima", simulacao.clima);
  setValue("quimico", simulacao.quimico || "");
  setValue("tipoGrao", simulacao.tipoGrao || "");
  setValue("hectares", simulacao.hectares || 1);

  const producaoTotal = simulacao.produtividadeFinal * simulacao.hectares;
  const perda = Math.max(0, 100 * simulacao.hectares - producaoTotal);

  document.getElementById("resultado").innerHTML =
    `<strong>Produtividade:</strong> ${simulacao.produtividadeFinal.toFixed(2)} sacas/hectare`;

  document.getElementById("ganhoPerda").innerHTML =
    `<strong>Produção Total:</strong> ${producaoTotal.toFixed(2)} sacas<br/>
     <strong>Perda Estimada:</strong> ${perda.toFixed(2)} sacas`;

  gerarGrafico(simulacao.produtividadeFinal, perda);
}

function salvarHistoricoLocal() {
  localStorage.setItem("historicoSimulacoes", JSON.stringify(historico));
}

function carregarHistoricoLocal() {
  const dados = localStorage.getItem("historicoSimulacoes");
  if (dados) {
    try {
      const historicoCarregado = JSON.parse(dados);
      historicoCarregado.forEach((sim) => historico.push(sim));
      atualizarHistorico();
    } catch (e) {
      console.error("Erro ao carregar histórico:", e);
    }
  }
}

function resetarSimulacoes() {
  historico.length = 0;
  localStorage.removeItem("historicoSimulacoes");
  atualizarHistorico();
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("ganhoPerda").innerHTML = "";
  if (graficoProducao) graficoProducao.destroy();
}

window.onload = () => {
  const form = document.getElementById("formSimulador");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      simularProdutividade();
    });
  }

  carregarHistoricoLocal();
};
