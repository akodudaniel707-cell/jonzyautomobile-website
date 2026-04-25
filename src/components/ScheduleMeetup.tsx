import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface ScheduleMeetupProps {
  onSchedule: (details: { date: string; time: string; location: string }) => void;
  onClose: () => void;
}

const ScheduleMeetup: React.FC<ScheduleMeetupProps> = ({ onSchedule, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSchedule = () => {
    if (date && time && location) {
      onSchedule({ date, time, location });
      onClose();
    }
  };

  const suggestedTimes = ['10:00 AM', '2:00 PM', '5:00 PM'];
  const suggestedLocations = ['Your location', 'My location', 'Public meeting spot'];

  return (
    <Card className="p-4 m-4 bg-green-50 border-green-200">
      <div className="flex items-center mb-3">
        <Calendar className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="font-semibold text-green-800">Schedule Meetup</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
            <Calendar className="w-4 h-4 mr-1" />
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
            <Clock className="w-4 h-4 mr-1" />
            Time
          </label>
          <div className="flex gap-2 mb-2">
            {suggestedTimes.map((suggestedTime, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setTime(suggestedTime)}
                className="text-xs"
              >
                {suggestedTime}
              </Button>
            ))}
          </div>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
            <MapPin className="w-4 h-4 mr-1" />
            Location
          </label>
          <div className="flex gap-2 mb-2">
            {suggestedLocations.map((loc, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setLocation(loc)}
                className="text-xs"
              >
                {loc}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Enter meeting location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSchedule}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!date || !time || !location}
          >
            Schedule
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleMeetup;