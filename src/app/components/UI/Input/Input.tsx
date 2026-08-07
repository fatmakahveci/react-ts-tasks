'use client';

import { InputProps } from '@/shared/types';
import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, input }, ref) => {
  return (
    <div className="input">
      <label htmlFor={input.id}>{label}</label>
      <input
        id={input.id}
        type={input.type}
        placeholder={input.placeholder}
        ref={ref}
        maxLength={160}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
