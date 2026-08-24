import './CardInfo.css';
import type { ReactNode } from "react";

interface CardProps {
  icon: ReactNode;
  number: string;
  title: string;
  text: string;
}

export function CardInfo({ icon, number, title, text }: CardProps) {
  return (
    <div className="cardInfo p-4 rounded-4">
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="icon rounded-circle p-2">
          {icon}
        </span>

        <span className="number align-self-start">
          {number}
        </span>
      </div>

      <div className="cardText flex-grow-1">
        <h3>{title}</h3>
        {text}
      </div>

    </div>
  );
}