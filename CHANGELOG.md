# Changelog

## [1.0.0] - 2020-03-24

Radical rewrite from bull-board project

### Features
* Introduce material-ui for better presentation on the frontend
* Dashboard for overviewing redis status and queue statuses
* Pie chart for presenting total success job / failed jobs
* Detail page for each queue
* Pagination for each of the queue and each statuses
* Detail view for Job details view
* Move error stack from Jobs list to Job detail view

###  Project Structure
* Remove typescript (for such small project, typescript is a kinda over-engineering, and it's tedious to fighting type coercing)
* Separate server and client folder to configure different rules for eslint
* Refactored the entry point for the app as a middleware-ish format, ditched `setQueue` style api
* Refactored API to match frontend list-detail structure

###  Devtools
* Removed dependency of ejs in favor of inline js template
* Use gitmoji as commit linter
* Automatically format code via lint-staged and prettier
* Adapted eslint-config-airbnb
* Enable react-hot-loader for better frontend dev experiences
* Use good old prop-types for prop validation in react

