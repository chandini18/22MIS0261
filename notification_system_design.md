# Notification System Design

## Overview
The Campus Notification System is a React-based frontend application that fetches and displays notifications from a provided API. It helps students stay updated on Placement, Result, and Event notifications in a prioritized and organized manner.

## Notification Fetching
Notifications are fetched from the provided API endpoint using a Bearer token for authentication. The fetch happens on component mount using the useEffect hook. The API returns notifications in JSON format which are then stored in React state for rendering.

## Priority Logic
Notifications are sorted based on type priority:
- Placement → Priority 3 (Highest)
- Result → Priority 2
- Event → Priority 1 (Lowest)

Within the same priority type, newer notifications appear first based on timestamp sorting.

## Sorting Logic
Notifications are sorted using JavaScript's sort function comparing both priority value and timestamp. If two notifications have the same type, the one with the more recent timestamp appears first.

## Filtering Logic
Filter buttons (All, Placement, Result, Event) allow users to view notifications by category. Clicking a filter button updates the displayed list without refetching from the API, using React state to filter the already fetched notifications.

## Viewed vs Unread
Unread notifications show a red dot indicator and bold text. When a user clicks a notification card, it is marked as viewed, the red dot disappears, a checkmark appears, and the card opacity reduces to visually distinguish it from unread notifications.

## Responsive Design
The application is fully responsive and works on both desktop and mobile screens. Flexbox layout and percentage-based widths ensure proper rendering on all screen sizes. Tested using Chrome DevTools mobile simulation.

## Logging Middleware
A reusable Log function is implemented in the logging_middleware folder. It accepts stack, level, package, and message parameters and sends a POST request to the logging API with Bearer token authentication. Logging is integrated throughout the React app for the following events:
- App initialization
- Successful notification fetch
- Failed notification fetch
- Filter change
- Notification marked as viewed

## API Flow
1. App loads → Log initialization
2. Fetch notifications from API with Bearer token
3. Sort by priority and timestamp
4. Display top 10 notifications
5. User applies filter → update displayed list → log filter change
6. User clicks notification → mark as viewed → log viewed event