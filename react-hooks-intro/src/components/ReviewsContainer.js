import React, { Component } from 'react';
import Review from './Review.js'
import Reviews from "./Reviews.js"
import NewReview from './NewReview.js'
import NewReviewWithHooks from './NewReviewWithHooks.js'

class ReviewsContainer extends Component {
  state = {
    interval: 0,
    dealerReviews: [],
    reviewId: 0,
    reviewsOn: true
  }

  componentDidMount() {
    this.getDealerReviews()
    this.startInterval()
  }

  getDealerReviews = () => {
    fetch("http://localhost:3001/api/v1/dealer_reviews")
      .then(resp => resp.json())
      .then(reviews => {
        this.setState({
          dealerReviews: reviews
        })
      })
  }

  setReview = () => {
    // find a review at random
    // update the state with that review
    const review = this.state.dealerReviews[Math.floor(Math.random() * this.state.dealerReviews.length)]
    this.setState({
      reviewId: review ? review.id : 0
    })
  }

  startInterval = () => {
    this.state.interval && this.stopInterval() // ensure to kill current interval if there is one before starting another..
     this.setState({
       interval: setInterval(this.setReview, 3000)
     })
  }

  handleReviewsButtonClick = () => {
    this.state.reviewsOn ? this.stopInterval() : this.startInterval()
    this.setState({reviewsOn: !this.state.reviewsOn})
  }

  stopInterval = () => clearInterval(this.state.interval)

  createReview = (reviewData) => {
    const body = {
      dealer_review: reviewData
    }
    return fetch("http://localhost:3001/api/v1/dealer_reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(r => r.json())
      .then(newReview => {
        if (newReview.error) {
          alert(newReview.error)
        } else {
          this.setState({
            dealerReviews: this.state.dealerReviews.concat(newReview)
          })
        }
        return newReview
      })
  }

  render() {
    return (
      <div className="ReviewsContainer">
        <button
          onClick={this.handleReviewsButtonClick}>{this.state.reviewsOn
            ? "Hide Reviews"
            : "Show Reviews Slideshow"}
         </button>

        {this.state.reviewsOn && <Reviews
          stopInterval={this.stopInterval}
          review={this.state.dealerReviews.find(review => review.id === this.state.reviewId)}
        />}

        <h3>With Hooks</h3>
        <NewReviewWithHooks createReview={this.createReview}/>

        <h3>No Hooks</h3>
        <NewReview createReview={this.createReview}/>

      </div>
    );
  }

}

export default ReviewsContainer;
