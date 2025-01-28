import React, { useEffect, useState } from "react";
import axios from "axios";

interface Cadastro {
  id: number;
  nome: string;
  email: string;
  cep: string;
}

const ListaCadastros: React.FC = () => {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCadastros = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cadastros");
        setCadastros(response.data);
      } catch (err) {
        setError("Erro ao carregar os cadastros. Tente novamente.");
        console.error(err);
      }
    };

    fetchCadastros();
  }, []);

  return (
    <div>
      <h2>Cadastros Enviados</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {cadastros.map((cadastro) => (
          <li key={cadastro.id}>
            {cadastro.nome} - {cadastro.email} - {cadastro.cep}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaCadastros;
