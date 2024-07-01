import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        if (country) {
            console.log('fetching country details...');
            axios
                .get(`https://restcountries.com/v3.1/name/${country}`)
                .then(response => {
                    setCountries(response.data);
                })
                .catch(error => {
                    console.error('Error fetching country data:', error);
                    setCountries([]);
                });
        }
    }, [country]);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const onSearch = (event) => {
        event.preventDefault();
        setCountry(value);
    };

    const renderCountryDetails = (country) => {
        return (
            <div key={country.name.common}>
                <h2>{country.name.common}</h2>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area} km²</p>
                <p>Languages: {Object.values(country.languages).join(', ')}</p>
                <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
            </div>
        );
    };

    return (
        <div>
            <form onSubmit={onSearch}>
                Find Country <input value={value} onChange={handleChange} />
                <button type="submit">Search</button>
            </form>
            {countries.length > 10 ? (
                <p>Too many matches, specify another filter</p>
            ) : countries.length > 1 ? (
                <ul>
                    {countries.map(country => (
                        <li key={country.name.common} onClick={() => setCountry(country.name.common)}>
                            {country.name.common}
                        </li>
                    ))}
                </ul>
            ) : countries.length === 1 ? (
                renderCountryDetails(countries[0])
            ) : (
                <p>No matches found</p>
            )}
        </div>
    );
};

export default App;
