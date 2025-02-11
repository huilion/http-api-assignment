const fs = require('fs');
const path = require('path');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200)
};

const getCSS = (request, response) => {
  respond(request, response, css, 'text/css', 200)
}

const respond = (request, response, content, type, status) => {
    
    // Set status code and content type
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });

    response.write(content);
    response.end();
}

const getData = (request, response, message, status, id=null) => {

    // XML handling
    if (request.acceptedTypes[0] === 'text/xml') {
        let xmlResponse = `<response><message>${message}</message>`;
        if (id) xmlResponse += `<id>${id}</id>`;
        xmlResponse += `</response>`;

        return respond(request, response, xmlResponse, 'text/xml', status);
    } else {
        let jsonResponse = {
            message: message
        }
        if(id) jsonResponse.id = id;
        console.log(jsonResponse);
        return respond(request, response, JSON.stringify(jsonResponse), 'application/json', status);
    }
}

const getSuccess = (request, response) => {
    getData(request, response, "This is a successful response", 200);
}

const getBadRequest = (request, response) => {

    let status = 200;
    let message = "This request has the required parameters";
    let id = null;

    if (!request.query.valid || request.query.valid !== 'true') {
        // set error message
        message = "Missing valid query parameter set to true"
        status = 400;
        id= 'badRequest';
        return getData(request, response, message, status, id);
    }

    return getData(request, response, message, status);
}

const getUnauthorized = (request, response) => {
    let status = 200;
    let message = "This request has the required parameters";
    let id = null;

    if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
        message="Missing loggedIn query parameter set to yes";
        status = 401;
        id="unauthorized";
    }
    return getData(request, response, message, status);

}

const getForbidden = (request, response) => {
    return getData(request, response, "You do not have access to this content", 403), 'forbidden';
}

const getInternal = (request, response) => {
    return getData(request, response, "Internal Server Error. Something went wrong.", 500, 'internalError')
}

const getNotImplemented = (request, response) => {
    return getData(request, response, "A get request for this page has not been implemented yet. Check again later for updated content", 501, 'notImplemented');
}

const getNotFound = (request, response) => {
    return getData(request, response, "The page you are looking for was not found", 404, 'notFound')
}

  module.exports = {
    getIndex,
    getCSS,
    getSuccess,
    getBadRequest,
    getUnauthorized,
    getForbidden,
    getInternal,
    getNotImplemented,
    getNotFound
  }