Serenity Challenge API
======================


This is a reference implementation for serenity challenge API as described here http://www.topcoder.com/challenge-details/30045304/?type=develop


Appairy.io Documentation can be found at
- http://docs.challengeapi1.apiary.io/

DEMO HEROKU DEPLOYED APPLICATION PATH
- http://challenge-api.herokuapp.com/

To deploy on local machine
Change the configuration in config/env files
If localstorage is set to false then default storage will be AWS S3 service configure s3 credentials properly

....
From the root of the folder run 
npm install
To run the app
grunt
To run test case run
grunt mochaTest
....

To deploy on heroku
- From the root of project directory run
.............
heroku apps:create -a myapp
git push heroku master
.............

NOTE: The defafult upload configuration for heroku should be S3.