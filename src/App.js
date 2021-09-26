import React, { useEffect, useState } from 'react';
import './App.css';
import CoinsInfo from './CoinsInfo';


export default function App() {

  /*
    State variables declaration
  */
  
  const [coinsList, setCoinsList] = useState([]);
   
  const [search, setSearch] = useState('')
  
  const [sortType, setSortType] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  /*
    useEffect hook to fetch data from CoinGecko API and update sortList function
    everytime sortType value is updated for re-rendering 
  */

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    .then(response => {
      if(response.ok){
        return response.json()
      }
      throw response;
    })
    .then(data => {
      // update state coinsList with incoming JSON data
      setCoinsList(data)
      // sortList function takes in Type of sorting as the argument
      const sortList = type => {
        const types = {
          market_cap: 'market_cap',
          name: 'name',
          current_price: 'current_price',
        };
        // Assign selected type of sort to sortProperty
        let sortProperty = types[type];
        
        let sorted = []
        // sort coinsList on the basis of coin name
        if (sortProperty === 'name') {
          sorted = [...data].sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
          });
        }
        // sort coinList on the basis of coin's market cap value and coin's current price
        else
          sorted = [...data].sort((a, b) => b[sortProperty] - a[sortProperty]);
        
        setCoinsList(sorted);
      };
      
      sortList(sortType);
    })
    .catch( error => {
      console.error("Error occured while fetching data: ", error);
      setError(error);
    })
    .finally(() => {
      setIsLoading(false)
    })
  }, [sortType])

  //filter coins on the basis of coin name search
  const filteredCoins = coinsList.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()))
  
  
  const handleChange = e => {
    setSearch(e.target.value)
  }

  const handleSelection = e => {
    setSortType(e.target.value)
    console.log(sortType);
  }

  if (isLoading) return "Loading..."
  if (error) return "Error!"
  return (
    <div className="coins-info-app">
      <div className="coins-search">
        
        <form>
          <input className="coins-text-input" type="text" placeholder="Search coins" onChange={handleChange}></input>
        </form>
      </div>
      <div className = "coins-sort-by">
        <h4 className = "coins-sort-by-text"> Sort By :</h4>
        <select onChange = {handleSelection}>
          <option value = "market_cap"> Market Cap </option>
          <option value = "name"> Coin Name </option>
          <option value = "current_price"> Current Price </option>
        </select>

      </div>
       
        {
          filteredCoins
           .map(coin => {
            return (
              <CoinsInfo key = {coin.id} marketCapRank = {coin.market_cap_rank} image = {coin.image} name={coin.name} marketCap = {coin.market_cap} price = {coin.current_price} pricePercentChange = {coin.price_change_percentage_24h}/>
            )
          })
        }
        
    </div>
  );
}

