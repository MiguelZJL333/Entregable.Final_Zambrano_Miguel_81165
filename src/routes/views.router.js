import express from 'express';
import Product from '../models/product.model.js';
// import Cart from "../models/cart.model.js";
// import {errorHandler} from '../util/httpErrors.js';

const viewsRouter = express.Router();

viewsRouter.get('/', async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        // Construir filtro
        let filter = {};
        
        // Filtro por query (categoría o status)
        if (query) {
            filter = { $or: [{ category: query }, { status: query === 'available' ? true : false }] };
        }
        
        // Opciones de paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };
        
        // Ordenamiento por precio
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }
        
        // Ejecutar paginación
        const productsData = await Product.paginate(filter, options);
        const products = productsData.docs;
        
        // Construir links de paginación
        const links = [];
        const baseUrl = `/?limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`;
        
        for (let i = 1; i <= productsData.totalPages; i++) {
            links.push({
                text: i,
                Link: `${baseUrl}&page=${i}`,
                active: i === productsData.page
            });
        }
        
        // Preparar respuesta
        const prevPage = productsData.page > 1 ? productsData.page - 1 : null;
        const nextPage = productsData.page < productsData.totalPages ? productsData.page + 1 : null;
        
        const response = {
            status: 'success',
            payload: products,
            totalPages: productsData.totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: productsData.page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage ? `${baseUrl}&page=${prevPage}` : null,
            nextLink: nextPage ? `${baseUrl}&page=${nextPage}` : null
        };
        
        res.render('index', { ...response, links });
    } catch (error) {
        next(error);
    }
});

// Ruta para ver detalles de un producto
viewsRouter.get('/products/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid).lean();
        
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        
        res.render('product-detail', { product });
    } catch (error) {
        next(error);
    }
});

// Ruta para ver un carrito específico
viewsRouter.get('/carts/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const Cart = (await import('../models/cart.model.js')).default;
        
        const cart = await Cart.findById(cid).populate('products.product').lean();
        
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        
        res.render('cart', { cart, products: cart.products });
    } catch (error) {
        next(error);
    }
});

export default viewsRouter;