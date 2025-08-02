'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  onInputChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  onInputChange,
  placeholder = 'Select option...',
  emptyText = 'No option found.',
  searchPlaceholder = 'Search...',
  loading = false,
  disabled = false,
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const selectedOption = options.find((option) => option.value === value)

  const handleInputChange = (value: string) => {
    setSearchValue(value)
    onInputChange?.(value)
  }

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue
    onValueChange?.(newValue)
    setOpen(false)
    setSearchValue('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between', className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={searchValue} onValueChange={handleInputChange} />
          <CommandList>
            {loading ? (
              <div className='flex items-center justify-center p-4'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
                <span className='ml-2 text-sm text-gray-500'>Đang tìm kiếm...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                      <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                      <div className='flex flex-col'>
                        <span>{option.label}</span>
                        {option.description && <span className='text-xs text-gray-500'>{option.description}</span>}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
