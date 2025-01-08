# PDXTech Calendar

https://www.pdxtech.io

Ruby 3.3.6
Rails 8.0.1

To seed data, run `bin/rails db:seed`

To troubleshoot database, run `rails console`

* From the console you can run `Event.all` to see all events
* Page through all events as an array `Event.all.to_a`

To run the dev server with auto-reload on saved files: `bin/dev`

Sample calendar for testing importing: https://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics