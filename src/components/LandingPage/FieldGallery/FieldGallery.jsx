import React, { useRef } from "react";
import "./FieldGallery.css";
const FieldGallery = () => {
  const fieldImages = [
    "/src/assets/Photos/Photos (1).png",
    "/src/assets/Photos/Photos (2).png",
    "/src/assets/Photos/Photos (3).png",
    "/src/assets/Photos/Photos (4).png",
    "/src/assets/Photos/Photos (5).png",
    "/src/assets/Photos/Photos (6).png",
    "/src/assets/Photos/Photos (7).png",
    "/src/assets/Photos/Photos (8).png",
  ];

  const sliderRef = useRef(null);

  const slide = (direction) => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = 320;
      const maxScrollLeft = current.scrollWidth - current.clientWidth;

      if (direction === "left") {
        if (Math.abs(current.scrollLeft) >= maxScrollLeft - 10) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      } else {
        if (Math.abs(current.scrollLeft) <= 10) {
          current.scrollTo({ left: -maxScrollLeft, behavior: "smooth" });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", position: "relative", marginBottom: "80px" }}>
      <div style={{ textAlign: "center" }}>
        <h2
          className="section-title-box"
          style={{ margin: "0 auto 40px auto", display: "inline-block" }}
        >
          التوثيق الميداني
        </h2>
      </div>

      <div className="slider-container-wrapper">
        <button className="slider-btn prev-btn" onClick={() => slide("right")}>
          ❮
        </button>

        <div className="field-gallery slider" ref={sliderRef}>
          {fieldImages.map((src, index) => (
            <div key={index} className="gallery-item slider-item">
              <img
                src={src}
                alt={`Documentation ${index + 1}`}
                className="gallery-img"
              />
            </div>
          ))}
        </div>

        <button className="slider-btn next-btn" onClick={() => slide("left")}>
          ❯
        </button>
      </div>
    </div>
  );
};

export default FieldGallery;
