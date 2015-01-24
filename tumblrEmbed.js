/* jshint browser: true */
/* global tumblr_api_read */

function jsonLoad() {
    if (tumblr_api_read) {
        loadContent(tumblr_api_read);
    }
}

function jsonError() {
    console.log('error', arguments);
}

function loadContent(file) {
    console.log(file);
    var posts = file.posts;
    
    var blogContent = document.getElementById('blogContent');
    
    posts.forEach(function(post){
        var dom = makePost(post);
        blogContent.appendChild(dom);
    });
    
    var tumblrLink = elem('a', { className: 'blogLink', text: 'See more on Tumblr' });
    tumblrLink.href = 'http://mashazarnitsa.tumblr.com';
    tumblrLink.target = '_blank';
    
    blogContent.appendChild(tumblrLink);
}

var script = document.createElement('script');
script.src = 'http://mashazarnitsa.tumblr.com/api/read/json';
script.onload = window.jsonLoad;
script.onerror = window.jsonError;

document.getElementById('blogContent').appendChild(script);

var elem = function(type, opts) {
    opts = opts || {};
    
    var el = document.createElement(type || 'div');
    if (opts.className) {
        el.className = opts.className;
    }
    if (opts.text) {
        var text = document.createTextNode(opts.text);
        el.appendChild(text);
    }
    return el;
};

function formatDateString(date){
    var str = '';
    
    switch(date.getMonth()) {
        case 0:  str += 'January';   break;
        case 1:  str += 'February';  break;
        case 2:  str += 'March';     break;
        case 3:  str += 'April';     break;
        case 4:  str += 'May';       break;
        case 5:  str += 'June';      break;
        case 6:  str += 'July';      break;
        case 7:  str += 'August';    break;
        case 8:  str += 'September'; break;
        case 9:  str += 'October';   break;
        case 10: str += 'November';  break;
        case 11: str += 'December';  break;
    }
    
    str += ' ' + date.getDate();
    str += ', ' + date.getFullYear();
    
    return str;
}

function makeImage(photo, className) {
    className = className || '';
    var img = elem('img', { className: className });
    img.src = photo['photo-url-500'];
    return img;
}

function makePhotoPost (post) {
    var wrapper = document.createDocumentFragment(),
        className = 'postImg';
    
    function appendSinglePhoto (photo) {
        var img = makeImage(photo, className),
            url = post.url,
            link = elem('a');
        
        link.href = url;
        link.target = '_blank';
        link.appendChild(img);
        wrapper.appendChild(link);
    }
    
    if (post.photos && post.photos.length) {
        if (post.photos.length > 4) {
            className += ' postImgSmall';
        }
        
        post.photos.forEach(function(photo){
            appendSinglePhoto(photo);
        });
    } else if (post['photo-url-500']) {
        appendSinglePhoto(post);
    }
    
    return wrapper;
}

function makeVideoPost (post) {
    var wrapper = document.createDocumentFragment(),
        div = elem('div', { className: 'videoEmbed' }),
        videoHtml = post['video-player-500'] || post['video-player'];
    
    if (!videoHtml) {
        videoHtml = '<iframe src="' + post['video-source'] + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    }
    
    div.innerHTML = videoHtml;
    wrapper.appendChild(div);
    
    return wrapper;
}

function makePostFooter (post) {
    var dateStamp = post['unix-timestamp'],
        date = new Date(dateStamp * 1000),
        url = post['url-with-slug'] || post['url'];
    
    var footer = elem('div', { className: 'postFooter clearfix' }),
        dateElem = elem('div', { className: 'postDate', text: 'Posted on ' + formatDateString(date) }),
        link = elem('a', { className: 'postLink', text: 'See on Tumblr' });
    
    link.href = url;
    link.target = '_blank';
    
    footer.appendChild(dateElem);
    footer.appendChild(link);
    
    return footer;
}

function makePost(post) {
    var wrapper = elem('div', { className: 'post' });
    
    var postElem;
    if (post.type === 'photo') {
        postElem = makePhotoPost(post);
    } else if (post.type === 'video') {
        postElem = makeVideoPost(post);
    }
    
    if (postElem) {
        wrapper.appendChild(postElem);
    }
        
    if (post['photo-caption']) {
        var caption = elem('div');
        caption.innerHTML = post['photo-caption'];

        wrapper.appendChild(caption);
    }
    
    var footer = makePostFooter(post);
    wrapper.appendChild(footer);
    
    return wrapper;
}