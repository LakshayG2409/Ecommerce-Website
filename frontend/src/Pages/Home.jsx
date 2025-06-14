import React from 'react'
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollection from '../Components/NewCollection/NewCollection';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import ProductSearch from '../Components/ProductSearch/ProductSearch';


const Home = () => {
  return (
    <div>
      <ProductSearch/>
      <Hero/>
      
      <Popular/>
      
      <NewCollection/>
      <NewsLetter/>
      
      
    </div>
  )
}

export default Home;
