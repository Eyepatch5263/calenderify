import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EventModalProps } from '@/types'


export default function EventModal({ selectedDate, eventToEdit, onSave, onClose }: EventModalProps) {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#3b82f6') // Default to blue

  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name)
      setStartTime(eventToEdit.startTime)
      setEndTime(eventToEdit.endTime)
      setDescription(eventToEdit.description || '')
      setColor(eventToEdit.color || '#3b82f6')
    } else {
      // Reset form fields when adding a new event
      setName('')
      setStartTime('')
      setEndTime('')
      setDescription('')
      setColor('#3b82f6')
    }
  }, [eventToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: eventToEdit ? eventToEdit.id : Date.now().toString(),
      name,
      startTime,
      endTime,
      description,
      color,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {eventToEdit ? 'Edit Event' : 'Add Event'} for {selectedDate?.toDateString()}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Event Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="color" className="text-sm font-medium text-gray-700">Color</Label>
            <div className="flex items-center mt-1 space-x-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 p-0 border-none"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{eventToEdit ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

