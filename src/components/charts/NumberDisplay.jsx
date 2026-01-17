import React from 'react';

// Seven-segment display component for LED-style numbers
const SevenSegment = ({ digit, size = 60, color = '#ff0000', offColor = '#330000' }) => {
  const segments = {
    '0': [1, 1, 1, 1, 1, 1, 0],
    '1': [0, 1, 1, 0, 0, 0, 0],
    '2': [1, 1, 0, 1, 1, 0, 1],
    '3': [1, 1, 1, 1, 0, 0, 1],
    '4': [0, 1, 1, 0, 0, 1, 1],
    '5': [1, 0, 1, 1, 0, 1, 1],
    '6': [1, 0, 1, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 0, 0],
    '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1],
  };

  const activeSegments = segments[digit] || segments['0'];
  const w = size * 0.6;
  const h = size;
  const t = size * 0.12; // thickness

  // Segment paths for a 7-segment display
  // a=top, b=top-right, c=bottom-right, d=bottom, e=bottom-left, f=top-left, g=middle
  const segmentStyles = {
    // Top segment (a)
    a: {
      position: 'absolute',
      top: 0,
      left: t * 0.5,
      width: w - t,
      height: t,
      backgroundColor: activeSegments[0] ? color : offColor,
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
    },
    // Top-right segment (b)
    b: {
      position: 'absolute',
      top: t * 0.5,
      right: 0,
      width: t,
      height: h / 2 - t * 0.75,
      backgroundColor: activeSegments[1] ? color : offColor,
      clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)',
    },
    // Bottom-right segment (c)
    c: {
      position: 'absolute',
      top: h / 2 + t * 0.25,
      right: 0,
      width: t,
      height: h / 2 - t * 0.75,
      backgroundColor: activeSegments[2] ? color : offColor,
      clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)',
    },
    // Bottom segment (d)
    d: {
      position: 'absolute',
      bottom: 0,
      left: t * 0.5,
      width: w - t,
      height: t,
      backgroundColor: activeSegments[3] ? color : offColor,
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
    },
    // Bottom-left segment (e)
    e: {
      position: 'absolute',
      top: h / 2 + t * 0.25,
      left: 0,
      width: t,
      height: h / 2 - t * 0.75,
      backgroundColor: activeSegments[4] ? color : offColor,
      clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)',
    },
    // Top-left segment (f)
    f: {
      position: 'absolute',
      top: t * 0.5,
      left: 0,
      width: t,
      height: h / 2 - t * 0.75,
      backgroundColor: activeSegments[5] ? color : offColor,
      clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)',
    },
    // Middle segment (g)
    g: {
      position: 'absolute',
      top: h / 2 - t / 2,
      left: t * 0.5,
      width: w - t,
      height: t,
      backgroundColor: activeSegments[6] ? color : offColor,
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
    },
  };

  return (
    <div style={{ position: 'relative', width: w, height: h, display: 'inline-block', margin: '0 4px' }}>
      <div style={segmentStyles.a} />
      <div style={segmentStyles.b} />
      <div style={segmentStyles.c} />
      <div style={segmentStyles.d} />
      <div style={segmentStyles.e} />
      <div style={segmentStyles.f} />
      <div style={segmentStyles.g} />
    </div>
  );
};

export function NumberDisplay({ value = 16, title = "مسح الفواصل الصخرية", size = 35 }) {
  const digits = String(value).padStart(2, '0').split('');
  const ledColor = '#ff0000';
  const ledOffColor = '#330000';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '8px',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '100px',
      }}
    >
      <h3
        style={{
          color: 'var(--text-primary)',
          fontSize: 'clamp(10px, 1.2vw, 14px)',
          fontWeight: '600',
          marginBottom: '8px',
          textAlign: 'center',
          direction: 'rtl',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          padding: '10px 15px',
          borderRadius: '6px',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8)',
        }}
      >
        {digits.map((digit, index) => (
          <SevenSegment
            key={index}
            digit={digit}
            size={size}
            color={ledColor}
            offColor={ledOffColor}
          />
        ))}
      </div>
    </div>
  );
}

export default NumberDisplay;
