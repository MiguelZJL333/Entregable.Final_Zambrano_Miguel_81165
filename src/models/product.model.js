import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true, //Esto es para eliminar espacios en blanco al inicio y al final
            minLength: 3,
            maxLength: 100
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 500
        },
        code: {
            type: String,
            required: true,
            trim: true,
            //unique: true,
            uppercase: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: Boolean,
            default: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Electronicos','Cuardenos y Libretas', 'Hogar', 'Deportes', 'Celulares', 'Fideos', 'Pastas Frescas', 'Arroz',
                'Legumbres', 'Conservas', 'Salsas', 'Galletitas', 'Harinas', 'Aceites', 'Limpieza', 'Bebidas',
                'Bebidas Alcoholicas', 'Papel', 'Aderezos', 'Yerba', 'Snack', 'Prueba', 'Dulces', 'Salados', 'Cereales',
                'Fiambres', 'Quesos', 'Lacteos', 'Congelados', 'Panificados', 'Tortas', 'Masas', 'Tartas'],
        },
        thumbnails: {
            type: String,
            trim: true,
            default: 'product-default.png',
        },
    },
    { timestamps: true }
);

//INDICES   
productSchema.index({ title: 1 }, { unique: true });

productSchema.index({ description: "text" });

productSchema.index({ code: 1 }, { unique: true });

productSchema.index({ price: 1 })

productSchema.index({ category: 1 });

//Plugin para manejar paginación
productSchema.plugin(paginate);



const ProductModel = mongoose.model('products', productSchema);

export default ProductModel;