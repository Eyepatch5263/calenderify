import { DayProps } from '@/types'


export default function Day({ date, events, isCurrentMonth, isToday, isSelected, onClick }: DayProps) {
  const eventColor = events.length > 0 ? events[0].color : undefined;

  return (
    <div
    className={`h-12 md:h-24 border rounded-lg md:rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all duration-200 ease-in-out
      ${!isCurrentMonth ? 'opacity-50' : ''}
      ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
      ${isSelected ? 'ring-2 ring-blue-500' : ''}
    `}
    style={{ backgroundColor: eventColor || (isCurrentMonth ? 'white' : '#f3f4f6') }}
    onClick={onClick}
  >
    <div className={`text-right text-xs md:text-sm ${isToday ? 'font-bold text-black' : 'text-gray-700'}`}>
      {date.getDate()}
    </div>
    <div className="flex justify-center items-center overflow-y-auto">
      {events.map((event) => (
        <div
          key={event.id}
          className="text-sm truncate flex flex-col items-center justify-center rounded-md md:block"
        >
          {event.name}
        </div>
      ))}
      
    </div>
  </div>

  )
}

