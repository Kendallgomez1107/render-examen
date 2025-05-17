const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar citas
router.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM citas ORDER BY id');
    res.json(result.rows);
});

// Obtener cita por ID
router.get('/:id', async (req, res) => {
    const result = await db.query('SELECT * FROM citas WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
});

// Crear nueva cita
router.post('/', async (req, res) => {
    const { paciente_id, medico_id, fecha_hora, estado } = req.body;
    const result = await db.query(
        'INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado) VALUES ($1, $2, $3, $4) RETURNING *',
        [paciente_id, medico_id, fecha_hora, estado]
    );
    res.status(201).json(result.rows[0]);
});

// Actualizar cita
router.put('/:id', async (req, res) => {
    const { paciente_id, medico_id, fecha_hora, estado } = req.body;
    const result = await db.query(
        'UPDATE citas SET paciente_id=$1, medico_id=$2, fecha_hora=$3, estado=$4 WHERE id=$5 RETURNING *',
        [paciente_id, medico_id, fecha_hora, estado, req.params.id]
    );
    res.json(result.rows[0]);
});

// Eliminar cita
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM citas WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
});

module.exports = router;
