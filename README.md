## [RS School React Course](https://rs.school/courses/reactjs): React Performance

## CO2 Emissions Data Viewer

## About the project

This is a React application for viewing and analyzing CO2 emissions data for countries around the world. The project was created as a learning assignment to demonstrate skills in optimizing the performance of React applications when working with large volumes of data.

## Performance Analysis

### Testing Actions

The following interactions were measured using React DevTools Profiler:

1. Sorting a column
2. Searching a country
3. Selecting another year
4. Adding/removing columns

### Before Optimization (Initial Version)

#### Performance Metrics Before Optimization

| Action | Commit Duration (ms) | Render Duration (ms) | Interaction Type |
|--------|---------------------|---------------------|------------------|
| Sorting column | 2.9ms | 173.4ms | onClick |
| Searching country | 1.9ms | 55.1ms | onChange |
| Selecting year | 6ms | 210.8ms | onChange |
| Adding/removing columns |  1.3ms | 25.2ms | onClick |

When Interactions tab data is unavailable, analysis is based on Commit Duration and Flame Graph timing comparisons.

#### Screenshots

##### Sorting a Column

![Before - Sorting Flame](./performance-screenshots/before-sorting-flame.png)
_Flame Graph for column sorting before optimization_

![Before - Sorting Ranked](./performance-screenshots/before-sorting-ranked.png)
_Ranked Chart for column sorting before optimization_

##### Searching a Country

![Before - Search Flame](./performance-screenshots/before-search-flame.png)
_Flame Graph for country search before optimization_

![Before - Search Ranked](./performance-screenshots/before-search-ranked.png)
_Ranked Chart for country search before optimization_

##### Selecting Another Year

![Before - Year Selection Flame](./performance-screenshots/before-year-flame.png)
_Flame Graph for year selection before optimization_

![Before - Year Selection Ranked](./performance-screenshots/before-year-ranked.png)
_Ranked Chart for year selection before optimization_

##### Adding/Removing Columns

![Before - Columns Flame](./performance-screenshots/before-columns-flame.png)
_Flame Graph for column management before optimization_

![Before - Columns Ranked](./performance-screenshots/before-columns-ranked.png)
_Ranked Chart for column management before optimization_

#### Key Performance Issues

- [Describe main bottlenecks found]
- [List components causing unnecessary re-renders]
- [Note any particularly slow operations]

---

### After Optimization (React.memo & useMemo)

#### Applied Optimizations

- **React.memo:** Wrapped components to prevent unnecessary re-renders
- **useMemo:** Memoized expensive calculations (filtering, sorting, data processing)
- **useCallback:** Memoized event handlers

#### Performance Metrics After Optimization

| Action | Commit Duration (ms) | Render Duration (ms) | Interaction Type | Improvement |
|--------|---------------------|---------------------|------------------|-------------|
| Sorting column | 1.4ms | 113.6ms | onClick | 34.5% faster |
| Searching country | 2.4ms | 21.1ms | onChange | 61.7% faster |
| Selecting year | 2.2ms | 133.5ms | onChange | 36.7% faster |
| Adding/removing columns | 1.2ms | 9ms | onClick | 64.3% faster |

When Interactions tab data is unavailable, analysis is based on Commit Duration and Flame Graph timing comparisons.

#### Screenshots

##### Sorting a Column

![After - Sorting Flame](./performance-screenshots/after-sorting-flame.png)
_Flame Graph for column sorting after optimization_

![After - Sorting Ranked](./performance-screenshots/after-sorting-ranked.png)
_Ranked Chart for column sorting after optimization_

##### Searching a Country

![After - Search Flame](./performance-screenshots/after-search-flame.png)
_Flame Graph for country search after optimization_

![After - Search Ranked](./performance-screenshots/after-search-ranked.png)
_Ranked Chart for country search after optimization_

##### Selecting Another Year

![After - Year Selection Flame](./performance-screenshots/after-year-flame.png)
_Flame Graph for year selection after optimization_

![After - Year Selection Ranked](./performance-screenshots/after-year-ranked.png)
_Ranked Chart for year selection after optimization_

##### Adding/Removing Columns

![After - Columns Flame](./performance-screenshots/after-columns-flame.png)
_Flame Graph for column management after optimization_

![After - Columns Ranked](./performance-screenshots/after-columns-ranked.png)
_Ranked Chart for column management after optimization_
