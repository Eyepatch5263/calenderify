import { DayProps } from '@/types'


export default function Day({ date, events, isCurrentMonth, isToday, isSelected, onClick }: DayProps) {
  const eventColor = events.length > 0 ? events[0].color : undefined;

  return (
    <div
    className={`h-12 md:h-24 p-1 md:p-2 border rounded-lg md:rounded-xl flex flex-col cursor-pointer transition-all duration-200 ease-in-out
      ${!isCurrentMonth ? 'opacity-50' : ''}
      ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
      ${isSelected ? 'ring-2 ring-blue-500' : ''}
    `}
    style={{ backgroundColor: eventColor || (isCurrentMonth ? 'white' : '#f3f4f6') }}
    onClick={onClick}
  >
    <div className={`text-right text-xs md:text-sm ${isToday ? 'font-bold text-blue-500' : 'text-gray-600'}`}>
      {date.getDate()}
    </div>
    <div className="flex justify-center items-center overflow-y-auto mt-1">
      {events.map((event) => (
        <div
          key={event.id}
          className="text-sm truncate mb-1 p-1 rounded-md hidden md:block"
        >
          {event.name}
        </div>
      ))}
      {events.length > 0 && (
        <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto md:hidden" />
      )}
    </div>
  </div>

  )
}

