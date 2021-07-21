const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const usuarios = [
    { id: 1, nombre: 'agustin' },
    { id: 2, nombre: 'usuario2' },
    { id: 3, nombre: 'usuario3' }
];
app.get('/', (req, res) => {
    res.send('hola mundo desde Express.');

});
app.get('/api/usuarios', (req, res) => {

    res.send(usuarios);

});

app.get('/api/usuarios/:id', (req, res) => {

    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('el usuario no fue encontrado');
    res.send(usuario);
})

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    const { error, value } = validarUsuario(req.body.nombre);

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: req.body.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);

    }
});

app.put('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('el usuario no fue encontrado');
        return;
    }
    const { error, value } = validarUsuario(req.body.nombre);

    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('el usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario)
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando por el puerto ${port}...`);
})

function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom }));
}