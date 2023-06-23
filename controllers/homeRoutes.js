const router = require('express').Router();
const { User, Swap } = require('../models');
const withAuth = require('../utils/auth');

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

    const mockSwaps = [
      {
        id: 1,
        title: 'Strawberry Seedlings',
        description:
          'Many stawberry seedlings to swap, will swap for other berries or fruit',
        type: 'Swap',
        date_created: '2023-02-03T15:05:00.234Z',
      },
      {
        id: 2,
        title: 'Seed Potatoes',
        description: 'Looking for seed potatoes for my garden',
        type: 'Wanted',
        date_created: '2023-02-13T15:05:00.234Z',
      },
      {
        id: 3,
        title: 'Sweet potato runners',
        description:
          'I have too many sweet potato runners, Located in Brisbane CBD for pickup. First in best dressed!',
        type: 'Free',
        date_created: '2023-02-24T15:05:00.234Z',
      },
      {
        id: 4,
        title: 'Monstera Variegata cuttings',
        description:
          'I have 10 cuttings of Monstera Variegata. Happy for swapping offers with other variegated types!',
        type: 'Swap',
        date_created: '2023-01-15T10:05:00.234Z',
      },
    ];

    // Pass serialized data and session flag into template
    res.render('homepage', {
      swaps: mockSwaps,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

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

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
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

module.exports = router;
