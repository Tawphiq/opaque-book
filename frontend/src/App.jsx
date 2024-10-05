import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:8000/api';

const ReviewList = ({ reviews, onReviewAdded }) => {
  const [newReview, setNewReview] = useState({
    name: '',
    country: '',
    rating: 5,
    content: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        const addedReview = await response.json();
        onReviewAdded(addedReview);
        setNewReview({ name: '', country: '', rating: 5, content: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book Reviews</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={newReview.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            type="text"
            name="country"
            value={newReview.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rating"
            name="rating"
            value={newReview.rating}
            onChange={handleInputChange}
            required
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Review
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="content"
            name="content"
            value={newReview.content}
            onChange={handleInputChange}
            required
            rows="4"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit Review
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="font-bold text-xl mb-2">{review.name}</h3>
            <p className="text-gray-700 text-base mb-2">{review.country}</p>
            <p className="text-yellow-500 mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            <p className="text-gray-700 text-base">{review.content}</p>
            <p className="text-gray-500 text-sm mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RatingChart = ({ reviews }) => {
  const data = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length
  }));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rating Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const App = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/reviews/`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-nunito">
      <header className="bg-purple-400 text-white text-center py-4">
        <h1 className="text-3xl font-bold">OPAQUE</h1>
      </header>
      <main className="container mx-auto mt-8">
        <ReviewList reviews={reviews} onReviewAdded={handleReviewAdded} />
        <RatingChart reviews={reviews} />
      </main>
    </div>
  );
};

export default App;