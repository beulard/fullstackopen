import axios from "axios";
import { useEffect, useState } from "react";

const SearchFilter = ({ searchValue, setSearchValue }) =>
  <div>
    search for country: <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
  </div>

const Country = ({country}) => {
  return (
    <div>
      <h2>{country.name.common} {country.flag}</h2>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h4>Languages:</h4>
      <ul>
        {
          country.languages && (
            Object.values(country.languages).map((lang) => (
              <li>{lang}</li>
            ))
          )
        }
      </ul>
    </div>
  )
}

const ListOfCountries = ({countries, showDetails, setShowDetails, searchValue}) => {
  const indices = []
  let numResults = 0
  countries.forEach((c, idx) => {
    if (c.name.common.toLowerCase().search(searchValue) !== -1) {
        indices.push(idx)
        numResults++
    }
  });
  console.log('INDICES', indices)

  const handleToggleShow = (idx) => {
    console.log(idx)
    const showDetailsCopy = [...showDetails]
    showDetailsCopy[idx] = !showDetails[idx]
    setShowDetails(showDetailsCopy)
  }


  return (countries.map((country, idx) => {
      if (indices.includes(idx)) {
        console.log(idx, showDetails[idx])
        if (showDetails[idx] || numResults === 1)
          return (<>
          <Country country={country} />
          <button onClick={() => handleToggleShow(idx)}>hide</button></>)
        else
          return (
              <div>
                <p>{country.name.common} {country.flag} <button onClick={() => handleToggleShow(idx)}>show</button></p>
              </div>
            )
      }
      else
        return <></>
  }))
}

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [countries, setCountries] = useState([])
  const [showDetails, setShowDetails] = useState([])
  
  // Fetch data
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
        setShowDetails(new Array(response.data.length).fill(false))
        console.log(response.data)
      })
  }, [])

  

  return (
    <>
      <h1>Countries</h1>
      <SearchFilter searchValue={searchValue} setSearchValue={setSearchValue} />
      <ListOfCountries countries={countries} showDetails={showDetails} setShowDetails={setShowDetails} searchValue={searchValue} />
    </>
  );
}

export default App;
