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