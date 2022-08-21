const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//! <<-------  VALIDATION ------->>
async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  next({
    status: 404,
    message: "Movie cannot be found.",
  });
}

//! <<-------    CRUDL   -------->>
async function readMovieReviews(request, response, next) {
  const { movieId } = request.params;
  const data = await service.readMovieReviews(movieId);
  response.json({ data: data });
}

async function readMovieTheaters(request, response, next) {
  const { movieId } = request.params;
  const data = await service.readMovieTheaters(movieId);
  response.json({ data });
}

function read(request, response, next) {
  const { movie: data } = response.locals;
  response.json({ data });
}

async function list(request, response, next) {
  const { is_showing } = request.query;
  if (is_showing) {
    const data = await service.listCurrentlyShowing();
    response.json({ data: data });
  } else {
    const data = await service.list();
    response.json({ data: data });
  }
}

module.exports = {
  readMovieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMovieReviews),
  ],
  readMovieTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMovieTheaters),
  ],
  read: [asyncErrorBoundary(movieExists), read],
  list: asyncErrorBoundary(list),
};