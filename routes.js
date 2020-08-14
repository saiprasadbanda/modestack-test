const helper = require('./helper');
const randomstring = require("randomstring")

const { request, response } = require('express');
class Routes {

	constructor(app) {
		this.app = app;
	}

	appRoutes() {
        
		this.app.get('/articles', async (request, response) => {
			const data = {field: 'title', order: 'ASC', offset: '0', limit: '10'}
			console.log('==default==', data);
			const requestData = request.query
			if(requestData.field != undefined)
				data.field = requestData.field
			if(requestData.order != undefined)
				data.order = requestData.order.toUpperCase()
			if(requestData.offset != undefined)
				data.offset = requestData.offset
			if(requestData.limit != undefined)
				data.limit = requestData.limit
				// console.log('==default==', data);
			const articles = await helper.getArticles(data)
			response.status(200).send({statusCode:200,body:{data:articles}})
		})

		this.app.post('/login', async (request, response) => {
			const reqData = {
				username: request.body.username,
				password: request.body.password
			}
			if(reqData.username && reqData.password){
				const data = {username: reqData.username,password: reqData.password}
				const userData = await helper.login(data)
				if(userData.length > 0){
					const newAccessTocken = randomstring.generate({length: 32})
					await helper.updateTocken(newAccessTocken,userData[0].id)
					response.status(200).send({statusCode:200,body:{message:'Success', accessTocken: newAccessTocken}})
				} else {
					response.status(401).send({statusCode:200,body:{message:'User Not Authenticated'}})
				}
			} else {
				response.status(200).send({statusCode:200,body:{message:'Please Enter UserName and Password.'}})
			}
			
		})
		
		this.app.post('/logout', async (request, response) => {
			if(request.body.accessTocken === undefined || request.body.accessTocken.trim() == '' || !this.validateTocken(request.body.accesstocken))
				response.status(200).send({statusCode:200,body:{message:'Please Pass valid accessTocken.'}})
			await helper.expireTocken(request.body.accessTocken)
			response.status(200).send({statusCode:200,body:{message:'LoggedOut Successfully.'}})
		})
		
		this.app.post('/register', async (request, response) => {
			const reqData = {
				username: request.body.username,
				password: request.body.password,
				email: request.body.email,
				address: request.body.address
			}
			if(reqData.username === undefined || reqData.username === null || reqData.username.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter UserName.'}})
			else if(reqData.password === undefined || reqData.password === null || reqData.password.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter Password.'}})
			else if(reqData.email === undefined || reqData.email === null || reqData.email.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter Email.'}})
			else if(reqData.address === undefined || reqData.address === null || reqData.address.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter Address.'}})
			else {
				const data = {
					username: reqData.username,
					password: reqData.password,
					email: reqData.email,
					address: reqData.address
				}
				const insert = await helper.addUser(data)
				console.log('==insert==', insert)
				if(insert)
					response.status(201).send({statusCode:201,body:{message:'New User Created.'}})
				else
					response.status(200).send({statusCode:200,body:{message:'User Creation Query Error.'}})
			}
		})

		this.app.post('/articles', async(request, response) => {
			const reqData = {
				accesstocken: request.headers.accesstocken,
				title: request.body.title,
				body: request.body.body,
				author: request.body.author,
			}
			// await this.validateTocken(reqData.accesstocken,tocken => {
			// 	console.log('Tocken validation', tocken);
			// })//.then(result)
			if(reqData.accesstocken == undefined || reqData.accesstocken == null || reqData.accesstocken.trim() == ''){
				response.status(200).send({statusCode:200,body:{message:'Please Pass the AccessTocken in Header.'}})
			}else if(reqData.title === undefined || reqData.title === null || reqData.title.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter title.'}})
			else if(reqData.body === undefined || reqData.body === null || reqData.body.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter body.'}})
			else if(reqData.author === undefined || reqData.author === null || reqData.author.trim() == '')
				response.status(200).send({statusCode:200,body:{message:'Please Enter Author.'}})
			else {
				const Tocken = await helper.validateTocken(reqData.accesstocken)
				if(Tocken.length > 0){
					const data = {
						title: reqData.title,
						body: reqData.body,
						author: reqData.author
					}
					const insert = await helper.addArticle(data)
					// console.log('==insert==', insert)
					if(insert)
						response.status(201).send({statusCode:201,body:{message:'New Article Created.'}})
					else
						response.status(200).send({statusCode:200,body:{message:'Article Creation Query Error.'}})
				} else {
					response.status(401).send({statusCode:401,body:{message:'Un Authorized access. Invalid AccessTocken.'}})
				}
			}
		})
    }
    routesConfig() {
		this.appRoutes();
	}
	validateTocken =  async (tocken,callback) => {

		const Tocken = await helper.validateTocken(tocken).length
		callback(Tocken)
		// console.log('==Tocken==', Tocken.length)
		// // let Tocken = {}
		// // if(Tocken = await helper.validateTocken(tocken)){
		// // 	setTimeout(()=>{
		if(Tocken.length > 0)
			return true;
		else
			return false;
			// },1500)
		// }
	}
}
module.exports = Routes;