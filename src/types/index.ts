export interface Event {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
    color?: string;
}

export interface EventModalProps {
    selectedDate: Date | null
    onSave: (event: Event) => void
    onClose: () => void
    eventToEdit: Event | null
}

export interface SidebarProps {
    events: Record<string, Event[]>
    onEventClick: (date: Date, eventId: string) => void
    onEventDelete: (date: Date, eventId: string) => void
}

export interface EventListProps {
    date: Date
    events: Event[]
    onDeleteEvent: (eventId: string) => void
    onEditEvent: (event: Event) => void
    onClose: () => void
    filterKeyword?: string
    onFilterChange?: (keyword: string) => void
}

export interface DayProps {
    date: Date
    events: Event[]
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
    onClick: () => void
}