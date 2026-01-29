let chart;

// --- Funções do Chart ---

async function showChart(base, target) {
    const amount = parseFloat(amountInput.value) || 1;
    let url = `/history/${base}/${target}`;

    const box = document.getElementById("chartBox");
    const loader = document.getElementById("chartLoader");
    const wrapper = document.getElementById("chartWrapper");
    const canvas = document.getElementById("myChart");

    box.style.display = "block";
    if (loader) loader.style.setProperty("display", "flex", "important");
    if (wrapper) wrapper.style.display = "none";

    const today = new Date();
    const to = today.toISOString().split("T")[0];
    let from;

    let currentMode = modeSelect ? modeSelect.value : "current";

    if (currentMode === "historical") {
        const past = new Date();
        past.setDate(today.getDate() - 30);
        from = past.toISOString().split("T")[0];
    } else {
        from = "1999-01-04"; 
    }
    
    url += `?from=${from}&to=${to}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        let rawLabels = Object.keys(data.rates);
        let rawValues = rawLabels.map(d => (data.rates[d][target] * amount).toFixed(2));

        const { labels, values } = downsampleData(rawLabels, rawValues, 1500);
        
        if (loader) loader.style.setProperty("display", "none", "important");
        if (wrapper) wrapper.style.display = "block";

        if (chart) chart.destroy();

        chart = new Chart(canvas, {
            type: "line",
            data: {
                labels, 
                datasets: [{
                    label: `${amount} ${base} → ${target} (${currentMode === "historical" ? APP_TRANSLATIONS.chart_last_30 : APP_TRANSLATIONS.chart_from_1999})`,                    
                    data: values, 
                    borderColor: "#0d6efd",
                    backgroundColor: "rgba(13, 110, 253, 0.1)",
                    borderWidth: 1.5,
                    pointRadius: 0, 
                    pointHoverRadius: 4, 
                    pointHitRadius: 10, 
                    tension: 0.1, 
                    fill: true,
                    spanGaps: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                animation: { duration: labels.length > 500 ? 0 : 400 },
                normalized: true,
                parsing: true, 
                plugins: {
                    decimation: { enabled: true, algorithm: 'lttb' },
                    zoom: {
                        limits: { x: { min: 'original', max: 'original' }, y: { min: 'original', max: 'original' } },
                        pan: { enabled: true, mode: 'x', threshold: 5 },
                        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
                    },
                    tooltip: { mode: 'index', intersect: false, animation: false }
                },
                interaction: { intersect: false, mode: 'nearest', axis: 'x' },
                scales: {
                    x: { title: { display: true, text: "Data" }, ticks: { maxTicksLimit: 12, autoSkip: true } },
                    y: { title: { display: true, text: target } }
                }
            }
        });
    } catch (err) {
        console.error("Erro ao carregar gráfico", err);
        if (loader) loader.innerHTML = "<p class='text-danger'>Erro ao carregar dados.</p>";
    }
}

// Configura eventos do gráfico (fechar e resetar zoom)
function setupChartEvents() {
    const closeChartBtn = document.getElementById("closeChart");
    if (closeChartBtn) {
        closeChartBtn.onclick = () => {
            document.getElementById("chartBox").style.display = "none";
        };
    }

    const resetZoomBtn = document.getElementById("resetZoom");
    if (resetZoomBtn) {
        resetZoomBtn.addEventListener("click", () => {
            if (chart) chart.resetZoom();
        });
    }
}