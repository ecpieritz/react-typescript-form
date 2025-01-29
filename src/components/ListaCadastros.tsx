import React from "react";
import { useCadastroContext } from "./CadastroContext.tsx";

interface ListaCadastrosProps {
  onEdit: (cadastro: { id: number; nome: string; email: string; cep: string }) => void;
}

const ListaCadastros: React.FC<ListaCadastrosProps> = ({ onEdit }) => {
  const { cadastros, atualizarCadastros } = useCadastroContext();

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/cadastros/${id}`, { method: "DELETE" });
      atualizarCadastros();
    } catch (error) {
      console.error("Erro ao deletar cadastro:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Cadastros</h2>

      {cadastros.length === 0 ? (
        <p style={{ color: "#555", fontStyle: "italic" }}>
          Nenhuma Pessoa Cadastrada no momento. <br />
          Assim que houver cadastros, eles serão exibidos aqui. <br />
          Adicione uma nova pessoa acima para começar.
        </p>
      ) : (
        <ul>
          {cadastros.map((cadastro) => (
            <li key={cadastro.id}>
              {cadastro.nome} - {cadastro.email} - {cadastro.cep}
              <button onClick={() => onEdit(cadastro)}>Editar</button>
              <button onClick={() => handleDelete(cadastro.id!)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaCadastros;
