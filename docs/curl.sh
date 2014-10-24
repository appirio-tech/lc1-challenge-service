#HOST="http://localhost:10010"


# 1. get all challenges

#curl http://localhost:10010/challenges
#echo '\n'

# 2.  create  challenges
MYPATH="/challenges"
URL=$HOST$MYPATH






# init section

#psql -c 'drop database travis_ci_test'  -U postgres


#echo $BODY

# 2.1
# curl -H "Content-Type: application/json" -d '{"title": "minimal", "status": "DRAFT" }' $URL


#2.3 Create a full challenge Draft challenge  (A1)

curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
  "regStartAt": "2014-10-1",
  "subEndAt": "2014-10-7",
  "title": "One challenge to rule them all",
  "overview": "This is the first challenge, it is a draft",
  "description": "We are looking for a little more than just adding a pg module, this is a draft",
  "tags": ["mean", "postgresql", "jsonb"],
  "status": "DRAFT"
}' $URL

#2.3 Create a full challenge Asctive challenge  (A2)

curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
  "regStartAt": "2014-10-2",
  "subEndAt": "2014-10-22",
  "title": "Two to Tango",
  "overview": "teach us to dance",
  "description": "write a document to teach us to dance",
  "tags": ["postgresql", "jsonb"],
  "status": "SUBMISSION"
}' $URL

#2.3 Create a full challenge Review challenge  (A3)

curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
  "regStartAt": "2014-08-29",
  "subEndAt": "2014-09-13",
  "title": "Three is a magic number",
  "overview": "teach us to magic",
  "description": "Write a doc about magic",
  "tags": ["postgresql"],
  "status": "REVIEW"
}' $URL

#2.3 Create a full challenge complete challenge  (A3)

curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
  "regStartAt": "2014-07-1",
  "subEndAt": "2014-07-17",
  "title": "Four on the Floor",
  "overview": "learn to drive a stick",
  "description": "Create an architecture to describe how a manual transmision automobile works",
  "tags": ["postgresql"],
  "status": "COMPLETE"
}' $URL

#psql -c 'select count(*) from challenges;'  -d travis_ci_test  -U postgres
psql -c 'select id, title from challenges;'  -d travis_ci_test  -U postgres
