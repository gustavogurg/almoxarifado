import repo from "../repositories/productRepository.js";

// GET /categories
async function index(req, res) {
  const categories = await repo.findAll();
  return res.status(200).json(categories);
}

// GET /categories/:id
async function show(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });
  }

  const category = await repo.findById(id);

  if (!category) {
    return res.status(404).json({ error: `Categoria com id ${id} não encontrada.` });
  }

  return res.status(200).json(category);
}

// POST /categories
async function store(req, res) {
  const { name, description } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
  }

  if (!description || typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ error: 'O campo "description" é obrigatório.' });
  }


  const category = await repo.create({
    name:        name.trim(),
    description: description.trim(),

  });

  return res.status(201).json(category);
}

// PUT /categories/:id
async function update(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });
  }

  const { name, description} = req.body;

  if (name === undefined && description === undefined) {
    return res.status(400).json({ error: "Informe ao menos um campo para atualizar." });
  }


  const updated = await repo.update(id, {
    ...(name        !== undefined && { name: name.trim() }),
    ...(description !== undefined && { description: description.trim() }),
  });

  if (!updated) {
    return res.status(404).json({ error: `Categoria com id ${id} não encontrada.` });
  }

  return res.status(200).json(updated);
}

// DELETE /categories/:id
async function destroy(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });
  }

  const removed = await repo.remove(id);

  if (!removed) {
    return res.status(404).json({ error: `Categoria com id ${id} não encontrada.` });
  }

  return res.status(204).send();
}

export default { index, show, store, update, destroy };