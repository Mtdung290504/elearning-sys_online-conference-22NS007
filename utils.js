import moment from 'moment';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '.');

export default class Utils {
	static getRootUrl(req) {
		const protocol = req.protocol;
		const host = req.get('host');

		return `${protocol}://${host}`;
	}

	static generateRandomPassword(length = 6) {
		const lowercaseCharset = 'abcdefghijklmnopqrstuvwxyz';
		const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numberCharset = '0123456789';
		const specialCharset = '!@#$%^&';

		let password = '';

		// Chọn một ký tự từ mỗi charset
		password += [lowercaseCharset, uppercaseCharset, numberCharset, specialCharset].reduce((s, charSet) => {
			return s.concat(charSet[Math.floor(Math.random() * charSet.length)]);
		}, '');

		// Tạo phần còn lại của mật khẩu
		for (let i = 4; i < length; i++) {
			const randomIndex = Math.floor(
				Math.random() *
					(lowercaseCharset.length + uppercaseCharset.length + numberCharset.length + specialCharset.length)
			);
			if (randomIndex < lowercaseCharset.length) {
				password += lowercaseCharset[randomIndex];
			} else if (randomIndex < lowercaseCharset.length + uppercaseCharset.length) {
				password += uppercaseCharset[randomIndex - lowercaseCharset.length];
			} else if (randomIndex < lowercaseCharset.length + uppercaseCharset.length + numberCharset.length) {
				password += numberCharset[randomIndex - lowercaseCharset.length - uppercaseCharset.length];
			} else {
				password +=
					specialCharset[
						randomIndex - lowercaseCharset.length - uppercaseCharset.length - numberCharset.length
					];
			}
		}

		// Trộn ngẫu nhiên các ký tự trong mật khẩu
		password = password
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('');

		return password;
	}

	static formatToSqlDatetime(value) {
		return moment(value, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss');
	}

	static formatToInputDatetime(value) {
		return moment(value).format('YYYY-MM-DDTHH:mm');
	}

	static formatToDisplayDatetime(value) {
		return moment(value).format('DD-MM-YYYY HH:mm:ss');
	}

	static formatFileName(name) {
		return name.replace(/"/g, "'").replace(/[\\/:*?"<>|]/g, '-');
	}
}
