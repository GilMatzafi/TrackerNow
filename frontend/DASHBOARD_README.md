# TrackerNow Dashboard

A comprehensive dashboard for tracking coding interview progress, built with Next.js and Tailwind CSS.

## 🎯 Features

### 📊 KPI Cards
- **Problems Solved**: Total problems completed with growth indicators
- **Applications Sent**: Job applications sent this week/month
- **Interview Rate**: Success rate (interviews to offers)
- **Streak**: Consecutive practice days

### 📈 Charts & Analytics
- **Progress Overview**: Daily problem-solving progress with weekly comparisons
- **Time Spent Coding**: Hours of practice with daily breakdowns
- **Problem Distribution**: Donut chart showing problems by topic (Arrays, Graphs, DP, etc.)
- **Applications Timeline**: Table of recent job applications with status tracking

### 🎨 Design Features
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean design with purple accent colors matching your brand
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Protected Routes**: Authentication required to access dashboard

## 🏗️ Architecture

### Components Structure
```
app/components/dashboard/
├── Sidebar.tsx           # Navigation sidebar
├── Header.tsx            # Top navigation bar
├── KPICards.tsx          # Key performance indicators
├── ProgressChart.tsx     # Daily progress visualization
├── TimeSpentChart.tsx    # Time tracking chart
├── ProblemDistribution.tsx # Topic distribution pie chart
└── ApplicationsTable.tsx # Job applications table
```

### Key Features
- **Authentication Integration**: Uses AuthContext for user management
- **Protected Routes**: Dashboard requires login
- **Mock Data**: Sample data for demonstration (easily replaceable with real API calls)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🚀 Usage

1. **Login**: Users must be authenticated to access the dashboard
2. **Navigation**: Use the sidebar to navigate between different sections
3. **Time Filters**: Change time ranges and periods using the header controls
4. **Export**: Export progress reports (functionality ready for implementation)
5. **Search**: Search for problems and companies using the search bar

## 🔧 Customization

### Adding New Metrics
1. Update the `dashboardData` object in `dashboard/page.tsx`
2. Create new components in `app/components/dashboard/`
3. Add them to the dashboard layout

### Styling
- Colors are defined in `tailwind.config.ts`
- Primary: `#936DFF` (purple)
- Accent: `#54A388` (green)
- Background: `#161316` (dark)

### Data Integration
Replace mock data with real API calls:
```typescript
// Example: Fetch real data
const { data, loading, error } = useSWR('/api/dashboard', fetcher);
```

## 📱 Responsive Breakpoints
- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (4-column KPI cards, 2-column charts)

## 🎨 Design System
- **Typography**: Inter font family
- **Spacing**: Consistent 6-unit grid system
- **Shadows**: Subtle shadows for depth
- **Borders**: Light gray borders for separation
- **Colors**: Purple primary, green accent, gray neutrals

The dashboard provides a comprehensive view of coding interview progress with beautiful visualizations and intuitive navigation.
