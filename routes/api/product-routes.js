const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => { 
  try {
    const productData = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
          through: ProductTag,
          as: 'tags',
        },
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});


// router.get('/', (req, res) => {
//   Product.findAll({
//     include: [
//       {
//         model: Category,
//         attributes: ['id', 'category_name'],
//       },
//       {
//         model: Tag,
//         attributes: ['id', 'tag_name'],
//         through: ProductTag,
//         as: 'tags',
//       },
//     ],
//   })
//   .then((products) => res.status(200).json(products))
//   .catch((err) => {
//     console.error(err);
//     res.status(500).json(err);
//   });
// });

// Get a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
          through: ProductTag,
          as: 'tags',
        },
      ],
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
}
);





// router.get('/:id', (req, res) => {
//   Product.findByPk(req.params.id, {
//     include: [
//       {
//         model: Category,
//         attributes: ['id', 'category_name'],
//       },
//       {
//         model: Tag,
//         attributes: ['id', 'tag_name'],
//         through: ProductTag,
//         as: 'tags',
//       },
//     ],
//   })
//   .then((product) => {
//     if (!product) {
//       res.status(404).json({ message: 'No product found with this id' });
//       return;
//     }
//     res.status(200).json(product);
//   })
//   .catch((err) => {
//     console.error(err);
//     res.status(500).json(err);
//   });
// });

// Create a new product
router.post('/', (req, res) => {
  Product.create(req.body)
  .then((product) => {
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr)
      .then(() => res.status(200).json(product));
    }
    res.status(200).json(product);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
}
);


// router.post('/', (req, res) => {
//   Product.create(req.body)
//     .then((product) => {
//       if (req.body.tagIds && req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr)
//           .then(() => res.status(200).json(product));
//       }
//       res.status(200).json(product);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// Update a product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then((productTags) => {
    const existingTagIds = productTags.map(({ tag_id }) => tag_id);
    const newTagIds = req.body.tagIds.filter((tag_id) => !existingTagIds.includes(tag_id)).map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id,
      };
    });
    const tagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);
    return Promise.all([
      ProductTag.destroy({ where: { id: tagsToRemove } }),
      ProductTag.bulkCreate(newTagIds),
    ]);
  })
  .then(() => res.status(200).json({ message: 'Product updated successfully' }))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
}
);





// router.put('/:id', (req, res) => {
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//   .then(() => {
//     return ProductTag.findAll({ where: { product_id: req.params.id } });
//   })
//   .then((productTags) => {
//     const existingTagIds = productTags.map(({ tag_id }) => tag_id);
//     const newTagIds = req.body.tagIds.filter(tag_id => !existingTagIds.includes(tag_id));
//     const newProductTags = newTagIds.map(tag_id => {
//       return {
//         product_id: req.params.id,
//         tag_id,
//       };
//     });

//     const tagsToRemove = productTags
//       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//       .map(({ id }) => id);

//     return Promise.all([
//       ProductTag.destroy({ where: { id: tagsToRemove } }),
//       ProductTag.bulkCreate(newProductTags),
//     ]);
//   })
//   .then(() => res.status(200).json({ message: 'Product updated successfully' }))
//   .catch((err) => {
//     console.log(err);
//     res.status(400).json(err);
//   });
// });

// Delete a product
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {
    if (!product) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.status(200).json({ message: 'Product was deleted successfully' });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
}
);



// router.delete('/:id', (req, res) => {
//   Product.destroy({
//     where: {
//       id: req.params.id,
//     },
//   })
//   .then((product) => {
//     if (!product) {
//       res.status(404).json({ message: 'No product found with this id' });
//       return;
//     }
//     res.status(200).json({ message: 'Product was deleted successfully' });
//   })
//   .catch((err) => {
//     console.error(err);
//     res.status(500).json(err);
//   });
// });

module.exports = router;
