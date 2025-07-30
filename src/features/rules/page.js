import React from "react";
import { useParams } from "react-router-dom";
import RulesList from "./list"; // Ajusta el path

const RulesRulesPage = () => {
  const { id } = useParams();
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Reglas para el enlace corto</h2>
      <RulesList shortLinkId={id} />
    </div>
  );
};

export default RulesRulesPage;