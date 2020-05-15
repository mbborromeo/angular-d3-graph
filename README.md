# AngularD3

Live project URL:
https://mbborromeo.github.io/angular-d3-graph/

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1, and D3.js.

As a starting point, I heavily referred to the online tutorial 'Creating a responsive graph with Angular and D3' by Jean-Philippe Lemieux (https://medium.com/@jeanphilippelemieux/creating-a-responsive-graph-with-angular-and-d3-b45bb8065588).

However, I used an external CSV file from Public Health Infobase Canada (https://health-infobase.canada.ca/covid-19/) to get COVID-19 number of cases per state data, instead of a local JSON file.  

I also created my own filter options for the user.

*Note to self:  If you are using a local CSV file, make sure you use a relative path to the CSV file in the ./assets folder, because the path is for after the compilation/build (and not before).

## Development server

Run `ng serve` or `ng serve --open` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.  However, to build and deploy to GitHub Pages, see below.

## Deploy to GitHub Pages

Instead of the above build command, run `ng build --prod --base-href /angular-d3-graph/`.  This will build the project with a base HREF which will be the sub-directory of where your project will reside on the live GitHub Pages site.  The build artifacts will be stored in whichever directory has been specified in the 'outputPath' of the angular.json file.  Mine is currently set to the `docs/` directory.

As the build has generated new files locally, you need to:
- Add and commit the local changes `git add .`, `git commit -am '[description]'`
- Then EITHER push these changes on your branch to origin `git push -u origin [branch name]`, and submit a Pull Request for your branch to merge onto origin master branch via GitHub
- OR push these changes on your branch locally `git push -u [branch name]`, merge your branch to the local master branch first `git checkout master` and `git merge [branch name]`, fix merge conflicts if any, then push to origin master `git push -u origin master`
- Finally, in your GitHub project settings, choose the 'master docs' option for publishing on GitHub Pages

Resource: 
https://angular.io/guide/deployment#deploy-to-github-pages

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## To Do

- Add dropdown options for deaths, tested, recovered (and not just cases)
- Make mobile responsive (currently x-axis doesn't fit on mobile)
- Add some animation when user changes between filter options/province selections
- Use types correctly
- Add a loading graphic while CSV is being fetched (can be slow going through a proxy)
- Add labels on the graph axis
- Maybe swap graph axis so that y-axis are the running dates from newest to oldest, and x-axis is the number of cases
- Refactor so weekly date filter happens in Bar Chart component

## Extras

- Possibly show comparitive province data (not just one displayed at a time) by displaying overlapping chart data using 2 different colours for bars, or change to a line/dot graph
- Could also show overlapping deaths to number of cases, or cases to tests, etc.
- Maybe have a dashboard of multiple graphs, ie. show total cases of all provinces side-by-side
- For all provinces of latest date, provide options to switch between cases, deaths, etc.
- Try building a proxy to allow Cross-Origin fetching of resources