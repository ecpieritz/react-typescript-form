import React from "react";
import { useCadastroContext } from "./CadastroContext.tsx";

interface ListaCadastrosProps {
  onEdit: (cadastro: {
    id: number;
    nome: string;
    email: string;
    cep: string;
  }) => void;
}

const ListaCadastros: React.FC<ListaCadastrosProps> = ({ onEdit }) => {
  const { cadastros, atualizarCadastros } = useCadastroContext();

  const handleDelete = async (id: number, nome: string) => {
    const confirmDelete = window.confirm(`Você tem certeza que deseja excluir este cadastro? ${nome}`);
    
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:5000/cadastros/${id}`, {
          method: "DELETE",
        });
        atualizarCadastros();
      } catch (error) {
        console.error("Erro ao deletar cadastro:", error);
      }
    }
  };

  return (
    <div className="registrationList">
      <h2 className="registrationList__title">Lista de Cadastros</h2>

      {cadastros.length === 0 ? (
        <div className="registrationList__info">
          <h4>
            Nenhuma Pessoa Cadastrada no momento. <br />
          </h4>
          <p>
            Assim que houver cadastros, eles serão exibidos aqui. <br />
            Adicione uma nova pessoa acima para começar.
          </p>
        </div>
      ) : (
        <table className="registrationList__table">
          <thead className="registrationList__table__thead">
            <tr>
              <th>Nome da Pessoa</th>
              <th>E-mail</th>
              <th>CEP</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="registrationList__table__tbody">
            {cadastros.map((cadastro) => (
              <tr key={cadastro.id}>
                <td className="table-name" data-label="Nome da Pessoa">
                  {cadastro.nome}
                </td>
                <td className="table-email" data-label="E-mail">
                  {cadastro.email}
                </td>
                <td className="table-registration" data-label="CEP">
                  {cadastro.cep}
                </td>
                <td className="table-actions" data-label="Ações">
                  <button onClick={() => onEdit(cadastro)}>Editar</button>
                  <button onClick={() => handleDelete(cadastro.id!, cadastro.nome)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaCadastros;
