const currencySymbols = {
    USD: "$", EUR: "€", GBP: "£", BRL: "R$", JPY: "¥", AUD: "A$", CAD: "C$",
    CHF: "CHF", CNY: "¥", CZK: "Kč", DKK: "kr", HKD: "HK$", HUF: "Ft", INR: "₹",
    MXN: "$", NOK: "kr", NZD: "NZ$", PLN: "zł", SEK: "kr", SGD: "S$", THB: "฿",
    TRY: "₺", ZAR: "R"
};

// --- Funções Auxiliares ---

function formatNumber(num) {
    if (num === 0) return "0";
    const abs = Math.abs(num);
    if (abs < 0.01) return num.toExponential(2);
    if (abs < 1) return num.toFixed(2);
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
    const i = Math.floor(Math.log10(abs) / 3); 
    const scaled = num / Math.pow(1000, i);
    const suffix = suffixes[i] || "";
    return scaled.toFixed(2) + suffix;
}

function downsampleData(labels, values, targetCount = 1000) {
    const length = labels.length;
    if (length <= targetCount) return { labels, values };
    const step = Math.ceil(length / targetCount);
    const newLabels = [];
    const newValues = [];
    for (let i = 0; i < length; i += step) {
        newLabels.push(labels[i]);
        newValues.push(values[i]);
    }
    if (newLabels[newLabels.length - 1] !== labels[length - 1]) {
        newLabels.push(labels[length - 1]);
        newValues.push(values[length - 1]);
    }
    return { labels: newLabels, values: newValues };
}