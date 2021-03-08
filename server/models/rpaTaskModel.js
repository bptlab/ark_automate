const mongoose = require('mongoose');

const {Schema} = mongoose;

const rpaVariableSchema = new Schema({
    Name: String,
    Type: String,
    Required: Boolean,
    InfoText: String 
});

const rpaTaskSchema = new Schema({
  Application: String,
  Task: String,
  Code: String,
  InputVars: [rpaVariableSchema],
  Output: rpaVariableSchema
}, { collection: 'completeCollection' });

mongoose.model('rpa-tasks-variable', rpaVariableSchema);
mongoose.model('rpa-task', rpaTaskSchema);
