import { v4 as uuidv4 } from 'uuid';
import db from './db.js';

const recipes = [
  // ─── BAKING ───────────────────────────────────────────────────────────────
  {
    id: uuidv4(),
    title: 'Classic Sourdough Bread',
    description: 'A rustic, chewy loaf with a crackling crust and open crumb, fermented slowly for deep flavour.',
    category: 'Baking',
    cuisine: 'Italian',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800',
    ingredients: [
      { name: 'Bread flour', amount: '500', unit: 'g' },
      { name: 'Water', amount: '375', unit: 'ml' },
      { name: 'Sourdough starter', amount: '100', unit: 'g' },
      { name: 'Fine sea salt', amount: '10', unit: 'g' }
    ],
    steps: [
      'Combine bread flour and 350 ml of water in a large bowl, mixing until no dry flour remains. Cover and rest for 30 minutes (autolyse).',
      'Add the sourdough starter and salt with the remaining 25 ml of water. Squeeze through your fingers until fully incorporated.',
      'Perform 4 sets of stretch-and-folds every 30 minutes over 2 hours, then leave covered at room temperature for bulk fermentation (4–6 hours total) until 50 % risen.',
      'Turn the dough onto an unfloured surface, shape into a tight round boule, and place seam-side up in a floured banneton. Cover and refrigerate overnight (8–14 hrs).',
      'Preheat a Dutch oven inside your oven to 250 °C. Score the cold dough, lower it into the pot, bake covered for 20 min, then uncovered 20–25 min until deep mahogany.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Honey Lavender Scones',
    description: 'Buttery, flaky scones perfumed with culinary lavender and finished with a honey glaze.',
    category: 'Baking',
    cuisine: 'French',
    prepTime: 20,
    cookTime: 25,
    servings: 8,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
    ingredients: [
      { name: 'All-purpose flour', amount: '300', unit: 'g' },
      { name: 'Cold unsalted butter', amount: '115', unit: 'g' },
      { name: 'Heavy cream', amount: '180', unit: 'ml' },
      { name: 'Honey', amount: '60', unit: 'ml' },
      { name: 'Dried culinary lavender', amount: '2', unit: 'tsp' },
      { name: 'Baking powder', amount: '1', unit: 'tbsp' },
      { name: 'Salt', amount: '0.5', unit: 'tsp' }
    ],
    steps: [
      'Preheat oven to 200 °C. Whisk flour, baking powder, lavender and salt in a large bowl.',
      'Grate cold butter directly into the flour and toss quickly to coat each strand.',
      'Stir in 150 ml cream and 2 tbsp honey until a shaggy dough forms; do not overwork.',
      'Pat into a 2 cm disc, cut 8 wedges, and place on a parchment-lined tray. Brush tops with remaining cream.',
      'Bake 20–25 min until golden. Drizzle with remaining honey while still warm.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Brown Butter Banana Bread',
    description: 'Intensely moist banana bread elevated by nutty browned butter and a hint of cinnamon.',
    category: 'Baking',
    cuisine: 'American',
    prepTime: 15,
    cookTime: 60,
    servings: 10,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800',
    ingredients: [
      { name: 'Very ripe bananas', amount: '3', unit: 'large' },
      { name: 'Unsalted butter', amount: '115', unit: 'g' },
      { name: 'Brown sugar', amount: '150', unit: 'g' },
      { name: 'Eggs', amount: '2', unit: '' },
      { name: 'All-purpose flour', amount: '200', unit: 'g' },
      { name: 'Baking soda', amount: '1', unit: 'tsp' },
      { name: 'Ground cinnamon', amount: '1', unit: 'tsp' },
      { name: 'Salt', amount: '0.5', unit: 'tsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' }
    ],
    steps: [
      'Preheat oven to 175 °C. Grease a 23×13 cm loaf tin.',
      'Melt butter in a saucepan over medium heat, swirling until golden brown and nutty-smelling. Pour into a bowl and cool 5 minutes.',
      'Mash bananas in a large bowl. Whisk in brown butter, sugar, eggs and vanilla.',
      'Fold in flour, baking soda, cinnamon and salt until just combined — lumps are fine.',
      'Pour into the tin and bake 55–65 min until a skewer comes out clean. Cool 10 min before turning out.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Cardamom Morning Buns',
    description: 'Pillowy enriched dough rolled with cardamom sugar, twisted into spirals and baked until caramelised.',
    category: 'Baking',
    cuisine: 'Scandinavian',
    prepTime: 45,
    cookTime: 20,
    servings: 12,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800',
    ingredients: [
      { name: 'Strong white flour', amount: '500', unit: 'g' },
      { name: 'Whole milk', amount: '300', unit: 'ml' },
      { name: 'Unsalted butter', amount: '80', unit: 'g' },
      { name: 'Caster sugar', amount: '80', unit: 'g' },
      { name: 'Fast-action yeast', amount: '7', unit: 'g' },
      { name: 'Ground cardamom', amount: '2', unit: 'tbsp' },
      { name: 'Egg', amount: '1', unit: '' },
      { name: 'Salt', amount: '1', unit: 'tsp' }
    ],
    steps: [
      'Warm milk to 37 °C, stir in yeast and 1 tsp sugar; rest 5 min until frothy.',
      'Mix flour, remaining sugar, cardamom and salt. Add milk mixture, egg and melted butter; knead 8 min until smooth. Prove 1 hr.',
      'Mix softened butter with extra cardamom and sugar for filling. Roll dough into 40×30 cm rectangle and spread filling over two-thirds.',
      'Fold dough into thirds, roll again, then cut 12 strips. Twist each strip twice and coil into a knot. Prove 30 min.',
      'Bake at 200 °C for 15–20 min until deep golden. Brush immediately with a simple sugar syrup.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Focaccia with Rosemary',
    description: 'Dimpled olive-oil focaccia with fresh rosemary and flaky sea salt — crisp outside, pillowy within.',
    category: 'Baking',
    cuisine: 'Italian',
    prepTime: 30,
    cookTime: 25,
    servings: 8,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
    ingredients: [
      { name: 'Bread flour', amount: '430', unit: 'g' },
      { name: 'Water', amount: '390', unit: 'ml' },
      { name: 'Instant yeast', amount: '7', unit: 'g' },
      { name: 'Fine salt', amount: '9', unit: 'g' },
      { name: 'Extra-virgin olive oil', amount: '80', unit: 'ml' },
      { name: 'Fresh rosemary sprigs', amount: '4', unit: '' },
      { name: 'Flaky sea salt', amount: '1', unit: 'tbsp' }
    ],
    steps: [
      'Combine flour, yeast and salt. Add 360 ml water and 2 tbsp olive oil; mix until a sticky dough forms. Cover and refrigerate 12–18 hrs.',
      'Pour 3 tbsp olive oil into a 33×23 cm baking tin. Tip the cold dough in and stretch to fill; dimple deeply with oiled fingers. Rest 2 hrs at room temperature.',
      'Preheat oven to 230 °C. Press rosemary into the dimples, drizzle with remaining oil and scatter flaky salt.',
      'Bake 20–25 min until golden on top and underneath. Slide off the tin and cool on a rack for 10 min before slicing.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Almond Croissants',
    description: 'Bakery-style twice-baked croissants filled and topped with rich frangipane and toasted flaked almonds.',
    category: 'Baking',
    cuisine: 'French',
    prepTime: 60,
    cookTime: 20,
    servings: 6,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
    ingredients: [
      { name: 'Day-old croissants', amount: '6', unit: '' },
      { name: 'Ground almonds', amount: '120', unit: 'g' },
      { name: 'Unsalted butter', amount: '120', unit: 'g' },
      { name: 'Caster sugar', amount: '100', unit: 'g' },
      { name: 'Eggs', amount: '2', unit: '' },
      { name: 'Flaked almonds', amount: '60', unit: 'g' },
      { name: 'Icing sugar', amount: '2', unit: 'tbsp' },
      { name: 'Rum or almond extract', amount: '1', unit: 'tbsp' }
    ],
    steps: [
      'Make simple syrup (equal sugar and water); add rum or extract. Split croissants and brush insides generously with syrup.',
      'Beat butter and sugar until pale, add eggs one at a time, fold in ground almonds to make frangipane.',
      'Spread a heaped tablespoon of frangipane inside each croissant. Close them up.',
      'Spread more frangipane on top of each croissant and press flaked almonds to cover.',
      'Bake at 190 °C for 15–20 min until frangipane is set and almonds are deep gold. Dust with icing sugar and serve warm.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Cinnamon Babka',
    description: 'A dramatic, swirled enriched loaf packed with brown butter cinnamon filling — pull-apart, gooey perfection.',
    category: 'Baking',
    cuisine: 'Eastern European',
    prepTime: 90,
    cookTime: 35,
    servings: 10,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800',
    ingredients: [
      { name: 'Strong white flour', amount: '420', unit: 'g' },
      { name: 'Whole milk', amount: '160', unit: 'ml' },
      { name: 'Unsalted butter', amount: '120', unit: 'g' },
      { name: 'Caster sugar', amount: '80', unit: 'g' },
      { name: 'Eggs', amount: '2', unit: '' },
      { name: 'Fast-action yeast', amount: '7', unit: 'g' },
      { name: 'Ground cinnamon', amount: '2', unit: 'tbsp' },
      { name: 'Dark brown sugar', amount: '100', unit: 'g' },
      { name: 'Salt', amount: '1', unit: 'tsp' }
    ],
    steps: [
      'Combine flour, caster sugar, yeast and salt. Beat in warm milk, eggs and softened butter for 10 min until smooth and silky. Prove 1.5 hrs.',
      'Brown remaining 60 g butter, mix with dark brown sugar and cinnamon for filling.',
      'Roll dough to 40×30 cm rectangle, spread filling evenly, roll up tightly into a log.',
      'Slice log in half lengthways, twist the two strands together cut-side up, and fit into a greased 23×13 cm loaf tin. Prove 45 min.',
      'Bake at 180 °C for 30–35 min until risen and dark on top. Brush immediately with sugar syrup for a glossy finish.'
    ]
  },

  // ─── COOKING ──────────────────────────────────────────────────────────────
  {
    id: uuidv4(),
    title: 'Miso Glazed Salmon',
    description: 'Silky salmon fillets lacquered in a sweet-savoury miso glaze, ready in under 30 minutes.',
    category: 'Cooking',
    cuisine: 'Japanese',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ingredients: [
      { name: 'Salmon fillets', amount: '4', unit: '170 g each' },
      { name: 'White miso paste', amount: '3', unit: 'tbsp' },
      { name: 'Mirin', amount: '2', unit: 'tbsp' },
      { name: 'Sake or dry sherry', amount: '2', unit: 'tbsp' },
      { name: 'Honey', amount: '1', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tsp' },
      { name: 'Spring onions', amount: '2', unit: '' },
      { name: 'Sesame seeds', amount: '1', unit: 'tbsp' }
    ],
    steps: [
      'Whisk miso, mirin, sake, honey and sesame oil together until smooth.',
      'Pat salmon dry, coat all sides with glaze and marinate 10 min (or up to 24 hrs in the fridge).',
      'Preheat grill/broiler to high. Place salmon on a foil-lined tray, skin-side down.',
      'Grill 10–12 min, watching carefully, until the glaze is caramelised and salmon flakes at the thickest part.',
      'Rest 2 min, scatter with spring onions and sesame seeds. Serve with steamed rice.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Chicken Tikka Masala',
    description: 'Tender charred chicken in a velvety, spiced tomato-cream sauce — a British-Indian classic.',
    category: 'Cooking',
    cuisine: 'Indian',
    prepTime: 30,
    cookTime: 40,
    servings: 4,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    ingredients: [
      { name: 'Boneless chicken thighs', amount: '700', unit: 'g' },
      { name: 'Full-fat yoghurt', amount: '200', unit: 'g' },
      { name: 'Garam masala', amount: '2', unit: 'tbsp' },
      { name: 'Crushed garlic', amount: '4', unit: 'cloves' },
      { name: 'Grated ginger', amount: '2', unit: 'tbsp' },
      { name: 'Canned crushed tomatoes', amount: '400', unit: 'g' },
      { name: 'Double cream', amount: '150', unit: 'ml' },
      { name: 'Butter', amount: '2', unit: 'tbsp' },
      { name: 'Onion', amount: '1', unit: 'large' }
    ],
    steps: [
      'Mix yoghurt, half the garlic and ginger, 1 tbsp garam masala, and salt. Coat chicken and marinate 30 min (or overnight).',
      'Grill or pan-sear chicken on high heat until charred on edges. Set aside.',
      'Fry diced onion in butter until deep golden, 15 min. Add remaining garlic, ginger and spices; cook 2 min.',
      'Add crushed tomatoes and simmer 10 min. Blend sauce until smooth, return to pan.',
      'Add chicken and cream; simmer 10 min. Adjust seasoning and garnish with coriander.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Pasta Carbonara',
    description: 'The authentic Roman carbonara — spaghetti, guanciale, egg yolks and Pecorino, no cream needed.',
    category: 'Cooking',
    cuisine: 'Italian',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    ingredients: [
      { name: 'Spaghetti', amount: '200', unit: 'g' },
      { name: 'Guanciale or pancetta', amount: '150', unit: 'g' },
      { name: 'Egg yolks', amount: '4', unit: '' },
      { name: 'Whole egg', amount: '1', unit: '' },
      { name: 'Pecorino Romano', amount: '80', unit: 'g' },
      { name: 'Freshly ground black pepper', amount: '1', unit: 'tsp' }
    ],
    steps: [
      'Cook spaghetti in well-salted water until 2 min before al dente. Reserve 300 ml pasta water.',
      'Render guanciale in a cold pan over medium heat until fat is translucent and edges are crisp. Remove from heat.',
      'Whisk yolks, whole egg, Pecorino and generous pepper together.',
      'Add spaghetti to the guanciale pan off the heat. Pour egg mixture over, tossing rapidly while adding pasta water a splash at a time until silky and saucy.',
      'Serve immediately, topped with more Pecorino and cracked pepper.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Thai Green Curry',
    description: 'Fragrant coconut milk curry with homemade-style green paste, vegetables and jasmine rice.',
    category: 'Cooking',
    cuisine: 'Thai',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
    ingredients: [
      { name: 'Chicken breast', amount: '600', unit: 'g' },
      { name: 'Green curry paste', amount: '3', unit: 'tbsp' },
      { name: 'Coconut milk', amount: '400', unit: 'ml' },
      { name: 'Chicken stock', amount: '200', unit: 'ml' },
      { name: 'Thai aubergine', amount: '200', unit: 'g' },
      { name: 'Fish sauce', amount: '2', unit: 'tbsp' },
      { name: 'Palm sugar', amount: '1', unit: 'tbsp' },
      { name: 'Kaffir lime leaves', amount: '4', unit: '' },
      { name: 'Thai basil', amount: '1', unit: 'handful' }
    ],
    steps: [
      'Fry curry paste in 2 tbsp of the thick coconut cream in a wok for 2 min until fragrant.',
      'Add remaining coconut milk and stock; bring to a simmer.',
      'Add sliced chicken and aubergine; cook 15 min until chicken is cooked through.',
      'Season with fish sauce and palm sugar; add lime leaves and simmer 5 more min.',
      'Remove from heat, stir in Thai basil and serve over jasmine rice.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Shakshuka',
    description: 'Eggs poached in a smoky, spiced tomato pepper sauce — a one-pan Middle Eastern breakfast classic.',
    category: 'Cooking',
    cuisine: 'Middle Eastern',
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800',
    ingredients: [
      { name: 'Canned whole tomatoes', amount: '400', unit: 'g' },
      { name: 'Eggs', amount: '4', unit: '' },
      { name: 'Red bell pepper', amount: '1', unit: '' },
      { name: 'Onion', amount: '1', unit: '' },
      { name: 'Garlic', amount: '3', unit: 'cloves' },
      { name: 'Smoked paprika', amount: '1', unit: 'tsp' },
      { name: 'Cumin', amount: '1', unit: 'tsp' },
      { name: 'Chilli flakes', amount: '0.5', unit: 'tsp' },
      { name: 'Feta cheese', amount: '60', unit: 'g' }
    ],
    steps: [
      'Sauté diced onion and pepper in olive oil over medium heat 8 min until soft.',
      'Add garlic, paprika, cumin and chilli; cook 1 min.',
      'Crush in tomatoes, season, and simmer 10 min until thick.',
      'Make 4 wells in the sauce and crack an egg into each; cover and cook 5–7 min until whites are set but yolks are runny.',
      'Crumble feta on top and serve straight from the pan with warm flatbread.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Duck Confit',
    description: 'Meltingly tender duck legs slow-cooked in their own fat, finished with crackling crisp skin.',
    category: 'Cooking',
    cuisine: 'French',
    prepTime: 20,
    cookTime: 120,
    servings: 2,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    ingredients: [
      { name: 'Duck legs', amount: '2', unit: '' },
      { name: 'Duck fat or lard', amount: '500', unit: 'g' },
      { name: 'Coarse sea salt', amount: '2', unit: 'tbsp' },
      { name: 'Thyme sprigs', amount: '4', unit: '' },
      { name: 'Bay leaves', amount: '2', unit: '' },
      { name: 'Garlic', amount: '4', unit: 'cloves' },
      { name: 'Black peppercorns', amount: '1', unit: 'tsp' }
    ],
    steps: [
      'Rub duck legs all over with coarse salt, garlic, thyme, bay and peppercorns. Refrigerate uncovered 12–24 hrs.',
      'Rinse and pat dry. Preheat oven to 120 °C.',
      'Melt duck fat in an oven-proof dish; submerge legs completely. Cover tightly.',
      'Cook in the oven for 2–2.5 hrs until meat pulls easily from the bone.',
      'To serve, remove legs from fat. Heat a heavy pan to high, place legs skin-side down and press gently; sear 4 min until skin is lacquer-crisp.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Beef Tacos al Pastor',
    description: 'Marinated beef with pineapple, onion and coriander piled into warm corn tortillas — street-food at home.',
    category: 'Cooking',
    cuisine: 'Mexican',
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    ingredients: [
      { name: 'Beef sirloin, thinly sliced', amount: '600', unit: 'g' },
      { name: 'Dried guajillo chillies', amount: '3', unit: '' },
      { name: 'Chipotle in adobo', amount: '2', unit: 'tbsp' },
      { name: 'Pineapple', amount: '200', unit: 'g' },
      { name: 'Corn tortillas', amount: '12', unit: '' },
      { name: 'White onion', amount: '1', unit: '' },
      { name: 'Fresh coriander', amount: '1', unit: 'bunch' },
      { name: 'Lime', amount: '2', unit: '' }
    ],
    steps: [
      'Toast and rehydrate guajillo chillies, blend with chipotle, pineapple juice, garlic, oregano, salt and a splash of vinegar.',
      'Toss sliced beef in the marinade; refrigerate 30 min.',
      'Sear beef in batches in a very hot, dry pan until charred at the edges, 2–3 min per batch.',
      'Warm tortillas directly on a gas flame or in a dry pan. Dice remaining pineapple.',
      'Load tortillas with beef, diced pineapple, raw white onion, coriander and a squeeze of lime.'
    ]
  },

  // ─── DESSERTS ─────────────────────────────────────────────────────────────
  {
    id: uuidv4(),
    title: 'Pistachio Crème Brûlée',
    description: 'Silky baked custard infused with pistachio paste, topped with a shard of caramelised sugar.',
    category: 'Desserts',
    cuisine: 'French',
    prepTime: 20,
    cookTime: 45,
    servings: 4,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800',
    ingredients: [
      { name: 'Double cream', amount: '500', unit: 'ml' },
      { name: 'Egg yolks', amount: '6', unit: '' },
      { name: 'Caster sugar', amount: '100', unit: 'g' },
      { name: 'Pistachio paste', amount: '3', unit: 'tbsp' },
      { name: 'Vanilla bean', amount: '1', unit: '' },
      { name: 'Demerara sugar', amount: '4', unit: 'tbsp' }
    ],
    steps: [
      'Preheat oven to 150 °C. Heat cream with split vanilla bean until just simmering; remove bean.',
      'Whisk yolks, caster sugar and pistachio paste until pale. Slowly pour hot cream in, whisking constantly.',
      'Strain into 4 ramekins placed in a deep roasting tin. Pour boiling water into the tin to reach halfway up the ramekins.',
      'Bake 40–45 min until just set with a slight wobble in the centre. Cool, then refrigerate at least 2 hrs.',
      'Dust each ramekin with 1 tbsp demerara sugar and caramelise with a kitchen torch until crackled and amber.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Mango Sticky Rice',
    description: 'Sweet glutinous rice soaked in salted coconut cream, served with ripe mango and crispy mung beans.',
    category: 'Desserts',
    cuisine: 'Thai',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=800',
    ingredients: [
      { name: 'Glutinous rice', amount: '300', unit: 'g' },
      { name: 'Coconut milk', amount: '400', unit: 'ml' },
      { name: 'Caster sugar', amount: '80', unit: 'g' },
      { name: 'Salt', amount: '1', unit: 'tsp' },
      { name: 'Ripe mango', amount: '2', unit: '' },
      { name: 'Toasted mung beans', amount: '2', unit: 'tbsp' },
      { name: 'Pandan leaf', amount: '1', unit: '' }
    ],
    steps: [
      'Soak glutinous rice in cold water 4 hrs or overnight; drain.',
      'Steam rice with pandan leaf over boiling water 20–25 min until tender and translucent.',
      'Warm coconut milk, sugar and salt until sugar dissolves. Pour two-thirds over hot rice, stir and rest 10 min.',
      'Peel and slice mangoes alongside portions of sticky rice.',
      'Drizzle reserved coconut cream over each serving and scatter toasted mung beans.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Dark Chocolate Fondant',
    description: 'Intense chocolate pudding cakes with a guaranteed molten centre — best served with cold crème fraîche.',
    category: 'Desserts',
    cuisine: 'French',
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
    ingredients: [
      { name: 'Dark chocolate (70 %)', amount: '200', unit: 'g' },
      { name: 'Unsalted butter', amount: '150', unit: 'g' },
      { name: 'Eggs', amount: '4', unit: '' },
      { name: 'Egg yolks', amount: '2', unit: '' },
      { name: 'Caster sugar', amount: '100', unit: 'g' },
      { name: 'Plain flour', amount: '40', unit: 'g' },
      { name: 'Cocoa powder', amount: '1', unit: 'tbsp' }
    ],
    steps: [
      'Grease 4 dariole moulds with butter and dust with cocoa. Preheat oven to 200 °C.',
      'Melt chocolate and butter together in a heatproof bowl over a pan of barely simmering water; cool slightly.',
      'Whisk eggs, yolks and sugar until thick and pale. Fold in chocolate mixture, then sift in flour and fold gently.',
      'Divide between moulds. (Can be refrigerated up to 24 hrs at this stage.)',
      'Bake 10–12 min until tops are set and sides have pulled away slightly. Rest 1 min, run a knife around the edge and invert onto plates immediately.'
    ]
  },
  {
    id: uuidv4(),
    title: 'New York Cheesecake',
    description: 'Dense, creamy, tangy baked cheesecake on a graham cracker base — a New York diner icon.',
    category: 'Desserts',
    cuisine: 'American',
    prepTime: 30,
    cookTime: 60,
    servings: 12,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800',
    ingredients: [
      { name: 'Cream cheese', amount: '900', unit: 'g' },
      { name: 'Caster sugar', amount: '250', unit: 'g' },
      { name: 'Sour cream', amount: '200', unit: 'g' },
      { name: 'Eggs', amount: '4', unit: '' },
      { name: 'Vanilla extract', amount: '2', unit: 'tsp' },
      { name: 'Graham crackers', amount: '200', unit: 'g' },
      { name: 'Unsalted butter', amount: '80', unit: 'g' },
      { name: 'Lemon zest', amount: '1', unit: '' }
    ],
    steps: [
      'Crush crackers, mix with melted butter, press into a 23 cm springform tin and chill.',
      'Beat room-temperature cream cheese and sugar until smooth — no lumps. Beat in sour cream, vanilla and lemon zest.',
      'Add eggs one at a time on low speed until just combined. Do not over-beat.',
      'Pour onto base. Bake in a 160 °C oven for 60–65 min until centre has a slight wobble.',
      'Turn off oven, crack door open and leave to cool 1 hr inside. Refrigerate 6 hrs before removing the collar.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Matcha Tiramisu',
    description: 'A Japanese-Italian fusion: ladyfingers soaked in matcha syrup layered with mascarpone cream.',
    category: 'Desserts',
    cuisine: 'Japanese-Italian',
    prepTime: 30,
    cookTime: 0,
    servings: 6,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    ingredients: [
      { name: 'Savoiardi ladyfingers', amount: '200', unit: 'g' },
      { name: 'Mascarpone', amount: '500', unit: 'g' },
      { name: 'Double cream', amount: '200', unit: 'ml' },
      { name: 'Caster sugar', amount: '80', unit: 'g' },
      { name: 'Ceremonial matcha powder', amount: '3', unit: 'tbsp' },
      { name: 'Egg yolks', amount: '3', unit: '' },
      { name: 'Hot water', amount: '300', unit: 'ml' }
    ],
    steps: [
      'Whisk 2 tbsp matcha into 300 ml hot water; sweeten with 2 tbsp sugar and cool.',
      'Whip yolks and remaining sugar over a bain-marie until thick; cool. Beat in mascarpone.',
      'Whip double cream to soft peaks; fold into mascarpone mixture.',
      'Dip ladyfingers briefly in matcha syrup; arrange a layer in a deep dish.',
      'Spread half the cream, add another layer of dipped fingers, top with remaining cream. Dust with remaining matcha through a fine sieve. Refrigerate 4 hrs.'
    ]
  },
  {
    id: uuidv4(),
    title: 'Strawberry Pavlova',
    description: 'Crisp meringue shell with a marshmallowy interior, loaded with Chantilly cream and fresh strawberries.',
    category: 'Desserts',
    cuisine: 'Australian',
    prepTime: 20,
    cookTime: 90,
    servings: 8,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1488477181228-c84def11de88?w=800',
    ingredients: [
      { name: 'Egg whites', amount: '6', unit: '' },
      { name: 'Caster sugar', amount: '330', unit: 'g' },
      { name: 'White wine vinegar', amount: '1', unit: 'tsp' },
      { name: 'Cornflour', amount: '2', unit: 'tsp' },
      { name: 'Double cream', amount: '400', unit: 'ml' },
      { name: 'Fresh strawberries', amount: '400', unit: 'g' },
      { name: 'Icing sugar', amount: '2', unit: 'tbsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' }
    ],
    steps: [
      'Preheat oven to 150 °C. Draw a 22 cm circle on baking parchment; flip onto a tray.',
      'Beat egg whites to stiff peaks. Gradually add caster sugar 1 tbsp at a time, beating until glossy. Fold in vinegar and cornflour.',
      'Spread meringue into the circle, building high sides to create a crater.',
      'Bake 1.5 hrs until crisp and pale cream-coloured. Turn off oven and leave inside until completely cold.',
      'Whip cream with icing sugar and vanilla; pile into the crater. Top with halved strawberries and serve immediately.'
    ]
  }
];

export async function seedIfEmpty() {
  const check = await db.query('SELECT COUNT(*) as count FROM recipes');
  const count = parseInt(check.rows[0].count, 10);
  if (count > 0) {
    console.log(`[seed] Skipping — ${count} recipes already present`);
    return;
  }

  console.log('[seed] Seeding 20 recipes...');

  for (const recipe of recipes) {
    // Insert recipe
    await db.query(
      `INSERT INTO recipes (id, title, description, category, cuisine, prep_time, cook_time, servings, difficulty, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        recipe.id,
        recipe.title,
        recipe.description,
        recipe.category,
        recipe.cuisine,
        recipe.prepTime,
        recipe.cookTime,
        recipe.servings,
        recipe.difficulty,
        recipe.imageUrl
      ]
    );

    // Insert ingredients
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ing = recipe.ingredients[i];
      await db.query(
        `INSERT INTO ingredients (id, recipe_id, name, amount, unit, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [uuidv4(), recipe.id, ing.name, ing.amount, ing.unit, i + 1]
      );
    }

    // Insert steps
    for (let i = 0; i < recipe.steps.length; i++) {
      await db.query(
        `INSERT INTO steps (id, recipe_id, step_number, instruction)
         VALUES ($1,$2,$3,$4)`,
        [uuidv4(), recipe.id, i + 1, recipe.steps[i]]
      );
    }
  }

  console.log('[seed] Done — 20 recipes inserted');
}
