const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CategoryItem = require('../models/CategoryItem');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

const items = [
  // Dress
  {
    category: 'Dress',
    name: 'Floral Summer Dress',
    img: '/dress/1.jpg',
    details: 'Lightweight floral dress perfect for summer outings.',
    price: 3200,
  },
  {
    category: 'Dress',
    name: 'Evening Gown',
    img: '/dress/2.jpg',
    details: 'Elegant long evening gown for special occasions.',
    price: 7500,
  },
  {
    category: 'Dress',
    name: 'Denim Dress',
    img: '/dress/3.jpg',
    details: 'Trendy denim dress with button-down front.',
    price: 4500,
  },
  {
    category: 'Dress',
    name: 'Office Wear Dress',
    img: '/dress/4.jpg',
    details: 'Formal dress ideal for office and meetings.',
    price: 3800,
  },
  {
    category: 'Dress',
    name: 'Maxi Dress',
    img: '/dress/5.jpg',
    details: 'Flowy maxi dress in soft fabric.',
    price: 4300,
  },

  // Cosmetics
  {
    category: 'Cosmetics',
    name: 'Matte Lipstick',
    img: '/cosmetics/1.jpg',
    details: 'Long-lasting matte lipstick in various shades.',
    price: 600,
  },
  {
    category: 'Cosmetics',
    name: 'Foundation',
    img: '/cosmetics/2.jpg',
    details: 'Full-coverage foundation for all skin types.',
    price: 1100,
  },
  {
    category: 'Cosmetics',
    name: 'Mascara',
    img: '/cosmetics/3.jpg',
    details: 'Waterproof mascara with volumizing effect.',
    price: 850,
  },
  {
    category: 'Cosmetics',
    name: 'Eyeshadow Palette',
    img: '/cosmetics/4.jpg',
    details: 'Multi-color eyeshadow palette with smooth texture.',
    price: 1300,
  },
  {
    category: 'Cosmetics',
    name: 'Blush',
    img: '/cosmetics/5.jpg',
    details: 'Natural-toned blush for radiant cheeks.',
    price: 550,
  },

  // Jewelry
  {
    category: 'Jewelry',
    name: 'Gold Necklace',
    img: '/jewelary/1.jpg',
    details: 'Elegant 18k gold-plated necklace.',
    price: 5800,
  },
  {
    category: 'Jewelry',
    name: 'Diamond Earrings',
    img: '/jewelary/2.jpg',
    details: 'Stylish earrings with diamond studs.',
    price: 7200,
  },
  {
    category: 'Jewelry',
    name: 'Silver Bracelet',
    img: '/jewelary/3.jpg',
    details: '925 sterling silver bracelet with design.',
    price: 3100,
  },
  {
    category: 'Jewelry',
    name: 'Anklet Set',
    img: '/jewelary/4.jpg',
    details: 'Traditional anklet set with bells.',
    price: 2500,
  },
  {
    category: 'Jewelry',
    name: 'Pearl Pendant',
    img: '/jewelary/5.jpg',
    details: 'Classic pearl pendant for formal wear.',
    price: 3300,
  },

  // Bag
  {
    category: 'Bag',
    name: 'Leather Handbag',
    img: '/bag/1.jpg',
    details: 'Premium leather handbag with compartments.',
    price: 4300,
  },
  {
    category: 'Bag',
    name: 'Backpack',
    img: '/bag/2.jpg',
    details: 'Durable backpack suitable for travel and school.',
    price: 2700,
  },
  {
    category: 'Bag',
    name: 'Tote Bag',
    img: '/bag/3.jpg',
    details: 'Eco-friendly canvas tote bag.',
    price: 1200,
  },
  {
    category: 'Bag',
    name: 'Sling Bag',
    img: '/bag/4.jpg',
    details: 'Compact sling bag for daily use.',
    price: 1600,
  },
  {
    category: 'Bag',
    name: 'Travel Duffle',
    img: '/bag/5.jpg',
    details: 'Spacious duffle bag for travel.',
    price: 3600,
  },

  // Watch
  {
    category: 'Watch',
    name: 'Analog Watch',
    img: '/watch/1.jpg',
    details: 'Classic analog watch with leather strap.',
    price: 4900,
  },
  {
    category: 'Watch',
    name: 'Smartwatch',
    img: '/watch/2.jpg',
    details: 'Feature-rich smartwatch with health tracking.',
    price: 8700,
  },
  {
    category: 'Watch',
    name: 'Digital Watch',
    img: '/watch/3.jpg',
    details: 'Digital sports watch with stopwatch feature.',
    price: 2500,
  },
  {
    category: 'Watch',
    name: 'Couple Watch Set',
    img: '/watch/4.jpg',
    details: 'Matching couple watches with gift box.',
    price: 7800,
  },
  {
    category: 'Watch',
    name: 'Minimalist Watch',
    img: '/watch/5.jpg',
    details: 'Minimal design wristwatch for casual use.',
    price: 3900,
  },

  // Phone
  {
    category: 'Phone',
    name: 'Smartphone A10',
    img: '/phone/1.jpg',
    details: 'Entry-level smartphone with basic features.',
    price: 12500,
  },
  {
    category: 'Phone',
    name: 'Smartphone X20',
    img: '/phone/2.jpg',
    details: 'Mid-range smartphone with great camera.',
    price: 19500,
  },
  {
    category: 'Phone',
    name: 'Smartphone Pro Max',
    img: '/phone/3.jpg',
    details: 'Flagship phone with top specs and design.',
    price: 62000,
  },
  {
    category: 'Phone',
    name: 'Gaming Phone G5',
    img: '/phone/4.jpg',
    details: 'Gaming optimized phone with cooling system.',
    price: 30500,
  },
  {
    category: 'Phone',
    name: 'Mini Smartphone',
    img: '/phone/5.jpg',
    details: 'Compact smartphone for basic tasks.',
    price: 8900,
  },

  // Kids Item
  {
    category: 'Kids Item',
    name: 'Toy Car',
    img: '/kids/1.jpg',
    details: 'Battery operated toy car for kids.',
    price: 1800,
  },
  {
    category: 'Kids Item',
    name: 'Coloring Book',
    img: '/phone/2.jpg',
    details: 'Fun coloring book with 100+ pages.',
    price: 300,
  },
  {
    category: 'Kids Item',
    name: 'Educational Tablet',
    img: '/kids/3.png',
    details: 'Learning tablet with interactive games.',
    price: 4200,
  },
  {
    category: 'Kids Item',
    name: 'Plush Teddy Bear',
    img: '/kids/4.jpg',
    details: 'Soft and huggable teddy bear.',
    price: 900,
  },
  {
    category: 'Kids Item',
    name: 'Kids Backpack',
    img: '/kids/5.png',
    details: 'Cartoon character backpack for school.',
    price: 950,
  },

  // Shoe
  {
    category: 'Shoe',
    name: 'Running Shoes',
    img: '/shoe/1.jpg',
    details: 'Comfortable shoes for jogging and running.',
    price: 3700,
  },
  {
    category: 'Shoe',
    name: 'Casual Sneakers',
    img: '/shoe/2.jpg',
    details: 'Stylish sneakers for casual wear.',
    price: 3400,
  },
  {
    category: 'Shoe',
    name: 'Formal Leather Shoes',
    img: '/shoe/3.jpg',
    details: 'Elegant leather shoes for formal occasions.',
    price: 6200,
  },
  {
    category: 'Shoe',
    name: 'Sandals',
    img: '/shoe/4.jpg',
    details: 'Open-toe sandals for summer.',
    price: 1800,
  },
  {
    category: 'Shoe',
    name: 'Kids Shoes',
    img: '/shoe/5.jpg',
    details: 'Cute and comfy shoes for kids.',
    price: 1200,
  },
];

async function seedCategoryItems() {
  try {
    await CategoryItem.deleteMany();
    await CategoryItem.insertMany(items);
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Import Failed:', error);
    process.exit(1);
  }
}

seedCategoryItems();
