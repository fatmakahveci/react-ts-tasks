'use client';

import './Section.css';

const Section = (props: any): JSX.Element => {
  return (
    <section className="section">{props.children}</section>
  );
};

export default Section;