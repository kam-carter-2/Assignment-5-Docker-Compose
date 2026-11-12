const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'recipes.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      cookTime TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const samples = [
    [
      'Classic Chocolate Chip Cookies',
      '2 cups flour\n1 cup butter\n3/4 cup brown sugar\n2 eggs\n2 cups chocolate chips',
      'Mix ingredients, form cookies, and bake at 375°F for 9-11 minutes.',
      '25 minutes'
    ],
    [
      'Simple Pasta Carbonara',
      '400g spaghetti\n200g pancetta\n4 eggs\n100g Parmesan cheese',
      'Cook pasta. Cook pancetta. Mix eggs and Parmesan, then toss with hot pasta.',
      '20 minutes'
    ]
  ];

  for (const recipe of samples) {
    db.run(
      `INSERT INTO recipes (name, ingredients, instructions, cookTime)
       SELECT ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM recipes WHERE name = ?
       )`,
      [...recipe, recipe[0]]
    );
  }
});

module.exports = db;
