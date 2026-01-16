import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import {errorHandler} from '../util/httpErrors.js';


const cartRouter = express.Router();

// Crear un nuevo carrito
cartRouter.post('/', async (req, res, next) => {
    try {
        const newCart = await Cart.create({});
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        next(error);
    }
});

cartRouter.post('/:cid/product/:pid', async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body || {};

        // Verificar que el producto exista
        const product = await Product.findById(pid);
        if (!product) {
            return next(errorHandler('Producto no encontrado', 404));
        }

        // Verificar que la cantidad sea válida
        const quantityToAdd = quantity || 1;
        if (quantityToAdd < 1) {
            return next(errorHandler('La cantidad debe ser mayor a 0', 400));
        }

        // Verificar que haya stock disponible
        if (product.stock < quantityToAdd) {
            return next(errorHandler(`Stock insuficiente. Disponibles: ${product.stock}`, 400));
        }

        // Verificar que el carrito exista
        const cart = await Cart.findById(cid);
        if (!cart) {
            return next(errorHandler('Carrito no encontrado', 404));
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.findIndex(p => p.product.toString() === pid);
        
        let updatedCart;
        
        if (existingProduct !== -1) {
            // Si existe, incrementar la cantidad
            const newQuantity = (cart.products[existingProduct].quantity || 0) + quantityToAdd;
            
            // Validar que no supere el stock disponible
            if (newQuantity > product.stock) {
                return next(errorHandler(`Stock insuficiente. Disponibles: ${product.stock}, solicitado: ${newQuantity}`, 400));
            }
            
            const updateObj = {};
            updateObj[`products.${existingProduct}.quantity`] = newQuantity;
            
            updatedCart = await Cart.findByIdAndUpdate(
                cid,
                { $set: updateObj },
                { 
                    new: true,
                    runValidators: true
                }
            ).populate('products.product');
        } else {
            // Si no existe, agregar el producto
            updatedCart = await Cart.findByIdAndUpdate(
                cid,
                {
                    $push: {
                        products: {
                            product: pid,
                            quantity: quantity || 1
                        }
                    }
                },
                { 
                    new: true,
                    runValidators: true
                }
            ).populate('products.product');
        }
        
        res.status(200).json({ status: 'success', payload: updatedCart });

    } catch (error) {
        next(error);
    }
});

cartRouter.get('/:cid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const cart = await Cart.findById(cid).populate('products.product').lean();
        if (!cart) errorHandler('Carrito no encontrado', 404);

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        next(error);
    }
});

// DELETE api/carts/:cid/products/:pid - Eliminar un producto del carrito
cartRouter.delete('/:cid/products/:pid', async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        
        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        ).populate('products.product');
        
        if (!updatedCart) {
            return next(errorHandler('Carrito no encontrado', 404));
        }
        
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        next(error);
    }
});

// PUT api/carts/:cid - Actualizar todos los productos del carrito
cartRouter.put('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        
        if (!Array.isArray(products)) {
            return next(errorHandler('products debe ser un arreglo', 400));
        }
        
        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { products: products },
            { new: true, runValidators: true }
        ).populate('products.product');
        
        if (!updatedCart) {
            return next(errorHandler('Carrito no encontrado', 404));
        }
        
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        next(error);
    }
});

// PUT api/carts/:cid/products/:pid - Actualizar cantidad de un producto
cartRouter.put('/:cid/products/:pid', async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body || {};
        
        if (!quantity || quantity < 1) {
            return next(errorHandler('quantity debe ser mayor a 0', 400));
        }

        // Verificar que el producto exista
        const product = await Product.findById(pid);
        if (!product) {
            return next(errorHandler('Producto no encontrado', 404));
        }

        // Verificar que haya stock disponible
        if (quantity > product.stock) {
            return next(errorHandler(`Stock insuficiente. Disponibles: ${product.stock}`, 400));
        }
        
        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { $set: { 'products.$[elem].quantity': quantity } },
            { 
                new: true,
                arrayFilters: [{ 'elem.product': pid }],
                runValidators: true
            }
        ).populate('products.product');
        
        if (!updatedCart) {
            return next(errorHandler('Carrito no encontrado', 404));
        }
        
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        next(error);
    }
});

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        
        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        );
        
        if (!updatedCart) {
            return next(errorHandler('Carrito no encontrado', 404));
        }
        
        res.status(200).json({ status: 'success', message: 'Carrito vaciado', payload: updatedCart });
    } catch (error) {
        next(error);
    }
});

export default cartRouter;