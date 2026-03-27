import React from 'react';

const SectionSelector = ({ value, onChange, options = [] }) => {
  return (
    <div>
      <label className="block font-semibold mb-2">Target Section</label>
      <select 
        value={options.includes(value) || value === '' ? value : 'custom'} 
        onChange={(e) => onChange(e.target.value)}
        className="form-input w-full p-3 rounded"
      >
        <option value="">-- Choose Section --</option>
        {options.map(opt => <option key={opt} value={opt}>Section: {opt}</option>)}
        <option value="custom">Create Custom Section...</option>
      </select>
    </div>
  );
};

export default SectionSelector;
