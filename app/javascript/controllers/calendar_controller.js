import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    connect() {
        // Reset the initialization flag when the controller connects
        // This ensures the calendar works even when navigating back to the page
        window.calendarInitialized = false;

        this.initializeCalendar();
    }

    initializeCalendar() {
        // Only initialize once per page load
        if (window.calendarInitialized) return;

        this.calendarGrid = document.getElementById('calendar-grid');
        this.currentMonth = document.getElementById('current-month');
        this.prevMonthButton = document.getElementById('prev-month');
        this.nextMonthButton = document.getElementById('next-month');

        // If any required element is missing, exit early
        if (!this.calendarGrid || !this.currentMonth || !this.prevMonthButton || !this.nextMonthButton) return;

        // Mark as initialized to prevent duplicate initialization
        window.calendarInitialized = true;

        this.date = new Date();
        // Cache for event data to avoid redundant fetches
        this.eventCache = {};
        this.isNavigating = false;

        // Add event listeners
        this.prevMonthButton.addEventListener('click', this.debouncedPrevMonth.bind(this));
        this.nextMonthButton.addEventListener('click', this.debouncedNextMonth.bind(this));

        // Initialize calendar
        this.renderCalendar().then(() => {
            this.preloadAdjacentMonths();
        });
    }

    // Debounce function to prevent multiple rapid requests
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    debouncedPrevMonth = this.debounce(() => {
        this.date.setMonth(this.date.getMonth() - 1);
        this.renderCalendar();
    }, 300);

    debouncedNextMonth = this.debounce(() => {
        this.date.setMonth(this.date.getMonth() + 1);
        this.renderCalendar();
    }, 300);

    // Fetch all events for a specific month in a single request
    async fetchMonthEvents(year, month) {
        const cacheKey = `${year}-${month}`;

        // Return cached data if available
        if (this.eventCache[cacheKey]) {
            return this.eventCache[cacheKey];
        }

        // Format date for API - first and last day of month
        const firstDay = `${year}-${month + 1}-1`;
        const lastDay = `${year}-${month + 1}-${new Date(year, month + 1, 0).getDate()}`;

        try {
            const response = await fetch(`/events/month?start=${firstDay}&end=${lastDay}`);
            const data = await response.json();

            // Cache the results
            this.eventCache[cacheKey] = data;
            return data;
        } catch (error) {
            console.error('Error fetching events:', error);
            return { events: [] };
        }
    }

    async renderCalendar() {
        if (this.isNavigating) return;
        this.isNavigating = true;

        this.calendarGrid.innerHTML = '';
        const year = this.date.getFullYear();
        const month = this.date.getMonth();

        this.currentMonth.textContent = this.date.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fetch all events for this month in one request
        const monthEvents = await this.fetchMonthEvents(year, month);

        // Create a map of days with events for quick lookup
        const daysWithEvents = {};
        if (monthEvents && monthEvents.events) {
            monthEvents.events.forEach(event => {
                const eventDate = new Date(event.start_time);
                if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
                    const day = eventDate.getDate();
                    daysWithEvents[day] = true;
                }
            });
        }

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            this.calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            dayCell.className = 'text-center p-2 border rounded';

            // Highlight days with events using our cached data
            if (daysWithEvents[day]) {
                dayCell.classList.add('bg-green2', 'text-white', 'cursor-pointer', 'hover:bg-green3');

                // Add click event to navigate to day-specific events page
                dayCell.addEventListener('click', () => {
                    const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    window.location.href = `/events/day/${formattedDate}`;
                });
            }

            this.calendarGrid.appendChild(dayCell);
        }

        this.isNavigating = false;
    }

    // Optional: Preload adjacent months
    async preloadAdjacentMonths() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();

        // Preload previous month
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;

        // Preload next month
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;

        // Fetch in background
        this.fetchMonthEvents(prevYear, prevMonth);
        this.fetchMonthEvents(nextYear, nextMonth);
    }
}