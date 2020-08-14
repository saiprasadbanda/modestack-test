const DB = require('./db');
class Helper {
	constructor(app) {
		this.db = DB;
    }
	
	async addUser(params) {
		try {
			return await this.db.query("INSERT INTO `users` (`username`, `password`, `email`, `address`) VALUES (?, MD5(?), ?, ?)", [params.username, params.password, params.email, params.address]);
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async addArticle(params) {
		try {
			return await this.db.query("INSERT INTO `articles` (`title`, `author`, `body`) VALUES (?, ?, ?)",[params.title, params.body, params.author])
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async login(params) {
		try {
			return await this.db.query("SELECT * FROM users WHERE username = ? AND password = MD5(?)", [params.username, params.password]);
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async expireTocken(tocken) {
		try {
			return await this.db.query("UPDATE `users` SET `accessTocken`= NULL WHERE accessTocken = ?",[tocken])
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async updateTocken(tocken, id) {
		try {
			return await this.db.query("UPDATE `users` SET `accessTocken`=? WHERE (`id`=?)", [tocken, id]);
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async validateTocken(tocken) {
		try {
			// console.log(`"SELECT * FROM users WHERE accessTocken = '${tocken}'"`);
			return await this.db.query("SELECT * FROM users WHERE accessTocken = ?",[tocken])
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async getArticles(params) {
		try {
			return await this.db.query("SELECT * FROM `articles` ORDER BY "+params.field+" "+params.order+" LIMIT "+params.offset+","+params.limit,[params.field, params.order, params.offset, params.limit]);
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}
module.exports = new Helper();