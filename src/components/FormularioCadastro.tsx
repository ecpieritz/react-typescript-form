import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCadastroContext } from "./CadastroContext.tsx";

interface FormData {
  id?: number;
  nome: string;
  email: string;
  cep: string;
}

interface FormularioCadastroProps {
  cadastroEditado?: FormData;
  onEditComplete?: () => void;
}

const FormularioCadastro: React.FC<FormularioCadastroProps> = ({ cadastroEditado, onEditComplete }) => {
  const { cadastros, atualizarCadastros } = useCadastroContext();
  const [formData, setFormData] = useState<FormData>({ nome: "", email: "", cep: "" });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cadastroEditado) {
      setFormData(cadastroEditado);
    }
  }, [cadastroEditado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue.replace(/(\d{5})(\d{1,3})/, "$1-$2");
      setFormData({ ...formData, [name]: formattedValue });
      setError(null);
      return;
    }

    if (name === "nome" && /\d/.test(value)) {
      setError("O nome não pode conter números.");
      return;
    }

    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const verificarDuplicidade = () => {
    const nomeExiste = cadastros.some(
      (cadastro) => cadastro.nome.toLowerCase() === formData.nome.toLowerCase() && cadastro.id !== formData.id
    );
    const emailExiste = cadastros.some(
      (cadastro) => cadastro.email.toLowerCase() === formData.email.toLowerCase() && cadastro.id !== formData.id
    );

    if (nomeExiste) {
      setError("Já existe um cadastro com este nome.");
      return true;
    }

    if (emailExiste) {
      setError("Já existe um cadastro com este e-mail.");
      return true;
    }

    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nome || !formData.email || !formData.cep) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    if (!/^\d{5}-\d{3}$/.test(formData.cep)) {
      setError("Por favor, insira um CEP válido no formato 00000-000.");
      return;
    }

    if (verificarDuplicidade()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.id) {
        await axios.put(`http://localhost:5000/cadastros/${formData.id}`, formData);
        setSuccessMessage("Cadastro atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:5000/cadastros", formData);
        setSuccessMessage("Cadastro enviado com sucesso!");
      }

      atualizarCadastros(); // Atualiza a lista após adicionar ou editar
      if (onEditComplete) onEditComplete();
      setFormData({ nome: "", email: "", cep: "" });

      // Adicionando o timer para remover a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError("Erro ao enviar o cadastro. Tente novamente.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registrationForm">
      <h1 className="registrationForm__title">Plataforma de Cadastro</h1>
      <div className="registrationForm__form">
        <h3>Cadastrar Pessoa</h3>
        <p>Digite abaixo os dados da pessoa que deseja registrar.</p>
        <form onSubmit={handleSubmit}>
          <div className="registrationForm__form__input name">
            <label>
              Nome
            </label>
              <input type="text" name="nome" placeholder="Ex.: Maria da Silva" value={formData.nome} onChange={handleInputChange} required />
          </div>
          <div className="registrationForm__form__input email">
            <label>
              Email
            </label>
              <input type="email" name="email" placeholder="ex.: email@gmail.com" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="registrationForm__form__input cep">
            <label>
              CEP
            </label>
              <input type="text" name="cep" placeholder="Ex.: 00000-000" value={formData.cep} onChange={handleInputChange} maxLength={9} required />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Validando..." : formData.id ? "Atualizar" : "Cadastrar"}
          </button>
        </form>
        <div className="messages">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormularioCadastro;
