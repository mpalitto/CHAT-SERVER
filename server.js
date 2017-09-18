var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const sqlite3 = require('sqlite3').verbose();
let invitationsDB = new sqlite3.Database('./db/invitations.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the INVITATIOS SQlite database.');
});

// create INVITATIONS table
let sql = 'CREATE TABLE IF NOT EXISTS INVITATIONS ( userID TEXT PRIMARY KEY NOT NULL, invites TEXT NOT NULL)';
invitationsDB.serialize(function() {
  invitationsDB.run(sql, [], function(err) {
    if (err) {
      console.log('Error executing statement:', err, err.stack);
      //callback(err);
      return;
    }
    console.log('INVITATION DB created successfully!');

    //for testing only add a default invitation into the table
    sql = 'INSERT OR IGNORE INTO INVITATIONS (userID, invites) VALUES ("mpalitto@gmail.com", "{wife@gmail.com, FAMILY-BUDGET}")';
    invitationsDB.run(sql, [], function(err) {
      if (err) {
        console.log('Error executing statement:', err, err.stack);
        //callback(err);
        return;
      }
      console.log('first INVITATION ADDED successfully');
    });

  });
});

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

//app.get();

//all apps connect to the initial-connection for sending and receiving set-up communications
io.on('connection', function(socket){
  connections.push(socket);
  console.log('active connections: ' + connections.length);

  //disconnect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected, active connectionis remaining: ' + connections.length)
  });

  //first thing the app will send the userID and the groups it wants to join
  socket.on('user', function(user) {
    //join groups
    socket.join(user.groups);
    //check for invitations
  });

  // new invite for user
  socket.on('invite', function(invite){
    console.log('new invite received FOR: '+invite.FOR+' FROM: '+ invite.FROM);
    // sql = "INSERT OR IGNORE INTO INVITATIONS (userID, invites) VALUES (?, '{' || ? || ', ' || ? || '}')";
    // invitationsDB.run(sql, [invite.FOR, invite.FROM, invite.GROUP], function(err) {
    //   if (err) {
    //     console.log('Error executing statement:', err, err.stack);
    //     //callback(err);
    //     return;
    //   }
    //   console.log('new INVITATION ADDED successfully');
    // });
    sql = "INSERT OR IGNORE INTO INVITATIONS (userID, invites) VALUES ($for, '{' || $from || ', ' || $group || '}')";
    invitationsDB.run(sql, {$for: invite.FOR, $from: invite.FROM, $group: invite.GROUP}, function(err) {
      if (err) {
        console.log('Error executing statement:', err, err.stack);
        //callback(err);
        return;
      }
      console.log('new INVITATION ADDED successfully');
    });

    sql = "UPDATE INVITATIONS SET invites = invites || ', {' || $from || ', ' || $group || '}' WHERE userID = $for AND invites NOT LIKE '%{' || $from || ', ' || $group || '}%'";
    // //sql = 'UPDATE INVITATIONS SET invites = invites || ?, WHERE invites NOT LIKE "%?%"';
    invitationsDB.run(sql, {$for: invite.FOR, $from: invite.FROM, $group: invite.GROUP}, function(err) {
      if (err) {
        console.log('Error executing statement:', err, err.stack);
        //callback(err);
        return;
      }
      console.log('INVITATIONs UPDATED successfully');
    });

    //print on terminal list of invites
    sql = 'SELECT * FROM INVITATIONS ORDER BY userID';
    invitationsDB.each(sql, [], function(err, row) {
      if (err) {
        console.log('Error executing statement:', err, err.stack);
        //callback(err);
        return;
      }
      console.log(`--> ${row.userID} - ${row.invites}`);
    });
  });

  // are there any invites for client
  socket.on('anyInvites', function(user){
    console.log('new invites check request from: '+user.userID);
    sql = `SELECT userID userID,
      INVITES invites
      FROM INVITATIONS
      WHERE userID  = ?`;
    sql = 'SELECT * FROM INVITATIONS WHERE userID = ?';
    invitationsDB.each(sql, [user.userID], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      return row
         ? console.log('FOUND! ', row.userID, row.invites)
         : console.log(`No INVITE found for: ${user.userID}`);
     
    });    
  });

  //getting data from a client
  socket.on('message', function(data){
    console.log('new msg received from: '+data.from+' to: '+data.to+' cmd: '+data.cmd);

    io.sockets.emit('message', data);
  });
});
