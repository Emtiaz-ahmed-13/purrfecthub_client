# PurrfectHub API Documentation

## Overview
This document lists all the REST API endpoints available in the PurrfectHub system, categorized by their module.

**Base URL:** `/api/v1`

---

## 🔐 Auth & Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/refresh-token` | Refresh token |
| `POST` | `/auth/change-password` | Change password (Protected) |
| `GET` | `/users/me` | Get profile |
| `PATCH` | `/users/me` | Update profile |
| `GET` | `/users` | List all users (Admin) |
| `PATCH` | `/users/:id/status` | Update user status (Admin) |

---

## 🏠 Shelters (/api/v1/shelters)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/shelters` | List all shelters |
| `POST` | `/shelters/profile` | Create shelter profile (or POST /shelters/) |
| `GET` | `/shelters/me` | Get own shelter profile |
| `GET` | `/shelters/:id` | Get specific shelter |
| `GET` | `/shelters/nearby` | [NEW] Get nearby shelters |
| `PATCH` | `/shelters/profile` | Update shelter profile |
| `PATCH` | `/shelters/profile/location` | [NEW] Update shelter location |

---

## 🐱 Cats (/api/v1/cats)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/cats` | List all cats |
| `POST` | `/cats` | Create cat listing (Shelter) |
| `GET` | `/cats/shelter/my-cats` | Get shelter's cats |
| `GET` | `/cats/:id` | Get cat details |
| `PATCH` | `/cats/:id` | Update cat |
| `DELETE` | `/cats/:id` | Delete cat |

---

## 📝 Adoption System (/api/v1/adoptions)
*Note: Base path is /adoptions not /adoption*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/adoptions` | Submit application |
| `GET` | `/adoptions/my-applications` | User's applications |
| `GET` | `/adoptions/shelter-applications` | Shelter's received applications |
| `PATCH` | `/adoptions/:id/review` | Review application (Shelter) |
| `PATCH` | `/adoptions/:id/complete` | Complete adoption (Shelter) |
| `GET` | `/adoptions/:id` | Get specific adoption details |

---

## 🩺 Medical Records (/api/v1/medical)
*Note: Base path is /medical not /medical-records*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/medical/cats/:catId/records` | List records for a cat |
| `POST` | `/medical/cats/:catId/records` | Create record (Shelter) |
| `GET` | `/medical/records/:id` | Get specific record |
| `PATCH` | `/medical/records/:id` | Update record (Shelter) |
| `DELETE` | `/medical/records/:id` | Delete record (Shelter) |
| `GET` | `/medical/reminders` | [NEW] Get upcoming reminders |

---

## 💳 Donations (/api/v1/donations)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/donations` | Create donation |
| `POST` | `/donations/verify-payment` | Verify payment |
| `GET` | `/donations/my-donations` | User's history |
| `GET` | `/donations/shelter-donations` | Shelter's history |
| `GET` | `/donations/stats` | [NEW] Admin stats |

---

## 💬 Chat (/api/v1/chat)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/chat/conversations` | List conversations |
| `POST` | `/chat/conversations` | Start conversation |
| `GET` | `/chat/conversations/:id/messages` | Get messages |
| `GET` | `/chat/unread-count` | [NEW] Get unread count |
| `POST` | `/chat/conversations/:id/messages` | Send message |

---

## ⭐ Reviews (/api/v1/reviews)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reviews` | List all reviews (Approved) |
| `POST` | `/reviews` | Create review (Adopter/Shelter) |
| `GET` | `/reviews/stats` | Get review statistics |
| `GET` | `/reviews/:id` | Get specific review |
| `PATCH` | `/reviews/:id` | Update review |
| `DELETE` | `/reviews/:id` | Delete review |

