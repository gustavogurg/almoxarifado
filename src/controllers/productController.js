import repo from "../repositories/productRepository.js";

// GET /products
async function index(req, res) {
  const products = await repo.findAll();
  return res.status(200).json(products);
}

// GET /products/:id
async function show(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });
  }

  const product = await repo.findById(id);

  if (!product) {
    return res.status(404).json({ error: `Produto com id ${id} não encontrado.` });
  }

  return res.status(200).json(product);
}

// POST /products
async function store(req, res) {
  const { name, description, unity, currentStock, minimumStock, categoryId, supplierId } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
  }

  if (!unity || typeof unity !== "string" || unity.trim() === "") {
    return res.status(400).json({ error: 'O campo "unity" é obrigatório.' });
  }

  if (!categoryId || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ error: 'O campo "categoryId" é obrigatório e deve ser um número.' });
  }
  
  if (!supplierId || isNaN(parseInt(supplierId))) {
    return res.status(400).json({ error: 'O campo "supplierId" é obrigatório e deve ser um número.' });
  }

  try {
    const product = await repo.create({
      name: name.trim(),
      description: description ? description.trim() : null, 
      unity: unity.trim(),
      currentStock: currentStock !== undefined ? parseInt(currentStock) : 0, 
      minimumStock: minimumStock !== undefined ? parseInt(minimumStock) : 0, 
      categoryId: parseInt(categoryId),
      supplierId: parseInt(supplierId),
    });

    // retorna product
    return res.status(201).json(product);
  } catch (error) { // <-- Catch que faltava!
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
}

// PUT /products/:id
async function update(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });
  }

  const { name, description, unity, currentStock, minimumStock, categoryId, supplierId } = req.body;

  if (
    name === undefined && 
    description === undefined && 
    unity === undefined &&
    currentStock === undefined &&
    minimumStock === undefined &&
    categoryId === undefined &&
    supplierId === undefined
  ) {
    return res.status(400).json({ error: "Informe ao menos um campo para atualizar." });
  }

  try {
    const updated = await repo.update(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(unity !== undefined && { unity: unity.trim() }),
      ...(currentStock !== undefined && { currentStock: parseInt(currentStock) }),
      ...(minimumStock !== undefined && { minimumStock: parseInt(minimumStock) }),
      ...(categoryId !== undefined && { categoryId: parseInt(categoryId) }),
      ...(supplierId !== undefined && { supplierId: parseInt(supplierId) }),
    });

    if (!updated) {
      return res.status(404).json({ error: `Produto com id ${id} não encontrado.` });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
  }
}

// DELETE /products/:id
async function destroy(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });
  }

  const removed = await repo.remove(id);

  if (!removed) {
    return res.status(404).json({ error: `Produto com id ${id} não encontrado.` });
  }

  return res.status(204).send();
}

export default { index, show, store, update, destroy };