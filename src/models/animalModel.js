const mongoose = require("mongoose"); // importando el componente mogoose​
const animalSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
 codigo:{
  type: String,
  require: true
 } 
});

module.exports = mongoose.model("Animal", animalSchema);