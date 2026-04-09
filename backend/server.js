require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = Date.now();
let cycleCount = 0;
let currentGreenRoad = 'A';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Auto-ping DB every 30 seconds
setInterval(async () => {
    try {
        if(process.env.DATABASE_URL) {
            await pool.query('SELECT 1');
            console.log('[DB] Ping successful');
        }
    } catch(e) {
        console.error('[DB] Ping failed', e.message);
    }
}, 30000);

// Basic health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// GET /api/status - system status, uptime, cycle count
app.get('/api/status', (req, res) => {
    const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
    res.json({
        status: 'online',
        uptime_seconds: uptimeSec,
        cycle_count: cycleCount
    });
});

// POST /api/traffic/log - save traffic data snapshot
app.post('/api/traffic/log', async (req, res) => {
    const { roads, snapshot } = req.body;
    // Update cycle/active road state contextually based on incoming payload
    if(snapshot && snapshot.active_road) {
        if(currentGreenRoad !== snapshot.active_road) {
            currentGreenRoad = snapshot.active_road;
            cycleCount++;
            // Insert Signal Event
            if(process.env.DATABASE_URL) {
                await pool.query(
                    'INSERT INTO signal_events (active_road, cycle_number, duration_ms) VALUES ($1, $2, $3)',
                    [currentGreenRoad, cycleCount, 8000]
                );
            }
        }
    }

    try {
        if(process.env.DATABASE_URL) {
            // Log individual road data
            if(roads && Array.isArray(roads)) {
                for(let r of roads) {
                    await pool.query(
                        'INSERT INTO traffic_logs (road, vehicles, queue, speed, throughput, signal_state) VALUES ($1, $2, $3, $4, $5, $6)',
                        [r.id, r.vehicles, r.queue, r.speed, r.throughput, r.signal_state]
                    );
                }
            }
            // Log analytics snapshot
            if(snapshot) {
                await pool.query(
                    'INSERT INTO analytics_snapshots (total_processed, avg_wait_time, throughput, efficiency) VALUES ($1, $2, $3, $4)',
                    [snapshot.total, snapshot.wait, snapshot.tput, snapshot.eff]
                );
            }
        }
        res.status(201).json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/emergency - save emergency event
app.post('/api/emergency', async (req, res) => {
    const { road, vehicle_type } = req.body;
    try {
        if(process.env.DATABASE_URL) {
            await pool.query(
                'INSERT INTO emergency_events (road, vehicle_type) VALUES ($1, $2)',
                [road, vehicle_type]
            );
        }
        res.status(201).json({ success: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/traffic/live - returns latest vehicle counts for all 4 roads
app.get('/api/traffic/live', async (req, res) => {
    try {
        if(!process.env.DATABASE_URL) return res.json([]);
        const result = await pool.query(`
            SELECT DISTINCT ON (road) road, vehicles, queue, speed, signal_state 
            FROM traffic_logs ORDER BY road, created_at DESC
        `);
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/traffic/history - returns last 50 traffic_log rows
app.get('/api/traffic/history', async (req, res) => {
    try {
        if(!process.env.DATABASE_URL) return res.json([]);
        const result = await pool.query('SELECT * FROM traffic_logs ORDER BY created_at DESC LIMIT 50');
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/signals/current - returns which road is green
app.get('/api/signals/current', (req, res) => {
    res.json({ active_road: currentGreenRoad });
});

// GET /api/signals/history - returns last 20 signal_events
app.get('/api/signals/history', async (req, res) => {
    try {
        if(!process.env.DATABASE_URL) return res.json([]);
        const result = await pool.query('SELECT * FROM signal_events ORDER BY created_at DESC LIMIT 20');
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/analytics - latest analytics_snapshot
app.get('/api/analytics', async (req, res) => {
    try {
        if(!process.env.DATABASE_URL) return res.json({});
        const result = await pool.query('SELECT * FROM analytics_snapshots ORDER BY created_at DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/analytics/chart - fake or real throughput aggregated data for chart
app.get('/api/analytics/chart', async (req, res) => {
    // Normally query DB. For demo speed, return basic structure:
    try {
        if(!process.env.DATABASE_URL) return res.json({ A: [], B: [], C: [], D: [] });
        const result = await pool.query(`
            SELECT road, throughput, created_at 
            FROM traffic_logs ORDER BY created_at DESC LIMIT 100
        `);
        // Distribute data...
        let data = { A:[], B:[], C:[], D:[] };
        result.rows.forEach(r => {
            if(data[r.road] && data[r.road].length < 25) data[r.road].unshift(r.throughput || 20);
        });
        res.json(data);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/export/json
app.get('/api/export/json', async (req, res) => {
    try {
        if(!process.env.DATABASE_URL) return res.json({ message: 'No DB' });
        const result = await pool.query('SELECT * FROM traffic_logs ORDER BY created_at DESC LIMIT 500');
        res.setHeader('Content-disposition', 'attachment; filename=traffic_export.json');
        res.setHeader('Content-type', 'application/json');
        res.write(JSON.stringify(result.rows, null, 2));
        res.end();
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/export/csv
app.get('/api/export/csv', async (req, res) => {
    try {
        if(!process.env.DATABASE_URL) return res.send('No DB');
        const result = await pool.query('SELECT * FROM traffic_logs ORDER BY created_at DESC LIMIT 500');
        res.setHeader('Content-disposition', 'attachment; filename=traffic_export.csv');
        res.setHeader('Content-type', 'text/csv');
        
        let csv = 'id,road,vehicles,queue,speed,throughput,signal_state,created_at\\n';
        result.rows.forEach(r => {
            csv += `${r.id},${r.road},${r.vehicles},${r.queue},${r.speed},${r.throughput},${r.signal_state},${r.created_at}\\n`;
        });
        res.send(csv);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
