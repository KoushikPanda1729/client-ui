import { http, HttpResponse } from "msw";
import { mockAuthResponse, mockUsers } from "./data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  // User endpoints
  http.get(`${API_BASE_URL}/users`, () => {
    return HttpResponse.json(mockUsers);
  }),

  http.get(`${API_BASE_URL}/users/:id`, ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);
    if (user) {
      return HttpResponse.json(user);
    }
    return HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),
];
