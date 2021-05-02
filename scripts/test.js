javascript:
function add(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.append(script);
}

add('http://localhost:3000/main.js');
// add('http://localhost:3000/chunk.js');