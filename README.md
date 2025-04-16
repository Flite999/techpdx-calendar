# TechPDX Calendar

https://www.techpdx.io
Version 0.3.0

Ruby 3.3.6
Rails 8.0.1

To seed data, run `bin/rails db:seed`

To clear the db, run `bin/rails db:drop db:create db:migrate`

To troubleshoot database, run `rails console`

To edit the credential file for local testing: `bin/rails credentials:edit`

To set env vars in Heroku: `heroku config:set ENV_VAR=ENV_VALUE`

* From the console you can run `Event.all` to see all events
* Page through all events as an array `Event.all.to_a`

To run the dev server with auto-reload on saved files: `bin/dev`

Sample calendar for testing importing: https://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics

Heroku cmds:
* `heroku login`
* `git push heroku main`
* `heroku run rails db: migrate`
* `heroku run rails console`
* `heroku logs --tail`