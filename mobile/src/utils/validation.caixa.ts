// utils/validation.ts
export const validateCaixaCode = (text: string): string => {
  const upperText = text.toUpperCase();

  if (!upperText.startsWith("CX")) {
    return 'O código deve começar com "CX"';
  }
  
  if (upperText.length > 8) {
    return "O código deve ter exatamente 8 caracteres";
  }
  
  if (!/^[A-Z0-9]*$/.test(upperText)) {
    return "Apenas letras e números são permitidos";
  }

  return "";
};