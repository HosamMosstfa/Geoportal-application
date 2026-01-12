import React, { useState } from "react";
import "./MapSection.css";

const MapSection = () => {
  const [activeRegion, setActiveRegion] = useState(null);

  const defaultData = {
    right: [
      { label: "إجمالي المساحة", value: "2.5 مليون م²" },
      { label: "المناطق النشطة", value: "4 مناطق" },
      { label: "الحالة العامة", value: "مستقر" },
    ],
    left: [
      { label: "إجمالي المحطات", value: "85 محطة" },
      { label: "نسبة الإنجاز الكلية", value: "92%" },
      { label: "آخر تحديث", value: "الآن" },
    ],
  };

  const regionsData = {
    1: {
      right: [
        { label: "اسم المنطقة", value: "المنطقة الشماليه الشرقية" },
        { label: "المساحة", value: "150,000 م²" },
        { label: "الحالة", value: "نشط" },
      ],
      left: [
        { label: "عدد المحطات", value: "73 محطة" },
        { label: "نسبة الإنجاز", value: "85%" },
        { label: "التصنيف", value: "A+" },
      ],
    },
    2: {
      right: [
        { label: "اسم المنطقة", value: "منطقة الجمرات" },
        { label: "المساحة", value: "90,000 م²" },
        { label: "الحالة", value: "تحت الصيانة" },
      ],
      left: [
        { label: "عدد المحطات", value: "8 محطات" },
        { label: "نسبة الإنجاز", value: "60%" },
        { label: "التصنيف", value: "B" },
      ],
    },
    3: {
      right: [
        { label: "اسم المنطقة", value: "مزدلفة" },
        { label: "المساحة", value: "200,000 م²" },
        { label: "الحالة", value: "مكتمل" },
      ],
      left: [
        { label: "عدد المحطات", value: "20 محطة" },
        { label: "نسبة الإنجاز", value: "100%" },
        { label: "التصنيف", value: "A" },
      ],
    },
    4: {
      right: [
        { label: "اسم المنطقة", value: "عرفات" },
        { label: "المساحة", value: "350,000 م²" },
        { label: "الحالة", value: "مكتمل" },
      ],
      left: [
        { label: "عدد المحطات", value: "45 محطة" },
        { label: "نسبة الإنجاز", value: "98%" },
        { label: "التصنيف", value: "A++" },
      ],
    },
  };

  const currentRight = activeRegion
    ? regionsData[activeRegion].right
    : defaultData.right;
  const currentLeft = activeRegion
    ? regionsData[activeRegion].left
    : defaultData.left;

  return (
    <div className="content-container2">
      <div className="map-section-wrapper">
        <div className="map-border-top"></div>

        <h2 className="map-section-title">بيانات المنطقة</h2>

        <div className="map-content-grid">
          <div className="map-stats-side right-side">
            {currentRight.map((item, idx) => (
              <div key={idx} className="stat-card">
                <h4>{item.label}</h4>
                <p>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="map-container-center">
            <svg
              version="1.1"
              id="InteractiveMap"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 595.3 841.9"
              className="interactive-map-svg"
              xmlSpace="preserve"
            >
              <g
                className="map-group"
                onMouseEnter={() => setActiveRegion(1)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <path
                  className={`map-region ${
                    activeRegion === 1 ? "active-path" : ""
                  }`}
                  d="M470.9,446.9H305.1c-0.8,0-1.5-0.7-1.5-1.5V296.6c0-0.5,0.2-0.9,0.6-1.2c0.4-0.3,0.9-0.4,1.3-0.3l13.6,3.7
                  c0.3,0.1,0.6,0.3,0.9,0.6l47,69.7l17,13.5l27.8,19.7l60,41.9c0.5,0.4,0.8,1.1,0.6,1.7C472.1,446.5,471.6,446.9,470.9,446.9z"
                />
              </g>

              <g
                className="map-group"
                onMouseEnter={() => setActiveRegion(2)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <path
                  className={`map-region ${
                    activeRegion === 2 ? "active-path" : ""
                  }`}
                  d="M305.1,446.9H151.3c-0.8,0-1.4-0.6-1.5-1.3c-0.1-0.7,0.4-1.5,1.1-1.6l8.9-2.3l10.1-7.2l4.7-9.9l1.9-8.4
                  l-37.9-33.4l-5.4-1.4c-0.3-0.1-0.6-0.3-0.8-0.6l-9-12.1l-7.5-0.9c-0.4,0-0.7-0.2-1-0.5l-9.4-10.9l-6.8-4.2l-3,1
                  c-0.5,0.2-1,0.1-1.4-0.3l-5.8-4.6c-0.1,0-0.1-0.1-0.1-0.1l-7.3-7.6l-3.1-2.7l-1,0.1c-0.1,0-0.1,0-0.2,0l-7.9,0.1l-4.6,1l-8.1,2.2
                  c-0.1,0-0.2,0-0.3,0.1l-5,0.2c-0.6,0-1.1-0.3-1.4-0.8s-0.3-1.1,0-1.6l1.9-2.9l-0.1-5.4c0-0.6,0.3-1.1,0.8-1.4l12.4-6.4l5.4-4.3
                  c0.1-0.1,0.3-0.2,0.5-0.3l16.3-5.2l13.9-11.7c0.1-0.1,0.3-0.2,0.4-0.3l23.8-9l15.7-7.2l22.6-22.2c0.1-0.1,0.2-0.1,0.3-0.2l11.1-6.8
                  l9.2-8.8l-1.3-5.9c-0.2-0.8,0.3-1.5,1-1.8l5.8-1.8l5.8-2.9c0.2-0.1,0.4-0.2,0.6-0.2L211,234l6.8-1c0,0,0.1,0,0.1,0l4.2-0.2l6.8-4.2
                  c0.1-0.1,0.2-0.1,0.4-0.2l11-3.2c0.7-0.2,1.4,0.1,1.7,0.7l2.6,4.9l2.7,0.1l7.1-1.9c0.6-0.2,1.3,0.1,1.7,0.6l7.2,11.2
                  c0.1,0.1,0.1,0.2,0.1,0.3l11.5,31.7c0,0.1,0.1,0.2,0.1,0.3l1.6,13.1l16.3,5.3l12.6,3.5c0.7,0.2,1.1,0.8,1.1,1.4v148.8
                  C306.6,446.2,305.9,446.9,305.1,446.9z"
                />
              </g>

              <g
                className="map-group"
                onMouseEnter={() => setActiveRegion(3)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <path
                  className={`map-region ${
                    activeRegion === 3 ? "active-path" : ""
                  }`}
                  d="M421.7,632.7h-1.6l-29.3-0.2c-0.2,0-0.4,0-0.6-0.1L338,608.6c-0.1,0-0.2-0.1-0.3-0.2l-33.5-24.3
                  c-0.4-0.3-0.6-0.7-0.6-1.2V445.4c0-0.8,0.7-1.5,1.5-1.5h165.8c0.3,0,0.6,0.1,0.9,0.3l13.7,9.6c0.3,0.2,0.5,0.5,0.6,0.8l17.6,58.5
                  l14.3,28.7c0.1,0.2,0.1,0.4,0.2,0.6l1.8,23.2l5.7,15c0,0.1,0,0.1,0.1,0.2l3.3,12.8l6.6,22.7l6.4,6.7c0.4,0.4,0.5,1.1,0.3,1.6
                  s-0.7,0.9-1.4,0.9l-73.7-0.8l-45.2,8.1C421.9,632.7,421.8,632.7,421.7,632.7z"
                />
              </g>

              <g
                className="map-group"
                onMouseEnter={() => setActiveRegion(4)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <path
                  className={`map-region ${
                    activeRegion === 4 ? "active-path" : ""
                  }`}
                  d="M305.1,584.4c-0.3,0-0.6-0.1-0.9-0.3l-0.7-0.5c-0.1,0-0.1-0.1-0.2-0.1L284,564.7l-25.1-24.1l-103.5-25.2
                  c-0.3-0.1-0.5-0.2-0.7-0.4l-13.1-13.1l-24.1-27.3c-0.2-0.3-0.4-0.6-0.4-1l-0.3-16.2c0-0.6,0.3-1.1,0.8-1.3l11.2-6.2
                  c0.1-0.1,0.2-0.1,0.3-0.1l21.8-5.8c0.1,0,0.3-0.1,0.4-0.1h153.8c0.8,0,1.5,0.7,1.5,1.5v137.5c0,0.6-0.3,1.1-0.8,1.3
                  C305.6,584.3,305.3,584.4,305.1,584.4z"
                />
              </g>
            </svg>
          </div>

          <div className="map-stats-side left-side">
            {currentLeft.map((item, idx) => (
              <div key={idx} className="stat-card">
                <h4>{item.label}</h4>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="map-border-bottom"></div>
      </div>
    </div>
  );
};

export default MapSection;
