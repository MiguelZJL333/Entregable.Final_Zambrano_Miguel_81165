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

/*----------------------------POST--------------------------------*/
///Post - Crear un nuevo producto
productsRouter.post('/', addProducts);


/*---------------------------PUT--------------------------------*/
// Put - Actualizar un producto existente
productsRouter.put('/:pid', updateProduct);

/*----------------------------DELETE--------------------------------*/
// Delete - Eliminar un producto
productsRouter.delete('/:pid', deleteProduct);



export default productsRouter;