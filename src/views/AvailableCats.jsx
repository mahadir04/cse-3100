import { useState, useEffect } from 'react';

const availableCats = [
  { name: 'Luna', age: '3', breed: 'Birman' },
  { name: 'Simba', age: '4', breed: 'Abyssinian' },
  { name: 'Pumpkin', age: '2', breed: 'Bengal' },
  { name: 'Whiskers', age: '2', breed: 'Siamese' },
  { name: 'Mittens', age: '2', breed: 'Persian' },
  { name: 'Shadow', age: '1', breed: 'Peterbald' },
];

export default function AvailableCats() {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');

  // Fetch cat images from TheCatAPI
  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const responses = await Promise.all(
          availableCats.map(() =>
            fetch('https://api.thecatapi.com/v1/images/search').then(res => res.json())
          )
        );
        const catsWithImages = availableCats.map((cat, index) => ({
          ...cat,
          image: responses[index][0].url,  // Attach the image URL from the API
        }));
        setCats(catsWithImages);
        setFilteredCats(catsWithImages);  // Initialize filtered cats with images
      } catch (error) {
        console.error('Error fetching cat images:', error);
      }
    };
    fetchCatImages();
  }, []);

  // Filter the cats based on search text and selected breed
  useEffect(() => {
    const filtered = cats.filter(
      cat =>
        cat.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedBreed === '' || cat.breed === selectedBreed)
    );
    setFilteredCats(filtered);  // Update the filtered list of cats
  }, [searchText, selectedBreed, cats]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);  // Update search text state
  };

  const handleBreedChange = (e) => {
    setSelectedBreed(e.target.value);  // Update selected breed state
  };

  return (
    <section>
      {/* Filter Section - Positioned at the Top */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={handleSearchChange}  // Handle search input change
        />
        <select
          value={selectedBreed}
          onChange={handleBreedChange}  // Handle breed filter change
          style={{ marginLeft: '10px' }}
        >
          <option value="">All Breeds</option>
          <option value="Birman">Birman</option>
          <option value="Bengal">Bengal</option>
          <option value="Abyssinian">Abyssinian</option>
          <option value="Siamese">Siamese</option>
          <option value="Persian">Persian</option>
          <option value="Peterbald">Peterbald</option>
        </select>
      </div>

      {/* Available Cats Content */}
      <h2 className="text-center mt-4">Available Cats</h2>

      {/* Adding margin-top to the row container */}
      <div className="row g-4" style={{ marginTop: '40px' }}>
        {filteredCats.map((cat, i) => (
          <div key={i} className="col-md-4">
            <div className="cat-card">
              {/* Image with added margin-top */}
              <img
                src={cat.image}  // Use the image URL from TheCatAPI
                alt={cat.name}
                className="img-fluid mb-2"
                style={{
                  borderRadius: '8px',
                  height: '200px',
                  width: '100%',
                  objectFit: 'cover',
                  marginTop: '20px',  // Lower the image by 20px
                }}
              />
              <h3>{cat.name}</h3>
              <p>Age: {cat.age}</p>
              <p>Breed: {cat.breed}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
