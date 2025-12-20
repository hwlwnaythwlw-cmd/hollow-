const skills = [
  // فئة الرامي
  { name: 'سهم الروح', class: 'الرامي', type: 'attack', dmg: {min: 150, max: 200}, costQi: 5 },
  { name: 'المطر المتفجر', class: 'الرامي', type: 'attack', dmg: {min: 200, max: 300}, costQi: 15 },
  // فئة الفارس المتجول (Hollow Knight Style)
  { name: 'التركيز (Focus)', class: 'الفارس المتجول', type: 'heal', effect: 'hpUP', costQi: 20 },
  { name: 'اندفاع الظل', class: 'الفارس المتجول', type: 'effect', effect: 'speedUP', costQi: 10 },
  { name: 'الصرخة العاوية', class: 'الفارس المتجول', type: 'attack', dmg: {min: 180, max: 250}, costQi: 25 },
  // ... يمكنك إضافة 5 مهارات لكل فئة بنفس النمط
];

