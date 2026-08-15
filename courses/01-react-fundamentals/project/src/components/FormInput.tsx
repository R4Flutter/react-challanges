import type { ChangeEvent } from 'react'

interface FormInputProps {
  id?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  type?: string
  placeholder?: string
  error?: string
}

export default function FormInput({
  id,
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  error,
}: FormInputProps) {
  return (
    <div className="form-field">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}