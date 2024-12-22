'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { DAYS_OF_WEEK, getDaysInMonth, getMonthYear } from '../lib/utils'
import Day from './Day'
import EventModal from './EventModal'
import EventList from './EventList'
import Sidebar from './Sidebar'
import { useToast } from "@/hooks/use-toast"
import { Event } from '@/types'
import { saveAs } from 'file-saver'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'


export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [events, setEvents] = useState<Record<string, Event[]>>({})
    const [showEventModal, setShowEventModal] = useState(false)
    const [showEventList, setShowEventList] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
    const { toast } = useToast()
    useEffect(() => {
        const storedEvents = localStorage.getItem('calendarEvents')
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('calendarEvents', JSON.stringify(events))
    }, [events])

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const handleDayClick = (date: Date) => {
        setSelectedDate(date)
        const dateKey = date.toISOString().split('T')[0]
        if (events[dateKey] && events[dateKey].length > 0) {
            setShowEventList(true)
        } else {
            setShowEventModal(true)
        }
    }

    const handleSaveEvent = (event: Event) => {
        if (selectedDate) {
            const dateKey = selectedDate.toISOString().split('T')[0]
            const updatedEvents = { ...events }

            if (!updatedEvents[dateKey]) {
                updatedEvents[dateKey] = []
            }

            if (eventToEdit) {
                updatedEvents[dateKey] = updatedEvents[dateKey].map(e =>
                    e.id === eventToEdit.id ? event : e
                )
            } else {
                if (updatedEvents[dateKey].length === 0) {
                    updatedEvents[dateKey].push(event)
                } else {
                    toast({
                        title: "Cannot add event",
                        description: "Only one event per day is allowed.",
                        variant: "destructive",
                    })
                    return
                }
            }
            setEvents(updatedEvents)
            setShowEventModal(false)
            setEventToEdit(null)
            toast({
                title: eventToEdit ? "Event updated" : "Event added",
                description: `Your event has been successfully ${eventToEdit ? 'updated' : 'added'}.`,
            })
        }
    }

    const handleEditEvent = (event: Event) => {
        setEventToEdit(event)
        setShowEventList(false)
        setShowEventModal(true)
    }

    const handleDeleteEvent = (eventId: string) => {
        if (selectedDate) {
            const dateKey = selectedDate.toISOString().split('T')[0]
            const updatedEvents = { ...events }
            updatedEvents[dateKey] = updatedEvents[dateKey].filter(e => e.id !== eventId)
            setEvents(updatedEvents)
            setShowEventList(false)
            toast({
                title: "Event deleted",
                description: "Your event has been successfully deleted.",
            })
        }
    }

    const handleSidebarEventClick = (date: Date) => {
        setSelectedDate(date)
        setShowEventList(true)
        setIsSidebarOpen(false)

    }

    const handleSidebarEventDelete = (date: Date, eventId: string) => {
        const dateKey = date.toISOString().split('T')[0]
        const updatedEvents = { ...events }
        updatedEvents[dateKey] = updatedEvents[dateKey].filter(e => e.id !== eventId)
        setEvents(updatedEvents)
        toast({
            title: "Event deleted",
            description: "Your event has been successfully deleted.",
        })
    }

    const eventsForSelectedDate = selectedDate ?
        (events[selectedDate.toISOString().split('T')[0]] || []) : []

    const exportToJSON = () => {
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const monthlyEvents: Event[] = []

        for (const dateStr in events) {
            const date = new Date(dateStr)
            if (date.getMonth() + 1 === month && date.getFullYear() === year) {
                monthlyEvents.push(...events[dateStr])
            }
        }

        const dataStr = JSON.stringify(monthlyEvents, null, 2)
        const blob = new Blob([dataStr], { type: "application/json" })
        saveAs(blob, `events-${month}-${year}.json`)
    }

    const exportToCSV = () => {
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const monthlyEvents: Event[] = []

        for (const dateStr in events) {
            const date = new Date(dateStr)
            if (date.getMonth() + 1 === month && date.getFullYear() === year) {
                monthlyEvents.push(...events[dateStr])
            }
        }

        const headers = ["id", "name", "startTime", "endTime", "description", "color"]
        const rows = monthlyEvents.map(event => headers.map(header => (event as any)[header]).join(","))
        const csvContent = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        saveAs(blob, `events-${month}-${year}.csv`)
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden md:block w-80 border-r border-gray-200 bg-white overflow-y-auto">
                <Sidebar
                    events={events}
                    onEventClick={handleSidebarEventClick}
                    onEventDelete={handleSidebarEventDelete}
                />
            </div>

            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button className='mt-4 ml-2' variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                    <Sidebar
                        events={events}
                        onEventClick={handleSidebarEventClick}
                        onEventDelete={handleSidebarEventDelete}
                    />
                </SheetContent>
            </Sheet>

            <div className="flex-grow p-4 md:p-8 overflow-y-auto">
                <Card className="w-full max-w-4xl mx-auto shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4 md:mb-8">
                            <div className="md:hidden">
                            </div>
                            <h2 className="text-xl md:text-3xl font-bold text-gray-800">{getMonthYear(currentDate)}</h2>
                            <div className="flex space-x-2 md:space-x-4">
                                <Button onClick={handlePrevMonth} variant="outline" size="icon" className="rounded-full">
                                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                                <Button onClick={handleNextMonth} variant="outline" size="icon" className="rounded-full">
                                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2 md:mb-4">
                            {DAYS_OF_WEEK.map(day => (
                                <div key={day} className="text-center font-semibold text-gray-600 text-xs md:text-sm">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 md:gap-4">
                            {daysInMonth.map((date) => (
                                <Day
                                    key={date.toISOString()}
                                    date={date}
                                    events={events[date.toISOString().split('T')[0]] || []}
                                    isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                                    isToday={date.toDateString() === new Date().toDateString()}
                                    isSelected={selectedDate?.toDateString() === date.toDateString()}
                                    onClick={() => handleDayClick(date)}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <div className="flex justify-end mr-5 space-x-2 mb-4">
                        <Button className='p-5' onClick={exportToJSON}>Export JSON</Button>
                        <Button className='p-5' variant={"outline"} onClick={exportToCSV}>Export CSV</Button>
                    </div>
                </Card>
            </div>

            {showEventModal && selectedDate && (
                <EventModal
                    selectedDate={selectedDate}
                    eventToEdit={eventToEdit}
                    onSave={handleSaveEvent}
                    onClose={() => {
                        setShowEventModal(false)
                        setEventToEdit(null)
                    }}
                />
            )}
            {showEventList && selectedDate && (
                <EventList
                    date={selectedDate}
                    events={eventsForSelectedDate}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onClose={() => setShowEventList(false)}
                />
            )}
        </div>
    )
}







