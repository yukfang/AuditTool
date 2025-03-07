location_ids_dict = {
  "DMA": [
    {
      "id": 662,
      "level": 2,
      "name": "Abilene-Sweetwater",
      "parent_id": 6252001
    },
  ],
  "cities": [
    {
      "id": 532,
      "level": 2,
      "name": "Albany-Schenectady-Troy",
      "parent_id": 6252001
    },
  ],
  "countries": [
    {
      "country_code": "US",
      "id": 6252001,
      "level": 1,
      "name": "United States"
    },
  ],
  "provinces": [
    {
      "country_code": "SA",
      "id": 103628,
      "level": 2,
      "name": "Najran",
      "parent_id": 102358
    }
  ]
}

function getNameById(id) {
  const categories = Object.keys(location_ids_dict).filter(key =>
    Array.isArray(location_ids_dict[key]) && key !== 'getNameById'
  );
  console.log(categories)

  for (const category of categories) {
    const location = location_ids_dict[category].find(item => item.id === id);
    if (location) return location.name;
  }
  return 'Not found';
}

console.log(  getNameById(103628))