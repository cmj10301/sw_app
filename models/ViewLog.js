const mongoose = require("mongoose");

const viewLogSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // 사용자 ID
    ipAddress: { type: String, required: true }, // IP 주소
    viewedAt: { type: Date, default: Date.now }, // 조회 시간
});

module.exports = mongoose.models.ViewLog || mongoose.model("ViewLog", viewLogSchema);
