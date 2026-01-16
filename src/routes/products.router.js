import express from 'express';
import ProductModel from '../models/product.model.js';
import { getAllProducts, addProducts, updateProduct, deleteProduct } from '../controllers/products.controller.js';

const productsRouter = express.Router();
/*----------------------------GET--------------------------------*/
// Obtener todos los productos
productsRouter.get('/', getAllProducts);

// Obtener un producto por ID
productsRouter.get('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid).lean();
        
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        next(error);
    }
});
// productsRouter.get('/', async (req, res) => {
//     try {
//         const products = await ProductModel.find().lean();
//         res.status(200).json({status: 'success', data: products});
//     } catch (error) {
//         res.status(500).json({status: 'error', message: 'Error al obtener los productos'});
//     }
// });


/*----------------------------POST--------------------------------*/
///Post - Crear un nuevo producto
productsRouter.post('/', addProducts);

/*--------------------------Original------------------------*/
// productsRouter.post('/', async (req, res) => {
//     try {
//         const { title, price, stock } = req.body;
//         const newProduct = await ProductModel.create({ title, price, stock });
//         res.status(201).json({ status: 'success', payload: newProduct });

//     } catch (error) {
//         res.status(500).json({ status: 'error', message: 'Error al crear nuevo producto' });
//     }
// });


/*----------------------------PUT--------------------------------*/
// Put - Actualizar un producto existente
productsRouter.put('/:pid', updateProduct);

/*--------------------------Original------------------------*/
// productsRouter.put('/:pid', async (req, res) => {
//     try {

//         const pid = req.params.pid;
//         const updateData = req.body;
//         const updatedProduct = await ProductModel.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true });
//         if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
//         res.status(200).json({ status: 'success', payload: updatedProduct });

//     } catch (error) {
//         res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
//     }
// })

/*----------------------------PUT--------------------------------*/
// Delete - Eliminar un producto
productsRouter.delete('/:pid', deleteProduct);

/*--------------------------Original------------------------*/
// productsRouter.delete('/:pid', async (req, res) => {
//     try {
//         const pid = req.params.pid;

//         const deletedProduct = await ProductModel.findByIdAndDelete(pid);

//         if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        
//         res.status(200).json({ status: 'success', payload: deletedProduct });
//     } catch (error) {
//         res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
//     }
// })

export default productsRouter;