import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import FashionLookbook from "./Components/FashionLookBook";
import Product from "./Components/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FashionLookbook />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;
