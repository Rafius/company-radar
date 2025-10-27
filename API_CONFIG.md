# Configuración de la API

Este proyecto utiliza Alpha Vantage para obtener datos en tiempo real de precios de acciones.

## Cómo obtener tu API Key gratuita

1. Visita: https://www.alphavantage.co/support/#api-key
2. Completa el formulario con tu nombre y email
3. Recibirás tu API key inmediatamente (también por email)
4. El plan gratuito incluye:
   - 25 llamadas por día
   - 5 llamadas por minuto
   - Sin tarjeta de crédito requerida

## Configurar tu API Key

### Opción 1: Directamente en el código

Edita el archivo `src/views/TableView.tsx`:

```typescript
const API_KEY = "TU_API_KEY_AQUI"; // Reemplaza "demo" con tu API key
```

### Opción 2: Variables de entorno (Recomendado)

1. Crea un archivo `.env` en la raíz del proyecto:

```
VITE_ALPHA_VANTAGE_API_KEY=tu_api_key_aqui
```

2. Actualiza `TableView.tsx` para usar la variable de entorno:

```typescript
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";
```

3. Añade `.env` a tu `.gitignore` para no exponer tu API key

## Uso

Una vez configurada la API key, puedes:

1. Introducir el ticker de una acción (ej: AAPL, MSFT, TSLA)
2. Establecer un precio objetivo
3. La aplicación obtendrá automáticamente el precio actual desde Alpha Vantage
4. La empresa se añadirá al radar con el cálculo de potencial de retorno

## Tickers populares para probar

- **Tecnología**: AAPL (Apple), MSFT (Microsoft), GOOGL (Google), NVDA (Nvidia)
- **Finance**: JPM (JP Morgan), BAC (Bank of America), GS (Goldman Sachs)
- **Consumo**: AMZN (Amazon), TSLA (Tesla), NKE (Nike)
- **Salud**: JNJ (Johnson & Johnson), PFE (Pfizer), UNH (UnitedHealth)

## Limitaciones de la API gratuita

- La API key "demo" solo funciona con algunos símbolos limitados
- Con tu propia API key tendrás acceso a todos los símbolos del mercado
- Si excedes el límite de llamadas, la API retornará un mensaje de espera

## Alternativas gratuitas

Si necesitas más llamadas o características adicionales:

- **Finnhub**: https://finnhub.io (60 llamadas/minuto gratis)
- **Twelve Data**: https://twelvedata.com (8 llamadas/minuto gratis)
- **IEX Cloud**: https://iexcloud.io (50,000 llamadas/mes gratis)
