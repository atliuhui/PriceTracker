var util = require('util');

var logger = require('./helpers/logging').getLogger('dbseed');

var USER_SYSTEM = require('./helpers/global').USER_SYSTEM;

var Product = require('./models/product').Product;
var ProductTracker = require('./models/product').ProductTracker;
var ProductPrice = require('./models/product').ProductPrice;

logger.info('seed ready');

var c1 = '<article>' +
    '<section class="index">' +
    '<cite>羽绒服外套</cite>' +
    '<ul class="tag">' +
    '<li>JEEP</li>' +
    '<li>吉普</li>' +
    '<li>男装</li>' +
    '<li>秋冬</li>' +
    '<li>商务休闲</li>' +
    '<li>大码</li>' +
    '<li>立领</li>' +
    '<li>GW15WJ801</li>' +
    '<li>K4</li>' +
    '<li>180/96B(54)</li>' +
    '</ul>' +
    '</section>' +
    '<section class="content">' +
    '<cite>简介</cite>' +
    '<p>京东平台卖家销售并发货的商品，由平台卖家提供发票和相应的售后服务。请您放心购买！注：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</p>' +
    '<figure>' +
    '<figcaption>整体效果</figcaption>' +
    '<img src="http://img12.360buyimg.com/cms/jfs/t2218/35/1720027991/223041/6e651f91/56710d9dN710d8017.jpg" />' +
    '</figure>' +
    '</section>' +
    '<section class="content">' +
    '<cite>正面</cite>' +
    '<p>京东平台卖家销售并发货的商品，由平台卖家提供发票和相应的售后服务。请您放心购买！注：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</p>' +
    '<figure>' +
    '<figcaption>整体效果</figcaption>' +
    '<img src="http://img30.360buyimg.com/popWaterMark/jfs/t2371/252/444019340/26712/e0bc1cd1/560b4c8cN44ce3fb4.jpg" />' +
    '</figure>' +
    '</section>' +
    '<section class="content">' +
    '<cite>引用自</cite>' +
    '<blockquote cite="http://item.jd.com/1765466541.html">' +
    '<p>http://item.jd.com/1765466541.html</p>' +
    '<p>http://item.jd.com/1765466541.html</p>' +
    '</blockquote>' +
    '</section>' +
    '</article>';

Product.create([{
    title: 'BOX',
    poster: '/images/FloatingMarket_ZH-CN9326364399_1366x768.jpg',
    content: c1,
    creator: USER_SYSTEM
}], function (error) {
    if (error) {
        logger.error('create Product, error: ', error);
    } else {
        logger.info('create Product success');

        var p1 = arguments[1][0];
        ProductTracker.create([
            {
                pid: p1.id,
                source: 'jd',
                url: util.format('http://item.jd.com/%s.html', '1952025209'),
                code: '1952025209',
                creator: USER_SYSTEM
            }, {
                pid: p1.id,
                source: 'tmall',
                url: util.format('http://detail.tmall.com/item.htm?id=%s', '44783214078'),
                code: '44783214078',
                creator: USER_SYSTEM
            }, {
                pid: p1.id,
                source: 'amazon',
                url: util.format('http://amazon.cn/gp/product/%s', 'B002J03PBA'),
                code: 'B002J03PBA',
                creator: USER_SYSTEM
            }
        ], function (error) {
            if (error) {
                logger.error('create Product Tracker, error: ', error);
            } else {
                logger.info('create Product Tracker success');
            }
        });
    }
});
