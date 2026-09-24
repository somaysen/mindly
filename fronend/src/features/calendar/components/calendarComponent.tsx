"use client";

import { Calendar } from '@fullcalendar/react'
import themePlugin from '@fullcalendar/react/themes/monarch'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import dayGridPlugin from '@fullcalendar/react/daygrid'

import './calender.css'
import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'

export function CalendarComponent() {
  return (
    <Calendar
      colorScheme='dark'
      plugins={[
        themePlugin,  
        timeGridPlugin,
        dayGridPlugin,
      ]}
      headerToolbar={{
        start: 'add today prev,next title',
        end: 'timeGridWeek,timeGridDay,dayGridMonth',
      }}
      buttons={{
        add: {
          text: 'Add Event',
          click() {
            alert('handle add event...')
          },
        }
      }}
      initialView='timeGridWeek'
    />
  )
}
