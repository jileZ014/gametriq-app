
import React from 'react';

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  const validations = [
    { test: password.length >= 8, text: "At least 8 characters" },
    { test: /[A-Z]/.test(password), text: "One uppercase letter" },
    { test: /[a-z]/.test(password), text: "One lowercase letter" },
    { test: /[0-9]/.test(password), text: "One number" }
  ];

  return (
    <div className="text-xs text-gray-400 mt-1 space-y-1">
      {validations.map((validation, index) => (
        <div 
          key={index}
          className={`flex items-center gap-2 ${
            validation.test ? 'text-green-400' : 'text-gray-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            validation.test ? 'bg-green-400' : 'bg-gray-400'
          }`} />
          {validation.text}
        </div>
      ))}
    </div>
  );
};

export default PasswordValidation;
