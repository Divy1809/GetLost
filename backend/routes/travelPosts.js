const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/travel-posts - Create a new travel post
router.post('/', (req, res) => {
  const { userId, userName, travellingFrom, travellingTo, travelDate } = req.body;
  
  if (!userId || !userName || !travellingFrom || !travellingTo || !travelDate) {
    return res.status(400).json({ 
      error: 'All fields are required: userId, userName, travellingFrom, travellingTo, and travelDate' 
    });
  }

  const query = `
    INSERT INTO travel_posts (user_id, user_name, travelling_from, travelling_to, travel_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [userId, userName, travellingFrom, travellingTo, travelDate], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create travel post' });
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Travel post created successfully',
      postId: result.insertId,
      data: {
        id: result.insertId,
        userId,
        userName,
        travellingFrom,
        travellingTo,
        travelDate
      }
    });
  });
});

// GET /api/travel-posts - Get all travel posts with user info
router.get('/', (req, res) => {
  const { destination, excludeUserId, userId } = req.query;
  
  let query = `
    SELECT 
      tp.id,
      tp.user_id,
      tp.user_name,
      tp.travelling_from,
      tp.travelling_to,
      tp.travel_date,
      tp.created_at,
      tp.updated_at,
      u.phone as user_phone,
      u.email as user_email
    FROM travel_posts tp
    JOIN users u ON tp.user_id = u.id
  `;
  
  const params = [];
  const conditions = [];
  
  if (destination) {
    conditions.push('tp.travelling_to = ?');
    params.push(destination);
  }
  
  if (excludeUserId) {
    conditions.push('tp.user_id != ?');
    params.push(excludeUserId);
  }
  
  // Filter by specific userId (for "My Posts" functionality)
  if (userId) {
    conditions.push('tp.user_id = ?');
    params.push(userId);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY tp.created_at DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch travel posts' });
    }
    
    // For userId queries, return the results directly as an array
    if (userId) {
      return res.json(results);
    }
    
    // Parse interests JSON for each post (for non-userId queries)
    const postsWithParsedInterests = results.map(post => ({
      ...post,
      interests: post.interests ? JSON.parse(post.interests) : []
    }));
    
    res.json({ posts: postsWithParsedInterests });
  });
});

// GET /api/travel-posts/user/:userId - Get posts by specific user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT 
      tp.*,
      u.name as user_name
    FROM travel_posts tp
    JOIN users u ON tp.user_id = u.id
    WHERE tp.user_id = ?
    ORDER BY tp.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch user posts' });
    }
    
    res.json({ posts: results });
  });
});

// GET /api/travel-posts/feed - Get travel posts for swiping (solo traveler feed)
router.get('/feed', (req, res) => {
  const { userId } = req.query;
  
  // Sample data for the solo traveler feature
  const samplePosts = [
    {
      id: 1,
      title: "Beach Paradise in Goa",
      description: "Looking for travel companions to explore the beautiful beaches of Goa. Planning for 5 days of sun, sand, and adventure!",
      location: "Goa, India",
      duration: "5 days",
      budget: "₹15,000",
      user_name: "Priya Sharma",
      user_age: 26,
      travel_dates: "Dec 15-20, 2024",
      interests: ["Beach", "Adventure", "Photography"],
      image: "/public/qr/goa.jpg",
      created_at: "2024-12-01T10:00:00Z"
    },
    {
      id: 2,
      title: "Mountain Trek in Himachal",
      description: "Seeking fellow trekkers for an amazing journey through the mountains of Himachal Pradesh. Experience breathtaking views!",
      location: "Himachal Pradesh, India",
      duration: "7 days",
      budget: "₹25,000",
      user_name: "Arjun Kumar",
      user_age: 29,
      travel_dates: "Jan 10-17, 2025",
      interests: ["Trekking", "Nature", "Adventure"],
      image: "/public/qr/himachal.jpg",
      created_at: "2024-12-02T14:30:00Z"
    },
    {
      id: 3,
      title: "Cultural Tour of Rajasthan",
      description: "Join me for an incredible cultural journey through the royal state of Rajasthan. Explore palaces, forts, and local traditions!",
      location: "Rajasthan, India",
      duration: "10 days",
      budget: "₹40,000",
      user_name: "Kavya Patel",
      user_age: 24,
      travel_dates: "Feb 5-15, 2025",
      interests: ["Culture", "History", "Architecture"],
      image: "/public/qr/jaipur.jpg",
      created_at: "2024-12-03T09:15:00Z"
    },
    {
      id: 4,
      title: "Wildlife Safari in Kerala",
      description: "Explore the lush wildlife sanctuaries of Kerala. Perfect for nature lovers and photography enthusiasts!",
      location: "Kerala, India",
      duration: "6 days",
      budget: "₹20,000",
      user_name: "Rohit Singh",
      user_age: 31,
      travel_dates: "Mar 12-18, 2025",
      interests: ["Wildlife", "Photography", "Nature"],
      image: "/public/qr/kerala.jpg",
      created_at: "2024-12-04T16:45:00Z"
    },
    {
      id: 5,
      title: "Adventure in Ladakh",
      description: "Experience the breathtaking landscapes of Ladakh. High altitude adventure awaits brave souls!",
      location: "Ladakh, India",
      duration: "12 days",
      budget: "₹50,000",
      user_name: "Sneha Verma",
      user_age: 27,
      travel_dates: "Jun 1-13, 2025",
      interests: ["Adventure", "High Altitude", "Biking"],
      image: "/public/qr/ladakh.jpg",
      created_at: "2024-12-05T11:20:00Z"
    }
  ];

  // Filter out posts the user has already interacted with (in a real app, this would query the database)
  res.json({ posts: samplePosts });
});

module.exports = router;