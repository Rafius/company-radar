# API Configuration

## Stock API Integration

This project uses **Finnhub API** for real-time stock data.

### API Configuration
- **Base URL**: `https://finnhub.io/api/v1`
- **API Key**: `demo` (free tier)
- **Rate Limits**: 60 calls/minute for free tier

### Available Endpoints
- `/quote` - Real-time stock quotes
- `/stock/profile2` - Company profile information

### Features
- ✅ Real-time stock prices
- ✅ Company information
- ✅ Market capitalization
- ✅ Volume data
- ✅ Price changes and percentages
- ✅ Error handling with fallback to mock data
- ✅ Loading states
- ✅ Individual and bulk refresh functionality

### Usage
1. Add stock symbols (e.g., AAPL, MSFT, GOOGL)
2. Set target prices
3. Monitor real-time price updates
4. Refresh individual stocks or all at once

### API Response Format
```typescript
interface StockQuote {
  c: number  // current price
  d: number  // change
  dp: number // percent change
  h: number  // high price of the day
  l: number  // low price of the day
  o: number  // open price of the day
  pc: number // previous close price
  t: number  // timestamp
}
```

### Error Handling
- Network errors fallback to mock data
- API errors display user-friendly messages
- Loading states prevent multiple requests
- Timeout handling (10 seconds)

### Getting Your Own API Key
1. Visit [Finnhub.io](https://finnhub.io)
2. Sign up for free account
3. Get your API key
4. Replace `demo` in `src/services/stockApi.ts`