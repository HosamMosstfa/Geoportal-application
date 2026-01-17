import React, { useRef } from "react";
import "./FieldGallery.css";

// استيراد الصور صح
import img1 from "../../../assets/Photos/Photos (1).png";
import img2 from "../../../assets/Photos/Photos (2).png";
import img3 from "../../../assets/Photos/Photos (3).png";
import img4 from "../../../assets/Photos/Photos (4).png";
import img5 from "../../../assets/Photos/Photos (5).png";
import img6 from "../../../assets/Photos/Photos (6).png";
import img7 from "../../../assets/Photos/Photos (7).png";
import img8 from "../../../assets/Photos/Photos (8).png";

const FieldGallery = () => {
  const fieldImages = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
  ];

  const sliderRef = useRef(null);

  const slide = (direction) => {
    if (sliderRef.current) {
      const current = sliderRef.current;
      const scrollAmount = 320;
      const maxScrollLeft = current.scrollWidth - current.clientWidth;

      if (direction === "left") {
        if (current.scrollLeft >= maxScrollLeft - 10) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        if (current.scrollLeft <= 10) {
          current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        } else {
          current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
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
