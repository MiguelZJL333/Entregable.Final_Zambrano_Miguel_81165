import ProductModel from '../models/product.model.js';
import {errorHandler} from '../util/httpErrors.js';

export const getAllProducts = async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            //const products = await ProductModel.find().lean();
            //const products = await ProductModel.paginate( {}, {limit: 10, page: 1, lean: true} );
            const products = await ProductModel.paginate( {}, {limit: limit, page: page, lean: true} );

            res.status(200).json({status: 'success', data: products});
        } catch (error) {
            next(error);
            //res.status(500).json({status: 'error', message: 'Error al obtener los productos'});
        }
};

export const addProducts = async (req, res, next) => {
    try {
        //const { title, price, stock } = req.body; //se estaba usando antes
        //const newProduct = await ProductModel.create({ title, price, stock, });

        //Lo ideal es enviar todo el objeto producto en el body por la librería zod

        const newProduct = await ProductModel.create(req.body);
        
        res.status(201).json({ status: 'success', payload: newProduct });

    } catch (error) {
        next(error);
        //res.status(500).json({ status: 'error', message: 'Error al crear nuevo producto' });
    }
};

export const updateProduct = async (req, res) => {
        try {

        const pid = req.params.pid;
        const updateData = req.body;
        const updatedProduct = await ProductModel.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true });
        if (!updatedProduct) errorHandler('Producto no encontrado', 404);
        //if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
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
        //if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        
        res.status(200).json({ status: 'success', payload: deletedProduct });
    
    } catch (error) {
        next(error);
        //res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
    }
};




