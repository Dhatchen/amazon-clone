const categories = [
  "Electronics", "Fashion", "Home & Kitchen", "Books", "Beauty",
  "Sports & Outdoors", "Automotive", "Toys & Games", "Health", "Groceries"
];

export const mockProducts = [];
let idCounter = 1;

categories.forEach((category) => {
  for (let i = 1; i <= 10; i++) {
    mockProducts.push({
      id: idCounter++,
      name: `${category} Premium Item ${i}`,
      category: category,
      price: Math.floor(Math.random() * 150) + 10,
      description: `This is a high-quality ${category.toLowerCase()} product designed to meet your everyday needs. It features durable materials, a sleek design, and comes with a full 1-year manufacturer warranty. Perfect for personal use or as a gift.`,
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
      reviews: Math.floor(Math.random() * 500) + 10,
      inStock: Math.random() > 0.1, // 90% chance of being in stock
    });
  }
});

export { categories };