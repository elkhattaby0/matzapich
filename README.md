resources/
└── js/
    ├── app.jsx                          # Main entry point
    ├── bootstrap.js                     # Laravel bootstrap (axios, etc.)
    │
    ├── components/                      # Reusable UI components
    │   ├── common/                      # Shared components
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Modal.jsx
    │   │   └── Navbar.jsx
    │   │
    │   └── layout/                      # Layout components
    │       ├── Header.jsx
    │       ├── Footer.jsx
    │       └── Sidebar.jsx
    │
    ├── pages/                           # Page components (routes)
    │   ├── auth/                        # Authentication pages
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── ForgotPassword.jsx
    │   │
    │   ├── admin/                       # Admin pages
    │   │   ├── Dashboard.jsx
    │   │   ├── Users.jsx
    │   │   ├── Settings.jsx
    │   │   └── Reports.jsx
    │   │
    │   ├── user/                        # User pages
    │   │   ├── Profile.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Settings.jsx
    │   │
    │   └── Home.jsx                     # Public home page
    │
    ├── layouts/                         # Page layouts
    │   ├── AuthLayout.jsx               # Layout for login/register
    │   ├── AdminLayout.jsx              # Layout for admin pages
    │   └── UserLayout.jsx               # Layout for user pages
    │
    ├── hooks/                           # Custom React hooks
    │   ├── useAuth.js
    │   ├── useApi.js
    │   └── useForm.js
    │
    ├── utils/                           # Utility functions
    │   ├── api.js                       # API calls
    │   ├── helpers.js
    │   └── validators.js
    │
    └── context/                         # React Context for state
        ├── AuthContext.jsx
        └── ThemeContext.jsx




┌─────────────────────┐
│      User           │
├─────────────────────┤
│ -id: int            │
│ -name: string       │
│ -email: string      │
│ -password: hash     │
│ -avatar: string     │
│ -is_admin: bool     │
│ -is_banned: bool    │
├─────────────────────┤
│ +register()         │
│ +login()            │
│ +updateProfile()    │
│ +sendFriendReq()    │
│ +createPost()       │
│ +ban()              │
└─────────────────────┘
        │ 1
        │
        │ 1:N
        ▼
┌─────────────────────┐
│      Post           │
├─────────────────────┤
│ -id: int            │
│ -user_id: int       │
│ -content: text      │
│ -media_url: string  │
│ -visibility: enum   │
│ -likes_count: int   │
│ -created_at: date   │
├─────────────────────┤
│ +addComment()       │
│ +like()             │
│ +share()            │
│ +delete()           │
└─────────────────────┘
        │ 1
        │
        │ 1:N
        ▼
┌─────────────────────┐
│     Comment         │
├─────────────────────┤
│ -id: int            │
│ -post_id: int       │
│ -user_id: int       │
│ -parent_id: int     │
│ -content: text      │
│ -likes_count: int   │
├─────────────────────┤
│ +reply()            │
│ +like()             │
│ +delete()           │
└─────────────────────┘


┌─────────────────────┐       N:N       ┌─────────────────────┐
│    Friendship       │◄───────────────►│      User           │
├─────────────────────┤                 │  (self-reference)   │
│ -requester_id: int  │                 └─────────────────────┘
│ -addressee_id: int  │
│ -status: enum       │
├─────────────────────┤
│ +accept()           │
│ +reject()           │
│ +block()            │
└─────────────────────┘


┌─────────────────────┐
│    Notification     │
├─────────────────────┤
│ -id: int            │
│ -user_id: int       │
│ -type: string       │
│ -notifiable: morph  │ ◄──── Polymorphic to Post/Comment/Friendship
│ -read_at: date      │
├─────────────────────┤
│ +markAsRead()       │
└─────────────────────┘


┌─────────────────────┐       N:N       ┌─────────────────────┐
│       Role          │◄───────────────►│      User           │
├─────────────────────┤  (user_roles)   └─────────────────────┘
│ -id: int            │
│ -name: string       │
│ -permissions: JSON  │
├─────────────────────┤
│ +assignTo(User)     │
└─────────────────────┘

















