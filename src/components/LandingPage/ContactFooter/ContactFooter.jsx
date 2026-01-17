import React from "react";
import "./ContactFooter.css";

// imports الصح للصور
import footerLogo from "../../../assets/Footer/Logo.png";
import icon1 from "../../../assets/Footer/Icon (1).png";
import icon2 from "../../../assets/Footer/Icon (2).png";
import icon3 from "../../../assets/Footer/Icon (3).png";
import icon4 from "../../../assets/Footer/Icon (4).png";

const ContactFooter = () => {
  return (
    <div className="footer-wrapper" dir="rtl">
      <div className="contact-dark-section">
        <div className="contact-header-title">تواصل معنا</div>

        <div className="contact-container">
          <div className="contact-info-side">
            <div className="address-block">
              <span className="location-icon">📍</span>
              <p>
                مكة المكرمة - حي الملك فهد - شارع الأمير ناصر بن عبدالعزيز آل سعود
                - رقم المبنى 2861 - الرقم الفرعي 9761 - الرمز البريدي 24353 - الدور
                السادس - مكتب رقم 601
              </p>
            </div>

            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.171165825712!2d39.78871856692515!3d21.389458105791658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c21b0019ab5d99%3A0xb0394cb63ec191ca!2z2K3ZiiDYp9mE2YXZhNmDINmB2YfYrw!5e0!3m2!1sar!2seg!4v1768155386308!5m2!1sar!2seg"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>

          <div className="contact-form-side">
            <form>
              <input type="text" placeholder="الاسم" className="footer-input" />
              <input
                type="email"
                placeholder="الايميل"
                className="footer-input"
              />
              <textarea
                placeholder="الرسالة"
                className="footer-textarea"
                rows="5"
              />
              <button type="button" className="footer-send-btn">
                إرسال
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="golden-footer-body">
        <div className="footer-columns">
          <div className="col-branding">
            <div className="logos-row">
              <img
                src={footerLogo}
                alt="Kidana"
                className="footer-logo"
              />
            </div>

            <p className="branding-text">
              تصميم الحلول الفنية المناسبة لتثبيت الصخور في النقاط الحرجة مثل
              الرش الخرساني، المسامير الأرضية، المرابط الصخرية، وإعداد المخططات
              التنفيذية اللازمة.
            </p>
          </div>

          <div className="col-links">
            <ul className="footer-nav">
              <li>
                <a href="#home">الصفحة الرئيسية</a>
              </li>
              <li>
                <a href="#dashboard">لوحة التحكم</a>
              </li>
              <li>
                <a href="#contact">تواصل معنا</a>
              </li>
            </ul>
          </div>

          <div className="col-social">
            <a href="#" className="social-item">
              <img src={icon1} alt="Facebook" />
              <span>المرصد المكاني</span>
            </a>
            <a href="#" className="social-item">
              <img src={icon2} alt="Twitter" />
              <span>المرصد المكاني</span>
            </a>
            <a href="#" className="social-item">
              <img src={icon3} alt="LinkedIn" />
              <span>المرصد المكاني</span>
            </a>
            <a href="#" className="social-item">
              <img src={icon4} alt="Instagram" />
              <span>المرصد المكاني</span>
            </a>
          </div>
        </div>
      </div>

      <div className="copyright-bar">
        جميع الحقوق محفوظة لدى المرصد المكاني وكدانة 2026
      </div>
    </div>
  );
};

export default ContactFooter;
