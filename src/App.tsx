import React, { useState } from "react";
import "./App.css";
import { companies as initialCompanies } from "./data/mockData";
import { Company } from "./types/Company";
import TableView from "./views/TableView";

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const addCompany = (newCompany: Company): void => {
    setCompanies((prev) => [...prev, newCompany]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>📈 Company Radar</h1>
          <p className="header-subtitle">
            Radar de compra: te avisa cuando una acción alcanza tu precio
            objetivo
          </p>
        </div>
      </header>

      <main className="main-content">
        <TableView companies={companies} onAddCompany={addCompany} />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>
            {companies.length} empresas en el radar • Las empresas en rojo están
            cerca de tu precio objetivo • Verde = espera, Rojo = considera
            comprar
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
