const CategoryItem = require('../models/CategoryItem');

exports.getAllItems = async (req, res) => {
  try {
    const items = await CategoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getItemsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const items = await CategoryItem.find({ category });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createItemWithUrl = async (req, res) => {
  const { category, name, details, img, price } = req.body;
  if (!category || !name || !details || !img || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ✅ auto format local image path
  let finalImg = img;
  if (!img.startsWith('http') && !img.startsWith('/uploads/')) {
    finalImg = `/uploads/${img}`;
  }

  try {
    const newItem = new CategoryItem({
      category,
      name,
      details,
      img: finalImg,
      price,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  const id = req.params.id;
  const { category, name, details, img, price } = req.body;

  if (!category || !name || !details || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedItem = await CategoryItem.findByIdAndUpdate(
      id,
      {
        category,
        name,
        details,
        img,
        price,
      },
      { new: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: 'Item not found' });

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
