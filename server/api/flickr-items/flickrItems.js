const request = require("request");

const flickrItems = (req, res) => {
  const option = {
    method: "GET",
    url: "https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=true&safe_search=1",
    headers: {
      "Cache-Control": "no-cache ",
      token: req.headers.token,
    },
    json: true,
  };

  request(option, (error, response, body) => {
    if (error || response.statusCode >= 400) {
      res.send(500);
    } else {
      res.json(body);
    }
  });
};

module.exports = { flickrItems };
