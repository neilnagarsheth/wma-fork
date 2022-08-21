const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");


function addCritic(reviews) {
  return reviews.map((review) => {
    return {
      review_id: review.review_id,
      content: review.content,
      score: review.score,
      created_at: review.created_at,
      updated_at: review.updated_at,
      critic_id: review.critic_id,
      movie_id: review.movie_id,
      critic: {
        critic_id: review.critic_id,
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name,
        created_at: review.critic_created_at,
        updated_at: review.critic_updated_at,
      },
    };
  });
}

//! <<------- CRUDL ------->
function readMovieTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .distinct("t.*", "mt.movie_id", "mt.is_showing")
    .where({ "mt.movie_id": movieId });
}

function readMovieReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.*",
      "c.*",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ "r.movie_id": movieId })
    .then(addCritic);
}

function read(movieId) {
  return knex("movies as m")
    .select("*")
    .where({ "m.movie_id": movieId })
    .first();
}

function list() {
  return knex("movies").select("*");
}

function listCurrentlyShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct(
      "mt.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where({ "mt.is_showing": true });
}

module.exports = {
  read,
  readMovieTheaters,
  readMovieReviews,
  list,
  listCurrentlyShowing,
};