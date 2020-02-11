# Athena

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

It uses Angular 6 with Typescript, Material Design

## Development server

1. Copy the file `proxy.conf.json` to `../proxy.conf.sample.json`
2. Edit the file `../proxy.conf.json` and set the proper values for API Gateway configuration headers (Authorization, apikey, ...)  
3. Run `npm run start-local` for a dev server. 
4. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

NB: You can configure a `NPM` `Run Configuration` in [IntelliJ](https://www.jetbrains.com/help/idea/angular.html) with the following configuration:
 * `Command`: `run` 
 * `Scripts`: `start-local`

## Useful links for development

* [Angular 6 Documentation](https://v6.angular.io/docs)
* [Angular 6 Full Tutorial Source Code](https://v6.angular.io/generated/zips/toh-pt6/toh-pt6.zip)
* [Material Components for Angular 6](https://v6.material.angular.io/)
* [Material Icons](https://material.io/tools/icons/?style=baseline)

## Angular version update

1. Get the current Angular version by running `ng version`
1. Go to https://update.angular.io/ and follow instructions
2. Run `npm update`, if nothing goes wrong your package.json will be updated
3. Test in your local machine
4. Commit changes

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
