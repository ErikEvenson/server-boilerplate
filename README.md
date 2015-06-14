# server-boilerplate

A server boilerplate.  See the `technology_stack.md` document to find out what versions of software are known to be compatible.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/), [bower](http://bower.io), and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.  A working vagrant devbox that supports this app is avaiable at [https://github.com/ErikEvenson/devbox](https://github.com/ErikEvenson/devbox).

```sh
$ git clone git@github.com:ErikEvenson/server-boilerplate.git # or clone your own fork
$ cd server-boilerplate
$ npm install
$ bower install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
