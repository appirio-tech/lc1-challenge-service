HOST="http://localhost:10010"
#HOST="http://lc1-challenge-service.herokuapp.com"


#clear the screen
clear


# SECTION 0. set up what to do
MYPATH="/challenges"
URL=$HOST$MYPATH
INIT=false
CREATE_CHALLENGES=false
ADD_PARTICPANTS=false
ADD_CHALLENGE_FILE=false
ADD_SUBMISSION=false
ADD_SUBMISSION_FILES=false
ADD_REQUIREMENTS=false
ADD_SCORECARD=false
ADD_SCORECARD_ITEMS=false

if  [ $INIT = "false" ] &&  [ $CREATE_CHALLENGES = "false" ] && [ $ADD_PARTICPANTS = "false" ] \
  && [ $ADD_CHALLENGE_FILE = "false" ] && [ $ADD_SUBMISSION = "false" ] && [ $ADD_SUBMISSION_FILES = "false" ] \
  &&  [ $ADD_REQUIREMENTS = "false" ]   &&  [ $ADD_SCORECARD = "false" ] &&  [ $ADD_SCORECARD_ITEMS = "false" ] ; then
  echo 'You must set one var to be true, see Section 0 in the script  \n '
fi

# SECTION 1 DB init
if [ $INIT = "true" ]; then
 psql -c 'DROP DATABASE IF EXISTS travis_ci_test;' -U postgres
  psql -c 'create database  travis_ci_test;' -U postgres
  cd ..
  grunt dbmigrate
 #exit 0
fi


# Section 2 Create Challenges
if [ $CREATE_CHALLENGES = "true" ]; then


  # 1.1 Create a full challenge Draft challenge  (A1)
  echo 'creating four challenges'

  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "regStartAt": "2014-10-1",
    "subEndAt": "2014-10-7",
    "title": "One challenge to rule them all",
    "overview": "This is the first challenge, it is a draft",
    "description": "We are looking for a little more than just adding a pg module, this is a draft",
    "tags": ["mean", "postgresql", "jsonb"],
    "status": "DRAFT",
    "account": "Singlilo",
    "accountId": "100",
    "prizes": [1600.00, 1000.00, 500.50],
    "source": "lc"
  }' $URL

  # 1.2 Create a full challenge Asctive challenge  (A2)

  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "regStartAt": "2014-10-2",
    "subEndAt": "2014-10-22",
    "title": "Two to Tango",
    "overview": "teach us to dance",
    "description": "write a document to teach us to dance",
    "tags": ["postgresql", "jsonb"],
    "status": "SUBMISSION",
    "account": "Twolio in",
    "accountId": "200",
    "prizes": [1002, 502],
    "source": "lc"
  }' $URL

  # 1.3 Create a full challenge Review challenge  (A3)

  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "regStartAt": "2014-08-29",
    "subEndAt": "2014-09-13",
    "title": "Three is a magic number",
    "overview": "teach us to magic",
    "description": "Write a doc about magic",
    "tags": ["postgresql"],
    "status": "REVIEW",
    "account": "Three Guys Co",
    "accountId": "300",
    "prizes": [3000],
    "source": "tc",
    "sourceId": "123xx456x789"
  }' $URL

  #1.4 Create a full challenge complete challenge  (A3)

  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "regStartAt": "2014-07-1",
    "subEndAt": "2014-07-17",
    "title": "Four on the Floor",
    "overview": "learn to drive a stick",
    "description": "Create an architecture to describe how a manual transmision automobile works",
    "tags": ["postgresql"],
    "status": "COMPLETE",
    "account": "Fourpols",
    "accountId": "400",
    "prizes": [4000, 400, 40, 4, 1],
    "source": "tc",
    "sourceId": "123xx456x789"
  }' $URL


  psql -c 'select id, title from challenges;'  -d travis_ci_test  -U postgres

fi

# Section 3: add participants:
if [ $ADD_PARTICPANTS = "true" ]; then
  echo 'Adding Particpants'

  echo 'Adding owners to all four'

  RESOURCE="/1/participants"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "owner", "userId": 1 }' $URL$RESOURCE

  echo 'Adding reviews, submitters and watchers to 2,3,4'

  RESOURCE="/2/participants"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "owner", "userId": 1 }' $URL$RESOURCE

  RESOURCE="/3/participants"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "owner", "userId": 1 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "reviewer", "userId": 20 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "submitter", "userId": 30 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "watcher", "userId": 40 }' $URL$RESOURCE

  RESOURCE="/4/participants"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "owner", "userId": 1 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "reviewer", "userId": 20 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "submitter", "userId": 30 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "watcher", "userId": 40 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "submitter", "userId": 50 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "role": "watcher", "userId": 60 }' $URL$RESOURCE

fi


# Section 4 Add cHallenge files (not submission Files)
if [ $ADD_CHALLENGE_FILE = "true" ]; then
  echo 'Adding challenge Files'

  RESOURCE="/1/files"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
  "title": "The Highlander Challenge Guidelines",
  "filePath": "/uploads/challengeId/",
  "size": 123,
  "fileName": "swords_forTheGatering.zip",
  "storageLocation": "local"
  }' $URL$RESOURCE

  RESOURCE="/2/files"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
  "title": "Tango: Distributed Data Structures over a Shared Log",
  "filePath": "www.cs.cornell.edu/~taozou/sosp13/tangososp.pdf",
  "size": 123,
  "fileName": "tangososp.pdf",
  "storageLocation": "local"
  }' $URL$RESOURCE

  RESOURCE="/3/files"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
  "title": "Magic Tricks for the Beginning Magician",
  "filePath": "http://umclidet.com/pdf/Magic.Tricks.for.the.Beginning.Magician.pdf",
  "size": 123,
  "fileName": "Magic.Tricks.for.the.Beginning.Magician.pdf",
  "storageLocation": "local"
  }' $URL$RESOURCE

  RESOURCE="/4/files"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
  "title": "Learning to drive a manual car",
  "filePath": "http://www.driverighttraining.com.au/docs/How-to-Drive-a-Manual-Car.pdf",
  "size": 123,
  "fileName": "How-to-Drive-a-Manual-Car.pdf",
  "storageLocation": "local"
  }' $URL$RESOURCE

fi

# Section 5 Add Submission
if [ $ADD_SUBMISSION = "true" ]; then

  RESOURCE="/3/submissions"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "submitterId": 30 }' $URL$RESOURCE

  RESOURCE="/4/submissions"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "submitterId": 30 }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{ "submitterId": 50 }' $URL$RESOURCE


fi

# Section 6 Add a submission File
if [ $ADD_SUBMISSION_FILES = "true" ]; then
  RESOURCE="/3/submissions/1/files"
  echo '\n Add a summision file for chal 3 submission 1'
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "title": "user 30 sbumission - Magic My way",
    "filePath": "/uploads/challengeId/",
    "size": 123,
    "fileName": "magiclLesson1.zip",
    "storageLocation": "local"
  }'  $URL$RESOURCE

    RESOURCE="/4/submissions/2/files"
    echo '\n Add a summision file for chal 4 submission 2'
    curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "title": "user 50 sbumission -the manual transmission a beginners guide",
    "filePath": "/uploads/challengeId/",
    "size": 123,
    "fileName": "src.zip",
    "storageLocation": "local"
  }'  $URL$RESOURCE

    RESOURCE="/4/submissions/3/files"
    echo '\n Add a summision file for chal 4 submission 3'
    curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "title": "How to drive a stick - Magic My way user50",
    "filePath": "/uploads/challengeId/",
    "size": 123,
    "fileName": "learnStick.zip",
    "storageLocation": "local"
  }'  $URL$RESOURCE
fi

# Section 7 add requirments
if [ $ADD_REQUIREMENTS = "true" ]; then

  RESOURCE="/1/requirements"
  echo '\n Add a requirments for challenge 1 challenge to rule them all \n'
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 1,
    "requirementText": "An immortal Scottish swordsman must confront the last of his immortal opponent, a murderously brutal barbarian who lusts for the fabled Prize.   Define the prize "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 1,
    "requirementText": "Describe the most ultimate soundtrack by British Rockstars Queen"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 1,
    "requirementText": "Define the actual meaning of the word Kurgen "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 1,
    "requirementText": "The Kurgens voice can be found in what popular modern cartoon, and the spokesmen for what Home imporment store "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 1,
    "requirementText": "Name the type of sword found by the NY police department by a severed head "
  }' $URL$RESOURCE


  RESOURCE="/2/requirements"
  echo '\n Add a requirments for challenge 2 2 tango \n'
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 2,
    "requirementText": "Describe the history of the Tango "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 2,
    "requirementText": "Who played Tango and Cash"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 2,
    "requirementText": "Who said The secret of tango is in the moment of improvisation that happens between step and step. It is to make the impossible thing possible: to dance silence. "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 2,
    "requirementText": "What movie am I thinking of:  Marlon Brando and Maria Schneider"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 2,
    "requirementText": "What two cultures influenced this provatice dance which is the latin word for touch"
  }' $URL$RESOURCE

  RESOURCE="/3/requirements"
  echo '\n Add a requirments for challenge 3 is a magic number \n'
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 3,
    "requirementText": "What 1973 educational cartoon  wrote this song and who is the original singer"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 3,
    "requirementText": "What 90 grunge band made this song rock"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 3,
    "requirementText": "A man and a woman had a little baby.   Complete this verse "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 3,
    "requirementText": "What number am I thinking of"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 3,
    "requirementText": "Translate 3 into as many languages as you can."
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 3,
    "requirementText": "Name every object portraied in this video"
  }' $URL$RESOURCE

  RESOURCE="/4/requirements"
  echo '\n Add a requirments for challenge 4 on the floor \n'
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 4,
    "requirementText": "Describe how to start a manual car without a battery"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 4,
    "requirementText": "Describe the different configurations of a manual tranmssion"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 4,
    "requirementText": "Guess how many cars I have owned with a stick shift "
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 4,
    "requirementText": "What is the name of the pedel that cars with automatic transmissions dont have,   What is its purpose?"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 4,
    "requirementText": "Describe the purpose of the Tachometer"
  }' $URL$RESOURCE
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"   -d '{
    "challengeId": 4,
    "requirementText": "Describe how a manual transmission can slow a car down without the breaks."
  }' $URL$RESOURCE





fi


# Section 8, Create an empty scorecard for challenge 3 and 4
if [ $ADD_SCORECARD = "true" ]; then
  echo '\n createing empty scorecards for challnge 3 is a magic number, submmsion 1 and reviewer 20 \n'
  RESOURCE="/3/scorecards"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "status": "VALID",
    "reviewerId": 20,
    "submissionId": 1
  }' $URL$RESOURCE
  echo '\n createing empty scorecards for challnge 4 on the floor, submmsion 2 and reviewer 20 \n'
  RESOURCE="/4/scorecards"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "status": "VALID",
    "reviewerId": 20,
    "submissionId": 2
  }' $URL$RESOURCE
  echo '\n createing empty scorecards for challnge 4 on the floor, submmsion 3 and reviewer 20 \n'
  RESOURCE="/4/scorecards"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
    "status": "VALID",
    "reviewerId": 20,
    "submissionId": 3
  }' $URL$RESOURCE

fi

# Section 9.  Add scorecard tiems for the competed challenge number 4
if [ $ADD_SCORECARD_ITEMS = "true" ]; then
  # note the requirementText does not save and not part of the model
  echo '\n trying to create scorecard item for challenge 4 scorecard 2 req#17 \n'
  RESOURCE="/4/scorecards/2/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 17,
    "scorecardId": 2,
    "requirementText": "Describe how to start a manual car without a battery",
    "score": 92,
    "comment": "yes you are right it help if you park on a hill."
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 2 req#18 \n'
  RESOURCE="/4/scorecards/2/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 18,
    "scorecardId": 2,
    "requirementText": "Describe the different configurations of a manual tranmssion",
    "score": 70,
    "comment": "Pretty good but you forgot three on the tree."
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 2 req#19 \n'
  RESOURCE="/4/scorecards/2/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 19,
    "scorecardId": 2,
    "requirementText": "Guess how many cars I have owned with a stick shift",
    "score": 25,
    "comment": "Nice try but the answer is 4, Two Saab 9-3s, a 79 JEEP CJ-5 Golden Eagle, and a Honda Civic, that poped out of 1st and 5th"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 2 req#20 \n'
  RESOURCE="/4/scorecards/2/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 20,
    "scorecardId": 2,
    "requirementText": "What is the name of the pedel that cars with automatic transmissions dont have, What is its purpose?",
    "score": 98,
    "comment": "Yes, good level of detail."
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 2 req#21 \n'
  RESOURCE="/4/scorecards/2/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 21,
    "scorecardId": 2,
    "requirementText": "Describe the purpose of the Tachometer",
    "score": 70,
    "comment": "I could have used a little more detail"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 2 req#22 \n'
  RESOURCE="/4/scorecards/2/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 22,
    "scorecardId": 2,
    "requirementText": "Describe how a manual transmission can slow a car down without the breaks.",
    "score": 98,
    "comment": "Good description of down shifting, I like you secotion on the Jake Brake"
  }' $URL$RESOURCE


  ## now create the scorecard items for 4/3

  echo '\n trying to create scorecard item for challenge 4 scorecard 3 req#17 \n'
  RESOURCE="/4/scorecards/3/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 17,
    "scorecardId": 3,
    "requirementText": "Describe how to start a manual car without a battery",
    "score": 25,
    "comment": "It is called push start and it can be done"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 3 req#18 \n'
  RESOURCE="/4/scorecards/3/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 18,
    "scorecardId": 3,
    "requirementText": "Describe the different configurations of a manual tranmssion",
    "score":100,
    "comment": "Perfect"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 3 req#19 \n'
  RESOURCE="/4/scorecards/3/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 19,
    "scorecardId": 3,
    "requirementText": "Guess how many cars I have owned with a stick shift",
    "score": 100,
    "comment": "Good guess 4 is right"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 3 req#20 \n'
  RESOURCE="/4/scorecards/3/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 20,
    "scorecardId": 3,
    "requirementText": "What is the name of the pedel that cars with automatic transmissions dont have, What is its purpose?",
    "score": 97,
    "comment": "Yes,Clutch is right, good explicantion"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 3 req#21 \n'
  RESOURCE="/4/scorecards/3/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 21,
    "scorecardId": 3,
    "requirementText": "Describe the purpose of the Tachometer",
    "score": 100,
    "comment": "Perfect"
  }' $URL$RESOURCE
  echo '\n trying to create scorecard item for challenge 4 scorecard 3 req#22 \n'
  RESOURCE="/4/scorecards/3/scorecardItems"
  curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
    "requirementId": 22,
    "scorecardId": 3,
    "requirementText": "Describe how a manual transmission can slow a car down without the breaks.",
    "score": 98,
    "comment": "Good Job"
  }' $URL$RESOURCE



fi
