CREATE TABLE traffic_logs (
  id SERIAL PRIMARY KEY,
  road VARCHAR(10),
  vehicles INT,
  queue INT,
  speed FLOAT,
  throughput INT,
  signal_state VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE signal_events (
  id SERIAL PRIMARY KEY,
  active_road VARCHAR(10),
  cycle_number INT,
  duration_ms INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE emergency_events (
  id SERIAL PRIMARY KEY,
  road VARCHAR(10),
  vehicle_type VARCHAR(20),
  activated_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP
);

CREATE TABLE analytics_snapshots (
  id SERIAL PRIMARY KEY,
  total_processed INT,
  avg_wait_time FLOAT,
  throughput INT,
  efficiency FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);
