// routes/area.js
const express = require('express');
const router = express.Router();
const Area = require('../models/area');
const Animal = require('../models/animal'); // asumo que este es el modelo de animales

// Crear un área
router.post('/areas', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const area = new Area({ nombre, descripcion });
    const saved = await area.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todas las áreas (opcional populate de animales)
router.get('/areas', async (req, res) => {
  try {
    const areas = await Area.find().populate('animales'); // si usas el array animales
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un área por id (con animales relacionados usando populate)
// Si asocias en Animal el campo area, populate buscará los animales con ese área:
router.get('/areas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Opción A: si guardas referencias en Area.animales:
    // const area = await Area.findById(id).populate('animales');

    // Opción B (más común): buscar Area y además traer animales que tengan area = id
    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ message: 'Área no encontrada' });

    const animales = await Animal.find({ area: id });
    res.json({ area, animales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un área
router.put('/areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const updated = await Area.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Área no encontrada' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un área
router.delete('/areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // opcional: antes de borrar, podrías setear area: null en animales relacionados
    await Animal.updateMany({ area: id }, { $set: { area: null } });

    const deleted = await Area.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Área no encontrada' });
    res.json({ message: 'Área eliminada', deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
  Endpoint útil: crear un animal dentro de un área (recibe areaId en la URL)
  Esto crea el animal y asigna su campo area al id del área.
*/
router.post('/areas/:areaId/animales', async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findById(areaId);
    if (!area) return res.status(404).json({ message: 'Área no encontrada' });

    const { nombre, edad, tipo, fecha } = req.body;
    const nuevoAnimal = new Animal({ nombre, edad, tipo, fecha, area: areaId });
    const savedAnimal = await nuevoAnimal.save();

    // Si estás manteniendo lista en Area.animales, haces push:
    area.animales.push(savedAnimal._id);
    await area.save();

    res.status(201).json(savedAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
