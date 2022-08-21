const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//! <<------- VALIDATION ------->>
async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const review = await service.read(reviewId);
  console.log("review exists test", review.length);
  if (review.length && review.length > 0) {
    response.locals.review = review[0];
    return next();
  }
  next({
    status: 404,
    message: "Review cannot be found.",
  });
}

//! <<------- CRUDL -------->>
async function read(request, response, next) {
  response.json({ data: response.locals.review });
}

async function update(request, response, next) {
  const { content, score } = request.body.data;
  response.locals.review.content = content;
  response.locals.review.score = score;

  const review = await service.update(response.locals.review);
  const data = await service.readReviewWithCritic(request.params.reviewId);
  response.json({ data: data[0] });
}

async function destroy(request, response, next) {
  const { reviewId } = request.params;
  await service.delete(reviewId);

  response.sendStatus(204);
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};