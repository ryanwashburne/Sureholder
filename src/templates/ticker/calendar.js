import React from 'react'

export default ({ admin, events = [] }) => {
  return (
    <div className="py-2">
      <h2 className="text-xl font-bold mb-1">Upcoming Calendar Events</h2>
      {events.map(({ title, date }, i) => {
        return (
          <div className="bg-white rounded p-3 mb-4 shadow" key={i}>
            <h3>{title}</h3>
            <p>{date}</p>
          </div>
        )
      })}
      {events.length === 0 &&
        <div>
          <h3>No events found.</h3>
        </div>
      }
      <button className="btn">See Full Calendar</button>
      {admin &&
        <div>
          <button className="btn--outlined--secondary">Add Event</button>
        </div>
      }
    </div>
  )
}