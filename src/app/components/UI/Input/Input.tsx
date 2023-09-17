'use client';

import { InputProps } from '@/shared/types';
import { FC, forwardRef } from 'react';

const Input: FC<InputProps> = forwardRef(({label, input}, ref) => {
  return (
    <div className="input">
      <label htmlFor={input["id"]}>{label}</label>
      <input
        id={`task_${input["id"]}`}
        type={input["type"]}
        ref={ref}
      />
    </div>
  )
});

export default Input;