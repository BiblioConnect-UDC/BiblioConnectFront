# BiblioConnect - Sistema de Gestión Bibliotecaria

BiblioConnect es una aplicación web moderna para la gestión de bibliotecas, que permite administrar libros, préstamos y usuarios de manera eficiente y sencilla.

## Arquitectura del Proyecto

### Frontend (Angular)
```
biblioConnectFrontend/
├── src/
│   ├── app/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── models/            # Interfaces y modelos de datos
│   │   ├── services/          # Servicios para comunicación con API
│   │   └── views/             # Componentes de página/vistas
│   ├── assets/               # Recursos estáticos
│   └── environments/         # Configuración por ambiente
```

### Estructura de Componentes
- **Components**: Componentes reutilizables (libro-form, prestamo-form)
- **Models**: Definición de interfaces (libro.model, prestamo.model)
- **Services**: Servicios para comunicación HTTP (libro.service, prestamo.service)
- **Views**: Páginas principales (home, login)

### Integración con Backend

La aplicación frontend se comunica con el backend a través de una API RESTful. La configuración del endpoint base se encuentra en `environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Los servicios Angular utilizan HttpClient para realizar peticiones HTTP al backend:
- GET: Consulta de datos (libros, préstamos)
- POST: Creación de registros (nuevos libros)
- PUT: Actualización de registros
- DELETE: Eliminación de registros

## Tecnologías Utilizadas

### Frontend
- **Angular 16.2.16**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Angular Material**: Componentes de UI
- **RxJS**: Programación reactiva
- **npm**: Gestor de paquetes

### Backend (Spring Boot)
- **Spring Boot**: Framework backend
- **Java 17+**: Lenguaje de programación
- **MySQL**: Base de datos relacional
- **Maven**: Gestor de dependencias
- **JPA/Hibernate**: ORM

## Requisitos del Sistema

### Windows
1. **Node.js y npm**:
   - Descargar e instalar Node.js desde https://nodejs.org/ (incluye npm)
   - Verificar instalación:
     ```powershell
     node --version
     npm --version
     ```

2. **Angular CLI**:
   ```powershell
   npm install -g @angular/cli
   ```

### Linux
1. **Node.js y npm**:
   ```bash
   # Usando nvm (recomendado)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18
   
   # Verificar instalación
   node --version
   npm --version
   ```

2. **Angular CLI**:
   ```bash
   npm install -g @angular/cli
   ```

## Instalación y Ejecución

### Windows

1. **Clonar el repositorio**:
```powershell
git clone [URL_DEL_REPOSITORIO]
cd biblioConnectFrontend
```

2. **Instalar dependencias**:
```powershell
npm install
```

3. **Ejecutar la aplicación**:
```powershell
ng serve
```

4. Abrir navegador en `http://localhost:4200`

### Linux

1. **Clonar el repositorio**:
```bash
git clone [URL_DEL_REPOSITORIO]
cd biblioConnectFrontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar la aplicación**:
```bash
ng serve
```

4. Abrir navegador en `http://localhost:4200`

## Configuración del Backend

1. Asegurarse de que el backend esté en ejecución (puerto 8080)
2. Verificar la URL del backend en `environment.ts`
3. Si el backend está en otro puerto/host, actualizar la configuración

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm test`: Ejecuta los tests unitarios
- `npm run build`: Compila la aplicación para producción
- `npm run lint`: Ejecuta el linter

## Características Principales

1. **Gestión de Libros**
   - Crear, editar y eliminar libros
   - Búsqueda y filtrado
   - Gestión de categorías y editoriales

2. **Sistema de Préstamos**
   - Registro de préstamos
   - Control de devoluciones
   - Historial de préstamos
   - Estados: ACTIVO, DEVUELTO, VENCIDO

3. **Gestión de Usuarios**
   - Registro de usuarios
   - Perfiles de usuario
   - Historial de préstamos

## Solución de Problemas Comunes

1. **Error de CORS**
   ```typescript
   // En el backend (application.properties)
   spring.mvc.cors.allowed-origins=http://localhost:4200
   ```

2. **Error de Conexión al Backend**
   - Verificar que el backend esté ejecutándose
   - Comprobar URL en environment.ts
   - Verificar puerto 8080 disponible

3. **Errores de Compilación**
   ```bash
   # Limpiar y reinstalar
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

## Estructura de la Base de Datos

Las principales entidades son:

1. **Libros**
   - ID, título, ISBN
   - Editorial, categoría
   - Estado (activo/inactivo)

2. **Préstamos**
   - ID, libro, usuario
   - Fechas (préstamo, devolución)
   - Estado (activo/devuelto/vencido)

3. **Usuarios**
   - ID, nombre, email
   - Rol, estado

## Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## Contacto y Soporte

Para reportar bugs o solicitar nuevas características:
1. Abrir un issue en el repositorio
2. Enviar un correo al equipo de soporte

---
_Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16._
