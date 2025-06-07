import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import looks from "./looks.json";

const FashionLookbook = () => {
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [currentLook, setCurrentLook] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollContainerRef = useRef(null);

  const currentBrand = looks.brands[selectedBrand];
  const currentBrandLooks = currentBrand.looks;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLook((prev) => (prev + 1) % currentBrandLooks.length);
      scrollToLook((currentLook + 1) % currentBrandLooks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentBrandLooks.length, currentLook]);

  const scrollToLook = (lookIndex) => {
    if (scrollContainerRef.current) {
      const lookElement = scrollContainerRef.current.children[lookIndex];
      if (lookElement) {
        lookElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const nextLook = () => {
    const nextIndex = (currentLook + 1) % currentBrandLooks.length;
    setCurrentLook(nextIndex);
    scrollToLook(nextIndex);
  };

  const prevLook = () => {
    const prevIndex =
      (currentLook - 1 + currentBrandLooks.length) % currentBrandLooks.length;
    setCurrentLook(prevIndex);
    scrollToLook(prevIndex);
  };

  const handleBrandSelect = (brandIndex) => {
    setSelectedBrand(brandIndex);
    setCurrentLook(0);
    scrollToLook(0);
  };

  return (
    <div className="max-w-md mx-auto bg-black h-screen relative">
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex flex-col gap-4">
          <div
            className="h-32 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {looks.brands.map((brand, index) => (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(index)}
                className={`w-full mb-2 px-4 py-3 rounded-lg text-left ${
                  selectedBrand === index
                    ? "bg-white text-black"
                    : "bg-black text-white border border-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{brand.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-white text-right">
            Look {currentLook + 1}/{currentBrandLooks.length}
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="h-full overflow-x-auto whitespace-nowrap snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {currentBrandLooks.map((look, index) => (
          <div
            key={look.id}
            className="<div key={look.id} className="
            inline-block
            w-full
            h-full
            snap-start
            relative
          >
            <div className="relative h-full">
              <img
                src={look.image}
                alt="Fashion Look"
                className="w-full h-full object-cover"
              />

              {look.products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="absolute w-8 h-8 bg-white rounded-full shadow-lg"
                  style={{
                    left: `${product.x}%`,
                    top: `${product.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-3 h-3 bg-black rounded-full mx-auto mt-2.5"></div>
                </button>
              ))}

              <button
                onClick={prevLook}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextLook}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {currentBrandLooks.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentLook ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-end z-20">
          <div className="bg-white w-full p-6 rounded-t-xl">
            <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
            <p className="text-2xl text-green-600 font-bold mb-4">
              {selectedProduct.price}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-3 border border-gray-300 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => alert("Going to product page!")}
                className="flex-1 py-3 bg-black text-white rounded-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionLookbook;
