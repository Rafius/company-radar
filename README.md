# 📈 Company Radar - Buy Alert Dashboard

A modern React application that helps you track stocks and alerts you when they reach your target buy price. Monitor real-time prices and view historical trends to make informed buying decisions.

## 🎯 Features

- **🚨 Buy Alert System:**

  - Set target prices for stocks you want to buy
  - Visual alerts when price approaches your target
  - Color-coded indicators (Green = Wait | Yellow = Close | Red = BUY!)
  - Sortable by all columns

- **📊 Historical Price Charts:**

  - View 1-year price evolution for any stock
  - Beautiful SVG charts with gradient fills
  - Min/Max/Current price statistics
  - Modal-based chart viewer

- **🔍 Live Stock Search:**

  - Add any stock by ticker symbol (AAPL, MSFT, GOOGL, etc.)
  - Fetches real-time price from Alpha Vantage API
  - Set custom target buy prices
  - Automatic calculation of price difference and percentage

- **Key Metrics Tracked:**

  - Distance to target price and potential return percentage
  - Dividend yield
  - P/E Ratio
  - Revenue growth
  - Profit margin
  - EBITDA
  - Market capitalization
  - Debt to equity ratio

- **Smart Scoring System:**
  - Potential to target price (40%)
  - Dividend yield (20%)
  - Revenue growth (20%)
  - Profit margin (20%)

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API Key (Optional but recommended)

The app uses Alpha Vantage API for live stock data. Get your free API key:

1. Visit: https://www.alphavantage.co/support/#api-key
2. Get your free API key (no credit card required)
3. Update `src/views/TableView.tsx`:

```typescript
const API_KEY = "YOUR_API_KEY_HERE"; // Replace "demo"
```

See [API_CONFIG.md](./API_CONFIG.md) for detailed instructions.

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Alpha Vantage API** for real-time stock data
- **CSS Variables** for consistent theming
- **Modern ES6+** features with async/await

## 📁 Project Structure

```
company-radar/
├── src/
│   ├── App.tsx              # Main application with state management
│   ├── App.css              # Global styles and theme
│   ├── main.tsx             # Application entry point
│   ├── types/
│   │   └── Company.ts       # TypeScript interfaces
│   ├── data/
│   │   └── mockData.ts      # Sample company data and metrics calculation
│   └── views/
│       ├── TableView.tsx    # Sector-based list view with stock search
│       ├── TableView.css    # Table view styles
│       └── GridView.tsx     # Card-based grid view (legacy)
├── API_CONFIG.md            # API key configuration guide
├── index.html
├── package.json
└── vite.config.ts
```

## 🎨 Color Coding

The application uses color-coded indicators based on how close the current price is to your target:

- 🟢 **Green**: Price is 10%+ above your target (wait for it to drop)
- 🟠 **Yellow**: Price is 5-10% above target (getting close)
- 🔴 **Red**: Price is within 5% of your target (good time to buy!)
- 🎯 **¡COMPRAR!**: Special alert when price is at or below your target

The logic is inverted: you want to buy when the price DROPS to your target, so red means "time to act!"

## 📊 Understanding the Score

The investment score (0-100) is calculated based on:

1. **Potential Return** (40%): Distance from current price to target price
2. **Dividend Yield** (20%): Annual dividend as percentage of price
3. **Revenue Growth** (20%): Year-over-year revenue increase
4. **Profit Margin** (20%): Net profit as percentage of revenue

## 🌙 Dark Theme

The application features a modern dark theme with:

- Blue and purple gradient accents
- High contrast for readability
- Smooth transitions and hover effects
- Responsive design for all screen sizes

## 📱 Responsive Design

Fully responsive layout that works on:

- Desktop (1400px+ optimal)
- Tablets (768px - 1400px)
- Mobile devices (< 768px)

## 💡 How to Use

1. **Add a stock to your radar**:

   - Enter a ticker symbol (e.g., AAPL for Apple)
   - Set your TARGET BUY price (the price at which you'd like to buy)
   - Click "Añadir al Radar" to start tracking it

2. **Monitor opportunities**:

   - The list shows how far each stock is from your target
   - Sort by any column (company, sector, prices, difference, %)
   - Look for red indicators - those are your buy opportunities!

3. **View price history**:

   - Click "📈 Ver Gráfica" on any stock
   - See 1-year price evolution
   - Analyze trends to make better decisions

4. **Get alerts**:
   - Stocks within 5% of your target show "🎯 ¡COMPRAR!"
   - The entire row is highlighted in red
   - These are your best buying opportunities

## 🔮 Future Enhancements

Potential additions:

- ✅ Real-time data integration via API (completed)
- ✅ Historical price charts (completed)
- ✅ Sortable columns (completed)
- ✅ Buy alerts and visual indicators (completed)
- Email/SMS notifications when price reaches target
- User authentication and portfolios
- Local storage for watchlist persistence
- Export to CSV/PDF
- Price change alerts
- News and sentiment analysis
- Multiple target prices per stock

## 📝 License

This is a demonstration project for educational purposes.

## 👨‍💻 Development

Built with modern web technologies and best practices:

- TypeScript for type safety
- Functional React components with hooks
- CSS custom properties for theming
- Modular component architecture
- Clean, maintainable code structure

---

Made with ❤️ using React + TypeScript + Vite
# company-radar
