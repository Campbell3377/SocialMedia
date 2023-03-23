import express from "express"
import mysql from "mysql"

const app = express()
var PORT = 5501

const mysql_pool = mysql.createPool({
    connectionLimit: 100,
    host:"10.20.253.2",
    user:"root",
    password:"Password23644.",
    database:"social"
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.json("Hello this is the backend")
})
//Gets full users table
app.get("/users", (req,res)=>{
    console.log("API CALL: /users -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
	    connection.query("SELECT * FROM users", function(err, rows){
            if (err) return res.json(err)  
            return res.json(rows);
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})


app.post("/users", (req,res)=>{
    console.log("API CALL: /users -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
        const values = [req.body.firstName, req.body.lastName, req.body.email, req.body.dob, req.body.hometown, req.body.gender, req.body.password]
	    connection.query("INSERT INTO users (`firstName`, `lastName`, `email`, `dob`, `hometown`, `gender`, `password`) VALUES (?);", [values], function(err, rows){
            if (err) return res.json(err)  
            return res.json("User has been created.");
        })
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

app.post("/users/:id", (req,res)=>{
    mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		// const q = "UPDATE users SET `firstName` = ?, `lastName` = ?, `hometown` = ?, `gender` = ?, `password` = ? WHERE uid = ?";
		const q = `UPDATE users SET \`firstName\` = ${req.body.firstName}, \`lastName\` = ${req.body.lastName}, \`hometown\` = ${req.body.hometown}, \`gender\` = ${req.body.gender}, \`password\` = ${req.body.password} WHERE uid = ${req.params.id};`;
        const user_id = req.params.id;
		console.log(q);
        const values = [req.body.firstName, req.body.lastName, req.body.hometown, req.body.gender, req.body.password];
	    connection.query(q, function(err, rows){
            if (err) return res.json(err)  
            return res.json(ros);
        })
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

app.post("/friends", (req,res)=>{
    console.log("API CALL: /friends -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		const q = `INSERT INTO friend (\`uid_friends\`, \`friend_id\`, \`date_formed\`) VALUES (${req.body.uid}, ${req.body.friend_id}, ${req.body.date})`;
	    connection.query(q, function(err, rows){
            if (err) return res.json(err)  
            return res.json("Friend Added");
        })
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

app.get("/contributionScore/:id", (req,res)=>{
    console.log("API CALL: /contributionScore -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		var owner = req.params.id;
		const q = `SELECT pscore + cscore FROM (SELECT COUNT(p.pid) as pscore FROM photos as p WHERE EXISTS (SELECT p.pid FROM album WHERE album.aid = p.aid AND album.owner_id = ${owner})) as p, (SELECT COUNT(cid) as cscore FROM comment as c WHERE c.owner_id = ${owner}) as c`;
		
	    connection.query(q, function(err, rows){
            if (err) return res.json(err)  
            return res.json(rows);
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.get("/login", (req,res)=>{
    console.log("API CALL: /login -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		var email = req.body.email;
	    connection.query(`SELECT password FROM users WHERE email LIKE ${email}`,  function(err, rows){
            if (err) return res.json(err)  
            return res.json(rows);
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})
app.post("/albums", (req,res)=>{
    console.log("API CALL: /albums -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
        const q = `INSERT INTO album (\`name\`, \`owner_id\`, \`datePosted\`) VALUES (${req.body.name}, ${req.body.owner_id}, ${req.body.datePosted})`;
	    connection.query(q, function(err, rows){
            if (err) return res.json(err) 
            return res.json("Album has been Posted.");
        })
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

app.post("albums/delete/:id", (req, res)=>{
    const album_id = req.params.id;
    const q = `DELETE FROM album WHERE aid = ${req.params.id}`
    connection.query(q, function(err, rows){
        if (err) return res.json(err)  
        return res.json(`Album ${req.params.id} deleted.`);
    })
})


app.post("/albums", (req,res)=>{
    console.log("API CALL: /albums -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
        const values = [req.body.name, req.body.owner_id, req.body.datePosted];
	    connection.query("INSERT INTO album(`name`, `owner_id`, `datePosted`) VALUES (?);", [values], function(err, rows){
            if (err) return res.json(err) 
            return res.json("Album has been Posted.");
        })
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

app.delete("albums/:id", (req, res)=>{
    const album_id = req.params.id;
    const q = "DELETE FROM albums WHERE aid = ?"
    connection.query(q, album_id, function(err, rows){
        if (err) return res.json(err)  
        return res.json("User has been created.");
    })
})

app.delete("albums/:pid", (req, res)=>{
    const photo_id = req.params.pid;
    const q = "DELETE FROM photos WHERE aid = ?"
    connection.query(q, photo_id, function(err, rows){
        if (err) return res.json(err)  
        return res.json("User has been created.");
    })
})

app.post("/photos", (req,res)=>{
    console.log("API CALL: /photos -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
        const values = [req.body.album_id, req.body.caption, req.body.data, req.body.datePosted];
	    connection.query("INSERT INTO albums(`aid`, `caption`, `data`, `datePosted`) VALUES (?);", [values], function(err, rows){
            if (err) return res.json(err) 
            return res.json("Photo has been Posted.");
        })
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

app.post("/comments", (req,res)=>{
    console.log("API CALL: /comments -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		var values = [req.body.text, req.body.owner_id, req.body.date, req.body.pid];
	    connection.query("INSERT INTO comments(`text`, `owner_id`, `datePosted`, `pid`) VALUES (?)", values, function(err, rows){
            if (err) return res.json(err)  
            return res.json("Comment Posted");
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.get("/commentSearch", (req,res)=>{
    console.log("API CALL: /commentSearch -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		var comment = req.body.comment;
	    connection.query("SELECT * FROM Comments WHERE text LIKE ?", comment,  function(err, rows){
            if (err) return res.json(err)  
            return res.json(rows);
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.post("/likes", (req,res)=>{
    console.log("API CALL: /likes -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		var values = [req.body.owner_id, req.body.pid];
	    connection.query("INSERT INTO likes(`owner_id_likes`, `pid`) VALUES (?)", values, function(err, rows){
            if (err) return res.json(err)  
            return res.json("Photo Liked");
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.get("/photosByTag", (req,res)=>{
    console.log("API CALL: /photosByTag -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		var values = req.body.tag;
	    connection.query("SELECT * FROM photos WHERE EXISTS (SELECT pid FROM tags WHERE tag LIKE ?)", values, function(err, rows){
            if (err) return res.json(err)  
            return res.json("Photo Liked");
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.get("/yourPhotosByTag", (req,res)=>{
    console.log("API CALL: /yourPhotosByTag -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		const q = "SELECT * FROM social.photos as p WHERE EXISTS (SELECT * FROM social.album as a WHERE p.aid = a.aid AND a.owner_id= ?) AND EXISTS (SELECT pid_tags FROM social.tags as t WHERE t.tag_name LIKE `?`)";
		var values = [req.body.tag, req.body.uid]
	    connection.query(q, [values], function(err, rows){
            if (err) return res.json(err)  
            return res.json(rows);
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.get("/youMayAlsoLike", (req,res)=>{
    console.log("API CALL: /youMayAlsoLike -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function(err, connection) {
		if (err) {
			connection.release()
	  		console.log(" Error getting mysql_pool connection: " + err)
	  		throw err
	  	}
		const q = "SELECT DISTINCT photos.* FROM photos JOIN tags ON photos.pid = tags.pid_tags LEFT JOIN album ON photos.aid = album.aid AND album.owner_id = ? JOIN ( SELECT tags.tag_name, COUNT(*) AS count FROM photos JOIN tags ON photos.pid = tags.pid_tags WHERE photos.aid IN ( SELECT aid FROM album WHERE album.owner_id = ?) GROUP BY tags.tag_name ORDER BY count DESC LIMIT 5) AS top_tags ON tags.tag_name = top_tags.tag_name WHERE album.aid IS NULL AND photos.pid NOT IN (SELECT photos.pid FROM photos JOIN tags ON photos.pid = tags.pid_tags WHERE tags.tag_name = top_tags.tag_name AND photos.aid IN (SELECT aid FROM album WHERE album.owner_id = ?))ORDER BY RAND() LIMIT 0,10;";
		var owner = req.body.owner_id;
	    connection.query("SELECT COUNT(P.pid) + COUNT(C.cid) FROM Photos AS P JOIN Comments AS C ON  WHERE P.uid = ?", owner,  function(err, rows){
            if (err) return res.json(err)  
            return res.json(rows);
        })
		console.log("mysql_pool.release()")
		connection.release()
	})
})

app.get("/recommended_friends/:id", (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
	  if (err) {
		connection.release();
		console.log("Error getting mysql_pool connection: " + err);
		throw err;
	  }
  
	  const q = `SELECT f2.friend_id AS recommended_friend, COUNT(*) AS mutual_friends_count
				  FROM friend f1
				  JOIN friend f2 ON f1.friend_id = f2.uid_friends
				  WHERE f1.uid_friends = ${req.params.id}
					AND f2.friend_id NOT IN (
					  SELECT friend_id
					  FROM friend
					  WHERE uid_friends = ${req.params.id}
					)
					AND f2.friend_id != ${req.params.id}
				  GROUP BY f2.friend_id
				  ORDER BY mutual_friends_count DESC
				  LIMIT 0,5;`;
  
	  connection.query(q, function (err, rows) {
		if (err) return res.json(err);
		return res.json(rows);
	  });
  
	  connection.release();
	});
  });
  

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on port", PORT);
});