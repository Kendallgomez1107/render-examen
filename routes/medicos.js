const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar médicos
router.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM medicos ORDER BY id');
    res.json(result.rows);
});

// Obtener médico por ID
router.get('/:id', async (req, res) => {
    const result = await db.query('SELECT * FROM medicos WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
});

// Crear médico
router.post('/', async (req, res) => {
    const { nombre, apellido, especialidad, correo, telefono } = req.body;
    const result = await db.query(
        'INSERT INTO medicos (nombre, apellido, especialidad, correo, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, apellido, especialidad, correo, telefono]
    );
    res.status(201).json(result.rows[0]);
});

// Actualizar médico
router.put('/:id', async (req, res) => {
    const { nombre, apellido, especialidad, correo, telefono } = req.body;
    const result = await db.query(
        'UPDATE medicos SET nombre=$1, apellido=$2, especialidad=$3, correo=$4, telefono=$5 WHERE id=$6 RETURNING *',
        [nombre, apellido, especialidad, correo, telefono, req.params.id]
    );
    res.json(result.rows[0]);
});

// Eliminar médico
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM medicos WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
});

module.exports = router;
