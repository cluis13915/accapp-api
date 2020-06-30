## Technologies

Framework: Express
DB manager: MongoDB

## Setup
### Setup database
1. Install mongodb.
2. Create the user used by the application.
```bash
$ mongo
> use db_name
> db.createUser({ user: 'username', pwd: 'password', roles: ['dbOwner']})
```
3. Enable db security. Open the config file `/etc/mongodb.conf` and uncomment the following line:
```
...
auth = true
...
```
3. Restart mongod service
```bash
$ sudo systemctl restart mongod
```

## Run server
### Create env variables.
* PORT (default 3000)
* DB_HOST (default 'localhost')
* DB_PORT (default '27017')
* DB_NAME (default 'accapp')
* DB_USER (default 'admin')
* DB_PASSWORD (default 'admin')

### Run with nodemon
```bash
$ sudo systemctl start mongod
$ nodemon start
```

## DB Management
### Use the mongo shell
```bash
$ mongo --authenticationDatabase db_name -u username -p password
> use db_name
```
