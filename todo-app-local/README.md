# TODO App - React with Local Storage

Una aplicación de gestión de tareas (TODO) moderna y funcional construida con React y persistencia local usando localStorage. La aplicación permite crear, editar, eliminar y marcar tareas como completadas con una interfaz de usuario intuitiva y responsiva.

## 🚀 Características

### Funcionalidades Principales
- ✅ **Agregar tareas** con título, descripción y prioridad
- ✏️ **Editar tareas** existentes con formulario dinámico
- 🗑️ **Eliminar tareas** con confirmación de seguridad
- ✔️ **Marcar tareas como completadas** o pendientes
- 🔍 **Buscar tareas** por título o descripción
- 🏷️ **Filtrar tareas** por estado (todas, pendientes, completadas)
- 📊 **Ordenar tareas** por fecha, título o prioridad
- 📈 **Estadísticas en tiempo real** de progreso

### Características Técnicas
- 💾 **Persistencia local** con localStorage
- 📱 **Diseño responsivo** para móviles y escritorio
- 🎨 **Interfaz moderna** con animaciones suaves
- ♿ **Accesibilidad** con soporte para lectores de pantalla
- 🌙 **Soporte para modo oscuro** automático
- 🔄 **Gestión de estado** con hooks personalizados
- 📝 **Código documentado** y bien estructurado

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **Lucide React** - Iconos modernos y escalables
- **CSS3** - Estilos con variables CSS y flexbox/grid
- **localStorage** - Persistencia de datos local
- **ESLint** - Linting de código JavaScript

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   - La aplicación estará disponible en: `http://localhost:12000`
   - El servidor se recarga automáticamente al hacer cambios

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la construcción de producción

# Linting
npm run lint         # Ejecuta ESLint para verificar el código
```

## 🏗️ Estructura del Proyecto

```
todo-app-local/
├── src/
│   ├── components/         # Componentes React
│   │   ├── TaskForm.jsx   # Formulario para crear/editar tareas
│   │   ├── TaskItem.jsx   # Componente individual de tarea
│   │   └── TaskList.jsx   # Lista de tareas con filtros
│   ├── hooks/             # Hooks personalizados
│   │   └── useTasks.js    # Hook para gestión de tareas
│   ├── utils/             # Utilidades
│   │   └── localStorage.js # Funciones para localStorage
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
├── package.json           # Dependencias y scripts
└── vite.config.js         # Configuración de Vite
```

## 💡 Uso de la Aplicación

### Crear una Nueva Tarea
1. Completa el formulario en la parte superior
2. Ingresa un **título** (obligatorio)
3. Agrega una **descripción** (opcional)
4. Selecciona la **prioridad** (baja, media, alta)
5. Haz clic en "Add Task"

### Gestionar Tareas Existentes
- **Completar**: Haz clic en el círculo a la izquierda del título
- **Editar**: Haz clic en el icono de lápiz
- **Eliminar**: Haz clic en el icono de papelera (requiere confirmación)

### Filtrar y Buscar
- **Buscar**: Usa la barra de búsqueda para encontrar tareas por título o descripción
- **Filtrar**: Selecciona "All", "Pending" o "Completed"
- **Ordenar**: Ordena por fecha, título o prioridad (clic para cambiar orden)

## 🔧 Características de Desarrollo

### Gestión de Estado
- **Hook personalizado** `useTasks` para lógica de negocio
- **Estado local** con React hooks
- **Persistencia automática** en localStorage

### Validación de Formularios
- Validación en tiempo real
- Mensajes de error descriptivos
- Límites de caracteres
- Campos obligatorios marcados

### Accesibilidad
- Etiquetas ARIA apropiadas
- Navegación por teclado
- Contraste de colores adecuado
- Soporte para lectores de pantalla

### Responsive Design
- **Mobile-first** approach
- Breakpoints para tablet y desktop
- Componentes que se adaptan al tamaño de pantalla
- Touch-friendly en dispositivos móviles

---

**Desarrollado con ❤️ usando React y localStorage**
