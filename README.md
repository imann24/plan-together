# PlanTogether
An app for planning outtings for groups of friends

## Develop Locally
1. Copy `example.env` and populate with secrets from the following services
    1. [OpenAI](https://platform.openai.com/docs/quickstart?context=node)
    1. [Auth0](https://auth0.com/docs/get-started)
    1. [Supabase](https://supabase.com/dashboard/projects)
    1. [Google Maps API](https://developers.google.com/maps/documentation/javascript/cloud-setup)
    1. [fly.io Hosted Redis](https://fly.io/docs/reference/redis/)
    1. [Mixpanel](https://docs.mixpanel.com/docs/tutorials/onboarding-overview)
1. `yarn install`
1. `yarn dev`

## Deploy
1. Set up `fly.io` account https://fly.io/docs/getting-started/
1. `fly deploy`

## TODO
- [x] Add Auth0 integration
- [x] Add download event
- [x] Implement dark/light mode toggle
- [x] Add save event to database
- [x] Parse timestamps returned by database to human readable strings
- [x] Add share event with public link
- [ ] on `/saved` page, pull down existing share links and replace `Share` button with an `Open` button
- [x] Add social media links to share link page
- [x] Improve GPT prompt and format to support multiple events in a single itinerary
- [ ] Export to Google Calendar
- [ ] Cache responses
    - [ ] Especially Supabase results on pub share page
- [x] Integrate with a database
- [ ] Add additional + optional fields
    - [ ] location radius on how far to search
    - [ ] time window on how long/much time user wants to spend
- [ ] Improve the rendering of the itinerary/standardize format
- [x] Support Setting an event date
- [ ] Improve timezone logic
- [ ] Look for a location services API, that can render image and metadata about a location
    - [x] Location websites
    - [ ] Location images
- [ ] If form gets too long, add pagination
- [ ] Allow for revisions to events
    - [ ] Manual
    - [ ] Follow-up prompts to GPT
- [ ] Add a delete Saved event button
- [x] Hide the navbar under the `/share/<share_slug>` path
- [ ] Add social media preview metadata to `/share/<share_slug>` path
- [ ] Add a button to sign in and create events on `/share/<share_slug>` path
- [ ] Save input configurations to regenerate further ideas
- [ ] Integrate with `react-add-to-calendar` https://www.npmjs.com/package/add-to-calendar-button-react
- [ ] Edit ChatGPT response for locations that are permanently clsoed
- [x] Add copy button to address in event details
- [ ] Consider supporting multiday events
- [x] Add MixPanel analytics
- [ ] Remember last input to prompt (on navigate away or switch tabs)
- [ ] Improve the social media metadata (OpenGraph) logic on share pages
    - [ ] DRY up code between page render and metadata gen
    - [ ] Strip markdown links out of messages
- [ ] Add a fuzzy string match check to see if Google Maps result is correct
- [x] Create about page
- [ ] After event has been saved on `Create` page, disable `Save` button on future reloads of page
- [ ] Solve bug where user sets values on form, reloads page, `Clear` form button doesn't work
