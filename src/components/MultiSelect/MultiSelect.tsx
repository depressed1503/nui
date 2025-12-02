import React, {
    useState, useMemo, useRef, useEffect, useCallback
} from 'react'
import { Form, InputGroup, Dropdown, Badge } from 'react-bootstrap'
import { Search, X } from 'lucide-react'

export type SelectOption<T = any> = Record<string, any> & { value?: T }

type SingleSelectOnChange<T> = (value: T | null) => void
type MultiSelectOnChange<T> = (value: T[]) => void

interface BaseMultiSelectProps<T> {
    options: SelectOption<T>[]
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
    required?: boolean
    className?: string
    id?: string
    name?: string
    labelField?: string
    valueField?: string
    renderOptionLabel?: (option: SelectOption<T>) => React.ReactNode
    customSearch?: (option: SelectOption<T>, searchTerm: string) => boolean
    isLoading?: boolean
}

interface SingleSelectProps<T> extends BaseMultiSelectProps<T> {
    multiple?: false
    value: T | null
    onChange: SingleSelectOnChange<T>
}

interface MultiSelectProps<T> extends BaseMultiSelectProps<T> {
    multiple: true
    value: T[]
    onChange: MultiSelectOnChange<T>
}

type MultiSelectComponentProps<T> = SingleSelectProps<T> | MultiSelectProps<T>

export default function MultiSelect<T = any>(props: MultiSelectComponentProps<T>) {
    const {
        options,
        value,
        onChange,
        multiple = false,
        placeholder = 'Выбор...',
        searchPlaceholder = 'Поиск',
        disabled = false,
        required = false,
        className = '',
        id,
        name,
        labelField = 'label',
        valueField = 'value',
        renderOptionLabel,
        customSearch,
        isLoading = false,
    } = props

    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const getOptionLabel = useCallback((option: SelectOption<T>): string => {
        if (renderOptionLabel) return String(renderOptionLabel(option))
        return String(option[labelField] ?? '')
    }, [renderOptionLabel, labelField])

    const getOptionValue = useCallback((option: SelectOption<T>): T => {
        return (option[valueField] as T) ?? (option as unknown as T)
    }, [valueField])

    const currentValues = useMemo<T[]>(() => {
        if (multiple) {
            return Array.isArray(value) ? value : []
        }
        return value !== null && value !== undefined ? [value as T] : []
    }, [value, multiple])

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options
        if (customSearch) return options?.filter(o => customSearch(o, searchTerm))
        return options?.filter(o =>
            getOptionLabel(o).toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm, customSearch, getOptionLabel])

    const selectedOptions = useMemo(() => {
        return options?.filter(option =>
            currentValues.some(v => v === getOptionValue(option))
        )
    }, [options, currentValues, getOptionValue])

    const handleOptionToggle = useCallback((optionValue: T) => {
        if (multiple) {
            const newValues = currentValues.includes(optionValue)
                ? currentValues?.filter(v => v !== optionValue)
                : [...currentValues, optionValue]
                ; (onChange as MultiSelectOnChange<T>)(newValues)
        } else {
            ; (onChange as SingleSelectOnChange<T>)(optionValue)
            setIsOpen(false)
            setSearchTerm('')
        }
    }, [multiple, currentValues, onChange])

    const handleClearAll = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (multiple) {
            ; (onChange as MultiSelectOnChange<T>)([])
        } else {
            ; (onChange as SingleSelectOnChange<T>)(null)
        }
        setSearchTerm('')
    }, [multiple, onChange])

    const handleRemoveOption = useCallback((optionValue: T, e: React.MouseEvent) => {
        e.stopPropagation()
        if (multiple) {
            const newValues = currentValues?.filter(v => v !== optionValue)
                ; (onChange as MultiSelectOnChange<T>)(newValues)
        } else {
            ; (onChange as SingleSelectOnChange<T>)(null)
        }
    }, [multiple, currentValues, onChange])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsOpen(true)
                setTimeout(() => searchInputRef.current?.focus(), 100)
            }
            return
        }

        switch (e.key) {
            case 'Escape':
                setIsOpen(false)
                setFocusedIndex(-1)
                break
            case 'ArrowDown':
                e.preventDefault()
                setFocusedIndex(prev =>
                    prev < filteredOptions?.length - 1 ? prev + 1 : 0
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setFocusedIndex(prev =>
                    prev > 0 ? prev - 1 : filteredOptions?.length - 1
                )
                break
            case 'Enter':
            case ' ':
                e.preventDefault()
                if (focusedIndex >= 0 && focusedIndex < filteredOptions?.length) {
                    handleOptionToggle(getOptionValue(filteredOptions[focusedIndex]))
                }
                break
        }
    }, [isOpen, filteredOptions, focusedIndex, handleOptionToggle, getOptionValue])

    useEffect(() => {
        // reset focusedIndex only if current focusedIndex is out of range
        if (focusedIndex >= filteredOptions?.length) {
            setFocusedIndex(-1)
        }
    }, [filteredOptions, focusedIndex])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={className} ref={dropdownRef}>
            <Form.Group controlId={id}>
                <Dropdown show={isOpen} onToggle={(show: boolean) => setIsOpen(show)}>
                    <Dropdown.Toggle
                        as={CustomToggle}
                        variant="outline-secondary"
                        className="w-100 d-flex justify-content-between align-items-center"
                        disabled={disabled || isLoading}
                        onKeyDown={handleKeyDown}
                    >
                        <div className="d-flex align-items-center flex-wrap gap-1" style={{ minHeight: '24px' }}>
                            {isLoading ? (
                                <span className="text-muted">Загрузка...</span>
                            ) : selectedOptions?.length === 0 ? (
                                <span className="text-muted">{placeholder}</span>
                            ) : multiple ? (
                                selectedOptions?.map(option => (
                                    <Badge
                                        key={String(getOptionValue(option))}
                                        bg="primary"
                                        className="d-flex align-items-center"
                                        style={{ fontSize: '0.875rem' }}
                                    >
                                        {getOptionLabel(option)}
                                        <X
                                            size={14}
                                            className="ms-1 cursor-pointer"
                                            onClick={(e) =>
                                                handleRemoveOption(getOptionValue(option), e)
                                            }
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span>{getOptionLabel(selectedOptions[0])}</span>
                            )}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            {!isLoading && currentValues?.length > 0 && (
                                <X size={16} className="text-muted" onClick={handleClearAll} />
                            )}
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100 p-2">
                        <div className="px-2 mb-2">
                            <InputGroup size="sm">
                                <InputGroup.Text><Search size={16} /></InputGroup.Text>
                                <Form.Control
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </InputGroup>
                        </div>

                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {isLoading ? (
                                <div className="text-center text-muted py-2">Loading options...</div>
                            ) : filteredOptions?.length === 0 ? (
                                <div className="text-center text-muted py-2">
                                    {searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                filteredOptions?.map((option, index) => {
                                    const optionValue = getOptionValue(option)
                                    const optionLabel = getOptionLabel(option)
                                    const isSelected = currentValues.includes(optionValue)

                                    return (
                                        <Dropdown.Item
                                            key={String(optionValue)}
                                            onClick={() =>
                                                !option.disabled && handleOptionToggle(optionValue)
                                            }
                                            disabled={option.disabled as boolean}
                                            className={`d-flex align-items-center ${focusedIndex === index ? 'bg-light' : ''
                                                } ${isSelected ? 'bg-primary text-white' : ''}`}
                                            onMouseEnter={() => setFocusedIndex(index)}
                                        >
                                            {multiple && (
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => { }}
                                                    disabled={option.disabled as boolean}
                                                    className="me-2"
                                                />
                                            )}
                                            {renderOptionLabel ? renderOptionLabel(option) : optionLabel}
                                        </Dropdown.Item>
                                    )
                                })
                            )}
                        </div>

                        {multiple && currentValues?.length > 0 && (
                            <div className="px-2 pt-2 border-top">
                                <small className="text-muted">
                                    {currentValues?.length} option{currentValues?.length !== 1 ? 's' : ''} selected
                                </small>
                            </div>
                        )}
                    </Dropdown.Menu>
                </Dropdown>

                <input
                    type="hidden"
                    name={name}
                    value={
                        multiple
                            ? currentValues?.map(String).join(',')
                            : currentValues[0] !== undefined
                                ? String(currentValues[0])
                                : ''
                    }
                    required={required}
                />
            </Form.Group>
        </div>
    )
}

interface CustomToggleProps {
    children: React.ReactNode
    onClick?: (e: React.MouseEvent) => void
    disabled?: boolean
    onKeyDown: (e: React.KeyboardEvent) => void
}

const CustomToggle = React.forwardRef<HTMLDivElement, CustomToggleProps>(
    ({ children, onClick, disabled, onKeyDown }, ref) => (
        <div
            ref={ref}
            tabIndex={0}
            className={`form-select d-flex align-items-center justify-content-between ${disabled ? 'bg-light' : ''
                }`}
            style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
            }}
            onClick={disabled ? undefined : onClick}
            onKeyDown={onKeyDown}
            role="button"
            aria-haspopup="listbox"
            aria-disabled={disabled}
        >
            {children}
        </div>
    )
)

CustomToggle.displayName = 'CustomToggle'
