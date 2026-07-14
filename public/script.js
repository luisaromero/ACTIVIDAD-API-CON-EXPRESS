
const results = document.getElementById("results");

document.getElementById("btnPatent").addEventListener("click", searchByPatent);
document.getElementById("btn-initial-letter").addEventListener("click", searchByLetters);

function cleanData() {
    results.replaceChildren();
}

async function searchByPatent() {

    const patentValue = document.getElementById("patent").value;
    console.log('patentee', patentValue)

    const response = await fetch(`http://localhost:3000/auto?patente=${patentValue}`);

    const data = await response.json();


    renderObjects(data, results)
}
async function searchByLetters() {

    const patentValue = document.getElementById("initial-letter").value;
    console.log('letras', patentValue)

    const response = await fetch(`http://localhost:3000/auto?iniciopatente=${patentValue}`);

    const data = await response.json();


    console.log(data)
}

// retorna el automóvil con patente <string> y los datos de su conductor (si existe).
function renderObjects(obj, container = results) {

    if (container === results) {
        results.replaceChildren()
    }

    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
            const title = document.createElement("p");
            title.textContent = `${key}:`;
            container.appendChild(title);

            const block = document.createElement("div");
            block.style.marginLeft = "1rem";
            container.appendChild(block);

            renderObjects(value, block);
        } else {
            const line = document.createElement("p");
            line.textContent = `${key}: ${value}`;
            container.appendChild(line);
        }
    });

}