const express = require('express');
const app = express();

// Middleware for parsing JSON
app.use(express.json());

const conductores = [
    { id: 1, nombre: 'Don Pepe', edad: 55 },
    { id: 2, nombre: 'Pedro', edad: 25 },
    { id: 3, nombre: 'Maria', edad: 33 },
    { id: 4, nombre: 'Francisco', edad: 19 },
    { id: 5, nombre: 'Camilo', edad: 29 },
    { id: 6, nombre: 'Andres', edad: 35 },
    { id: 7, nombre: 'Mario', edad: 48 },
    { id: 8, nombre: 'Felipe', edad: 33 }
];

const automoviles = [

    {
        marca: 'Ford', patente: 'HXJH55', nombre_conductor: 'Felipe'
    },

    {
        marca: 'Toyota', patente: 'HLSA26', nombre_conductor: 'Pedro'
    },

    {
        marca: 'Mercedes', patente: 'JFTS47', nombre_conductor: 'Maria'
    },
    {
        marca: 'Chevrolet', patente: 'RTPP97', nombre_conductor: 'Francisco'
    },
    {
        marca: 'Nissan', patente: 'SDTR51', nombre_conductor: 'Don Pepe'
    },
    {
        marca: 'Mazda', patente: 'RDCS19', nombre_conductor: 'Francisco'
    },
    {
        marca: 'Kia', patente: 'KDTZ28', nombre_conductor: 'Don Pepe'
    },
    {
        marca: 'Jeep', patente: 'FFDF88', nombre_conductor: 'Paulina'
    },
    {
        marca: 'Suzuki', patente: 'DRTS41', nombre_conductor: 'Heriberto'
    },
    {
        marca: 'Honda', patente: 'BXVZ67', nombre_conductor: 'Manuel'
    },
]

// 1. Todos los conductores
app.get('/conductores', (req, res) => {
    res.json(conductores);
});

// 2. Todos los automóviles
app.get('/automoviles', (req, res) => {
    res.json(automoviles);
});

// 3. Conductores menores de cierta edad que no tienen auto
app.get('/conductoressinauto', (req, res) => {

    const edad = parseInt(req.query.edad);

    const resultado = conductores.filter(conductor => {

        const tieneAuto = automoviles.some(
            auto => auto.nombre_conductor === conductor.nombre
        );

        return conductor.edad < edad && !tieneAuto;
    });

    res.json(resultado);
});

// 4. Conductores sin auto y autos sin conductor
app.get('/solitos', (req, res) => {

    const conductoresSinAuto = conductores.filter(conductor =>
        !automoviles.some(
            auto => auto.nombre_conductor === conductor.nombre
        )
    );

    const autosSinConductor = automoviles.filter(auto =>
        !conductores.some(
            conductor => conductor.nombre === auto.nombre_conductor
        )
    );

    res.json({
        conductoresSinAuto,
        autosSinConductor
    });
});

// 5 y 6. Buscar por patente o inicio de patente
app.get('/auto', (req, res) => {

    const { patente, iniciopatente } = req.query;

    // /auto?patente=HXJH55
    if (patente) {

        const auto = automoviles.find(
            a => a.patente === patente
        );

        if (!auto) {
            return res.status(404).json({
                mensaje: 'Automóvil no encontrado'
            });
        }

        const conductor = conductores.find(
            c => c.nombre === auto.nombre_conductor
        );

        return res.json({
            auto,
            conductor: conductor || null
        });
    }

    // /auto?iniciopatente=H
    if (iniciopatente) {

        const resultado = automoviles
            .filter(auto =>
                auto.patente.startsWith(iniciopatente)
            )
            .map(auto => ({
                auto,
                conductor:
                    conductores.find(
                        c => c.nombre === auto.nombre_conductor
                    ) || null
            }));

        return res.json(resultado);
    }

    res.status(400).json({
        mensaje: 'Debe enviar patente o iniciopatente'
    });
});

app.listen(8080, () => {
    console.log('Servidor ejecutándose en puerto 8080');
});