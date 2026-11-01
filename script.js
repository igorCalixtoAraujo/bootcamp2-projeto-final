
function calculateConversion(amount, rate) {
    if (!Number.isFinite(amount) || amount < 0) {
        throw new Error("Valor inválido");
    }

    if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error("Cotação inválida");
    }

    return Number((amount * rate).toFixed(2));
}

// Disponibiliza a função para os testes do Jest
if (typeof module !== "undefined") {
    module.exports = { calculateConversion };
}

//_________________________________________________________
// FRONTEND - conexão com a API

if (typeof document !== "undefined") {

    const API_URL = "http://localhost:3000";

    // Elementos da página
    const originInput = document.getElementById("org_value");
    const originSelect = document.getElementById("org_coin");
    const destinationSelect = document.getElementById("cvt_coin");
    const convertButton = document.getElementById("convert-btn");
    const resultElement = document.getElementById("result");
    const historyEntries = document.getElementById("history-entries");

    // Carrega as moedas disponíveis
    async function loadCurrencies() {
        try {
            const response = await fetch(`${API_URL}/api/currencies`);

            if (!response.ok) {
                throw new Error("Erro ao carregar moedas.");
            }

            const currencies = await response.json();

            Object.entries(currencies).forEach(([code, name]) => {
                const option1 = document.createElement("option");
                option1.value = code;
                option1.textContent = `${code} - ${name}`;

                const option2 = option1.cloneNode(true);

                originSelect.appendChild(option1);
                destinationSelect.appendChild(option2);
            });

        } catch (error) {
            alert("Não foi possível carregar as moedas. Verifique se o servidor está ligado.");
            console.error(error);
        }
    }

    // Formata valores monetários
    function formatCurrency(value, currency) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currency
        }).format(value);
    }

    // Busca e exibe o histórico do Supabase
    async function renderHistory() {
        try {
            const response = await fetch(`${API_URL}/api/history`);

            if (!response.ok) {
                throw new Error("Erro ao carregar histórico.");
            }

            const history = await response.json();

            historyEntries.innerHTML = "";

            if (history.length === 0) {
                historyEntries.textContent = "Nenhuma conversão realizada ainda.";
                return;
            }

            history.forEach((entry) => {
                const item = document.createElement("div");

                const description = document.createElement("p");

                description.textContent =
                    `${formatCurrency(Number(entry.amount), entry.from_currency)} → ` +
                    `${formatCurrency(Number(entry.converted_amount), entry.to_currency)}`;

                const date = document.createElement("small");

                date.textContent = new Date(entry.created_at).toLocaleString("pt-BR");

                item.appendChild(description);
                item.appendChild(date);

                historyEntries.appendChild(item);
            });

        } catch (error) {
            console.error(error);
            historyEntries.textContent = "Não foi possível carregar o histórico.";
        }
    }

    // Realiza a conversão
    async function convertCurrency() {
        const amount = Number(originInput.value);
        const from = originSelect.value;
        const to = destinationSelect.value;

        if (!originInput.value || !from || !to) {
            alert("Preencha o valor e selecione as duas moedas.");
            return;
        }

        convertButton.disabled = true;

        try {
            const response = await fetch(`${API_URL}/api/convert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount, from, to })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro na conversão.");
            }

            // Exibe o resultado
            resultElement.textContent = formatCurrency(data.result, to);

            // Atualiza o histórico consultando o Supabase
            await renderHistory();

        } catch (error) {
            alert(error.message);
            console.error(error);
        } finally {
            convertButton.disabled = false;
        }
    }

    // Eventos
    convertButton.addEventListener("click", convertCurrency);

    // Inicialização
    loadCurrencies();
    renderHistory();
}
