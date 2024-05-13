import React from 'react';

function CustomTooltip({ content }) {
  return (
    <div className="tooltip">
      <span className="tooltip-content">{content}</span>
    </div>
  );
}

function YourComponent() {
  return (
    <div>
      <CustomTooltip content={<span className="text-blue-900">define</span>}>ex: pi 3.1416;</CustomTooltip>
    </div>
  );
}

export default YourComponent;
