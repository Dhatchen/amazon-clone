/* eslint-disable security/detect-object-injection */
const categories = [
  "Electronics", "Fashion", "Home & Kitchen", "Books", "Beauty",
  "Sports & Outdoors", "Automotive", "Toys & Games", "Health", "Groceries"
];

// Beautiful, royalty-free category images from Unsplash
const categoryImages = {
  "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
  "Fashion": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
  "Home & Kitchen": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80",
  "Books": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
  "Beauty": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
  "Sports & Outdoors": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80",
  "Automotive": "https://images.unsplash.com/photo-1602491453631-e2a5fc83a524?w=500&q=80",
  "Toys & Games": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6071?w=500&q=80",
  "Health": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=80",
  "Groceries": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"
};

const mockProducts = [];

categories.forEach((category) => {
  for (let i = 1; i <= 10; i++) {
    mockProducts.push({
      name: `${category} Premium Item ${i}`,
      description: `This is a high-quality ${category.toLowerCase()} product designed to meet your everyday needs. It features durable materials, a sleek design, and comes with a full 1-year manufacturer warranty.`,
      price: Math.floor(Math.random() * 14500) + 500, // Kept the Rupee-friendly pricing!
      category: category,
      image: categoryImages[category], // Assigns the correct image URL!
      stock: Math.floor(Math.random() * 50) + 1,
      seller: null, 
      averageRating: (Math.random() * 2 + 3).toFixed(1),
    });
  }
});

module.exports = mockProducts;