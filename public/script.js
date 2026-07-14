
const results = document.getElementById("results");

document.getElementById("btnPatent").addEventListener("click", searchByPatent);
document.getElementById("btn-initial-letter").addEventListener("click", searchByLetters);
document.getElementById("btn-drivers").addEventListener("click", showAllDrivers);
document.getElementById("btn-cars").addEventListener("click", showAllCars);


function cleanData() {
    results.replaceChildren();
}

async function searchByPatent() {

    const patentValue = document.getElementById("patent").value;
    console.log('patentee', patentValue)

    const response = await fetch(`http://localhost:3000/auto?patente=${patentValue}`);

    const data = await response.json();

    renderObject(data, results)
}

async function searchByLetters() {

    const patentValue = document.getElementById("initial-letter").value;
    console.log('letras', patentValue)

    const response = await fetch(`http://localhost:3000/auto?iniciopatente=${patentValue}`);

    const data = await response.json();

    renderArray(data, results)
}

async function showAllDrivers() {
    const response = await fetch(`http://localhost:3000/conductores`);

    const data = await response.json();

    renderArray(data, results)
}

async function showAllCars() {
    const response = await fetch(`http://localhost:3000/automoviles`);

    const data = await response.json();

    renderArray(data, results)
}

function renderArray(arr, container = results) {
    container.replaceChildren();

    if (arr.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "No se encontraron resultados.";
        container.appendChild(empty);
        return;
    }

    arr.forEach((item, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "1rem";
        wrapper.style.paddingBottom = "0.5rem";
        wrapper.style.borderBottom = "1px solid #ccc";

        const title = document.createElement("strong");
        title.textContent = `Resultado ${index + 1}:`;
        wrapper.appendChild(title);

        container.appendChild(wrapper);

        renderObject(item, wrapper); // reutiliza tu función existente
    });
}

// retorna el automóvil con patente <string> y los datos de su conductor (si existe).


function renderObject(obj, container = results) {
    container.replaceChildren();

    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
            const title = document.createElement("div");
            const label = document.createElement("strong");
            label.textContent = `${key}:`;
            title.appendChild(label);
            container.appendChild(title);

            const block = document.createElement("div");
            block.style.marginLeft = "1rem";
            container.appendChild(block);

            // recursivo para el objeto anidado, sin limpiar container
            Object.entries(value).forEach(([nestedKey, nestedVal]) => {
                const line = document.createElement("div");
                const nestedLabel = document.createElement("strong");
                nestedLabel.textContent = `${nestedKey}: `;
                const span = document.createElement("span");
                span.textContent = nestedVal;
                line.appendChild(nestedLabel);
                line.appendChild(span);
                block.appendChild(line);
            });
        } else {
            const line = document.createElement("div");
            const label = document.createElement("strong");
            label.textContent = `${key}: `;
            const span = document.createElement("span");
            span.textContent = value;
            line.appendChild(label);
            line.appendChild(span);
            container.appendChild(line);
        }
    });
}