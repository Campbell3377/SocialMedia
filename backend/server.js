import express from "express"
import mysql from "mysql"
import cors from "cors"
const { createHash } = await import('crypto');

const app = express()
var PORT = 5501



const mysql_pool = mysql.createPool({
	connectionLimit: 100,
	host: "10.20.253.2",
	user: "root",
	password: "Password23644.",
	database: "social"
})

function hash(string) {
	return createHash('sha256').update(string).digest('hex');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get("/", (req, res) => {
	res.json("Hello this is the backend")
})
//Gets full users table
app.get("/users", (req, res) => {
	console.log("API CALL: /users -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		connection.query("SELECT * FROM users", function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Create User
app.post("/users", (req, res) => {
	console.log("API CALL: /users -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const values = [req.body.firstName, req.body.lastName, req.body.email, req.body.dob, req.body.hometown, req.body.gender, req.body.password]
		connection.query("INSERT INTO users (`firstName`, `lastName`, `email`, `dob`, `hometown`, `gender`, `password`) VALUES (?);", [values], function (err, rows) {
			if (err) return res.json(err)
			return res.json("User has been created.");
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Update User
app.post("/users/:id", (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		// const q = "UPDATE users SET `firstName` = ?, `lastName` = ?, `hometown` = ?, `gender` = ?, `password` = ? WHERE uid = ?";
		const q = `UPDATE users SET \`firstName\` = ${req.body.firstName}, \`lastName\` = ${req.body.lastName}, \`hometown\` = ${req.body.hometown}, \`gender\` = ${req.body.gender}, \`password\` = ${req.body.password} WHERE uid = ${req.params.id};`;
		const user_id = req.params.id;
		console.log(q);
		//const values = [req.body.firstName, req.body.lastName, req.body.hometown, req.body.gender, req.body.password];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Login
app.post("/login", (req, res) => {
	console.log("API CALL: /login -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		var email = req.body.email;
		var password = hash(req.body.password);
		connection.query(`SELECT uid FROM users WHERE email LIKE \'${email}\' AND password LIKE \'${password}\'`, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Feed
app.get("/feed/:uid", (req, res) => {
	console.log("API CALL: /feed -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const id = req.params.uid;
		const q = `SELECT distinct p.pid, p.data, p.caption, p.datePosted, u.firstName, u.lastName, a.aid, a.name as albumName
		FROM photos p
		JOIN album a ON p.aid = a.aid
		JOIN users u ON a.owner_id = u.uid
		JOIN friend f ON f.friend_id = u.uid OR f.uid_friends = u.uid
		WHERE (f.uid_friends = ${id} OR f.friend_id = ${id} OR u.uid = ${id})
		ORDER BY p.datePosted DESC;`
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//albumPhotos
app.get("/albumPhotos/:aid", (req, res) => {
	console.log("API CALL: /albumPhotos -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const id = req.params.aid;
		const q = `SELECT distinct p.pid, p.data, p.caption, p.datePosted, u.firstName, u.lastName, a.aid, a.name as albumName
		FROM photos p
		JOIN album a ON p.aid = a.aid
		JOIN users u ON a.owner_id = u.uid
		WHERE a.aid = ${id}
		ORDER BY p.datePosted DESC;`
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//User Search
app.get("/users/search", (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		// const q = "UPDATE users SET `firstName` = ?, `lastName` = ?, `hometown` = ?, `gender` = ?, `password` = ? WHERE uid = ?";
		let str = req.body.search;
		const q = `SELECT uid, firstName, lastName, email 
					FROM users 
					WHERE firstName LIKE \'${str}\' OR lastName LIKE \'${str}\' OR email LIKE \'${str}\';`;
		//const values = [req.body.firstName, req.body.lastName, req.body.hometown, req.body.gender, req.body.password];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Add Friend
app.post("/friends", (req, res) => {
	console.log("API CALL: /friends -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `INSERT INTO friend (\`uid_friends\`, \`friend_id\`, \`date_formed\`) VALUES (${req.body.uid}, ${req.body.friend_id}, ${req.body.date})`;
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json("Friend Added");
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//List Friends
app.get("/friends/list/:uid", (req, res) => {
	console.log(`API CALL: /friends/list/${req.params.id} -get`)
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		let id = req.params.uid;
		const q = `SELECT u.uid, u.firstName, u.lastName, u.email, MAX(f.date_formed) AS date_formed, 
						(CASE WHEN COUNT(CASE WHEN (f.uid_friends = ${id} AND f.friend_id = u.uid) THEN 1 END) > 0 THEN true ELSE false END) AS isFollowing
					FROM friend f 
					JOIN users u ON f.friend_id = u.uid OR f.uid_friends = u.uid 
					WHERE (f.uid_friends = ${id} OR f.friend_id = ${id}) AND u.uid != ${id}
					GROUP BY u.uid, u.firstName, u.lastName, u.email 
					ORDER BY MAX(f.date_formed) DESC;`;
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Get Contribution Score for current user
app.get("/contributionScore", (req, res) => {
	console.log("API CALL: /contributionScore -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT u.uid, u.firstName, u.lastName, u.email, (COALESCE(p.pscore, 0) + COALESCE(c.cscore, 0)) as score, p.pscore, c.cscore
		FROM users u
		LEFT JOIN
		  (SELECT album.owner_id, COUNT(p.pid) as pscore
		   FROM photos as p
		   INNER JOIN album ON p.aid = album.aid
		   GROUP BY album.owner_id) as p
		ON u.uid = p.owner_id
		LEFT JOIN
		  (SELECT c.owner_id, COUNT(cid) as cscore
		   FROM comment as c
		   GROUP BY c.owner_id) as c
		ON u.uid = c.owner_id
		ORDER BY score DESC;`

		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Create Album
app.post("/albums", (req, res) => {
	console.log("API CALL: /albums -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `INSERT INTO album (\`name\`, \`owner_id\`, \`datePosted\`) VALUES (\'${req.body.name}\', ${req.body.owner_id}, \'${req.body.datePosted}\')`;
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json("Album has been Posted.");
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Update Album
app.post("/albums/name", (req, res) => {
	console.log("API CALL: /albums/name -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `UPDATE album SET name = \'${req.body.name}\' WHERE aid = ${req.body.aid}`;
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json("Album has been updated.");
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Delete Album
app.post("/deleteAlbum/:aid", (req, res) => {
	console.log("API CALL: /deleteAlbum/{id} -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const album_id = req.params.aid;
		const q = `DELETE FROM album WHERE aid = ${req.params.id}`
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			//return res.json(`Album ${req.params.id} deleted.`);
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});

})

//Get next pid
app.get("/nextpid", (req, res) => {
	console.log("API CALL: /nextpid -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		connection.query("SELECT MAX(pid)+1 as pid FROM photos", function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Get latest pid
app.get("/latestpid", (req, res) => {
	console.log("API CALL: /nextpid -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		connection.query("SELECT MAX(pid) as pid FROM photos", function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Post Photo
app.post("/photos", (req, res) => {
	console.log("API CALL: /photos -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `INSERT INTO photos(\`aid\`, \`caption\`, \`data\`, \`datePosted\`) VALUES (${req.body.aid}, \'${req.body.caption}\', \'${req.body.data}\', \'${req.body.datePosted}\');`
		//const values = [req.body.album_id, req.body.caption, req.body.data, req.body.datePosted];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json("Photo has been Posted.");
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Update Photo
app.post("/photos/caption", (req, res) => {
	console.log("API CALL: /photos/caption -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `UPDATE photos SET caption = \'${req.body.caption}\' WHERE pid = ${req.body.pid};`
		//const values = [req.body.album_id, req.body.caption, req.body.data, req.body.datePosted];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json("Caption Updated.");
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Add Tag
app.post("/tags", (req, res) => {
	console.log("API CALL: /tags -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `INSERT INTO tags(\`tag_name\`, \`pid_tags\`) VALUES (\'${req.body.tagName}\', ${req.body.pid});`
		//const values = [req.body.album_id, req.body.caption, req.body.data, req.body.datePosted];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Delete Photo
app.post("/deletephoto/:id", (req, res) => {
	console.log("API CALL: /deletephoto/{id} -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const album_id = req.params.id;
		const q = `DELETE FROM photos WHERE pid = ${req.params.id}`
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(`Photo ${req.params.id} deleted.`);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});

})

//Like Photo
app.post("/likes", (req, res) => {
	console.log("API CALL: /likes -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `INSERT INTO likes(\`owner_id_likes\`, \`pid\`) VALUES (${req.body.uid}, ${req.body.pid});`
		//const values = [req.body.album_id, req.body.caption, req.body.data, req.body.datePosted];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Count Likes
app.get("/likes/:pid", (req, res) => {
	console.log(`API CALL: /likes/${req.params.pid} -get`)
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT COUNT(*) as count FROM likes WHERE pid = ${req.params.pid};`;
		//const values = [req.body.album_id, req.body.caption, req.body.data, req.body.datePosted];
		connection.query(q, function (err, rows) {
			if (err) {console.log(err);return res.json(err)}
			return res.json(rows);
		})
		console.log(" mysql_pool.release()")
		connection.release()
	});
});

//Add Comment
app.post("/comments", (req, res) => {
	console.log("API CALL: /comments -post")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `INSERT INTO comment(\`text\`, \`owner_id\`, \`datePosted\`, \`pid\`) VALUES (\'${req.body.text}\', ${req.body.uid}, \'${req.body.date}\', ${req.body.pid})`
		//var values = [req.body.text, req.body.owner_id, req.body.date, req.body.pid];
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json("Comment Posted");
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Get Comments By pid
app.get("/comments/:pid", (req, res) => {
	console.log(`API CALL: /comments/${req.params.pid} -get`)
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT c.cid, c.owner_id, u.firstName, u.lastName, u.email, c.text as comment, c.datePosted
						FROM comment c
						JOIN users u ON c.owner_id = u.uid
						WHERE c.pid = ${req.params.pid}
						ORDER BY c.datePosted ASC;`
		//var values = [req.body.text, req.body.owner_id, req.body.date, req.body.pid];
		connection.query(q, function (err, rows) {
			if (err) {console.log(err);return res.json(err)}
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Get Tags By pid
app.get("/tags/:pid", (req, res) => {
	console.log(`API CALL: /tags/${req.params.pid} -get`)
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT tag_name
						FROM tags
						WHERE pid_tags = ${req.params.pid}`;
		//var values = [req.body.text, req.body.owner_id, req.body.date, req.body.pid];
		connection.query(q, function (err, rows) {
			if (err) {console.log(err);return res.json(err)}
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//commentSearch
app.get("/commentSearch", (req, res) => {
	console.log("API CALL: /commentSearch -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT u.*, COUNT(c.cid) AS matching_comments_count
						FROM comment c
						JOIN users u ON c.owner_id = u.uid
						WHERE c.text = \'${req.body.search}\'
						GROUP BY u.uid
						ORDER BY matching_comments_count DESC;`
		var comment = req.body.comment;
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Search By Tag
app.get("/searchByTag/:tags", (req, res) => {
	console.log("API CALL: /searchByTag -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		var str = req.params.tags;
		var values = str.split(',');
		var tags = ``
		values.forEach(tag => {
			tags += `\'${tag}\',`
		});
		const inStr = tags.slice(0, -1)
		console.log(inStr)
		const q = `SELECT photos.*, COUNT(*) AS matching_tags, (SELECT COUNT(*) FROM tags WHERE pid_tags = photos.pid) AS total_tags
						FROM photos
						JOIN tags ON photos.pid = tags.pid_tags
						WHERE tag_name IN (${inStr})
						GROUP BY photos.pid
						ORDER BY matching_tags DESC, total_tags ASC`
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//See all photos by Tag
app.get("/photosByTag/:tag", (req, res) => {
	console.log("API CALL: /photosByTag -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		connection.query(`SELECT * FROM photos WHERE EXISTS (SELECT * FROM tags WHERE tag_name LIKE \'${req.params.tag}\' AND pid = pid_tags)`, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//See your photos by Tag
app.get("/yourPhotosByTag/:tag/:uid", (req, res) => {
	console.log("API CALL: /yourPhotosByTag -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT * FROM social.photos as p
		WHERE EXISTS (SELECT *
						FROM social.album as a
						WHERE p.aid = a.aid
						AND a.owner_id=${req.params.uid})
		AND EXISTS (SELECT pid_tags
						FROM social.tags as t
						WHERE t.tag_name LIKE \'${req.params.tag}\'
						AND t.pid_tags = pid) `
		//var values = [req.body.tag, req.body.uid]
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//See trending Tags
app.get("/trendingTags", (req, res) => {
	console.log("API CALL: /trendingTags -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const q = `SELECT tag_name, COUNT(tag_name)
		FROM tags
		GROUP BY tag_name
		ORDER BY COUNT(tag_name) DESC
		LIMIT 0,5`
		//var values = [req.body.tag, req.body.uid]
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//You May Also Like
app.get("/youMayAlsoLike/:id", (req, res) => {
	console.log("API CALL: /youMayAlsoLike -get")
	var retvalSettingValue = "?"
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release()
			console.log(" Error getting mysql_pool connection: " + err)
			throw err
		}
		const id = req.params.id;
		const q = `SELECT DISTINCT photos.*
		FROM photos
		JOIN tags ON photos.pid = tags.pid_tags
		LEFT JOIN album ON photos.aid = album.aid AND album.owner_id = ${id}
		JOIN (
			SELECT tags.tag_name, COUNT(*) AS count
			FROM photos
			JOIN tags ON photos.pid = tags.pid_tags
			WHERE photos.aid IN (
				SELECT aid
				FROM album
				WHERE album.owner_id = ${id}
			)
			GROUP BY tags.tag_name
			ORDER BY count DESC
			LIMIT 5
		) AS top_tags ON tags.tag_name = top_tags.tag_name
		WHERE album.aid IS NULL AND photos.pid NOT IN (
			SELECT photos.pid
			FROM photos
			JOIN tags ON photos.pid = tags.pid_tags
			WHERE tags.tag_name = top_tags.tag_name AND photos.aid IN (
				SELECT aid
				FROM album
				WHERE album.owner_id = ${id}
			)
		)
		LIMIT 0,10;`
		var owner = req.body.owner_id;
		connection.query(q, function (err, rows) {
			if (err) return res.json(err)
			return res.json(rows);
		})
		console.log("mysql_pool.release()")
		connection.release()
	})
})

//Recommended Friends (Mutual Friends)
app.get("/recommendedFriends/:id", (req, res) => {
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


app.listen(PORT, function (err) {
	if (err) console.log("Error in server setup")
	console.log("Server listening on port", PORT);
});