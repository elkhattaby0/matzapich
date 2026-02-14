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

















npm run build
git add .
git commit -m "v1.1"
git push







┌──────────────────────────────────┐
│              User                │
├──────────────────────────────────┤
│ - id: int                        │
│ - name: string                   │
│ - email: string                  │
│ - password: hash                 │
│ - avatar: string                 │
│ - is_admin: bool                 │
│ - is_banned: bool                │
│ - created_at: date               │
├──────────────────────────────────┤
│ + register()                     │
│ + login()                        │
│ + updateProfile()                │
│ + sendFriendRequest()            │
│ + createPost()                   │
│ + ban()                          │
└──────────────────────────────────┘
        │ 1
        │
        │ 1..*
        ▼
┌──────────────────────────────────┐
│              Post                │
├──────────────────────────────────┤
│ - id: int                        │
│ - user_id: int                   │
│ - content: text                  │
│ - media_url: string              │
│ - visibility: enum               │
│ - likes_count: int               │
│ - created_at: date               │
├──────────────────────────────────┤
│ + addComment()                   │
│ + like()                         │
│ + share()                        │
│ + delete()                       │
└──────────────────────────────────┘
        │ 1
        │
        │ 1..*
        ▼
┌──────────────────────────────────┐
│            Comment               │
├──────────────────────────────────┤
│ - id: int                        │
│ - post_id: int                   │
│ - user_id: int                   │
│ - parent_id: int (nullable)      │
│ - content: text                  │
│ - likes_count: int               │
│ - created_at: date               │
├──────────────────────────────────┤
│ + reply()                        │
│ + like()                         │
│ + delete()                       │
└──────────────────────────────────┘


┌──────────────────────────────────┐
│           Friendship             │
├──────────────────────────────────┤
│ - id: int                        │
│ - requester_id: int              │
│ - addressee_id: int              │
│ - status: enum                   │
│ - created_at: date               │
├──────────────────────────────────┤
│ + accept()                       │
│ + reject()                       │
│ + block()                        │
└──────────────────────────────────┘
   ▲                         ▲
   │                         │
   └────────── N : N ────────┘
            User ↔ User


┌──────────────────────────────────┐
│          Conversation            │
├──────────────────────────────────┤
│ - id: int                        │
│ - type: enum (private, group)    │
│ - created_at: date               │
├──────────────────────────────────┤
│ + addParticipant()               │
│ + removeParticipant()            │
│ + delete()                       │
└──────────────────────────────────┘
        │ 1
        │
        │ 1..*
        ▼
┌──────────────────────────────────┐
│            Message               │
├──────────────────────────────────┤
│ - id: int                        │
│ - conversation_id: int           │
│ - sender_id: int                 │
│ - content: text                  │
│ - media_url: string (nullable)   │
│ - is_read: bool                  │
│ - created_at: date               │
├──────────────────────────────────┤
│ + send()                         │
│ + edit()                         │
│ + delete()                       │
│ + markAsRead()                   │
└──────────────────────────────────┘


┌──────────────────────────────────┐
│     ConversationParticipant      │
├──────────────────────────────────┤
│ - conversation_id: int           │
│ - user_id: int                   │
│ - joined_at: date                │
├──────────────────────────────────┤
│ + mute()                         │
│ + leave()                        │
└──────────────────────────────────┘
        ▲                       ▲
        │ N                     │ N
        └──────── User ─────────┘


┌──────────────────────────────────┐
│          Notification            │
├──────────────────────────────────┤
│ - id: int                        │
│ - user_id: int                   │
│ - type: string                   │
│ - notifiable_id: int             │
│ - notifiable_type: string        │
│ - read_at: date                  │
├──────────────────────────────────┤
│ + markAsRead()                   │
└──────────────────────────────────┘


┌──────────────────────────────────┐
│              Role                │
├──────────────────────────────────┤
│ - id: int                        │
│ - name: string                   │
│ - permissions: JSON              │
├──────────────────────────────────┤
│ + assignTo(User)                 │
└──────────────────────────────────┘
        ▲
        │ N : N (user_roles)
        ▼
┌──────────────────────────────────┐
│              User                │
└──────────────────────────────────┘
