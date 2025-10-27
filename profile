<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Economic Justice Forum</title>
    <link rel="stylesheet" href="ejf_styles.css">
    <style>
        .profile-header {
            background: linear-gradient(135deg, var(--navy) 0%, #004d80 100%);
            color: white;
            padding: 60px 0;
            text-align: center;
        }

        .profile-avatar {
            width: 100px;
            height: 100px;
            background: var(--gold);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: var(--navy);
        }

        .profile-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: transform 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .logout-btn:hover {
            background: #c82333;
            transform: translateY(-2px);
        }

        .profile-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .profile-btn {
            background: var(--navy);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .profile-btn:hover {
            background: var(--gold);
            color: var(--navy);
        }

        .user-badge {
            display: inline-block;
            background: var(--gold);
            color: var(--navy);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="site-header">
        <div class="container">
            <div style="display:flex;align-items:center;gap:12px;">
                <img src="logo.jpeg" alt="EJF logo" style="height:54px; width:auto; object-fit:contain; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.1)"/>
                <div style="color:white;">
                    <div style="font-weight:700">Economic Justice Forum (EJF)</div>
                    <div style="font-size:12px;opacity:0.9">People's Platform for Economic, Climate, Social & Digital Justice</div>
                </div>
            </div>
            <nav class="main-nav" aria-label="Main navigation">
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="pillars.html">Pillars</a>
                <a href="programs.html">Programs</a>
                <a href="research.html">Research</a>
                <a href="events.html">Events</a>
                <a href="donate.html" class="btn btn-gold">Donate</a>
                <!-- Authentication Button -->
                <div class="user-menu">
                    <button class="btn btn-primary" id="authButton" onclick="toggleAuthModal()">Login</button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="profile.html" id="profileLink">👤 My Profile</a>
                        <a href="#" id="settingsLink">⚙️ Settings</a>
                        <a href="#" onclick="logout()">🚪 Logout</a>
                    </div>
                </div>
            </nav>
        </div>
    </header>

    <div class="profile-header">
        <div class="container">
            <div class="profile-avatar" id="userAvatar">U</div>
            <h1 id="userName">User Name</h1>
            <p id="userEmail">user@example.com</p>
            <p id="userType">Member <span class="user-badge" id="userBadge">STANDARD</span></p>
        </div>
    </div>

    <main class="container">
        <div class="profile-stats">
            <div class="stat-card">
                <h3>Member Since</h3>
                <p id="memberSince">2024</p>
            </div>
            <div class="stat-card">
                <h3>Events Attended</h3>
                <p id="eventsCount">0</p>
            </div>
            <div class="stat-card">
                <h3>Contributions</h3>
                <p id="contributionsCount">0</p>
            </div>
            <div class="stat-card">
                <h3>Last Active</h3>
                <p id="lastActive">Today</p>
            </div>
        </div>

        <div class="card">
            <h2>Account Information</h2>
            <div class="profile-info">
                <p><strong>Name:</strong> <span id="profileName">Loading...</span></p>
                <p><strong>Email:</strong> <span id="profileEmail">Loading...</span></p>
                <p><strong>Account Type:</strong> <span id="profileType">Loading...</span></p>
                <p><strong>Member Since:</strong> <span id="profileSince">Loading...</span></p>
            </div>
            
            <div class="profile-actions">
                <button class="profile-btn" onclick="editProfile()">✏️ Edit Profile</button>
                <button class="profile-btn" onclick="changePassword()">🔒 Change Password</button>
                <button class="profile-btn" onclick="viewActivity()">📊 View Activity</button>
            </div>
        </div>

        <div class="card">
            <h2>Quick Actions</h2>
            <div class="profile-actions">
                <a href="donate.html" class="profile-btn">💰 Make a Donation</a>
                <a href="events.html" class="profile-btn">📅 Browse Events</a>
                <a href="research.html" class="profile-btn">📚 Access Research</a>
                <a href="programs.html" class="profile-btn">🌱 Join Programs</a>
            </div>
        </div>

        <div class="card">
            <h2>Account Settings</h2>
            <div class="form-group">
                <label>Email Notifications</label>
                <div>
                    <input type="checkbox" id="newsletter" checked> Newsletter & Updates<br>
                    <input type="checkbox" id="eventAlerts" checked> Event Alerts<br>
                    <input type="checkbox" id="researchAlerts"> Research Publications<br>
                </div>
            </div>
            <button class="logout-btn" onclick="logout()">🚪 Logout from EJF</button>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="footer-about">
                <img src="logo.jpeg" alt="EJF logo" class="logo-sm" />
                <p><strong>Economic Justice Forum (EJF)</strong><br/>Equity. Justice. Prosperity.</p>
            </div>
            <div class="footer-links">
                <h4>Explore</h4>
                <a href="about.html">About</a><br/>
                <a href="pillars.html">Pillars</a><br/>
                <a href="programs.html">Programs</a><br/>
                <a href="research.html">Research</a>
            </div>
            <div class="footer-contact">
                <h4>Subscribe</h4>
                <form id="newsletter" action="#" method="post">
                    <input type="email" placeholder="Email address" required/>
                    <button class="btn btn-primary">Subscribe</button>
                </form>
            </div>
        </div>
        <div class="footer-legal">
            <p>&copy; 2024 Economic Justice Forum (EJF) — Building a Future of Justice, Equity, and Prosperity</p>
        </div>
    </footer>

    <script>
        // Authentication functions
        function toggleAuthModal() {
            // Redirect to login if not authenticated
            const user = JSON.parse(localStorage.getItem('ejfUser'));
            if (!user) {
                window.location.href = 'login.html';
            }
        }

        function logout() {
            localStorage.removeItem('ejfUser');
            window.location.href = 'index.html';
        }

        // Profile functions
        function editProfile() {
            alert('Profile editing feature coming soon!');
        }

        function changePassword() {
            alert('Password change feature coming soon!');
        }

        function viewActivity() {
            alert('Activity view feature coming soon!');
        }

        // Load user data
        document.addEventListener('DOMContentLoaded', function() {
            const user = JSON.parse(localStorage.getItem('ejfUser'));
            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            // Update profile information
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userType').textContent = user.type === 'guest' ? 'Guest User' : 'Member';
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
            
            // Update badge based on user type
            const badge = document.getElementById('userBadge');
            if (user.type === 'guest') {
                badge.textContent = 'GUEST';
                badge.style.background = '#6c757d';
            } else {
                badge.textContent = 'MEMBER';
                badge.style.background = 'var(--gold)';
            }
            
            // Update profile details
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileType').textContent = user.type === 'guest' ? 'Guest Account' : 'Full Member';
            
            if (user.loginTime) {
                const date = new Date(user.loginTime);
                document.getElementById('memberSince').textContent = date.getFullYear();
                document.getElementById('profileSince').textContent = date.toLocaleDateString();
                
                // Update last active
                const now = new Date();
                const diffTime = Math.abs(now - date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    document.getElementById('lastActive').textContent = 'Today';
                } else if (diffDays < 7) {
                    document.getElementById('lastActive').textContent = `${diffDays} days ago`;
                } else {
                    document.getElementById('lastActive').textContent = date.toLocaleDateString();
                }
            }

            // Update navigation
            updateNavigation();
        });

        function updateNavigation() {
            const authButton = document.getElementById('authButton');
            const user = JSON.parse(localStorage.getItem('ejfUser'));
            
            if (user) {
                authButton.innerHTML = `👤 ${user.name}`;
                authButton.onclick = () => document.getElementById('userDropdown').classList.toggle('show');
            } else {
                authButton.innerHTML = 'Login';
                authButton.onclick = () => window.location.href = 'login.html';
            }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.remove('show');
            }
        });
    </script>
</body>
</html><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Economic Justice Forum</title>
    <link rel="stylesheet" href="ejf_styles.css">
    <style>
        .profile-header {
            background: linear-gradient(135deg, var(--navy) 0%, #004d80 100%);
            color: white;
            padding: 60px 0;
            text-align: center;
        }

        .profile-avatar {
            width: 100px;
            height: 100px;
            background: var(--gold);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: var(--navy);
        }

        .profile-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: transform 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .logout-btn:hover {
            background: #c82333;
            transform: translateY(-2px);
        }

        .profile-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .profile-btn {
            background: var(--navy);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .profile-btn:hover {
            background: var(--gold);
            color: var(--navy);
        }

        .user-badge {
            display: inline-block;
            background: var(--gold);
            color: var(--navy);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="site-header">
        <div class="container">
            <div style="display:flex;align-items:center;gap:12px;">
                <img src="logo.jpeg" alt="EJF logo" style="height:54px; width:auto; object-fit:contain; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.1)"/>
                <div style="color:white;">
                    <div style="font-weight:700">Economic Justice Forum (EJF)</div>
                    <div style="font-size:12px;opacity:0.9">People's Platform for Economic, Climate, Social & Digital Justice</div>
                </div>
            </div>
            <nav class="main-nav" aria-label="Main navigation">
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="pillars.html">Pillars</a>
                <a href="programs.html">Programs</a>
                <a href="research.html">Research</a>
                <a href="events.html">Events</a>
                <a href="donate.html" class="btn btn-gold">Donate</a>
                <!-- Authentication Button -->
                <div class="user-menu">
                    <button class="btn btn-primary" id="authButton" onclick="toggleAuthModal()">Login</button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="profile.html" id="profileLink">👤 My Profile</a>
                        <a href="#" id="settingsLink">⚙️ Settings</a>
                        <a href="#" onclick="logout()">🚪 Logout</a>
                    </div>
                </div>
            </nav>
        </div>
    </header>

    <div class="profile-header">
        <div class="container">
            <div class="profile-avatar" id="userAvatar">U</div>
            <h1 id="userName">User Name</h1>
            <p id="userEmail">user@example.com</p>
            <p id="userType">Member <span class="user-badge" id="userBadge">STANDARD</span></p>
        </div>
    </div>

    <main class="container">
        <div class="profile-stats">
            <div class="stat-card">
                <h3>Member Since</h3>
                <p id="memberSince">2024</p>
            </div>
            <div class="stat-card">
                <h3>Events Attended</h3>
                <p id="eventsCount">0</p>
            </div>
            <div class="stat-card">
                <h3>Contributions</h3>
                <p id="contributionsCount">0</p>
            </div>
            <div class="stat-card">
                <h3>Last Active</h3>
                <p id="lastActive">Today</p>
            </div>
        </div>

        <div class="card">
            <h2>Account Information</h2>
            <div class="profile-info">
                <p><strong>Name:</strong> <span id="profileName">Loading...</span></p>
                <p><strong>Email:</strong> <span id="profileEmail">Loading...</span></p>
                <p><strong>Account Type:</strong> <span id="profileType">Loading...</span></p>
                <p><strong>Member Since:</strong> <span id="profileSince">Loading...</span></p>
            </div>
            
            <div class="profile-actions">
                <button class="profile-btn" onclick="editProfile()">✏️ Edit Profile</button>
                <button class="profile-btn" onclick="changePassword()">🔒 Change Password</button>
                <button class="profile-btn" onclick="viewActivity()">📊 View Activity</button>
            </div>
        </div>

        <div class="card">
            <h2>Quick Actions</h2>
            <div class="profile-actions">
                <a href="donate.html" class="profile-btn">💰 Make a Donation</a>
                <a href="events.html" class="profile-btn">📅 Browse Events</a>
                <a href="research.html" class="profile-btn">📚 Access Research</a>
                <a href="programs.html" class="profile-btn">🌱 Join Programs</a>
            </div>
        </div>

        <div class="card">
            <h2>Account Settings</h2>
            <div class="form-group">
                <label>Email Notifications</label>
                <div>
                    <input type="checkbox" id="newsletter" checked> Newsletter & Updates<br>
                    <input type="checkbox" id="eventAlerts" checked> Event Alerts<br>
                    <input type="checkbox" id="researchAlerts"> Research Publications<br>
                </div>
            </div>
            <button class="logout-btn" onclick="logout()">🚪 Logout from EJF</button>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="footer-about">
                <img src="logo.jpeg" alt="EJF logo" class="logo-sm" />
                <p><strong>Economic Justice Forum (EJF)</strong><br/>Equity. Justice. Prosperity.</p>
            </div>
            <div class="footer-links">
                <h4>Explore</h4>
                <a href="about.html">About</a><br/>
                <a href="pillars.html">Pillars</a><br/>
                <a href="programs.html">Programs</a><br/>
                <a href="research.html">Research</a>
            </div>
            <div class="footer-contact">
                <h4>Subscribe</h4>
                <form id="newsletter" action="#" method="post">
                    <input type="email" placeholder="Email address" required/>
                    <button class="btn btn-primary">Subscribe</button>
                </form>
            </div>
        </div>
        <div class="footer-legal">
            <p>&copy; 2024 Economic Justice Forum (EJF) — Building a Future of Justice, Equity, and Prosperity</p>
        </div>
    </footer>

    <script>
        // Authentication functions
        function toggleAuthModal() {
            // Redirect to login if not authenticated
            const user = JSON.parse(localStorage.getItem('ejfUser'));
            if (!user) {
                window.location.href = 'login.html';
            }
        }

        function logout() {
            localStorage.removeItem('ejfUser');
            window.location.href = 'index.html';
        }

        // Profile functions
        function editProfile() {
            alert('Profile editing feature coming soon!');
        }

        function changePassword() {
            alert('Password change feature coming soon!');
        }

        function viewActivity() {
            alert('Activity view feature coming soon!');
        }

        // Load user data
        document.addEventListener('DOMContentLoaded', function() {
            const user = JSON.parse(localStorage.getItem('ejfUser'));
            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            // Update profile information
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userType').textContent = user.type === 'guest' ? 'Guest User' : 'Member';
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
            
            // Update badge based on user type
            const badge = document.getElementById('userBadge');
            if (user.type === 'guest') {
                badge.textContent = 'GUEST';
                badge.style.background = '#6c757d';
            } else {
                badge.textContent = 'MEMBER';
                badge.style.background = 'var(--gold)';
            }
            
            // Update profile details
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileType').textContent = user.type === 'guest' ? 'Guest Account' : 'Full Member';
            
            if (user.loginTime) {
                const date = new Date(user.loginTime);
                document.getElementById('memberSince').textContent = date.getFullYear();
                document.getElementById('profileSince').textContent = date.toLocaleDateString();
                
                // Update last active
                const now = new Date();
                const diffTime = Math.abs(now - date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    document.getElementById('lastActive').textContent = 'Today';
                } else if (diffDays < 7) {
                    document.getElementById('lastActive').textContent = `${diffDays} days ago`;
                } else {
                    document.getElementById('lastActive').textContent = date.toLocaleDateString();
                }
            }

            // Update navigation
            updateNavigation();
        });

        function updateNavigation() {
            const authButton = document.getElementById('authButton');
            const user = JSON.parse(localStorage.getItem('ejfUser'));
            
            if (user) {
                authButton.innerHTML = `👤 ${user.name}`;
                authButton.onclick = () => document.getElementById('userDropdown').classList.toggle('show');
            } else {
                authButton.innerHTML = 'Login';
                authButton.onclick = () => window.location.href = 'login.html';
            }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.remove('show');
            }
        });

        


    </script>
</body>
</html>