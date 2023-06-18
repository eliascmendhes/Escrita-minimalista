const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/texts', async (req, res) => {
  const texts = await prisma.text.findMany();
  res.json(texts);
});

app.post('/texts', async (req, res) => {
  const text = await prisma.text.create({
    data: { content: req.body.content },
  });
  res.json(text);
});

app.delete('/texts', async (req, res) => {
  await prisma.text.deleteMany();
  res.json({ status: 'success', message: 'Todos os textos foram deletados' });
});

app.delete('/texts/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  await prisma.text.delete({
    where: {
      id: id
    }
  });

  res.json({ status: 'success', message: 'Texto deletado com sucesso' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
