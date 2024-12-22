import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Calendar } from 'lucide-react'
import { SidebarProps } from '@/types'

export default function Sidebar({ events, onEventClick, onEventDelete }: SidebarProps) {
    const [filter, setFilter] = useState('')

    const allEvents = Object.entries(events).flatMap(([dateString, dayEvents]) =>
        dayEvents.map(event => ({ ...event, date: new Date(dateString) }))
    )

    const filteredEvents = allEvents.filter(event =>
        event.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Calendar className="mr-2" /> All Events
                </h2>
                <Input
                    placeholder="Filter events..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-4">
                    {filteredEvents.length === 0 ? (
                        <p className="text-gray-500 text-center">No events to display</p>
                    ) : (
                        filteredEvents.map((event) => (
                            <div key={event.id} className="mb-4 bg-gray-50 rounded-lg p-4 shadow-sm">
                                <div
                                    className="font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => onEventClick(event.date, event.id)}
                                >
                                    {event.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    {event.date.toDateString()} {event.startTime} - {event.endTime}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: event.color || '#e2e8f0' }}
                                    ></div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEventDelete(event.date, event.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}


