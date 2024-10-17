// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 设置 MongoDB 连接
mongoose.connect('mongodb://localhost:27017/viewCounter', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 定义 ViewCount 模型
const ViewCountSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});
const ViewCount = mongoose.model('ViewCount', ViewCountSchema);

const app = express();
app.use(cors());

// 获取并更新浏览次数
app.get('/api/viewcount', async (req, res) => {
    try {
        let viewCount = await ViewCount.findOne();
        if (!viewCount) {
            viewCount = new ViewCount();
        }
        viewCount.count += 1;
        await viewCount.save();
        res.json({ viewCount: viewCount.count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});