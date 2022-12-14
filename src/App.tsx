import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Saerch";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/movies" element={<Home />}></Route>
        <Route path="/movies/:movieId" element={<Home />}></Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/:tvId" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/search/movies/:movieId" element={<Search />}></Route>
        <Route path="/search/tv/:tvId" element={<Search />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
