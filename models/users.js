const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    알레르기: { type: String},
});

export default mongoose.models.User || mongoose.model('User', userSchema);
