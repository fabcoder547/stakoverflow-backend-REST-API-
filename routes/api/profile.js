const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Done with profile route')
})
module.exports = router