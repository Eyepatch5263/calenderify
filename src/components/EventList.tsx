import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from 'lucide-react'
import { EventListProps } from '@/types'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


export default function EventList({
    date,
    events,
    onEditEvent,
    onDeleteEvent,
    onClose,
}: EventListProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <VisuallyHidden>
                    <DialogTitle>Event for {date.toDateString()}</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <p>No events for this day.</p>
                    ) : (
                        <ul className="space-y-2">
                            {events.map((event) => (
                                <li
                                    key={event.id}
                                    className="flex items-center justify-between p-2 rounded"
                                    style={{ backgroundColor: event.color || '#e2e8f0' }}
                                >
                                    <div>
                                        <h3 className="font-semibold">{event.name}</h3>
                                        <p className="text-sm">
                                            {event.startTime} - {event.endTime}
                                        </p>
                                        {event.description && (
                                            <p className="text-sm">{event.description}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onEditEvent(event)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onDeleteEvent(event.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

