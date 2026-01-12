import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            userData: {
                selected_brunch_id: null,
                token: "",
                user: null,
            },

            updateUserData: (user) => {
                set((state) => ({
                    userData: {
                        ...state.userData,
                        user: user,
                    },
                }))
            },
            login: (token, user, selected_brunch_id) => {
                set({
                    isAuthenticated: true,
                    userData: {
                        token,
                        user,
                        selected_brunch_id
                    },
                });
            },
            logout: () => {
                set({
                    isAuthenticated: false,
                    userData: {
                        token: "",
                        user: null,
                        selected_brunch_id: null
                    },
                });
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            // partialize: (state) => ({ token: state.token, user: state.user }), // what to persist
        }
    )
);

/* 
selected_brunch_id
: 
"2"
token
: 
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzUxNzM2NjI3LCJleHAiOjE3NTIzNDE0MjcsIm5iZiI6MTc1MTczNjYyNywianRpIjoiUWxHQnhLYWxvSmtIWVM4MiIsInN1YiI6IjEiLCJwcnYiOiJiODgwNWZkMjFkOTAwNWQ1YjFjMmJkOGZhZjNlZGIwOTEzMjJmMWRiIn0.prEcW34co6de07z4vVf7Dp_FZpm6Abq8PXhWiBr91ZY"
user
: 
brunch_id
: 
2
created_at
: 
"2025-07-05T14:30:00.000000Z"
delivery_areas_id
: 
null
email
: 
"vitabah@code-gmail.com"
id
: 
1
name
: 
"mahmoud"
orders
: 
0
otp
: 
null
phone
: 
null
pin
: 
"111111"
role
: 
"admin"
role_id
: 
1
status
: 
"active"
status_rider
: 
"Busy"
updated_at
: 
"2025-07-05T14:30:00.000000Z"
user_id
: 
2
user_type
: 
"qtap_clients"
*/