import ProductModel from '../models/product.model.js';
import {errorHandler} from '../util/httpErrors.js';

export const getAllProducts = async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const products = await ProductModel.paginate( {}, {limit: limit, page: page, lean: true} );

            res.status(200).json({status: 'success', data: products});
        } catch (error) {
            next(error);
        }
};

export const addProducts = async (req, res, next) => {
    try {

        const newProduct = await ProductModel.create(req.body);
        
        res.status(201).json({ status: 'success', payload: newProduct });

    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res) => {
        try {

        const pid = req.params.pid;
        const updateData = req.body;
        const updatedProduct = await ProductModel.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true });
        if (!updatedProduct) errorHandler('Producto no encontrado', 404);

        res.status(200).json({ status: 'success', payload: updatedProduct });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = async (req, res, next) => {
        try {

        const pid = req.params.pid;
        const deletedProduct = await ProductModel.findByIdAndDelete(pid);
        if (!deletedProduct) errorHandler('Producto no encontrado', 404);
        
        res.status(200).json({ status: 'success', payload: deletedProduct });
    
    } catch (error) {
        next(error);
    }
};




