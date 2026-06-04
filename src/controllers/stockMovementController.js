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
    // Interceptando a nossa nova validação de estoque baseada em banco de dados
    if (error.message === "Insufficient_Stock") {
      return res.status(400).json({ error: 'Estoque insuficiente para realizar esta saída de materiais.' });
    }

    if (error.message === "Product_Not_Found" || error.code === "P2003") {
      return res.status(404).json({ error: 'O produto informado não foi encontrado.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao processar a movimentação de estoque.' });
  }
}

// GET /stock-movements/product/:productId
async function findByProductId(req, res) {
  const productId = parseInt(req.params.productId);
  
  if (isNaN(productId)) {
     return res.status(400).json({ error: "O parâmetro productId deve ser um número inteiro." });
  }

  try {
    const movements = await repo.findByProductId(productId);
    return res.status(200).json(movements);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar as movimentações do produto." });
  }
}
export default { index, show, store, findByProductId };
