const express = require('express');
const router = express.Router();

// Login
router.get('/', (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// router.get('/room', ensureAuth, async (req, res) => {
//   try {
//     res.send('Homepage');
//   } catch (error) {
//     res.render('error/500');
//   }
// });

module.exports = router;
