import React from 'react'

interface Option {
  value: string
  label: string
}

interface MultiSelectCheckboxProps {
  options: Option[]
  value: string[]
  onChange: (value: any[]) => void
  className?: string
  label?: string
}

const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
  options,
  value,
  onChange,
  className = '',
  label
}) => {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className={`rounded border px-3 py-2 bg-white max-h-48 overflow-y-auto ${className}`}>
      {label && <div className='font-medium mb-1'>{label}</div>}
      <div className='grid grid-cols-1 gap-1'>
        {options.map((option) => (
          <label
            key={option.value}
            className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded transition'
          >
            <input
              type='checkbox'
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className='accent-blue-600 w-4 h-4'
            />
            <span className='text-sm'>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default MultiSelectCheckbox
