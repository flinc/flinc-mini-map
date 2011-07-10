# flinc mini map

This is a small web app powered by node.js, express.js, backbone.js and the pusher.com service. It's designed to work on heroku. :)

## Environment Variables

You need to set the following environment variables:

* `PUSHER_APP_ID` - Pusher credentials (you get these from pusher.com or via the heroku addon)

* `PUSHER_KEY` - see above

* `PUSHER_SECRET` - see above

* `FLINC_MINI_MAP_EMAILS` - A string of email addresses, concatenated with pipes`, like `user1@example.org|user2@example.org|user3@example.org`. These are used the identify the drivers of the car. Also each car gets a gravatar image based on its current driver's email address.