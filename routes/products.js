// const { Product } = require('../models/product');
// const express = require('express');
// const { Category } = require('../models/category');
// const router = express.Router();
// const mongoose = require('mongoose');
// const multer = require('multer');
// const jwt = require('jsonwebtoken');  // Add this for JWT handling

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];
//         let uploadError = new Error('invalid image type');

//         if (isValid) {
//             uploadError = null;
//         }
//         cb(uploadError, 'public/uploads');
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype];
//         cb(null, `${fileName}-${Date.now()}.${extension}`);
//     }
// });

// const uploadOptions = multer({ storage: storage });

// // JWT Middleware to verify the token
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];  // Get the token from headers
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized, no token provided' });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized, token invalid' });
//         }
//         req.user = decoded;  // Attach decoded user data to the request object
//         next();
//     });
// };

// // Routes

// router.get(`/`, async (req, res) => {
//     let filter = {};
//     if (req.query.categories) {
//         filter = { category: req.query.categories.split(',') };
//     }

//     const productList = await Product.find(filter).populate('category');

//     if (!productList) {
//         res.status(500).json({ success: false });
//     }
//     res.send(productList);
// });

// router.get(`/:id`, async (req, res) => {
//     const product = await Product.findById(req.params.id).populate('category');

//     if (!product) {
//         res.status(500).json({ success: false });
//     }
//     res.send(product);
// });

// // Apply verifyToken middleware to the following routes

// router.post('/', verifyToken, uploadOptions.single('image'), async (req, res) => {
//     const category = await Category.findById(req.body.category);
//     if (!category) return res.status(400).send('Invalid Category');

//     const file = req.file;
//     if (!file) return res.status(400).send('No image in the request');

//     const fileName = file.filename;
//     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//     let product = new Product({
//         name: req.body.name,
//         description: req.body.description,
//         richDescription: req.body.richDescription,
//         image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
//         brand: req.body.brand,
//         price: req.body.price,
//         category: req.body.category,
//         countInStock: req.body.countInStock,
//         rating: req.body.rating,
//         numReviews: req.body.numReviews,
//         isFeatured: req.body.isFeatured,
//     });

//     product = await product.save();

//     if (!product) 
//         return res.status(500).send('The product cannot be created');

//     res.send(product);
// });

// router.put('/:id', verifyToken, async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send('Invalid Product Id');
//     }
//     const category = await Category.findById(req.body.category);
//     if (!category) return res.status(400).send('Invalid Category');

//     const product = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             description: req.body.description,
//             richDescription: req.body.richDescription,
//             image: req.body.image,
//             brand: req.body.brand,
//             price: req.body.price,
//             category: req.body.category,
//             countInStock: req.body.countInStock,
//             rating: req.body.rating,
//             numReviews: req.body.numReviews,
//             isFeatured: req.body.isFeatured,
//         },
//         { new: true }
//     );

//     if (!product)
//         return res.status(500).send('The product cannot be updated!');

//     res.send(product);
// });

// router.delete('/:id', verifyToken, (req, res) => {
//     Product.findByIdAndRemove(req.params.id).then(product => {
//         if (product) {
//             return res.status(200).json({ success: true, message: 'The product is deleted!' });
//         } else {
//             return res.status(404).json({ success: false, message: "Product not found!" });
//         }
//     }).catch(err => {
//         return res.status(500).json({ success: false, error: err });
//     });
// });

// router.get(`/get/count`, async (req, res) => {
//     const productCount = await Product.countDocuments((count) => count);

//     if (!productCount) {
//         res.status(500).json({ success: false });
//     }
//     res.send({ productCount });
// });

// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.params.count ? req.params.count : 0;
//     const products = await Product.find({ isFeatured: true }).limit(+count);

//     if (!products) {
//         res.status(500).json({ success: false });
//     }
//     res.send(products);
// });

// router.put(
//     '/gallery-images/:id',
//     verifyToken,
//     uploadOptions.array('images', 10),
//     async (req, res) => {
//         if (!mongoose.isValidObjectId(req.params.id)) {
//             return res.status(400).send('Invalid Product Id');
//         }
//         const files = req.files;
//         let imagesPaths = [];
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

//         if (files) {
//             files.map(file => {
//                 imagesPaths.push(`${basePath}${file.filename}`);
//             });
//         }

//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: imagesPaths
//             },
//             { new: true }
//         );

//         if (!product)
//             return res.status(500).send('The gallery cannot be updated!');

//         res.send(product);
//     }
// );

// module.exports = router;


const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
// const jwt = require('jsonwebtoken');  // Add this for JWT handling

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// JWT Middleware to verify the token
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];  // Get the token from headers
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized, no token provided' });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized, token invalid' });
//         }
//         req.user = decoded;  // Attach decoded user data to the request object
//         next();
//     });
// };

// Routes

router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
});

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false });
    } 
    res.send(product);
});

// Apply verifyToken middleware to the following routes
router.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    console.log(req.body);  // Log the form data
    console.log(req.file);  // Log the uploaded file
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
        name: req.body.name, 
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,  // Save image URL
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) 
        return res.status(500).send('The product cannot be created');

    res.send(product);
});


router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    // Check if the request includes a file
    const file = req.file;
    let imagePath;
    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagePath = `${basePath}${fileName}`;  // Update with new image URL
    } else {
        imagePath = req.body.image;  // If no new image, keep the old one
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagePath,  // Use updated or existing image
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    );

    if (!product) {
        return res.status(500).send('The product cannot be updated!');
    }

    res.send(product);
});

router.delete('/:id',(req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'The product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({ productCount });
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

router.put(
    '/gallery-images/:id',
    // verifyToken,
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('The gallery cannot be updated!');

        res.send(product);
    }
);

module.exports = router;
