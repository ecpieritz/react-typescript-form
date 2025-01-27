import { NextApiRequest, NextApiResponse } from "next";

const cadastros = [
  {
    nome: "João da Silva",
    email: "joao.silva@example.com",
    cep: "88040-600",
  },
  {
    nome: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    cep: "88040-700",
  },
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json(cadastros);
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
};
