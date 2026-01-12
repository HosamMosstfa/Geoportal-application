import React from "react";
import "./ServicesSection.css";
import card1 from "../../../assets/Goals/Icon (2).png";
import card2 from "../../../assets/Goals/Icon (3).png";
import card3 from "../../../assets/Goals/Icon (4).png";
import card4 from "../../../assets/Goals/Icon (5).png";
import card5 from "../../../assets/Goals/Icon (6).png";
import card6 from "../../../assets/Goals/Icon (7).png";
import card7 from "../../../assets/Goals/Icon (8).png";
import card8 from "../../../assets/Goals/Icon (9).png";
import card9 from "../../../assets/Goals/Icon (10).png";
import card10 from "../../../assets/Goals/Icon (11).png";
import card11 from "../../../assets/Goals/Icon (12).png";
import card12 from "../../../assets/Goals/Icon (13).png";
const ServiceCard = ({ title, icon }) => (
  <div className="service-card">
    <div className="service-icon">
      <img src={icon} alt="Service Icon" />
    </div>
    <div className="service-title">{title}</div>
  </div>
);

const ServicesSection = () => {
  return (
    <div className="content-container">
      <div className="section-title-box">
        مشروع تقييم مخاطر المنحدرات والانهيارات الصخرية
      </div>
      <div className="section-second-title">
        بالمشاعر المقدسة الهندسية الحماية وتدابير الحماية الهندسية
      </div>

      <div className="services-grid">
        <ServiceCard
          title="هدفنا إجراء مسح استكشافي شامل للموقع لتحديد المناطق التي تتطلب إجراءات تعزيز استقرار الصخور القريبة من المواقع التاريخية والمباني والبنى التحتية والطرق"
          icon={card1}
        />
        <ServiceCard
          title="تنفيذ مسوحات ميدانية جيولوجية وتوصيف شامل للكتل والمنحدرات الصخرية."
          icon={card2}
        />
        <ServiceCard
          title="إعداد خرائط ومقاطع جيولوجية ونماذج ثلاثية الأبعاد بمقياس (1:200) لتوضيح الخصائص الجيومورفولوجية والجيولوجية للموقع."
          icon={card3}
        />
        <ServiceCard
          title="عمل التصميم الهندسي والانشائي للحلول الهندسية المقترحة في الدراسة الهيدرولوجية ( عبارات - قنوات اماكن تخزين المياه - الخ ) مع مراعاه إعادة استخدام المياه لاحقا في الاستخدامات المختلفة"
          icon={card4}
        />
        <ServiceCard
          title="إجراء الدراسات الهيدرولوجية والهيدروليكية لتقييم تأثير الأمطار والسيول على استقرار المنحدرات ، وتشمل إعداد خرائط أنواع التربة واستخدامات الأراضي ، وتحليل بيانات الأمطار ، وتقييم منشآت تصريف السيول القائمة واقتراح الحلول المناسبة للتصريف والحماية."
          icon={card5}
        />
        <ServiceCard
          title="عمل التصميم الهندسي والانشائي للحلول الهندسية المقترحة للحوائط الاستنادية والمصاطب الخرسانية في الدراسة الجيولوجية"
          icon={card6}
        />
        <ServiceCard
          title="جمع وتحليل البيانات الميدانية الخاصة بتساقط الصخور وإجراء الاختبارات الميدانية والمخبرية اللازمة لتحديد الخصائص الجيوتكنيكية ذات العلاقة بالتصميم"
          icon={card7}
        />
        <ServiceCard
          title="إعداد خرائط تقييم الخطورة وتصنيف المنحدرات إلى مستويات عالية - متوسطة - منخفضة الخطورة."
          icon={card8}
        />
        <ServiceCard
          title="إجراء تحليلات استقرار المنحدرات الصخرية باستخدام النمذجة الرقمية وبالاعتماد على الأكواد والمعايير الدولية المعتمدة"
          icon={card9}
        />
        <ServiceCard
          title="تصميم الحلول الفنية المناسبة لتثبيت الصخور في النقاط الحرجة (مثل الرش الخرساني المسامحالأرضية المرابط الصخرية) ، وإعداد المخططات التنفيذية اللازمة"
          icon={card10}
        />
        <ServiceCard
          title="تصميم وإعداد رسومات تثبيت المسامير BoltsAnchor للعناصر المرتبطة بالمنشآت الطبيعية في الموقع"
          icon={card11}
        />
        <ServiceCard
          title="إعادة تقييم المنحدرات بعد المعالجة وتقديم التوصيات النهائية بشأن فعاليتها وتقديم التوصيات الخاصة بالمسافات الأمنة بين الصخور والمنشآت العمرانية والبنى التحتية والطرق"
          icon={card12}
        />
      </div>
    </div>
  );
};

export default ServicesSection;
