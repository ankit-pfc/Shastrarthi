import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
export const MultiSelect = ({ options, selectedValues, onSelectChange, placeholder = 'Select...', }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleSelect = (value) => {
        if (selectedValues.includes(value)) {
            onSelectChange(selectedValues.filter((v) => v !== value));
        }
        else {
            onSelectChange([...selectedValues, value]);
        }
    };
    const handleRemove = (value) => {
        onSelectChange(selectedValues.filter((v) => v !== value));
    };
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedValues.includes(option.value));
    const selectedLabels = selectedValues
        .map((value) => { var _a; return (_a = options.find((opt) => opt.value === value)) === null || _a === void 0 ? void 0 : _a.label; })
        .filter(Boolean);
    return (<div className="relative" ref={wrapperRef}>
      <div className="flex min-h-[38px] cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" onClick={handleToggle}>
        {selectedLabels.length > 0 ? (<div className="flex flex-wrap gap-1">
            {selectedLabels.map((label, index) => (<span key={index} className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {label}
                <X className="ml-1 h-3 w-3 cursor-pointer text-gray-500 hover:text-gray-900" onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(options.find(opt => opt.label === label).value);
                }}/>
              </span>))}
          </div>) : (<span className="text-gray-500">{placeholder}</span>)}
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
      </div>

      {isOpen && (<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <input type="text" placeholder="Search..." className="w-full rounded-t-md border-b border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus/>
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 && <li className="p-3 text-sm text-gray-500">No options found.</li>}
            {filteredOptions.map((option) => (<li key={option.value} className="cursor-pointer p-3 text-sm hover:bg-gray-50" onClick={() => handleSelect(option.value)}>
                {option.label}
              </li>))}
          </ul>
        </div>)}
    </div>);
};
