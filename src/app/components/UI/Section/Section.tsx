'use client';

import { ChildrenProps } from '@/shared/types';
import { FC } from 'react';
import './Section.css';

const Section: FC<ChildrenProps> = ({ children }): JSX.Element => {
  return (
    <section className="section">
      {children}
    </section>
  );
};

export default Section;