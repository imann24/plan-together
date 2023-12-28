# PlanTogether
An app for planning outtings for groups of friends

## Develop Locally
1. Copy `example.env` and populate with secrets from the following services
    1. [OpenAI](https://platform.openai.com/docs/quickstart?context=node)
    1. [Auth0](https://auth0.com/docs/get-started)
    1. [Supabase](https://supabase.com/dashboard/projects)
1. `yarn install`
1. `yarn dev`

## TODO
- [x] Add Auth0 integration
- [x] Add download event
- [x] Implement dark/light mode toggle
- [x] Add save event to database
- [x] Parse timestamps returned by database to human readable strings
- [x] Add share event with public link
- [ ] on `/saved` page, pull down existing share links and replace `Share` button with an `Open` button
- [x] Add social media links to share link page
- [ ] Improve GPT prompt and format to support multiple events in a single itinerary
- [ ] Export to Google Calendar
- [ ] Cache responses
- [x] Integrate with a database
- [ ] Add additional + optional fields
- [ ] Improve the rendering of the itinerary/standardize format
- [ ] Support Setting an event date
- [ ] Improve timezone logic
- [ ] Look for a location services API, that can render image and metadata about a location
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
