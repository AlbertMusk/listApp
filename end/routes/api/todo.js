const router = require('express').Router();
const Todo = require('../../models/Todo');
const User = require('../../models/User');

router.get('/', (req, res) => {
    res.send('Todo Home Page');
});

router.get('/create', async (req, res, next) => {
    try {
        const user = await User.findOne(); // 假设已经有用户存在
        if (!user) {
            return res.status(400).json({ message: 'No user found' });
        }
        const newTodo = new Todo({
            title: 'Sample Todo',
            description: 'This is a sample todo item.',
            todoPersonID: user._id,
            todoPersonName: user.username,
            content: 'Sample content',
            dueDate: new Date(Date.now() + 7*24*60*60*1000) // 一周后
        });
        await newTodo.save();
        res.json({ message: 'Todo created', todo: newTodo });
    } catch (err) {
        next(err);
    }
});

module.exports = router;