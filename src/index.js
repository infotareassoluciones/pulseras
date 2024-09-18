// src/app.js
import express from 'express';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import prendasRoutes from './routes/prendas.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import loginRoutes from './routes/login.routes.js';
import registerRoutes from './routes/register.routes.js';
//import { isAuthenticated } from './authMiddleware.js';

// Inicializar dotenv
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear carpeta para sesiones si no existe
/*const sessionsDir = join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
    try {
        fs.mkdirSync(sessionsDir, { recursive: true });
        console.log('Directorio de sesiones creado:', sessionsDir);
    } catch (error) {
        console.error('Error creando el directorio de sesiones:', error);
    }
}*/

const FileStore = sessionFileStore(session);

const app = express();

app.use(session({
    store: new FileStore({
        path: join(__dirname, 'sessions'),
        logFn: function() {} // Suprimir mensajes de registro
    }),
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, // Cambia a true si usas HTTPS
        maxAge: 30 * 60 * 1000 // 30 minutos
    }
}));

app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views', 'layouts'),
    partialsDir: join(__dirname, 'views', 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(express.static(join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Rutas públicas
app.use(catalogosRoutes);
app.use(loginRoutes);
app.use(registerRoutes);
app.use(categoriasRoutes);
app.use(productosRoutes);
app.use(clientesRoutes);
app.use(prendasRoutes);
app.use(ventasRoutes);
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para verificar el estado de la sesión
/*app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ active: true });
    } else {
        res.json({ active: false });
    }
});*/

// Middleware de autenticación para todas las rutas a continuación
/*app.use((req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
});*/

// Rutas protegidas
//

// Registro del helper ifCond




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

