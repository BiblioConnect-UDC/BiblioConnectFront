# 📚 BiblioConnect - Sistema de Gestión Bibliotecaria

**BiblioConnect** es una aplicación web moderna para la gestión de bibliotecas, que permite administrar libros, préstamos y usuarios de manera eficiente y sencilla.

🔗 **Repositorio GitHub:** https://github.com/BiblioConnect-UDC/BiblioConnectFront

---

## 📑 Tabla de Contenidos

1. [Inicio Rápido](#-inicio-rápido)
2. [Arquitectura General](#-arquitectura-general)
3. [Autenticación y Seguridad](#-autenticación-y-seguridad)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Tecnologías](#-tecnologías)
6. [Instalación y Configuración](#-instalación-y-configuración)
7. [Cómo Usar](#-cómo-usar)
8. [API REST](#-endpoints-de-la-api)
9. [Componentes Principales](#-componentes-principales)
10. [Guías de Referencia](#-guías-de-referencia)

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** 18+ instalado
- **npm** o **yarn** como gestor de paquetes
- **Backend Spring Boot** ejecutándose en `http://localhost:8080`
- **Angular CLI** instalado globalmente (opcional pero recomendado)

### Pasos para Ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/BiblioConnect-UDC/BiblioConnectFront.git
cd biblioConnectFrontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
ng serve -o
# O con npm:
npm start

# 4. Abrir en el navegador
# Navega a http://localhost:4200
```

### Credenciales de Prueba
```
Usuario: admin
Contraseña: password123
```

---

## 🏗️ Arquitectura General

### Diagrama de Flujo - Sistema de Autenticación

```
┌────────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR WEB                               │
│                    http://localhost:4200                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │               FRONTEND ANGULAR 16.2.16                      │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  AppComponent                                              │ │
│  │  ├── HeaderComponent (*ngIf="isAuthenticated")             │ │
│  │  └── <router-outlet></router-outlet>                       │ │
│  │      ├─ /login ──────► LoginComponent                      │ │
│  │      ├─ /register ──► RegisterFormComponent                │ │
│  │      ├─ /home ──────► HomeComponent (protegido)           │ │
│  │      └─ /libro-form ─► LibroFormComponent (protegido)     │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         AuthService (auth.service.ts)              │ │ │
│  │  │ • login(username, password)                         │ │ │
│  │  │ • register(nombre, email, username, password)       │ │ │
│  │  │ • logout()                                          │ │ │
│  │  │ • isAuthenticated()                                 │ │ │
│  │  │ • getToken()                                        │ │ │
│  │  │ Almacenamiento: localStorage.auth_token             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    AuthInterceptor (auth.interceptor.ts)            │ │ │
│  │  │ Intercepta TODAS las peticiones HTTP                │ │ │
│  │  │ Agrega: Authorization: Bearer {JWT_TOKEN}           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │      AuthGuard (guards/auth.guard.ts)               │ │ │
│  │  │ Protege rutas: /home, /libro-form                  │ │ │
│  │  │ Redirige a /login si no hay token                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  Environment: apiUrl = 'http://localhost:8080/api'        │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │
┌────────────────────────────────────────────────────────────────────┐
│                   BACKEND SPRING BOOT 3.x                          │
│                    http://localhost:8080                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │         AuthController                                  │    │
│  │ POST /api/v1/auth/login     → { token }                 │    │
│  │ POST /api/v1/auth/register  → { AdminUserDto }          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  LibraryController (endpoints para gestión de libros)    │    │
│  │ GET    /api/v1/library/libros                           │    │
│  │ POST   /api/v1/library/libros                           │    │
│  │ PUT    /api/v1/library/libros/{id}                      │    │
│  │ DELETE /api/v1/library/libros/{id}                      │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │      CORS Configuration                                  │    │
│  │ Allowed Origins: http://localhost:4200                  │    │
│  │ Allowed Methods: GET, POST, PUT, DELETE, OPTIONS        │    │
│  │ Allowed Headers: *                                       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Base de Datos (MySQL)                       │    │
│  │ admin_users:    id, username, password, email, nombre    │    │
│  │ libros:         id, titulo, autor, isbn, categoria...    │    │
│  │ categorias:     id, nombre, descripcion                  │    │
│  │ editoriales:    id, nombre, pais                         │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación Completo

```
INICIO
  │
  ├─► Usuario accede a http://localhost:4200
  │   │
  │   ├─► ¿Hay token en localStorage?
  │   │   │
  │   │   ├─ NO → Redirige a /login (sin header)
  │   │   │   │
  │   │   │   ├─ Usuario ingresa credenciales
  │   │   │   ├─ Click "Iniciar Sesión"
  │   │   │   ├─ AuthService.login(username, password)
  │   │   │   ├─ POST /api/v1/auth/login
  │   │   │   │
  │   │   │   ├─► Backend valida y retorna JWT
  │   │   │   │
  │   │   │   ├─ AuthService guarda token en localStorage
  │   │   │   ├─ Router redirige a /home
  │   │   │   │
  │   │   │   └─ ✓ Usuario autenticado
  │   │   │
  │   │   └─ SÍ → Redirige a /home (con header)
  │   │
  │   └─► HomeComponent validar token en ngOnInit
  │
  ├─► OPERACIONES AUTENTICADAS
  │   │
  │   ├─ Todas las peticiones HTTP llevan:
  │   │   Authorization: Bearer {JWT_TOKEN}
  │   │   (agregado automáticamente por AuthInterceptor)
  │   │
  │   └─ Ejemplos:
  │       GET /api/v1/library/libros
  │       POST /api/v1/library/libros
  │       PUT /api/v1/library/libros/1
  │       DELETE /api/v1/library/libros/1
  │
  └─► LOGOUT
      │
      ├─ Usuario hace click "🚪 Salir" en header
      ├─ Confirmación con dialog
      ├─ AuthService.logout()
      ├─ Elimina token de localStorage
      ├─ Router redirige a /login
      └─ Header desaparece automáticamente
```

### Componentes de Seguridad

#### 1. **AuthService** (`src/app/services/auth.service.ts`)
- Gestiona todo lo relacionado con autenticación
- Métodos: `login()`, `register()`, `logout()`, `getToken()`, `isAuthenticated()`
- Almacena JWT en localStorage
- Emite eventos cuando cambia el estado

#### 2. **AuthInterceptor** (`src/app/interceptors/auth.interceptor.ts`)
- Intercepta TODAS las peticiones HTTP
- Agrega automáticamente el header `Authorization: Bearer {token}`
- Garantiza que todas las peticiones autenticadas lleven el token

#### 3. **AuthGuard** (`src/app/guards/auth.guard.ts`)
- Protege rutas que requieren autenticación
- Aplicado en: `/home` y `/libro-form`
- Si no hay token, redirige a `/login`

#### 4. **HeaderComponent** (`src/app/Components/header/`)
- Muestra nombre de usuario
- Botón de logout
- Se oculta automáticamente cuando no hay autenticación (*ngIf="isAuthenticated")
- Responde en tiempo real a cambios de token

### Validación en Dos Niveles

```
┌─────────────────────────────────────┐
│ 1. NIVEL DE RUTA (AuthGuard)        │
│ ├─ Valida acceso a ruta protegida   │
│ ├─ Redirige a login si no hay token │
│ └─ Previene acceso no autorizado    │
└─────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 2. NIVEL DE COMPONENTE              │
│ ├─ HomeComponent valida token       │
│ ├─ Redirige si token está expirado  │
│ └─ Validación adicional en ngOnInit │
└─────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 3. NIVEL DE SERVIDOR                │
│ ├─ Backend valida JWT               │
│ ├─ Retorna 401 si token es inválido │
│ └─ AuthInterceptor maneja errores   │
└─────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
biblioConnectFrontend/
│
├── src/
│   ├── app/
│   │   ├── Components/
│   │   │   ├── header/                 # Header con usuario y logout
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.css
│   │   │   ├── register-form/          # Formulario de registro
│   │   │   │   ├── register-form.component.ts
│   │   │   │   ├── register-form.component.html
│   │   │   │   └── register-form.component.css
│   │   │   └── ... otros componentes
│   │   │
│   │   ├── views/
│   │   │   ├── home/                   # Página principal
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.css
│   │   │   ├── login/                  # Página de login
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.css
│   │   │   └── ... otras vistas
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts         # ✨ Autenticación
│   │   │   ├── library.service.ts      # Gestión de libros
│   │   │   └── ... otros servicios
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts     # ✨ Inyecta JWT en peticiones
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # ✨ Protege rutas
│   │   │
│   │   ├── models/
│   │   │   ├── libro.model.ts
│   │   │   ├── categoria.model.ts
│   │   │   ├── editorial.model.ts
│   │   │   └── create-libro-request.model.ts
│   │   │
│   │   ├── app.component.ts            # Componente principal
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.module.ts               # Módulo principal
│   │   └── app-routing.module.ts       # Rutas de la aplicación
│   │
│   ├── environments/
│   │   ├── environment.ts              # Configuración desarrollo
│   │   └── environment.prod.ts         # Configuración producción
│   │
│   ├── assets/                         # Imágenes, fuentes, etc.
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json                        # Configuración Angular
├── package.json                        # Dependencias npm
├── tsconfig.json                       # Configuración TypeScript
├── README.md                           # Este archivo
└── ...

```

---

## 🛠️ Tecnologías

### Frontend
- **Angular 16.2.16**: Framework principal para UI
- **TypeScript**: Lenguaje de tipado fuerte
- **RxJS**: Programación reactiva y observables
- **Angular Forms**: Formularios reactivos y validación
- **Angular Router**: Navegación SPA
- **Angular HTTP Client**: Comunicación con API
- **CSS3**: Estilos con gradientes y animations

### Backend (Spring Boot)
- **Spring Boot 3.x**: Framework backend
- **Spring Security**: Seguridad y JWT
- **Spring Data JPA**: Acceso a BD
- **MySQL**: Base de datos relacional
- **Maven**: Gestor de proyectos

### Herramientas
- **Node.js 18+**: Runtime de JavaScript
- **npm**: Gestor de paquetes
- **Angular CLI**: Herramienta CLI para Angular
- **Git**: Control de versiones

---

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/BiblioConnect-UDC/BiblioConnectFront.git
cd biblioConnectFrontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar el Backend (Spring Boot)

Asegúrate de que el backend esté ejecutándose:

```bash
# En tu proyecto backend
mvn spring-boot:run
# Debe estar en http://localhost:8080
```

**Importante:** El backend DEBE tener CORS habilitado:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 4. Configurar Variables de Entorno

El archivo `src/environments/environment.ts` contiene:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**⚠️ IMPORTANTE:** La URL debe ser exactamente `http://localhost:8080/api` (sin `/v1/library` al final)

### 5. Ejecutar el Frontend

```bash
# Opción 1: Con Angular CLI
ng serve

# Opción 2: Con npm
npm start

# El frontend estará en http://localhost:4200
```

### 6. Prueba en el Navegador

```
1. Abre http://localhost:4200
2. Deberías ver la pantalla de login
3. Ingresa credenciales:
   - Usuario: admin
   - Contraseña: password123
4. Haz click "Iniciar Sesión"
5. Deberías ver la página de home con el header
```

---

## 📖 Cómo Usar

### Inicio de Sesión

```
1. Abre http://localhost:4200 en el navegador
2. Se redirige automáticamente a /login
3. Ingresa tus credenciales:
   - Usuario
   - Contraseña
4. Haz click en "Iniciar Sesión"
5. Si las credenciales son correctas:
   ✓ Se guarda el JWT en localStorage
   ✓ Se redirige a /home
   ✓ Aparece el header con tu nombre
```

### Registro de Nuevo Usuario

```
1. En la página de login, haz click "¿No tienes cuenta? Regístrate aquí"
2. Completa el formulario:
   - Nombre completo (mín. 3 caracteres)
   - Email válido
   - Usuario (mín. 3 caracteres)
   - Contraseña (mín. 6 caracteres)
   - Confirmar contraseña
3. Haz click "Registrarse"
4. Si el registro es exitoso:
   ✓ Se muestra mensaje verde
   ✓ Se redirige a /login después de 2 segundos
   ✓ Puedes hacer login con tus nuevas credenciales
```

### Gestión de Libros

```
1. En la página /home, ves la lista de libros
2. Opciones disponibles:
   
   a) Crear nuevo libro:
      - Haz click en "➕ Nuevo Libro"
      - Completa el formulario
      - Haz click "Guardar"
   
   b) Editar libro:
      - Haz click en el botón "✏️" de un libro
      - Modifica los datos
      - Haz click "Guardar"
   
   c) Eliminar libro:
      - Haz click en el botón "🗑️" de un libro
      - Confirma la eliminación
   
   d) Buscar libro:
      - Usa la barra de búsqueda
      - Busca por título, autor, ISBN, etc.
```

### Cerrar Sesión

```
1. En cualquier página autenticada (/home, /libro-form, etc.)
2. Haz click en "🚪 Salir" (botón rojo en el header)
3. Se muestra un dialog de confirmación
4. Confirma el logout
5. Se elimina el token de localStorage
6. Se redirige a /login
7. El header desaparece
```

---

## 📡 Endpoints de la API

### Autenticación (sin protección)

```
POST /api/v1/auth/login
├─ Request: { username: string, password: string }
├─ Response: { token: string }
└─ Ejemplo:
   POST http://localhost:8080/api/v1/auth/login
   { "username": "admin", "password": "password123" }
   → { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..." }

POST /api/v1/auth/register
├─ Request: { nombre, email, username, password }
├─ Response: { AdminUserDto }
└─ Ejemplo:
   POST http://localhost:8080/api/v1/auth/register
   { "nombre": "Juan", "email": "juan@example.com", 
     "username": "juan", "password": "password123" }
   → { "id": 1, "username": "juan", "email": "juan@example.com" }
```

### Gestión de Libros (requieren JWT)

```
GET /api/v1/library/libros
├─ Headers: Authorization: Bearer {token}
└─ Response: Array[LibroDto]

POST /api/v1/library/libros
├─ Headers: Authorization: Bearer {token}
├─ Body: CreateLibroRequest
└─ Response: LibroDto

PUT /api/v1/library/libros/{id}
├─ Headers: Authorization: Bearer {token}
├─ Body: CreateLibroRequest
└─ Response: LibroDto

DELETE /api/v1/library/libros/{id}
├─ Headers: Authorization: Bearer {token}
└─ Response: void (204 No Content)
```

### Headers Automáticos

El **AuthInterceptor** agrega automáticamente a TODAS las peticiones:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🎯 Componentes Principales

### LoginComponent (`src/app/views/login/`)
**Propósito:** Autenticación del usuario

**Características:**
- Formulario reactivo con validaciones
- Campos: usuario (min 3), contraseña (min 6)
- Manejo de errores del servidor
- Redirección automática a home si login es exitoso
- Redirección a home si ya estaba autenticado
- Link a registro

**Flujo:**
```
Usuario ingresa credenciales
        ↓
Valida en cliente
        ↓
POST /api/v1/auth/login
        ↓
Backend valida y retorna JWT
        ↓
Guardar en localStorage
        ↓
Redirige a /home
```

### RegisterFormComponent (`src/app/Components/register-form/`)
**Propósito:** Crear nuevas cuentas de usuario

**Características:**
- Formulario reactivo con 5 campos
- Validador personalizado (confirmPassword)
- Validaciones en tiempo real
- Manejo de errores del servidor
- Redirección a login después de registro exitoso
- Link a login

**Campos validados:**
- nombre: mín 3 caracteres
- email: formato válido
- username: mín 3 caracteres
- password: mín 6 caracteres
- confirmPassword: debe coincidir

### HomeComponent (`src/app/views/home/`)
**Propósito:** Página principal con lista de libros

**Características:**
- Validación de token en ngOnInit
- Obtiene lista de libros del backend
- CRUD de libros (crear, leer, actualizar, eliminar)
- Búsqueda de libros
- Interfaz responsiva

**Métodos:**
- `cargarLibros()`: Obtiene lista completa
- `buscarLibros(termino)`: Búsqueda filtrada
- `irACrearLibro()`: Navega a formulario
- `irAEditarLibro(id)`: Navega a editar
- `eliminarLibro(id)`: Elimina libro

### HeaderComponent (`src/app/Components/header/`)
**Propósito:** Navegación superior y control de sesión

**Características:**
- Muestra nombre del usuario
- Botón de logout con confirmación
- Se oculta si no hay autenticación (*ngIf="isAuthenticated")
- Responsive en todos los dispositivos
- Escucha cambios de token en tiempo real

**Elementos:**
- Logo de BiblioConnect
- Nombre de usuario
- Botón "🚪 Salir"

### AuthService (`src/app/services/auth.service.ts`)
**Propósito:** Gestión central de autenticación

**Métodos públicos:**
```typescript
login(username: string, password: string): Observable<{ token: string }>
register(data: RegisterRequest): Observable<any>
logout(): void
getToken(): string | null
isAuthenticated(): boolean
isAuthenticated$(): Observable<boolean>
```

**Eventos BehaviorSubject:**
- `isAuthenticated$`: Emite cambios de estado
- Se actualiza cuando hay login/logout

**Almacenamiento:**
- Token JWT en `localStorage.auth_token`
- Username en `localStorage.username`

---

## 🔧 Configuración Avanzada

### Cambiar URL del Backend

En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-servidor.com/api'  // ← Cambiar aquí
};
```

**⚠️ Importante:** 
- No incluir `/v1/library` o rutas específicas
- Usar solo el endpoint base: `/api`

### Actualizar Credenciales de Prueba

Las credenciales están definidas en el backend.
Para cambiarlas, debes:

1. Acceder a la BD MySQL
2. Buscar tabla `admin_users`
3. Actualizar usuario `admin`
4. O crear un nuevo usuario via endpoint `/api/v1/auth/register`

### Personalizar Estilos

Los estilos se encuentran en:
- `src/app/views/login/login.component.css` - Login
- `src/app/Components/register-form/register-form.component.css` - Registro
- `src/app/Components/header/header.component.css` - Header
- `src/styles.css` - Estilos globales

Paleta de colores usada:
```css
--primary: #667eea      /* Púrpura claro */
--secondary: #764ba2    /* Púrpura oscuro */
--danger: #dc3545       /* Rojo */
--success: #28a745      /* Verde */
--text-dark: #333       /* Texto oscuro */
--border: #ddd          /* Bordes */
```

---

## 🧪 Testing

### Pruebas Manuales Recomendadas

#### Test 1: Acceso sin Autenticación
```
1. Limpia localStorage (DevTools > Storage > Local Storage > Delete all)
2. Intenta acceder a http://localhost:4200/home
3. Deberías ser redirigido a /login
✓ PASS si ves la página de login
```

#### Test 2: Login Exitoso
```
1. Ve a http://localhost:4200/login
2. Ingresa: usuario=admin, password=password123
3. Haz click "Iniciar Sesión"
✓ PASS si ves: header + lista de libros
```

#### Test 3: Token Expirado
```
1. Abre DevTools (F12)
2. Ve a Storage > Local Storage
3. Edita auth_token y cámbialo por cualquier valor
4. Actualiza la página
✓ PASS si eres redirigido a login
```

#### Test 4: Logout
```
1. Estando logueado en /home
2. Haz click "🚪 Salir" en el header
3. Confirma logout
✓ PASS si ves: página de login + header desaparece
```

#### Test 5: Registro
```
1. Ve a http://localhost:4200/register
2. Completa formulario con datos válidos
3. Haz click "Registrarse"
✓ PASS si ves: mensaje verde + redirige a login
```

---

## 🐛 Troubleshooting

### Problema: "Cannot get /"
**Causa:** Frontend no está ejecutándose
```bash
Solución:
1. Abre terminal en biblioConnectFrontend
2. npm start
3. Espera a que compile
4. Abre http://localhost:4200
```

### Problema: "CORS policy blocked"
**Causa:** Backend no tiene CORS activado
```java
Solución: Agrega en tu backend:
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Problema: "Error 404 en /api/v1/auth/login"
**Causa:** URL del backend es incorrecta
```typescript
Solución en environment.ts:
✗ INCORRECTO:
  apiUrl: 'http://localhost:8080/api/v1/library'
✓ CORRECTO:
  apiUrl: 'http://localhost:8080/api'
```

### Problema: "Pantalla blanca en home"
**Causa:** Posible error de compilación o token inválido
```
Solución:
1. Abre DevTools (F12) > Console
2. Ve si hay errores rojos
3. Limpia localStorage y login nuevamente
4. Verifica que el backend retorna libros en GET /api/v1/library/libros
```

### Problema: "Contraseña no valida en login"
**Causa:** Usuario no existe o contraseña incorrecta
```
Verificar:
1. ¿Usuario existe en BD? 
2. ¿Contraseña es la correcta?
3. ¿Backend está ejecutándose?
4. ¿No hay errores en consola del backend?
```

---

## 📚 Guías de Referencia

Documentación completa disponible en archivos MD:

- **AUTHENTICATION_SETUP.md** - Guía de integración con backend
- **IMPLEMENTACION_AUTENTICACION_V2.md** - Implementación de seguridad
- **CHANGELOG_V2.md** - Cambios en autenticación
- **RESUMEN_FINAL.md** - Resumen ejecutivo
- **REGISTRO_COMPLETADO.md** - Guía del formulario de registro
- **QUICK_START.md** - Guía rápida para comenzar
- **ARCHITECTURE_DIAGRAM.md** - Diagramas detallados

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs:**
   ```
   Frontend: Abre DevTools (F12) > Console
   Backend: Revisa la terminal donde corre mvn spring-boot:run
   ```

2. **Verifica configuración:**
   - Backend ejecutándose en puerto 8080
   - Frontend ejecutándose en puerto 4200
   - CORS activado en backend
   - URL API correcta en environment.ts

3. **Limpia estado:**
   ```javascript
   // En DevTools Console:
   localStorage.clear()
   sessionStorage.clear()
   // Luego actualiza la página (F5)
   ```

---

## 📝 Notas Importantes

✅ **Lo que está completado:**
- Sistema de autenticación JWT
- Protección de rutas con AuthGuard
- Header con información de usuario
- Registro de usuarios
- Gestión de libros (CRUD)
- Formularios reactivos con validación
- Estilos responsivos
- Integración con backend Spring Boot

⚠️ **En consideración para futuras versiones:**
- Confirmación de email
- Recuperación de contraseña
- Roles y permisos granulares
- Notificaciones push
- Caché de datos
- Compresión de imágenes

---

## 🎉 ¡Listo para Usar!

BiblioConnect está **completamente funcional** y listo para:
- ✓ Desarrollo
- ✓ Testing
- ✓ Deployment en producción

Para cualquier duda, revisa las guías de referencia o el código fuente.

**¡Éxito con tu proyecto! 🚀**

---

**Última actualización:** 12 de Noviembre de 2025  
**Versión:** 3.0 - Autenticación Completa  
**Estado:** ✅ PRODUCCIÓN LISTA
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

2. **Sistema de Préstamos** (Aun en desarrollo)
   - Registro de préstamos
   - Control de devoluciones
   - Historial de préstamos
   - Estados: ACTIVO, DEVUELTO, VENCIDO

3. **Gestión de Usuarios** (Aun en desarrollo)
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

