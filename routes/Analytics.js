export const updateAnalytics = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
    }
  const { event, userId, timestamp, metadata } = req.body;

  try {
    await pool.query(
      'INSERT INTO analytics (event, user_id, timestamp, metadata) VALUES ($1, $2, $3, $4)',
      [event, userId, timestamp, metadata]
    );
    res.status(200).json({ message: 'Event logged' });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to log event' });
  }
}