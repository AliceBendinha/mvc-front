/**
 * Valida um formulário baseado em regras
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
}

export const validateField = (
  value: any,
  rules: ValidationRule
): string | null => {
  if (rules.required && !value) {
    return 'Este campo é obrigatório'
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `Mínimo de ${rules.minLength} caracteres`
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return `Máximo de ${rules.maxLength} caracteres`
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return 'Formato inválido'
  }

  if (rules.custom && !rules.custom(value)) {
    return 'Valor inválido'
  }

  return null
}

/**
 * Valida múltiplos campos
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, string> => {
  const errors: Record<string, string> = {}

  Object.entries(rules).forEach(([field, rule]) => {
    const error = validateField(data[field], rule)
    if (error) {
      errors[field] = error
    }
  })

  return errors
}
