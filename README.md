# Travel Planner API - NestJS

## Cómo ejecutar el proyecto

### Instalación

1. Clonar el repositorio:
```bash
git clone <https://github.com/StnJoseph/template-p2.git>
cd template-p2
```

2. Instalar las dependencias:
```bash
npm install
```

3. Configuración de la base de datos:
El proyecto utiliza SQLite (por facilidad), por lo que no requiere configuración adicional. La base de datos `travel-planner.db` se creará automáticamente al ejecutar la aplicación.

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

## Descripción de la API

La aplicación está compuesta por dos módulos principales:

### 1. **Countries Module**
Gestiona la información de países utilizando un sistema de caché inteligente:
- Primero busca el país en la base de datos local
- Si no existe, consulta la API externa RestCountries
- Almacena el país en la base de datos para futuras consultas

### 2. **Travel Plans Module**
Permite crear y gestionar planes de viaje:
- Crea planes de viaje asociados a países específicos
- Valida automáticamente que el país destino exista
- Si el país no está en caché, lo obtiene y almacena automáticamente

---

## Endpoints disponibles

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

#### 2. Obtener un país por código YYY
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
- Todos los atributos son **obligatorios** a excepcion de `notes`


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
- `id` (number): ID del plan de viaje (1, 2, 3, ...)

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

## Provider Externo: RestCountries

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

---

## Modelo de datos

### Entidad: **Country**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | string (PK) | Código alpha-3 del país |
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

## Pruebas básicas sugeridas

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

## Autor

**Joseph Steven Linares Gutierrez**

---


# Extensión del Parcial

## Resumen de las ampliaciones

En este parcial se extendi la API original del preparcial con tres funcionalidades clave;

1. **Endpoint de eliminación de países**: Se implementó un endpoint `DELETE /countries/:code` que permite eliminar países del caché local. Incluye validacione para garantizar la integridad: verifica que el país exista en la base de datos y que no tenga planes de viaje asociados antes de eliminar. (Esto dificultó las pruebas durante la realización del parcial)

2. **Guard de autorización**: Se desarrollo un guard personalizado (`DeleteAuthGuard`) que protege el endpoint de eliminación mediante validación de token. Solo las peticiones que incluyen el header de x-api-token con el valor correcto pueden ejecutar operaciones de borrado.

3. **Middleware de logging**: Se implementó un middleware global que registra automaticamente todas las peticiones a las rutas `/countries` y `/travel-plans`. Este captura información detallada de cada peticion y la muestra segun el formato usado en dl codigo.

---

## Endpoint protegido - DELETE /countries/:code
### Funcionamiento

El endpoint permite eliminar un país de la cach local siguiendo este flujo:

1. Validación del token: El `DeleteAuthGuard` toma la petición y verifica el header `x-api-token` (toca ponerlo en header pa que funcione).
2. Verificación de existencia: Se busca el país en la base de datos por su código YYY o aplpha-3.
3. Validación de integridad: Se verifica que no existan planes de viaje asociados al país.
4. Eliminacion: Si todas los pasos anteriores son validos, el país se elimina de la base de datos.

### Cómo validar

Caso 1: Token inválido (Error 401)
```http
DELETE http://localhost:3000/countries/FRA
x-api-token: token-xd
```
Resultado esperado: 401, Invalid authorization token

Caso 2: País con planes asociados (Error 400)
```http
DELETE http://localhost:3000/countries/COL
x-api-token: mi-token-secreto-2025
```
Resultado esperado: 400

Caso 3: Eliminación exitosa (200)
```http
DELETE http://localhost:3000/countries/JPN
x-api-token: mi-token-secreto-2024
```
Resultado esperado: Country JPN has been successfully deleted from


## Guard de autorización
### Funcionamiento

El `DeleteAuthGuard` usa la interfaz `CanActivate` y valida:

1. Extrae el header: Lee el valor de `x-api-token` de los headers de la petición.
2. Valida presencia: Verifica que l token esté presente; si no, lanza Exception.
3. Valida valor: Compara el token recibido con el token valdo configurado (`mi-token-secreto-2025`).
4. Autoriza o rechaza: Retorna `true` si el token es válido, o lanza excepción si no lo es.

### Cómo validar

**Token**: `mi-token-secreto-2025`

Prueba 1: Verificar que requiere token
```http
DELETE http://localhost:3000/countries/USA
```
Debería fallar con 401.

Prueba 2: Verificar token valido
```http
DELETE http://localhost:3000/countries/USA
x-api-token: mi-token-secreto-2025
```
Debería mostrar la eliminación (200 OK).

---

## Middleware de logging
### Funcionamiento

El Middelware intercepta todas las peticiones a las rutas configuradas (`/countries` y `/travel-plans`) y registra información relevante:

1. Captura inicio: Registra el tiempo de inicio.
2. Escucha finalización: Espera al evento `finish` de la respuesta para capturar el momento en que termina.
3. Calcula tiempo: Resta el tiempo de inicio y el final .
4. Registra info: Usa el logger pa imprimir.

### Cómo validar

Prueba 1: Verificar logging en GET /countries
```http
GET http://localhost:3000/countries
```

Si enn la consola se ve algo como:
```
[API] GET /countries - Status: 200 - Time: 45ms
```

Es porque funcionó.