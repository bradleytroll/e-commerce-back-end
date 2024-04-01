const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Find all tags with their associated Product data
router.get('/', (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        through: ProductTag,
        as: 'products',
      },
    ],
  })
  .then((tags) => res.status(200).json(tags))
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
});

// Find a single tag by its `id` with its associated Product data
router.get('/:id', (req, res) => {
  Tag.findByPk(req.params.id, {
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        through: ProductTag,
        as: 'products',
      },
    ],
  })
  .then((tag) => {
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.status(200).json(tag);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
});

// Create a new tag
router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name,
  })
  .then((tag) => res.status(200).json(tag))
  .catch((err) => {
    console.error(err);
    res.status(400).json(err);
  });
});

// Update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    if (!tag[0]) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.status(200).json({ message: 'Tag updated successfully' });
  })
  .catch((err) => {
    console.error(err);
    res.status(400).json(err);
  });
});

// Delete a tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
});

module.exports = router;
