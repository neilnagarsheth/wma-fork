const knex = require("../db/connection");

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
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name,
      },
    };
  });
}


function read(review_id) {
  return knex("reviews as r").select("*").where({ review_id });
}

function readReviewWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.content",
      "r.created_at",
      "r.critic_id",
      "r.movie_id",
      "r.review_id",
      "r.score",
      "r.updated_at",
      "c.organization_name",
      "c.preferred_name",
      "c.surname"
    )
    .where({ "r.review_id": review_id })
    .then(addCritic);
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update({ content: updatedReview.content, score: updatedReview.score });

}

function destroy(review_id) {
  return knex("reviews as r").where({ review_id }).delete();
}

module.exports = {
  read,
  readReviewWithCritic,
  update,
  delete: destroy,
};