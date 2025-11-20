# Travel Planner API - NestJS

API REST para la planificación de viajes que permite gestionar países y planes de viaje. La aplicación implementa un sistema de caché para países, consumiendo datos de la API externa RestCountries y almacenándolos localmente.

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Node.js (v16 o superior)
- npm

### Instalación

1. Clonar el repositorio:
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd template-p2
```

2. Instalar las dependencias:
```bash
npm install
```

3. Configuración de la base de datos:
El proyecto utiliza SQLite, por lo que no requiere configuración adicional. La base de datos `travel-planner.db` se creará automáticamente al ejecutar la aplicación.

### Ejecutar la aplicación

**Modo desarrollo:**
```bash
npm run start:dev
```

**Modo producción:**
```bash
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

---

## 📋 Descripción de la API

La aplicación está compuesta por dos módulos principales:

### 1. **Countries Module**
Gestiona la información de países utilizando un sistema de caché inteligente:
- Primero busca el país en la base de datos local
- Si no existe, consulta la API externa RestCountries
- Almacena el país en la base de datos para futuras consultas
- Reduce llamadas innecesarias a servicios externos

### 2. **Travel Plans Module**
Permite crear y gestionar planes de viaje:
- Crea planes de viaje asociados a países específicos
- Valida automáticamente que el país destino exista
- Si el país no está en caché, lo obtiene y almacena automáticamente
- Valida fechas y datos de entrada

---

## 🛣️ Endpoints disponibles

### **Countries**

#### 1. Listar todos los países almacenados
```http
GET /countries
```

**Respuesta exitosa (200):**
```json
[
  {
    "code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "subregion": "South America",
    "capital": "Bogotá",
    "population": 50882884,
    "flag": "https://flagcdn.com/w320/co.png",
    "source": "cache",
    "createdAt": "2024-11-20T10:30:00.000Z",
    "updatedAt": "2024-11-20T10:30:00.000Z"
  }
]
```

#### 2. Obtener un país por código alpha-3
```http
GET /countries/:code
```

**Parámetros:**
- `code` (string): Código alpha-3 del país (ej: COL, USA, FRA)

**Ejemplo:**
```http
GET /countries/COL
```

**Respuesta exitosa (200):**
```json
{
  "code": "COL",
  "name": "Colombia",
  "region": "Americas",
  "subregion": "South America",
  "capital": "Bogotá",
  "population": 50882884,
  "flag": "https://flagcdn.com/w320/co.png",
  "source": "external",
  "createdAt": "2024-11-20T10:30:00.000Z",
  "updatedAt": "2024-11-20T10:30:00.000Z"
}
```

**Nota:** El campo `source` indica si la información viene de:
- `"cache"`: Base de datos local
- `"external"`: API externa (RestCountries)

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "Country with code XYZ not found in external API"
}
```

---

### **Travel Plans**

#### 1. Crear un nuevo plan de viaje
```http
POST /travel-plans
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "countryCode": "COL",
  "title": "Vacaciones en Cartagena",
  "startDate": "2024-12-15",
  "endDate": "2024-12-22",
  "notes": "Visitar playas y el casco antiguo"
}
```

**Validaciones:**
- `countryCode`: Obligatorio, debe ser un código alpha-3 válido (3 letras mayúsculas)
- `title`: Obligatorio
- `startDate`: Obligatorio, formato ISO 8601 (YYYY-MM-DD)
- `endDate`: Obligatorio, formato ISO 8601, debe ser posterior a startDate
- `notes`: Opcional

**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "countryCode": "COL",
  "title": "Vacaciones en Cartagena",
  "startDate": "2024-12-15T00:00:00.000Z",
  "endDate": "2024-12-22T00:00:00.000Z",
  "notes": "Visitar playas y el casco antiguo",
  "createdAt": "2024-11-20T10:45:00.000Z",
  "country": {
    "code": "COL",
    "name": "Colombia",
    "flag": "https://flagcdn.com/w320/co.png"
  }
}
```

**Respuesta de error (400):**
```json
{
  "statusCode": 400,
  "message": "Start date must be before end date"
}
```

#### 2. Listar todos los planes de viaje
```http
GET /travel-plans
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "countryCode": "COL",
    "title": "Vacaciones en Cartagena",
    "startDate": "2024-12-15T00:00:00.000Z",
    "endDate": "2024-12-22T00:00:00.000Z",
    "notes": "Visitar playas y el casco antiguo",
    "createdAt": "2024-11-20T10:45:00.000Z",
    "country": {
      "code": "COL",
      "name": "Colombia",
      "flag": "https://flagcdn.com/w320/co.png"
    }
  }
]
```

#### 3. Obtener un plan de viaje por ID
```http
GET /travel-plans/:id
```

**Parámetros:**
- `id` (number): ID del plan de viaje

**Ejemplo:**
```http
GET /travel-plans/1
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "countryCode": "COL",
  "title": "Vacaciones en Cartagena",
  "startDate": "2024-12-15T00:00:00.000Z",
  "endDate": "2024-12-22T00:00:00.000Z",
  "notes": "Visitar playas y el casco antiguo",
  "createdAt": "2024-11-20T10:45:00.000Z",
  "country": {
    "code": "COL",
    "name": "Colombia",
    "flag": "https://flagcdn.com/w320/co.png"
  }
}
```

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "Travel plan with ID 999 not found"
}
```

---

## 🔌 Provider Externo: RestCountries

### Arquitectura de separación de responsabilidades

El consumo de la API externa RestCountries está implementado mediante un **Provider** que sigue el principio de **Inversión de Dependencias**:

#### Componentes:

1. **Interfaz (`ICountriesApiProvider`)**: Define el contrato que debe cumplir cualquier proveedor de información de países.

2. **Implementación (`RestCountriesProvider`)**: Implementa la interfaz consumiendo la API de RestCountries.

3. **Inyección de dependencias**: El servicio de países (`CountriesService`) recibe el provider a través del sistema de DI de NestJS.

### Funcionamiento:

```typescript
// 1. Se define la interfaz
export interface ICountriesApiProvider {
  findCountryByCode(code: string): Promise<any>;
}

// 2. Se implementa usando RestCountries
@Injectable()
export class RestCountriesProvider implements ICountriesApiProvider {
  async findCountryByCode(code: string): Promise<any> {
    // Llamada a https://restcountries.com/v3.1/alpha/{code}
    // Solicita solo los campos necesarios
  }
}

// 3. Se inyecta en el servicio
@Injectable()
export class CountriesService {
  constructor(
    @Inject(COUNTRIES_API_PROVIDER)
    private readonly countriesApiProvider: ICountriesApiProvider
  ) {}
}
```

### Ventajas:

- **Desacoplamiento**: El módulo de países no depende directamente de RestCountries
- **Testabilidad**: Fácil de mockear en pruebas unitarias
- **Flexibilidad**: Se puede cambiar el proveedor sin modificar la lógica de negocio
- **Optimización**: Solo solicita los campos necesarios de la API externa

### Endpoint de RestCountries utilizado:

```
GET https://restcountries.com/v3.1/alpha/{code}?fields=name,cca3,region,subregion,capital,population,flags
```

---

## 📊 Modelo de datos

### Entidad: **Country**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | string (PK) | Código alpha-3 del país (ej: COL, USA) |
| `name` | string | Nombre común del país |
| `region` | string | Región geográfica |
| `subregion` | string | Subregión geográfica |
| `capital` | string | Ciudad capital |
| `population` | number | Población del país |
| `flag` | string | URL de la imagen de la bandera |
| `createdAt` | Date | Fecha de creación del registro |
| `updatedAt` | Date | Fecha de última actualización |

### Entidad: **TravelPlan**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number (PK) | Identificador único autogenerado |
| `countryCode` | string (FK) | Código del país destino |
| `title` | string | Título del viaje |
| `startDate` | Date | Fecha de inicio del viaje |
| `endDate` | Date | Fecha de finalización del viaje |
| `notes` | string | Notas o comentarios opcionales |
| `createdAt` | Date | Fecha de creación del registro |

### Relación:

- Un país puede tener **muchos** planes de viaje (1:N)
- Un plan de viaje pertenece a **un** país (N:1)

---

## 🧪 Pruebas básicas sugeridas

### 1. Probar sistema de caché de países

**Paso 1:** Consultar un país por primera vez
```http
GET /countries/COL
```
Verificar que `"source": "external"` (viene de RestCountries)

**Paso 2:** Consultar el mismo país nuevamente
```http
GET /countries/COL
```
Verificar que `"source": "cache"` (viene de la base de datos)

**Resultado esperado:** La segunda consulta es más rápida y no hace llamada externa.

---

### 2. Crear un plan de viaje con país existente en caché

**Prerequisito:** Haber consultado el país COL previamente

```http
POST /travel-plans
Content-Type: application/json

{
  "countryCode": "COL",
  "title": "Vacaciones en Colombia",
  "startDate": "2024-12-01",
  "endDate": "2024-12-15",
  "notes": "Bogotá y costa caribeña"
}
```

**Resultado esperado:** El plan se crea exitosamente usando el país de la caché.

---

### 3. Crear un plan de viaje con país NO cacheado

```http
POST /travel-plans
Content-Type: application/json

{
  "countryCode": "JPN",
  "title": "Tour por Japón",
  "startDate": "2025-04-01",
  "endDate": "2025-04-15",
  "notes": "Tokio, Kioto y Osaka"
}
```

**Resultado esperado:** 
1. El sistema detecta que JPN no está en caché
2. Consulta automáticamente a RestCountries
3. Guarda el país en la base de datos
4. Crea el plan de viaje exitosamente

**Verificación:** Consultar `/countries/JPN` debería mostrar `"source": "cache"`

---

### 4. Validación de fechas

```http
POST /travel-plans
Content-Type: application/json

{
  "countryCode": "USA",
  "title": "Viaje mal planificado",
  "startDate": "2025-12-31",
  "endDate": "2025-12-01"
}
```

**Resultado esperado:** Error 400 con mensaje "Start date must be before end date"

---

### 5. Listar todos los planes de viaje

```http
GET /travel-plans
```

**Resultado esperado:** Array con todos los planes creados, cada uno con información completa del país destino.

---

## 🛠️ Tecnologías utilizadas

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para manejo de base de datos
- **SQLite** - Base de datos embebida
- **Axios** - Cliente HTTP para consumir APIs externas
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos

---

## 📁 Estructura del proyecto

```
src/
├── countries/
│   ├── dto/
│   │   └── country-response.dto.ts
│   ├── entities/
│   │   └── country.entity.ts
│   ├── providers/
│   │   ├── countries-api.interface.ts
│   │   └── rest-countries.provider.ts
│   ├── countries.controller.ts
│   ├── countries.service.ts
│   └── countries.module.ts
├── travel-plans/
│   ├── dto/
│   │   ├── create-travel-plan.dto.ts
│   │   └── travel-plan-response.dto.ts
│   ├── entities/
│   │   └── travel-plan.entity.ts
│   ├── travel-plans.controller.ts
│   ├── travel-plans.service.ts
│   └── travel-plans.module.ts
├── app.module.ts
└── main.ts
```

---

## 👨‍💻 Autor

**Joe** - Desarrollo Backend - Preparcial NestJS

---

## 📝 Notas adicionales

- La base de datos SQLite (`travel-planner.db`) se crea automáticamente en la raíz del proyecto
- El modo `synchronize: true` de TypeORM está habilitado para desarrollo (crea/actualiza tablas automáticamente)
- Para producción, se recomienda usar migraciones en lugar de `synchronize`
- La API externa RestCountries es gratuita y no requiere autenticación

---

## 🐛 Solución de problemas

### Error: "Cannot connect to database"
- Verificar que todas las dependencias estén instaladas: `npm install`
- Eliminar el archivo `travel-planner.db` y reiniciar la aplicación

### Error: "Country not found"
- Verificar que el código del país sea válido (formato alpha-3)
- Algunos países pueden no estar disponibles en RestCountries

### Error: "Port 3000 already in use"
- Cambiar el puerto en `src/main.ts`: `await app.listen(3001);`

---

## 📞 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.