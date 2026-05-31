import repo from "../repositories/stockMovementRepository.js";

// GET /stock-movements
async function index(req, res) {
  const movements = await repo.findAll();
  return res.status(200).json(movements);
}

// GET /stock-movements/:id
async function show(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });

  const movement = await repo.findById(id);
  if (!movement) return res.status(404).json({ error: `Movimentação com id ${id} não encontrada.` });

  return res.status(200).json(movement);
}

// POST /stock-movements
async function store(req, res) {
  const { type, quantity, notes, productId } = req.body;

  if (type !== "IN" && type !== "OUT") {
    return res.status(400).json({ error: 'O campo "type" deve ser "IN" ou "OUT".' });
  }

  if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
    return res.status(400).json({ error: 'O campo "quantity" deve ser um número inteiro maior que zero.' });
  }

  if (!productId || isNaN(parseInt(productId))) {
    return res.status(400).json({ error: 'O campo "productId" é obrigatório e deve ser um número.' });
  }

  try {
    const movement = await repo.create({
      type,
      quantity: parseInt(quantity),
      notes: notes ? notes.trim() : null,
      productId: parseInt(productId),
    });
    return res.status(201).json(movement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno. O produto informado pode não existir.' });
  }
}

// PUT /stock-movements/:id
async function update(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });

  const { type, quantity, notes, productId } = req.body;

  if (type === undefined && quantity === undefined && notes === undefined && productId === undefined) {
    return res.status(400).json({ error: "Informe ao menos um campo para atualizar." });
  }

  if (type !== undefined && type !== "IN" && type !== "OUT") {
    return res.status(400).json({ error: 'O campo "type" deve ser "IN" ou "OUT".' });
  }

  try {
    const updated = await repo.update(id, {
      ...(type !== undefined && { type }),
      ...(quantity !== undefined && { quantity: parseInt(quantity) }),
      ...(notes !== undefined && { notes: notes.trim() }),
      ...(productId !== undefined && { productId: parseInt(productId) }),
    });

    if (!updated) return res.status(404).json({ error: `Movimentação com id ${id} não encontrada.` });
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao atualizar movimentação.' });
  }
}

// DELETE /stock-movements/:id
async function destroy(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "O parâmetro id deve ser um número inteiro." });

  const removed = await repo.remove(id);
  if (!removed) return res.status(404).json({ error: `Movimentação com id ${id} não encontrada.` });

  return res.status(204).send();
}

export default { index, show, store, update, destroy };
