
const results = document.getElementById("results");

document.getElementById("btnPatent").addEventListener("click", searchByPatent);
document.getElementById("btn-initial-letter").addEventListener("click", searchByLetters);
document.getElementById("btn-drivers").addEventListener("click", showAllDrivers);
document.getElementById("btn-cars").addEventListener("click", showAllCars);
document.getElementById("btn-search-by-age").addEventListener("click", searchByAge);
document.getElementById("btn-alone").addEventListener("click", searchByNoCarsNoDrivers);





async function showAllDrivers() {
    const response = await fetch(`http://localhost:3000/conductores`);

    const data = await response.json();

    renderArray(data, results)
}



async function showAllCars() {

    const patentValue = document.getElementById("initial-letter").value;
    const response = await fetch(`http://localhost:3000/automoviles`);

    const data = await response.json();

    renderArray(data, results)
}

async function searchByAge() {

    const searchByAgeValue = document.getElementById("search-by-age").value;
    const response = await fetch(`http://localhost:3000/conductoressinauto?edad=${searchByAgeValue}`);

    const data = await response.json();

    renderArray(data, results)
}

async function searchByNoCarsNoDrivers() {

    const response = await fetch(`/solitos`);

    const data = await response.json();

    showDriverlessAndNoCar(data, results)
}



async function searchByPatent() {

    const patentValue = document.getElementById("patent").value;

    const response = await fetch(`http://localhost:3000/auto?patente=${patentValue}`);

    const data = await response.json();

    renderObject(data, results)
}


async function searchByLetters() {

    const patentValue = document.getElementById("initial-letter").value;

    const response = await fetch(`http://localhost:3000/auto?iniciopatente=${patentValue}`);

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
        wrapper.classList.add("result-card");
        const title = document.createElement("strong");
        title.textContent = `Resultado ${index + 1}:`;
        wrapper.appendChild(title);

        container.appendChild(wrapper);

        renderObject(item, wrapper); // reutiliza tu función existente
    });
}



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

function showDriverlessAndNoCar(data, container = results) {
    container.replaceChildren();

    // Sección: conductores sin auto
    const noCarTitle = document.createElement("h3");
    noCarTitle.textContent = "Conductores sin auto";
    container.appendChild(noCarTitle);

    if (data.noCar.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "No hay conductores sin auto.";
        container.appendChild(empty);
    } else {
        data.noCar.forEach((driver, index) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("result-card");
            container.appendChild(wrapper);
            renderObject(driver, wrapper);
        });
    }

    // Sección: autos sin conductor
    const driverlessTitle = document.createElement("h3");
    driverlessTitle.textContent = "Autos sin conductor";
    container.appendChild(driverlessTitle);

    if (data.driverless.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "No hay autos sin conductor.";
        container.appendChild(empty);
    } else {
        data.driverless.forEach((car, index) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("result-card");
            container.appendChild(wrapper);
            renderObject(car, wrapper);
        });
    }
}