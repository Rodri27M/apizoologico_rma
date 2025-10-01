const mongoose = require("mongoose");
const areaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  // opcional: mantener lista de animales referenciados (no necesaria si guardas la referencia de area en animal)
  animales: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  }],
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Area', areaSchema);