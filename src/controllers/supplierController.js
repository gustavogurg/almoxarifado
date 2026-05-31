import repo from "../repositories/supplierRepository.js";

// GET /suppliers
async function index(req, res) {
  const suppliers = await repo.findAll();
  return res.status(200).json(suppliers);
}

// GET /suppliers/:id
async function show(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });

  const supplier = await repo.findById(id);
  if (!supplier) return res.status(404).json({ error: `Fornecedor com id ${id} não encontrado.` });

  return res.status(200).json(supplier);
}

// POST /suppliers
async function store(req, res) {
  const { name, cnpj, email, phone } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: 'O campo "name" é obrigatório e deve ser texto.' });
  }

  if (!cnpj || typeof cnpj !== "string") {
    return res.status(400).json({ error: 'O campo "cnpj" é obrigatório e deve ser texto.' });
  }

  try {
    const supplier = await repo.create({
      name: name.trim(),
      cnpj: cnpj.trim(),
      email: email ? email.trim() : null,
      phone: phone ? phone.trim() : null,
    });
    return res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno. O CNPJ já pode estar cadastrado.' });
  }
}

// PUT /suppliers/:id
async function update(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });

  const { name, cnpj, email, phone } = req.body;

  if (name === undefined && cnpj === undefined && email === undefined && phone === undefined) {
    return res.status(400).json({ error: "Informe ao menos um campo para atualizar." });
  }

  try {
    const updated = await repo.update(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(cnpj !== undefined && { cnpj: cnpj.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
    });

    if (!updated) return res.status(404).json({ error: `Fornecedor com id ${id} não encontrado.` });
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao atualizar fornecedor. O CNPJ pode já estar em uso.' });
  }
}

// DELETE /suppliers/:id
async function destroy(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });

  const removed = await repo.remove(id);
  if (!removed) return res.status(404).json({ error: `Fornecedor com id ${id} não encontrado.` });

  return res.status(204).send();
}

export default { index, show, store, update, destroy };
