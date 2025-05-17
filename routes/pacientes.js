const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los pacientes
router.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM pacientes ORDER BY id');
    res.json(result.rows);
});

// Obtener un paciente por ID
router.get('/:id', async (req, res) => {
    const result = await db.query('SELECT * FROM pacientes WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
});

// Crear nuevo paciente
router.post('/', async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, sexo, correo, telefono, direccion } = req.body;
    const result = await db.query(
        'INSERT INTO pacientes (nombre, apellido, fecha_nacimiento, sexo, correo, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nombre, apellido, fecha_nacimiento, sexo, correo, telefono, direccion]
    );
    res.status(201).json(result.rows[0]);
});

// Actualizar paciente
router.put('/:id', async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, sexo, correo, telefono, direccion } = req.body;
    const result = await db.query(
        'UPDATE pacientes SET nombre=$1, apellido=$2, fecha_nacimiento=$3, sexo=$4, correo=$5, telefono=$6, direccion=$7 WHERE id=$8 RETURNING *',
        [nombre, apellido, fecha_nacimiento, sexo, correo, telefono, direccion, req.params.id]
    );
    res.json(result.rows[0]);
});

// Eliminar paciente
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM pacientes WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
});

module.exports = router;
