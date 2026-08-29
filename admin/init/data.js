const products = [
    {
    name: "Men's Casual T-Shirt",
    description: "Soft cotton t-shirt suitable for everyday wear.",
    price: 699,
    image: {
      filename:"Men'sCasualT-Shirt",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZOkAz_6_-BEQwB3GTYXvJxUMa_zjpQdVMC87C5_mWQ&s=10",
    },
    rating: 4,
  },
  {
    name: "Men's Blue Jeans",
    description: "Slim-fit denim jeans with stretch fabric.",
    price: 1499,
    image: {
      filename:"Men'sBlueJeans",
      url:"https://rukminim3.flixcart.com/image/824/972/xif0q/shopsy-jean/1/p/s/-original-imahn6yhmhrfqwhy.jpeg?q=60&crop=false",
    },
    rating: 4,
  },
  {
    name: "Women's Kurti",
    description: "Elegant printed kurti made from breathable fabric.",
    price: 1199,
    image: {
      filename:"Women'sKurti",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrd9vxQvC9gfj8_Utc_np2nuAmnCluek9l0o1ONsJYSw&s=10",
    },
    rating: 5,
  },
  {
    name: "Women's Hoodie",
    description: "Warm fleece hoodie for winter season.",
    price: 1999,
    image: {
      filename:"Women'sHoodie",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1TVivfwKkEI6yzWLqNj65CabsdfNcWX1jqhpp_daHaw&s=10",
    },
    rating: 4,
  },
  {
    name: "Nike Running Shoes",
    description: "Comfortable sports shoes designed for running.",
    price: 5999,
    image: {
      filename:"NikeRunningShoes",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSny867UxrBtwSeZttVooxkZ6kmoMRrFTVX9ppBsnoLTw&s=10",
    },
    rating: 5,
  },
  {
    name: "Adidas Sneakers",
    description: "Stylish sneakers for casual everyday use.",
    price: 5499,
    image: {
      filename:"AdidasSneakers",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVKoasUeljfSGnh29Mg-nGvxqPA4VotryxlekzX77c6g&s=10",
    },
    rating: 4,
  },
  {
    name: "Ray-Ban Sunglasses",
    description: "Classic UV-protected stylish sunglasses.",
    price: 3999,
    image: {
      filename:"Ray-BanSunglasses",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxVANKU3DThol985dDfy1z3sIHVgNV96YO2VHBVOuSw&s",
    },
    rating: 5,
  },
  {
    name: "Reading Glasses",
    description: "Lightweight glasses for comfortable reading.",
    price: 999,
    image: {
      filename:"ReadingGlasses",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5vB6GOBlwvX5g1vG6CICH5BlvvVPyAc7H-dnZN-7NQ&s=10",
    },
    rating: 4,
  },
  {
    name: "Vitamin C Tablets",
    description: "Daily immunity support with Vitamin C supplements.",
    price: 499,
    image: {
      filename:"VitaminCTablets",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4eUPgEdZAQIo9OHs7qjNKc-6q1Q1_GC8En_TofWEYQQ&s=10"
    },
    rating: 4,
  },
  {
    name: "Multivitamin Capsules",
    description: "Complete daily nutrition for adults.",
    price: 699,
    image: {
      filename:"MultivitaminCapsules",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCKv216A0WgXaegPSzYb2xL5kwGITNYNS4i8-ToDkKw&s=10",
    },
    rating: 5,
  },
  {
    name: "Maggi Noodles Pack",
    description: "Instant noodles ready in just two minutes.",
    price: 99,
    image: {
      filename:"MaggiNoodlesPack",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJjTKP8h4tDoCNhEwSQdoy65SZ4ZLIASmtE8Z8cn8V8w&s=10",
    },
    rating: 5,
  },
  {
    name: "Lay's Potato Chips",
    description: "Crunchy salted potato chips snack pack.",
    price: 49,
    image: {
      filename:"Lay'sPotatoChips",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaM8hV9etGOtlttTE4GT55ZAVW18_G8WurEkdSW3dc9Q&s=10",
    },
    rating: 4,
  },
  {
    name: "Coca-Cola",
    description: "Refreshing soft drink for every occasion.",
    price: 60,
    image: {
      filename:"Coca-Cola 1L",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRICJjdNgSYglBWs9T9efKdQNdj33GneTwHtg9rFxaVsA&s=10",
    },
    rating: 4,
  },
  {
    name: "Amul Butter",
    description: "Fresh and creamy butter for daily meals.",
    price: 285,
    image: {
      filename:"AmulButter",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbsWXMipC-DGbT6DHhLfDaYV-ZiSCkRduOlUUx4aTChg&s=10",
    },
    rating: 5,
  },
  {
    name: "Basmati Rice 5kg",
    description: "Premium long-grain aromatic basmati rice.",
    price: 749,
    image: {
      filename:"BasmatiRice",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWtEN5kywuyH-3JwXqwnwdsijOhl9R8vG29L7oy6pG1A&s=10",
    },
    rating: 5,
  },
  {
    name: "Organic Honey",
    description: "Pure natural honey with no added sugar.",
    price: 399,
    image: {
      filename:"OrganicHoney",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTXHPFEH4MOc6tNjfcXSAbOfOoEJflfaMXgniSNROwyA&s=10",
    },
    rating: 5,
  },
  {
    name: "The Alchemist Book",
    description: "Bestselling motivational novel by Paulo Coelho.",
    price: 399,
    image: {
      filename:"TheAlchemistBook",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_rzlNgAF-bc1yy0rwmY6HlDEBILJu_fHsKGoeW-_6FQ&s=10",
    },
    rating: 5,
  },
  {
    name: "Atomic Habits",
    description: "Self-improvement book by James Clear.",
    price: 599,
    image: {
      filename:"AtomicHabits",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuj7lFru3u1BhDMZIfwA14SKTyaKzZ7NEsiViMFUi8tw&s=10",
    },
    rating: 5,
  },
  {
    name: "Notebook Set",
    description: "Pack of premium notebooks for students.",
    price: 340,
    image: {
      filename:"Notebook Set",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTarrfgpmqEaKihqd5bMc5sKwX7b8__vvgofV9l6oJsw&s=10",
    },
    rating: 4,
  },
  {
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    price: 4999,
    image: {
      filename:"OfficeChair",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmdnLxrzcTOgvIZMEXTqeLBjHl1zgUCmfoUmv928JMw&s=10",
    },
    rating: 5,
  },
  {
    name: "Wooden Study Table",
    description: "Durable wooden study desk for home office.",
    price: 6999,
    image: {
      filename:"WoodenStudyTable",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQF-WuGGTrBKmQm2Er6yIyyctMdNYP6ldYbSUcK0O8Iw&s",
    },
    rating: 4,
  },
  {
    name: "Smart LED TV 43 Inch",
    description: "Full HD Smart TV with streaming apps.",
    price: 28999,
    image: {
      filename:"SmartLEDTV",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsUHQafpPXtowG1dugjQXgb3UUVpME4FTKcJ3FBMGSvg&s=10",
    },
    rating: 5,
  },
  {
    name: "Smart Watch",
    description: "Fitness smartwatch with heart-rate monitoring.",
    price: 4999,
    image: {
      filename:"SmartWatch",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKIhldUqWGrjnOi-rnT6-Ix37z6BUyZLHQrpa4fdvv0Q&s=10",
    },
    rating: 4,
  },
  {
    name: "Canon DSLR Camera",
    description: "Professional camera for photography enthusiasts.",
    price: 64999,
    image: {
      filename:"CanonDSLRCamera",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuG1DlHXqqFB-zmrEAX2Dopxyse3IpwKAnZJhEZarLmw&s=10",
    },
    rating: 5,
  },
  {
    name: "Travel Backpack",
    description: "Large waterproof backpack with laptop compartment.",
    price: 2499,
    image: {
      filename:"TravelBackpack",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSthFNjDbksrzB4REJWG7mhE1s2hT_0PipSKHVv-4ozOg&s=10",
    },
    rating: 4,
  },
  {
    name: "Steel Water Bottle",
    description: "Insulated stainless steel water bottle.",
    price: 799,
    image: {
      filename:"SteelWaterBottle",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBj2jEnkGSXMCJ8SdcZZtKRrk83icUhKrEv8Ft2QWBRA&s=10",
    },
    rating: 4,
  },
  {
    name: "Yoga Mat",
    description: "Anti-slip exercise mat for yoga and workouts.",
    price: 799,
    image: {
      filename:"YogaMat",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxBsNLCEG1xWb7msULEpHnN-RoSgQJjQPeMAx040NJQ&s=10",
    },
    rating: 4,
  },
  {
    name: "Electric Kettle",
    description: "Fast-boiling electric kettle with auto shut-off.",
    price: 1599,
    image: {
      filename:"ElectricKettle",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKXaNJEtJx4JVCS9UgpGG7GDOiqJXMh4swq1WZEKcQrA&s=10",
    },
    rating: 4,
  },
  {
    name: "Prestige Mixer Grinder",
    description: "Powerful kitchen mixer grinder with three jars.",
    price: 3499,
    image: {
      filename:"PrestigeMixerGrinder",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN1skaAdpHFvRZL1zbXBjLvW8E9C4IgUQiGxU0r_bdww&s=10",
    },
    rating: 5,
  },
  {
    name: "Non-Stick Cookware Set",
    description: "Durable cookware set suitable for daily cooking.",
    price: 4999,
    image: {
      filename:"Non-StickCookwareSet",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-wLD7QHqMJlx2xSeu91kqVeD0svLI1W_mOsffwzw-fw&s=10",
    },
    rating: 5,
  },
  {
    name: "Apple iPhone 16 Pro",
    description: "Latest Apple smartphone with A18 Pro chip and advanced camera system.",
    price: 119999,
    image: {
      filename:"iphone16pro",
      url:"https://vsprod.vijaysales.com/media/catalog/product/i/p/iphone_17_pro_max_cosmic_orange_pdp_image_position_1__en-in_2.jpg?optimize=medium&fit=bounds&height=500&width=500"},
    rating: 5,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and 200MP camera.",
    price: 99999,
    image: {
      filename:"GalaxyS24Ultra",
      url:"https://vlebazaar.in/image/cache/catalog/Samsung-Galaxy-S24-Ultra-5G-AI-Smartphone-Titanium-Gray-12GB-256GB-Stora/Samsung-Galaxy-S24-Ultra-5G-AI-Smartphone-Titanium-Gray-12GB-256GB-Storage-S928B-1500x1500.jpg",
    },
    rating: 5,
  },
  {
    name: "OnePlus 13",
    description: "Flagship smartphone with fast charging and Snapdragon processor.",
    price: 69999,
    image: {
      filename:"OnePlus13",
      url:"https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/312536_0_ymiz2z.png?tr=w-640",
    },
    rating: 5,
  },
  {
    name: "Google Pixel 9",
    description: "AI-powered smartphone with an excellent camera experience.",
    price: 84999,
    image: {
      filename:"Pixel9",
      url:"https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/309166_0_flwiwk.png?tr=w-400",
    },
    rating: 5,
  },
  {
    name: "MacBook Pro 16",
    description: "Professional laptop with powerful performance for creators.",
    price: 189999,
    image: {
      filename:"MacBookpro16",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnGg-i7CZZx-wzeShgJRlPxqCQAcgpWGQgCocHvSrq0A&s=10",
    },
    rating: 5,
  },
  {
    name: "Dell XPS 15",
    description: "Premium Windows laptop with stunning display.",
    price: 149999,
    image: {
      filename:"DellXps15",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFyHjzj5usn-B03nR5P57UffmHfGu69ZJa0beNpKU39HZ2dMZ1s0kfXBKR&s=10",
    },
    rating: 5,
  },
  {
    name: "ASUS ROG Gaming Laptop",
    description: "High-performance gaming laptop with RTX graphics.",
    price: 145999,
    image: {
      filename:"AsusRog",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-PK3uBCcNMEUmVHYPz7pPs3bb7_H2co9S_mOIgFf7Jw&s=10",
    },
    rating: 5,
  },
  {
    name: "HP Pavilion Laptop",
    description: "Reliable laptop for students and professionals.",
    price: 64999,
    image: {
      filename:"HPPavilion",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIu10rrjGx3rJO2n9KLuIGGAQwnBivh-hvQ6ybR66cbw&s=10",
    },
    rating: 4,
  },
  {
    name: "Logitech Wireless Mouse",
    description: "Comfortable wireless mouse with long battery life.",
    price: 1299,
    image: {
      filename:"LogitechWirelessMouse",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnewvw4Fu-0kTv47dNp3Syx3MmJUCML1j-9lv-9OY_CA&s=10",
    },
    rating: 4,
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with tactile switches.",
    price: 3999,
    image: {
      filename:"MachanicalGamingKeyboard",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtoHAF4ecHQAlO4wjk8_VHxZIQNJ3dWfTyPQKSBy_KzA&s=10",
    },
    rating: 5,
  },
  {
    name: "USB-C Fast Charger",
    description: "65W fast charger compatible with phones and laptops.",
    price: 1499,
    image: {
      filename:"USB-CFastCharger",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoBdgTUdwEPen5sC8XQwMmvQS6KT0o65NtUf8D14voyw&s",
    },
    rating: 4,
  },
  {
    name: "Power Bank 20000mAh",
    description: "High-capacity portable charger with fast charging support.",
    price: 2499,
    image: {
      filename:"PowerBank20000mAh",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMhGzuBRjw9y6faXIIdx2uaMQyq8FmxRoJwpK6_e3vxQ&s=10",
    },
    rating: 4,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with deep bass and waterproof design.",
    price: 2999,
    image: {
      filename:"BluetoothSpeaker",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs7CJgEUlHlmlPk-wwQ52CzLk9MXmbw0lVZFwi7JkNyQ&s=10",
    },
    rating: 4,
  },
  {
    name: "Sony Wireless Headphones",
    description: "Noise-cancelling over-ear wireless headphones.",
    price: 19999,
    image: {
      filename:"SonyWirelessHeadphones",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN7bfOftBOBxFhy9ECl6lnBsZX9e2REvZyK2QqWs-skw&s=10",
    },
    rating: 5,
  },
  {
    name: "Apple AirPods Pro",
    description: "Premium wireless earbuds with active noise cancellation.",
    price: 24999,
    image: {
      filename:"AppleAirPodsPro",
      url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMPZWsKrge8b9QNJfiG8Ov9DEgK98xeIgXBcWiqlrbeQ&s=10",
    },
    rating: 5,
  },
];

module.exports = { data: products };