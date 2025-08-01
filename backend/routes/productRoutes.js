const express = require('express');
const router = express.Router();
const CategoryItem = require('../models/CategoryItem'); // ঠিক path অনুযায়ী পরিবর্তন করুন

const validCategories = [
  'Dress',
  'Cosmetics',
  'Jewelry',
  'Bag',
  'Watch',
  'Phone',
  'Kids Item',
  'Shoe',
];

router.get('/featured', async (req, res) => {
  try {
    const featured = {};

    for (const category of validCategories) {
      const item = await CategoryItem.findOne({ category });
      featured[category] = item || null;
    }

    res.json(featured);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching featured items' });
  }
});

module.exports = router;
