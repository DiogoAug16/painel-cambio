const results = document.getElementById("results");
const select = document.getElementById("currency");
const amountInput = document.getElementById("amount");
const modeSelect = document.getElementById("modeSelect");
let rates = {};
let symbols = [];
let cachedHistories = JSON.parse(sessionStorage.getItem("histories_cache_v1")) || {};

// --- Funções Principais ---

async function loadBaseCurrencies() {
    if (!select) return;

    const storedRates = sessionStorage.getItem("current_rates_base_BRL");
    let data;
    if (storedRates) {
        data = JSON.parse(storedRates);
    } else {
        const res = await fetch("/rates/BRL");
        data = await res.json();
        sessionStorage.setItem("current_rates_base_BRL", JSON.stringify(data));
    }

    select.innerHTML = "";
    symbols = [data.base, ...Object.keys(data.rates)];

    symbols.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.innerText = s;
        if (s === "BRL") opt.selected = true;
        select.appendChild(opt);
    });

    if (results) results.innerHTML = "";
    
    symbols.forEach(s => {
        const symbol = currencySymbols[s] || s;
        const div = document.createElement("div");
        div.className = "currency";
        div.innerHTML = `<strong>${s}</strong><br><span id="${s}">${symbol} 0</span>`;
        div.onclick = () => showChart(select.value, s); 
        if (results) results.appendChild(div);
    });

    const convertBtn = document.getElementById("convert");
    if (convertBtn) convertBtn.click();
}

async function updateValues(amount) {
    const base = select.value;
    let currentMode = "current";
    if (modeSelect) currentMode = modeSelect.value;

    let histories = {};

    if (currentMode === "historical") {
        if (!cachedHistories[base]) {
            cachedHistories[base] = {};
            
            const today = new Date();
            const past = new Date();
            past.setDate(today.getDate() - 30);
            const from = past.toISOString().split("T")[0];
            const to = today.toISOString().split("T")[0];

            try {
                const res = await fetch(`/history-all/${base}?from=${from}&to=${to}`);
                const data = await res.json();
                const sums = {};
                const counts = {};
                const allDates = Object.values(data.rates || {});

                allDates.forEach(dayRates => {
                    for (const [currency, rate] of Object.entries(dayRates)) {
                        if (!sums[currency]) {
                            sums[currency] = 0;
                            counts[currency] = 0;
                        }
                        sums[currency] += rate;
                        counts[currency]++;
                    }
                });

                for (const currency in sums) {
                    cachedHistories[base][currency] = sums[currency] / counts[currency];
                }
                sessionStorage.setItem("histories_cache_v1", JSON.stringify(cachedHistories));
            } catch (err) {
                console.error(`Erro ao buscar histórico em lote:`, err);
            }
        }
        histories = cachedHistories[base];
    }

    symbols.forEach(s => {
        const symbol = currencySymbols[s] || s;
        const el = document.getElementById(s);
        if (!el) return; // Segurança extra
        const parent = el.parentElement;

        if (s === base) {
            el.innerText = `${symbol} ${formatNumber(amount)}`;
            parent.style.opacity = "0.4";
            parent.style.backgroundColor = ""; 
            parent.style.color = "#000";
            return;
        }

        const val = rates[s] * amount;
        el.innerText = `${symbol} ${formatNumber(val)}`;
        parent.style.opacity = "1";

        if (currentMode === "current") {
            if (rates[s] > 1) {
                parent.style.backgroundColor = "#28a745";
                parent.style.color = "#ffffff";
            } else if (rates[s] < 1) {
                parent.style.backgroundColor = "#dc3545";
                parent.style.color = "#ffffff";
            } else {
                parent.style.backgroundColor = "#6c757d";
                parent.style.color = "#ffffff";
            }
        } else if (currentMode === "historical") {
            const avg = histories[s] || 0;
            const diff = avg === 0 ? 0 : (rates[s] - avg)/avg;
            const threshold = 0.01; 

            if(diff > 0.05) { 
                parent.style.backgroundColor = "#006400";
                parent.style.color = "#ffffff";
            } else if(diff > threshold) {
                parent.style.backgroundColor = "#28a745";
                parent.style.color = "#ffffff";
            } else if(diff < -0.05) {
                parent.style.backgroundColor = "#8B0000";
                parent.style.color = "#ffffff";
            } else if(diff < -threshold) {
                parent.style.backgroundColor = "#dc3545";
                parent.style.color = "#ffffff";
            } else {
                parent.style.backgroundColor = "#6c757d";
                parent.style.color = "#ffffff";
            }
        }
    });
}

// Inicialização se a calculadora existir
if (amountInput && select && modeSelect) {

    // Inicializa eventos do gráfico
    if (typeof setupChartEvents === "function") {
        setupChartEvents();
    }

    // Evento: Digitação no input
    amountInput.addEventListener("keydown", (e) => {
        if (e.key === "-" || e.key === "e" || e.key === "+") {
            e.preventDefault();
        }
    });

    // Evento: Botão Converter
    const convertBtn = document.getElementById("convert");
    if (convertBtn) {
        convertBtn.addEventListener("click", async () => {
            const base = select.value;
            const amount = parseFloat(amountInput.value) || 1;

            const storageKey = `rates_current_${base}`;
            const cachedCurrent = sessionStorage.getItem(storageKey);

            if (cachedCurrent) {
                rates = JSON.parse(cachedCurrent);
            } else {
                const res = await fetch(`/rates/${base}`);
                const data = await res.json();
                rates = data.rates;
                sessionStorage.setItem(storageKey, JSON.stringify(rates));
            }

            updateValues(amount);
        });
    }

    // Evento: Mudança de Modo (Atual / Histórico)
    modeSelect.addEventListener("change", () => {
        let colorMode = modeSelect.value;
        const legendCurrent = document.getElementById("legend-current");
        const legendHistorical = document.getElementById("legend-historical");

        if (colorMode === "historical") {
            if(legendCurrent) legendCurrent.style.setProperty("display", "none", "important");
            if(legendHistorical) legendHistorical.style.setProperty("display", "flex", "important");
        } else {
            if(legendHistorical) legendHistorical.style.setProperty("display", "none", "important");
            if(legendCurrent) legendCurrent.style.setProperty("display", "flex", "important");
        }

        document.getElementById("convert").click(); 
    });

    // Inicia a aplicação carregando as moedas
    loadBaseCurrencies();
}