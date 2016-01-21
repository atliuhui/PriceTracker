module.exports.DICT_PRODUCT_SOURCE = {
	jd: 'jd',
	tmall: 'tmall',
	amazon: 'amazon'
};
module.exports.ENUM_PRODUCT_SOURCE = [
	module.exports.DICT_PRODUCT_SOURCE.jd,
	module.exports.DICT_PRODUCT_SOURCE.tmall,
	module.exports.DICT_PRODUCT_SOURCE.amazon
];

module.exports.DB_URI = 'mongodb://localhost/when';

module.exports.USER_SYSTEM = 'admin';

module.exports.DICT_CODE = {
    '200': {code: '200', text: '', msg: '成功'},
	'210': {code: '200', text: '', msg: '产品导入成功'},
    '310': {code: '', text: '', msg: ''},
    '311': {code: '', text: '', msg: ''},
    '312': {code: '', text: '', msg: ''},
    '313': {code: '', text: '', msg: ''},
    '314': {code: '', text: '', msg: ''},
    '315': {code: '', text: '', msg: ''},
    '316': {code: '', text: '', msg: ''},
    '317': {code: '', text: '', msg: ''}
};