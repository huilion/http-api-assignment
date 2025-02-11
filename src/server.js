const http = require('http');
const responses = require('./responses.js')

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct= {
    '/': responses.getIndex,
    '/style.css': responses.getCSS,
    '/success': responses.getSuccess,
    '/badRequest': responses.getBadRequest,
    '/unauthorized': responses.getUnauthorized,
    '/forbidden': responses.getForbidden,
    '/internal': responses.getInternal,
    '/notImplemented' : responses.getNotImplemented,
    '/notFound': responses.getNotFound,
    index: responses.getIndex
}

const onRequest = (request, response) => {
    console.log(request.url);

    // parse url , support http and https
    const protocol = request.connection.encrypted ? 'https' :  'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.acceptedTypes = request.headers.accept.split(',');
    request.query = Object.fromEntries(parsedURL.searchParams);

    if (urlStruct[parsedURL.pathname]) {
        urlStruct[parsedURL.pathname](request,response);
    } else {
        urlStruct.index(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
  });