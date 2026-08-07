import type { ReactNode } from 'react';
import './Section.css';

type SectionProps = { children: ReactNode };

const Section = ({ children }: SectionProps) => (
  <section className="section">{children}</section>
);

export default Section;
