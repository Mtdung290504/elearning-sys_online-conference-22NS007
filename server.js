import os from 'os';

import https from 'https';
import fs from 'fs';
import path from 'path';

import express from 'express';
import session from 'express-session';
import multer from 'multer';
import bodyParser from 'body-parser';

import middleWares from './routes/middle-wares.js';
import Database from './model/database/database.js';
import { Lecturer, Document } from './model/classes.js';
import Utils from './utils.js';

import classRoutes from './routes/class.js';
import ajaxRoutes from './routes/ajax.js';

import { Server } from 'socket.io';

const app = express();
const DEBUG_DB = false;
const formUpload = multer();
const db = new Database(DEBUG_DB);

const sslKey = fs.readFileSync(path.resolve('ssl/server.key'), 'utf8');
const sslCert = fs.readFileSync(path.resolve('ssl/server.cert'), 'utf8');
const sslCredentials = { key: sslKey, cert: sslCert };

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(
	session({
		secret: '22ns',
		resave: false,
		saveUninitialized: true,
	})
);
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
	if (req.session.user) {
		res.redirect('/');
		return;
	}

	res.render('login');
});

app.post('/signup', formUpload.none(), async (req, res) => {
	let e,
		m = null;

	const submittedData = {
		userName: req.body['signup-name'],
		userLoginName: req.body['signup-id'],
		userPassword: req.body['signup-pw'],
	};

	try {
		const result = await db.lecturerSignUp(1, submittedData);
		if (result) {
			const user = await db.loginUser({
				loginId: submittedData.userLoginName,
				enteredPassword: submittedData.userPassword,
			});

			req.session.user = user;
			req.session.role = Number(user instanceof Lecturer);
			console.log('User logged in:', user);

			m = 'ok';
		}
	} catch (error) {
		if (error.message.toLowerCase().includes('đã tồn tại')) e = error.message;
		else {
			e = 'Internal server error';
			console.error('Error signing up user:', error.message);
		}
	}

	res.json({ e, m });
});

app.post('/login', formUpload.none(), async (req, res) => {
	let e,
		m = null;

	const submittedData = {
		loginId: req.body['login-id'],
		enteredPassword: req.body['login-password'],
	};

	try {
		const user = await db.loginUser(submittedData);

		req.session.user = user;
		req.session.role = Number(user instanceof Lecturer);
		console.log('User logged in:', user);

		m = 'ok';
	} catch (error) {
		e = error.message;
		console.error(error);
	}

	res.json({ e, m });
});

app.use(middleWares.requireLogin);

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) console.error('Error destroying session:', err);
		res.redirect('/login');
	});
});

app.get('/', async (req, res) => {
	const user = req.session.user;
	const role = req.session.role;
	const roles = ['SV', 'GV'];
	const rootUrl = Utils.getRootUrl(req);

	try {
		const listOfClasses = await db.getAllClass(user.id, role);
		if (role == 1) {
			const queryResult = await db.getAllDocCategoryAndDoc(user.id);
			const listOfDocCategoryAndDoc = Document.buildDocLib(queryResult.map((item) => new Document(item)));
			res.render('home-views/lecturer', {
				rootUrl,
				user,
				listOfClasses,
				role: roles[role],
				listOfDocCategoryAndDoc,
			});
			return;
		}

		res.render('home-views/student', {
			rootUrl,
			user,
			listOfClasses,
			role: roles[role],
		});
		console.log(listOfClasses);
	} catch (error) {
		console.error(error);
		res.send('Internal server error');
	}
});

app.get('/joinclass/:inviteCode', async (req, res) => {
	const user = req.session.user;
	const role = req.session.role;

	if (role === 0) {
		try {
			const inviteCode = req.params.inviteCode;
			const { id: studentId } = user;

			const { classId, success } = await db.joinClassWithInvite(studentId, inviteCode);

			if (success) {
				res.redirect(`/class/${classId}`);
			} else {
				res.redirect('/');
			}
		} catch (error) {
			console.error('Error in /joinclass/:inviteCode', error);
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

app.use('/class', classRoutes);
app.use('/ajax', ajaxRoutes);

// Start HTTPS server
const port = process.env.PORT || 3000;
const httpsServer = https.createServer(sslCredentials, app);
const io = new Server(httpsServer);
const rtcDebug = false;

io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	// Khi người dùng join một room
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId);
		socket.to(roomId).emit('user-connected', userId);
		console.log(`User ${userId} joined room ${roomId}`);

		socket.joinedRoom = roomId;

		// Xử lý khi có offer từ peer
		socket.on('offer', (targetId, offer) => {
			rtcDebug && console.log('offer to: ', targetId, offer);
			socket.to(targetId).emit('offer', socket.id, offer);
		});

		// Xử lý khi có answer từ peer
		socket.on('answer', (targetId, answer) => {
			rtcDebug && console.log('answer to: ', targetId, answer);
			socket.to(targetId).emit('answer', socket.id, answer);
		});

		// Xử lý khi có ICE candidate từ peer
		socket.on('candidate', (targetId, candidate) => {
			rtcDebug && console.log('candidate to: ', targetId, candidate);
			socket.to(targetId).emit('candidate', socket.id, candidate);
		});

		// Khi người dùng rời khỏi room
		socket.on('disconnect', () => {
			socket.to(roomId).emit('user-disconnected', userId);
			console.log(`User ${userId} disconnected`);
		});
	});
});

httpsServer.listen(port, () => {
	const serverAddress = getServerWiFiIP();
	console.log(
		'Server is listening at:',
		serverAddress ? `https://${serverAddress}:${port}` : `https://localhost:${port}`
	);

	function getServerWiFiIP() {
		const interfaces = os.networkInterfaces();
		const wifiInterface = interfaces['Wi-Fi'];

		if (wifiInterface) {
			for (const details of wifiInterface) {
				if (details.family === 'IPv4' && !details.internal) {
					return details.address;
				}
			}
		}

		return null;
	}
});
