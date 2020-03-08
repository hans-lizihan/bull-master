# Changelog

## [1.0.0] - 2020-03-08

Radical rewrite from bull-board project

### Features
* Introduce material-ui for better presentation on the frontend
* Dashboard for overviewing redis status and queue statuses
* Pie chart for presenting total success job / failed jobs
* Detail page for each queue
* Batch action for selected jobs in the view
* Pagination for each of the queue and each statuses
* Detail view for Job details view
* Move error stack from Jobs list to Job detail view
* Allow customized configuration for setting headers in the frontend

###  Project Structure
* Remove typescript (for such small project, typescript is a kinda overengineering, and it's tedio to fighting type corecing)
* Seperate server and client folder to configure different rules for eslint
* Refactored the entry point for the app as a middleware-ish format, ditched `setQueue` style api
* Refactored API to match frontend list-detail structure

###  Devtools
* Removed dependency of ejs in favor of inline js template
* Use gitmoji as commit linter
* Automatically format code via lint-staged and prettier
* Intruduced testing for frontend (enzyme)
* Adpated eslint-config-airbnb
* Enable react-hot-loader for better frontend dev experiences
* Use good old prop-types for prop validation in react

