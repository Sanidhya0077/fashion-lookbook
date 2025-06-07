import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import looksData from "./looks.json";

const FashionLookbook = () => {
  const [brandIndex, setBrandIndex] = useState(0);
  const [lookIndex, setLookIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [muted, setMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const brand = looksData.brands[brandIndex];
  const look = brand.looks[lookIndex];
  const isVideo = !!look.video;

  // Reset look index when brand changes
  useEffect(() => {
    setLookIndex(0);
  }, [brandIndex]);

  // Auto progress for image every 5s
  useEffect(() => {
    if (!isVideo) {
      let step = 0;
      timerRef.current = setInterval(() => {
        step += 1;
        setProgress((step / 50) * 100);
        if (step === 50) {
          goNextLook();
        }
      }, 100);
    }
    return () => {
      clearInterval(timerRef.current);
      setProgress(0);
    };
  }, [lookIndex, brandIndex]);

  const goNextLook = () => {
    if (brand.looks.length > 1) {
      setLookIndex((prev) => (prev + 1) % brand.looks.length);
    }
  };

  const goPrevLook = () => {
    if (brand.looks.length > 1) {
      setLookIndex(
        (prev) => (prev - 1 + brand.looks.length) % brand.looks.length
      );
    }
  };

  const goNextBrand = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setBrandIndex((prev) => (prev + 1) % looksData.brands.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goPrevBrand = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setBrandIndex(
      (prev) => (prev - 1 + looksData.brands.length) % looksData.brands.length
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const config = {
    delta: 10,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
    rotationAngle: 0,
    swipeDuration: 300,
    touchEventOptions: { passive: false },
    touchAction: "none",
  };

  const handlers = useSwipeable({
    onSwipedUp: (eventData) => {
      console.log("Swiped Up", eventData);
      goNextBrand();
    },
    onSwipedDown: (eventData) => {
      console.log("Swiped Down", eventData);
      goPrevBrand();
    },
    ...config,
  });

  return (
    <div
      {...handlers}
      className="max-w-md mx-auto h-screen bg-black text-white relative overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">{brand.name}</h2>
          <span className="text-sm opacity-75">
            ({brandIndex + 1}/{looksData.brands.length})
          </span>
        </div>
        <span>
          Look {lookIndex + 1}/{brand.looks.length}
        </span>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 h-48 w-1 bg-gray-800 rounded-full z-10">
        <div
          className="w-full bg-white rounded-full transition-all duration-300"
          style={{
            height: `${100 / looksData.brands.length}%`,
            transform: `translateY(${
              (100 / looksData.brands.length) * brandIndex * 100
            }%)`,
          }}
        />
      </div>

      {/* Media Container */}
      <div className="w-full h-full relative">
        {/* Media */}
        <div
          className={`w-full h-full transition-opacity duration-500 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          {isVideo ? (
            <video
              src={look.video}
              autoPlay
              muted={muted}
              controls
              className="w-full h-full object-cover"
              onEnded={goNextLook}
            />
          ) : (
            <img
              src={look.image}
              alt="look"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Progress Bar */}
        {!isVideo && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        )}

        {/* Product Dots */}
        {look.products.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="absolute w-6 h-6 bg-white rounded-full"
            style={{
              left: `${product.x}%`,
              top: `${product.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-2 h-2 bg-black rounded-full mx-auto mt-2"></div>
          </button>
        ))}

        {/* Arrows */}
        {brand.looks.length > 1 && (
          <>
            <button
              onClick={goPrevLook}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={goNextLook}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Mute Toggle for Videos */}
        {isVideo && (
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-4 right-4 bg-white text-black px-2 py-1 rounded"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        )}

        {/* Swipe Indicator */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
          <div className="text-white text-center opacity-50">
            Swipe down for previous brand
          </div>
          <div className="text-white text-center opacity-50">
            Swipe up for next brand
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end z-20">
          <div className="bg-white w-full p-6 rounded-t-xl text-black">
            <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
            <p className="text-green-600 text-lg font-semibold mb-4">
              {selectedProduct.price}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="border border-gray-400 px-4 py-2 rounded-lg flex-1"
              >
                Close
              </button>
              <button
                onClick={() => navigate(`/product/${selectedProduct.id}`)}
                className="bg-black text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center gap-2"
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
