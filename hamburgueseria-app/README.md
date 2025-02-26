# Documentación del Sistema de Gestión para Hamburguesería

## Información General

- **Nombre del Proyecto**: Sistema de Gestión para "JQ Q Berraquera"
- **Versión**: 0.2 (Implementación Inicial)
- **Fecha de inicio**: 25 de febrero de 2025
- **Responsable**: [Tu nombre]
- **Sucursales actuales**: 3 (con proyección de expansión)

## Descripción del Proyecto

Sistema integral para administrar "JQ Q Berraquera", una hamburguesería con múltiples sucursales que ofrece hamburguesas, perros calientes, choriperros, arepas con chorizo, choripan y bebidas. El sistema incluye gestión de inventario, ventas con productos personalizables (adición o eliminación de ingredientes), manejo de combos y control de caja con tres roles de usuario diferenciados: administrador, cajero y cocinero.

### Productos Principales
- 3 tipos de hamburguesas (personalizables)
- 2 tipos de perros calientes (personalizables)
- 2 tipos de choriperros (personalizables)
- Arepa con chorizo (personalizable)
- Choripan (personalizable)
- Vasos de gaseosa
- Bebidas embotelladas
- Porciones de huevos de codorniz
- Combos (producto + vaso de gaseosa)

### Características Clave
- Funciona con o sin conexión a internet (modo híbrido)
- Gestión multi-sucursal
- Personalización de productos (adición/eliminación de ingredientes)
- Control de inventario con alertas de stock
- Gestión de caja diaria (apertura/cierre)
- Reportes de ventas (diarios/semanales)
- Métodos de pago: Efectivo, Nequi, Daviplata, combinados y ocasionalmente transferencias

## Cambios en la Implementación

### Tecnologías Actualizadas

Se ha realizado un cambio significativo en las tecnologías utilizadas para el desarrollo del sistema:

#### Backend
- **Lenguaje**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB (en lugar de MySQL)
- **ODM**: Mongoose (en lugar de Sequelize)
- **Autenticación**: JWT (JSON Web Tokens)

#### Frontend
- **Framework**: React.js
- **Estilo**: Bootstrap 5
- **Gestión de estado**: Context API
- **Peticiones HTTP**: Axios

## Estructura Implementada del Proyecto

```
C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\  # Directorio raíz del proyecto
├── backend\                               # Servidor y lógica de negocio
│   ├── config\                            # Configuración de la aplicación y BD
│   │   └── database.js                    # Configuración de conexión a MongoDB
│   ├── controllers\                       # Controladores para cada entidad (pendiente)
│   ├── models\                            # Modelos de datos
│   │   ├── Sucursal.js                    # Modelo para sucursales
│   │   ├── Usuario.js                     # Modelo para usuarios
│   │   ├── Categoria.js                   # Modelo para categorías
│   │   ├── Producto.js                    # Modelo para productos
│   │   ├── Ingrediente.js                 # Modelo para ingredientes
│   │   ├── OpcionProducto.js              # Modelo para opciones de producto
│   │   └── index.js                       # Exportación centralizada de modelos
│   ├── routes\                            # Rutas de la API (pendiente)
│   ├── middleware\                        # Middleware
│   │   └── auth.middleware.js             # Middleware de autenticación
│   ├── utils\                             # Funciones auxiliares
│   │   └── auth.utils.js                  # Utilidades para autenticación
│   ├── server.js                          # Archivo principal del servidor
│   ├── .env                               # Variables de entorno
│   └── package.json                       # Dependencias backend
├── frontend\                              # Interfaz de usuario (React)
│   ├── public\                            # Archivos estáticos
│   │   └── index.html                     # Plantilla HTML principal
│   ├── src\                               # Código fuente
│   │   ├── components\                    # Componentes reutilizables (pendiente)
│   │   ├── pages\                         # Páginas por módulo (pendiente)
│   │   ├── services\                      # Servicios y peticiones API (pendiente)
│   │   ├── assets\                        # Imágenes, iconos, etc. (pendiente)
│   │   ├── App.js                         # Componente principal de la aplicación
│   │   └── index.js                       # Punto de entrada de la aplicación
│   └── package.json                       # Dependencias frontend
├── docs\                                  # Documentación adicional
│   └── Documentacion-Sistema-Gestion.md   # Documentación actualizada del sistema
└── README.md                              # Documentación general
```

## Modelo de Datos

### Actualización del Modelo

En lugar de utilizar un modelo relacional con MySQL y Sequelize, ahora utilizamos un modelo basado en documentos con MongoDB y Mongoose. Esto proporciona mayor flexibilidad y escalabilidad para el sistema.

### Esquemas de Mongoose Implementados

1. **Sucursal**
   - nombre (String, obligatorio, único)
   - direccion (String, obligatorio)
   - telefono (String, obligatorio)
   - administrador_principal (ObjectId, referencia a Usuario)
   - estado (String enum: ['activa', 'inactiva'], default: 'activa')
   - timestamps (fecha_creacion, fecha_actualizacion)

2. **Usuario**
   - nombre (String, obligatorio)
   - usuario (String, obligatorio, único)
   - contrasena (String, obligatorio, encriptada)
   - rol (String enum: ['administrador', 'cajero', 'cocinero'], obligatorio)
   - sucursal (ObjectId, referencia a Sucursal, obligatorio)
   - estado (String enum: ['activo', 'inactivo'], default: 'activo')
   - codigo_autorizacion (String, opcional)
   - timestamps (fecha_creacion, fecha_actualizacion)

3. **Categoría**
   - nombre (String, obligatorio, único)
   - descripcion (String, opcional)
   - timestamps (fecha_creacion, fecha_actualizacion)

4. **Producto**
   - nombre (String, obligatorio)
   - descripcion (String, opcional)
   - precio_base (Number, obligatorio, two decimals)
   - categoria (ObjectId, referencia a Categoria, obligatorio)
   - imagen (String, opcional)
   - disponible (Boolean, default: true)
   - para_llevar (String enum: ['sí', 'no', 'ambos'], default: 'ambos')
   - timestamps (fecha_creacion, fecha_actualizacion)

5. **Ingrediente**
   - nombre (String, obligatorio, único)
   - precio_adicional (Number, default: 0, two decimals)
   - disponible (Boolean, default: true)
   - stock (Number, default: 0)
   - stock_minimo (Number, default: 10)
   - unidad_medida (String, opcional)
   - timestamps (fecha_creacion, fecha_actualizacion)

6. **OpcionProducto**
   - producto (ObjectId, referencia a Producto, obligatorio)
   - ingrediente (ObjectId, referencia a Ingrediente, obligatorio)
   - es_predeterminado (Boolean, default: true)
   - es_removible (Boolean, default: true)
   - cantidad_predeterminada (Number, default: 1)
   - timestamps (fecha_creacion, fecha_actualizacion)

Esta estructura de esquemas en MongoDB permite una mayor flexibilidad en la gestión de los datos, facilitando la adición de nuevos campos sin necesidad de realizar migraciones complejas en la base de datos.

## Implementación de la Autenticación

Se ha implementado un sistema de autenticación basado en JSON Web Tokens (JWT) que proporciona:

1. **Inicio de sesión seguro**: Las contraseñas se almacenan encriptadas usando bcrypt.
2. **Control de acceso por roles**: Middleware para verificar los roles de usuario (administrador, cajero, cocinero).
3. **Verificación de tokens**: Validación automática de tokens JWT en cada petición protegida.
4. **Restricciones por sucursal**: Los usuarios solo pueden acceder a los datos de su sucursal (excepto administradores).

### Middleware de Autenticación Implementado

- `verificarToken`: Verifica que el token JWT es válido y no ha expirado.
- `verificarRol`: Controla el acceso basado en roles de usuario.
- `verificarUsuarioActivo`: Asegura que solo los usuarios activos puedan acceder al sistema.
- `verificarAccesoSucursal`: Restringe el acceso a las sucursales según el rol y asignación del usuario.

## API Endpoints

### Implementados

- `GET /api/status` - Verificar estado de la API

### Pendientes de Implementación

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token de autenticación

#### Usuarios
- `GET /api/users` - Obtener todos los usuarios (solo admin)
- `POST /api/users` - Crear usuario (solo admin)
- `GET /api/users/:id` - Obtener un usuario específico
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario (solo admin)
- `POST /api/users/authorize` - Autorizar descuento o acción especial

#### Sucursales
- `GET /api/branches` - Obtener todas las sucursales
- `POST /api/branches` - Crear sucursal (solo admin)
- `GET /api/branches/:id` - Obtener una sucursal específica
- `PUT /api/branches/:id` - Actualizar una sucursal (solo admin)
- `DELETE /api/branches/:id` - Desactivar una sucursal (solo admin)

## Estado Actual del Desarrollo

- [X] Planificación inicial
- [X] Diseño de la base de datos
- [X] Configuración del entorno de desarrollo
- [X] Implementación de modelos de datos (MongoDB/Mongoose)
- [X] Configuración del servidor Express
- [X] Implementación de middleware y utilidades para autenticación (JWT)
- [ ] Implementación de los controladores
- [ ] Implementación de las rutas API
- [X] Configuración básica del frontend (React)
- [ ] Implementación de componentes del frontend
- [ ] Pruebas
- [ ] Despliegue

### Infraestructura Implementada
- Servidor backend Node.js con Express funcionando en puerto 3001
- Base de datos MongoDB conectada y configurada
- Proyecto React creado y configurado con dependencias básicas
- Sistema de autenticación JWT implementado a nivel de middleware

## Próximos Pasos

1. Implementar los controladores de autenticación
2. Desarrollar controladores CRUD para las entidades principales:
   - Sucursales
   - Usuarios
   - Categorías
   - Productos
   - Ingredientes
3. Implementar las rutas API correspondientes
4. Comenzar el desarrollo del frontend con React
5. Implementar el módulo de ventas
6. Desarrollar el sistema de caja
7. Implementar el control de inventario

## Consideraciones Importantes

- El sistema utiliza MongoDB como base de datos, lo que implica un modelo de datos basado en documentos en lugar de relacional.
- Se recomienda tener MongoDB instalado y en ejecución para el desarrollo y pruebas locales.
- La autenticación se realiza mediante tokens JWT que deben ser incluidos en los headers de las peticiones.
- El sistema soporta tres roles de usuario con diferentes niveles de acceso.
- El frontend se comunica con el backend a través de API RESTful.
- Para el desarrollo se requieren dos servidores en ejecución:
  - Servidor backend (Express): Puerto 3001
  - Servidor frontend (React): Puerto 3000
  
## Archivos Implementados

### Backend

#### Configuración
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\config\database.js**: Configuración de la conexión a MongoDB utilizando Mongoose. Gestiona la conexión, eventos de conexión y desconexión de la base de datos.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\.env**: Archivo de variables de entorno con configuraciones para el servidor, base de datos, JWT y CORS.

#### Modelos
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\Sucursal.js**: Define el esquema de Mongoose para las sucursales del negocio, incluyendo nombre, dirección, teléfono, administrador y estado.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\Usuario.js**: Define el esquema para los usuarios del sistema, con gestión de encriptación de contraseñas mediante bcrypt y métodos para verificación.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\Categoria.js**: Esquema para las categorías de productos (hamburguesas, bebidas, etc.).
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\Producto.js**: Esquema para los productos disponibles, incluyendo precio base, disponibilidad y opciones para llevar.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\Ingrediente.js**: Esquema para los ingredientes que pueden añadirse o quitarse a los productos, con control de stock.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\OpcionProducto.js**: Esquema para la relación entre productos e ingredientes, estableciendo configuraciones predeterminadas.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\models\index.js**: Archivo que centraliza la exportación de todos los modelos para facilitar su importación.

#### Middleware
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\middleware\auth.middleware.js**: Implementa funciones middleware para la autenticación y autorización:
  - `verificarToken`: Valida los tokens JWT en las peticiones.
  - `verificarRol`: Controla acceso según rol de usuario.
  - `verificarUsuarioActivo`: Comprueba que el usuario esté activo.
  - `verificarAccesoSucursal`: Restringe acceso por sucursal asignada.

#### Utilidades
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\utils\auth.utils.js**: Funciones para la gestión de tokens JWT:
  - `generarToken`: Crea tokens JWT para usuarios autenticados.
  - `verificarToken`: Valida tokens JWT y devuelve el payload.

#### Servidor Principal
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\backend\server.js**: Archivo principal que configura el servidor Express:
  - Implementa middlewares para CORS, parsing de JSON y URL.
  - Configura el logging de solicitudes.
  - Establece el manejo de errores y rutas no encontradas.
  - Conecta a MongoDB e inicia el servidor en el puerto configurado.

### Frontend

- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\frontend\package.json**: Archivo de configuración de npm con las dependencias del frontend.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\frontend\src\App.js**: Componente principal de la aplicación React.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\frontend\src\index.js**: Punto de entrada de la aplicación React.
- **C:\Users\david.DESKTOP-JC0UQP0\OneDrive\Desktop\Nueva carpeta\hamburgueseria-app\frontend\public\index.html**: Plantilla HTML principal.

El frontend está configurado con Create React App e incluye las siguientes dependencias adicionales:
- axios: Para realizar peticiones HTTP al backend.
- bootstrap y react-bootstrap: Para el diseño de la interfaz de usuario.
- react-router-dom: Para la navegación entre páginas.
- @fortawesome/react-fontawesome: Para iconos.

Los componentes específicos del frontend están pendientes de implementación.

## Historial de Cambios

| Fecha | Versión | Descripción |
|-------|---------|-------------|
| 25/02/2025 | 0.1 | Documentación inicial |
| 25/02/2025 | 0.2 | Actualización por cambio a MongoDB y avances en implementación |
| 25/02/2025 | 0.3 | Implementación de estructura base, conexión a MongoDB y modelos básicos |

## Contacto

Para continuar este proyecto, inicie un nuevo chat con Claude referenciando este documento para mantener la continuidad del desarrollo.