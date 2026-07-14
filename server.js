const express = require('express');
const path = require('path');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public')));

const drivers = [
    {
        id: 1, nombre: 'Don Pepe', edad: 55
    },
    {
        id: 2, nombre: 'Pedro', edad: 25
    },
    {
        id: 3, nombre: 'Maria', edad: 33
    },
    {
        id: 4, nombre: 'Francisco', edad: 19
    },
    {
        id: 5, nombre: 'Camilo', edad: 29
    },
    {
        id: 6, nombre: 'Andres', edad: 35
    },
    {
        id: 7, nombre: 'Mario', edad: 48
    },
    {
        id: 8, nombre: 'Felipe', edad: 33
    }
];

const cars = [

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

// si ingresas a esta url te devolverá los conductores
app.get('/drivers', (req, res) => {
    res.json(drivers);
});

// si ingresas a esta url te devolverá los autos
app.get('/automoviles', (req, res) => {
    res.json(cars);
});

// retorna conductores menores de <numero> años que no tienen automóvil.
app.get('/conductoressinauto', (req, res) => {


    //tomamos el año en el parametro que nos llega de la url
    const age = parseInt(req.query.edad);

    const driversWithoutACar = drivers.filter(driver => {

        const hasCar = cars.some(
            car => car.nombre_conductor === driver.nombre
        );

        return driver.edad < age && !hasCar;
    });

    res.json(driversWithoutACar);
});

// retorna la lista de conductores sin automóvil y automóviles sin conductor.
app.get('/solitos', (req, res) => {


    // lista de conductores sin automovil
    const noCar = drivers.filter(driver =>

        // devuelve true si la condición se cumple --> por que usar some y no otro método :https://www.youtube.com/shorts/Q8SX7gaA-wI
        !cars.some(
            car => car.nombre_conductor === driver.nombre
        )
    );
    // lista de conductores sin automovil
    const driverless = cars.filter(car =>
        !drivers.some(
            driver => driver.nombre === car.nombre_conductor
        )
    );

    res.json({
        noCar,
        driverless
    });
});

// retorna el automóvil con patente <string> y los datos de su conductor (si existe).
//url con query = auto?patente=<string>
//auto?patente=HXJH55
app.get('/auto', (req, res) => {

    const patent = req.query.patente;
    const patentInitiation = req.query.iniciopatente;

    // Caso 1: búsqueda por patente exacta
    if (patent) {
        const findThePatent = cars.find(car => car.patente === patente);

        if (!findThePatent) {
            return res.status(404).json({
                mensaje: 'Automóvil no encontrado'
            });
        }

        const findTheDriver = drivers.find(
            driver => driver.nombre === findThePatent.nombre_conductor
        );

        return res.json({
            auto: findThePatent,
            conductor: findTheDriver || null
        });
    }

    // url con query auto?iniciopatente=<letra>: 
    // retorna los automóviles cuya patente comienza con <letra> y los datos de su conductor (si existe).
    if (patentInitiation) {
        // aquí es dónde guardaremos los resultados de la busqueda de info sobre los autos que comienzen con tales letras
        let result = [];

        // hacemos un recorrido por todos los autos buscando cuales estan con esas letras de inicio , método starwith ayudará a eso

        for (let car of cars) {

            // El método startsWith() indica si una cadena de texto comienza con los caracteres de una cadena de texto 
            // concreta, devolviendo true o false según corresponda.

            if (car.patente.startsWith(patentInitiation)) {
                //   inicializamos una variable para guardar el conductor encontrado si es que ese auto con esas iniciales tiene conductor
                let driverFound = null;
                // hacemos un nuevo recorrido dentro del mismo recorrido de autos , esta vez para tomar los datos de los autos y
                // hacerlos coincidir si existe una coincidencia con si el auto encuentra al conductor dentro de este for
                for (let driver of drivers) {

                    if (driver.nombre === car.nombre_conductor) {
                        // guardamos los datos del conductor encontrado
                        driverFound = driver;
                        break;
                    }
                }
                // dentro del bucle de autos vamos , agregando un obj con los datos del auto y el conductor
                result.push({
                    auto: car,
                    conductor: driverFound
                });
            }
        }

        res.json(result);

    }

    // Si no viene ninguno de los dos query params
    return res.status(400).json({
        mensaje: 'Debes enviar el query "patente" o "iniciopatente"'
    });

});



app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});

