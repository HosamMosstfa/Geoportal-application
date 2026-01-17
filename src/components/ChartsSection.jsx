import { useState } from "react";
import { GaugeChart } from "./charts/GaugeChart";
import { BarChart } from "./charts/BarChart";
import { NumberDisplay } from "./charts/NumberDisplay";

function ChartsSection() {
  const [chartData] = useState({
    reconnaissanceCompletion: 75,
    rockMassClassification: [
      { name: 'RMR', value: 10 },
      { name: 'GSI', value: 20 },
      { name: 'SMR', value: 30 },
    ],
    protectionWorks: 60,
    hazardPercentages: [
      { name: 'Low', value: 40 },
      { name: 'Medium', value: 35 },
      { name: 'High', value: 25 },
    ],
    samples: [
      { name: 'A1', value: 10 },
      { name: 'A2', value: 15 },
      { name: 'A3', value: 20 },
      { name: 'A4', value: 25 },
      { name: 'A5', value: 18 },
      { name: 'A6', value: 12 },
    ],
  });

  return (
    <div style={{ 
      height: "100%", 
      padding: "4px", 
      backgroundColor: "var(--bg-secondary)",
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "6px",
        flex: 1,
        minHeight: 0
      }}>
        <GaugeChart value={chartData.reconnaissanceCompletion} title="استكمال المسح الاستطلاعي" />
        <GaugeChart value={chartData.protectionWorks} title="أعمال الحماية القائمة" />
        <NumberDisplay value={16} title="مسح الفواصل الصخرية" />
      </div>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "6px",
        flex: 1,
        minHeight: 0
      }}>
        <BarChart data={chartData.rockMassClassification} title="تصنيف الكتل الصخرية (RMR, SMR, GSI)" />
        <BarChart data={chartData.hazardPercentages} title="مسح مخاطر السقوط الصخري (Colorado Method)" />
        <BarChart data={chartData.samples} title="العينات" />
      </div>
    </div>
  );
}

export default ChartsSection;