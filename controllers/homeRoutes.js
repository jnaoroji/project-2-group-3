const router = require('express').Router();
const { User, Swap } = require('../models');
const withAuth = require('../utils/auth');

//gets all exisiting lisitings for homepage

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const swapData = await Swap.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const swaps = swapData.map((swap) => swap.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      swaps,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//gets each lisiting by id
router.get('/swap/:id', async (req, res) => {
  try {
    const swapData = await Swap.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const swap = swapData.get({ plain: true });

    res.render('swap', {
      ...swap,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//get swap page if logged in
// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Swap }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('signup');
});

module.exports = router;
