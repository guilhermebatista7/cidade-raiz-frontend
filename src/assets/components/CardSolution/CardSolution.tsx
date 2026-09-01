import type { ReactNode } from "react";
import './CardSolution.css';

// Definimos a estrutura dos dados que o componente vai receber
export interface SolutionItem {
  id: string;
  title: string;
  icon?: ReactNode;
  content: string;
}

interface CardSolutionProps {
  solutions: SolutionItem[];
}

export function CardSolution({ solutions }: CardSolutionProps) {
  return (
    <div className="solutionsContainer">
      {/* 1. Container dos Botões: Flexbox para deixar lado a lado */}
      <div className="d-flex justify-content-center flex-row flex-wrap gap-2 mb-3">
        {solutions.map((solution) => (
          <a
            key={`btn-${solution.id}`}
            className="btn btnIcon"
            data-bs-toggle="collapse"
            href={`#collapse-${solution.id}`}
            role="button"
            aria-expanded="false"
            aria-controls={`collapse-${solution.id}`}
            title={solution.title}
          >
            {solution.icon}
          </a>
        ))}
      </div>

      {/* 2. Container dos Conteúdos: Renderiza as abas de colapso */}
      <div>
        {solutions.map((solution) => (
          <div
            key={`content-${solution.id}`}
            className="collapse mb-2"
            id={`collapse-${solution.id}`}
          >
            <div className="card card-body">
              <strong><span className="iconText">{solution.icon}</span> {solution.title}</strong>
              <br/>
              {solution.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}