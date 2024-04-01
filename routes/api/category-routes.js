const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories
router.get('/', (req, res) => {
  Category.findAll({
    include: [{ model: Product }],
  })
  .then((categoryData) => {
    res.status(200).json(categoryData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

// GET one category by its `id` value
router.get('/:id', (req, res) => {
  Category.findByPk(req.params.id, {
    include: [{ model: Product }],
  })
  .then((categoryData) => {
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id.' });
      return;
    }
    res.status(200).json(categoryData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

// POST a new category
router.post('/', (req, res) => {
  Category.create(req.body)
  .then((categoryData) => {
    res.status(200).json(categoryData);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

// PUT to update a category by its `id` value
router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((categoryData) => {
    if (!categoryData[0]) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

// DELETE a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((categoryData) => {
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
