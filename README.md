# Get code
Open terminal and run:
```sh
git clone https://github.com/ronen-shachar/demo-end-to-end.git
```

# Import data
Open terminal and run:
```sh
$ mongoimport mongodb://127.0.0.1:27017/teslaDB -c cars server/teslaDB.cars.json
2024-06-15T19:13:56.977+0300    connected to: mongodb://127.0.0.1:27017/teslaDB
2024-06-15T19:13:57.101+0300    3 document(s) imported successfully. 0 document(s) failed to import.
```

# Install application dependencies
Open terminal and run
```sh
cd server && npm install
```



