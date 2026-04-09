# 🏛️ AI-Based Smart Traffic Management System

**Official State Government Configuration | Motor Vehicles Department (Tamil Nadu)**

A revolutionary fullstack autonomous traffic flow simulation and analytics engine. This platform replaces archaic, strict-timer traffic light logic with dynamic, queue-threshold AI evaluations—mitigating massive urban congestion, reducing carbon emissions, and expediting critical emergency vehicles.

---

## 👥 Project Team Members

| Name | Register Number |
| :--- | :--- |
| **Allan Roy** | RA2411030010028 |
| **Peter Jijo Manavalan** | RA2411030010045 |
| **Arjun Anil** | RA2411030010020 |
| **Elijah Ajith** | RA2411030010001 |
| **Arhan Ashraf** | RA2411030010039 |

---

## 🚀 Key Features Built

### 1. Advanced Kinematic Physics Engine
Built a pure JavaScript local HTML5 Canvas tracking engine that perfectly simulates YOLOv8 bounding boxes. Cars spawn intelligently, brake dramatically upon nearing other vehicles/red lights, and accurately formulate queue-stacks reflecting authentic velocity deceleration—no overlapping or clipping!

### 2. Intelligent Queue Evaluation vs "Round-Robin"
Instead of arbitrarily swapping colors every 15 seconds, the "True AI Algorithmic Flow Control" monitors all boundaries in real-time. If an immense queue builds aggressively on the South Boundary causing heavy deceleration, the neural engine **actively intercepts the light cycle** and initiates an overriding Green state to alleviate the jam.

### 3. State Government Grade UX/UI
Abandoned standard "tech demo" aesthetics. The entire frontend dynamically projects an official, rigidly professional Tamil Nadu State Government layout. It features:
- Embedded National Emblems (Lion Capital of Ashoka & TN Tower).
- National Informatics Centre (NIC) authentication gateway.
- A highly legible standard Light-Theme (Slate / White).

### 4. Dynamic Location Profiling Dashboard
Mapped four primary congestion vectors (Guduvanchery Terminal, Tambaram Hub, Guindy Industrial, Sholinganallur IT Park). Choosing a different location entirely flushes the map and swaps analytical parameters (e.g. Industrial zones prioritize heavy TRUCK queues with slow bounds, while IT parks prioritize immense CAR traffic bursts).

### 5. Supabase Postgres & Real-time PDF Exports
Engineered a Node.js Express backend directly hooked into a cloud-hosted Supabase PostgreSQL database.
Every 5 seconds, absolute data logs (Queue States, Total Passed, Speeds) alongside restricted Emergency Override logs are committed securely to the Cloud. Citizens and authorities can tap "Export Report" to generate an **authenticated `jsPDF` Data Document** spanning thousands of tracked instances.

---

## 🛠️ Tech Stack
- **Frontend Architecture:** Absolute HTML5/CSS3/Vanilla JS (No Heavy Frameworks) Canvas Engine.
- **Data Visualization:** `Chart.js` for decoupled, dynamic analytical line charting.
- **Backend API:** Node.js Express Server (Hosted on Render).
- **Database Architecture:** Supabase Postgres relational database logging metrics.
- **Hosting & CI/CD:** Vercel Edge Network Deployment.

## ⚙️ How to Run Locally

1. Clone or download the repository.
2. In the `frontend` folder, simply open `index.html` in any Chromium-based browser.
3. The app will autonomously boot with simulated API calls if the real backend takes too long to spin up from sleep mode!
4. *(Optional)* For cloud database logging, boot the backend `server.js` using `node server.js` and point `VITE_API_URL` locally.

---
*Created dynamically for Academic & Official Deployment Simulation.*
