const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar consultas
router.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM consultas ORDER BY id');
    res.json(result.rows);
});

// Obtener consulta por ID
router.get('/:id', async (req, res) => {
    const result = await db.query('SELECT * FROM consultas WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
});

// Crear consulta
router.post('/', async (req, res) => {
    const { cita_id, sintomas, diagnostico, tratamiento, notas } = req.body;
    const result = await db.query(
        'INSERT INTO consultas (cita_id, sintomas, diagnostico, tratamiento, notas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [cita_id, sintomas, diagnostico, tratamiento, notas]
    );
    res.status(201).json(result.rows[0]);
});

// Actualizar consulta
router.put('/:id', async (req, res) => {
    const { cita_id, sintomas, diagnostico, tratamiento, notas } = req.body;
    const result = await db.query(
        'UPDATE consultas SET cita_id=$1, sintomas=$2, diagnostico=$3, tratamiento=$4, notas=$5 WHERE id=$6 RETURNING *',
        [cita_id, sintomas, diagnostico, tratamiento, notas, req.params.id]
    );
    res.json(result.rows[0]);
});

// Eliminar consulta
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM consultas WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
});

module.exports = router;
