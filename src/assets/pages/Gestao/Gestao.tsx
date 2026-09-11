import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faTree,
  faUsers,
  faShieldHalved,
  faChartPie
} from "@fortawesome/free-solid-svg-icons";
import { SectionContent } from "../../components/SectionContent/SectionContent";
import "./Gestao.css";

// Definição das abas disponíveis
export type AbaGestao = "solicitacoes" | "arvores" | "usuarios" | "relatorios";

interface TabItem {
  id: AbaGestao;
  label: string;
  icon: typeof faClipboardList;
}

const TABS: TabItem[] = [
  {
    id: "solicitacoes",
    label: "Solicitações",
    icon: faClipboardList
  },
  {
    id: "arvores",
    label: "Árvores / Espécies",
    icon: faTree
  },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: faChartPie
  },
  {
    id: "usuarios",
    label: "Usuários",
    icon: faUsers
  }
];

export function Gestao() {
  // Estado para armazenar qual aba está ativa no momento
  const [abaAtiva, setAbaAtiva] = useState<AbaGestao>("solicitacoes");

  return (
    <SectionContent className="sectionGestao">
      <div className="gestaoContainer">

        {/* Cabeçalho do Painel */}
        <header className="gestaoHeader">
          <div className="gestaoTitulo">
            <div className="gestaoIconeHeader">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <div>
              <h2>Painel de Gestão</h2>
              <p>Gerencie as solicitações, o catálogo de mudas e o acesso dos usuários.</p>
            </div>
          </div>

          {/* MENU DE 3 ABAS NO TOPO */}
          <nav className="gestaoAbasNav" aria-label="Abas de Gestão">
            {TABS.map((tab) => {
              const isActive = abaAtiva === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`gestaoAbaBtn ${isActive ? "active" : ""}`}
                  onClick={() => setAbaAtiva(tab.id)}
                  aria-selected={isActive}
                  role="tab"
                >
                  <FontAwesomeIcon icon={tab.icon} className="gestaoAbaIcone" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* CONTEÚDO DAS ABAS */}
        <main className="gestaoConteudoArea">
          {/* Aba 1: Solicitações */}
          {abaAtiva === "solicitacoes" && (
            <section className="gestaoAbaCard" role="tabpanel">
              <div className="cardHeaderAba">
                <h3>Gerenciar Solicitações de Plantio</h3>
                <span className="badgeAba">Aba 1</span>
              </div>
              <p>
                Visualize e aprove solicitações de plantio enviadas pelos cidadãos,
                agende datas e atualize o status dos pedidos.
              </p>
              <p>
                Visualize e aprove solicitações de plantio enviadas pelos cidadãos,
                agende datas e atualize o status dos pedidos.
              </p>
              <p>
                Visualize e aprove solicitações de plantio enviadas pelos cidadãos,
                agende datas e atualize o status dos pedidos.
              </p>
              <p>
                Visualize e aprove solicitações de plantio enviadas pelos cidadãos,
                agende datas e atualize o status dos pedidos.
              </p>
              <p>
                Visualize e aprove solicitações de plantio enviadas pelos cidadãos,
                agende datas e atualize o status dos pedidos.
              </p>
              
              
              {/* Em breve: Tabela ou lista de solicitações */}
            </section>
          )}

          {/* Aba 2: Árvores / Espécies */}
          {abaAtiva === "arvores" && (
            <section className="gestaoAbaCard" role="tabpanel">
              <div className="cardHeaderAba">
                <h3>Catálogo de Árvores e Mudas</h3>
                <span className="badgeAba">Aba 2</span>
              </div>
              <p>
                Cadastre novas espécies, atualize a quantidade de estoque de mudas e
                defina quais árvores estão ativas para solicitação.
              </p>
              {/* Em breve: Listagem e cadastro de árvores */}
            </section>
          )}

          {/* Aba 3: Relatórios */}
          {abaAtiva === "relatorios" && (
            <section className="gestaoAbaCard" role="tabpanel">
              <div className="cardHeaderAba">
                <h3>Relatórios</h3>
                <span className="badgeAba">Aba 3</span>
              </div>
              <p>
                Administre os papéis dos usuários (Cidadão, Funcionário, Admin Local, Global)
                e vincule funcionários às respectivas cidades.
              </p>
              {/* Em breve: Gestão de permissões e cidades */}
            </section>
          )}

          {/* Aba 4: Usuários e Cidades */}
          {abaAtiva === "usuarios" && (
            <section className="gestaoAbaCard" role="tabpanel">
              <div className="cardHeaderAba">
                <h3>Gestão de Usuários e Permissões</h3>
                <span className="badgeAba">Aba 4</span>
              </div>
              <p>
                Administre os papéis dos usuários (Cidadão, Funcionário, Admin Local, Global)
                e vincule funcionários às respectivas cidades.
              </p>
              {/* Em breve: Gestão de permissões e cidades */}
            </section>
          )}
        </main>

      </div>
    </SectionContent>
  );
}

export default Gestao;
